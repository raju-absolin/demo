import { yupResolver } from "@hookform/resolvers/yup";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	FormLabel,
	IconButton,
	List,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
	CustomDatepicker,
	FileType,
	FileUploader,
	FormInput,
} from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import Swal from "sweetalert2";
import {
	LuDelete,
	LuFile,
	LuLoader,
	LuPlus,
	LuSave,
	LuX,
} from "react-icons/lu";
import {
	clearMiniEnquiry,
	clearMiniMake,
	clearMiniPurchaseOrder,
	setMiniLocationParams,
	clearMiniLocation,
	clearWarehouseByProject,
	clearMiniTax,
	clearMiniCurrencies,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniEnquiry,
	getMiniMake,
	getPurchaseOrderMini,
	getMiniLocation,
	getMiniTax,
	getWarehouseByProject,
	getMiniCurrencies,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	clearPOItems,
	setSelectedData,
	setSelectedItems,
	setUploadDocument,
} from "@src/store/sidemenu/project_management/MaterialReceivedNotes/mrn.slice";
import { v4 as uuidv4 } from "uuid";
import {
	editMaterialReceivedNotes,
	getMRNById,
	getPOItems,
	getPurchaseOrderById,
	postMaterialReceivedNotes,
} from "@src/store/sidemenu/project_management/MaterialReceivedNotes/mrn.action";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import TextArea from "@src/components/form/TextArea";
import { updateSidenav } from "@src/store/customise/customise";
import { selectMaterialReceivedNotes } from "@src/store/sidemenu/project_management/MaterialReceivedNotes/mrn.slice";
import { selectLeads } from "@src/store/sidemenu/strategic_management/leads/leads.slice";
import { MrnItem } from "@src/store/sidemenu/project_management/MaterialReceivedNotes/mrn.types";
import { OrderItem } from "@src/store/sidemenu/project_management/PurchaseOrder/po.types";

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
	attachments,
	setAttachments,
}: {
	file: any;
	attachments: {
		uuid: any;
		id: string;
	}[];
	setAttachments: (params: any[]) => void;
}) => {
	const dispatch = useAppDispatch();
	// }
	function handleDismiss() {
		const filter = !file?.id
			? attachments?.filter((e) => e?.uuid != file.uuid)
			: attachments?.map((e) =>
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
				p: "12px",
				display: "flex",
			}}
			mt={1}>
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
			</Typography>
			<IconButton sx={{ marginLeft: "auto", my: "auto" }}>
				<LuX size={18} onClick={() => handleDismiss()} />
			</IconButton>
		</Box>
	);
};

