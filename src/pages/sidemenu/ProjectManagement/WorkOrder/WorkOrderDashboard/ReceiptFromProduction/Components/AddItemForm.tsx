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
import { useReceiptFromProductionAction } from "@src/store/sidemenu/project_management/ReceiptFromProduction/RFP.action";
import { useReceiptFromProductionSelector } from "@src/store/sidemenu/project_management/ReceiptFromProduction/RFP.slice";
import { useAppDispatch } from "@src/store/store";
import { Control, useForm } from "react-hook-form";
import { LuBook } from "react-icons/lu";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";

interface Params {
	control: Control;
	getValues: (params?: string) => void;
	setValue: (key: string, value: any) => void;
}

export const AddItemForm = () => {
	const { projectId, id } = useParams();
	const dispatch = useAppDispatch();
	const {
		receiptFromProduction: { selectedData },
		mini: {
			miniWarehouse,
			warehouseAgainstItems,
			miniBatch,
			miniUnits,
			miniItemsList,
		},
	} = useReceiptFromProductionSelector();
	const {
		reducer: { setSelectedData },
		extraReducer: {},
	} = useReceiptFromProductionAction();

	const RFPItemsScheme = yup.object().shape({
		qty: yup
			.number()
			.typeError("Quantity must be a number")
			.required("Quantity is required")
			.positive("Quantity must be greater than zero")
			.test(
				"max-quantity",
				"Quantity cannot be greater than the original quantity",
				function (value) {
					const { originalqty } = this.parent;
					return originalqty === undefined || value <= originalqty;
				}
			),
		batch_name: yup.string().trim().required("Please enter batch name"),
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
		date: yup.string().required("Please select a date"),
	});

	const { control, handleSubmit, reset, getValues, setValue } = useForm<any>({
		resolver: yupResolver(RFPItemsScheme),
	});

	interface SubmitPayload {
		date: string;
		batch_name: string;
		item: miniType;
		qty: string;
		unit: miniType;
		description: string;
	}

	const getValuesItem = getValues("item");

	const handleAdditem = handleSubmit((payload: SubmitPayload) => {
		const findItem: any = selectedData?.preceipt_items?.find(
			(item: any) => item?.item?.value == payload?.item?.value
		);
		const addData = () => {
			const data = {
				...payload,
				dodelete: false,
			};

			setSelectedData({
				...selectedData,
				preceipt_items: [
					...(selectedData?.preceipt_items || []),
					{
						...data,
					},
				],
			} as any);
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
			make: null,
			date: null,
			batch_name: "",
			qty: "",
			description: "",
			unit: null,
		});
	});

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
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<Stack width={"100%"}>
							<CustomDatepicker
								control={control}
								name="date"
								required
								hideAddon
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
							required
							name="item"
							label="Item"
							control={control}
							rules={{ required: true }}
							options={miniItemsList.list.map(
								(e: { id: string | number; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							// disabled={!selectedData?.warehouse?.id}
							// helperText={
							// 	!selectedData?.warehouse?.id
							// 		? "select a warehouose to proceed with item selection."
							// 		: ""
							// }
							loading={miniItemsList.loading}
							selectParams={{
								page: miniItemsList.miniParams.page,
								page_size: miniItemsList.miniParams.page_size,
								search: miniItemsList.miniParams.search,
								no_of_pages:
									miniItemsList.miniParams.no_of_pages,
								project_id: projectId,
								// warehouse_id: selectedData?.warehouse?.id
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
							name="batch_name"
							label="Batch"
							type="text"
							placeholder="Enter batch here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
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
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
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
