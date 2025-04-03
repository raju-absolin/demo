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
	clearMiniWarehouse,
	clearMiniTax,
	clearMiniBatch,
	clearMiniVendors,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniEnquiry,
	getMiniMake,
	getPurchaseOrderMini,
	getMiniLocation,
	getMiniTax,
	getMiniWarehouse,
	getMiniBatch,
	getMiniVendors,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	editPaymentRequest,
	getPaymentRequestById,
	getPaymentRequests,
	postPaymentRequest,
} from "@src/store/sidemenu/project_management/PaymentRequest/payment_request.action";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import TextArea from "@src/components/form/TextArea";
import {
	selectPaymentRequests,
	setSelectedData,
} from "@src/store/sidemenu/project_management/PaymentRequest/payment_request.slice";
import { selectLeads } from "@src/store/sidemenu/strategic_management/leads/leads.slice";
import { Percent } from "@mui/icons-material";
import { getPurchaseOrderById } from "@src/store/sidemenu/project_management/PurchaseOrder/po.action";
import { getVendorByOrderId } from "@src/store/sidemenu/project_management/PurchaseOrder/po.action";
import { updateSidenav } from "@src/store/customise/customise";
import { selectPurchaseOrders } from "@src/store/sidemenu/project_management/PurchaseOrder/po.slice";