const AddItemForm = ({ control, getValues, setValue, reset }: any) => {
	const { projectId, id } = useParams();
	const dispatch = useAppDispatch();
	const {
		materialReceivedNotes: {
			selectedData,
			vendorsByPE,
			loading_documents,
			invoice_document,
		},
		mini: {
			miniCurrencies,
			miniPurchaseOrder,
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			warehouseByProject,
		},
	} = useAppSelector((state) => selectMaterialReceivedNotes(state));

	const purchase_order = getValues("purchaseorder");
	const getLocation = getValues("location");

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
				uuid: uuidv4(),
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);
		const uploadDocuments = [...(invoice_document || []), modifiedFiles[0]];

		dispatch(setUploadDocument(uploadDocuments));

		dispatch(
			setSelectedData({
				...selectedData,
				file: uploadDocuments,
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
		<Box mt={0}>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<Stack width={"100%"}>
						<CustomDatepicker
							control={control}
							name="date"
							hideAddon
							required
							dateFormat="DD-MM-YYYY"
							showTimeSelect={false}
							timeFormat="h:mm a"
							maxDate={new Date()}
							timeCaption="time"
							inputClass="form-input"
							label={"Date"}
							tI={1}
						/>
					</Stack>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="purchaseorder"
						label="Purchase Order"
						control={control}
						required
						options={miniPurchaseOrder?.list?.map(
							(e: { id: string | number; code: string }) => ({
								id: e.id,
								name: e.code,
							})
						)}
						helperText={
							id !== "0"
								? "PO dropdown is disabled for selection"
								: ""
						}
						onChange={(value) => {
							dispatch(setSelectedItems([]));
							reset({
								date: getValues("date"),
								purchaseorder: value,
								vendor: null,
								location: null,
								warehouse: null,
								currency: null,
								exchange_rate: "",
								description: "",
								invoice_date: "",
								item: null,
								invoice_no: "",
								invoice_amount: "",
								invoice_document: [],
							});
							dispatch(
								getPurchaseOrderById({
									id: value ? value.value : "",
								})
							).then((res: any) => {
								setValue(
									"purchaseorder",
									{
										value: value?.value,
										label: value?.label,
									},
									{ shouldValidate: true }
								);
								setValue(
									"vendor",
									{
										value: res.payload?.response?.vendor
											?.id,
										label: res.payload?.response?.vendor
											?.name,
									},
									{ shouldValidate: true }
								);
								setValue("currency", {
									value: res.payload?.response?.currency?.id,
									label: res.payload?.response?.currency
										?.name,
								});
								setValue(
									"exchange_rate",
									res.payload?.response?.exchange_rate
								);
							});
							dispatch(
								setSelectedData({
									...selectedData,
									purchaseorder: value,
								})
							);
						}}
						disabled={id !== "0" ? true : false}
						loading={miniPurchaseOrder.loading}
						selectParams={{
							page: miniPurchaseOrder.miniParams.page,
							page_size: miniPurchaseOrder.miniParams.page_size,
							search: miniPurchaseOrder.miniParams.search,
							no_of_pages:
								miniPurchaseOrder.miniParams.no_of_pages,
							project: projectId ? projectId : "",
						}}
						hasMore={
							miniPurchaseOrder.miniParams.page <
							miniPurchaseOrder.miniParams.no_of_pages
						}
						fetchapi={getPurchaseOrderMini}
						clearData={clearMiniPurchaseOrder}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="vendor"
						label="Vendor"
						control={control}
						required
						options={
							vendorsByPE
								? vendorsByPE?.map(
										(e: { id: string; name: string }) => ({
											id: e.id,
											name: e.name,
										})
									)
								: []
						}
						disabled={
							!purchase_order?.value || id !== "0" ? true : false
						}
						helperText={
							!purchase_order?.value
								? "Select a purchase Order to see vendors"
								: id !== "0"
									? "Vendor dropdown is disabled for selection"
									: ""
						}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="location"
						label="Location"
						control={control}
						required
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
						onChange={(value) => {
							if (value) {
								setValue("location", value, {
									shouldValidate: true,
								});
							}
						}}
						hasMore={
							miniLocationParams.page <
							miniLocationParams.no_of_pages
						}
						fetchapi={getMiniLocation}
						clearData={clearMiniLocation}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="warehouse"
						label="Warehouse"
						control={control}
						required
						options={warehouseByProject?.list?.map(
							(e: { id: string; name: string }) => ({
								id: e.id,
								name: e.name,
							})
						)}
						onChange={(value) => {
							if (value) {
								setValue("warehouse", value, {
									shouldValidate: true,
								});
							}
						}}
						loading={warehouseByProject?.loading}
						selectParams={{
							page: warehouseByProject?.miniParams?.page,
							page_size:
								warehouseByProject?.miniParams?.page_size,
							search: warehouseByProject?.miniParams?.search,
							no_of_pages:
								warehouseByProject?.miniParams?.no_of_pages,
							project_id: projectId ? projectId : "",
							location: getLocation?.value,
						}}
						hasMore={
							warehouseByProject?.miniParams?.page <
							warehouseByProject?.miniParams?.no_of_pages
						}
						fetchapi={getWarehouseByProject}
						clearData={clearWarehouseByProject}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<FormInput
						name="invoice_no"
						label="Invoice No"
						type="text"
						required
						placeholder="Enter Invoice number here..."
						control={control}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<Stack width={"100%"}>
						<CustomDatepicker
							control={control}
							name="invoice_date"
							hideAddon
							dateFormat="DD-MM-YYYY"
							showTimeSelect={false}
							timeFormat="h:mm a"
							maxDate={new Date()}
							required
							timeCaption="time"
							inputClass="form-input"
							label={"Invoice Date"}
							tI={1}
						/>
					</Stack>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<FormInput
						name="invoice_amount"
						label="Invoice Amount"
						required
						type="text"
						placeholder="Enter Invoice Amount here..."
						control={control}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="currency"
						label="Currency"
						control={control}
						rules={{ required: true }}
						options={miniCurrencies.list.map(
							(e: { id: string | number; name: string }) => ({
								id: e.id,
								name: e.name,
							})
						)}
						disabled
						loading={miniCurrencies.loading}
						selectParams={{
							page: miniCurrencies.miniParams.page,
							page_size: miniCurrencies.miniParams.page_size,
							search: miniCurrencies.miniParams.search,
							no_of_pages: miniCurrencies.miniParams.no_of_pages,
							project: projectId ? projectId : "",
						}}
						hasMore={
							miniCurrencies.miniParams.page <
							miniCurrencies.miniParams.no_of_pages
						}
						fetchapi={getMiniCurrencies}
						clearData={clearMiniCurrencies}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<FormInput
						name="exchange_rate"
						label="Exchange Rate"
						type="number"
						disabled
						placeholder="Enter exchange rate here..."
						control={control}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={2} mt={2}>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<FileUploader
						label="Invoice Documents"
						name={"invoice_document"}
						control={control}
						showPreview={false}
						text={
							!loading_documents
								? "Select a file..."
								: "Loading Please Wait..."
						}
						icon={!loading_documents ? LuPlus : LuLoader}
						iconSize={20}
						selectedFiles={invoice_document}
						handleAcceptedFiles={handleAcceptedFiles}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }} mt={3}>
					<ScrollableList>
						{invoice_document &&
							invoice_document?.map((val: any, index: string) => (
								<HorizontalFilePreview
									key={index}
									file={val}
									attachments={invoice_document}
									setAttachments={setAttachments}
								/>
							))}
					</ScrollableList>
				</Grid>
			</Grid>
		</Box>
	);
};

