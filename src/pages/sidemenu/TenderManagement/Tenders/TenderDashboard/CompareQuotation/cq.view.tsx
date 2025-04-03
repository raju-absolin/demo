import { Description } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardContent,
	Checkbox,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid2 as Grid,
	List,
	ListItem,
	Paper,
	Stack,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import GoBack from "@src/components/GoBack";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import {
	PESetSelectedData,
	selectCompareQuotations,
} from "@src/store/sidemenu/tender_mangement/CompareQuotation/cq.slice";
import {
	getCompareQuotationById,
	// getPoByPe,
	useCompareQuotationActions,
} from "@src/store/sidemenu/tender_mangement/CompareQuotation/cq.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, {
	ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useParams } from "react-router-dom";
// import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import { getPurchaseEnquiryById } from "@src/store/sidemenu/tender_mangement/CompareQuotation/cq.action";
import { getPurchaseQuotations } from "@src/store/sidemenu/tender_mangement/PurchaseQuotation/pq.action";
import { CheckedListItem } from "@src/store/sidemenu/tender_mangement/CompareQuotation/cq.types";
import { LuCheckCircle, LuCheckCircle2 } from "react-icons/lu";
import GeneratePO from "./GeneratePO";
import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import { Quotation } from "@src/store/sidemenu/tender_mangement/PurchaseQuotation/pq.types";
import ApprovalWorkflow from "@src/components/Approvals";

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "400px",
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

interface CustomCardProps {
	selected: boolean;
}
const CustomTableCell = styled(TableCell)<CustomCardProps>(
	({ theme, selected }) => ({
		color:
			theme.palette.mode == "dark"
				? selected
					? theme.palette.background.default
					: "#ffff"
				: theme.palette.text.primary,
	})
);

const Loader = styled(CircularProgress)(({ theme }) => ({
	display: "block",
	margin: "20px auto",
}));

