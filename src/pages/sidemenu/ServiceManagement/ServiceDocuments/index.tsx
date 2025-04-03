import { yupResolver } from "@hookform/resolvers/yup";
import { FileUploadOutlined } from "@mui/icons-material";
import {
	Box,
	Button,
	Grid2 as Grid,
	InputLabel,
	List,
	styled,
} from "@mui/material";
import { FileType, FileUploader, HorizontalFilePreview } from "@src/components";
import {
	deleteServiceRequestAttachment,
	getServiceRequestAttachments,
	postServiceRequestAttachmentData,
} from "@src/store/sidemenu/service_management/ServiceRequestAttachments/serviceRequestAttachments.action";
import { useServiceRequestAttachmentSelector } from "@src/store/sidemenu/service_management/ServiceRequestAttachments/serviceRequestAttachments.slice";
import { useAppDispatch } from "@src/store/store";
import React, { SyntheticEvent, useEffect, useMemo } from "react";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { useParams } from "react-router-dom";
import * as yup from "yup";

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "500px",
	marginTop: "0px",
	overflowY: "auto",
	padding: "0 8px",
	"&::-webkit-scrollbar": {
		width: "8px",
	},
	"&::-webkit-scrollbar-thumb": {
		backgroundColor: theme.palette.primary.main,
		borderRadius: "8px",
	},
}));

const ServiceDocuments = ({ selectedData }: { selectedData: any }) => {
	const dispatch = useAppDispatch();
	const ServiceDocumentSchema = yup.object().shape({});

	const {
		serviceRequestAttachment: { list, count, pageParams, loading },
	} = useServiceRequestAttachmentSelector();

	const {
		control,
		handleSubmit,
		reset,
		getValues,
		setValue,
		formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(ServiceDocumentSchema),
	});

	useMemo(() => {
		if (selectedData?.id !== "0") {
			dispatch(
				getServiceRequestAttachments({
					...pageParams,
					service_request: selectedData?.id ? selectedData?.id : "",
				})
			);
		}
	}, [selectedData?.id]);

	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

		dispatch(
			postServiceRequestAttachmentData({
				data: {
					service_request_id: selectedData?.id
						? selectedData?.id
						: "",
					file: files[0],
				},
				params: pageParams,
			})
		);
	};

	return (
		<Box>
			<Grid size={{ xs: 12 }}>
				<Box>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12 }}>
							<InputLabel
								sx={{
									".MuiInputLabel-asterisk": {
										color: "red",
									},
									mb: 1,
								}}
								id={"department"}
								required={true}
								style={{
									fontWeight: "medium",
								}}
							// error={fieldState.error != null}
							>
								Attachments
							</InputLabel>
							{/* <FileUploader
								name={"documents"}
								control={control}
								showPreview={false}
								text={"Select a file..."}
								icon={LuPlus}
								iconSize={20}
								selectedFiles={list ? list : []}
								handleAcceptedFiles={handleAcceptedFiles}
							/> */}

							<Dropzone
								onDrop={(acceptedFiles) => {
									handleAcceptedFiles(
										acceptedFiles,
										() => { }
									);
								}}>
								{({ getRootProps, getInputProps }) => (
									<Box>
										<Box className="fallback">
											<input
												{...getInputProps()}
												name="file"
												type="file"
												multiple
											/>
										</Box>
										{/* <div
											className="dz-message needsclick"
											{...getRootProps()}>
											<Button
												variant="contained"
												startIcon={
													<FileUploadOutlined />
												}
												sx={{
													bgcolor: "purple",
													"&:hover": {
														bgcolor: "darkviolet",
													},
													fontWeight: 600,
													textTransform: "none",
												}}>
												Select File
											</Button>
										</div> */}
									</Box>
								)}
							</Dropzone>
						</Grid>

						<Grid size={{ xs: 12 }}>
							{/* <Stack spacing={1}> */}
							<ScrollableList
								onScroll={(e: SyntheticEvent) => {
									const { target } = e as any;
									if (
										Math.ceil(
											target?.scrollTop +
											target?.offsetHeight
										) == target?.scrollHeight
									) {
										if (
											pageParams.page <
											pageParams.no_of_pages
										) {
											dispatch(
												getServiceRequestAttachments({
													...pageParams,
													page: pageParams?.page + 1,
													page_size: 10,
												})
											);
										}
									}
								}}>
								{list?.length != 0 &&
									list?.map((document) => {
										return (
											document?.path && (
												<HorizontalFilePreview
													removeDocument={true}
													file={document}
													attachments={list}
													setAttachments={() => {
														dispatch(
															deleteServiceRequestAttachment(
																{
																	id: document?.id
																		? document?.id
																		: "",
																	params: pageParams,
																}
															)
														);
													}}
												/>
											)
										);
									})}
							</ScrollableList>
							{/* </Stack> */}
						</Grid>
					</Grid>
				</Box>
			</Grid>
		</Box>
	);
};

export default ServiceDocuments;