const AddMaterialReceivedNotes = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		materialReceivedNotes: {
			selectedData,
			pageParams,
			invoice_document,
			selectedItems,
			purchaseorder,
			loading,
			popageParams,
			POItems,
		},
		mini: { miniMake, miniTax, miniBatch },
	} = useAppSelector((state) => selectMaterialReceivedNotes(state));

	const [quantityExceeded, setQuantityExceeded] = useState(false);
	const [mrnquantity, setMRNQuantity] = useState<any>(0);

	// const [maxQty, setMaxQty] = useState<any>([]);

	const [rowQuantities, setRowQuantities] = useState(
		selectedItems?.map(() => "") || [] // Initialize quantities as 0 or from initial data
	);
	const [rowErrors, setRowErrors] = useState(
		selectedItems?.map(() => "") || []
	);

	function clearDataFn() {
		mrnReset({
			purchaseorder: null,
			vendor: null,
			location: null,
			warehouse: null,
			currency: null,
			exchange_rate: "",
			description: "",
			invoice_date: "",
			date: "",
			item: null,
			invoice_no: "",
			invoice_amount: "",
			invoice_document: [],
		});
		dispatch(setSelectedData({}));
		dispatch(setSelectedItems([]));
	}

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		clearDataFn();
	}, []);

	useEffect(() => {
		if (id !== "0") {
			dispatch(getMRNById({ id: id ? id : "" }));
		}
		setQuantityExceeded(false);
	}, [id]);

	// useMemo(() => {
	// 	if (id !== "0") {
	// 		if (selectedData?.purchaseorder?.id) {
	// 			dispatch(
	// 				getPurchaseOrderById({
	// 					id: selectedData?.purchaseorder?.id,
	// 				})
	// 			);
	// 		}
	// 	}
	// }, [id, selectedData?.purchaseorder]);

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
			title: "Make",
			width: 100,
		},
		{
			title: "MRN Received Quantity",
			width: 200,
		},
		{
			title: "Balance Quantity",
			width: 200,
		},
		{
			title: "Quantity",
			width: 100,
		},
		{
			title: "Units",
			width: 100,
		},
		{
			title: "Batch",
			width: 100,
		},
		{
			title: "Price",
			width: 100,
		},
		{
			title: "Last Purchase Price",
			width: 200,
		},
		{
			title: "Tax Type",
			width: 100,
		},
		{
			title: "Tax",
			width: 100,
		},
		// {
		//     title: "Tax Amount",
		//     width: 100,
		// },
		// {
		//     title: "MRN Status",
		//     width: 100,
		// },

		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		make: string,
		receivedQty: string,
		balQty: string,
		quantity: JSX.Element,
		unit: JSX.Element,
		batch_name: JSX.Element,
		price: JSX.Element,
		pur_price: JSX.Element,
		taxtype: JSX.Element,
		tax: JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			make,
			receivedQty,
			balQty,
			quantity,
			unit,
			batch_name,
			price,
			pur_price,
			taxtype,
			tax,
			actions,
		};
	}

	const handleChangePage = (event: unknown, newPage: number) => {
		// dispatch(
		// 	getMaterialReceivedNotes({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getMaterialReceivedNotes({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};

	// add item form
	const mrnSchema = yup.object().shape({
		date: yup.string().required("Please select date"),
		purchaseorder: yup
			.object({
				label: yup.string().required("Please select a purchase order"),
				value: yup.string().required("Please select a purchase order"),
			})
			.required("Please select a purchase order"),
		vendor: yup
			.object({
				label: yup.string().required("Please select a vendor"),
				value: yup.string().required("Please select a vendor"),
			})
			.required("Please select a vendor"),
		location: yup
			.object({
				label: yup.string().required("Please select a location"),
				value: yup.string().required("Please select a location"),
			})
			.required("Please select a location"),
		warehouse: yup
			.object({
				label: yup.string().required("Please select a warehouse"),
				value: yup.string().required("Please select a warehouse"),
			})
			.required("Please select a warehouse"),
		invoice_document: yup
			.array()
			.required("Please upload invoice document"),
		invoice_date: yup.string().required("Please enter invoice date"),
		invoice_no: yup.string().trim().required("Please enter invoice number"),
		invoice_amount: yup
			.string()
			.trim()
			.required("Please enter invoice amount")
			.matches(
				/^[0-9 ]*$/,
				"invoice amount should not contain special characters"
			),
		// Adding validation for the array of items
		items: yup.array().of(
			yup.object().shape({
				quantity: yup
					.number()
					.min(1, "Quantity must be greater than 0")
					.typeError("Quantity is required")
					.required("Please enter quantity")
					.test("is-valid-quantity", function (value) {
						const { parent, createError } = this as yup.TestContext;
						const { bal_qty } = parent;

						if (value > bal_qty) {
							return createError({
								message: `Quantity exceeds batch quantity. Available quantity: ${bal_qty}`,
							});
						}
						return true;
					}),
				batch_name: yup.string().trim().required("Please enter batch"),
			})
		),
		description: yup.string().required("please enter a description"),
	});
	const {
		control,
		handleSubmit,
		reset: mrnReset,
		getValues,
		setValue,
	} = useForm<any>({
		mode: "all",
		resolver: yupResolver(mrnSchema),
	});
	const mrn_data = getValues();

	console.log(mrn_data);

	useMemo(() => {
		const values = {
			purchaseorder:
				mrn_data?.purchaseorder ||
				(selectedData?.purchaseorder?.id
					? {
							label: selectedData?.purchaseorder?.label,
							value: selectedData?.purchaseorder?.id,
						}
					: null),
			vendor:
				mrn_data?.vendor ||
				(selectedData?.vendor?.id
					? {
							label: selectedData?.vendor?.name,
							value: selectedData?.vendor?.id,
						}
					: null),
			location:
				mrn_data?.location ||
				(selectedData?.location
					? {
							label: selectedData?.location?.name,
							value: selectedData?.location?.id,
						}
					: null),
			warehouse:
				mrn_data?.warehouse ||
				(selectedData?.warehouse?.id
					? {
							label: selectedData?.warehouse?.name,
							value: selectedData?.warehouse?.id,
						}
					: null),
			invoice_document:
				mrn_data?.invoice_document ||
				(invoice_document ? invoice_document : null),
			invoice_date:
				mrn_data?.invoice_date ||
				(selectedData?.invoice_date
					? moment(selectedData?.invoice_date, "YYYY-MM-DD").format(
							"YYYY-MM-DD"
						)
					: ""),
			date:
				mrn_data?.date ||
				(selectedData?.date
					? moment(selectedData?.date, "YYYY-MM-DD").format(
							"YYYY-MM-DD"
						)
					: ""),
			invoice_no:
				mrn_data?.invoice_no ||
				(selectedData?.invoice_no ? selectedData?.invoice_no : ""),
			invoice_amount:
				mrn_data?.invoice_amount ||
				(selectedData?.invoice_amount
					? Number(selectedData?.invoice_amount)
					: ""),
			currency:
				mrn_data?.currency ||
				(selectedData?.currency?.id
					? {
							label: selectedData?.currency?.name,
							value: selectedData?.currency?.id,
						}
					: null),
			exchange_rate:
				mrn_data?.exchange_rate || selectedData?.exchange_rate,
			description:
				mrn_data?.description ||
				(selectedData?.description ? selectedData.description : ""),
		};

		setValue(
			"items",
			selectedItems &&
				selectedItems
					?.filter((e) => !e.dodelete)
					.map((item) => ({
						quantity: item?.qty ? item.qty : "",
						price: item.price ? item.price : "",
						batch_name: item?.batch_name ? item.batch_name : "",
						tax: item?.tax?.id
							? {
									label: item?.tax?.name,
									value: item?.tax,
								}
							: null,
						taxtype: item?.taxtype
							? {
									label: item?.taxtype?.name,
									value: item?.taxtype?.id,
								}
							: null,
						bal_qty: item?.balance_quantity
							? item.balance_quantity
							: "",
					}))
		);

		Object.entries(values).forEach(([key, value], idx) => {
			setValue(key, value);
		});
	}, [mrn_data, selectedData, selectedItems]);

	// useMemo(() => {}, [selectedItems]);

	const rows = useMemo(() => {
		return selectedItems
			?.filter((e) => !e.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);
				const quantity = (
					<Box
						sx={{
							width: 200,
						}}>
						<form action="">
							<FormInput
								control={control}
								name={`items.${key}.quantity`}
								helperText="Quantity"
								label=""
								type="number"
								placeholder="Enter quantity here..."
								onChange={(event) => {
									const enteredQty = event.target.value || "";
									const updatedItems = selectedItems ?? [];
									console.log("enteredQty", enteredQty);
									setValue(
										"items.${key}.quantity",
										enteredQty,
										{ shouldValidate: true }
									);
									const newItems = updatedItems.map(
										(item, idx) => {
											if (idx === key) {
												return {
													...item,
													qty: enteredQty,
												};
											}
											return item;
										}
									);
									dispatch(setSelectedItems(newItems));
								}}
							/>
						</form>
					</Box>
				);
				const unit = (
					<>
						<form action="">
							<Box>{row?.unit?.name}</Box>
						</form>
					</>
				);
				const batch_name = (
					<Box width={200}>
						<form action="">
							<FormInput
								control={control}
								name={`items.${key}.batch_name`}
								helperText="Batch"
								label=""
								type="text"
								placeholder="Enter Batch here..."
								onChange={(event) => {
									dispatch(
										setSelectedItems(
											selectedItems?.map((e, idx) => {
												if (idx === key) {
													return {
														...e,
														batch_name:
															event.target.value,
													};
												}
												return e;
											})
										)
									);
								}}
							/>
						</form>
					</Box>
				);
				const taxtype = (
					<Box
						sx={{
							width: 200,
						}}>
						<form action="">
							<SelectComponent
								name={`items.${key}.taxtype`}
								placeholder="Select a tax type..."
								label=""
								control={control}
								disabled={false}
								rules={{ required: true }}
								helperText="Tax Type"
								options={[
									{
										id: 1,
										name: "Inclusive",
									},
									{
										id: 2,
										name: "Exclusive",
									},
								]}
								onChange={(value) => {
									dispatch(
										setSelectedItems(
											selectedItems?.map((e) => {
												if (
													e?.item?.id ===
													row?.item?.id
												) {
													return {
														...e,
														taxtype: value,
													};
												}
												return e;
											})
										)
									);
								}}
							/>
						</form>
					</Box>
				);
				const tax = (
					<Box
						sx={{
							width: 200,
						}}>
						<form action="">
							<SelectComponent
								// name={`tax_${key}`}
								name={`items.${key}.tax`}
								label=""
								control={control}
								disabled={false}
								rules={{ required: true }}
								options={miniTax.list.map(
									(e: { id: any; name: string }) => ({
										id: e,
										name: e.name,
									})
								)}
								onChange={(value) => {
									dispatch(
										setSelectedItems(
											selectedItems?.map((e) => {
												if (
													e?.item?.id ===
													row?.item?.id
												) {
													return {
														...e,
														tax: value.value,
													};
												}
												return e;
											})
										)
									);
								}}
								loading={miniTax.loading}
								helperText={"Tax"}
								selectParams={{
									page: miniTax.miniParams.page,
									page_size: miniTax.miniParams.page_size,
									search: miniTax.miniParams.search,
									no_of_pages: miniTax.miniParams.no_of_pages,
								}}
								hasMore={
									miniTax.miniParams.page <
									miniTax.miniParams.no_of_pages
								}
								fetchapi={getMiniTax}
								clearData={clearMiniTax}
							/>
						</form>
					</Box>
				);
				const actions = (
					<Box
						sx={{
							justifyContent: "center",
							display: "flex",
							gap: 2,
						}}>
						<LuDelete
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={() => {
								const fiteredItems = selectedItems?.map((e) => {
									if (
										e?.item?.id == row?.item?.id &&
										e?.unit?.id == row?.unit?.id
									) {
										return {
											...e,
											dodelete: true,
											batch_name: "",
										};
									}
									return e;
								});
								// setV({
								// 	[`items.${key}.quantity`]: "",
								// 	[`items.${key}.price`]: "",
								// 	[`items.${key}.batch_name`]: "",
								// 	[`items.${key}.tax`]: null,
								// 	[`items.${key}.taxtype`]: null,
								// 	[`items.${key}.bal_qty`]: "",
								// });

								// Get current items array from form
								const currentItems = getValues("items") || [];
								// Remove the deleted item and reindex remaining items
								const updatedItems = currentItems.filter(
									(_: any, index: number) => index !== key
								);
								// Update form state
								setValue("items", updatedItems);
								dispatch(setSelectedItems(fiteredItems));
							}}
						/>
					</Box>
				);
				return createData(
					index,
					row?.item?.name ? row?.item?.name : "",
					row?.make?.name ? row?.make?.name : "",
					row?.received_quantity,
					row?.balance_quantity,
					quantity,
					unit,
					batch_name,
					<Typography width={200}>{row?.price}</Typography>,
					<Typography width={200}>
						{row?.last_purchase_value ??
							row?.purchase_price[0]?.last_purchase_value}
					</Typography>,
					<Typography width={200}>{row?.taxtype_name}</Typography>,
					<Typography width={200}>{row?.tax?.name}</Typography>,
					// status,
					actions
				);
			});
	}, [selectedData, createData]);

	const onSave = (payload: any) => {
		const findItem: any = selectedItems?.filter((item) => !item.dodelete);
		if (findItem?.length != 0) {
			const documents = invoice_document?.length
				? invoice_document.filter((item: any) => item?.path)
				: [];
			if (!quantityExceeded) {
				setQuantityExceeded(false);
				const data = {
					date: moment(payload?.date).format("YYYY-MM-DD"),
					invoice_no: payload?.invoice_no,
					invoice_amount: payload?.invoice_amount,
					invoice_date: moment(payload?.invoice_date).format(
						"YYYY-MM-DD"
					),
					project_id: projectId,
					vendor_id: payload?.vendor?.value,
					purchaseorder_id: payload.purchaseorder.value,
					location_id: payload?.location?.value,
					currency_id: payload?.currency?.value
						? payload?.currency?.value
						: "",
					exchange_rate: payload?.exchange_rate,
					warehouse_id: payload?.warehouse?.value,
					description: payload?.description,
					mrn_items:
						id == "0"
							? selectedItems
									?.filter((e) => !e.dodelete)
									?.map((item) => {
										return {
											qty: item?.quantity
												? item?.quantity
												: item?.qty,
											date: moment(payload?.date).format(
												"YYYY-MM-DD"
											),
											poitem_id: item?.id,
											item_id: item?.item?.id,
											make_id: item?.make?.id,
											unit_id: item?.unit?.id,
											batch_name: item?.batch_name,
											tax_id: item?.tax?.id,
											taxtype: item?.taxtype,
											price: item.price,
											description: payload?.description,
											dodelete: item?.dodelete,
										};
									})
							: selectedItems?.map((item) => {
									return {
										id: item.id ? item.id : "",
										date: moment(payload?.date).format(
											"YYYY-MM-DD"
										),
										make_id: item?.make?.id,
										qty: item?.quantity
											? item?.quantity
											: item?.qty,
										item_id: item?.item?.id,
										unit_id: item?.unit?.id,
										batch_name: item?.batch_name,
										poitem_id: item?.poitem?.id,
										tax_id: item?.tax?.id,
										taxtype: item?.taxtype?.id,
										price: item.price,
										description: payload?.description,
										dodelete: item?.dodelete,
									};
								}),
				};
				id == "0"
					? dispatch(
							postMaterialReceivedNotes({
								data,
								params: {
									...pageParams,
									project_id: projectId,
								},
								mrnReset,
								navigate,
								invoice_document: documents,
							})
						)
					: dispatch(
							editMaterialReceivedNotes({
								id: id ? id : "",
								data,
								params: {
									...pageParams,
									project_id: projectId,
								},
								mrnReset,
								navigate,
								invoice_document: invoice_document,
							})
						);
			} else {
				setQuantityExceeded(true);
			}
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">No Bid Items</p>`,
				text: "Please add atleast one material received item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	const addItem = (item: MrnItem) => {
		const findItem = selectedItems?.find(
			(f) =>
				f?.item?.id === item?.item?.id &&
				f?.make?.id === item?.make?.id &&
				f?.unit?.id === item?.unit?.id
		);
		const updateItems = (items: MrnItem[]) => {
			return dispatch(setSelectedItems(items));
		};

		if (!findItem) {
			updateItems([
				...selectedItems,
				{
					...item,
					poitem: item,
				},
			]);
		} else {
			if (findItem?.dodelete) {
				const a = selectedItems?.map((e) => {
					if (findItem?.id === e.id) {
						return {
							...e,
							...item,
							dodelete: false,
							poitem: item,
						};
					}
					return e;
				});
				updateItems(a);
			} else {
				Swal.fire({
					title: `<p style="font-size:20px">Item Exists</p>`,
					text: "",
					icon: "warning",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}
		}
	};
	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Material Received Notes`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card>
					<CardContent>
						<AddItemForm
							control={control}
							getValues={getValues}
							setValue={setValue}
							reset={mrnReset}
						/>
						<Divider
							sx={{
								mt: 2,
							}}
						/>
						<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }} mt={2}>
							<SelectComponent
								name="item"
								label="Select an Item"
								control={control}
								required
								options={
									POItems?.map((e: MrnItem) => ({
										id: e || "",
										name: `${e?.item?.name}` || "",
									})) || []
								}
								disabled={!selectedData?.purchaseorder?.value}
								helperText="Select Purchase Order before selecting an Item"
								onChange={(value) => {
									addItem(value.value);
									setValue("item", null);
								}}
								loading={loading}
								selectParams={{
									page: popageParams.page,
									page_size: popageParams.page_size,
									search: popageParams.search,
									no_of_pages: popageParams.no_of_pages,
									purchaseorder:
										selectedData?.purchaseorder?.value,
								}}
								hasMore={
									popageParams.page < popageParams.no_of_pages
								}
								fetchapi={getPOItems}
								clearData={clearPOItems}
							/>
						</Grid>
						<Box mt={2}>
							<TableComponent
								count={selectedItems?.length || 0}
								columns={columns}
								rows={rows ? rows : []}
								loading={false}
								page={1}
								pageSize={10}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
								containerHeight={440}
								showPagination={false}
							/>
							<Box mt={2}>
								<form action="">
									<Grid container spacing={2}>
										<Grid size={{ xs: 12, md: 6, lg: 3 }}>
											<TextArea
												name="description"
												label="Description"
												type="text"
												placeholder="Write Description here..."
												minRows={3}
												maxRows={5}
												containerSx={{
													display: "grid",
													gap: 1,
												}}
												control={control}
												// onChange={(event) => {
												// 	dispatch(
												// 		setSelectedData({
												// 			...selectedData,
												// 			description: event.target.value,
												// 		})
												// 	);
												// }}
											/>
										</Grid>
									</Grid>
								</form>
							</Box>

							<Box textAlign={"right"} mt={2}>
								<Button
									color="success"
									onClick={handleSubmit(
										onSave,
										(errors) => {}
									)}
									variant="contained"
									size="large">
									<LuSave
										size={18}
										style={{ marginRight: "6px" }}
									/>{" "}
									Save
								</Button>
							</Box>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddMaterialReceivedNotes;
