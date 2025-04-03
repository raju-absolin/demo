import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { CustomDatepicker, FormInput } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import {
	getMiniBatch,
	getMiniItems,
	getMiniItemsAgainstWarehouse,
	getMiniUnits,
	getMiniWarehouse,
} from "@src/store/mini/mini.Action";
import {
	clearMiniBatch,
	clearMiniItems,
	clearMiniUnits,
	clearMiniWarehouse,
	clearWarehouseAgainstItems,
} from "@src/store/mini/mini.Slice";
import { miniType } from "@src/store/mini/mini.Types";
import {
	useDeliveryChallanAction,
	getStockDetails,
	getBatchQuantity,
} from "@src/store/sidemenu/project_management/DeliveryChallan/DC.action";
import {
	clearBatchQuantity,
	useDeliveryChallanSelector,
} from "@src/store/sidemenu/project_management/DeliveryChallan/DC.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { Control, useForm } from "react-hook-form";
import { LuBook } from "react-icons/lu";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { getItemsById } from "@src/store/masters/Item/item.action";
import { itemsSelector } from "@src/store/masters/Item/item.slice";

interface Params {
	control: Control;
	getValues: (params?: string) => void;
	setValue: (key: string, value: any) => void;
}

export const AddItemForm = () => {
	const { projectId, id } = useParams();
	const dispatch = useAppDispatch();
	const {
		deliveryChallan: {
			selectedData,
			stock_available,
			batchAgainstItemsList,
			batchPageParams,
			batchloading,
		},
		mini: { warehouseAgainstItems, miniUnits, miniBatch },
	} = useDeliveryChallanSelector();
	const {
		reducer: { setSelectedData },
		extraReducer: {},
	} = useDeliveryChallanAction();

	const {
		items: { selectedData: itemSelectedData },
	} = useAppSelector((state) => {
		return {
			items: itemsSelector(state),
		};
	});

	const [batchQuantity, setBatchQuantity] = useState(0);
	const [quantityError, setQuantityError] = useState(false);

	const RFPItemsScheme = yup.object().shape({
		qty: yup
			.number()
			.typeError("Quantity must be a number")
			.required("Quantity is required")
			.positive("Quantity must be greater than zero")
			.test("is-valid-quantity", function (value) {
				const { parent, createError } = this as yup.TestContext;
				const { batch, unit, bal_qty } = parent;
				const [number, units] = bal_qty?.split(" ");

				if (batch && unit && value) {
					if (value > number) {
						return createError({
							message: `Quantity exceeds batch quantity. Available quantity: ${bal_qty}`,
						});
					}
				}

				return true;
			}),
		item: yup
			.object({
				label: yup.string().required("Please select a item"),
				value: yup.string().required("Please select a item"),
			})
			.required("Please select a item"),
		unit: yup
			.object({
				label: yup.string().required("Please select a unit"),
				value: yup.string().required("Please select a unit"),
			})
			.required("Please select a unit"),
		description: yup.string().required("Please select a description"),
	});

	const {
		control,
		handleSubmit,
		reset,
		getValues,
		setValue,
		trigger,
		clearErrors,
	} = useForm<any>({
		resolver: yupResolver(RFPItemsScheme),
	});

	const batch = getValues("batch");
	const unit = getValues("unit");
	const qty = getValues("qty");

	useEffect(() => {
		if (batch && unit && qty) {
			trigger("qty");
		}
	}, [batch, unit, qty]);
	interface SubmitPayload {
		item: miniType;
		batch: miniType;
		qty: string;
		unit: miniType & {
			units: string;
		};
		description: string;
	}

	const getValuesItem = getValues("item");

	const handleAdditem = handleSubmit((payload: SubmitPayload) => {
		const findItem: any = selectedData?.dchallan_items
			?.filter((e) => !e.dodelete)
			?.find(
				(item: any) =>
					item?.item?.value == payload?.item?.value &&
					item?.batch?.value == payload?.batch?.value &&
					item?.unit?.value == payload?.unit?.value
			);

		const addData = () => {
			const data = {
				...payload,
				// qty: batchQty,
				dodelete: false,
			};

			setSelectedData({
				...selectedData,
				dchallan_items: [
					...(selectedData?.dchallan_items || []),
					{
						...data,
					},
				],
			} as any);
		};

		if (findItem) {
			if (findItem?.dodelete) {
				addData();
				reset({
					item: null,
					make: null,
					batch: null,
					qty: "",
					description: "",
					unit: null,
				});
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
			if (!quantityError) {
				addData();
				reset({
					item: null,
					make: null,
					batch: null,
					qty: "",
					description: "",
					unit: null,
				});
			} else {
				Swal.fire({
					title: `<p style="font-size:20px">Quantity Error</p>`,
					text: `Quantity exceeds`,
					icon: "warning",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				setQuantityError(false);
			}
		}
	});
	const formData = getValues();
	return (
		<Box mt={0}>
			<form onSubmit={handleAdditem}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12 }}>
						<Typography
							bgcolor={"grey.200"}
							component={"h5"}
							sx={{
								p: "8px",
								display: "flex",
								alignItems: "center",
								mt: 1,
								textTransform: "uppercase",
							}}>
							<LuBook size={20} style={{ marginRight: "6px" }} />

							<Typography
								component={"span"}
								fontSize={"16px"}
								variant="body1">
								Add Items
							</Typography>
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 2 }}>
						<SelectComponent
							required
							name="item"
							label="Item"
							control={control}
							rules={{ required: true }}
							options={warehouseAgainstItems.list.map(
								(e: { id: string | number; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							disabled={!selectedData?.warehouse?.value}
							loading={warehouseAgainstItems.loading}
							helperText={
								!selectedData?.warehouse?.value
									? "Select warehouse before selecting an item"
									: ""
							}
							selectParams={{
								page: warehouseAgainstItems.miniParams.page,
								page_size:
									warehouseAgainstItems.miniParams.page_size,
								search: warehouseAgainstItems.miniParams.search,
								no_of_pages:
									warehouseAgainstItems.miniParams
										.no_of_pages,
								project_id: projectId,
								warehouse_id: selectedData?.warehouse?.id,
							}}
							onChange={(value) => {
								if (value) {
									Promise.all([
										dispatch(
											getStockDetails({
												project_id: `${projectId}`,
												warehouse_id: `${selectedData?.warehouse?.id}`,
												item_id: `${value?.id}`,
											})
										),
										dispatch(
											getItemsById({ id: value?.id })
										),
									])
										.then(
											([stockRes, itemRes]: [
												any,
												any,
											]) => {
												let stockQuantity =
													parseFloat(
														stockRes?.payload
															?.response?.quantity
													) ?? 0;
												let unitName =
													itemRes?.payload?.response
														?.baseunit?.name ?? "";
												let stockQuantityFormatted = `${stockQuantity} ${unitName}`;
												setValue(
													"available_stock",
													stockQuantityFormatted
												);
											}
										)
										.catch((err) => {
											console.error(
												"Error fetching stock or batch details:",
												err
											);
										});
								}
								reset({
									item: value,
									batch: null,
									available_stock: "",
									quantity: "",
									unit: null,
								});
							}}
							hasMore={
								warehouseAgainstItems.miniParams.page <
								warehouseAgainstItems.miniParams.no_of_pages
							}
							fetchapi={getMiniItemsAgainstWarehouse}
							clearData={clearWarehouseAgainstItems}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 2 }}>
						<FormInput
							name="available_stock"
							label="Available Stock"
							type="number"
							placeholder="Enter available stock here..."
							disabled
							helperText={
								getValuesItem
									? ""
									: "Select an item & warehouse to see stock"
							}
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 2 }}>
						<SelectComponent
							required
							name="batch"
							label="Batch"
							control={control}
							rules={{ required: true }}
							disabled={!getValuesItem?.value}
							helperText={
								!getValuesItem?.value
									? "Select an item before selecting a batch"
									: ""
							}
							options={
								batchAgainstItemsList?.map((e) => ({
									id: e?.batch || "",
									name:
										`${e?.batchname}  (${parseFloat(e?.quantity)} ${itemSelectedData?.baseunit?.name})` ||
										"",
									qty: e?.quantity,
								})) ?? []
							}
							onChange={(value) => {
								batchAgainstItemsList?.map((val) => {
									if (val?.batch == value?.id) {
										setBatchQuantity(
											parseFloat(val?.quantity)
										);
									}
								});
								let itemQtyUnits = `${parseInt(value?.qty ?? 0)} ${itemSelectedData?.baseunit?.name}`;
								setValue("bal_qty", itemQtyUnits);
								setValue("unit", null);
								setValue("qty", "");
								clearErrors("qty");
							}}
							loading={batchloading}
							selectParams={{
								page: batchPageParams.page,
								page_size: batchPageParams.page_size,
								search: batchPageParams.search,
								no_of_pages: batchPageParams.no_of_pages,
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
							required
							name="qty"
							label="Quantity"
							type="number"
							placeholder="Enter quantity here..."
							disabled={!getValuesItem}
							helperText={
								getValuesItem
									? ""
									: "Select an item to see quantity"
							}
							control={control}
							onChange={(event) => {
								setValue("qty", event.target.value, {
									shouldValidate: true,
								});
							}}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 2 }}>
						<SelectComponent
							required
							name="unit"
							label="Unit"
							control={control}
							disabled={getValuesItem ? false : true}
							rules={{ required: true }}
							options={miniUnits.list.map(
								(e: {
									id: string | number;
									name: string;
									units: string;
								}) => ({
									id: e.id,
									name: e.name,
									units: e?.units,
								})
							)}
							loading={miniUnits.loading}
							onChange={(value) => {
								if (
									selectedData?.dchallan_items &&
									selectedData?.dchallan_items?.length > 0
								) {
									let totalQty = 0;
									let deletedQty = 0;
									for (
										let i = 0;
										i < selectedData.dchallan_items.length;
										i++
									) {
										let valItem =
											selectedData.dchallan_items[i];

										if (!valItem?.id) {
											if (
												valItem?.item?.id ==
													formData?.item?.value &&
												valItem?.batch?.value ==
													formData?.batch?.value
											) {
												let ItemQty =
													itemSelectedData?.baseunit
														?.name ===
													valItem?.unit?.name
														? Number(valItem?.qty) *
															Number(
																valItem?.unit
																	?.units
															)
														: Number(valItem?.qty) /
															Number(
																valItem?.unit
																	?.units
															);
												totalQty += ItemQty;
												if (
													valItem?.dodelete === true
												) {
													let deletedItemQty =
														itemSelectedData
															?.baseunit?.name ===
														valItem?.unit?.name
															? Number(
																	valItem?.qty
																) *
																Number(
																	valItem
																		?.unit
																		?.units
																)
															: Number(
																	valItem?.qty
																) /
																Number(
																	valItem
																		?.unit
																		?.units
																);
													deletedQty +=
														deletedItemQty;
												}
												let itemQty =
													batchQuantity -
													totalQty +
													deletedQty;
												let convertItemQty =
													itemQty *
													Number(value?.units);
												let convertItemQtyUnits = `${convertItemQty} ${value?.name}`;
												setValue(
													"bal_qty",
													convertItemQtyUnits
												);
											} else {
												let itemQty =
													batchQuantity *
													Number(value?.units);
												setValue(
													"bal_qty",
													`${itemQty} ${value?.name}`
												);
											}
										} else {
											if (
												valItem?.item?.id ==
													formData?.item?.value &&
												valItem?.batch?.value ==
													formData?.batch?.value
											) {
												if (
													valItem?.dodelete === true
												) {
													let deletedItemQty =
														itemSelectedData
															?.baseunit?.name ===
														valItem?.unit?.name
															? Number(
																	valItem?.qty
																) *
																Number(
																	valItem
																		?.unit
																		?.units
																)
															: Number(
																	valItem?.qty
																) /
																Number(
																	valItem
																		?.unit
																		?.units
																);
													deletedQty +=
														deletedItemQty;
												}
												let convertItemQty =
													batchQuantity *
														Number(value?.units) +
													deletedQty;
												let convertItemQtyUnits = `${convertItemQty} ${value?.name}`;
												setValue(
													"bal_qty",
													convertItemQtyUnits
												);
											} else {
												let itemQty =
													batchQuantity *
													Number(value?.units);
												setValue(
													"bal_qty",
													`${itemQty} ${value?.name}`
												);
											}
										}
									}
								} else {
									let itemQty =
										batchQuantity * Number(value?.units);
									setValue(
										"bal_qty",
										`${itemQty} ${value?.name}`
									);
								}
							}}
							helperText={
								getValuesItem
									? ""
									: "Select an item before selecting a unit"
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
					<Grid size={{ xs: 12, md: 6, lg: 3, xl: 1 }}></Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
						<TextArea
							required
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