const CompareQuotationView = () => {
	const { id, tenderId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const dispatch = useAppDispatch();
	const {
		compareQuotation: {
			selectedData,
			checkedList,
			pageParams,
			loading,
			peSelectedData,
		},
		mini: { miniEnquiry },
		purchaseQuotation: {
			pageParams: pqPageParams,
			purchaseQuotationList,
			purchaseQuotationCount,
			loading: pqLoading,
		},
		purchaseEnquiry: { loading: peLoading },
		tenders: { selectedData: tendersSelectedData },
	} = useAppSelector((state) => selectCompareQuotations(state));

	const {
		reducer: {
			// setGeneratePOModalOpen,
			setSelectedVendor,
			setVendorRelatedItems,
			// setPOByPE,
			setSelectedData,
		},
	} = useCompareQuotationActions();

	useEffect(() => {
		setSelectedVendor(null);
		setVendorRelatedItems([]);
		// setPOByPE([]);
		setSelectedData({});
		dispatch(PESetSelectedData({}));
	}, []);
	useEffect(() => {
		if (id != "0") {
			dispatch(
				getCompareQuotationById({
					id: id ? id : "",
				})
			);
		}
	}, [id]);

	const renderData = [
		{
			label: "Compare Quotation Code",
			value: selectedData?.code,
		},
		{
			label: "Purchase Enquiry Code",
			value: selectedData?.purchase_enquiry?.code,
		},
		{
			label: "Compare Quotation Status",
			value: (
				<span>
					{!selectedData?.cqstatus ? (
						"None"
					) : (
						<Chip
							label={
								<Typography>
									{selectedData?.cqstatus_name}
								</Typography>
							}
							color={(() => {
								let tagColor:
									| "default"
									| "primary"
									| "secondary"
									| "success"
									| "error"
									| "info"
									| "warning" = "default";
								switch (selectedData?.cqstatus) {
									case 1:
										tagColor = "warning";
										break;
									case 2:
										tagColor = "success"; // MUI does not have 'blue', using 'info' instead
										break;
									case 3:
										tagColor = "error";
										break;
									default:
										tagColor = "default"; // Fallback color
								}
								return tagColor;
							})()}
						/>
					)}
				</span>
			),
		},
		{
			label: "Project",
			value: selectedData?.project?.name,
		},
		{
			label: "Date",
			value: moment(selectedData?.date).format("DD-MM-YYYY"),
		},
	];
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
			title: "Make",
			width: 100,
		},
		{
			title: "Vendor",
			width: 100,
		},
		{
			title: "Date & Time",
			width: 100,
		},
		{
			title: "Quantity",
			width: 100,
		},
		{
			title: "Total",
			width: 100,
		},
	];

	function createData(
		index: number,
		item_name: string,
		make: string,
		vendor: string,
		date: string,
		quantity: string | number,
		total: string | number
	) {
		return {
			index,
			item_name,
			make,
			vendor,
			date,
			quantity,
			total,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.comparequotationitems
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

				return createData(
					index,
					row?.item?.name,
					row.make,
					row?.vendor?.name,
					moment(row.date).format("LLL"),
					row.qty,
					row.total_price
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getPurchaseEnquiry({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getPurchaseEnquiry({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};

	useEffect(() => {
		if (
			id != "0" &&
			tendersSelectedData?.project?.id &&
			selectedData?.purchase_enquiry?.id
		) {
			dispatch(
				getPurchaseQuotations({
					...pqPageParams,
					project_id: tendersSelectedData?.project?.id
						? tendersSelectedData?.project?.id
						: "",
					purchase_enquiry: selectedData?.purchase_enquiry?.id
						? {
								label: selectedData?.purchase_enquiry?.name,
								value: selectedData?.purchase_enquiry?.id,
							}
						: null,
				})
			);
		}
	}, [tendersSelectedData, selectedData]);

	useEffect(() => {
		if (selectedData?.purchase_enquiry) {
			dispatch(
				getPurchaseEnquiryById({
					id: selectedData?.purchase_enquiry?.id
						? selectedData?.purchase_enquiry?.id
						: "",
				})
			);
			// dispatch(
			// 	getPoByPe({
			// 		id: selectedData?.purchase_enquiry?.id
			// 			? selectedData?.purchase_enquiry?.id
			// 			: "",
			// 	})
			// );
		}
	}, [selectedData?.purchase_enquiry?.id]);

	const vendors = peSelectedData?.vendors;
	const enquiryItems = peSelectedData?.pqitems;
	const quotations = purchaseQuotationList;

	const getQuotationForItemMakeAndVendor = useCallback(
		(
			itemId: string,
			vendorId: string,
			unitId: string
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

	const calculatePriceAfterDiscount = (
		price: number,
		discountPercentage: number
	) => {
		const discountAmount = (discountPercentage / 100) * price;
		return price - discountAmount;
	};

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

				// Object.keys(initialValuesObj)
				// 	?.filter((key) => key.startsWith("available_qty_"))
				// 	?.reduce((acc, value) => {
				//
				// 		return acc + parseInt(initialValuesObj[value]);
				// 	}, 0);
			}
		});

		return {
			entered_qty,
			initialValuesObj,
		};
	}, [checkedList]);

	// const showGeneratePoModal = () => {
	// 	setGeneratePOModalOpen(true);
	// };

	return (
		<Grid container spacing={2}>
			<Grid
				size={{
					xs: 12,
					lg: selectedData?.authorized_status !== 4 ? 8.5 : 12,
				}}>
				<GoBack
					is_goback={true}
					go_back_url={`/tenders/view/${tenderId}/${tab}/compare_quotation/`}
					title={`Compare Quotation`}
					showSaveButton={false}
					loading={false}>
					{/* <GeneratePO /> */}
					<Box
						sx={{
							my: 0,
						}}>
						<Card>
							<CardContent>
								<Box
									px={2}
									sx={{
										borderRadius: 2,
									}}>
									<Grid container spacing={3}>
										{renderData.map((item) => {
											return (
												<Grid size={{ xs: 12, md: 4 }}>
													<Typography variant="h5">
														{item.label}:{" "}
														{item.value}
													</Typography>
												</Grid>
											);
										})}
										{/* <Box>
									<LoadingButton
										loading={loading}
										disabled={loading}
										variant="contained"
										color="success"
										size="large"
										onClick={showGeneratePoModal}>
										<Stack
											direction={"row"}
											spacing={1}
											alignItems="center">
											<LuCheckCircle size={16} />
											<Typography>
												Generate Purchase Order
											</Typography>
										</Stack>
									</LoadingButton>
								</Box> */}
									</Grid>
								</Box>
								<Divider
									sx={{
										my: 2,
									}}
								/>
								<Box>
									{/* <TableComponent
								showPagination={false}
								count={
									selectedData?.comparequotationitems?.length
										? selectedData?.comparequotationitems
												?.length
										: 0
								}
								columns={columns}
								rows={rows ? rows : []}
								loading={false}
								page={pageParams.page}
								pageSize={pageParams.page_size}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
							/> */}
									{/* <ScrollableList> */}

									{/* {pqLoading ? (
								<Loader />
							) : ( */}
									<>
										<TableContainer
											component={Paper}
											sx={{ maxHeight: 440 }}>
											<Table stickyHeader>
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
														{vendors?.map(
															(vendor) => (
																<TableCell
																	key={
																		vendor.id
																	}
																	sx={{
																		border: "1px solid grey",
																	}}>
																	<Typography
																		variant="h5"
																		color="primary.main"
																		sx={{
																			display:
																				"flex",
																			flex: 1,
																			justifyContent:
																				"space-between",
																		}}>
																		<Box>
																			{vendor?.name?.toUpperCase()}
																		</Box>
																	</Typography>

																	<Typography
																		variant="subtitle2"
																		color="primary.main"
																		sx={{
																			display:
																				"flex",
																			flex: 1,
																			justifyContent:
																				"space-between",
																		}}>
																		Code -{" "}
																		{
																			vendor?.code
																		}
																	</Typography>
																	<Typography
																		variant="subtitle2"
																		color="primary.main"
																		sx={{
																			display:
																				"flex",
																			flex: 1,
																			justifyContent:
																				"space-between",
																		}}>
																		Phone -{" "}
																		{
																			vendor?.mobile
																		}
																	</Typography>
																</TableCell>
															)
														)}
													</TableRow>
												</TableHead>
												<TableBody>
													{enquiryItems?.map(
														(item) => (
															<TableRow
																key={item?.id}>
																<TableCell
																	sx={{
																		border: "1px solid grey",
																	}}>
																	<List>
																		<ListItem>
																			<Typography variant="body1">
																				<strong>
																					Item
																					Code:
																				</strong>{" "}
																				{
																					item
																						?.item
																						?.code
																				}
																			</Typography>
																		</ListItem>
																		<ListItem>
																			<Typography variant="body1">
																				<strong>
																					Item
																					Name:
																				</strong>{" "}
																				{
																					item
																						.item
																						?.name
																				}
																			</Typography>
																		</ListItem>
																		<ListItem>
																			<Typography>
																				<strong>
																					Unit
																					:
																				</strong>{" "}
																				{
																					item
																						?.unit
																						?.name
																				}{" "}
																			</Typography>
																		</ListItem>
																		<ListItem>
																			<Typography>
																				<strong>
																					Make
																					:
																				</strong>{" "}
																				{
																					item
																						?.make
																						?.name
																				}{" "}
																			</Typography>
																		</ListItem>
																		<ListItem>
																			<Typography>
																				<strong>
																					Required
																					Quantity
																					:
																				</strong>{" "}
																				{
																					item?.quantity
																				}{" "}
																				{
																					item
																						?.unit
																						?.label
																				}
																			</Typography>
																		</ListItem>
																		<ListItem>
																			<Stack
																				direction="row"
																				spacing={
																					1
																				}>
																				<Typography>
																					<strong>
																						Entered
																						Quantity
																						:
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
																							item
																								?.id
																						]}{" "}
																					{
																						item
																							?.unit
																							?.label
																					}
																				</Typography>
																			</Stack>
																		</ListItem>
																	</List>
																</TableCell>

																{vendors?.map(
																	(
																		vendor
																	) => {
																		const quotation =
																			getQuotationForItemMakeAndVendor(
																				item
																					?.item
																					.id,
																				vendor.id,
																				(item
																					?.unit
																					?.id as string) ||
																					""
																			);
																		const quotationCurrency =
																			quotation
																				?.currency
																				?.name;
																		const quotationExchangeRate =
																			quotation?.exchange_rate;
																		const quotationItem =
																			quotation?.quotationitems?.find(
																				(
																					qi
																				) =>
																					qi
																						?.item
																						?.id ===
																						item
																							?.item
																							?.id &&
																					qi
																						?.unit
																						?.id ===
																						item
																							?.unit
																							?.id
																			);
																		const tem_price =
																			quotationItem?.price
																				? parseFloat(
																						quotationItem?.price
																					)
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

																		const checkedItem =
																			checkedList[
																				item
																					.id
																			]?.find(
																				(
																					e: any
																				) =>
																					e
																						?.temp_q
																						?.id ===
																					quotation?.id
																			);

																		const selected =
																			checkedItem
																				? true
																				: false;
																		return (
																			<TableCell
																				key={
																					vendor.id
																				}
																				sx={(
																					theme
																				) => ({
																					backgroundColor:
																						checkedItem
																							? "lightgreen"
																							: theme
																									.palette
																									.background
																									.default,
																					// color: checkedItem
																					// 	? theme
																					// 			.palette
																					// 			.background
																					// 			.paper
																					// 	: theme
																					// 			.palette
																					// 			.background
																					// 			.default,

																					border: "1px solid gray",
																				})}>
																				{quotationItem ? (
																					<div className="flex flex-col items-start">
																						<Table
																							sx={{
																								border: "1px solid lightgray",
																							}}>
																							<TableBody>
																								<TableRow>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										<strong>
																											Make:
																										</strong>
																									</CustomTableCell>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										{
																											quotationItem
																												?.make
																												?.name
																										}
																									</CustomTableCell>
																								</TableRow>
																								<TableRow>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										<strong>
																											Quantity:
																										</strong>
																									</CustomTableCell>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										{
																											quotationItem?.qty
																										}{" "}
																										{
																											quotationItem
																												?.unit
																												?.name
																										}
																									</CustomTableCell>
																								</TableRow>
																								<TableRow>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										<strong>
																											Base
																											Price:
																										</strong>
																									</CustomTableCell>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										{
																											quotationItem?.price
																										}
																									</CustomTableCell>
																								</TableRow>
																								<TableRow>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										<strong>
																											Price
																											After
																											Discount:
																										</strong>
																									</CustomTableCell>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										{
																											priceAfterDiscount
																										}

																										(
																										{
																											quotationItem?.discount
																										}

																										)
																										%
																									</CustomTableCell>
																								</TableRow>

																								<TableRow>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										<strong>
																											Tax
																											:
																										</strong>
																									</CustomTableCell>
																									{quotationItem
																										?.tax
																										?.tax ? (
																										<CustomTableCell
																											selected={
																												selected
																											}>
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
																											%)
																											(
																											{
																												quotationItem?.taxtype_name
																											}

																											)
																										</CustomTableCell>
																									) : (
																										<CustomTableCell
																											selected={
																												selected
																											}>
																											0
																											%
																										</CustomTableCell>
																									)}
																								</TableRow>
																								{/* <TableRow>
																					<TableCell>
																						<strong>
																							Tax
																							Amount
																							:
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
																							0
																							%
																						</TableCell>
																					)}
																				</TableRow> */}
																								<TableRow>
																									<CustomTableCell
																										selected={
																											false
																										}>
																										<strong>
																											Currency:
																										</strong>
																									</CustomTableCell>
																									<CustomTableCell
																										selected={
																											false
																										}>
																										{
																											quotationCurrency
																										}
																									</CustomTableCell>
																								</TableRow>
																								<TableRow>
																									<CustomTableCell
																										selected={
																											false
																										}>
																										<strong>
																											Exchange
																											Rate:
																										</strong>
																									</CustomTableCell>
																									<CustomTableCell
																										selected={
																											false
																										}>
																										{
																											quotationExchangeRate
																										}
																									</CustomTableCell>
																								</TableRow>
																								<TableRow>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										<strong>
																											Net
																											Value:
																										</strong>
																									</CustomTableCell>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										₹{" "}
																										{checkedItem
																											?.quotationitem
																											?.total_price ||
																											0}{" "}
																									</CustomTableCell>
																								</TableRow>
																								<TableRow>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										<strong>
																											Avaliable
																											Quantity:
																										</strong>
																									</CustomTableCell>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										₹{" "}
																										{checkedItem
																											?.quotationitem
																											?.available_qty ||
																											0}{" "}
																									</CustomTableCell>
																								</TableRow>
																								<TableRow>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										<strong>
																											Margin
																											Value:
																										</strong>
																									</CustomTableCell>
																									<CustomTableCell
																										selected={
																											selected
																										}>
																										₹{" "}
																										{checkedItem
																											?.quotationitem
																											?.margin_value ||
																											0}{" "}
																									</CustomTableCell>
																								</TableRow>
																							</TableBody>
																						</Table>
																						{/* <Stack
																			direction="row"
																			alignItems="center">
																			<Checkbox
																				checked={
																					checkedList[
																						item
																							.id
																					]
																						?.temp_q
																						?.id ===
																					quotation?.id
																				}
																			/>
																			<Typography>
																				Check
																				to
																				select
																				this
																				Quotation
																			</Typography>
																		</Stack> */}
																					</div>
																				) : (
																					<Typography variant="body2">
																						No
																						quotation
																					</Typography>
																				)}
																			</TableCell>
																		);
																	}
																)}
															</TableRow>
														)
													)}
												</TableBody>
											</Table>
										</TableContainer>
									</>
									{/* )} */}
									{/* </ScrollableList> */}
								</Box>
							</CardContent>
						</Card>
					</Box>
				</GoBack>
			</Grid>
			{selectedData?.authorized_status !== 4 && (
				<Grid
					size={{
						xs: 12,
						lg: 3.5,
					}}>
					<ApprovalWorkflow
						data={selectedData}
						app_label={"CompareQuotation"}
						model_name={"comparequotation"}
						instance_id={id || ""}
						callback={() => {
							dispatch(
								getCompareQuotationById({
									id: id || "",
								})
							);
						}}
					/>
				</Grid>
			)}
		</Grid>
	);
};

export default CompareQuotationView;
