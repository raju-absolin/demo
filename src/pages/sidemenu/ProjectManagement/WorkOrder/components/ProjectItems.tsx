import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid2 as Grid, Typography } from "@mui/material";
import { FormInput } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TableComponent from "@src/components/TableComponenet";
import {
	getMiniItems,
	getMiniTax,
	getMiniTenderMasterItems,
} from "@src/store/mini/mini.Action";
import {
	clearMiniItems,
	clearMiniTax,
	clearMiniTenderMasterItems,
} from "@src/store/mini/mini.Slice";
import {
	selectWorkOrders,
	setSelectedData,
} from "@src/store/sidemenu/project_management/work_order/work_order.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { memo, useEffect, useMemo } from "react";
import {
	Control,
	useFieldArray,
	useForm,
	UseFormSetValue,
} from "react-hook-form";
import { LuBook, LuDelete } from "react-icons/lu";
import Swal from "sweetalert2";
import * as yup from "yup";

interface FormData {
	tenderitemmaster: {
		label: string;
		value: string;
	} | null;
	quantity: string;
	price: string;
	discount: string;
	taxtype: {
		label: string;
		value: string;
	} | null;
	tax: {
		label: string;
		value: {
			id: string;
			tax: string;
		};
	} | null;
}

const addProjectItemForm = yup.object().shape({
	tenderitemmaster: yup
		.object({
			label: yup.string().required("Please select a tender item"),
			value: yup.string().required("Please select a tender item"),
		})
		.required("Please select a tender item")
		.nullable(),
	quantity: yup
		.string()
		.transform((value, originalValue) =>
			originalValue.trim() === "" ? null : value
		)
		.typeError("Quantity must be a number")
		.max(7, "Cannot enter more than 7 digits")
		.min(1, "Quantity must be more than 0")
		.required("please enter a quantity"),
	price: yup
		.number()
		.transform((value, originalValue) =>
			originalValue.trim() === "" ? null : value
		)
		.positive("Price must be greater than zero")
		.typeError("Price must be a number")
		// .max(7, "Cannot enter more than 7 digits")
		.min(1, "Price must be more than 0")
		.required("please enter a price"),
	discount: yup
		.string()
		.transform((value, originalValue) => {
			return originalValue.trim() === "" ? null : value;
		})
		.typeError("discount must be a number")
		.max(2, "Cannot enter more than 2 digits")
		.required("please enter a discount"),
	taxtype: yup
		.object({
			label: yup.string().required("Please select a tax type"),
			value: yup.string().required("Please select a tax type"),
		})
		.nullable()
		.required("Please select a tax type"),

	tax: yup
		.object({
			label: yup.string().required("Please select a tax"),
			value: yup
				.object({
					id: yup.string().required("Please select a tax type"),
					tax: yup.string().required("Please select a tax type"),
				})
				.required("Please select a tax"),
		})
		.required("Please select a tax")
		.nullable(),
});
export const useProjectFormItem = () => {
	const in_items_list_schema = yup.object().shape({
		items: yup.array().of(addProjectItemForm),
	});
	const form = useForm<any>({
		resolver: yupResolver(in_items_list_schema),
	});
	return form;
};

interface FormValues {
	tenderitemmaster?: { label?: string; value?: string };
	tender_no?: string;
	department_name?: string;
	company?: { label?: string; value?: string };
	sourceportal?: { label?: string; value?: string };
	tender_type?: { label?: string; value?: number };
	product_type?: { label?: string; value?: number };
	tender_datetime?: string;
	tender_due_datetime?: string;
	// Add other fields if necessary
}

interface Props<T extends FormValues> {
	onSave: (value: any) => void;
	handleSubmit: any;
	register: unknown;
	errors: unknown;
	control: Control<any>;
	getValues: any;
	reset: any;
	setValue: UseFormSetValue<T>;
}

