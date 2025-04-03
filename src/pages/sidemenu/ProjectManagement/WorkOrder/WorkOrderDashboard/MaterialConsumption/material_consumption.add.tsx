import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card, CardContent, Divider, Stack } from "@mui/material";
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
	clearBatchQuantity,
	selectMaterialConsumption,
	setSelectedData,
} from "@src/store/sidemenu/project_management/MaterialConsumption/material_consumption.slice";
import ReadMore from "@src/components/ReadMoreText";
import TextArea from "@src/components/form/TextArea";
import {
	editMaterialConsumption,
	getBatchQuantity,
	getMaterialConsumption,
	getMaterialConsumptionById,
	getStockDetails,
	postMaterialConsumption,
} from "@src/store/sidemenu/project_management/MaterialConsumption/material_consumption.action";
import { v4 as uuidv4 } from "uuid";
import { updateSidenav } from "@src/store/customise/customise";
import { systemSelector } from "@src/store/system/system.slice";
import { itemsSelector } from "@src/store/masters/Item/item.slice";
import { getItemsById } from "@src/store/masters/Item/item.action";
import { Items } from "@src/store/masters/Item/item.types";
import { ItemAgainistBatch } from "@src/store/sidemenu/project_management/StockTransferOut/stock_out.types";

const AddItemForm = ({ control, handleSubmit, reset, getValues, setValue, trigger,clearErrors }: any) => {
	const dispatch = useAppDispatch();
	const {
		materialConsumption: { selectedData, batchAgainstItemsList, stock_available, batchPageParams, batchloading },
		mini: { warehouseAgainstItems, miniUnits, miniBatch },
	} = useAppSelector((state) => selectMaterialConsumption(state));
	const {
		items: { selectedData: itemSelectedData, },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			items: itemsSelector(state),
		};
	});
	const [batchQuantity, setBatchQuantity] = useState(0);

	const { projectId, id } = useParams();
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
		const findItem: any = selectedData?.mc_items?.filter((e) => !e.dodelete)
			?.find(
				(item: any) =>
					item?.item?.value == payload?.item?.value &&
					item?.batch?.batch == payload?.batch?.value?.batch &&
					item?.unit?.value == payload?.unit?.value
			);

		const addData = () => {
			const data = {
				...payload,
				item: payload?.item,
				batch: payload?.batch?.value,
				// qty: batchQty,
				uuid: uuidv4(),
				dodelete: false,
			};
			dispatch(
				setSelectedData({
					...selectedData,
					mc_items: [
						...(selectedData?.mc_items || []),
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
				reset({
					item: null,
					batch: null,
					date: null,
					qty: "",
					description: "",
					unit: null,
				});
			} else {
				Swal.fire({
					title: `<p style="font-size:20px">Item Exist</p>`,
					text: "Item with same Make and Unit already added.",
					icon: "warning",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}
		} else {
			addData();
			reset({
				item: null,
				batch: null,
				date: null,
				qty: "",
				description: "",
				unit: null,
			});
		}
	};
	const formData = getValues();

	const getValuesItem = getValues("item");

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
							options={warehouseAgainstItems?.list?.map(
								(e: { id: string | number; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							helperText={
								!selectedData?.warehouse?.id
									? "Select a warehouse before selecting an item"
									: ""
							}
							disabled={!selectedData?.warehouse?.id}
							onChange={(value) => {
								if (selectedData?.warehouse?.id && value) {
									Promise.all([
										dispatch(
											getStockDetails({
												project_id: `${projectId}`,
												warehouse_id:
													selectedData?.warehouse
														?.id,
												item_id: `${value?.id}`,
											})
										),
										dispatch(getItemsById({ id: value?.id }))
									]).then(([stockRes, itemRes]: [any, any]) => {
										let stockQuantity = parseFloat(stockRes?.payload?.response?.quantity) ?? 0;
										let unitName = itemRes?.payload?.response?.baseunit?.name ?? "";
										let stockQuantityFormatted = `${stockQuantity} ${unitName}`;
										setValue('stock_available', stockQuantityFormatted);
									}).catch((err) => {
										console.error("Error fetching stock or batch details:", err);
									});
									reset({
										item: value,
										batch: null,
										date: null,
										qty: "",
										description: "",
										unit: null,
									});
								} else {
									reset({
										item: null,
										batch: null,
										date: null,
										qty: "",
										description: "",
										unit: null,
									});
								}
							}}
							loading={warehouseAgainstItems.loading}
							selectParams={{
								page: warehouseAgainstItems.miniParams.page,
								page_size: warehouseAgainstItems.miniParams.page_size,
								search: warehouseAgainstItems.miniParams.search,
								no_of_pages:
									warehouseAgainstItems.miniParams.no_of_pages,
								project_id: projectId,
								warehouse_id: selectedData?.warehouse?.id

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
								batchAgainstItemsList?.map((e) => ({
									id: e,
									name:
										`${e?.batchname} (${parseFloat(e?.quantity)} ${itemSelectedData?.baseunit?.name})` ||
										"",
									qty: e?.quantity

								})) ?? []
							}
							onChange={(value) => {
								batchAgainstItemsList?.map((val) => {
									if (val?.batch == value?.id?.batch) {
										setBatchQuantity(parseFloat(val?.quantity));
									}
								})
								let itemQtyUnits = `${parseInt(value?.qty ?? 0)} ${itemSelectedData?.baseunit?.name}`
								setValue("bal_qty", itemQtyUnits);
								setValue("unit", null);
								setValue("qty", "", { shouldValidate: false });
								clearErrors("qty"); 
							}}
							loading={batchloading}
							selectParams={{
								page: batchPageParams.page,
								page_size:
									batchPageParams.page_size,
								search: batchPageParams.search,
								no_of_pages:
									batchPageParams.no_of_pages,
								project_id: projectId,
								warehouse_id: selectedData?.warehouse?.id,
								item_id: getValuesItem?.value,
							}}
							hasMore={
								batchPageParams.page <
								batchPageParams.no_of_pages
							}
							fetchapi={getBatchQuantity}
							clearData={clearBatchQuantity}
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
							required
							type="number"
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
							disabled={getValuesItem ? false : true}
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
								if (selectedData?.mc_items && selectedData?.mc_items?.length > 0) {
									let totalQty = 0;
									let deletedQty = 0;
									for (let i = 0; i < selectedData.mc_items.length; i++) {
										let valItem = selectedData.mc_items[i];
										if (!valItem?.id) {
											if (valItem?.item?.id == formData?.item?.value && valItem?.batch?.batch == formData?.batch?.id?.batch) {
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
											if (valItem?.item?.id == formData?.item?.value && valItem?.batch?.batch == formData?.batch?.id?.batch) {
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
								getValuesItem
									? ""
									: "Select an item to see unit"
							}
							selectParams={{
								page: miniUnits.miniParams.page,
								page_size: miniUnits.miniParams.page_size,
								search: miniUnits.miniParams.search,
								no_of_pages: miniUnits.miniParams.no_of_pages,
								item: getValuesItem?.value,
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

const MaterialConsumptionForm = ({
	onSave,
	handleSubmit,
	control,
	reset
}: {
	onSave: (value: any) => void;
	handleSubmit: any;
	reset: any;
	control: Control<any>;
}) => {
	const dispatch = useAppDispatch();
	const { projectId } = useParams();
	const {
		materialConsumption: { selectedData, pageParams },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			warehouseByProject,
		},
	} = useAppSelector((state) => selectMaterialConsumption(state));

	const MCSTATUS_CHOICES = [
		{ name: "Pending", id: 1 },
		{ name: "Inprogress", id: 2 },
		{ name: "Completed", id: 3 },
		{ name: "Closed", id: 4 },
	];

	return (
		<Grid size={{ xs: 12 }}>
			<form style={{ width: "100%" }} onSubmit={handleSubmit(onSave)}>
				<Box p={1}>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Stack width={"100%"}>
								<CustomDatepicker
									control={control}
									name="date"
									required
									hideAddon
									dateFormat="DD-MM-YYYY"
									minDate={new Date()}
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
								label="Warehouse"
								control={control}
								required
								options={warehouseByProject?.list?.map(
									(e: { id: string; name: string }) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={warehouseByProject?.loading}
								onChange={(value) => {
									dispatch(setSelectedData({
										...selectedData,
										warehouse: value,
									}));
									reset({
										item: null,
										batch: null,
										date: null,
										qty: "",
										description: "",
										unit: null,
									});
								}}
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
								fetchapi={getWarehouseByProject}
								clearData={clearWarehouseByProject}
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

const AddMaterialConsumption = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		mini: { miniBatch, miniUnits },
		materialConsumption: { selectedData, pageParams },
	} = useAppSelector((state) => selectMaterialConsumption(state));

	function clearDataFn() {
		dispatch(setSelectedData({}));
	}

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
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		clearDataFn();
	}, []);

	useEffect(() => {
		if (id !== "0") {
			dispatch(getMaterialConsumptionById({ id: id ? id : "" }));
		}
	}, [id]);
	useEffect(() => {
		if (id !== "0") {
			selectedData?.mc_items?.forEach((item) => {
				Promise.all([
					dispatch(
						getStockDetails({
							project_id: `${projectId}`,
							warehouse_id: selectedData?.warehouse?.id,
							item_id: `${item?.item?.id}`,
						})
					),
					dispatch(
						getBatchQuantity({
							item_id: item?.item?.id,
							project_id: projectId,
							warehouse_id: selectedData?.warehouse?.id,
							no_of_pages: 0,
							page_size: 10,
							page: 1,
						})
					),
					dispatch(getItemsById({ id: item?.item?.id }))
				])
			});
		}
	}, [selectedData]);

	const mcSchema = yup.object().shape({
		date: yup.string().required("Please select a date"),
		warehouse: yup
			.object({
				label: yup.string().required("Please select a warehouse"),
				value: yup.string().required("Please select a warehouse"),
			})
			.required("Please select a warehouse"),
		description: yup.string().trim().required("please enter a remarks"),
	});

	const {
		control,
		handleSubmit,
		reset: mcReset,
	} = useForm<any>({
		resolver: yupResolver(mcSchema),
	});

	useEffect(() => {
		if (!id && selectedData?.mc_items) {
			selectedData?.mc_items?.forEach((item) => {
				dispatch(getItemsById({ id: item?.item?.id }))
			});
		}
	}, [selectedData?.mc_items]);

	useEffect(() => {
		id != "0" &&
			mcReset({
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
		batch: JSX.Element,
		quantity: string | number,
		unit: JSX.Element,
		description: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			item_name,
			batch,
			quantity,
			unit,
			description,
			actions,
		};
	}
	const rows = useMemo(() => {
		return selectedData?.mc_items
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
								const fiteredItems = selectedData.mc_items?.map(
									(e: any) => {
										if (e.item.value == row?.item?.value &&
											e?.batch?.value == row?.batch?.value &&
											e?.unit?.value == row?.unit?.value) {
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
										mc_items: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);
				return createData(
					index,
					row?.item?.name,
					row?.batch?.batchname,
					// batch,
					parseInt(row.qty),
					row?.unit?.name,
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
			value: yup.string().required("Please select a item"),
		}),
		batch: yup.object({
			label: yup.string().required("Please select a batch"),
			value: yup.object({
				project: yup.string().required("Project is required"),
				projectname: yup.string().required("Project name is required"),
				item: yup.string().required("Item is required"),
				itemname: yup.string().required("Item name is required"),
				batch: yup.string().required("Batch ID is required"),
				batchname: yup.string().required("Batch name is required"),
				quantity: yup
					.string()
					.matches(/^\d+(\.\d+)?$/, "Quantity must be a valid number")
					.required("Quantity is required"),
			}).required("Please select a batch"),
		}),
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
		description: yup.string().required("Please enter a description"),
		unit: yup.object({
			label: yup.string().required("Please select a unit"),
			value: yup.string().required("Please select a unit"),
		}).required("Please select a unit")
	});

	const {
		control: addItemController,
		handleSubmit: handleItemSubmit,
		getValues: getValuesItem,
		trigger,
		reset,
		setValue,
		clearErrors,
	} = useForm<any>({
		resolver: yupResolver(itemSchema),
	});

	const onSave = (payload: any) => {
		const findItem: any = selectedData?.mc_items?.filter(
			(item) => !item.dodelete
		);

		if (findItem?.length != 0) {
			const data = {
				project_id: projectId,
				date: moment(payload.date).format("YYYY-MM-DD"),
				description: payload?.description,
				warehouse_id: payload?.warehouse?.value,
				mc_items:
					id == "0"
						? selectedData?.mc_items
							?.filter((item) => !item.dodelete)
							?.map((item) => {
								return {
									item_id: item?.item?.value,
									batch_id: item?.batch?.batch,
									unit_id: item?.unit
										? item.unit?.value
										: "",
									qty: item.qty,
									description: item?.description,
									dodelete: item.dodelete,
								};
							})
						: selectedData?.mc_items?.map((item) => {
							return {
								id: item?.id,
								item_id: item?.item?.id,
								batch_id: item?.batch?.batch,
								unit_id: item?.unit?.id
									? item.unit?.id
									: "",
								qty: item.qty,
								description: item?.description,
								dodelete: item.dodelete,
							};
						}),
			};
			id == "0"
				? dispatch(
					postMaterialConsumption({
						data,
						params: {
							...pageParams,
						},
						mcReset,
						navigate,
					})
				)
				: dispatch(
					editMaterialConsumption({
						id: id ? id : "",
						data,
						params: {
							...pageParams,
						},
						mcReset,
						navigate,
					})
				);
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">Info</p>`,
				text: "Please add atleast one Material Consumption item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};


	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Material Consumption`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card>
					<CardContent>
						<MaterialConsumptionForm
							onSave={onSave}
							handleSubmit={handleSubmit}
							control={control}
							reset={reset}
						/>
						<Divider />
						<AddItemForm
							control={addItemController}
							handleSubmit={handleItemSubmit}
							reset={reset}
							setValue={setValue}
							getValues={getValuesItem}
							trigger={trigger}
							clearErrors={clearErrors}
						/>
						<Box mt={2}>
							<TableComponent
								count={selectedData?.mc_items?.length ?? 0}
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
									Save Material Consumption
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

export default AddMaterialConsumption;
