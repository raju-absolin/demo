import { yupResolver } from "@hookform/resolvers/yup";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Dialog,
	Divider,
	FormLabel,
	IconButton,
	InputAdornment,
	InputLabel,
	List,
	MenuItem,
	OutlinedInput,
	Paper,
	Stack,
	TextField,
	Typography,
	styled,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
	CheckboxInput,
	ComponentContainerCard,
	CustomDatepicker,
	FileType,
	FileUploader,
	FormInput,
	PasswordInput,
	SelectInput,
} from "@src/components";
import GoBack from "@src/components/GoBack";
import React, {
	ChangeEvent,
	SyntheticEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Control, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	clearProfileData,
	clearprofileParams,
	selectManageGroups,
} from "@src/store/settings/manageGroups/manage_groups.slice";
import {
	getPermissionsList,
	getProfileList,
} from "@src/store/settings/manageGroups/manage_groups.action";
import { CustomModal, CustomModalProps } from "@src/components/Modal";

import Swal from "sweetalert2";
import {
	LuBook,
	LuDelete,
	LuFile,
	LuLoader,
	LuPlus,
	LuSave,
	LuUpload,
	LuX,
} from "react-icons/lu";
import {
	clearUserData,
	selectManageUsers,
} from "@src/store/settings/manageUsers/manage_users.slice";
import {
	clearMiniCompany,
	clearMiniCustomers,
	clearMiniDepartments,
	clearMiniLeads,
	clearMiniLocation,
	clearMiniProjects,
	clearMiniTenderMasterItems,
	clearMiniUsers,
	clearTenderNature,
	miniSelector,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniCompany,
	getMiniCustomers,
	getMiniDepartments,
	getMiniLeads,
	getMiniLocation,
	getMiniProjects,
	getMiniTenderMasterItems,
	getMiniTenderNature,
	getMiniUsers,
} from "@src/store/mini/mini.Action";
import {
	editMangeUsersDataById,
	getUserById,
	postMangeUsersData,
} from "@src/store/settings/manageUsers/manage_users.action";
import {
	selectTenders,
	setSelectedData,
	setTenderMasterItemModalOpen,
	setUploadDocument,
	setExtractedData,
} from "@src/store/sidemenu/tender_mangement/tenders/tenders.slice";
import { setSelectedData as setTenderItemMasterSelectedData } from "@src/store/sidemenu/tender_mangement/tenderitems/tenderItems.slice";
import {
	editTender,
	getTenderById,
	postPdfUpload,
	postTender,
	postTenderDocuments,
	postTenderJsonData,
} from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import Dropzone, { useDropzone } from "react-dropzone";
import AddBidItem from "../TenderItems/TenderItem.add";
import { getComments } from "@src/store/sidemenu/tender_mangement/comments/commets.action";
import TextArea from "@src/components/form/TextArea";
import { v4 as uuidv4 } from "uuid";
import { TenderItem } from "@src/store/sidemenu/tender_mangement/tenderitems/tenderItems.types";
import { fetchNotificationList } from "@src/store/notifications/notification.actions";

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

const Loader = styled(CircularProgress)(({ theme }) => ({
	display: "block",
	margin: "20px auto",
}));

