import { yupResolver } from "@hookform/resolvers/yup";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Grid2 as Grid,
	IconButton,
	List,
	Stack,
	Typography,
	styled,
} from "@mui/material";
import {
	CustomDatepicker,
	FileType,
	FileUploader,
	FormInput,
} from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import GoBack from "@src/components/GoBack";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import {
	getMiniClientLocationsAganistCustomer,
	getMiniCompany,
	getMiniCustomers,
	getMiniItems,
	getMiniLocation,
	getMiniUnits,
	getMiniUsers,
} from "@src/store/mini/mini.Action";
import {
	clearMiniClientLocationsAganistCustomer,
	clearMiniCompany,
	clearMiniCustomers,
	clearMiniItems,
	clearMiniLocation,
	clearMiniUnits,
	clearMiniUsers,
} from "@src/store/mini/mini.Slice";
import {
	editLeadData,
	getLeadById,
	getVendorsByItems,
	postLeadData,
	postLeadDocuments,
} from "@src/store/sidemenu/strategic_management/leads/leads.action";
import {
	clearVendorsAganistItems,
	selectLeads,
	setSelectedData,
	setUploadDocument,
} from "@src/store/sidemenu/strategic_management/leads/leads.slice";
import { LeadItem } from "@src/store/sidemenu/strategic_management/leads/leads.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { memo, SyntheticEvent, useEffect, useMemo } from "react";
import { Control, useForm } from "react-hook-form";
import {
	LuBook,
	LuDelete,
	LuFile,
	LuLoader,
	LuPlus,
	LuSave,
	LuX,
} from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { fetchNotificationList } from "@src/store/notifications/notification.actions";
import { miniType } from "@src/store/mini/mini.Types";

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
		leads: { uploadDocuments },
	} = useAppSelector((state) => selectLeads(state));

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