const ProjectItems = ({
	onSave,
	handleSubmit,
	register,
	control,
	errors,
	getValues,
	reset,
	setValue,
}: Props<FormValues>) => {
	const dispatch = useAppDispatch();
	const {
		workOrder: { selectedData, pageParams },
		mini: { miniTenderMasterItems, miniItemsList, miniTax },
	} = useAppSelector((state) => selectWorkOrders(state));

	const {
		control: control2,
		handleSubmit: handleSubmit2,
		reset: reset2,
	} = useForm<any>({
		resolver: yupResolver(addProjectItemForm),
	});

	let projectValue = 0;
	let projectTax = 0;
	let projectTotalValue = 0;

	const handleAddItem = (payload: FormData) => {
		const findItem: any = selectedData?.project_items?.find(
			(item) =>
				item?.tenderitemmaster?.value ==
				payload?.tenderitemmaster?.value
		);

		const addData = () => {
			const data = {
				tenderitemmaster: payload.tenderitemmaster,
				// tender_item: payload.tender_item,
				quantity: payload.quantity,
				price: payload.price,
				discount: payload.discount,
				taxtype: payload.taxtype,
				tax: payload.tax,
				dodelete: false,
			};
			dispatch(
				setSelectedData({
					...selectedData,
					project_items: [
						...(selectedData?.project_items || []), // Ensure project_items is an array
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
		reset2({
			tenderitemmaster: null,
			// tender_item: null,
			quantity: "",
			price: "",
			discount: "",
			taxtype: null,
			tax: null,
		});
	};

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Bid Item",
			width: 100,
		},
		// {
		// 	title: "Item",
		// 	width: 100,
		// },
		{
			title: "Quantity",
			width: 100,
		},
		{
			title: "Price",
			width: 100,
		},
		{
			title: "Discount",
			width: 100,
		},
		{
			title: "Price After Discount",
			width: 100,
		},
		{
			title: "Gross",
			width: 100,
		},
		{
			title: "Tax Type",
			width: 100,
		},
		{
			title: "Tax",
			width: 100,
		},
		{
			title: "Tax Amount",
			width: 100,
		},
		{
			title: "Total",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		bid_item: string,
		// item: string,
		quantity: string | number,
		price: React.JSX.Element,
		discount: React.JSX.Element,
		afterdiscount: string | number,
		gross: string | number,
		taxtype: React.JSX.Element,
		tax: React.JSX.Element,
		taxamt: string | number,
		total: string,
		actions: React.JSX.Element
	) {
		return {
			index,
			bid_item,
			// item,
			quantity,
			price,
			discount,
			afterdiscount,
			gross,
			taxtype,
			tax,
			taxamt,
			total,
			actions,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.project_items
			?.filter((e) => !e?.dodelete)
			?.map((row, key) => {
				setValue(`items.${key}.price` as any, row.price, {
					shouldValidate: true,
				});
				setValue(`items.${key}.discount` as any, row.discount, {
					shouldValidate: true,
				});
				setValue(`items.${key}.tax` as any, row.tax, {
					shouldValidate: true,
				});
				setValue(`items.${key}.taxtype` as any, row.taxtype, {
					shouldValidate: true,
				});

				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				// const totals = (
				const qty = row?.quantity ? +row?.quantity : 0;
				const tem_price = row?.price ? row?.price : 0;

				const discount_percentage = row?.discount ? +row?.discount : 0;
				const discount_amount =
					(discount_percentage / 100) * Number(tem_price);

				const price_after_discount = discount_percentage
					? parseFloat(
						`${Number(tem_price) - discount_amount}`
					).toFixed(2)
					: tem_price;

				let gross = parseFloat(
					`${qty * parseFloat(`${price_after_discount}`)}`
				).toFixed(2);

				projectValue += parseFloat(gross);

				setValue(`amount` as any, projectValue, {
					shouldValidate: true,
				});

				let totall: number = 0; // Ensure `total` is always a number
				const taxType = row?.taxtype?.value;

				const tax_amount = (() => {
					const taxRate: string | number = row?.tax?.value?.tax;

					const numericTaxRate =
						typeof taxRate === "string"
							? parseFloat(taxRate)
							: taxRate;

					if (taxType == "2") {
						// Exclusive Tax
						if (row?.tax?.id) {
							const taxAmt = parseFloat(
								`${parseFloat(gross) * (numericTaxRate / 100)}`
							);
							totall = parseFloat(gross) + taxAmt;
							return taxAmt;
						}
						return 0; // No tax if tax ID is not provided
					} else if (taxType == "1") {
						// Inclusive Tax
						if (taxRate > "0") {
							const basicValue =
								parseFloat(gross) / (1 + numericTaxRate / 100); // Calculate the net price excluding tax
							const taxAmt = basicValue * (numericTaxRate / 100); // Tax amount for inclusive tax
							totall = parseFloat(gross); // Total is the gross (inclusive of tax)
							return taxAmt;
						}
						return 0; // No tax if tax rate is 0
					}
					return 0; // Default to 0 if no valid tax type is provided
				})();

				projectTax += parseFloat(tax_amount.toFixed(2));
				setValue(`taxamount` as any, projectTax, {
					shouldValidate: true,
				});
				setValue(`taxable_amount` as any, selectedData?.taxable_amount, {
					shouldValidate: true,
				});

				const total = parseFloat(`${totall}`).toFixed(2);


				projectTotalValue += parseFloat(total);
				setValue(`total_value` as any, projectTotalValue, {
					shouldValidate: true,
				});

				const price = (
					<Box
						sx={{
							width: 200,
						}}>
						<form>
							<FormInput
								name={`items.${key}.price`}
								control={control}
								label=""
								type="number"
								placeholder="Enter price here..."
								helperText="Price"
								onChange={(event) => {
									// Register the input change
									dispatch(
										setSelectedData({
											...selectedData,
											project_items:
												selectedData?.project_items?.map(
													(e) => {
														if (
															e.tenderitemmaster
																?.value ==
															row
																?.tenderitemmaster
																?.value
														)
															return {
																...e,
																price: event
																	.target
																	.value,
															};

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

				const discount = (
					<Box
						sx={{
							width: 200,
						}}>
						<form action="">
							<FormInput
								name={`items.${key}.discount`}
								label=""
								type="number"
								helperText="Discount %"
								placeholder="Enter Discount here..."
								control={control}
								onChange={(event) => {
									// Register the input change
									dispatch(
										setSelectedData({
											...selectedData,
											project_items:
												selectedData?.project_items?.map(
													(e) => {
														if (
															e.tenderitemmaster
																?.value ==
															row
																?.tenderitemmaster
																?.value
														)
															return {
																...e,
																discount:
																	event.target
																		.value,
															};

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
								helperText="Tax Type"
								control={control}
								disabled={false}
								rules={{ required: true }}
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
									// Register the input change
									dispatch(
										setSelectedData({
											...selectedData,
											project_items:
												selectedData?.project_items?.map(
													(e) => {
														if (
															e.tenderitemmaster
																?.value ==
															row
																?.tenderitemmaster
																?.value
														)
															return {
																...e,
																taxtype: value,
															};

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
				const tax = (
					<Box
						sx={{
							width: 200,
						}}>
						<form action="">
							<SelectComponent
								name={`items.${key}.tax`}
								label=""
								control={control}
								rules={{ required: true }}
								options={miniTax?.list.map(
									(e: {
										id: string | number;
										name: string;
									}) => ({
										id: e,
										name: e.name,
									})
								)}
								helperText="Tax %"
								loading={miniTax?.loading}
								selectParams={{
									page: miniTax?.miniParams?.page,
									page_size: miniTax?.miniParams?.page_size,
									search: miniTax?.miniParams?.search,
									no_of_pages:
										miniTax?.miniParams?.no_of_pages,
								}}
								hasMore={
									miniTax?.miniParams?.page <
									miniTax?.miniParams?.no_of_pages
								}
								fetchapi={getMiniTax}
								clearData={clearMiniTax}
								onChange={(value) => {
									// Register the input change
									dispatch(
										setSelectedData({
											...selectedData,
											project_items:
												selectedData?.project_items?.map(
													(e) => {
														if (
															e.tenderitemmaster
																?.value ==
															row
																?.tenderitemmaster
																?.value
														)
															return {
																...e,
																tax: value,
															};

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

				const actions = (
					<Box
						sx={{
							display: "flex",
							gap: 2,
							justifyContent: "center",
						}}>
						<LuDelete
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={() => {
								const fiteredItems =
									selectedData.project_items?.map((e) => {
										if (
											e?.tenderitemmaster?.value ==
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
										project_items: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);
				return createData(
					index,
					row?.tenderitemmaster?.label
						? row?.tenderitemmaster?.label
						: "",
					// row?.tender_item?.label ? row?.tender_item?.label : "",
					row.quantity,
					price,
					discount,
					price_after_discount,
					gross,
					taxtype,
					tax,
					tax_amount.toFixed(2),
					total,
					actions
				);
			});
	}, [selectedData, createData]);

	useEffect(() => {
		if (selectedData?.taxable_amount && projectTotalValue) {
			projectTotalValue += parseFloat(selectedData?.taxable_amount);
			setValue(`total_value` as any, projectTotalValue, {
				shouldValidate: true,
			});
		}
	}, [selectedData?.taxable_amount, projectTotalValue]);

	return (
		<Box>
			<form action="" onSubmit={handleSubmit2(handleAddItem)}>
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
								Project Items
							</Typography>
						</Typography>
					</Grid>
					<Grid
						size={{ xs: 12, md: 6, lg: 3 }}
						sx={{
							position: "relative",
						}}>
						<SelectComponent
							name="tenderitemmaster"
							label="Bid Items"
							control={control2}
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
					{/* <Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="tender_item"
							label="Items"
							control={control2}
							rules={{ required: true }}
							options={miniItemsList.list.map(
								(e: { id: string | number; name: string }) => ({
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
							hasMore={
								miniItemsList.miniParams.page <
								miniItemsList.miniParams.no_of_pages
							}
							fetchapi={getMiniItems}
							clearData={clearMiniItems}
						/>
					</Grid> */}
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="quantity"
							label="Quantity"
							type="number"
							placeholder="Enter quantity here..."
							control={control2}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="price"
							label="Price"
							type="number"
							placeholder="Enter price here..."
							control={control2}
						// onChange={(event) => {
						// 	// Register the input change
						// 	dispatch(
						// 		setSelectedData({
						// 			...selectedData,
						// 			project_items:
						// 				selectedData?.project_items?.map(
						// 					(e) => {
						// 						if()
						// 						return {
						// 							...e,
						// 							price: event.target
						// 								.value,
						// 						};
						// 					}
						// 				),
						// 		})
						// 	);
						// }}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="discount"
							label="Discount"
							type="number"
							helperText="Discount %"
							placeholder="Enter Discount here..."
							control={control2}
						// onChange={(event) => {
						// 	// Register the input change
						// 	dispatch(
						// 		setSelectedData({
						// 			...selectedData,
						// 			project_items:
						// 				selectedData?.project_items?.map(
						// 					(e) => {
						// 						return {
						// 							...e,
						// 							discount:
						// 								event.target.value,
						// 						};
						// 					}
						// 				),
						// 		})
						// 	);
						// }}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="taxtype"
							placeholder="Select a tax type..."
							label="Tax type"
							control={control2}
							disabled={false}
							rules={{ required: true }}
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
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="tax"
							label="Tax"
							control={control2}
							rules={{ required: true }}
							options={miniTax?.list.map(
								(e: { id: string | number; name: string }) => ({
									id: e,
									name: e.name,
								})
							)}
							loading={miniTax?.loading}
							selectParams={{
								page: miniTax?.miniParams?.page,
								page_size: miniTax?.miniParams?.page_size,
								search: miniTax?.miniParams?.search,
								no_of_pages: miniTax?.miniParams?.no_of_pages,
							}}
							hasMore={
								miniTax?.miniParams?.page <
								miniTax?.miniParams?.no_of_pages
							}
							fetchapi={getMiniTax}
							clearData={clearMiniTax}
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
			<Box my={2}>
				<TableComponent
					count={selectedData?.project_items?.length ?? 0}
					columns={columns}
					rows={rows ? rows : []}
					loading={false}
					page={1}
					pageSize={10}
					handleChangePage={() => { }}
					handleChangeRowsPerPage={() => { }}
					showPagination={false}
				/>
			</Box>
		</Box>
	);
};

export default memo(ProjectItems);
