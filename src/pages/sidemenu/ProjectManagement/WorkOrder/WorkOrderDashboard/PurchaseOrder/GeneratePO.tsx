import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid2 as Grid,
	IconButton,
	List,
	Stack,
	styled,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import { useCompareQuotationActions } from "@src/store/sidemenu/project_management/CompareQuotation/cq.action";
import { selectCompareQuotations } from "@src/store/sidemenu/project_management/CompareQuotation/cq.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { useCallback, useEffect, useMemo } from "react";
import { LuCalendar, LuIndianRupee, LuList, LuX } from "react-icons/lu";
import { Inventory2 as InventoryIcon } from "@mui/icons-material";
import { id } from "date-fns/locale";
import moment from "moment";
import { FormInput } from "@src/components";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniLocation,
	getMiniCurrencies,
} from "@src/store/mini/mini.Action";
import {
	clearMiniLocation,
	clearMiniCurrencies,
} from "@src/store/mini/mini.Slice";
import { useParams } from "react-router-dom";
import TextArea from "@src/components/form/TextArea";
import {
	selectPurchaseOrders,
	setSelectedData,
	setGeneratePOModalOpen,
} from "@src/store/sidemenu/project_management/PurchaseOrder/po.slice";
import { editPurchaseOrder } from "@src/store/sidemenu/project_management/PurchaseOrder/po.action";

interface Props {}

interface CustomCardProps {
	selected: boolean;
}

const CustomCardContent = styled(Card)<CustomCardProps>(({
	theme,
	selected,
}) => {
	return {
		marginBottom: "10px",
		boxShadow: "1px",
		width: "100%",
		cursor: "pointer",
		backgroundColor: selected ? theme.palette.primary.light : "",
		color: selected ? "#ffff" : "#000000",
		borderRadius: "20px",
		"&:hover": {
			transition: "0.15s linear",
			borderColor: theme.palette.primary.light,
		},
	};
});

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "70vh",
	width: "100%",
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

