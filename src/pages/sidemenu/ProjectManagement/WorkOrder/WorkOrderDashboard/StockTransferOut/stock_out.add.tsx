import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	InputLabel,
	Stack,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CustomDatepicker, FormInput } from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
	Control,
	useForm,
	UseFormGetValues,
	UseFormReset,
	UseFormSetValue,
} from "react-hook-form";
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
	clearMiniUnits,
	clearWarehouseAgainstItems,
	clearWarehouseByProject,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniBatch,
	getMiniItems,
	getMiniItemsAgainstWarehouse,
	getMiniLocation,
	getMiniMake,
	getMiniUnits,
	getWarehouseByProject,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	clearBatchesAgainstItem,
	selectStockOut,
	setSelectedData,
} from "@src/store/sidemenu/project_management/StockTransferOut/stock_out.slice";
import ReadMore from "@src/components/ReadMoreText";
import TextArea from "@src/components/form/TextArea";
import {
	editStockOut,
	getStockBatchDetails,
	getStockDetails,
	getStockOut,
	getStockOutById,
	postStockOut,
} from "@src/store/sidemenu/project_management/StockTransferOut/stock_out.action";
import { v4 as uuidv4 } from "uuid";
import { updateSidenav } from "@src/store/customise/customise";
import { ItemAgainistBatch } from "@src/store/sidemenu/project_management/StockTransferOut/stock_out.types";
import { Warehouse, Watch } from "@mui/icons-material";
import { Items } from "@src/store/masters/Item/item.types";
import Loader from "@src/components/Loader";
import { getItemsById } from "@src/store/masters/Item/item.action";
import { itemsSelector } from "@src/store/masters/Item/item.slice";
import { systemSelector } from "@src/store/system/system.slice";

