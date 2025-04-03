import { yupResolver } from "@hookform/resolvers/yup";
import {
	Avatar,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormLabel,
	Grid2 as Grid,
	IconButton,
	InputLabel,
	List,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import { FileType, FormInput, FileUploader, RadioGroup } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniDocuments } from "@src/store/mini/mini.Action";
import { clearMiniDocuments } from "@src/store/mini/mini.Slice";
import { v4 as uuidv4 } from "uuid";
import {
	editDocument,
	postDocuments,
} from "@src/store/sidemenu/tender_mangement/document/document.action";
import {
	addNewDocument,
	selectDocument,
	setAttachments,
	setSelectedData,
} from "@src/store/sidemenu/tender_mangement/document/document.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuFile, LuPlus, LuX } from "react-icons/lu";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { fetchNotificationList } from "@src/store/notifications/notification.actions";

interface Props {
	open: boolean;
	hide: () => void;
}
const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "200px",
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
const HorizontalFilePreview = ({ file }: { file: FileType }) => {
	const dispatch = useAppDispatch();
	const {
		document: { attachments },
		system: { userAccessList },
	} = useAppSelector((state) => selectDocument(state));
	function handleDismiss() {
		const filter = !file?.id
			? attachments?.filter((e) => e.uuid != file.uuid)
			: attachments?.map((e) =>
				e.id == file.id ? { ...e, dodelete: true } : e
			);
		dispatch(setAttachments(filter));
	}
	let fileName = "";
	if (!file?.path) return "";

	const dotIndex = file?.path.lastIndexOf(".");
	const baseName =
		dotIndex > 0 ? file?.path?.substring(0, dotIndex) : file?.path;

	fileName =
		baseName.length > 15 ? baseName.substring(0, 15) + "..." : baseName;

	return (
		<Box
			id={file.name}
			sx={{
				border: "1px solid",
				borderColor: "divider",
				borderRadius: "6px",
				display: "flex",
			}} mt={1}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					p: "12px",
					gap: "12px",
					cursor: "pointer",
					height: "100%",
					width: "100%",
				}}
				onClick={(e) => {
					window.open(file.preview);
				}}>
				{file.preview ? (
					<Avatar
						variant="rounded"
						sx={{
							height: "48px",
							width: "48px",
							bgcolor: "grey",
							objectFit: "cover",
						}}
						alt={file.path}
						src={file.preview}
					/>
				) : (
					<Typography
						component={"span"}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "primary.main",
							fontWeight: 600,
							borderRadius: "6px",
							height: "48px",
							width: "48px",
							bgcolor: "#3e60d51a",
						}}>
						<LuFile />
					</Typography>
				)}
				<Box>
					<Typography sx={{ fontWeight: 600, color: "grey.700" }}>
						{fileName}
					</Typography>
					<Typography component={"p"} color={"grey.700"}>
						{file.formattedSize}
					</Typography>
				</Box>
			</Box>
			<IconButton sx={{ marginLeft: "auto", my: "auto" }}>
				<LuX size={18} onClick={() => handleDismiss()} />
			</IconButton>
		</Box>
	);
};
const AddDocument = ({ open, hide }: Props) => {
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const {
		document: { tenderDocuments, pageParams, selectedData, documentList, attachments },
		mini: { miniDocuments },
		system: { userAccessList },
	} = useAppSelector((state) => selectDocument(state));

	const [type, setType] = useState("");

	const DocumentSchema = yup.object().shape({
		type: yup.number().required("Document Type is required"),
		document: yup
			.object()
			.when("type", (type, schema) => {
				if (type[0] === 1) {
					return schema.required("Document is required");
				}
				return schema.nullable();
			})
			.nullable(),
		document_name: yup.string().when("type", (type, schema) => {
			if (type[0] === 2) {
				return schema.required("Document name is required");
			}
			return schema.nullable();
		}),
		is_submitted: yup
			.mixed()
			.required("Document submitted status is required")
			.nullable(),
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
		setValue,
	} = useForm({
		resolver: yupResolver(DocumentSchema),
	});

	const formData = getValues();

	useEffect(() => {
		if (selectedData?.id) {
			reset({
				type: selectedData?.type,
				document_name: selectedData?.document_name,
				document: {
					label: selectedData?.document?.name,
					value: selectedData?.document?.id,
				},
				is_submitted: {
					label: selectedData?.is_submitted ? "Yes" : "No",
					value: selectedData?.is_submitted,
				},
			});
		}
		setType("")
	}, [selectedData]);

	const clearData = () => {
		reset({
			type: 0,
			document_name: "",
			document: null,
			is_submitted: null,
		});
		hide();
		dispatch(setAttachments([]));
		dispatch(setSelectedData({}));
	};

	const handleAdd = ({
		document_name,
		type,
		document,
		is_submitted,
	}: {
		document_name: string;
		type: number;
		document: {
			label: string;
			value: string;
		};
		is_submitted: {
			label: string;
			value: boolean;
		};
	}) => {
		const data = {
			tender_id: id,
			type: type,
			document_name,
			document_id: document?.value,
			is_submitted: is_submitted?.value,
			file: attachments[0].originalObj
		};
		if (!selectedData?.id) {
			dispatch(
				postDocuments({
					data,
					params: pageParams,
					clearData,

				})
			);
		} else {
			dispatch(
				editDocument({
					id: selectedData?.id,
					data,
					params: pageParams,
					clearData
				})
			);
		}
		dispatch(
			fetchNotificationList({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
	};

	const types = [
		{
			value: 1,
			label: "Common",
		},
		{
			value: 2,
			label: "Individual",
		},
	];

	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

		/**
		 * Formats the size
		 */
		const formatBytes = (bytes: number, decimals: number = 2) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = [
				"Bytes",
				"KB",
				"MB",
				"GB",
				"TB",
				"PB",
				"EB",
				"ZB",
				"YB",
			];

			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return (
				parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
				" " +
				sizes[i]
			);
		};

		// Creating a new array with the modified files
		const modifiedFiles = files.map((file) =>
			Object.assign({}, file, {
				originalObj: file,
				uuid: uuidv4(),
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);

		dispatch(setAttachments(modifiedFiles));
	};


	return (
		<Dialog
			open={open}
			onClose={clearData}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle
				sx={{
					bgcolor: "primary.main",
					color: "white",
					p: 1,
					px: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
				variant="h4"
				id="alert-dialog-title">
				{"Create a document"}
				<IconButton onClick={clearData}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
				<DialogContentText
					id="alert-dialog-description"
					sx={{
						width: 500,
					}}>
					<form style={{ width: "100%" }}>
						<Grid container spacing={2}>
							<Grid
								size={{
									xs: 12,
								}}>
								<Stack
									direction="row"
									alignItems={"center"}
									textAlign={"center"}
									spacing={2}>
									<InputLabel
										htmlFor={"type"}
										style={{
											fontWeight: "medium",
											fontSize: "14px",
										}}
										error={errors.type != null}>
										Document Type:
									</InputLabel>
									<RadioGroup
										control={control}
										name="type"
										label=""
										options={types}
										row
										onChange={(event) => {
											console.log("value", event?.target?.value)
											setType(event?.target?.value)
											setValue("document_name", "");
											setValue("document", null);
											setValue("is_submitted", null);
										}}
									/>
								</Stack>
							</Grid>
							{type == "1" && (
								<>
									<Grid
										size={{
											xs: 12, md: 8
										}}>
										<Stack
											direction="row"
											alignItems={"center"}
											spacing={2}>
											<InputLabel
												htmlFor={"type"}
												style={{
													fontWeight: "medium",

													textWrap: "nowrap",
												}}>
												Document Name:
											</InputLabel>
											<Stack flex={1}>
												<SelectComponent
													name="document"
													label=""
													placeholder="Select a document"
													control={control}
													rules={{ required: true }}
													options={miniDocuments.list
														.filter(
															(e: {
																id:
																| string
																| number;
																name: string;
															}) =>
																!documentList.some(
																	(doc) =>
																		doc
																			?.document
																			?.id ==
																		e?.id
																)
														)
														.map(
															(e: {
																id:
																| string
																| number;
																name: string;
															}) => ({
																id: e.id,
																name: e.name,
															})
														)}
													loading={
														miniDocuments.loading
													}
													selectParams={{
														page: miniDocuments
															.miniParams.page,
														page_size:
															miniDocuments
																.miniParams
																.page_size,
														search: miniDocuments
															.miniParams.search,
														no_of_pages:
															miniDocuments
																.miniParams
																.no_of_pages,
													}}
													hasMore={
														miniDocuments.miniParams
															.page <
														miniDocuments.miniParams
															.no_of_pages
													}
													fetchapi={getMiniDocuments}
													clearData={
														clearMiniDocuments
													}
												/>
											</Stack>
										</Stack>
									</Grid>
									<Grid
										size={{
											xs: 12, md: 8
										}}>
										<Stack
											direction="row"
											alignItems={"center"}
											spacing={2}>
											<InputLabel
												htmlFor={"type"}
												style={{
													fontWeight: "medium",

													textWrap: "nowrap",
												}}>
												Submitted Status:
											</InputLabel>
											<Stack flex={1}>
												<SelectComponent
													name="is_submitted"
													label=""
													control={control}
													rules={{ required: true }}
													placeholder="Document submitted status"
													options={[
														{
															name: "Yes",
															id: true,
														},
														{
															name: "No",
															id: false,
														},
													]}
												/>
											</Stack>
										</Stack>
									</Grid>
								</>
							)}
							{type == "2" && (
								<>
									<Grid
										size={{
											xs: 12, md: 8
										}}>
										<Stack
											direction="row"
											alignItems={"center"}
											spacing={2}>
											<InputLabel
												htmlFor={"type"}
												style={{
													fontWeight: "medium",

													textWrap: "nowrap",
												}}>
												Document Name:
											</InputLabel>
											<Stack flex={1}>
												<FormInput
													name="document_name"
													label=""
													type="text"
													placeholder="Enter document name here..."
													control={control}
												/>
											</Stack>
										</Stack>
									</Grid>
									<Grid
										size={{
											xs: 12, md: 8
										}}>
										<Stack
											direction="row"
											alignItems={"center"}
											spacing={2}>
											<InputLabel
												htmlFor={"type"}
												style={{
													fontWeight: "medium",

													textWrap: "nowrap",
												}}>
												Submitted Status:
											</InputLabel>
											<Stack flex={1}>
												<SelectComponent
													name="is_submitted"
													label=""
													control={control}
													rules={{ required: true }}
													placeholder="Document submitted status"
													options={[
														{
															name: "Yes",
															id: true,
														},
														{
															name: "No",
															id: false,
														},
													]}
												/>
											</Stack>
										</Stack>
									</Grid>
								</>
							)}

						</Grid>
						{attachments?.length == 0 &&
							<FileUploader
								label="Documents"
								name={"documents"}
								control={control}
								showPreview={false}
								text={"Attach a document"}
								icon={LuPlus}
								iconSize={20}
								selectedFiles={
									attachments
										? attachments
										: []
								}
								handleAcceptedFiles={
									handleAcceptedFiles
								}
							/>
						}
						<ScrollableList>
							{attachments && attachments?.length > 0 &&
								attachments?.map(
									(document) => {
										if (!document?.dodelete)
											return (
												document?.path && (
													<HorizontalFilePreview
														file={
															document
														}
													/>
												)
											);
									}
								)}
						</ScrollableList>
					</form>
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button
					onClick={clearData}
					variant="outlined"
					color="secondary">
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit(handleAdd as any)}
					type="submit"
					color="primary"
					autoFocus>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddDocument;
