import { yupResolver } from "@hookform/resolvers/yup";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Grid2 as Grid,
	Stack,
	InputLabel,
	Box,
	Tooltip,
	Zoom,
	Typography,
	Avatar,
	styled,
	List,
	FormHelperText,
} from "@mui/material";
import { CustomDatepicker, FileType } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import {
	getMiniDepartments,
	getMiniLocation,
} from "@src/store/mini/mini.Action";
import {
	clearMiniDepartments,
	clearMiniLocation,
} from "@src/store/mini/mini.Slice";
import { miniType } from "@src/store/mini/mini.Types";
import {
	editServiceRequestData,
	postServiceRequestData,
} from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.action";
import {
	useServiceRequestSelector,
	setSelectedData,
	isModalOpen,
	setUploadDocument,
} from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.slice";
import { useAppDispatch } from "@src/store/store";
import moment from "moment";
import { useForm } from "react-hook-form";
import { LuFile, LuInfo, LuX } from "react-icons/lu";
import * as yup from "yup";
import ServiceDocuments from "../ServiceDocuments";
import { FileUploadOutlined } from "@mui/icons-material";
import Dropzone from "react-dropzone";
import { deleteServiceRequestAttachment, postServiceRequestAttachmentData } from "@src/store/sidemenu/service_management/ServiceRequestAttachments/serviceRequestAttachments.action";
import { useEffect } from "react";
import { useServiceRequestAttachmentSelector } from "@src/store/sidemenu/service_management/ServiceRequestAttachments/serviceRequestAttachments.slice";

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