const AddItemForm = ({ control, handleSubmit, reset }: any) => {
	const dispatch = useAppDispatch();
	const {
		tenders: { selectedData, pageParams },
		mini: { miniTenderMasterItems },
	} = useAppSelector((state) => selectTenders(state));

	const handleAddItem = (payload: any) => {
		const findItem: TenderItem | undefined =
			selectedData?.tender_items?.find(
				(item) =>
					item?.tenderitemmaster?.value ==
					payload?.tender_items?.value
			);

		const addData = () => {
			const data = {
				tenderitemmaster: payload.tender_items,
				quantity: payload.quantity,
				dodelete: false,
			};
			dispatch(
				setSelectedData({
					...selectedData,
					tender_items: [
						...(selectedData?.tender_items || []), // Ensure tender_items is an array
						{
							...data,
						},
					],
				})
			);
		};
		if (findItem) {
			if (findItem?.dodelete) {
				addData();
			} else {
				Swal.fire({
					title: `<p style="font-size:20px">Item Already Exist</p>`,
					text: "To change the quantity of an item, please delete it first and then add it again with the updated quantity.",
					icon: "warning",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}
		} else {
			addData();
		}
		reset({
			tender_items: null,
			quantity: "",
		});
	};

	return (
		<Box mt={2}>
			<form action="" onSubmit={handleSubmit(handleAddItem)}>
				<Grid container spacing={2}>
					<Grid
						size={{ xs: 12, md: 6, lg: 3 }}
						sx={{
							position: "relative",
						}}>
						<SelectComponent
							name="tender_items"
							label="Bid Items"
							control={control}
							rules={{ required: true }}
							options={miniTenderMasterItems.list.map(
								(e: { id: string | number; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							dropDownPositoning="absolute"
							loading={miniTenderMasterItems.loading}
							selectParams={{
								page: miniTenderMasterItems.miniParams.page,
								page_size:
									miniTenderMasterItems.miniParams.page_size,
								search: miniTenderMasterItems.miniParams.search,
								no_of_pages:
									miniTenderMasterItems.miniParams
										.no_of_pages,
							}}
							hasMore={
								miniTenderMasterItems.miniParams.page <
								miniTenderMasterItems.miniParams.no_of_pages
							}
							fetchapi={getMiniTenderMasterItems}
							clearData={clearMiniTenderMasterItems}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="quantity"
							label="Quantity"
							type="number"
							placeholder="Enter quantity here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={3.3}>
						<Button
							color="primary"
							type="submit"
							variant="contained"
							size="large">
							Add Item
						</Button>
					</Grid>
				</Grid>
			</form>
		</Box>
	);
};

const HorizontalFilePreview = ({ file }: { file: FileType }) => {
	const dispatch = useAppDispatch();
	const {
		tenders: { uploadDocuments },
	} = useAppSelector((state) => selectTenders(state));
	function handleDismiss() {
		const filter = !file?.id
			? uploadDocuments?.filter((e) => e.uuid != file.uuid)
			: uploadDocuments?.map((e) =>
					e.id == file.id ? { ...e, dodelete: true } : e
				);
		dispatch(setUploadDocument(filter));
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
			}}
			mt={1}>
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

const TenderForm = ({
	onSave,
	handleSubmit,
	register,
	control,
	// errors,
}: {
	onSave: (value: any) => void;
	handleSubmit: any;
	register: any;
	// errors: any;
	control: Control<any>;
}) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const {
		tenders: {
			selectedData,
			pageParams,
			uploadDocuments,
			document_loading,
		},
		mini: {
			miniProject,
			miniUserList,
			miniUserParams,
			miniUserLoading,
			miniTenderNature,
			miniCustomers,
			miniDepartments,
			miniCompany,
			miniLeads,
			miniTenderMasterItems,
		},
	} = useAppSelector((state) => selectTenders(state));

	const tender_types: { id: string | number; name: string }[] = [
		{ id: 1, name: "Open" },
		{ id: 2, name: "Limited" },
		{ id: 3, name: "SBC" },
	];

	const project_types: { id: string | number; name: string }[] = [
		{
			id: 1,
			name: "Supply",
		},
		{
			id: 2,
			name: "Service",
		},
		{
			id: 3,
			name: "Both",
		},
	];
	const status: { id: boolean; name: string }[] = [
		{
			id: true,
			name: "Yes",
		},
		{
			id: false,
			name: "No",
		},
	];

	// dropzone

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

		const documents = [...(uploadDocuments || []), modifiedFiles[0]];

		dispatch(setUploadDocument(documents));
	};

	return (
		<Grid size={{ xs: 12 }}>
			<form
				style={{ width: "100%" }}
				onSubmit={handleSubmit(onSave as any)}>
				<Box p={1}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required={true}
								name="lead"
								label="Lead"
								control={control}
								rules={{ required: true }}
								options={miniLeads.list.map(
									(e: {
										id: string | number;
										name: string;
									}) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={miniLeads.loading}
								selectParams={{
									page: miniLeads.miniParams.page,
									page_size: miniLeads.miniParams.page_size,
									search: miniLeads.miniParams.search,
									no_of_pages:
										miniLeads.miniParams.no_of_pages,
								}}
								hasMore={
									miniLeads.miniParams.page <
									miniLeads.miniParams.no_of_pages
								}
								fetchapi={getMiniLeads}
								clearData={clearMiniLeads}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								required={true}
								name="tender_no"
								label="Bid No"
								type="text"
								placeholder="Enter bid number here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								required
								name="name"
								label="Bid Name"
								type="text"
								placeholder="Enter name here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required={true}
								name="tender_type"
								label="Bid Type"
								control={control}
								rules={{ required: true }}
								options={tender_types}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required={true}
								name="product_type"
								label="Product Type"
								control={control}
								rules={{ required: true }}
								options={project_types}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required={true}
								name="company"
								label="Company"
								control={control}
								rules={{ required: true }}
								options={miniCompany.list.map(
									(e: {
										id: string | number;
										name: string;
									}) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={miniCompany.loading}
								selectParams={{
									page: miniCompany.miniParams.page,
									page_size: miniCompany.miniParams.page_size,
									search: miniCompany.miniParams.search,
									no_of_pages:
										miniCompany.miniParams.no_of_pages,
								}}
								hasMore={
									miniCompany.miniParams.page <
									miniCompany.miniParams.no_of_pages
								}
								fetchapi={getMiniCompany}
								clearData={clearMiniCompany}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								required={true}
								name="department"
								label="Department Name"
								type="text"
								placeholder="Enter department name here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required={true}
								name="sourceportal"
								label="Source Portal"
								control={control}
								rules={{ required: true }}
								options={miniTenderNature?.list.map(
									(e: {
										id: string | number;
										name: string;
									}) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={miniTenderNature.loading}
								selectParams={{
									page: miniTenderNature.miniParams.page,
									page_size:
										miniTenderNature.miniParams.page_size,
									search: miniTenderNature.miniParams.search,
									no_of_pages:
										miniTenderNature.miniParams.no_of_pages,
								}}
								hasMore={
									miniTenderNature.miniParams.page <
									miniTenderNature.miniParams.no_of_pages
								}
								fetchapi={getMiniTenderNature}
								clearData={clearTenderNature}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required={true}
								name="customer"
								label="Customer"
								control={control}
								rules={{ required: true }}
								options={miniCustomers.list.map(
									(e: { id: string; name: string }) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={miniCustomers.loading}
								selectParams={{
									page: miniCustomers.miniParams.page,
									page_size:
										miniCustomers.miniParams.page_size,
									search: miniCustomers.miniParams.search,
									no_of_pages:
										miniCustomers.miniParams.no_of_pages,
								}}
								hasMore={
									miniCustomers.miniParams.page <
									miniCustomers.miniParams.no_of_pages
								}
								fetchapi={getMiniCustomers}
								clearData={clearMiniCustomers}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required={true}
								name="is_reverse_auction"
								label="Reverse Auction"
								control={control}
								rules={{ required: true }}
								options={[
									{
										id: true,
										name: "Yes",
									},
									{
										id: false,
										name: "No",
									},
								]}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Stack flex={1}>
								<CustomDatepicker
									required={true}
									control={control}
									name="tender_open_datetime"
									hideAddon
									dateFormat="DD-MM-YYYY hh:mm a"
									showTimeSelect
									timeFormat="h:mm a"
									timeCaption="time"
									inputClass="form-input"
									minDate={new Date()}
									label={"Bid Open Date & Time"}
									tI={1}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Stack flex={1}>
								<CustomDatepicker
									required={true}
									control={control}
									name="tender_datetime"
									hideAddon
									dateFormat="DD-MM-YYYY hh:mm a"
									showTimeSelect
									timeFormat="h:mm a"
									timeCaption="time"
									inputClass="form-input"
									minDate={new Date()}
									label={"Bid End Date & Time"}
									tI={1}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Stack flex={1}>
								<CustomDatepicker
									required={true}
									control={control}
									name="tender_extension_datetime"
									hideAddon
									dateFormat="DD-MM-YYYY hh:mm a"
									showTimeSelect
									timeFormat="h:mm a"
									timeCaption="time"
									inputClass="form-input"
									minDate={new Date()}
									label={"Bid Extension Date & Time"}
									tI={1}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								required={true}
								name="ministry"
								label="Ministry / State"
								type="text"
								placeholder="Enter ministry/state here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								required={true}
								name="annual_turnover"
								label="Minimun Average Annual Turn Over"
								type="text"
								placeholder="Enter average annual turnover here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								required={true}
								name="years_of_experiance"
								label="Years of Experience for Similar Services"
								type="number"
								placeholder="Enter years of experiance here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required={true}
								name="is_mss_exemption"
								label="MSS Exemption"
								control={control}
								rules={{ required: true }}
								options={status}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required={true}
								name="is_start_exemption"
								label="Startup Exemption"
								control={control}
								rules={{ required: true }}
								options={status}
							/>
						</Grid>

						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								required={true}
								name="time_allowed_clarification_days"
								label="Time Allowed for Technical Clarifications"
								type="text"
								placeholder="Enter the evaluation method to be used"
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required={true}
								name="is_inspection"
								label="Inspection Required"
								control={control}
								rules={{ required: true }}
								options={status}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Stack flex={1}>
								<CustomDatepicker
									required={true}
									control={control}
									name="pre_bid_date"
									hideAddon
									dateFormat="DD-MM-YYYY"
									showTimeSelect={false}
									timeFormat="h:mm a"
									timeCaption="time"
									inputClass="form-input"
									minDate={moment()
										.subtract(3, "months")
										.startOf("month")
										.toDate()}
									label={"Pre-Bid Meeting Date"}
									tI={1}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								required={true}
								name="pre_bid_place"
								label="Pre Bid Meeting Place"
								type="text"
								placeholder="Enter meeting place here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}></Grid>
						<Grid size={{ xs: 12 }}>
							<Grid container spacing={1}>
								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<TextArea
										required={true}
										name="pre_bid_meet_address"
										label="Pre Bid Meeting Address"
										type="text"
										placeholder="Write meeting address here..."
										minRows={3}
										maxRows={5}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<TextArea
										required={true}
										name="documents_required_seller"
										label="Documents Required from Seller"
										type="text"
										placeholder="List the documents required from the seller"
										minRows={3}
										maxRows={5}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<TextArea
										required={true}
										name="evaluation_method"
										label="Evaluation Method"
										type="text"
										placeholder="Enter the evaluation method to be used"
										minRows={3}
										maxRows={5}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<TextArea
										required={true}
										name="description"
										label="Description"
										type="text"
										placeholder="Enter the decription"
										minRows={3}
										maxRows={5}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
									/>
								</Grid>
							</Grid>
						</Grid>

						<Grid size={{ xs: 12 }}>
							<Box>
								<Grid container spacing={2}>
									<Grid size={{ xs: 12, md: 6, lg: 3 }}>
										<FileUploader
											label="Documents"
											name={"documents"}
											control={control}
											showPreview={false}
											text={
												!document_loading
													? "Select a file..."
													: "Loading Please Wait..."
											}
											icon={
												!document_loading
													? LuPlus
													: LuLoader
											}
											iconSize={20}
											selectedFiles={
												uploadDocuments
													? uploadDocuments
													: []
											}
											handleAcceptedFiles={
												handleAcceptedFiles
											}
										/>
									</Grid>

									<Grid
										size={{ xs: 12, md: 6, lg: 3 }}
										mt={3}>
										{/* <Stack spacing={1}> */}
										<ScrollableList>
											{uploadDocuments?.length != 0 &&
												uploadDocuments?.map(
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
										{/* </Stack> */}
									</Grid>
								</Grid>
							</Box>
						</Grid>
						<Grid size={{ xs: 12 }}></Grid>

						{/* <Divider /> */}
					</Grid>
				</Box>
			</form>
		</Grid>
	);
};

const AddTender = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const {
		tenders: {
			selectedData,
			pageParams,
			tenderMasterItemModalOpen,
			uploadDocuments,
			pdfFile,
			extractedData,
		},
	} = useAppSelector((state) => selectTenders(state));

	function clearDataFn() {
		dispatch(setSelectedData({}));
		dispatch(setUploadDocument([]));
	}

	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		clearDataFn();
		dispatch(setExtractedData({}));
	}, []);

	useEffect(() => {
		if (id !== "0") {
			dispatch(getTenderById({ id: id ? id : "" }));
		}
	}, [id]);

	const itemSchema = yup.object().shape({
		department: yup.string().required("Please enter department name"),

		product_type: yup.object({
			label: yup.string().required("Please select a project type"),
			value: yup.string().required("Please select a project type"),
		}),
		// project: yup.object({
		// 	label: yup.string().required("Please select a project"),
		// 	value: yup.string().required("Please select a project"),
		// }),
		tender_no: yup.string().trim().required("Please enter tender number"),
		name: yup.string().required("Please enter tender name"),
		tender_type: yup.object({
			label: yup.string().required("Please select a tender type"),
			value: yup.string().required("Please select a tender type"),
		}),
		sourceportal: yup.object({
			label: yup.string().required("Please select a source portal"),
			value: yup.string().required("Please select a source portal"),
		}),
		company: yup.object({
			label: yup.string().required("Please select a company"),
			value: yup.string().required("Please select a company"),
		}),
		customer: yup.object({
			label: yup.string().required("Please select a customer"),
			value: yup.string().required("Please select a customer"),
		}),
		documents: yup.array().optional(),
		is_reverse_auction: yup
			.object({
				label: yup.string().required("Please select a reverse auction"),
				value: yup.string().required("Please select a reverse auction"),
			})
			.required("reverse auction is required"),
		tender_extension_datetime: yup
			.string()
			.required("Please enter your bid extension date"),
		tender_datetime: yup
			.string()
			.required("Please enter your bid end date"),
		tender_open_datetime: yup
			.string()
			.required("Please enter your bid open date"),
		pre_bid_date: yup.string().required("Please enter your pre bid date"),
		pre_bid_place: yup
			.string()
			.required("Please enter your pre bid meeting place"),
		pre_bid_meet_address: yup
			.string()
			.required("Please enter your pre bid meeting address"),
		annual_turnover: yup.string().required("Please enter annual turn over"),
		time_allowed_clarification_days: yup
			.string()
			.required("Please enter time allowed clarification days"),
		// annual_turnover: yup
		// 	.number()
		// 	.transform((value, originalValue) =>
		// 		originalValue?.trim() === "" ? null : value
		// 	)
		// 	.typeError("Annual turnover must be a number")
		// 	.min(3, "Annual turnover must be more than 3")
		// 	.required("Please enter your annual turnover"),
		years_of_experiance: yup
			.number()
			.transform((value, originalValue) =>
				originalValue?.trim() === "" ? null : value
			)
			.typeError("Years of Experience must be a number")
			.max(100, "Cannot enter more than 100 years")
			.min(1, "Years of Experience must be more than 0")
			.required("Please enter your years of experience"),
		documents_required_seller: yup
			.string()
			.required("Please enter documents required seller"),
		evaluation_method: yup
			.string()
			.required("Please enter evaluation method"),
		description: yup.string().required("Please enter description"),
		// time_allowed_clarification_days: yup
		// 	.number()
		// 	.transform((value, originalValue) =>
		// 		originalValue?.trim() === "" ? null : value
		// 	)
		// 	.typeError("Time allowed clarification days must be a number")
		// 	.required("Please enter time allowed clarification days"),
		ministry: yup.string().required("Please select a ministry/state"),
		lead: yup
			.object({
				label: yup.string().required("Please select a lead"),
				value: yup.string().required("Please select a lead"),
			})
			.required("lead is required"),
		is_mss_exemption: yup
			.object({
				label: yup.string().required("Please select a mss exemption"),
				value: yup.string().required("Please select a mss exemption"),
			})
			.required("mss exemption is required"),
		is_start_exemption: yup
			.object({
				label: yup.string().required("Please select a start exemption"),
				value: yup.string().required("Please select a start exemption"),
			})
			.required("start exemption is required"),
		is_inspection: yup
			.object({
				label: yup
					.string()
					.required("Please select a inspection status"),
				value: yup
					.string()
					.required("Please select a inspection status"),
			})
			.required("inspection status is required"),
	});

	const {
		control,
		handleSubmit,
		register,
		reset: tenderRest,
		// formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(itemSchema),
	});

	useEffect(() => {
		id != "0" &&
			tenderRest({
				department: selectedData.department
					? selectedData.department
					: "",
				tender_datetime: selectedData?.tender_datetime
					? moment(
							selectedData?.tender_datetime,
							"DD-MM-YYYY hh:mm A"
						).toISOString()
					: "",
				tender_extension_datetime:
					selectedData?.tender_extension_datetime
						? moment(
								selectedData?.tender_extension_datetime,
								"DD-MM-YYYY hh:mm:A"
							).toISOString()
						: "",
				product_type: selectedData.product_type_name
					? {
							label: selectedData.product_type_name
								? selectedData.product_type_name
								: "",
							value: selectedData.product_type
								? `${selectedData.product_type}`
								: "",
						}
					: null,
				tender_no: selectedData.tender_no ? selectedData.tender_no : "",
				name: selectedData.name ? selectedData.name : "",
				tender_type: selectedData.tender_type
					? {
							label: selectedData.tender_type
								? selectedData.tender_type?.name
								: "",
							value: selectedData.tender_type
								? `${selectedData.tender_type.id}`
								: "",
						}
					: null,
				sourceportal: selectedData.sourceportal
					? {
							label: selectedData.sourceportal
								? selectedData.sourceportal?.name
								: "",
							value: selectedData.sourceportal
								? `${selectedData.sourceportal.id}`
								: "",
						}
					: null,
				company: selectedData.company
					? {
							label: selectedData.company
								? selectedData.company?.name
								: "",
							value: selectedData.company
								? `${selectedData.company.id}`
								: "",
						}
					: null,
				customer: selectedData.customer
					? {
							label: selectedData.customer
								? selectedData.customer?.name
								: "",
							value: selectedData.customer
								? `${selectedData.customer.id}`
								: "",
						}
					: null,
				is_reverse_auction: selectedData.is_reverse_auction
					? {
							label: selectedData.is_reverse_auction
								? selectedData.is_reverse_auction?.name
								: "",
							value: selectedData.is_reverse_auction
								? `${selectedData.is_reverse_auction.id}`
								: "",
						}
					: null,
				document: uploadDocuments ? uploadDocuments : null,
				tender_open_datetime: selectedData?.tender_open_datetime
					? moment(
							selectedData?.tender_open_datetime,
							"DD-MM-YYYY hh:mm A"
						).toISOString()
					: "",
				pre_bid_date: selectedData?.pre_bid_date
					? moment(
							selectedData?.pre_bid_date,
							"DD-MM-YYYY hh:mm A"
						).toISOString()
					: "",
				ministry: selectedData.ministry ? selectedData.ministry : null,
				lead: selectedData.lead
					? {
							label: selectedData.lead?.name,
							value: selectedData.lead
								? `${selectedData.lead?.id}`
								: "",
						}
					: null,
				pre_bid_meet_address: selectedData.pre_bid_meet_address
					? selectedData.pre_bid_meet_address
					: "",
				pre_bid_place: selectedData.pre_bid_place
					? selectedData.pre_bid_place
					: null,
				time_allowed_clarification_days:
					selectedData.time_allowed_clarification_days
						? selectedData.time_allowed_clarification_days
						: null,
				years_of_experiance: selectedData.years_of_experiance
					? selectedData.years_of_experiance
					: null,
				annual_turnover: selectedData.annual_turnover
					? selectedData.annual_turnover
					: null,
				documents_required_seller:
					selectedData.documents_required_seller
						? selectedData.documents_required_seller
						: "",
				evaluation_method: selectedData.evaluation_method
					? selectedData.evaluation_method
					: null,
				description: selectedData.description
					? selectedData.description
					: null,
				is_mss_exemption: selectedData.is_mss_exemption
					? {
							label: selectedData.is_mss_exemption ? "Yes" : "No",
							value: selectedData.is_mss_exemption
								? `${selectedData.is_mss_exemption}`
								: "",
						}
					: null,
				is_start_exemption: selectedData.is_start_exemption
					? {
							label: selectedData.is_start_exemption
								? "Yes"
								: "No",
							value: selectedData.is_start_exemption
								? `${selectedData.is_start_exemption}`
								: "",
						}
					: null,
				is_inspection: selectedData.is_inspection
					? {
							label: selectedData.is_inspection ? "Yes" : "No",
							value: selectedData.is_inspection
								? `${selectedData.is_inspection}`
								: "",
						}
					: null,
			});
	}, [selectedData]);
	useEffect(() => {
		if (id === "0") {
			tenderRest({
				tender_no: extractedData?.outputs?.bid_number
					? extractedData?.outputs.bid_number
					: "",
				name: extractedData?.outputs?.bid_name
					? extractedData?.outputs.bid_name
					: "",
				tender_datetime: extractedData?.outputs?.bid_end_date
					? moment(
							extractedData?.outputs?.bid_end_date,
							"DD-MM-YYYY hh:mm A"
						).toISOString()
					: "",
				tender_open_datetime: extractedData?.outputs
					?.bid_opening_dateTime
					? moment(
							extractedData?.outputs?.bid_opening_dateTime,
							"DD-MM-YYYY hh:mm A"
						).toISOString()
					: "",
				documents_required_seller: extractedData?.outputs
					?.documents_required
					? extractedData?.outputs?.documents_required
					: null,
				time_allowed_clarification_days: extractedData?.outputs
					?.time_allowed_clarification
					? extractedData?.outputs?.time_allowed_clarification
					: null,
				ministry: extractedData?.outputs?.Ministry
					? extractedData?.outputs?.Ministry
					: null,
				department: extractedData?.outputs?.departmanet_name
					? extractedData.outputs?.departmanet_name
					: "",
				is_inspection: extractedData?.outputs?.is_inspection
					? {
							label:
								extractedData.outputs?.is_inspection == "Yes"
									? "Yes"
									: "No",
							value:
								extractedData.outputs?.is_inspection == "Yes"
									? true
									: false,
						}
					: null,
				years_of_experiance: extractedData?.outputs
					?.years_of_past_experiance
					? extractedData.outputs?.years_of_past_experiance
					: null,
				annual_turnover: extractedData?.outputs?.annual_turnover
					? extractedData.outputs?.annual_turnover
					: null,
				evaluation_method: extractedData?.outputs?.evaluation_method
					? extractedData.outputs?.evaluation_method
					: null,
				is_mss_exemption: extractedData?.outputs?.is_mss_exemption
					? {
							label:
								extractedData.outputs?.is_mss_exemption == "Yes"
									? "Yes"
									: "No",
							value:
								extractedData.outputs?.is_mss_exemption == "Yes"
									? true
									: false,
						}
					: null,
				is_start_exemption: extractedData?.outputs?.is_startup_exemption
					? {
							label:
								extractedData.outputs?.is_startup_exemption ==
								"Yes"
									? "Yes"
									: "No",
							value:
								extractedData.outputs?.is_startup_exemption ==
								"Yes"
									? true
									: false,
						}
					: null,
			});
		}
	}, [extractedData]);
	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Item",
			width: 100,
		},
		{
			title: "Quantity",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		quantity: string | number,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			quantity,
			actions,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.tender_items
			?.filter((e) => !e?.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const actions = (
					<Box
						sx={{
							display: "flex",
							gap: 2,
						}}>
						<LuDelete
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={() => {
								const fiteredItems =
									selectedData.tender_items?.map((e) => {
										if (
											e.tenderitemmaster.value ==
											row?.tenderitemmaster?.value
										) {
											return {
												...e,
												dodelete: true,
											};
										}
										return e;
									});
								dispatch(
									setSelectedData({
										...selectedData,
										tender_items: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);
				return createData(
					index,
					row?.tenderitemmaster?.label,
					row.quantity,
					actions
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		// dispatch(
		// 	getTenders({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getTenders({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};

	// add item form
	const addMasterItemSchema = yup.object().shape({
		tender_items: yup.object({
			label: yup.string().required("Please select a tender item"),
			value: yup.string().required("Please select a tender item"),
		}),
		quantity: yup
			.string()
			.transform((value, originalValue) =>
				originalValue?.trim() === "" ? null : value
			)
			.typeError("Quantity must be a number")
			.max(7, "Cannot enter more than 7 digits")
			.min(1, "Quantity must be more than 0")
			.required("please enter a quantity"),
	});

	const {
		control: addItemController,
		handleSubmit: handleMasterItemSubmit,
		reset,
	} = useForm<any>({
		resolver: yupResolver(addMasterItemSchema),
	});

	const onSave = (payload: any) => {
		const findItem: any = selectedData?.tender_items?.filter(
			(item) => !item.dodelete
		);
		//   const formData = new FormData();
		//   formData.append(`document`, selectedData.document[0]);
		if (findItem?.length != 0) {
			const documents = uploadDocuments?.length
				? uploadDocuments.filter((item) => item?.path)
				: [];
			const data = {
				// project_id: payload.project.value,
				tender_no: payload?.tender_no,
				name: payload?.name,
				tender_type: payload?.tender_type.value,
				product_type: payload?.product_type.value,
				department_name: payload?.department,
				sourceportal_id: payload?.sourceportal.value,
				company_id: payload?.company.value,
				// documents: uploadDocuments?.map((e: any) => e.id),
				is_reverse_auction: payload?.is_reverse_auction?.value,
				customer_id: payload?.customer?.value,
				tender_datetime: moment(payload?.tender_datetime).format(
					"DD-MM-YYYY hh:mm a"
				),
				tender_extension_datetime: moment(
					payload?.tender_extension_datetime
				).format("DD-MM-YYYY hh:mm a"),
				tender_open_datetime: moment(
					payload?.tender_open_datetime
				).format("DD-MM-YYYY hh:mm a"),
				pre_bid_place: payload?.pre_bid_place,
				pre_bid_meet_address: payload?.pre_bid_meet_address,
				ministry: payload?.ministry,
				annual_turnover: payload?.annual_turnover,
				years_of_experiance: payload?.years_of_experiance,
				is_mss_exemption: payload?.is_mss_exemption?.value,
				is_start_exemption: payload?.is_start_exemption?.value,
				documents_required_seller: payload?.documents_required_seller,
				time_allowed_clarification_days:
					payload?.time_allowed_clarification_days,
				is_inspection: payload?.is_inspection?.value,
				evaluation_method: payload?.evaluation_method,
				description: payload?.description,
				pre_bid_date: moment(payload?.pre_bid_date).format(
					"YYYY-MM-DD"
				),
				lead_id: payload?.lead?.value,
				tender_items:
					id == "0"
						? selectedData?.tender_items
								?.filter((e) => !e.dodelete)
								?.map((item) => {
									return {
										tenderitemmaster_id:
											item.tenderitemmaster.value,
										quantity: item.quantity,
										dodelete: false,
									};
								})
						: selectedData?.tender_items?.map((item) => {
								return {
									id: item?.id,
									tenderitemmaster_id:
										item.tenderitemmaster.value,
									quantity: item.quantity,
									dodelete: item.dodelete,
								};
							}),
			};
			id == "0"
				? dispatch(
						postTender({
							data,
							params: pageParams,
							tenderRest,
							navigate,
							documents,
						})
					)
				: dispatch(
						editTender({
							id: id ? id : "",
							data: {
								...data,
								project_id: selectedData?.project?.id,
							},
							params: pageParams,
							tenderRest,
							navigate,
							documents,
						})
					);
			dispatch(
				fetchNotificationList({
					...pageParams,
					page: 1,
					page_size: 10,
				})
			);
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">No Bid Items</p>`,
				text: "Please add atleast one tender item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	const openModal = (value: boolean) => {
		dispatch(setTenderMasterItemModalOpen(value));
	};

	const destroyModal = () => {
		openModal(false);
		dispatch(
			setTenderItemMasterSelectedData({
				name: "",
			})
		);
	};
	const handleUpload = () => {
		// Trigger the hidden file input when the button is clicked
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			dispatch(postPdfUpload({ file: files[0] }));
		}
	};

	return (
		<GoBack
			is_goback={true}
			go_back_url={"/tenders"}
			title={`${id && id != "0" ? "Update" : "Add"} Bid`}
			showSaveButton={true}
			button_name={"Add Bid Item"}
			onSave={() => {
				openModal(true);
			}}
			otherButtons={[
				<>
					{id === "0" && (
						<>
							<Button
								color="primary"
								type="button"
								onClick={handleUpload}
								variant="contained"
								size="large">
								<LuUpload
									size={18}
									style={{ marginRight: "6px" }}
								/>{" "}
								Upload PDF
							</Button>
							<input
								type="file"
								ref={fileInputRef}
								style={{ display: "none" }}
								onChange={handleFileChange}
							/>
						</>
					)}
				</>,
			]}
			loading={false}>
			<Box
				sx={{
					my: 1,
					height: "100%",
				}}>
				<AddBidItem
					isOpen={tenderMasterItemModalOpen}
					hide={destroyModal}
				/>
				<Card>
					<CardContent>
						<TenderForm
							onSave={onSave}
							register={register}
							handleSubmit={handleSubmit}
							control={control}
							// errors={errors}
						/>
						<Divider />
						<AddItemForm
							control={addItemController}
							handleSubmit={handleMasterItemSubmit}
							reset={reset}
						/>
						<Box mt={2}>
							<TableComponent
								count={selectedData.tender_items?.length ?? 0}
								columns={columns}
								rows={rows ? rows : []}
								loading={false}
								page={
									// selectedData?.tender_items_pageParams?.page
									// 	? selectedData?.tender_items_pageParams
									// 			?.page
									// :
									1
								}
								pageSize={
									// selectedData?.tender_items_pageParams
									// 	?.page_size
									// 	? selectedData?.tender_items_pageParams
									// 		?.page_size
									// 	:
									10
								}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
								showPagination={false}
							/>

							{/* <Grid size={{ xs: 12 }}> */}
							<Box textAlign={"right"} mt={2}>
								<Button
									color="success"
									type="submit"
									onClick={handleSubmit(onSave)}
									variant="contained"
									size="large">
									<LuSave
										size={18}
										style={{ marginRight: "6px" }}
									/>{" "}
									Save
								</Button>
							</Box>
							{/* </Grid> */}
						</Box>
					</CardContent>
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddTender;