const AddItemForm = ({
	control,
	handleSubmit,
	reset,
	getValues,
	setValue,
	trigger,
	clearErrors,
	stockOutValues,
}: any) => {
	const dispatch = useAppDispatch();
	const {
		stockOut: {
			selectedData,
			stock_available,
			batchesAganistItem,
			stock_loading,
		},
		mini: { warehouseAgainstItems, miniUnits, miniBatch },
	} = useAppSelector((state) => selectStockOut(state));
	const { id, projectId } = useParams();
	const [batchQuantity, setBatchQuantity] = useState(0);

	const {
		items: { selectedData: itemSelectedData, },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			items: itemsSelector(state),
		};
	});
	interface SelectTypes {
		label: string;
		value: string;
	}

	const handleAddItem = (payload: {
		item: {
			label: string;
			value: Items;
		};
		batch: {
			label: string;
			value: ItemAgainistBatch;
		};
		// mc_status: SelectTypes;
		date: string;
		qty: string;
		unit: SelectTypes & {
			units: string;
		};
	}) => {

		let batch_quantity = 0;
		let batchQty = 0;
		let conversionBatchQty = 0;
		let conversionEnteredQuantity = 0;
		const findItem: any = selectedData?.soitems?.filter((e) => !e.dodelete)
			?.find((item: any) => {
				return (
					item?.item?.id == payload?.item?.value?.id &&
					item?.batch?.batch == payload?.batch?.value?.batch &&
					item?.unit?.value == payload?.unit?.value
				);
			});

		const addData = () => {
			const data = {
				...payload,
				item: payload?.item?.value,
				batch: payload?.batch?.value,
				// qty: batchQty,
				uuid: uuidv4(),
				dodelete: false,
			};
			dispatch(
				setSelectedData({
					...selectedData,
					soitems: [
						...(selectedData?.soitems || []),
						{
							...data,
						},
					],
				})
			);
		};
		if (!findItem) {
			addData();
			reset({
				item: null,
				batch: null,
				date: null,
				qty: "",
				status: null,
				description: "",
				unit: null,
			});
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">Item Exist</p>`,
				text: "Item with same Batch and Unit already exist.",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}

	};
	const formData = getValues();
	const batch = getValues("batch");
	const unit = getValues("unit");
	const qty = getValues("qty");

	useEffect(() => {
		if (batch && unit && qty) {
			trigger("qty");
		}
	}, [batch, unit, qty]);

	return (
		<Box mt={2}>
			<form action="" onSubmit={handleSubmit(handleAddItem)}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="item"
							label="Item"
							control={control}
							required
							options={warehouseAgainstItems.list.map(
								(e: { id: Items; name: string }) => ({
									id: e,
									name: e.name,
								})
							)}
							loading={warehouseAgainstItems.loading}
							selectParams={{
								page: warehouseAgainstItems.miniParams.page,
								page_size: warehouseAgainstItems.miniParams.page_size,
								search: warehouseAgainstItems.miniParams.search,
								no_of_pages:
									warehouseAgainstItems.miniParams.no_of_pages,
								project_id: projectId,
								warehouse_id: stockOutValues?.warehouse?.value
							}}
							disabled={!stockOutValues?.warehouse?.value}
							helperText={
								!stockOutValues?.warehouse?.value
									? "select a warehouose to proceed with item selection."
									: ""
							}
							onChange={async (value) => {
								if (stockOutValues?.warehouse?.value) {
									reset({
										item: value,
										batch: null,
										date: null,
										qty: "",
										status: null,
										description: "",
										unit: null,
									});
									Promise.all([
										dispatch(
											getStockDetails({
												project_id: `${projectId}`,
												warehouse_id:
													stockOutValues?.warehouse
														?.value,
												item_id: `${value?.value?.id}`,
											})
										),
										dispatch(getItemsById({ id: value?.value?.id }))
									]).then(([stockRes, itemRes]: [any, any]) => {
										let stockQuantity = parseFloat(stockRes?.payload?.response?.quantity);
										let unitName = itemRes?.payload?.response?.baseunit?.name ?? "";
										let stockQuantityFormatted = `${stockQuantity} ${unitName}`;
										setValue('stock_available', (stockQuantityFormatted));
									}).catch((err) => {
										console.error("Error fetching stock or batch details:", err);
									});
									setValue("item", value);
								} else {
									setValue("item", null);
									Swal.fire({
										title: `<p style="font-size:20px">Warning</p>`,
										text: "Please Select A Warehouse To Proceed With Item Selection",
										icon: "warning",
										confirmButtonText: `Close`,
										confirmButtonColor: "#3085d6",
									});
								}
							}}
							hasMore={
								warehouseAgainstItems.miniParams.page <
								warehouseAgainstItems.miniParams.no_of_pages
							}
							fetchapi={getMiniItemsAgainstWarehouse}
							clearData={clearWarehouseAgainstItems}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="stock_available"
							label="Available Stock"
							type="number"
							disabled
							placeholder="Available Stock"
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="batch"
							label="Batch"
							control={control}
							required
							options={
								batchesAganistItem?.list?.map((e) => ({
									id: e,
									name: `${e.batchname} (${parseInt(`${e?.quantity}`)} ${itemSelectedData?.baseunit?.name})`,
									qty: e?.quantity
								})) ?? []
							}
							disabled={!formData?.item?.value?.id}
							helperText={
								!formData?.item?.value?.id
									? "select an item to proceed with batch selection."
									: ""
							}
							onChange={async (value) => {
								if (!stockOutValues?.warehouse?.value) {
									setValue("batch", null);
									Swal.fire({
										title: `<p style="font-size:20px">Warning</p>`,
										text: "Please Select A Warehouse To Proceed With Batch Selection",
										icon: "warning",
										confirmButtonText: `Close`,
										confirmButtonColor: "#3085d6",
									});
								}
								batchesAganistItem?.list?.map((val) => {
									if (val?.batch == value?.id?.batch) {
										setBatchQuantity(Number(val?.quantity));
									}
								});
								let itemQtyUnits = `${parseInt(value?.qty ?? 0)} ${itemSelectedData?.baseunit?.name}`
								setValue("bal_qty", itemQtyUnits);
								setValue("unit", null);
								setValue("qty", "");
								clearErrors("qty");
							}}
							loading={batchesAganistItem.loading}
							selectParams={{
								page: batchesAganistItem.miniParams.page,
								page_size:
									batchesAganistItem.miniParams.page_size,
								search: batchesAganistItem.miniParams.search,
								no_of_pages:
									batchesAganistItem.miniParams.no_of_pages,
								project_id: projectId,
								warehouse_id: selectedData?.warehouse?.id,
								item_id: `${formData?.item?.value?.id}`,
							}}
							hasMore={
								batchesAganistItem.miniParams.page <
								batchesAganistItem.miniParams.no_of_pages
							}
							fetchapi={getStockBatchDetails}
							clearData={clearBatchesAgainstItem}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 1 }}>
						<FormInput
							name="bal_qty"
							label="Balance Qty"
							type="number"
							disabled
							placeholder="Bal Qty"
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 2 }}>
						<FormInput
							name="qty"
							label="Quantity"
							type="number"
							required
							placeholder="Enter quantity here..."
							control={control}
							onChange={(event) => {
								setValue("qty", event.target.value, { shouldValidate: true })
							}}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="unit"
							label="Unit"
							control={control}
							disabled={formData?.item?.value?.id ? false : true}
							required
							options={miniUnits.list.map(
								(e: { id: string | number; name: string; units: string }) => ({
									id: e.id,
									name: e.name,
									units: e?.units
								})
							)}
							loading={miniUnits.loading}
							onChange={(value) => {
								if (selectedData?.soitems && selectedData?.soitems?.length > 0) {
									let totalQty = 0;
									let deletedQty = 0;
									for (let i = 0; i < selectedData.soitems.length; i++) {
										let valItem = selectedData.soitems[i];

										if (!valItem?.id) {
											if (valItem?.item?.id == formData?.item?.value?.id && valItem?.batch?.batch == formData?.batch?.id?.batch) {
												let ItemQty = itemSelectedData?.baseunit?.name === valItem?.unit?.name
													? Number(valItem?.qty) * Number(valItem?.unit?.units)
													: Number(valItem?.qty) / Number(valItem?.unit?.units);
												totalQty += ItemQty;
												if (valItem?.dodelete === true) {
													let deletedItemQty = itemSelectedData?.baseunit?.name === valItem?.unit?.name
														? Number(valItem?.qty) * Number(valItem?.unit?.units)
														: Number(valItem?.qty) / Number(valItem?.unit?.units);
													deletedQty += deletedItemQty;
												}
												let itemQty = (+batchQuantity - totalQty) + deletedQty;
												let convertItemQty = itemQty * Number(value?.units)
												let convertItemQtyUnits = `${convertItemQty} ${value?.name}`
												setValue("bal_qty", convertItemQtyUnits)
											} else {
												let itemQty = batchQuantity * Number(value?.units)
												setValue("bal_qty", `${itemQty} ${value?.name}`)
											}
										} else {
											if (valItem?.item?.id == formData?.item?.value?.id && valItem?.batch?.batch == formData?.batch?.id?.batch) {
												if (valItem?.dodelete === true) {
													let deletedItemQty = itemSelectedData?.baseunit?.name === valItem?.unit?.name
														? Number(valItem?.qty) * Number(valItem?.unit?.units)
														: Number(valItem?.qty) / Number(valItem?.unit?.units);
													deletedQty += deletedItemQty;
												}
												let convertItemQty = (batchQuantity * Number(value?.units)) + deletedQty
												let convertItemQtyUnits = `${convertItemQty} ${value?.name}`
												setValue("bal_qty", convertItemQtyUnits)
											} else {
												let itemQty = batchQuantity * Number(value?.units)
												setValue("bal_qty", `${itemQty} ${value?.name}`)
											}
										}
									}
								} else {
									let itemQty = batchQuantity * Number(value?.units)
									setValue("bal_qty", `${itemQty} ${value?.name}`)
								}
							}}
							helperText={
								formData?.item?.value?.id
									? ""
									: "Select an item to see unit"
							}
							selectParams={{
								page: miniUnits.miniParams.page,
								page_size: miniUnits.miniParams.page_size,
								search: miniUnits.miniParams.search,
								no_of_pages: miniUnits.miniParams.no_of_pages,
								item: formData?.item?.value?.id,
							}}
							hasMore={
								miniUnits.miniParams.page <
								miniUnits.miniParams.no_of_pages
							}
							fetchapi={getMiniUnits}
							clearData={clearMiniUnits}
						/>
					</Grid>
					{/* <Grid size={{ xs: 12, md: 4, lg: 2 }}>
                        <SelectComponent
                            name="mc_status"
                            label="Status"
                            control={control}
                            required
                            options={MCSTATUS_CHOICES?.map((e: { id: number, name: string }) => ({
                                id: e.id,
                                name: e.name,
                            }))}
                        />
                    </Grid> */}
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<TextArea
							name="description"
							label="Description"
							type="text"
							placeholder="Write Description here..."
							minRows={3}
							required
							maxRows={5}
							containerSx={{
								display: "grid",
								gap: 1,
							}}
							control={control}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={5.5}>
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