export const HorizontalFilePreview = ({
	file,
	key,
	attachments,
	setAttachments,
}: {
	file: any;
	key: number;
	attachments: { id: string }[];
	setAttachments: (params: any[]) => void;
}) => {
	const dispatch = useAppDispatch();
	const {
		serviceRequestAttachment: { list, count, pageParams, loading },
	} = useServiceRequestAttachmentSelector();


	function handleDismiss() {
		const filter = attachments?.filter((e) => e?.id != file?.id);
		dispatch(setUploadDocument(filter));
		dispatch(
			deleteServiceRequestAttachment(
				{
					id: file?.id
						? file.id
						: "",
					params: pageParams,
				}
			)
		);
	}

	return (
		<Box mt={2}
			id={file.name}
			sx={{
				border: "1px solid",
				borderColor: "divider",
				borderRadius: "6px",
				p: "12px",
				display: "flex",
			}}>
			<Typography
				sx={{ display: "flex", alignItems: "center", gap: "12px" }}
				component={"a"}
				target="_blank"
				href={file?.preview}>
				{file.preview ? (
					<Avatar
						variant="rounded"
						sx={{
							height: "48px",
							width: "48px",
							bgcolor: "white",
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
						{file?.path ? file.path : file?.file?.split("service_request_attachments/")[1]}
					</Typography>
					<Typography component={"p"} color={"grey.700"}>
						{file.formattedSize}
					</Typography>
				</Box>
			</Typography>
			<IconButton sx={{ marginLeft: "auto", my: "auto" }}>
				<LuX size={18} onClick={() => handleDismiss()} />
			</IconButton>
		</Box>
	);
};

const AddServiceRequest = () => {
	const dispatch = useAppDispatch();

	const {
		serviceRequest: { isModalVisible: open, selectedData, pageParams, uploadDocuments },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniDepartments,
		},
	} = useServiceRequestSelector();

	const priority_options: {
		id: string | number;
		name: string;
	}[] = [
			{
				name: "Low",
				id: 1,
			},
			{
				name: "Moderate",
				id: 2,
			},
			{
				name: "Urgent",
				id: 3,
			},
			{
				name: "Very Urgent",
				id: 4,
			},
		];

	const closeModal = () => {
		dispatch(isModalOpen(false));
		dispatch(setSelectedData({}));
		dispatch(setUploadDocument([]));
		reset({
			due_date: "",
			description: "",
			location: null,
			priority: "",
			department: null,
		});
	};
	useEffect(() => {
		if (selectedData?.documents != undefined) {
			dispatch(setUploadDocument(selectedData?.documents));
		}
	}, [selectedData?.documents]);
	const ServiceRequestSchema = yup.object().shape({
		due_date: yup.string().required("Please select a due date"),
		location: yup
		.object({
			label: yup.string().required("Please select a location"),
			value: yup.string().required("Please select a location"),
		})
		.required("Please select a location"),
		department: yup
		.object({
			label: yup.string().required("Please select a department"),
			value: yup.string().required("Please select a department"),
		})
		.required("Please select a department"),
		priority: yup
		.object({
			label: yup.string().required("Please select a priority"),
			value: yup.string().required("Please select a priority"),
		})
		.required("Please select a priority"),
		description: yup.string().required("Please select a description"),
	});

	const {
		control,
		handleSubmit,
		reset,
		getValues,
		//formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(ServiceRequestSchema),
		values: {
			due_date:
				moment(selectedData?.due_date, "DD-MM-YYYY").toISOString() ||
				"",
			description: selectedData?.description || "",
			location: selectedData?.location?.id
				? {
					label: selectedData?.location?.name,
					value: selectedData?.location?.id,
				}
				: null,
			file: selectedData?.documents
				? selectedData?.documents
				: "",
			department: selectedData?.department?.id
				? {
					label: selectedData?.department?.name,
					value: selectedData?.department?.id,
				}
				: null,
			priority: selectedData?.priority
				? {
					label: selectedData?.priority_name,
					value: selectedData?.priority,
				}
				: null,
		},
	});

	const handleAdd = (payload: {
		due_date: string;
		description: string;
		location: {
			label: string;
			value: string;
		} | null;
		department: {
			label: string;
			value: string;
		} | null;
		priority: {
			label: string;
			value: number;
		} | null;
	}) => {

		const document = uploadDocuments?.length
			? uploadDocuments.map((e: any) => e.originalObj)
			: [];

		const data = {
			due_date: payload?.due_date
				? moment(payload?.due_date).format("YYYY-MM-DD")
				: "",
			description: payload.description,
			location_id: payload?.location?.value
				? payload?.location?.value
				: "",
			department_id: payload?.department?.value
				? payload?.department?.value
				: "",
			priority: payload?.priority?.value,
		};

		!selectedData?.id
			? dispatch(
				postServiceRequestData({
					data,
					params: pageParams,
					document,
					hide: () => {
						closeModal();
					},
				})
			)
			: dispatch(
				editServiceRequestData({
					id: selectedData?.id,
					data,
					params: pageParams,
					document,
					hide: () => {
						closeModal();
					},
				})
			);
	};

	const getValuesLocation = getValues("location");
	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

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
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);
		const documents = [...(uploadDocuments || []), modifiedFiles[0]];

		dispatch(setUploadDocument(documents));

		dispatch(
			setSelectedData({
				...selectedData,
				file: documents,
			})
		);
	};
	const setAttachments = (payload: Array<any>) => {
		dispatch(
			setSelectedData({
				...selectedData,
				file: payload[0],
			})
		);
	};

	return (
		<Dialog
			open={open}
			onClose={() => {
				closeModal();
			}}
			sx={{
				"& .MuiDialog-paper": {
					width: "800px",
				},
			}}
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
				{selectedData?.id
					? "Update Service Request"
					: "Add Service Request"}
				<IconButton
					onClick={() => {
						closeModal();
					}}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
				<DialogContentText id="alert-dialog-description">
					<form style={{ width: "100%" }}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 6 }} mt={1}>
								<SelectComponent
									required
									name="location"
									label="Location"
									multiple={false}
									control={control}
									rules={{ required: true }}
									options={miniLocationList.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									onChange={(value)=>{
										reset({
											due_date: "",
											description: "",
											location: value,
											priority: "",
											department: null,
										});
									}}
									loading={miniLocationLoading}
									selectParams={{
										page: miniLocationParams.page,
										page_size: miniLocationParams.page_size,
										search: miniLocationParams.search,
										no_of_pages:
											miniLocationParams.no_of_pages,
									}}
									hasMore={
										miniLocationParams.page <
										miniLocationParams.no_of_pages
									}
									fetchapi={getMiniLocation}
									clearData={clearMiniLocation}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack direction={"row"} alignItems={"center"}>
									<InputLabel
										sx={{
											".MuiInputLabel-asterisk": {
												color: "red",
											},
										}}
										id={"department"}
										required={true}
										style={{
											fontWeight: "medium",
										}}
									// error={fieldState.error != null}
									>
										Department
									</InputLabel>
									<Tooltip
										TransitionComponent={Zoom}
										title="Select a location before selecting a department">
										<IconButton
											size="small"
											sx={{
												cursor: "pointer",
											}}>
											<LuInfo color="#3e60d5" />
										</IconButton>
									</Tooltip>
								</Stack>
								<SelectComponent
									name="department"
									label=""
									multiple={false}
									control={control}
									rules={{ required: true }}
									options={miniDepartments?.list?.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									disabled={!getValuesLocation?.value}
									loading={miniDepartments?.loading}
									selectParams={{
										page: miniDepartments?.miniParams?.page,
										page_size:
											miniDepartments?.miniParams
												?.page_size,
										search: miniDepartments?.miniParams
											?.search,
										no_of_pages:
											miniDepartments?.miniParams
												?.no_of_pages,
										location: getValuesLocation?.value,
									}}
									hasMore={
										miniDepartments?.miniParams?.page <
										miniDepartments?.miniParams?.no_of_pages
									}
									fetchapi={getMiniDepartments}
									clearData={clearMiniDepartments}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack flex={1}>
									<CustomDatepicker
										required
										control={control}
										name="due_date"
										hideAddon
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										inputClass="form-input"
										minDate={new Date()}
										label={"Due Date"}
										tI={1}
									/>
								</Stack>
							</Grid>

							<Grid size={{ xs: 12, md: 6 }}>
								<SelectComponent
									name="priority"
									label="Priority"
									multiple={false}
									control={control}
									rules={{ required: true }}
									options={priority_options}
								/>
							</Grid>
							<Grid size={{ xs: 12 }}>
								<TextArea
									required
									name="description"
									label="Description"
									type="text"
									placeholder="Write description here..."
									minRows={3}
									maxRows={5}
									containerSx={{
										display: "grid",
										gap: 1,
									}}
									control={control}
								/>
							</Grid>
							<Grid size={{ xs: 4 }}>

								<Dropzone
									onDrop={(acceptedFiles) => {
										handleAcceptedFiles(
											acceptedFiles,
											() => { }
										);
									}}>
									{({
										getRootProps,
										getInputProps,
									}) => (
										<Box>
											<Box className="fallback">
												<input
													{...getInputProps()}
													name="file"
													type="file"
													multiple
												/>
											</Box>
											<div
												className="dz-message needsclick"
												{...getRootProps()}>
												<Button
													variant="contained"
													startIcon={
														<FileUploadOutlined />
													}
													sx={{
														fontWeight: 600,
														textTransform:
															"none",
													}}>
													Upload
												</Button>
											</div>
										</Box>
									)}
								</Dropzone>
							</Grid>
							<Grid size={{ xs: 12 }}>
								{uploadDocuments &&
									uploadDocuments?.map((val: any, index: number) => (
										<HorizontalFilePreview
											key={index}
											file={val}
											attachments={uploadDocuments}
											setAttachments={setAttachments}
										/>
									))
								}

							</Grid>
						</Grid>
					</form>
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button
					onClick={() => closeModal()}
					variant="outlined"
					color="secondary">
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit(handleAdd as any)}
					color="primary"
					autoFocus>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddServiceRequest;