const AddPaymentRequest = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, tab, projectId, purchaseOrderId } = useParams();
	const {
		paymentRequest: {
			selectedData,
			pageParams,
			paymentRequestCount,
			paymentRequestList,
		},
		purchaseOrder: { selectedData: poSelectedData, purchasePrice },
		mini: { miniMake, miniVendors, miniPurchaseOrder },
	} = useAppSelector((state) => selectPaymentRequests(state));

	const [disableField, setDisableField] = useState("");

	const poSchema = yup.object().shape({
		requested_date: yup.string().required("Please select requested date"),
		due_date: yup.string().required("Please select requested date"),
		// purchase_order: yup
		//     .object({
		//         label: yup
		//             .string()
		//             .required("Please select a purchase order"),
		//         value: yup
		//             .string()
		//             .required("Please select a purchase order"),
		//     })
		//     .required("Please select a purchase order"),
		vendor: yup.string().required("Please select a vendor"),
		percentage: yup
			.number()
			.typeError("Percentage must be a number")
			.required("Percentage is required")
			.moreThan(0, "Percentage must be greater than 0") // Ensures no 0
			.max(99, "Percentage cannot exceed 99"), // Restricts max value
		remarks: yup.string().required("please enter a remarks"),
		description: yup.string().required("please enter a description"),
	});

	const {
		control,
		handleSubmit,
		reset: POReset,
		getValues,
		setValue,
	} = useForm<any>({
		mode: "all",
		resolver: yupResolver(poSchema),
		[id == "0" ? "defaultValues" : "values"]: {
			vendor: selectedData?.vendor?.name || "",
			requested_date: selectedData?.requested_date,
			due_date: selectedData?.due_date,
			percentage_amount: selectedData?.percentage_amount,
			percentage: selectedData?.percentage ?? "",
			remarks: selectedData?.remarks ? selectedData.description : "",
			description: selectedData?.description
				? selectedData.description
				: "",
		},
	});

	const cal_amt = paymentRequestList?.reduce(
		(sum, item) => sum + parseFloat(String(item?.percentage_amount)),
		0
	);

	const price =
		(id as unknown as number) == 0
			? selectedData?.poitems?.reduce(
					(sum, item) =>
						sum +
						parseFloat(String(item?.price)) * parseInt(item?.qty),
					0
				)
			: selectedData?.base_price;

	useEffect(() => {
		console.log(+price - +cal_amt);
		if (id == "0") {
			POReset({
				percentage: "",
				percentage_amount: "",
				remarks: "",
				description: "",
				due_date: "",
			});
		}
		setValue("requested_date", moment(new Date()).format("YYYY-MM-DD"));
		setValue("price", purchasePrice);
		setValue(
			"bal_price",
			isNaN(+price - +cal_amt) ? "" : (+price - +cal_amt).toFixed(2)
		);
		setValue("vendor", poSelectedData?.vendor?.name);
	}, [id, purchasePrice, cal_amt, price, poSelectedData]);

	function clearDataFn() {
		dispatch(setSelectedData({}));
	}
	const addPaymentRequest = (payload: any) => {
		const data = {
			requested_date: moment(payload?.requested_date).format(
				"YYYY-MM-DD"
			),
			project_id: projectId,
			vendor_id: poSelectedData?.vendor?.id,
			purchase_order_id: purchaseOrderId,
			percentage: payload?.percentage,
			description: payload?.description,
			remarks: payload?.remarks,
			due_date: moment(payload?.due_date).format("YYYY-MM-DD"),
		};

		id == "0"
			? dispatch(
					postPaymentRequest({
						data,
						params: {
							...pageParams,
							project_id: projectId,
						},
						navigate,
					})
				).then(() => {
					POReset((prevState: any) => {
						return {
							...prevState,
							percentage: "",
							percentage_amount: "",
							remarks: "",
							description: "",
							due_date: "",
						};
					});
					// clearDataFn();
				})
			: dispatch(
					editPaymentRequest({
						id: id ? id : "",
						data,
						params: { ...pageParams, project_id: projectId },
						POReset,
						navigate,
					})
				);
	};

	useEffect(() => {
		dispatch(
			getPaymentRequests({
				...pageParams,
				project_id: projectId,
				po_id: purchaseOrderId,
				search: "",
				page: 1,
				page_size: 10,
			})
		);

		setValue("requested_date", moment(new Date()).format("YYYY-MM-DD"));
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		clearDataFn();
	}, []);

	useEffect(() => {
		if (id == "0" && purchaseOrderId != "0") {
			dispatch(getPurchaseOrderById({ id: purchaseOrderId })).then(
				(res: any) => {
					setValue("vendor", res.payload?.response?.vendor?.name);
					dispatch(setSelectedData(res.payload?.response));
				}
			);
		}
	}, [id, purchaseOrderId]);

	useEffect(() => {
		if (id !== "0") {
			dispatch(getPaymentRequestById({ id: id ? id : "" }));
		}
	}, [id]);

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Requested Date",
			width: 100,
		},
		{
			title: "Vendor",
			width: 100,
		},
		{
			title: "Percentage",
			width: 100,
		},
		{
			title: "Percentage Amount",
			width: 100,
		},
		{
			title: "Due Date",
			width: 100,
		},
		{
			title: "remarks",
			width: 100,
		},
		{
			title: "Description",
			width: 100,
		},
		{
			title: "Status",
			width: 100,
		},
	];

	function createData(
		index: number,
		reqDate: string | undefined,
		vendor: string,
		percentage: number,
		percentageAmt: number,
		dueDate: string | undefined,
		remarks: string,
		description: string,
		status: React.JSX.Element
	) {
		return {
			index,
			reqDate,
			vendor,
			percentage,
			percentageAmt,
			dueDate,
			remarks,
			description,
			status,
		};
	}

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getPaymentRequests({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getPaymentRequests({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	const rows = useMemo(() => {
		return paymentRequestList?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);
			const status = <Box>{row?.approved_status_name}</Box>;
			return createData(
				index,
				moment(row?.requested_date).format("DD-MM-YYYY"),
				row?.vendor?.label ?? "",
				Number(row.percentage ?? 0),
				parseFloat(String(row?.percentage_amount)),
				moment(row?.due_date).format("DD-MM-YYYY"),
				row?.remarks ?? "",
				row?.description ?? "",
				status
			);
		});
	}, [selectedData, createData]);

	return (
		<GoBack
			is_goback={true}
			go_back_url={`/work_order/view/${projectId}/${tab}/project/purchase_order/view/${purchaseOrderId}`}
			title={`${id && id != "0" ? "Update" : "Add"} Payment Request`}
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
								<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
									<Stack width={"100%"}>
										<CustomDatepicker
											control={control}
											name="requested_date"
											hideAddon
											dateFormat="DD-MM-YYYY"
											showTimeSelect={false}
											timeFormat="h:mm a"
											timeCaption="time"
											inputClass="form-input"
											disabled
											label={"Requested Date"}
											tI={1}
										/>
									</Stack>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
									{/* <InputLabel
										sx={{
											".MuiInputLabel-asterisk": {
												color: "red",
											},
										}}
										id={"vendor"}
										required={false}
										style={{
											fontWeight: "medium",
											marginBottom: "7px",
										}}>
										{"Vendor"}
									</InputLabel>
									<Typography>
										{poSelectedData?.vendor?.name}
									</Typography> */}

									<FormInput
										name="vendor"
										label="Vendor"
										type="text"
										placeholder="Vendor"
										disabled
										control={control}
									/>
									{/* <SelectComponent
										name="vendor"
										label="Vendor"
										control={control}
										rules={{ required: true }}
										options={miniVendors?.list?.map(
											(e: {
												id: string;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										// loading={miniVendors.loading}
										// selectParams={{
										//     page: miniVendors.miniParams.page,
										//     page_size: miniVendors.miniParams.page_size,
										//     search: miniVendors.miniParams.search,
										//     no_of_pages: miniVendors.miniParams.no_of_pages,
										//     project: projectId ? projectId : "",
										//     purchasorder: purchaseOrderId
										// }}
										// onChange={(value) => {
										//     dispatch(
										//         setSelectedData({
										//             ...selectedData,
										//             vendor: value
										//         })
										//     );
										// }}
										// hasMore={false}
										// fetchapi={getMiniVendors}
										// clearData={clearMiniVendors}
									/> */}
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
									<FormInput
										name="price"
										label="PO Price"
										type="number"
										placeholder="Price"
										disabled
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
									<FormInput
										name="bal_price"
										label="Balance Price"
										type="number"
										placeholder="Balance Price"
										disabled
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
									<FormInput
										name="percentage"
										label="Percentage"
										type="number"
										disabled={
											disableField == "percentage_amount"
												? true
												: false
										}
										placeholder="Enter Percentage here..."
										control={control}
										onInput={(
											e: React.ChangeEvent<HTMLInputElement>
										) => {
											if (e.target.value.length > 4) {
												e.target.value =
													e.target.value.slice(0, 2); // Limit to 2 digits
											}
										}}
										onChange={(event) => {
											const inputValue =
												event.target.value;
											const parsedValue =
												parseFloat(inputValue);

											if (
												parsedValue &&
												!isNaN(parsedValue)
											) {
												const result = parseFloat(
													(
														price *
														(parsedValue / 100)
													).toFixed(2)
												);
												const bal = price - cal_amt;
												if (bal >= result) {
													setValue(
														"percentage",
														inputValue,
														{
															shouldValidate:
																true,
														}
													);
													setValue(
														"percentage_amount",
														isNaN(result)
															? ""
															: result,
														{
															shouldValidate:
																true,
														}
													);
													dispatch(
														setSelectedData({
															...selectedData,
															percentage:
																inputValue,
															percentage_amount:
																result,
														})
													);
												} else {
													setValue(
														"percentage",
														selectedData?.percentage,
														{
															shouldValidate:
																true,
														}
													);

													Swal.fire({
														title: `<p style="font-size:20px">Info</p>`,
														text: "Payment Request exceeded the Purchase Order amount.",
														icon: "warning",
														confirmButtonText: `Close`,
														confirmButtonColor:
															"#3085d6",
													});
												}

												setDisableField("percentage");
											} else {
												// setValue("percentage", "", {
												// 	shouldValidate: true,
												// });
												// setValue(
												// 	"percentage_amount",
												// 	"",
												// 	{
												// 		shouldValidate: true,
												// 	}
												// );
												dispatch(
													setSelectedData({
														...selectedData,
														percentage: "",
														percentage_amount: "",
													})
												);
												setDisableField("");
											}
										}}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
									<FormInput
										name="percentage_amount"
										label="Amount"
										disabled={
											disableField == "percentage"
												? true
												: false
										}
										type="text"
										placeholder="Enter Amount here..."
										control={control}
										onChange={(event) => {
											const result = parseFloat(
												(
													(Number(
														event.target.value
													) /
														price) *
													100
												).toFixed(2)
											);
											const bal = price - cal_amt;
											if (
												bal >=
												Number(event.target.value)
											) {
												setValue("percentage", result);
											} else {
												Swal.fire({
													title: `<p style="font-size:20px">Info</p>`,
													text: "Amount exceeded the Purchase Order amount.",
													icon: "warning",
													confirmButtonText: `Close`,
													confirmButtonColor:
														"#3085d6",
												});
												setValue(
													"percentage_amount",
													0
												);
												setValue("percentage", "");
											}
											dispatch(
												setSelectedData({
													...selectedData,
													percentage_amount:
														event.target.value,
												})
											);
											if (event.target.value) {
												setDisableField(
													"percentage_amount"
												);
											} else {
												setDisableField("");
											}
										}}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
									<Stack width={"100%"}>
										<CustomDatepicker
											control={control}
											name="due_date"
											hideAddon
											dateFormat="DD-MM-YYYY"
											showTimeSelect={false}
											timeFormat="h:mm a"
											timeCaption="time"
											inputClass="form-input"
											label={"Due Date"}
											tI={1}
										/>
									</Stack>
								</Grid>
							</Grid>
							<Grid container spacing={2} mt={2}>
								<Grid size={{ xs: 12, md: 4 }}>
									<TextArea
										name="remarks"
										label="Remarks"
										type="text"
										placeholder="Write Remarks here..."
										minRows={3}
										maxRows={5}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
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
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={5.6}>
									<Button
										color="primary"
										type="submit"
										variant="contained"
										onClick={handleSubmit(
											addPaymentRequest
										)}
										size="large">
										{id && id != "0" ? "Update" : "Add"}{" "}
										Payment Request
									</Button>
								</Grid>
							</Grid>
						</Box>
						<Divider
							sx={{
								mt: 2,
							}}
						/>
						<Box mt={2}>
							<TableComponent
								count={paymentRequestList?.length ?? 0}
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
								showPagination={true}
							/>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddPaymentRequest;