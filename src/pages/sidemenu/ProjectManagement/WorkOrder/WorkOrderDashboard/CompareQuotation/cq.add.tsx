import React, {
	SyntheticEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	Typography,
	Button,
	Select,
	MenuItem,
	Grid2 as Grid,
	Box,
	Paper,
	InputLabel,
	FormControl,
	Card,
	CardContent,
	RadioGroup,
	FormControlLabel,
	Radio,
	styled,
	List,
	CircularProgress,
	Stack,
	TableContainer,
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableHead,
	Checkbox,
	ListItem,
	Divider,
} from "@mui/material";
import SelectComponent from "@src/components/form/SelectComponent";
import { Control, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
	clearPEaganistCQ,
	selectCompareQuotations,
	setcheckedList,
	setSelectedData,
	PESetSelectedData,
	clearPurchaseQuotation,
} from "@src/store/sidemenu/project_management/CompareQuotation/cq.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { useNavigate, useParams } from "react-router-dom";
import { getMiniEnquiry } from "@src/store/mini/mini.Action";
import { clearMiniEnquiry } from "@src/store/mini/mini.Slice";
import GoBack from "@src/components/GoBack";
import Swal from "sweetalert2";
import {
	getPurchaseQuotations,
	getPurchaseEnquiryById,
	editCompareQuotation,
	getCompareQuotationById,
	getPeAgaintComparequotation,
	postCompareQuotation,
} from "@src/store/sidemenu/project_management/CompareQuotation/cq.action";
import { FormInput } from "@src/components";
import { Quotation } from "@src/store/sidemenu/project_management/PurchaseQuotation/pq.types";
import {
	PQItem,
	Vendor,
} from "@src/store/sidemenu/project_management/purchaseEnquiry/purchase_enquiry.types";
import {
	CheckedListItem,
	RequestPayload,
} from "@src/store/sidemenu/project_management/CompareQuotation/cq.types";
import { addParams } from "@src/helpers/Helper";