const StockOutForm = ({
	control,
	setValue,
	reset,
	getValues,
}: {
	control: Control<any>;
	setValue: UseFormSetValue<any>;
	reset: UseFormReset<any>;
	getValues: UseFormGetValues<any>;
}) => {
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		stockOut: { selectedData, pageParams, stock_available },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			warehouseByProject,
		},
	} = useAppSelector((state) => selectStockOut(state));

	// const MCSTATUS_CHOICES = [
	//     { name: "Pending", id: 1 },
	//     { name: "Inprogress", id: 2 },
	//     { name: "Completed", id: 3 },
	//     { name: "Closed", id: 4 },
	// ]

	const formValues = getValues();

	return (
		<Grid size={{ xs: 12 }}>
			<form style={{ width: "100%" }}>
				<Box p={1}>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Stack width={"100%"}>
								<CustomDatepicker
									control={control}
									name="date"
									hideAddon
									required
									minDate={new Date()}
									dateFormat="DD-MM-YYYY"
									showTimeSelect={false}
									timeFormat="h:mm a"
									timeCaption="time"
									inputClass="form-input"
									label={"Date"}
									tI={1}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								name="warehouse"
								label="From Warehouse"
								control={control}
								required
								options={warehouseByProject?.list?.map(
									(e: { id: string; name: string }) => ({
										id: e.id,
										name: e.name,
									})
								)}
								disabled={id != "0" ? true : false}
								loading={warehouseByProject?.loading}
								selectParams={{
									page: warehouseByProject?.miniParams?.page,
									page_size:
										warehouseByProject?.miniParams
											?.page_size,
									search: warehouseByProject?.miniParams
										?.search,
									no_of_pages:
										warehouseByProject?.miniParams
											?.no_of_pages,
									project_id: projectId ? projectId : "",
									location: selectedData?.location?.id,
								}}
								hasMore={
									warehouseByProject?.miniParams?.page <
									warehouseByProject?.miniParams?.no_of_pages
								}
								onChange={(value) => {
									if (value?.value)
										if (
											value?.value !==
											formValues?.to_warehouse?.value
										) {
											setValue("warehouse", value);
											dispatch(setSelectedData({
												...selectedData,
												warehouse: value
											}))
										} else {
											setValue("warehouse", null);

											Swal.fire({
												title: `<p style="font-size:20px">Warning</p>`,
												text: '"From Warehouse" cannot be same as "To Warehouse"',
												icon: "warning",
												confirmButtonText: `Close`,
												confirmButtonColor: "#3085d6",
											});
										}
								}}
								fetchapi={getWarehouseByProject}
								clearData={clearWarehouseByProject}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								name="to_warehouse"
								label="To Warehouse"
								control={control}
								required
								options={warehouseByProject?.list?.map(
									(e: { id: string; name: string }) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={warehouseByProject?.loading}
								selectParams={{
									page: warehouseByProject?.miniParams?.page,
									page_size:
										warehouseByProject?.miniParams
											?.page_size,
									search: warehouseByProject?.miniParams
										?.search,
									no_of_pages:
										warehouseByProject?.miniParams
											?.no_of_pages,
									project_id: projectId ? projectId : "",
									location: selectedData?.location?.id,
								}}
								hasMore={
									warehouseByProject?.miniParams?.page <
									warehouseByProject?.miniParams?.no_of_pages
								}
								onChange={(value) => {
									if (value?.value)
										if (
											!(
												value?.value !==
												formValues?.warehouse?.value
											)
										) {
											setValue("to_warehouse", null);
											Swal.fire({
												title: `<p style="font-size:20px">Warning</p>`,
												text: '"To Warehouse" cannot be same as "From Warehouse"',
												icon: "warning",
												confirmButtonText: `Close`,
												confirmButtonColor: "#3085d6",
											});
										}
								}}
								fetchapi={getWarehouseByProject}
								clearData={clearWarehouseByProject}
							/>
						</Grid>
						{/* <Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
                            <SelectComponent
                                name="mc_status"
                                label="Consumption Status"
                                control={control}
                                required
                                options={MCSTATUS_CHOICES?.map((e: { id: number, name: string }) => ({
                                    id: e.id,
                                    name: e.name,
                                }))}
                            />
                        </Grid> */}
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

const AddStockOut = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		mini: { miniBatch, miniUnits },
		stockOut: { selectedData, pageParams, stock_available },
	} = useAppSelector((state) => selectStockOut(state));
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
			dispatch(getStockOutById({ id: id ? id : "" }));
		}
	}, [id]);

	const stSchema = yup.object().shape({
		date: yup.string().required("Please select a date"),
		warehouse: yup
			.object({
				label: yup.string().required("Please select from warehouse"),
				value: yup.string().required("Please select from warehouse"),
			})
			.required("Please select from warehouse"),
		to_warehouse: yup
			.object({
				label: yup.string().required("Please select to warehouse"),
				value: yup.string().required("Please select to warehouse"),
			})
			.required("Please select to warehouse"),
		description: yup.string().trim().required("please enter a description"),
		// mc_status: yup
		//     .object({
		//         label: yup.string().required("Please select a consumption status"),
		//         value: yup.string().required("Please select a consumption status"),
		//     })
		//     .required("Please select a consumption status"),
	});

	const {
		control,
		handleSubmit,
		reset: stReset,
		getValues: stGetValues,
		setValue: stsetValue,
	} = useForm<any>({
		mode: "all",
		resolver: yupResolver(stSchema),
	});

	const {
		items: { selectedData: itemSelectedData, },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			items: itemsSelector(state),
		};
	});

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
				to_warehouse: selectedData?.to_warehouse?.id
					? {
						label: selectedData?.to_warehouse?.name,
						value: selectedData?.to_warehouse?.id,
					}
					: null,
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
		// {
		// 	title: "Available Stock",
		// 	width: 100,
		// },
		{
			title: "Quantity",
			width: 100,
		},
		{
			title: "Units",
			width: 100,
		},
		// {
		//     title: "Status",
		//     width: 100,
		// },
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
		// availableStock: JSX.Element,
		quantity: string | number,
		unit: JSX.Element,
		description: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			item_name,
			batch,
			// availableStock,
			quantity,
			unit,
			description,
			actions,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.soitems
			?.filter((e) => !e.dodelete)
			?.map((row: any, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);
				const description = (
					<ReadMore
						text={row.description ? row.description : ""}
						maxLength={30}
					/>
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
								const fiteredItems = selectedData.soitems?.map(
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
										soitems: fiteredItems,
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
					row?.item?.name,
					`${row?.batch?.batchname} (${parseInt(`${row?.batch?.quantity}`)} ${itemSelectedData?.baseunit?.name})`,
					// <Typography>{stock_available}</Typography>,
					parseFloat(row.qty),
					row?.unit?.label ? row?.unit.label : row?.unit?.name,
					// row?.mc_status_name,
					description,
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
	const itemSchema = yup.object().shape({
		item: yup.object({
			label: yup.string().required("Please select a item"),
			value: yup.object().required("Please select a item"),
		}),
		batch: yup.object({
			label: yup.string().required("Please select a batch"),
			value: yup.object().required("Please select a batch"),
		}),
		description: yup.string().required("Please enter a description"),
		qty: yup
			.number()
			.required("Please enter quantity")
			.min(1, "Quantity must be greater than 0")
			.typeError("Quantity is required")
			.test("is-valid-quantity", function (value) {
				const { parent, createError } = this as yup.TestContext;
				const { batch, unit, bal_qty } = parent;
				const [number, units] = bal_qty?.split(" ");

				if (batch && unit && value) {
					if (value > number) {
						return createError({
							message: `Quantity exceeds batch quantity. Available quantity: ${(bal_qty)}`,
						});
					}
				}

				return true;
			}),

		unit: yup.object().shape({
			label: yup.string().required("Please select a unit"),
			value: yup.string().required("Please select a unit"),
		})
			.required("Please select a unit")
	});

	const {
		control: addItemController,
		handleSubmit: handleItemSubmit,
		getValues: getValuesItem,
		setValue: setValue,
		trigger,
		clearErrors,
		reset,
	} = useForm<any>({
		mode: "all",
		resolver: yupResolver(itemSchema,),
	});

	const onSave = (payload: any) => {
		const findItem: any = selectedData?.soitems?.filter(
			(item) => !item.dodelete
		);
		if (findItem?.length != 0) {
			const soitems = selectedData?.soitems?.map((item) => {
				return {
					id: item?.id,
					item_id: item?.item?.id || "",
					batch_id: item?.batch?.batch || "",
					unit_id: item?.unit?.id || "",
					qty: parseInt(`${item?.qty}`) || 0,
					description: item?.description || "",
					dodelete: Boolean(item.dodelete),
				};
			});
			const data = {
				project_id: projectId || "",
				date: payload.date
					? moment(payload.date).format("YYYY-MM-DD")
					: "",
				description: payload?.description || "",
				warehouse_id: payload?.warehouse?.value || "",
				to_warehouse_id: payload?.to_warehouse?.value || "",
				soitems:
					id == "0"
						? soitems?.filter((item) => !item.dodelete) || []
						: soitems || [],
			};
			id == "0"
				? dispatch(
					postStockOut({
						data,
						params: {
							...pageParams,
						},
						callback: (response) => {
							stReset();
							navigate(-1);
						},
					})
				)
				: dispatch(
					editStockOut({
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
				text: "Please add atleast one Stock Transfer Out item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	const stockOutValues = stGetValues();

	useMemo(() => {
		if (id == "0") {
			reset({
				item: null,
				batch: null,
				date: null,
				qty: "",
				status: null,
				description: "",
				unit: null,
			});
			dispatch(
				setSelectedData({
					...selectedData,
					soitems: [],
				})
			);
		}
	}, [stockOutValues?.warehouse?.value]);

	useEffect(() => {
		if (id != "0" && stockOutValues?.warehouse?.value) {
			selectedData?.soitems?.forEach((item) => {
				dispatch(
					getStockDetails({
						project_id: projectId || "",
						warehouse_id: stockOutValues?.warehouse?.value,
						item_id: item?.item?.id || "",
					})
				).then((res: any) => {
					setValue(
						"available_stock",
						res.payload?.response?.quantity
					);
				});
				dispatch(getItemsById({ id: item?.item?.id }))
			});
		}
	}, [selectedData, stockOutValues?.warehouse?.value]);

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Stock Transfer Out`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card>
					<CardContent>
						<StockOutForm
							control={control}
							setValue={stsetValue}
							reset={stReset}
							getValues={stGetValues}
						/>
						<Divider />
						<AddItemForm
							control={addItemController}
							handleSubmit={handleItemSubmit}
							reset={reset}
							getValues={getValuesItem}
							stockOutValues={stockOutValues}
							setValue={setValue}
							trigger={trigger}
							clearErrors={clearErrors}
						/>
						<Box mt={2}>
							<TableComponent
								count={selectedData?.soitems?.length ?? 0}
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
									Save Stock Transfer Out
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

export default AddStockOut;
