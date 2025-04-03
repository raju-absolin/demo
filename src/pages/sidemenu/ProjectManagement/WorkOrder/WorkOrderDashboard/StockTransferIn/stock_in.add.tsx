import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CustomDatepicker, FormInput } from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import Swal from "sweetalert2";
import { LuDelete, LuSave } from "react-icons/lu";
import {
	clearMiniBatch,
	clearMiniItems,
	clearMiniLocation,
	clearMiniMake,
	clearMiniStockTransferOut,
	clearMiniUnits,
	clearMiniWarehouse,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniBatch,
	getMiniItems,
	getMiniLocation,
	getMiniMake,
	getMiniStockTransferOut,
	getMiniUnits,
	getMiniWarehouse,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	selectStockIn,
	setSelectedData,
} from "@src/store/sidemenu/project_management/StockTransferIn/stock_in.slice";
import ReadMore from "@src/components/ReadMoreText";
import TextArea from "@src/components/form/TextArea";
import {
	editStockIn,
	getStockIn,
	getStockInById,
	postStockIn,
} from "@src/store/sidemenu/project_management/StockTransferIn/stock_in.action";
import { v4 as uuidv4 } from "uuid";
import { updateSidenav } from "@src/store/customise/customise";
import { getStockOutById } from "@src/store/sidemenu/project_management/StockTransferIn/stock_in.action";

const StockInForm = ({
	onSave,
	handleSubmit,
	control,
	getValues,
	setValue,
}: {
	onSave: (value: any) => void;
	handleSubmit: any;
	control: Control<any>;
	getValues: any;
	setValue: any;
}) => {
	const dispatch = useAppDispatch();
	const {
		stockIn: { selectedData, pageParams },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniStockTransferOut,
			miniWarehouse,
		},
	} = useAppSelector((state) => selectStockIn(state));
	const { id, projectId } = useParams();

	const stock_transfer_out = getValues("stocktransferout");

	return (
		<Grid size={{ xs: 12 }}>
			<form style={{ width: "100%" }} onSubmit={handleSubmit(onSave)}>
				<Box p={1}>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
							<Stack width={"100%"}>
								<CustomDatepicker
									control={control}
									name="date"
									hideAddon
									minDate={new Date()}
									dateFormat="DD-MM-YYYY"
									showTimeSelect={false}
									required
									timeFormat="h:mm a"
									timeCaption="time"
									inputClass="form-input"
									label={"Date"}
									tI={1}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
							<SelectComponent
								name="stocktransferout"
								label="Stock Transfer Out"
								control={control}
								required
								options={miniStockTransferOut?.list?.map(
									(e: { id: string; code: string }) => ({
										id: e.id,
										name: e.code,
									})
								)}
								helperText={
									id !== "0"
										? "Stock Out dropdown is disabled for selection"
										: ""
								}
								onChange={(value) => {
									dispatch(setSelectedData({
										...selectedData,
										stocktransferout: value,
										from_warehouse: null,
										warehouse: null,
										siitems: []
									}));
								}}
								disabled={
									id !== "0"
										? true
										: false
								}
								loading={miniStockTransferOut?.loading}
								selectParams={{
									page: miniStockTransferOut?.miniParams
										?.page,
									page_size:
										miniStockTransferOut?.miniParams
											?.page_size,
									search: miniStockTransferOut?.miniParams
										?.search,
									no_of_pages:
										miniStockTransferOut?.miniParams
											?.no_of_pages,
									project: projectId ? projectId : "",
									location: selectedData?.location?.id,
								}}
								hasMore={
									miniStockTransferOut?.miniParams?.page <
									miniStockTransferOut?.miniParams
										?.no_of_pages
								}
								fetchapi={getMiniStockTransferOut}
								clearData={clearMiniStockTransferOut}
							/>
						</Grid>
						<Grid mt={3.7}>
							<Button
								color="primary"
								variant="contained"
								size="large"
								disabled={
									!stock_transfer_out?.value || id !== "0"
										? true
										: false
								}
								onClick={() =>
									dispatch(
										getStockOutById({
											id: stock_transfer_out
												? stock_transfer_out.value
												: "",
										})
									).then((res: any) => {
										setValue("from_warehouse", {
											value: res.payload?.response
												?.warehouse?.id,
											label: res.payload?.response
												?.warehouse?.name,
										});
										setValue("warehouse", {
											value: res.payload?.response
												?.to_warehouse?.id,
											label: res.payload?.response
												?.to_warehouse?.name,
										});
									})
								}>
								Load Items
							</Button>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
							<SelectComponent
								name="from_warehouse"
								label="From Warehouse"
								control={control}
								required
								options={miniWarehouse?.list?.map(
									(e: { id: string; name: string }) => ({
										id: e.id,
										name: e.name,
									})
								)}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
							<SelectComponent
								name="warehouse"
								label="To Warehouse"
								control={control}
								required
								options={miniWarehouse?.list?.map(
									(e: { id: string; name: string }) => ({
										id: e.id,
										name: e.name,
									})
								)}
							/>
						</Grid>
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
				</Box>
			</form>
		</Grid>
	);
};