const QuotationList = ({
	control,
	handleSubmit,
	setValue,
	reset,
	getValues,
	getQuotationForItemMakeAndVendor,
	initialValues,
}: {
	control: Control;
	handleSubmit: any;
	setValue: any;
	reset: any;
	getValues: any;
	getQuotationForItemMakeAndVendor: (
		itemId: string,
		vendorId: string,
		unitId: string | number
	) => Quotation | undefined;
	initialValues: {
		entered_qty: Record<string, number> | undefined;
		initialValuesObj: any;
	};
}) => {
	const dispatch = useAppDispatch();
	const { id } = useParams();

	const {
		compareQuotation: {
			selectedData,
			checkedList,
			purchaseQuotationList,
			peSelectedData,
			peLoading,
		},
	} = useAppSelector((state) => selectCompareQuotations(state));

	let vendors = peSelectedData?.vendors; // array
	let enquiryItems = peSelectedData?.pqitems; // array
	let quotations = purchaseQuotationList; // array

	const handleQuotationSelect = (
		item: any,
		quotation: any,
		isChecked: boolean
	) => {
		const isFound = checkedList[item?.id]?.find(
			(e: any) => e?.quotationitem?.id === quotation?.quotationitem?.id
		)
			? true
			: false;

		dispatch(
			setcheckedList({
				...checkedList,
				[item?.id]: isFound
					? checkedList[item?.id].map((e: any) => {
							if (
								e?.quotationitem?.id ===
								quotation?.quotationitem?.id
							) {
								return {
									...e,
									quotationitem: {
										...e.quotationitem,
										available_qty: 0,
										margin_value: 0,
									},
									dodelete: !isChecked,
								};
							}
							return e;
						})
					: [...(checkedList[item?.id] || []), quotation],
			})
		);
	};

	const calculatePriceAfterDiscount = (
		price: number,
		discountPercentage: number
	) => {
		const discountAmount = (discountPercentage / 100) * price;
		return price - discountAmount;
	};

	const calculateNetValue = (
		priceAfterDiscount: number,
		taxPercentage: number,
		taxamount?: number
	) => {
		const taxAmount = taxamount
			? taxamount
			: (taxPercentage / 100) * priceAfterDiscount;
		return priceAfterDiscount + taxAmount;
	};

	const getValuesPayload = getValues();

	const handleAdd = (payload: any) => {};

	return (
		<>
			<TableContainer component={Paper}>
				<Table stickyHeader={false}>
					<TableHead>
						<TableRow>
							{vendors?.length && (
								<TableCell
									sx={{
										border: "1px solid grey",
									}}>
									<Typography
										variant="h5"
										color="primary.main">
										ITEM
									</Typography>
								</TableCell>
							)}
							{vendors?.map((vendor) => (
								<TableCell
									key={vendor.id}
									sx={{
										border: "1px solid grey",
									}}>
									<Typography
										variant="h5"
										color="primary.main"
										sx={{
											display: "flex",
											flex: 1,
											justifyContent: "space-between",
										}}>
										<Box>{vendor?.name?.toUpperCase()}</Box>
									</Typography>

									<Typography
										variant="subtitle2"
										color="primary.main"
										sx={{
											display: "flex",
											flex: 1,
											justifyContent: "space-between",
										}}>
										Code - {vendor?.code}
									</Typography>
									<Typography
										variant="subtitle2"
										color="primary.main"
										sx={{
											display: "flex",
											flex: 1,
											justifyContent: "space-between",
										}}>
										Phone - {vendor?.mobile}
									</Typography>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{enquiryItems?.map((item) => (
							<TableRow key={item?.id}>
								<TableCell
									sx={{
										border: "1px solid grey",
									}}>
									<List>
										<ListItem>
											<Typography variant="body1">
												<strong>Item Code:</strong>{" "}
												{item?.item?.code}
											</Typography>
										</ListItem>
										<ListItem>
											<Typography variant="body1">
												<strong>Item Name:</strong>{" "}
												{item.item?.name}
											</Typography>
										</ListItem>
										<ListItem>
											<Typography>
												<strong>Unit :</strong>{" "}
												{item?.unit?.name || "N/A"}{" "}
											</Typography>
										</ListItem>
										{/* <ListItem>
											<Typography>
												<strong>Make :</strong>{" "}
												{item?.make?.name || "N/A"}{" "}
											</Typography>
										</ListItem> */}
										<ListItem>
											<Typography>
												<strong>
													Required Quantity :
												</strong>{" "}
												{item?.quantity}{" "}
												{item?.unit?.name}
											</Typography>
										</ListItem>
										<ListItem>
											<Stack direction="row" spacing={1}>
												<Typography>
													<strong>
														Entered Quantity :
													</strong>{" "}
												</Typography>
												<Typography
													color={
														initialValues?.entered_qty &&
														parseInt(
															item?.quantity
														) <
															parseInt(
																`${initialValues?.entered_qty[item?.id]}`
															)
															? "error"
															: "textPrimary"
													}>
													{initialValues?.entered_qty &&
														initialValues
															?.entered_qty[
															item?.id
														]}
												</Typography>
											</Stack>
										</ListItem>
									</List>
								</TableCell>

								{vendors?.map((vendor) => {
									const quotation =
										getQuotationForItemMakeAndVendor(
											item?.item?.id,
											vendor.id,
											item?.unit?.id || ""
										);
									let quotationItem =
										quotation?.quotationitems?.find(
											(qi) =>
												qi?.item?.id ===
													item?.item?.id &&
												// qi?.make?.id ===
												// 	item?.make?.id &&
												qi?.unit?.id === item?.unit?.id
										);

									const tem_price = quotationItem?.price
										? parseFloat(quotationItem?.price)
										: 0;

									const discount_percentage =
										quotationItem?.discount
											? parseFloat(
													quotationItem?.discount
												)
											: 0;

									const priceAfterDiscount =
										calculatePriceAfterDiscount(
											tem_price,
											discount_percentage
										);
									let netValue = 0;

									const checkedItem = checkedList[
										item.id
									]?.find(
										(e: any) =>
											e?.quotationitem?.id ===
												quotationItem?.id && !e.dodelete
									)
										? true
										: false;

									let gross = `${priceAfterDiscount}`;
									const taxType = quotationItem?.taxtype;
									const tax_amount =
										taxType == 2
											? quotationItem?.tax?.id
												? (() => {
														const temp_gross =
															getValuesPayload[
																`available_qty_${quotationItem?.id}`
															]
																? getValuesPayload[
																		`available_qty_${quotationItem?.id}`
																	] *
																	parseFloat(
																		`${priceAfterDiscount}`
																	)
																: 0;

														const taxamt =
															parseFloat(
																`${(temp_gross * quotationItem?.tax?.tax) / 100}`
															);

														netValue =
															calculateNetValue(
																temp_gross,
																quotationItem
																	?.tax
																	?.tax || 0,
																taxamt
															) || 0;
														// gross = parseFloat(
														// 	`${getValuesPayload[`available_qty_${quotationItem?.id}`] * parseFloat(`${priceAfterDiscount}`)}`
														// ).toFixed(2);

														return taxamt;
													})()
												: 0
											: (() => {
													const temp_gross =
														getValuesPayload[
															`available_qty_${quotationItem?.id}`
														] *
														parseFloat(
															`${priceAfterDiscount}`
														);
													const basicValue =
														temp_gross /
														((100 +
															quotationItem?.tax
																?.tax) /
															100);
													const taxamt =
														(basicValue / 100) *
														quotationItem?.tax?.tax;

													netValue =
														parseFloat(
															`${taxamt + basicValue}`
														) || 0;

													return taxamt || 0;
												})();
									return (
										<TableCell
											key={vendor.id}
											sx={{
												border: "1px solid grey",
											}}>
											{quotationItem ? (
												<div className="flex flex-col items-start">
													<Table
														sx={{
															border: "1px solid lightgray",
														}}>
														<TableBody>
															<TableRow>
																<TableCell>
																	<strong>
																		Make:
																	</strong>
																</TableCell>
																<TableCell>
																	{
																		quotationItem
																			?.make
																			?.name
																	}
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<strong>
																		Quantity:
																	</strong>
																</TableCell>
																<TableCell>
																	{
																		quotationItem?.qty
																	}{" "}
																	{
																		quotationItem
																			?.unit
																			?.name
																	}
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<strong>
																		Base
																		Price:
																	</strong>
																</TableCell>
																<TableCell>
																	{
																		quotationItem?.price
																	}
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<strong>
																		Price
																		After
																		Discount:
																	</strong>
																</TableCell>
																<TableCell>
																	{
																		priceAfterDiscount
																	}
																	(
																	{
																		quotationItem?.discount
																	}
																	) %
																</TableCell>
															</TableRow>

															<TableRow>
																<TableCell>
																	<strong>
																		Tax :
																	</strong>
																</TableCell>
																{quotationItem
																	?.tax
																	?.tax ? (
																	<TableCell>
																		{
																			quotationItem
																				?.tax
																				?.name
																		}{" "}
																		(
																		{
																			quotationItem
																				?.tax
																				?.tax
																		}
																		%) (
																		{
																			quotationItem?.taxtype_name
																		}
																		)
																	</TableCell>
																) : (
																	<TableCell>
																		0 %
																	</TableCell>
																)}
															</TableRow>
															<TableRow>
																<TableCell>
																	<strong>
																		Tax
																		Amount :
																	</strong>
																</TableCell>
																{quotationItem
																	?.tax
																	?.tax ? (
																	<TableCell>
																		{tax_amount.toFixed(
																			2
																		)}
																	</TableCell>
																) : (
																	<TableCell>
																		0 %
																	</TableCell>
																)}
															</TableRow>

															<TableRow>
																<TableCell>
																	<strong>
																		Net
																		Value:
																	</strong>
																</TableCell>
																<TableCell>
																	₹{" "}
																	{netValue.toFixed(
																		2
																	)}{" "}
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<strong>
																		Currency:
																	</strong>
																</TableCell>
																<TableCell>
																	{
																		quotation
																			?.currency
																			?.name
																	}
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<strong>
																		Exchange
																		Rate:
																	</strong>
																</TableCell>
																<TableCell>
																	{
																		quotation?.exchange_rate
																	}
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<strong>
																		Available
																		Quantity:
																	</strong>
																</TableCell>
																<TableCell>
																	{checkedItem ? (
																		<form
																			onSubmit={handleSubmit(
																				handleAdd
																			)}>
																			<FormInput
																				control={
																					control
																				}
																				name={`available_qty_${quotationItem?.id}`}
																				helperText="Quantity"
																				label=""
																				type="number"
																				placeholder="Enter available quantity here..."
																				onChange={(
																					event
																				) => {
																					const updatedCheckedList =
																						{
																							...checkedList,
																							[item.id]:
																								checkedList[
																									item
																										.id
																								]?.map(
																									(
																										e: any
																									) => {
																										if (
																											e
																												?.quotationitem
																												?.id ===
																											quotationItem?.id
																										) {
																											return {
																												...e,
																												quotationitem:
																													{
																														...e.quotationitem,
																														available_qty:
																															event
																																.target
																																.value,
																													},
																											};
																										}
																										return e;
																									}
																								),
																						};

																					dispatch(
																						setcheckedList(
																							updatedCheckedList
																						)
																					);
																				}}
																			/>
																		</form>
																	) : (
																		0
																	)}
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<strong>
																		Margin
																		Value:
																	</strong>
																</TableCell>
																<TableCell>
																	{checkedItem ? (
																		<form>
																			<FormInput
																				control={
																					control
																				}
																				name={`margin_value_${quotationItem?.id}`}
																				label=""
																				type="number"
																				placeholder="Enter Margin Value here..."
																				onChange={(
																					event
																				) => {
																					const data =
																						{
																							...checkedList,
																							[item.id]:
																								checkedList[
																									item
																										.id
																								].map(
																									(
																										e: any
																									) => {
																										if (
																											e
																												?.quotationitem
																												?.id ===
																											quotationItem?.id
																										) {
																											return {
																												...e,
																												quotationitem:
																													{
																														...e.quotationitem,
																														margin_value:
																															event
																																.target
																																.value,
																													},
																											};
																										}
																										return e;
																									}
																								),
																						};

																					dispatch(
																						setcheckedList(
																							data
																						)
																					);
																				}}
																			/>
																		</form>
																	) : (
																		0
																	)}
																</TableCell>
															</TableRow>
														</TableBody>
													</Table>
													<Stack
														direction="row"
														alignItems="center">
														<Checkbox
															checked={
																checkedItem
															}
															onChange={(e) => {
																if (
																	e.target
																		.checked ===
																	false
																) {
																	(() => {
																		setValue(
																			`available_qty_${quotationItem?.id}`,
																			0
																		);
																		setValue(
																			`margin_value_${quotationItem?.id}`,
																			0
																		);
																		initialValues.initialValuesObj[
																			`available_qty_${quotationItem?.id}`
																		] = 0;
																		initialValues.initialValuesObj[
																			`margin_value_${quotationItem?.id}`
																		] = 0;
																	})();
																}

																handleQuotationSelect(
																	item,
																	{
																		temp_q: quotation,
																		quotationitem:
																			quotationItem,
																		vendor: vendor,
																		purchase_enquiry_item_id:
																			item?.id,
																	},
																	e.target
																		.checked
																);
															}}
														/>
														<Typography>
															Check to select this
															Quotation
														</Typography>
													</Stack>
												</div>
											) : (
												<Typography variant="body2">
													No quotation
												</Typography>
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "100vh",
	width: "100%",
	marginTop: "15px",
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

const CompareQuotations = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { id, projectId } = useParams();
	const {
		compareQuotation: {
			selectedData,
			checkedList,
			pageParams,
			PEaganistCQ,
			PQpageParams: pqPageParams,
			PQLoading: pqLoading,
			peSelectedData,
			peLoading,
			purchaseQuotationList,
		},
	} = useAppSelector((state) => selectCompareQuotations(state));

	const clearData = () => {
		dispatch(setSelectedData({}));
		dispatch(PESetSelectedData({}));
		dispatch(setcheckedList({}));
		dispatch(clearPurchaseQuotation({}));
		reset();
	};

	useEffect(() => {
		clearData();
	}, []);

	let vendors = peSelectedData?.vendors; // array
	let enquiryItems = peSelectedData?.pqitems; // array
	let quotations = purchaseQuotationList; // array

	const getQuotationForItemMakeAndVendor = useCallback(
		(
			itemId: string,
			vendorId: string,
			unitId: string | number
		): Quotation | undefined => {
			return quotations?.find(
				(q) =>
					q?.vendor?.id === vendorId &&
					q?.quotationitems?.some(
						(qi) =>
							qi?.item?.id === itemId && qi?.unit?.id == unitId
					)
			);
		},
		[quotations]
	);

	const validationSchema = useMemo(() => {
		const schemaShape: any = {};
		schemaShape.purchase_enquiry = yup
			.object()
			.shape({
				label: yup
					.string()
					.required("Please select a purchase enquiry"), // Ensure label is present and valid
				value: yup
					.string()
					.required("Please select a purchase enquiry"), // Ensure value is present and valid
			})
			.required("Please select a purchase enquiry");

		enquiryItems?.forEach((item) => {
			let quotation: Quotation | undefined;
			vendors?.forEach((vendor) => {
				quotation = getQuotationForItemMakeAndVendor(
					item?.item?.id,
					vendor?.id,
					item?.unit?.id || ""
				);
				let quotationItem = quotation?.quotationitems?.find(
					(qi) => qi?.item?.id === item?.item?.id
				);
				if (quotation && quotation?.id) {
					schemaShape[`available_qty_${quotationItem?.id}`] = yup
						.number()
						.typeError("Available quantity must be a number")
						.required("Available quantity is required")
						.test(
							"is-less-than-or-equal-to-quantity",
							`Available quantity cannot exceed the balance quantity of ${item?.quantity}`,
							function (value) {
								const dynamicQuantity = item?.quantity || 0;
								return (
									parseInt(`${value}`) <=
									parseInt(`${dynamicQuantity}`)
								);
							}
						);
				}
			});
		});

		return yup.object(schemaShape);
	}, [enquiryItems]);

	let initialValues = useMemo(() => {
		let entered_qty: Record<string, number> = {};
		const initialValuesObj: any = {};

		Object.entries(checkedList || {}).forEach(([key, items], index) => {
			if (Array.isArray(items)) {
				items.forEach((item: CheckedListItem) => {
					if (item?.quotationitem?.id) {
						initialValuesObj[
							`available_qty_${item.quotationitem.id}`
						] = item?.quotationitem?.available_qty || 0;
						initialValuesObj[
							`margin_value_${item.quotationitem.id}`
						] = item?.quotationitem?.margin_value || 0;
					}
				});
				entered_qty[key] = items.reduce((acc, item) => {
					if (!item?.dodelete) {
						const value = !item?.dodelete
							? item?.quotationitem?.available_qty || 0
							: 0;
						return acc + parseInt(value);
					}
					return acc + 0;
				}, 0);
			}
		});

		return {
			entered_qty,
			initialValuesObj,
		};
	}, [checkedList]);

	const { control, handleSubmit, reset, getValues, setValue } = useForm<any>({
		resolver: yupResolver(validationSchema),
		values: {
			purchase_enquiry: selectedData?.purchase_enquiry
				? {
						label: selectedData?.purchase_enquiry?.name,
						value: selectedData?.purchase_enquiry?.id,
					}
				: null,
			...initialValues.initialValuesObj,
		},
	});

	const formData = getValues();

	useEffect(() => {
		id != "0" &&
			setValue(
				"purchase_enquiry",
				selectedData?.purchase_enquiry
					? {
							label: selectedData?.purchase_enquiry?.name,
							value: selectedData?.purchase_enquiry?.id,
						}
					: null
			);
	}, [id, selectedData]);

	useEffect(() => {
		if (id != "0") {
			dispatch(
				getCompareQuotationById({
					id: id ? id : "",
				})
			);
		}
	}, [id]);

	useEffect(() => {
		if (id != "0" && projectId && selectedData?.purchase_enquiry) {
			dispatch(
				getPurchaseQuotations({
					...pqPageParams,
					project_id: projectId,
					purchase_enquiry: selectedData?.purchase_enquiry?.id,
				})
			);
		}
	}, [projectId, selectedData]);

	useEffect(() => {
		if (id != "0" && selectedData?.purchase_enquiry) {
			dispatch(
				getPurchaseEnquiryById({
					id: selectedData?.purchase_enquiry?.id
						? selectedData?.purchase_enquiry?.id
						: "",
				})
			);
		}
	}, [selectedData]);

	const handleLoadData = (payload: {
		purchase_enquiry: {
			label: string;
			value: string;
		};
	}) => {
		dispatch(
			setSelectedData({
				...selectedData,
				purchase_enquiry: {
					id: payload.purchase_enquiry.value,
					name: payload.purchase_enquiry.label,
				},
			})
		);
		// Logic for loading data based on the selected RFQ
		dispatch(
			getPurchaseQuotations({
				...pqPageParams,
				project_id: projectId,
				purchase_enquiry: payload?.purchase_enquiry?.value,
			})
		);
		dispatch(
			getPurchaseEnquiryById({
				id: payload?.purchase_enquiry?.value,
			})
		);
	};

	const onSubmit = () => {
		const arr: CheckedListItem[] = [];
		let qitems_errors = false;
		const checkedItems = Object.values(checkedList).flatMap(
			(e) => e
		) as CheckedListItem[];
		const notDeletedItems = checkedItems?.filter(
			(e: CheckedListItem) => !e.dodelete
		);

		notDeletedItems.forEach((item) => {
			const enquiryItem = enquiryItems?.find(
				(eqItem) => eqItem.id === item.purchase_enquiry_item_id
			);
			if (
				!item?.quotationitem?.available_qty ||
				parseInt(`${item?.quotationitem?.available_qty}`) === 0
			) {
				const available_qty = item?.quotationitem?.available_qty;
				qitems_errors = true;
				Swal.fire({
					title: `<p style="font-size:20px">Quantity Cannot Be Empty or 0</p>`,
					html: `<div>
									For Vendor:<b>${item?.vendor?.name} (${item?.vendor?.code}) and 
									Item: <b>${enquiryItem?.item?.name} (${enquiryItem?.item?.code}) </b>
									<p>Entered Quantity: ${available_qty || 0} ${enquiryItem?.unit?.name}</p>
									<p>Required Quantity: ${enquiryItem?.quantity}  ${enquiryItem?.unit?.name}</p>
									</div>`,
					icon: "warning",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				return;
			}

			const totalCheckedItemQuantity = notDeletedItems?.reduce(
				(acc: number | string, value: CheckedListItem) => {
					if (value?.purchase_enquiry_item_id == enquiryItem?.id) {
						const available_qty = value?.quotationitem
							?.available_qty
							? +value?.quotationitem?.available_qty
							: 0;
						return parseInt(`${acc}`) + available_qty;
					}
					return parseInt(`${acc}`) + 0;
				},
				0
			);

			// if (
			// 	totalCheckedItemQuantity != parseInt(`${enquiryItem?.quantity}`)
			// ) {
			// 	qitems_errors = true;
			// 	Swal.fire({
			// 		title: `<p style="font-size:20px">Quantity Mismatch</p>`,
			// 		html: `<div>
			// 						For Item: <b>${enquiryItem?.item?.name} (${enquiryItem?.item?.code}) </b>
			// 						<p>Entered Quantity: ${totalCheckedItemQuantity} ${enquiryItem?.unit?.name}</p>
			// 						<p>Required Quantity: ${enquiryItem?.quantity}  ${enquiryItem?.unit?.name}</p>
			// 						</div>`,
			// 		icon: "warning",
			// 		confirmButtonText: `Close`,
			// 		confirmButtonColor: "#3085d6",
			// 	});
			// 	return;
			// }
		});
		if (qitems_errors) {
			qitems_errors = false;
			return;
		}

		if (checkedItems.length != 0) {
			const serilizedCheckedItems = checkedItems?.map(
				(e: CheckedListItem) => {
					const alpha = {
						id: e?.id,
						dodelete: e.dodelete ? true : false,
						deliverydate: e?.temp_q?.deliverydate,
						description: e?.temp_q?.description,
						make_id: e?.quotationitem?.make?.id,
						price: e?.quotationitem?.price,
						total_price: e?.quotationitem?.total_price,
						item_id: e?.quotationitem?.item?.id,
						vendor_id: e?.vendor?.id,
						quotation_id: e?.temp_q?.id,
						quotationitem_id: e?.quotationitem?.id,
						purchase_enquiry_item_id: e?.purchase_enquiry_item_id,
						unit_id: e?.quotationitem?.unit?.id,
						qty: e?.quotationitem?.available_qty
							? e?.quotationitem?.available_qty
							: 0,
						originalqty: e?.quotationitem?.originalqty,
						margin_value: e?.quotationitem?.margin_value,
					};
					const alphaSerilized = addParams(alpha);
					return alphaSerilized;
				}
			);
			const items =
				id == "0"
					? serilizedCheckedItems?.filter((e) => !e.dodelete)
					: serilizedCheckedItems;
			const data: any = {
				project_id: projectId ? projectId : "",
				purchase_enquiry_id: selectedData?.purchase_enquiry?.id
					? selectedData?.purchase_enquiry?.id
					: "",
				comparequotationitems: items,
			};

			id == "0"
				? dispatch(
						postCompareQuotation({
							data,
							params: {
								...pageParams,
								project_id: projectId ? projectId : "",
							},
							reset: clearData,
							navigate,
						})
					)
				: dispatch(
						editCompareQuotation({
							id: id ? id : "",
							data,
							params: {
								...pageParams,
								project_id: projectId ? projectId : "",
							},
							reset: clearData,
							navigate,
						})
					);
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">No Quotations Checked</p>`,
				text: "Atleast one quotation must be checked before submitting the comparison.",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Edit Compare Quotation" : "New Compare Quotation"}`}
			showSaveButton={false}
			loading={false}>
			<Card
				sx={{
					mt: 0,
					borderTop: "1px solid lightgray",
					borderRadius: 0,
				}}>
				<CardContent>
					<Box>
						<form action="" onSubmit={handleSubmit(handleLoadData)}>
							<Grid container spacing={3} alignItems="center">
								<Grid size={{ xs: 12, md: 6, lg: 4 }}>
									<Stack
										width={"100%"}
										direction="row"
										alignItems="center"
										spacing={1}>
										<Typography variant="subtitle1">
											Select Enquiry:{" "}
										</Typography>
										<Stack flex={1}>
											<SelectComponent
												name="purchase_enquiry"
												label=""
												control={control}
												rules={{ required: true }}
												disabled={id !== "0"}
												helperText={
													id !== "0"
														? "Purchase Enquiry cannot be changed"
														: ""
												}
												options={PEaganistCQ.list.map(
													(e: {
														id: string | number;
														code: string;
													}) => ({
														id: e.id,
														name: e.code,
													})
												)}
												loading={PEaganistCQ.loading}
												selectParams={{
													page: PEaganistCQ.miniParams
														.page,
													page_size:
														PEaganistCQ.miniParams
															.page_size,
													search: PEaganistCQ
														.miniParams.search,
													no_of_pages:
														PEaganistCQ.miniParams
															.no_of_pages,
													project: projectId
														? projectId
														: "",
												}}
												hasMore={
													PEaganistCQ.miniParams
														.page <
													PEaganistCQ.miniParams
														.no_of_pages
												}
												fetchapi={
													getPeAgaintComparequotation
												}
												clearData={clearPEaganistCQ}
											/>
										</Stack>
									</Stack>
								</Grid>

								<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={2}>
									<Button
										variant="contained"
										color="primary"
										type="submit"
										size="large"
										disabled={
											formData?.purchase_enquiry?.value &&
											id == "0"
												? false
												: true
										}>
										Load Data
									</Button>
								</Grid>
							</Grid>
						</form>
					</Box>

					<Box mt={4}>
						<Box mt={2}>
							{formData?.purchase_enquiry?.value ? (
								<>
									<ScrollableList
										onScroll={(e: SyntheticEvent) => {
											const { target } = e as any;
											if (
												Math.ceil(
													target?.scrollTop +
														target?.offsetHeight
												) == target?.scrollHeight
											) {
												if (
													pqPageParams.page <
													pqPageParams.no_of_pages
												) {
													dispatch(
														getPurchaseQuotations({
															...pqPageParams,
															page:
																pqPageParams?.page +
																1,
															page_size: 10,
														})
													);
												}
											}
										}}>
										<QuotationList
											control={control}
											handleSubmit={handleSubmit}
											reset={reset}
											getValues={getValues}
											setValue={setValue}
											initialValues={initialValues}
											getQuotationForItemMakeAndVendor={
												getQuotationForItemMakeAndVendor
											}
										/>
										{pqLoading && <Loader />}
										<Divider
											sx={{
												mt: 2,
											}}
										/>
									</ScrollableList>

									<Box mt={2} textAlign="end">
										<Button
											variant="contained"
											color="primary"
											onClick={onSubmit}
											disabled={
												(selectedData?.purchase_enquiry
													?.id ||
													selectedData
														?.purchase_enquiry
														?.value) &&
												peSelectedData?.pqitems?.length
													? false
													: true
											}>
											Submit
										</Button>
									</Box>
								</>
							) : (
								<Typography textAlign={"center"}>
									Select an Enquiry
								</Typography>
							)}
						</Box>
					</Box>
				</CardContent>
			</Card>
		</GoBack>
	);
};

export default CompareQuotations;
