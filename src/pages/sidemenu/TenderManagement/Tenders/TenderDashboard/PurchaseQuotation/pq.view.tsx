import { FileUploadOutlined } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid2 as Grid,
	IconButton,
	List,
	Stack,
	styled,
	Typography,
	useTheme,
} from "@mui/material";
import { FileType, ScrollableList } from "@src/components";
import ApprovalWorkflow from "@src/components/Approvals";
import GoBack from "@src/components/GoBack";
import Loader from "@src/components/Loader";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import { updateSidenav } from "@src/store/customise/customise";
import { selectEnquiry } from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.slice";
import {
	deletePQAttachment,
	getPQAttachments,
	getPurchaseQuotationById,
	postPQAttachment,
} from "@src/store/sidemenu/tender_mangement/PurchaseQuotation/pq.action";
import { selectPurchaseQuotations } from "@src/store/sidemenu/tender_mangement/PurchaseQuotation/pq.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, {
	ChangeEvent,
	SyntheticEvent,
	useEffect,
	useMemo,
	useState,
} from "react";
import Dropzone from "react-dropzone";
import { LuFile, LuX } from "react-icons/lu";
import { useParams } from "react-router-dom";

// const ScrollableList = styled(List)(({ theme }) => ({
// 	maxHeight: "300px",
// 	marginTop: "15px",
// 	overflowY: "auto",
// 	padding: "0 8px",
// 	"&::-webkit-scrollbar": {
// 		width: "8px",
// 	},
// 	"&::-webkit-scrollbar-thumb": {
// 		backgroundColor: theme.palette.primary.main,
// 		borderRadius: "8px",
// 	},
// }));

const HorizontalFilePreview = ({ file }: { file: any }) => {
	const dispatch = useAppDispatch();
	// const {
	// 	reducer: { setSelectedData },
	// 	extraReducer: {
	// 		editTaskData,
	// 		postTaskAttachment,
	// 		deleteTaskAttachment,
	// 	},
	// } = useTaskActions();

	const {
		purchaseQuotation: { Pq_attachments_params },
	} = useAppSelector((state) => selectPurchaseQuotations(state));

	function handleDismiss() {
		dispatch(
			deletePQAttachment({
				id: file.id ? file.id : "",
				params: Pq_attachments_params,
			})
		);
	}
	let fileName = "";
	if (!file?.path) return "";

	const dotIndex = file?.path.lastIndexOf(".");
	const baseName =
		dotIndex > 0 ? file?.path?.substring(0, dotIndex) : file?.path;

	fileName =
		baseName.length > 15 ? baseName.substring(0, 15) + "..." : baseName;
	return (
		<Box
			id={file.name}
			sx={{
				border: "1px solid",
				borderColor: "divider",
				borderRadius: "6px",
				p: "12px",
				display: "flex",
			}}
			mt={2}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					cursor: "pointer",
				}}
				onClick={(e) => {
					window.open(file.preview);
				}}>
				{file.preview ? (
					<Avatar
						variant="rounded"
						sx={{
							height: "48px",
							width: "48px",
							bgcolor: "grey",
							objectFit: "cover",
						}}
						alt={file.path}
						src={file.preview}
					/>
				) : (
					<Typography
						component={"span"}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "primary.main",
							fontWeight: 600,
							borderRadius: "6px",
							height: "48px",
							width: "48px",
							bgcolor: "#3e60d51a",
						}}>
						<LuFile />
					</Typography>
				)}
				<Box>
					<Typography sx={{ fontWeight: 600, color: "grey.700" }}>
						{fileName}
					</Typography>
					<Typography component={"p"} color={"grey.700"}>
						{file.formattedSize}
					</Typography>
				</Box>
			</Box>
			{/* <IconButton sx={{ marginLeft: "auto", my: "auto" }}>
				<LuX size={18} onClick={() => handleDismiss()} />
			</IconButton> */}
		</Box>
	);
};

const PurchaseQuotationView = () => {
	const { id, tenderId, tab } = useParams();
	const dispatch = useAppDispatch();

	const {
		purchaseQuotation: {
			selectedData,
			pageParams,

			pq_attachment_loading,
			pq_attachments,
			pq_attachments_count,
			Pq_attachments_params,
		},
	} = useAppSelector((state) => selectPurchaseQuotations(state));

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		dispatch(
			getPurchaseQuotationById({
				id: id ? id : "",
			})
		);
	}, [id]);

	const renderData = [
		{
			label: "Code",
			value: selectedData?.code,
		},
		{
			label: "Created On",
			value: selectedData?.created_on,
		},
		{
			label: "Delivery Date",
			value: moment(selectedData?.deliverydate).format("DD-MM-YYYY"),
		},
		{
			label: "Purchase Enquiry Code",
			value: selectedData?.purchase_enquiry?.name,
		},
		{
			label: "Vendor",
			value: selectedData?.vendor?.name,
		},
		{
			label: "Project",
			value: selectedData?.project?.name,
		},
		{
			label: "Currency",
			value: selectedData?.currency?.name,
		},
		{
			label: "Exchange Rate",
			value: selectedData?.exchange_rate,
		},
		{
			label: "Total",
			value: selectedData?.total,
		},
		{
			label: "Description",
			value: (
				<ReadMore
					text={
						selectedData?.description
							? selectedData?.description
							: ""
					}
					maxLength={30}
				/>
			),
		},
		{
			label: "Terms & Conditions",
			value: (
				<ReadMore
					text={
						selectedData?.termsandconditions
							? selectedData?.termsandconditions
							: ""
					}
					maxLength={30}
				/>
			),
		},
		{
			label: "Financial Terms",
			value: (
				<ReadMore
					text={
						selectedData?.financial_terms
							? selectedData?.financial_terms
							: ""
					}
					maxLength={30}
				/>
			),
		},
		{
			label: "Delivery Terms",
			value: (
				<ReadMore
					text={
						selectedData?.deliver_terms
							? selectedData?.deliver_terms
							: ""
					}
					maxLength={30}
				/>
			),
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
			title: "Quantity",
			width: 100,
		},
		{
			title: "Units",
			width: 100,
		},
		{
			title: "Make",
			width: 100,
		},
		{
			title: "Item Base Price",
			width: 100,
		},
		{
			title: "Item Discount(%)",
			width: 100,
		},
		{
			title: "Price After Discount",
			width: 100,
		},
		{
			title: "Gross Price (Qty * Price After Discount)",
			width: 200,
		},
		{
			title: "Tax Type",
			width: 100,
		},
		{
			title: "Tax %",
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
	];

	function createData(
		index: number,
		name: string,
		quantity: string | number,
		unit: string,
		make: string,
		price: string | number,
		discount: string | number,
		price_after_discount: string | number,
		gross: string | number,
		taxtype: string | number,
		tax: string | number,
		tax_amount: string | number,
		total: string | number
	) {
		return {
			index,
			name,
			quantity,
			unit,
			make,
			price,
			discount,
			price_after_discount,
			gross,
			taxtype,
			tax,
			tax_amount,
			total,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.quotationitems
			?.filter((e) => !e?.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const qty = row?.qty ? +row?.qty : 0;
				const tem_price = row?.price ? parseFloat(row?.price) : 0;

				const discount_percentage = row?.discount ? +row?.discount : 0;
				const discount_amount = (discount_percentage / 100) * tem_price;

				const price_after_discount = discount_percentage
					? parseFloat(`${tem_price - discount_amount}`).toFixed(2)
					: tem_price;

				let gross = parseFloat(
					`${qty * parseFloat(`${price_after_discount}`)}`
				).toFixed(2);

				const taxType = row?.taxtype?.value;
				let total: number = 0;
				const taxRate = row?.tax?.tax || 0;
				const tax_amount =
					taxType == 2
						? (() => {
								if (row?.tax?.id) {
									const taxAmt = parseFloat(
										`${parseFloat(gross) * (taxRate / 100)}`
									);
									total = parseFloat(gross) + taxAmt; // Add tax to the gross for exclusive tax
									return taxAmt.toFixed(2);
								}
								return 0;
							})()
						: (() => {
								const basicValue =
									parseFloat(gross) / (1 + taxRate / 100);
								const taxamt = basicValue * (taxRate / 100);

								total = parseFloat(gross);
								return taxamt.toFixed(2);
							})();

				return createData(
					index,
					row?.item?.name ? row?.item?.name : "",
					qty,
					row?.unit?.name ? row?.unit?.name : "",
					row?.make?.label ? row?.make?.label : "",
					tem_price,
					discount_percentage,
					price_after_discount,
					gross,
					row?.taxtype_name ? row?.taxtype_name : "",
					row?.tax?.tax ? row?.tax?.tax : "",
					tax_amount,
					total.toFixed(2)
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getPurchaseQuotation({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getPurchaseQuotation({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};
	const theme = useTheme();

	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

		/**
		 * Formats the size
		 */
		const formatBytes = (bytes: number, decimals: number = 2) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = [
				"Bytes",
				"KB",
				"MB",
				"GB",
				"TB",
				"PB",
				"EB",
				"ZB",
				"YB",
			];

			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return (
				parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
				" " +
				sizes[i]
			);
		};

		// // Creating a new array with the modified files
		// const modifiedFiles = files.map((file) =>
		// 	Object.assign({}, file, {
		// 		originalObj: file,
		// 		preview:URL.createObjectURL(file),
		// 		formattedSize: formatBytes(file.size),
		// 	})
		// );

		dispatch(
			postPQAttachment({
				data: {
					quotation_id: selectedData?.id ? selectedData?.id : "",
					file: files[0],
				},
				params: Pq_attachments_params,
			})
		);

		// const documents = [...(uploadDocuments || []), modifiedFiles[0]];

		// dispatch(setUploadDocument(documents));
	};
	useEffect(() => {
		dispatch(
			getPQAttachments({
				...Pq_attachments_params,
				page: 1,
				page_size: 10,
				quotation: id,
			})
		);
	}, []);

	return (
		<Grid container spacing={2}>
			<Grid
				size={{
					xs: 12,
					lg: selectedData?.authorized_status !== 4 ? 8.5 : 12,
				}}>
				<GoBack
					is_goback={true}
					go_back_url={`/tenders/view/${tenderId}/${tab}/purchase_quotation/`}
					title={`Purchase Quotation`}
					showSaveButton={false}
					loading={false}>
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
													<Typography variant="h6">
														{item.label}:{" "}
														{item?.value as any}
													</Typography>
												</Grid>
											);
										})}
									</Grid>
								</Box>
								{/* File Upload */}

								<Card>
									<CardHeader title={"Files Uploaded"} />
									{/* <CardContent>
										<Dropzone
											onDrop={(acceptedFiles) => {
												handleAcceptedFiles(
													acceptedFiles,
													() => {}
												);
											}}>
											{({
												getRootProps,
												getInputProps,
											}) => (
												<Box>
													<Box className="fallback">
														<input
															{...getInputProps()}
															name="file"
															type="file"
															multiple
														/>
													</Box>
													<div
														className="dz-message needsclick"
														{...getRootProps()}>
														<Button
															variant="contained"
															startIcon={
																<FileUploadOutlined />
															}
															sx={{
																bgcolor:
																	"purple",
																"&:hover": {
																	bgcolor:
																		"darkviolet",
																},
																fontWeight: 600,
																textTransform:
																	"none",
															}}>
															Select File
														</Button>
													</div>
												</Box>
											)}
										</Dropzone>
									</CardContent> */}

									{pq_attachments.length != 0 ? (
										<ScrollableList
											styles={{
												maxHeight: "550px",
												padding: 0,
												m: 0,
											}}
											list={pq_attachments}
											loading={pq_attachment_loading}
											params={{
												...Pq_attachments_params,
												page:
													Pq_attachments_params?.page +
													1,
												page_size: 10,
												quotation: id,
											}}
											fetchapi={getPQAttachments}
											keyExtractor={(item) =>
												item?.id || ""
											} // Uses `id` as key
											renderItem={(
												row,
												index,
												selectedRow,
												handleSelect
											) => {
												return (
													<HorizontalFilePreview
														file={row}
													/>
												);
											}}
										/>
									) : (
										<Typography>NO Data</Typography>
									)}
								</Card>
								<Divider
									sx={{
										mt: 2,
									}}
								/>
								<Box>
									<TableComponent
										showPagination={false}
										containerHeight={440}
										count={
											selectedData?.quotationitems?.length
												? selectedData?.quotationitems
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
									/>
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
						app_label={"Quotation"}
						model_name={"quotation"}
						instance_id={id || ""}
						callback={() => {
							dispatch(
								getPurchaseQuotationById({
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

export default PurchaseQuotationView;