const HeaderForm = ({
	onSave,
	handleSubmit,
	reset,
	control,
	getValues,
}: {
	onSave: (value: any) => void;
	handleSubmit: any;
	reset: any;
	control: Control<any>;
	getValues: any;
}) => {
	const dispatch = useAppDispatch();
	const {
		leads: { uploadDocuments, loading_documents },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniCompany,
			miniCustomers,
			miniClientLocationsAganistCustomer,

			miniUserList,
			miniUserLoading,
			miniUserParams,
			miniItemsList,
		},
	} = useAppSelector((state) => selectLeads(state));

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

	const priority_options = [
		{
			id: 1,
			name: "Low",
		},
		{
			id: 2,
			name: "MEDIUM",
		},
		{
			id: 3,
			name: "HIGH",
		},
	];
	const formData = getValues();

	return (
		<Box mb={2}>
			<form onSubmit={handleSubmit(onSave)}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12 }}>
						<Typography
							bgcolor={"grey.200"}
							component={"h5"}
							sx={{
								p: "8px",
								display: "flex",
								alignItems: "center",
								textTransform: "uppercase",
							}}>
							<LuBook size={20} style={{ marginRight: "6px" }} />
							<Typography
								component={"span"}
								fontSize={"16px"}
								variant="body1">
								Customer Details
							</Typography>
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<Stack>
							<CustomDatepicker
								required
								control={control}
								name="date"
								hideAddon
								dateFormat="DD-MM-YYYY"
								showTimeSelect={false}
								timeFormat="h:mm a"
								timeCaption="time"
								minDate={new Date()}
								inputClass="form-input"
								label={"Lead Entry Date"}
								tI={1}
							/>
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<Stack>
							<CustomDatepicker
								required
								control={control}
								name="enquiry_date"
								hideAddon
								dateFormat="DD-MM-YYYY"
								showTimeSelect={false}
								timeFormat="h:mm a"
								timeCaption="time"
								minDate={moment()
									.subtract(3, "months")
									.startOf("month")
									.toDate()}
								inputClass="form-input"
								label={"Date of enquiry"}
								tI={1}
							/>
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<Stack>
							<CustomDatepicker
								required
								control={control}
								name="due_date"
								hideAddon
								dateFormat="DD-MM-YYYY"
								showTimeSelect={false}
								timeFormat="h:mm a"
								timeCaption="time"
								minDate={moment().add(1, "day").toDate()}
								inputClass="form-input"
								label={"Date of Due"}
								tI={1}
							/>
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="name"
							label="Lead Name"
							type="text"
							placeholder="Enter name here..."
							control={control}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="mobile"
							label="Mobile Number"
							type="number"
							placeholder="Enter mobile number here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="email"
							label="Email"
							type="email"
							placeholder="Enter email number here..."
							control={control}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
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
								page_size: miniCustomers.miniParams.page_size,
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
							required
							name="client_location"
							label="Client Location"
							control={control}
							rules={{ required: true }}
							options={miniClientLocationsAganistCustomer.list.map(
								(e: { id: string; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							loading={miniClientLocationsAganistCustomer.loading}
							selectParams={{
								page: miniClientLocationsAganistCustomer
									.miniParams.page,
								page_size:
									miniClientLocationsAganistCustomer
										.miniParams.page_size,
								search: miniClientLocationsAganistCustomer
									.miniParams.search,
								no_of_pages:
									miniClientLocationsAganistCustomer
										.miniParams.no_of_pages,
								customer_id: formData?.customer?.value,
							}}
							hasMore={
								miniClientLocationsAganistCustomer.miniParams
									.page <
								miniClientLocationsAganistCustomer.miniParams
									.no_of_pages
							}
							fetchapi={getMiniClientLocationsAganistCustomer}
							clearData={clearMiniClientLocationsAganistCustomer}
						/>
					</Grid>

					<Grid size={{ xs: 12 }}>
						<Typography
							bgcolor={"grey.200"}
							component={"h5"}
							sx={{
								p: "8px",
								display: "flex",
								alignItems: "center",
								textTransform: "uppercase",
							}}>
							<LuBook size={20} style={{ marginRight: "6px" }} />
							<Typography
								component={"span"}
								fontSize={"16px"}
								variant="body1">
								Company Details
							</Typography>
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						{/* <FormInput
							required
							name="bdm_name"
							label="Business Development Manager Name"
							type="text"
							placeholder="Enter name here..."
							control={control}
						/> */}
						<SelectComponent
							required
							name="bdm_name"
							label="Business Development Manager"
							control={control}
							rules={{ required: true }}
							options={miniUserList?.map(
								(e: { id: string; fullname: string }) => ({
									id: e.id,
									name: e.fullname,
								})
							)}
							loading={miniUserLoading}
							selectParams={{
								page: miniUserParams.page,
								page_size: miniUserParams.page_size,
								search: miniUserParams.search,
								no_of_pages: miniUserParams.no_of_pages,
							}}
							hasMore={
								miniUserParams.page < miniUserParams.no_of_pages
							}
							fetchapi={getMiniUsers}
							clearData={clearMiniUsers}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
							name="company"
							label="Company"
							control={control}
							rules={{ required: true }}
							options={miniCompany?.list?.map(
								(e: { id: boolean; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							loading={miniCompany.loading}
							selectParams={{
								page: miniCompany.miniParams.page,
								page_size: miniCompany.miniParams.page_size,
								search: miniCompany.miniParams.search,
								no_of_pages: miniCompany.miniParams.no_of_pages,
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
						<SelectComponent
							required
							name="location"
							label="Location"
							control={control}
							rules={{ required: true }}
							options={miniLocationList.map(
								(e: { id: string; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							loading={miniLocationLoading}
							selectParams={{
								page: miniLocationParams.page,
								page_size: miniLocationParams.page_size,
								search: miniLocationParams.search,
								no_of_pages: miniLocationParams.no_of_pages,
							}}
							hasMore={
								miniLocationParams.page <
								miniLocationParams.no_of_pages
							}
							fetchapi={getMiniLocation}
							clearData={clearMiniLocation}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
							name="priority"
							label="Priority"
							control={control}
							rules={{ required: true }}
							options={priority_options}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2} mt={2}>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<Box>
							<FileUploader
								label="Documents"
								name={"documents"}
								control={control}
								showPreview={false}
								text={
									!loading_documents
										? "Select a file..."
										: "Loading Please Wait..."
								}
								icon={!loading_documents ? LuPlus : LuLoader}
								iconSize={20}
								selectedFiles={
									uploadDocuments ? uploadDocuments : []
								}
								handleAcceptedFiles={handleAcceptedFiles}
							/>
						</Box>
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={3}>
						<ScrollableList>
							{uploadDocuments?.length != 0 &&
								uploadDocuments?.map((document) => {
									if (!document?.dodelete)
										return (
											document?.path && (
												<HorizontalFilePreview
													file={document}
												/>
											)
										);
								})}
						</ScrollableList>
					</Grid>
				</Grid>
			</form>
		</Box>
	);
};

const BodyForm = ({ control, handleSubmit, reset, getValues }: any) => {
	const dispatch = useAppDispatch();
	const {
		mini: { miniItemsList, miniUnits },
		leads: { selectedData, vendorsAganistItems },
	} = useAppSelector((state) => selectLeads(state));

	const handleAddItem = (payload: any) => {
		const findItem: any = selectedData?.lead_items?.find(
			(item: LeadItem) =>
				item?.item?.value == payload?.item?.value &&
				item?.unit?.value == payload?.unit?.value
		);
		const addData = () => {
			const data = {
				...payload,
				dodelete: false,
			};
			dispatch(
				setSelectedData({
					...selectedData,
					lead_items: [
						...(selectedData?.lead_items || []), // Ensure pqitems is an array
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
			item: null,
			quantity: "",
			unit: null,
			vendors: [],
			item_specifications: "",
		});
	};
	const getValuesItem = getValues("item");
	return (
		<Box mt={2}>
			<form action="" onSubmit={handleSubmit(handleAddItem)}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
							name="item"
							label="Item"
							control={control}
							rules={{ required: true }}
							options={miniItemsList?.list?.map(
								(e: { id: boolean; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							loading={miniItemsList.loading}
							selectParams={{
								page: miniItemsList.miniParams.page,
								page_size: miniItemsList.miniParams.page_size,
								search: miniItemsList.miniParams.search,
								no_of_pages:
									miniItemsList.miniParams.no_of_pages,
							}}
							onChange={(value) => {
								reset({
									item: value,
									quantity: "",
									unit: null,
									vendors: [],
									item_specifications: "",
								});
							}}
							hasMore={
								miniItemsList.miniParams.page <
								miniItemsList.miniParams.no_of_pages
							}
							fetchapi={getMiniItems}
							clearData={clearMiniItems}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="quantity"
							label="Quantity"
							disabled={getValuesItem ? false : true}
							helperText={
								getValuesItem
									? ""
									: "Select an item to enter quantity"
							}
							type="number"
							placeholder="Enter quantity here..."
							control={control}
							onInput={(e: any) => {
								// Enforce maximum of 5 digits
								if (e.target.value.length > 5) {
									e.target.value = e.target.value.slice(0, 5);
								}
							}}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
							name="unit"
							label="Unit"
							control={control}
							disabled={getValuesItem ? false : true}
							rules={{ required: true }}
							options={miniUnits.list.map(
								(e: { id: string | number; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							loading={miniUnits.loading}
							helperText={
								getValuesItem
									? ""
									: "Select an item to see unit"
							}
							selectParams={{
								page: miniUnits.miniParams.page,
								page_size: miniUnits.miniParams.page_size,
								search: miniUnits.miniParams.search,
								no_of_pages: miniUnits.miniParams.no_of_pages,
								item: getValuesItem?.value
									? getValuesItem?.value
									: "",
							}}
							hasMore={
								miniUnits.miniParams.page <
								miniUnits.miniParams.no_of_pages
							}
							fetchapi={getMiniUnits}
							clearData={clearMiniUnits}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
							name="vendors"
							disabled={getValuesItem ? false : true}
							helperText={
								// selectedData &&
								!getValuesItem?.value
									? "Select an item to see vendors"
									: ""
							}
							label="Vendor"
							control={control}
							rules={{ required: true }}
							multiple={true}
							options={vendorsAganistItems?.list?.map(
								(e: { id: string | number; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							loading={vendorsAganistItems?.loading}
							selectParams={{
								page: vendorsAganistItems.miniParams.page,
								page_size:
									vendorsAganistItems.miniParams.page_size,
								search: vendorsAganistItems.miniParams.search,
								no_of_pages:
									vendorsAganistItems.miniParams.no_of_pages,
								item_ids: getValuesItem?.value
									? [getValuesItem?.value]
									: [],
							}}
							hasMore={
								vendorsAganistItems.miniParams.page <
								vendorsAganistItems.miniParams.no_of_pages
							}
							fetchapi={getVendorsByItems}
							clearData={clearVendorsAganistItems}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<TextArea
							required
							name="item_specifications"
							label="Item Specifications"
							type="text"
							placeholder="Write Item Specifications here..."
							minRows={3}
							maxRows={5}
							containerSx={{
								display: "grid",
								gap: 1,
							}}
							control={control}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={5}>
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

const AddLeads = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id } = useParams();

	const {
		leads: {
			pageParams,
			selectedData,
			loading,
			uploadDocuments,
			vendorsAganistItems,
		},
		mini: { miniUnits, miniVendors },
		system: { userAccessList },
	} = useAppSelector((state) => selectLeads(state));

	function clearDataFn() {
		resetBody();
		resetLeadForm();
		dispatch(setSelectedData({}));
		dispatch(setUploadDocument([]));
	}

	useEffect(() => {
		clearDataFn();
	}, []);

	const headerSchema = yup.object().shape({
		date: yup.string().required("Date is required"),
		enquiry_date: yup.string().required("Enquiry date is required"),
		due_date: yup.string().required("Due date is required"),
		name: yup.string().trim().required("Name is required"),
		bdm_name: yup
			.object({
				label: yup
					.string()
					.required("Please select a business development manager"),
				value: yup
					.string()
					.required("Please select a business development manager"),
			})
			.required("Please select a business development manager"),
		mobile: yup
			.string()
			.required("Mobile is required")
			.min(10, "Mobile number must be 10 digits")
			.max(10, "Mobile number must be 10 digits"),
		email: yup
			.string()
			.required("Email is required")
			.email("Email must be a valid email"),

		location: yup
			.object({
				label: yup.string().required("Please select a location"),
				value: yup.string().required("Please select a location"),
			})
			.required("Please select a location"),
		company: yup
			.object({
				label: yup.string().required("Please select a company"),
				value: yup.string().required("Please select a company"),
			})
			.required("Please select a company"),
		customer: yup
			.object({
				label: yup.string().required("Please select a customer"),
				value: yup.string().required("Please select a customer"),
			})
			.required("Please select a customer"),
		priority: yup
			.object({
				label: yup.string().required("Please select a priority"),
				value: yup.number().required("Please select a priority"),
			})
			.required("Please select a priority"),
		client_location: yup
			.object({
				label: yup.string().required("Please select a client location"),
				value: yup.string().required("Please select a client location"),
			})
			.required("Please select a client location"),
		documents: yup.array().optional(),
	});

	const {
		control,
		handleSubmit,
		reset: resetLeadForm,
		setValue,
		getValues,
		// formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(headerSchema),
		[id == "0" ? "defaultValues" : "values"]: {
			date: selectedData?.date
				? moment(selectedData.date).toISOString()
				: "",
			enquiry_date: selectedData?.enquiry_date
				? moment(selectedData.enquiry_date).toISOString()
				: "",
			due_date: selectedData?.due_date
				? moment(selectedData.due_date).toISOString()
				: "",
			name: selectedData.name ? selectedData.name : "",
			bdm_name:
				selectedData.bdm && "id" in selectedData.bdm
					? {
							label: selectedData?.bdm?.fullname,
							value: selectedData?.bdm?.id,
						}
					: "",
			remarks: selectedData.remarks ? selectedData.remarks : "",
			mobile: selectedData.mobile ? selectedData.mobile : "",
			email: selectedData.email ? selectedData.email : "",

			location: selectedData?.location
				? {
						label: selectedData?.location?.name,
						value: selectedData?.location?.id,
					}
				: null,
			company: selectedData?.company
				? {
						label: selectedData?.company?.name,
						value: selectedData?.company?.id,
					}
				: null,
			customer: selectedData?.customer
				? {
						label: selectedData?.customer?.name,
						value: selectedData?.customer?.id,
					}
				: null,
			priority: selectedData?.priority
				? {
						label: selectedData?.priority_name,
						value: selectedData?.priority,
					}
				: null,
			client_location: selectedData?.client_location
				? {
						label: selectedData?.client_location?.name,
						value: selectedData?.client_location?.id,
					}
				: null,
			document: uploadDocuments ? uploadDocuments : null,

			items: selectedData?.lead_items,
		},
	});

	const bodySchema = yup.object().shape({
		item: yup
			.object({
				label: yup.string().required("Please select a item"),
				value: yup.string().required("Please select a item"),
			})
			.required("Please select a item"),
		vendors: yup
			.array()
			.of(
				yup.object().shape({
					label: yup.string().required("Each make must have a label"),
					value: yup.string().required("Each make must have a value"),
				})
			)
			.min(1, "Select at least one vendor")
			.required("Please select a vendor"),
		unit: yup
			.object({
				label: yup.string().required("Please select a unit"),
				value: yup.string().required("Please select a unit"),
			})
			.required("Please select a unit"),
		quantity: yup
			.number()
			.required("Quantity is required")
			.typeError("Quantity must be a number")
			.min(1, "Quantity must be greater than 0"), // Enforcing greater than 0
		item_specifications: yup
			.string()
			.required("Item specifications are required"),
	});

	const {
		control: bodyContoller,
		handleSubmit: handleBodySubmit,
		reset: resetBody,
		getValues: getValuesBody,
	} = useForm<any>({
		resolver: yupResolver(bodySchema),
	});

	useEffect(() => {
		if (id !== "0") {
			dispatch(getLeadById({ id: id ? id : "" }));
		}
	}, [id]);

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
			title: "Unit",
			width: 100,
		},
		{
			title: "Vendor",
			width: 100,
		},
		{
			title: "Specifications",
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
		quantity: React.JSX.Element,
		unit: React.JSX.Element,
		vendor: string,
		specifications: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			quantity,
			unit,
			vendor,
			specifications,
			actions,
		};
	}
	const rows = useMemo(() => {
		return selectedData?.lead_items
			?.filter((e) => !e?.dodelete)
			?.map((row: LeadItem, key: number) => {
				setValue(`items.${key}.quantity` as any, row.quantity);
				setValue(`items.${key}.unit` as any, row.unit);
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const specifications = (
					<ReadMore
						text={
							row.item_specifications
								? row.item_specifications
								: ""
						}
						maxLength={30}
					/>
				);

				const quantity = (
					<Box>
						<form>
							<FormInput
								name={`items.${key}.quantity`}
								label=""
								disabled={row?.item ? false : true}
								helperText={"Quantity"}
								type="number"
								placeholder="Enter quantity here..."
								control={control}
								onInput={(e: any) => {
									// Enforce maximum of 5 digits
									if (e.target.value.length > 5) {
										e.target.value = e.target.value.slice(
											0,
											5
										);
									}
								}}
								onChange={(event) => {
									dispatch(
										setSelectedData({
											...selectedData,
											lead_items:
												selectedData?.lead_items?.map(
													(e) => {
														if (
															e?.item?.value ===
																row?.item
																	?.value &&
															e?.unit?.value ===
																row?.unit?.value
														) {
															return {
																...e,
																quantity:
																	event.target
																		.value,
															};
														}
														return e;
													}
												),
										})
									);
								}}
							/>
						</form>
					</Box>
				);

				const unit = <Box>{row?.unit?.label}</Box>;

				const vendor = row?.vendors
					?.map((item: miniType) => {
						return item?.name || "";
					})
					.join(", ");

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
									selectedData?.lead_items?.map((e) => {
										if (
											e.item.value == row?.item.value &&
											e.unit?.value == row?.unit?.value
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
										lead_items: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);

				return createData(
					index,
					row?.item?.label,
					quantity,
					unit,
					vendor,
					specifications,
					actions
				);
			});
	}, [selectedData, createData]);
	const onSave = (payload: any) => {
		const findItem: any = selectedData?.lead_items?.filter(
			(item) => !item.dodelete
		);

		if (findItem?.length != 0) {
			const leadItems =
				id == "0"
					? selectedData?.lead_items?.filter((item) => !item.dodelete)
					: selectedData?.lead_items;

			const documents = uploadDocuments?.length
				? uploadDocuments.filter((item) => item?.path)
				: [];

			const data = {
				date: payload.date
					? moment(payload.date).format("YYYY-MM-DD")
					: "",
				enquiry_date: payload.enquiry_date
					? moment(payload.enquiry_date).format("YYYY-MM-DD")
					: "",
				due_date: payload.due_date
					? moment(payload.due_date).format("YYYY-MM-DD")
					: "",
				name: payload.name ? payload.name : "",
				bdm_id: payload.bdm_name ? payload.bdm_name?.value : "",
				customer_id: payload.customer?.value
					? payload.customer?.value
					: "",
				priority: payload.priority?.value
					? payload.priority?.value
					: "",
				mobile: payload.mobile ? payload.mobile : "",
				email: payload.email ? payload.email : "",

				location_id: payload.location.value
					? payload.location.value
					: "",
				remarks: payload.remarks ? payload.remarks : "",
				company_id: payload.company.value ? payload.company.value : "",
				client_location_id: payload.client_location.value
					? payload.client_location.value
					: "",
				// assignees: selectedData?.assignees,
				// documents: uploadDocuments?.map((e: any) => e.id),
				lead_items: (leadItems || [])?.map((item) => {
					return {
						id: item?.id,
						item_id: item.item.value ? item.item.value : "",
						quantity: item.quantity ? item.quantity : "",
						item_specifications: item.item_specifications
							? item.item_specifications
							: "",
						dodelete: item.dodelete ? item.dodelete : false,
						vendor_ids:
							item.vendors
								?.map((vendor) => vendor.value)
								?.filter(
									(id): id is string => typeof id === "string"
								) || [], // Ensure only string values
						unit_id: item.unit?.value ? item.unit?.value : "",
					};
				}),
			};
			id == "0"
				? dispatch(
						postLeadData({
							data,
							params: pageParams,
							resetLeadForm,
							navigate,
							documents,
						})
					)
				: dispatch(
						editLeadData({
							id: id ? id : "",
							data,
							params: pageParams,
							resetLeadForm,
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

	return (
		<GoBack
			is_goback={true}
			go_back_url={"/leads"}
			title={`${id && id != "0" ? "Update" : "Add"} Lead`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					height: "100%",
					px: 2,
				}}>
				<HeaderForm
					onSave={onSave}
					handleSubmit={handleSubmit}
					reset={resetLeadForm}
					control={control}
					getValues={getValues}
				/>
				{/* <Divider /> */}
				<Grid size={{ xs: 12 }}>
					<Typography
						bgcolor={"grey.200"}
						component={"h5"}
						sx={{
							p: "8px",
							display: "flex",
							alignItems: "center",
							textTransform: "uppercase",
						}}>
						<LuBook size={20} style={{ marginRight: "6px" }} />
						<Typography
							component={"span"}
							fontSize={"16px"}
							variant="body1">
							Item Details
						</Typography>
					</Typography>
				</Grid>
				<BodyForm
					control={bodyContoller}
					handleSubmit={handleBodySubmit}
					reset={resetBody}
					getValues={getValuesBody}
				/>
				<Box mt={2}>
					<TableComponent
						count={selectedData?.lead_items?.length ?? 0}
						columns={columns}
						rows={rows ? rows : []}
						loading={false}
						page={1}
						pageSize={10}
						handleChangePage={() => {}}
						handleChangeRowsPerPage={() => {}}
						showPagination={false}
					/>
					<Grid container mt={2}>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<TextArea
								name="remarks"
								label="Remarks"
								type="text"
								placeholder="Write remarks here..."
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

					{/* <Grid size={{ xs: 12 }}> */}
					<Box textAlign={"right"} mt={2}>
						<Button
							color="success"
							type="submit"
							onClick={handleSubmit(onSave)}
							variant="contained"
							size="large">
							<LuSave size={18} style={{ marginRight: "6px" }} />{" "}
							Save Lead
						</Button>
					</Box>
					{/* </Grid> */}
				</Box>
			</Box>
		</GoBack>
	);
};

export default AddLeads;