const AddStockIn = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		mini: { miniBatch, miniUnits },
		stockIn: { selectedData, pageParams },
	} = useAppSelector((state) => selectStockIn(state));

	const [quantityExceeded, setQuantityExceeded] = useState(false);
	const [siquantity, setSIQuantity] = useState<any>(0);
	const [maxQty, setMaxQty] = useState<any>([]);

	const [rowQuantities, setRowQuantities] = useState(
		selectedData?.siitems?.map(() => 0) || [] // Initialize quantities as 0 or from initial data
	);
	const [rowErrors, setRowErrors] = useState(
		selectedData?.siitems?.map(() => "") || []
	);

	function clearDataFn() {
		dispatch(setSelectedData({}));
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
			dispatch(getStockInById({ id: id ? id : "" }));
		}
	}, [id]);

	const stSchema = yup.object().shape({
		date: yup.string().required("Please select a date"),
		stocktransferout: yup
			.object({
				label: yup
					.string()
					.required("Please select a stock transfer out"),
				value: yup
					.string()
					.required("Please select a stock transfer out"),
			})
			.required("Please select a stock transfer out"),
		warehouse: yup
			.object({
				label: yup.string().required("Please select from warehouse"),
				value: yup.string().required("Please select from warehouse"),
			})
			.required("Please select from warehouse"),
		from_warehouse: yup
			.object({
				label: yup.string().required("Please select to warehouse"),
				value: yup.string().required("Please select to warehouse"),
			})
			.required("Please select to warehouse"),
		description: yup.string().trim().required("please enter a remarks"),
		items: yup.array().of(
			yup.object().shape({
				qty: yup
					.number()
					.min(1, "Quantity must be greater than 0")
					.typeError("Quantity is required")
					.required("Please enter quantity")
					// .test("is-valid-quantity", function (value) {
					// 	const { parent, createError } = this as yup.TestContext;
					// 	const { bal_qty } = parent;

					// 	if (value > bal_qty) {
					// 		return createError({
					// 			message: `Quantity exceeds batch quantity. Available quantity: ${(bal_qty)}`,
					// 		});
					// 	}
					// 	return true;
					// })
					,
			})
		),
	});

	const {
		control,
		handleSubmit,
		getValues: getValuesStock,
		reset: stReset,
		setValue,
	} = useForm<any>({
		resolver: yupResolver(stSchema),
	});
	useEffect(() => {
		if (selectedData) {
			const maxValues = selectedData?.soitemQty?.map(
				(item: any, index: number) => {
					if (item?.qty !== undefined) {
						return parseInt(item?.qty || 0);
					}
				}
			);
			setMaxQty(maxValues);
		} else {
			setMaxQty([]); // Default to an empty array
		}
		// if (id !== "0") {
		// 	selectedData?.siitems?.forEach((item) => {
		// 		setSIQuantity(item?.qty);
		// 	});
		// }
	}, [selectedData]);

	useEffect(() => {
		id != "0" &&
			stReset({
				date: selectedData?.date
					? moment(selectedData.date, "YYYY-MM-DD").toISOString()
					: "",
				description: selectedData?.description
					? selectedData.description
					: "",
				warehouse: selectedData?.warehouse?.id
					? {
						label: selectedData?.warehouse?.name,
						value: selectedData?.warehouse?.id,
					}
					: null,
				from_warehouse: selectedData?.from_warehouse?.id
					? {
						label: selectedData?.from_warehouse?.name,
						value: selectedData?.from_warehouse?.id,
					}
					: null,
				stocktransferout: selectedData?.stocktransferout?.id
					? {
						label: selectedData?.stocktransferout?.code,
						value: selectedData?.stocktransferout?.id,
					}
					: null,
				items:
					selectedData?.siitems &&
					selectedData.siitems.map((item) => ({
						qty: item.qty ? Number(item.qty) : "",
					})),
			});
	}, [selectedData]);

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
			title: "Batch",
			width: 100,
		},
		{
			title: "Stock Out Quantity",
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
			title: "Description",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		item_name: string,
		batch: string,
		st_quantity: string | number,
		quantity: JSX.Element,
		unit: JSX.Element,
		// status: JSX.Element,
		description: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			item_name,
			batch,
			st_quantity,
			quantity,
			unit,
			// status,
			description,
			actions,
		};
	}
	const rows = useMemo(() => {
		return selectedData?.siitems
			?.filter((e) => !e.dodelete)
			?.map((row: any, key: number) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);
				const maxQtyValue = maxQty?.[key] || 0;
				const description = (
					<ReadMore
						text={row.description ? row.description : ""}
						maxLength={30}
					/>
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
								name={`items.${key}.qty`}
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
									if (enteredQty > maxQtyValue) {
										updatedErrors[key] =
											`Quantity exceeds maximum limit of ${maxQtyValue}.`;
										setQuantityExceeded(true);
									} else if (
										enteredQty > Number(maxQtyValue)
									) {
										updatedErrors[key] =
											`Quantity exceeds stock out quantity of ${maxQtyValue}.`;
										setQuantityExceeded(true);
									} else {
										updatedErrors[key] = "";
										setQuantityExceeded(false);
									}
									setRowErrors(updatedErrors);

									const updatedItems =
										selectedData?.siitems ?? [];

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

									dispatch(
										setSelectedData({
											...selectedData,
											siitems: newItems,
										})
									);
									if (!updatedErrors[key]) {
										setSIQuantity(event.target.value);
									}
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
								const fiteredItems = selectedData.siitems?.map(
									(e: any) => {
										if (e?.item?.id == row?.item?.id &&
											e?.unit?.id == row?.unit?.id) {
											return {
												...e,
												dodelete: true,
											};
										}
										return e;
									}
								);
								dispatch(
									setSelectedData({
										...selectedData,
										siitems: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);
				const unit = (
					<>
						<form action="">
							<SelectComponent
								name="unit"
								label="Unit"
								control={control}
								disabled={true}
								required
								options={miniUnits.list.map(
									(e: {
										id: string | number;
										name: string;
									}) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={miniUnits.loading}
								helperText={""}
								selectParams={{
									page: miniUnits.miniParams.page,
									page_size: miniUnits.miniParams.page_size,
									search: miniUnits.miniParams.search,
									no_of_pages:
										miniUnits.miniParams.no_of_pages,
									item: row?.item?.id ? row?.item?.id : "",
								}}
								hasMore={
									miniUnits.miniParams.page <
									miniUnits.miniParams.no_of_pages
								}
								fetchapi={getMiniUnits}
								clearData={clearMiniUnits}
							/>
						</form>
					</>
				);
				return createData(
					index,
					row?.item?.label ? row?.item.label : row?.item?.name,
					row?.batch?.label ? row?.batch.label : row?.batch?.name,
					maxQtyValue,
					quantity,
					row?.unit?.label ? row?.unit.label : row?.unit?.name,
					// row?.mc_status_name,
					description,
					actions
				);
			});
	}, [selectedData, rowErrors, createData, maxQty]);

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

	const onSave = (payload: any) => {
		const findItem: any = selectedData?.siitems?.filter(
			(item) => !item.dodelete
		);
		if (findItem?.length != 0) {
			const data = {
				project_id: projectId,
				date: moment(payload.date).format("YYYY-MM-DD"),
				description: payload?.description,
				from_warehouse_id: payload?.from_warehouse?.value,
				warehouse_id: payload?.warehouse?.value,
				stocktransferout_id: payload?.stocktransferout?.value,
				siitems:
					id == "0"
						? selectedData?.siitems
							?.filter((item) => !item.dodelete)
							?.map((item) => {
								return {
									date: moment(payload.date).format(
										"YYYY-MM-DD"
									),
									item_id: item?.item?.id,
									batch_id: item?.batch?.id,
									unit_id: item?.unit
										? item.unit?.id
										: "",
									qty: item.qty,
									description: item?.description,
									// mc_status: item?.mc_status?.value,
									dodelete: item.dodelete,
								};
							})
						: selectedData?.siitems?.map((item) => {
							return {
								id: item?.id,
								date: moment(payload.date).format(
									"YYYY-MM-DD"
								),
								item_id: item?.item?.id,
								batch_id: item?.batch?.id,
								unit_id: item?.unit?.id
									? item.unit?.id
									: "",
								qty: item.qty,
								description: item?.description,
								// mc_status: item?.mc_status,
								dodelete: item.dodelete,
							};
						}),
			};
			id == "0"
				? dispatch(
					postStockIn({
						data,
						params: {
							...pageParams,
						},
						stReset,
						navigate,
					})
				)
				: dispatch(
					editStockIn({
						id: id ? id : "",
						data,
						params: {
							...pageParams,
						},
						stReset,
						navigate,
					})
				);
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">Info</p>`,
				text: "Please add atleast one Stock Transfer In item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};
	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Stock Transfer In`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card>
					<CardContent>
						<StockInForm
							onSave={onSave}
							handleSubmit={handleSubmit}
							control={control}
							getValues={getValuesStock}
							setValue={setValue}
						/>
						<Divider />
						{/* <AddItemForm
							control={addItemController}
							handleSubmit={handleItemSubmit}
							reset={reset}
							getValues={getValuesItem}
						/> */}
						<Box mt={2}>
							<TableComponent
								count={selectedData?.siitems?.length ?? 0}
								columns={columns}
								rows={rows ? rows : []}
								loading={false}
								containerHeight={440}
								page={1}
								pageSize={10}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
								showPagination={false}
							/>

							{/* <Grid size={{ xs: 12 }}> */}
							<Box mt={2} flex={1} textAlign={"end"}>
								<Button
									color="success"
									type="submit"
									onClick={handleSubmit(onSave)}
									variant="contained"
									size="large">
									<LuSave
										size={18}
										style={{
											marginRight: "6px",
										}}
									/>{" "}
									Save Stock Transfer In
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

export default AddStockIn;