const GeneratePO = () => {
	const dispatch = useAppDispatch();
	const {
		purchaseOrder: {
			selectedData,
			generatePOModal: open,
			// selectedData,
			// vendorRelatedItems,
			loading,
			pageParams,
		},
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniCurrencies,
		},
	} = useAppSelector((state) => selectPurchaseOrders(state));

	const { id } = useParams();

	// const {
	// 	reducer: {
	// 		setGeneratePOModalOpen,
	// 		setSelectedVendor,
	// 		setVendorRelatedItems,
	// 	},
	// 	extraReducer: { postPO },
	// } = useCompareQuotationActions();

	const hide = () => {
		dispatch(setGeneratePOModalOpen(false));
		dispatch(setSelectedData(null));
	};

	const GeneratePOSchema = yup.object({
		delivery: yup.string().required("Delivery is required"),
		transport: yup.string().required("Transport is required"),
		payment: yup.string().required("Payment is required"),
		pnf: yup.string().required("P&F is required"),
		gstdetails: yup.string().required("GST type is required"),
		exchange_rate: yup.string().required("Exchange rate are required"),
		description: yup.string().required("Description is required"),
		terms: yup.string().required("Terms & Conditions are required"),
		remarks: yup.string().required("Remarks are required"),
		location: yup
			.object({
				label: yup.string().required("location is required"),
				value: yup.string().required("location is required"),
			})
			.required("location is required"),
		// total: yup.string().required("Total are required"),
	});

	const {
		control,
		getValues,
		reset,
		setValue,
		handleSubmit,
		//formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(GeneratePOSchema),
		values: {
			description: selectedData?.description
				? selectedData?.description
				: "",
			terms: selectedData?.terms ? selectedData?.terms : "",
			delivery: selectedData?.delivery ? selectedData?.delivery : "",
			currency: selectedData?.currency?.id
				? {
						label: selectedData?.currency?.name,
						value: selectedData?.currency?.id,
					}
				: "",
			exchange_rate: selectedData?.exchange_rate
				? selectedData?.exchange_rate
				: "",
			transport: selectedData?.transport ? selectedData?.transport : "",
			payment: selectedData?.payment ? selectedData?.payment : "",
			pnf: selectedData?.pnf ? selectedData?.pnf : "",
			gstdetails: selectedData?.gstdetails
				? selectedData?.gstdetails
				: "",
			remarks: selectedData?.remarks ? selectedData?.remarks : "",
			location: selectedData?.location?.id
				? {
						label: selectedData?.location?.name,
						value: selectedData?.location?.id,
					}
				: "",
		},
	});

	interface Payload {
		delivery: string;
		transport: string;
		payment: string;
		pnf: string;
		gstdetails: string;
		currency: {
			label: string;
			value: string;
		} | null;
		exchange_rate: string;
		description: string;
		terms: string;
		remarks: string;
		location: {
			label: string;
			value: string;
		} | null;
	}

	const handleGenerate = (payload: Payload) => {
		const data = {
			project_id: id ? id : "",
			purchaseenquiry_id: selectedData?.purchaseenquiry?.id
				? selectedData?.purchaseenquiry?.id
				: "",
			location_id: payload?.location?.value
				? payload?.location?.value
				: "",
			quotation_id: selectedData?.quotation?.id
				? selectedData?.quotation?.id
				: "",
			comparequotation_id: selectedData?.comparequotation?.id
				? selectedData?.comparequotation?.id
				: "",
			vendor_id: selectedData?.vendor?.id ? selectedData?.vendor?.id : "",

			description: payload?.description,
			terms: payload?.terms ? payload?.terms : "",
			delivery: payload?.delivery ? payload?.delivery : "",
			currency_id: payload?.currency?.value
				? payload?.currency?.value
				: "",
			exchange_rate: payload?.exchange_rate,
			transport: payload?.transport ? payload?.transport : "",
			payment: payload?.payment ? payload?.payment : "",
			pnf: payload?.pnf ? payload?.pnf : "",
			gstdetails: payload?.gstdetails ? payload?.gstdetails : "",
			remarks: payload?.remarks ? payload?.remarks : "",

			total: selectedData?.total ? `${selectedData?.total}` : "",
			poitems: selectedData?.poitems?.map((item) => {
				return {
					id: item?.id || "",
					item_id: item?.item?.id ? item?.item?.id : "",
					qty: item?.qty ? `${item?.qty}` : "",
					unit_id: item?.unit?.id ? item?.unit?.id : "",
					tax_id: item?.tax?.id ? `${item?.tax?.id}` : "",
					taxtype: item?.taxtype ? item?.taxtype : "",
					qitem_id: item?.qitem ? item?.qitem : "",
					cqitem_id: item?.cqitem ? item?.cqitem : "",
					price: item?.price ? `${item?.price}` : "",
					gross: item?.gross ? `${item?.gross}` : "",
					make_id: item?.make?.id ? item?.make?.id : "",
					description: item?.description ? item?.description : "",
					dodelete: item?.dodelete,
				};
			}),
		};

		dispatch(
			editPurchaseOrder({
				id: selectedData?.id ? selectedData?.id : "",
				data,
				params: pageParams,
				POReset: () => {
					hide();
				},
			})
		);
	};

	useMemo(() => {
		reset({
			delivery: "",
			transport: "",
			payment: "",
			pnf: "",
			gstdetails: "",
			description: "",
			terms: "",
			remarks: "",
			exchange_rate: "",
			currency: undefined,
			location: undefined,
		});
	}, [selectedData]);

	return (
		<Dialog
			open={open}
			onClose={hide}
			fullWidth
			maxWidth="xl"
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle
				sx={{
					p: 1,
					px: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					borderBottom: "1px solid #c7c7c7",
				}}
				variant="h4"
				id="alert-dialog-title">
				<Typography variant="subtitle1">
					Generate Purchase Order
				</Typography>

				<IconButton onClick={hide}>
					<LuX />
				</IconButton>
			</DialogTitle>
			<DialogContent
				sx={{
					px: "24px",
					pt: "12px !important",
					pb: 2,
				}}>
				{loading ? (
					<>
						<Typography
							color={"error"}
							variant="h5"
							sx={{
								textAlign: "center",
							}}>
							Loading Purchase Order Data Please Wait
						</Typography>
					</>
				) : (
					<Grid container spacing={1}>
						<Grid
							size={{
								xs: 12,
							}}>
							<Box>
								<Grid container spacing={1}>
									<Grid size={{ xs: 12 }}>
										{selectedData?.id && (
											<Box>
												<Card elevation={2}>
													<CardHeader
														sx={{
															px: 3,
															py: 2,
															pb: 1,
														}}
														title={
															// <CardContent>
															<Grid
																container
																spacing={1}>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<Stack
																		direction={
																			"row"
																		}
																		spacing={
																			1
																		}>
																		<Typography>
																			Vendor
																			Name:{" "}
																		</Typography>
																		<Typography variant="subtitle2">
																			{
																				selectedData
																					?.vendor
																					?.name
																			}
																		</Typography>
																	</Stack>
																</Grid>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<Stack
																		direction={
																			"row"
																		}
																		spacing={
																			1
																		}>
																		<Typography>
																			Delivery
																			Date:{" "}
																		</Typography>
																		<Typography variant="subtitle2">
																			{selectedData?.quotation?.deliverydate ? (
																				moment(
																					selectedData?.quotation?.deliverydate
																				).format(
																					"DD-MM-YYYY"
																				)
																			) : (
																				<Typography color="error">
																					N/A
																				</Typography>
																			)}
																		</Typography>
																	</Stack>
																</Grid>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<Stack
																		direction={
																			"row"
																		}
																		spacing={
																			1
																		}>
																		<Typography>
																			Total
																			Items:{" "}
																		</Typography>
																		<Typography variant="subtitle2">
																			{
																				selectedData
																					?.poitems
																					?.length
																			}
																		</Typography>
																	</Stack>
																</Grid>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<Stack
																		direction={
																			"row"
																		}
																		spacing={
																			1
																		}>
																		<Typography>
																			Total
																			Gross:{" "}
																		</Typography>
																		<Typography variant="subtitle2">
																			<Stack
																				direction={
																					"row"
																				}
																				alignItems="center"
																				spacing={
																					1
																				}>
																				<LuIndianRupee />
																				{
																					selectedData?.total
																				}
																			</Stack>
																		</Typography>
																	</Stack>
																</Grid>
															</Grid>
															// </CardContent>
														}
													/>
												</Card>

												<Card
													elevation={2}
													sx={{
														mt: 2,
														p: 2,
														borderRadius: 4,
													}}>
													<Box>
														<form>
															<Grid
																container
																spacing={2}>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<FormInput
																		control={
																			control
																		}
																		required
																		name="delivery"
																		label="Delivery"
																		type="text"
																		placeholder="Enter delivery here..."
																	/>
																</Grid>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<FormInput
																		control={
																			control
																		}
																		required
																		name="transport"
																		label="Transport"
																		type="text"
																		placeholder="Enter transport here..."
																	/>
																</Grid>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<FormInput
																		control={
																			control
																		}
																		required
																		name="payment"
																		label="Payment"
																		type="text"
																		placeholder="Enter payment here..."
																	/>
																</Grid>

																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<FormInput
																		control={
																			control
																		}
																		required
																		name="gstdetails"
																		label="GST Type"
																		type="text"
																		placeholder="Enter gst type here..."
																	/>
																</Grid>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<SelectComponent
																		name="currency"
																		label="Currency"
																		control={
																			control
																		}
																		rules={{
																			required:
																				true,
																		}}
																		options={miniCurrencies.list.map(
																			(e: {
																				id:
																					| string
																					| number;
																				name: string;
																			}) => ({
																				id: e.id,
																				name: e.name,
																			})
																		)}
																		loading={
																			miniCurrencies.loading
																		}
																		selectParams={{
																			page: miniCurrencies
																				.miniParams
																				.page,
																			page_size:
																				miniCurrencies
																					.miniParams
																					.page_size,
																			search: miniCurrencies
																				.miniParams
																				.search,
																			no_of_pages:
																				miniCurrencies
																					.miniParams
																					.no_of_pages,
																		}}
																		disabled
																		hasMore={
																			miniCurrencies
																				.miniParams
																				.page <
																			miniCurrencies
																				.miniParams
																				.no_of_pages
																		}
																		fetchapi={
																			getMiniCurrencies
																		}
																		clearData={
																			clearMiniCurrencies
																		}
																		onChange={(
																			value
																		) => {}}
																	/>
																</Grid>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<FormInput
																		name="exchange_rate"
																		label="Exchange Rate"
																		type="number"
																		placeholder="Enter exchange rate here..."
																		control={
																			control
																		}
																		onChange={(
																			event
																		) => {
																			dispatch(
																				setSelectedData(
																					{
																						...selectedData,
																						exchange_rate:
																							event
																								.target
																								.value,
																					}
																				)
																			);
																		}}
																	/>
																</Grid>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<SelectComponent
																		name="location"
																		label="Location"
																		required
																		control={
																			control
																		}
																		rules={{
																			required:
																				true,
																		}}
																		options={miniLocationList?.map(
																			(e: {
																				id:
																					| string
																					| number;
																				name: string;
																			}) => ({
																				id: e.id,
																				name: e.name,
																			})
																		)}
																		loading={
																			miniLocationLoading
																		}
																		selectParams={{
																			page: miniLocationParams.page,
																			page_size:
																				miniLocationParams.page_size,
																			search: miniLocationParams.search,
																			no_of_pages:
																				miniLocationParams.no_of_pages,
																			project:
																				id
																					? id
																					: "",
																		}}
																		hasMore={
																			miniLocationParams.page <
																			miniLocationParams.no_of_pages
																		}
																		fetchapi={
																			getMiniLocation
																		}
																		clearData={
																			clearMiniLocation
																		}
																	/>
																</Grid>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<FormInput
																		control={
																			control
																		}
																		required
																		name="pnf"
																		label="P&F"
																		type="text"
																		placeholder="Enter p&f here..."
																	/>
																</Grid>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<TextArea
																		name="description"
																		label="Description"
																		type="text"
																		required
																		placeholder="Write Description here..."
																		minRows={
																			3
																		}
																		maxRows={
																			5
																		}
																		containerSx={{
																			display:
																				"grid",
																			gap: 1,
																		}}
																		control={
																			control
																		}
																	/>
																</Grid>

																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<TextArea
																		name="terms"
																		label="Terms and Conditions"
																		type="text"
																		required
																		placeholder="Write Terms and Conditions here..."
																		minRows={
																			3
																		}
																		maxRows={
																			5
																		}
																		containerSx={{
																			display:
																				"grid",
																			gap: 1,
																		}}
																		control={
																			control
																		}
																	/>
																</Grid>
																<Grid
																	size={{
																		xs: 12,
																		md: 6,
																	}}>
																	<TextArea
																		name="remarks"
																		label="Remarks"
																		required
																		type="text"
																		placeholder="Write Remarks here..."
																		minRows={
																			3
																		}
																		maxRows={
																			5
																		}
																		containerSx={{
																			display:
																				"grid",
																			gap: 1,
																		}}
																		control={
																			control
																		}
																	/>
																</Grid>
															</Grid>
														</form>
														<Grid
															size={{
																xs: 12,
																md: 6,
															}}></Grid>
													</Box>
												</Card>
											</Box>
										)}
									</Grid>
								</Grid>
							</Box>
						</Grid>
					</Grid>
				)}
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					onClick={() => {
						hide();
					}}>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit(handleGenerate)}>
					Generate
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default GeneratePO;
