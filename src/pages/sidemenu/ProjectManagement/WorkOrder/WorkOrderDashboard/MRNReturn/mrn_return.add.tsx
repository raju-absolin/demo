import { yupResolver } from "@hookform/resolvers/yup";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	FormHelperText,
	FormLabel,
	IconButton,
	InputLabel,
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
	clearMiniMRN,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniEnquiry,
	getMiniMake,
	getPurchaseOrderMini,
	getMiniLocation,
	getMiniTax,
	getWarehouseByProject,
	getMiniMRN,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	setSelectedData,
	setSelectedItems,
	setUploadDocument,
} from "@src/store/sidemenu/project_management/MRNReturn/mrn_return.slice";
import {
	editMRNReturn,
	getBatchQuantity,
	getMRNById,
	getMRNReturnById,
	getStockDetails,
	postMRNReturn,
	postMRNReturnDocuments,
} from "@src/store/sidemenu/project_management/MRNReturn/mrn_return.action";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import TextArea from "@src/components/form/TextArea";
import { updateSidenav } from "@src/store/customise/customise";
import { selectMRNReturn } from "@src/store/sidemenu/project_management/MRNReturn/mrn_return.slice";
import Dropzone from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { FileUploadOutlined } from "@mui/icons-material";
import { MrnReturnItem } from "@src/store/sidemenu/project_management/MRNReturn/mrn_return.types";

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
		mrnReturn: { documents },
	} = useAppSelector((state) => selectMRNReturn(state));
	function handleDismiss() {
		const filter = !file?.id
			? documents?.filter((e: any) => e.uuid != file.uuid)
			: documents?.map((e: any) =>
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
					console.log("file", file);
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

const AddMRNReturn = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		mrnReturn: {
			selectedData,
			pageParams,
			batchAgainstItemsList,
			documents,
			selectedItems,
		},
		mini: {
			miniEnquiry,
			miniPurchaseOrder,
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			warehouseByProject,
			miniMRN,
		},
	} = useAppSelector((state) => selectMRNReturn(state));

	const [quantityExceeded, setQuantityExceeded] = useState(false);
	const [mrnquantity, setMRNQuantity] = useState<any>(0);

	const [rowQuantities, setRowQuantities] = useState(
		selectedItems?.map(() => 0) || [] // Initialize quantities as 0 or from initial data
	);
	const [rowErrors, setRowErrors] = useState(
		selectedItems?.map(() => "") || []
	);

	function clearDataFn() {
		dispatch(setSelectedItems([]));
		dispatch(setSelectedData({}));
		reset({
			items: [],
			mrn: null,
			vendor: null,
			location: null,
			warehouse: null,
			description: "",
			invoice_date: "",
			date: "",
		});
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
			dispatch(getMRNReturnById({ id: id ? id : "" }));
		}
		setQuantityExceeded(false);
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
			title: "Balance Quantity",
			width: 100,
		},
		{
			title: "Returned Quantity",
			width: 100,
		},
		{
			title: "MRN Quantity",
			width: 100,
		},
		{
			title: "Available Stock",
			width: 100,
		},
		{
			title: "Batch",
			width: 100,
		},
		{
			title: "Batch Qty",
			width: 100,
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
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		balQuantity: string,
		rejectedQuantity: string,
		mrnQuantity: string | number,
		stockavailable: JSX.Element,
		batch_name: JSX.Element,
		batchQuantity: JSX.Element,
		quantity: JSX.Element,
		unit: JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			balQuantity,
			rejectedQuantity,
			mrnQuantity,
			stockavailable,
			batch_name,
			batchQuantity,
			quantity,
			unit,
			actions,
		};
	}
	const handleChangePage = (event: unknown, newPage: number) => {
		// dispatch(
		// 	getMRNReturn({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getMRNReturn({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};

	// add item form
	const mrnReturnSchema = yup.object().shape({
		mrn: yup
			.object({
				label: yup.string().required("Please select a mrn"),
				value: yup.string().required("Please select a mrn"),
			})
			.required("Please select a mrn"),
		date: yup.string().required("Please select date"),
		// vendor: yup
		//     .object({
		//         label: yup.string().required("Please select a vendor"),
		//         value: yup.string().required("Please select a vendor"),
		//     })
		//     .required("Please select a vendor"),
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
		items: yup.array().of(
			yup.object().shape({
				quantity: yup
					.number()
					.typeError("Quantity must be a number")
					.required("Quantity is required")
					.positive("Quantity must be greater than zero")
					.test(
						"max-quantity",
						"Quantity cannot be greater than the original quantity",
						function (value) {
							const { originalqty } = this.parent;
							return (
								originalqty === undefined ||
								value <= originalqty
							);
						}
					),
				// batch_name: yup
				//     .string()
				//     .trim()
				//     .required("Please enter batch_name")
			})
		),
		description: yup.string().required("please enter a description"),
	});
	const { control, handleSubmit, reset, getValues, setValue } = useForm<any>({
		resolver: yupResolver(mrnReturnSchema),
		[id == "0" ? "defaultValues" : "values"]: {
			mrn: selectedData?.mrn?.id
				? {
					label: selectedData?.mrn?.code,
					value: selectedData?.mrn?.id,
				}
				: null,
			vendor: selectedData?.vendor?.id
				? {
					label: selectedData?.vendor?.name,
					value: selectedData?.vendor?.id,
				}
				: null,
			location: selectedData?.location
				? {
					label: selectedData?.location?.name,
					value: selectedData?.location?.id,
				}
				: null,
			warehouse: selectedData?.warehouse?.id
				? {
					label: selectedData?.warehouse?.name,
					value: selectedData?.warehouse?.id,
				}
				: null,
			date: selectedData?.date
				? moment(selectedData?.date, "YYYY-MM-DD").format("YYYY-MM-DD")
				: "",
			description: selectedData?.description
				? selectedData.description
				: "",
			file: selectedData?.file ? documents : "",
			items:
				selectedItems &&
				selectedItems.map((item) => ({
					quantity: item?.qty ? item.qty : "",
					price: item.price ? item.price : "",
					batch: item?.batch ? item.batch?.name : "",
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
					mrn_item: item?.id
						? {
							label: item?.code,
							value: item?.id,
						}
						: null,
				})),
		},
	});
	const materialreceivednotes = getValues("mrn");
	const rows = useMemo(() => {
		return selectedItems
			?.filter((e) => !e.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const stockavailable = (
					<>
						{row?.stockavailable} {row?.item?.baseunit?.name ?? ""}
					</>
				);
				const batchQuantity = (
					<>
						{row?.batchQuantity} {row?.item?.baseunit?.name ?? ""}
					</>
				);
				const quantity = (
					<Box
						sx={
							{
								// width: 200,
							}
						}>
						<form action="">
							<FormInput
								control={control}
								name={`items.${key}.quantity`}
								helperText="Quantity"
								label=""
								type="number"
								placeholder="Enter quantity here..."
								onChange={(event) => {
									const enteredQty =
										parseFloat(event.target.value) || 0;
									const updatedQuantities = [
										...rowQuantities,
									];
									updatedQuantities[key] = enteredQty;
									setRowQuantities(updatedQuantities);
									const updatedErrors = [...rowErrors];
									if (
										enteredQty > Number(row?.stockavailable)
									) {
										updatedErrors[key] =
											`Quantity exceeds maximum limit of ${Number(row?.stockavailable)}.`;
										setQuantityExceeded(true);
									} else if (enteredQty > Number(row?.qty)) {
										updatedErrors[key] =
											`Quantity exceeds mrn quantity of ${row?.qty}.`;
										setQuantityExceeded(true);
									} else {
										updatedErrors[key] = "";
										setQuantityExceeded(false);
									}
									setRowErrors(updatedErrors);

									const updatedItems = selectedItems ?? [];

									const newItems = updatedItems.map(
										(item, idx) => {
											if (idx === key) {
												return {
													...item,
													quantity: enteredQty,
												};
											}
											return item;
										}
									);
									dispatch(setSelectedItems(newItems));
								}}
							/>
							{rowErrors[key] && (
								<Typography
									color="error"
									variant="body2"
									sx={{ mt: 1 }}>
									{rowErrors[key]}
								</Typography>
							)}
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
								const fiteredItems =
									selectedData?.mrnreturn_items?.map(
										(e: MrnReturnItem) => {
											if (
												e?.item?.id == row?.item?.id &&
												e?.unit?.id == row?.unit?.id
											) {
												return {
													...e,
													dodelete: true,
												};
											}
											return e;
										}
									);
								dispatch(setSelectedItems(fiteredItems));
							}}
						/>
					</Box>
				);
				const mrnQuantity = parseInt((row?.qty ?? 0).toString());
				const mrnQunatityWithUnits = `${mrnQuantity} ${row?.item?.baseunit?.name ?? ""}`;
				const rejectQuantity = row?.rejected_quantity;
				const mrnrejectQunatityWithUnits = `${rejectQuantity} ${row?.item?.baseunit?.name ?? ""}`;
				const balQuantity = row?.balance_quantity;
				const mrnbalQunatityWithUnits = `${balQuantity} ${row?.item?.baseunit?.name ?? ""}`;
				return createData(
					index,
					row?.item?.name ? row?.item?.name : "",
					mrnbalQunatityWithUnits,
					mrnrejectQunatityWithUnits,
					mrnQunatityWithUnits,
					stockavailable,
					<Typography sx={{ textAlign: "center" }}>
						{row?.batch?.name}
					</Typography>,
					batchQuantity,
					quantity,
					unit,
					actions
				);
			});
	}, [selectedData, createData]);

	const onSave = (payload: any) => {
		const findItem: any = selectedItems?.filter((item) => !item.dodelete);
		const document = documents?.length
			? documents.map((e: any) => e.originalObj)
			: [];
		if (findItem?.length != 0) {
			if (!quantityExceeded) {
				setQuantityExceeded(false);
				const data = {
					date: moment(payload?.date).format("YYYY-MM-DD"),
					project_id: projectId,
					vendor_id: payload?.vendor?.value,
					mrn_id: payload.mrn?.value,
					location_id: payload?.location?.value,
					warehouse_id: payload?.warehouse?.value,
					description: payload?.description,
					mrnreturn_items:
						id == "0"
							? selectedItems
								?.filter((e) => !e.dodelete)
								?.map((item) => {
									return {
										date: moment(payload?.date).format(
											"YYYY-MM-DD"
										),
										qty: item?.quantity
											? item?.quantity
											: item?.qty,
										mrn_item_id: item?.id,
										item_id: item?.item?.id,
										unit_id: item?.unit?.id,
										batch_id: item?.batch?.id,
										description: payload?.description,
										dodelete: item?.dodelete,
									};
								})
							: selectedItems?.map((item) => {
								return {
									date: moment(payload?.date).format(
										"YYYY-MM-DD"
									),
									id: item.id ? item.id : "",
									qty: item?.quantity
										? item?.quantity
										: item?.qty,
									item_id: item?.item?.id,
									unit_id: item?.unit?.id,
									batch_id: item?.batch?.id,
									mrn_item_id: item?.id,
									description: payload?.description,
									dodelete: item?.dodelete,
								};
							}),
				};

				id == "0"
					? dispatch(
						postMRNReturn({
							data,
							params: {
								...pageParams,
								project_id: projectId,
							},
							reset,
							navigate,
							document,
						})
					)
					: dispatch(
						editMRNReturn({
							id: id ? id : "",
							data,
							params: {
								...pageParams,
								project_id: projectId,
							},
							reset,
							navigate,
							document,
						})
					);
			} else {
				setQuantityExceeded(true);
			}
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">No MRN Return Items</p>`,
				text: "Please add atleast one MRN Return item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

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
		const uploadDocuments = [...(documents || []), modifiedFiles[0]];

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
	const addItem = (item: MrnReturnItem) => {
		const findItem = selectedItems?.find(
			(f) =>
				f?.item?.id === item?.item?.id &&
				f?.batch?.id === item?.batch?.id &&
				f?.unit?.id === item?.unit?.id
		);
		const updateItems = (items: MrnReturnItem[]) => {
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
					if (
						e?.item?.id === item?.item?.id &&
						e?.batch?.id === item?.batch?.id &&
						e?.unit?.id === item?.unit?.id
					) {
						return {
							...e,
							dodelete: false,
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

	const getDate = getValues("date");

	useEffect(() => {
		if (materialreceivednotes?.value) {
			dispatch(
				getMRNById({
					id: materialreceivednotes?.value || "",
				})
			).then((res: any) => {
				setValue("vendor", {
					label: res?.payload?.response?.vendor?.name,
					value: res?.payload?.response?.vendor?.id,
				});
				setValue("location", {
					label: res?.payload?.response?.location?.name,
					value: res?.payload?.response?.location?.id,
				});
				setValue("warehouse", {
					label: res?.payload?.response?.warehouse?.name,
					value: res?.payload?.response?.warehouse?.id,
				});
				dispatch(
					setSelectedData({
						...selectedData,
						location: res?.payload?.response?.location,
						warehouse: res?.payload?.response?.warehouse,
						vendor: res?.payload?.response?.vendor,
						mrnreturn_items: res?.payload?.response?.mrn_items,
					})
				);
			});
		}
	}, [materialreceivednotes?.value]);
	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Material Received Notes Return`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card>
					<CardContent>
						<Box mt={0}>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, md: 6, lg: 3}}>
									<Stack width={"100%"}>
										<CustomDatepicker
											control={control}
											name="date"
											hideAddon
											minDate={new Date()}
											dateFormat="DD-MM-YYYY"
											showTimeSelect={false}
											timeFormat="h:mm a"
											required
											timeCaption="time"
											inputClass="form-input"
											label={"Date"}
											tI={1}
										/>
									</Stack>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<SelectComponent
										name="mrn"
										label="Material Received Notes"
										control={control}
										required
										options={miniMRN?.list?.map(
											(e: {
												id: string | number;
												code: string;
											}) => ({
												id: e.id,
												name: e.code,
											})
										)}
										helperText={
											id !== "0"
												? "MRN dropdown is disabled for selection"
												: ""
										}
										disabled={id !== "0" ? true : false}
										loading={miniMRN.loading}
										selectParams={{
											page: miniMRN.miniParams.page,
											page_size:
												miniMRN.miniParams.page_size,
											search: miniMRN.miniParams.search,
											no_of_pages:
												miniMRN.miniParams.no_of_pages,
											project: projectId ? projectId : "",
										}}
										hasMore={
											miniMRN.miniParams.page <
											miniMRN.miniParams.no_of_pages
										}
										fetchapi={getMiniMRN}
										clearData={clearMiniMRN}
										onChange={(value) => {
											dispatch(setSelectedItems([]));
											setValue("mrn", value)
											setValue("vendor", null)
											setValue("location", null)
											setValue("warehouse", null)
											setValue("invoice_date", "")
											// reset({
											// 	mrn: value,
											// 	date: formattedDate,
											// 	items: [],
											// 	vendor: null,
											// 	location: null,
											// 	warehouse: null,
											// 	invoice_date: "",
											// });
										}}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<SelectComponent
										name="location"
										label="Location"
										control={control}
										required
										options={miniLocationList.map(
											(e: {
												id: string;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										loading={miniLocationLoading}
										selectParams={{
											page: miniLocationParams.page,
											page_size:
												miniLocationParams.page_size,
											search: miniLocationParams.search,
											no_of_pages:
												miniLocationParams.no_of_pages,
										}}
										onChange={(value) => {
											dispatch(
												setSelectedData({
													...selectedData,
													location: value,
												})
											);
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
										name="warehouse"
										label="Warehouse"
										control={control}
										required
										options={warehouseByProject?.list?.map(
											(e: {
												id: string;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										loading={warehouseByProject?.loading}
										disabled={!selectedData?.location}
										selectParams={{
											page: warehouseByProject?.miniParams
												?.page,
											page_size:
												warehouseByProject?.miniParams
													?.page_size,
											search: warehouseByProject
												?.miniParams?.search,
											no_of_pages:
												warehouseByProject?.miniParams
													?.no_of_pages,
											project_id: projectId
												? projectId
												: "",
											location:
												selectedData?.location?.value,
										}}
										helperText={
											!selectedData?.location?.value
												? "Select a location to see warehouse"
												: ""
										}
										onChange={(value) => {
											dispatch(
												setSelectedData({
													...selectedData,
													warehouse: value,
												})
											);
										}}
										hasMore={
											warehouseByProject?.miniParams
												?.page <
											warehouseByProject?.miniParams
												?.no_of_pages
										}
										fetchapi={getWarehouseByProject}
										clearData={clearWarehouseByProject}
									/>
								</Grid>

								{materialreceivednotes?.value &&
									selectedData?.vendor?.name && (
										<Grid
											size={{
												xs: 12,
												md: 6,
												lg: 3,
												xl: 2,
											}}>
											{/* <SelectComponent
										name="vendor"
										label="Vendor"
										control={control}
										rules={{ required: true }}
										options={
											vendorsByMRN
												? vendorsByMRN?.map(
														(e: {
															id: string;
															name: string;
														}) => ({
															id: e.id,
															name: e.name,
														})
													)
												: []
										}
										disabled={
											!materialreceivednotes?.value ||
											id !== "0"
												? true
												: false
										}
										helperText={
											!materialreceivednotes?.value
												? "Select a mrn to see vendors"
												: id !== "0"
													? "Vendor dropdown is disabled for selection"
													: ""
										}
										// loading={miniVendors.loading}
										// selectParams={{
										// 	id: purchase_order?.value,
										// }}
										// hasMore={false}
										// fetchapi={getVendorByEnquiryId}
										// clearData={clearVendorsByPE}
									/> */}

											<InputLabel
												sx={{
													".MuiInputLabel-asterisk": {
														color: "red",
													},
												}}
												style={{
													fontWeight: "medium",
													marginBottom: "7px",
												}}>
												{"Vendor Name & Code"}
											</InputLabel>
											<Typography>
												{selectedData?.vendor?.name} (
												{selectedData?.vendor?.code})
											</Typography>
										</Grid>
									)}
							</Grid>
							<Grid container spacing={2} mt={2}>
								<Grid size={{ xs: 12, md: 6, lg: 3}}>
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
								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<ScrollableList>
										{documents?.length != 0 &&
											documents?.map(
												(document: any) => {
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
								</Grid>
							</Grid>
						</Box>
						{/* <AddItemForm
							control={control}
							getValues={getValues}
							setValue={setValue}
						/> */}
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
								rules={{ required: true }}
								options={
									selectedData?.mrnreturn_items?.map(
										(e: MrnReturnItem) => ({
											id: e || "",
											name:
												`${e?.item?.name} (${e?.code})` ||
												"",
										})
									) || []
								}
								onChange={(value) => {
									if (selectedData?.warehouse?.id) {
										Promise.all([
											dispatch(
												getStockDetails({
													project_id: `${projectId}`,
													warehouse_id:
														selectedData?.warehouse
															?.id,
													item_id: `${value.value?.item?.id}`,
												})
											),
											dispatch(
												getBatchQuantity({
													item_id:
														value.value?.item?.id,
													project_id: projectId,
													warehouse_id:
														selectedData?.warehouse?.id,
													no_of_pages: 0,
													page_size: 0,
													page: 1,
												})
											),
										])
											.then(
												([stockRes, batchRes]: [
													any,
													any,
												]) => {
													const stockAvailable =
														parseFloat(
															stockRes?.payload
																?.response
																?.quantity || 0
														);

													const batchQuantity =
														batchRes?.payload?.response?.results?.reduce(
															(
																acc: number,
																val: {
																	batch: string;
																	quantity: string;
																}
															) =>
																acc +
																parseFloat(
																	val?.quantity
																),
															0
														) || 0;

													addItem({
														...value.value,
														stockavailable:
															stockAvailable,
														batchQuantity,
													});
												}
											)
											.catch((err) => {
												console.error(
													"Error fetching stock or batch details:",
													err
												);
											});
									} else if (!materialreceivednotes?.value) {
										Swal.fire({
											title: `<p style="font-size:20px">Warning</p>`,
											text: "Please select a material received note",
											icon: "warning",
											confirmButtonText: `Close`,
											confirmButtonColor: "#3085d6",
										});
									} else {
										Swal.fire({
											title: `<p style="font-size:20px">Warning</p>`,
											text: "Please select a warehouse",
											icon: "warning",
											confirmButtonText: `Close`,
											confirmButtonColor: "#3085d6",
										});
									}
									setValue("item", null);
								}}
							/>
						</Grid>

						<Box mt={2}>
							<TableComponent
								count={selectedItems?.length ?? 0}
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
												required
												placeholder="Write Description here..."
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
								</form>
							</Box>

							<Box textAlign={"right"} mt={2}>
								<Button
									color="success"
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
						</Box>
					</CardContent>
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddMRNReturn;
