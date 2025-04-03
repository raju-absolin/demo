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
	Tooltip,
	Typography,
	useTheme,
	Zoom,
} from "@mui/material";
import GoBack from "@src/components/GoBack";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import { updateSidenav } from "@src/store/customise/customise";
import { selectEnquiry } from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.slice";
import {
	deletePQAttachment,
	getPQAttachments,
	getPurchaseQuotationById,
	postPQAttachment,
} from "@src/store/sidemenu/project_management/PurchaseQuotation/pq.action";
import { selectPurchaseQuotations } from "@src/store/sidemenu/project_management/PurchaseQuotation/pq.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, {
	ChangeEvent,
	SyntheticEvent,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuArrowLeftCircle, LuFile, LuX } from "react-icons/lu";
import Dropzone from "react-dropzone";
import { FileUploadOutlined } from "@mui/icons-material";
import { FileType } from "@src/components";
import Loader from "@src/components/Loader";
import { RiAddCircleFill } from "react-icons/ri";
import { pdf } from "@react-pdf/renderer";
import { PurchaseQuotationPrintContent } from "@src/pages/sidemenu/PrintPDF/purchaseQuotation";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "300px",
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

const HorizontalFilePreview = ({ file }: { file: FileType }) => {
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
				display: "flex",
				cursor: "pointer",
			}} mt={2}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					p: "12px",
					width: "100%",
					height: "100%",
				}}
				onClick={() => {
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
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const [showDeliveryTerms, setShowDeliveryTerms] = useState(false);
	const [showFinancialTerms, setShowFinancialTerms] = useState(false);
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
		system: { userAccessList },
	} = useAppSelector((state) => selectPurchaseQuotations(state));
	const navigate = useNavigate();

	const {
		company: { companyData },
	} = useAppSelector((state) => {
		return {
			company: companySelector(state),
		};
	});

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
		dispatch(setCompanyData({}));
	}, [id]);

	const renderData = [
		{
			label: "Code",
			value: selectedData?.code,
		},
		{
			label: "Delivery Date",
			value: moment(selectedData?.deliverydate, "YYYY-MM-DD").format(
				"DD-MM-YYYY"
			),
		},

		{
			label: "Purchase Enquiry Code",
			value: (
				<Tooltip
					TransitionComponent={Zoom}
					title="Click to view enquiry details">
					<Link
						to={`/work_order/view/${id}/${tab}/project/purchase_enquiry/view/${selectedData?.purchase_enquiry?.id}`}>
						<Button variant="contained">
							{selectedData?.purchase_enquiry?.name}
						</Button>
					</Link>
				</Tooltip>
			),
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
			label: "INR Value",
			value: `${selectedData?.inr_value} Rs`,
		},
		{
			label: "Created On",
			value: selectedData?.created_on,
		},
		{
			label: "Created By",
			value: selectedData?.created_by?.fullname,
		},
		{
			label: "Modified On",
			value: selectedData?.modified_on,
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
								parseFloat(gross) /
								(1 + taxRate / 100);
							const taxamt =
								basicValue * (taxRate / 100);

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
	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<PurchaseQuotationPrintContent
				purchaseQuotationData={selectedData}
				companyData={companyData}
			/>
		).toBlob();
		var blobURL = URL.createObjectURL(blob);

		var iframe = document.createElement("iframe"); //load content in an iframe to print later
		document.body.appendChild(iframe);

		iframe.style.display = "none";
		iframe.src = blobURL;
		iframe.onload = function () {
			setTimeout(function () {
				iframe.focus();
				iframe.contentWindow?.print();
			}, 1);
		};
	};
	const onHandleDownload = async (companyData: any) => {
		const blob = await pdf(
			<PurchaseQuotationPrintContent
				purchaseQuotationData={selectedData}
				companyData={companyData}
			/>
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "PurchaseQuotation.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} else {
			console.error("Failed to generate PDF");
		}
	};

	return (
		<Box
			sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
			mt={2}>
			<Card
				sx={{
					p: 2,
					display: "flex",
					alignItems: "center",
					gap: 2,
				}}>
				<Typography
					variant="h4"
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 2,
						cursor: "pointer",
					}}
					onClick={() => {
						navigate(
							`/work_order/view/${projectId}/${tab}/project/purchase_quotation/`,
							{
								relative: "path",
							}
						);
					}}>
					<LuArrowLeftCircle color={theme.palette.primary.main} />
					Purchase Quotation
				</Typography>
				<Box sx={{ flex: 1 }} />
				<Box sx={{ display: "flex", gap: 2 }}>
					{userAccessList?.indexOf("System.all_data") !== -1 && (
						<>
							<Button
								variant="contained"
								size="large"
								onClick={() => {
									if (
										!companyData ||
										Object.keys(companyData).length === 0
									) {
										dispatch(
											getCompanyById({
												id: selectedData?.project
													?.company,
											})
										).then(async (res: any) => {
											onHandlePrintPreview(
												res.payload?.response
											);
										});
									} else {
										onHandlePrintPreview(companyData);
									}
								}}>
								Print
							</Button>
							<Button
								variant="contained"
								size="large"
								onClick={() => {
									if (
										!companyData ||
										Object.keys(companyData).length === 0
									) {
										dispatch(
											getCompanyById({
												id: selectedData?.project
													?.company,
											})
										).then(async (res: any) => {
											onHandleDownload(
												res.payload?.response
											);
										});
									} else {
										onHandleDownload(companyData);
									}
								}}>
								Download PDF
							</Button>
						</>
					)}
				</Box>
			</Card>
			<Box>
				<Card>
					<CardContent>
						<Box
							p={2}
							sx={{
								borderRadius: 2,
							}}>
							<Grid container spacing={3}>
								{renderData.map((item) => {
									return (
										<Grid size={{ xs: 12, md: 4 }}>
											<Typography variant="h6">
												<b>{item.label}</b>:{"  "}
												{item?.value as any}
											</Typography>
										</Grid>
									);
								})}
								<Grid container size={{ xs: 12 }}>
									<Grid size={{ xs: 12, md: 4 }}>
										<Stack
											direction={"row"}
											spacing={1}
											alignItems="center">
											<Typography variant="h6">
												<b>Description:</b>
											</Typography>
											<Button
												onClick={() =>
													setShowDescription(true)
												}>
												Click to see description
											</Button>
											{showDescription && (
												<Dialog
													open={showDescription}
													onClose={() =>
														setShowDescription(
															false
														)
													}
													maxWidth="md"
													fullWidth>
													<DialogTitle>
														{"Description"}
													</DialogTitle>
													<DialogContent>
														<Typography>
															{
																selectedData?.description
															}
														</Typography>
													</DialogContent>
													<DialogActions>
														<Button
															onClick={() =>
																setShowDescription(
																	false
																)
															}>
															Close
														</Button>
													</DialogActions>
												</Dialog>
											)}
										</Stack>
									</Grid>
									<Grid size={{ xs: 12, md: 4 }}>
										<Stack
											direction={"row"}
											spacing={1}
											alignItems="center">
											<Typography variant="h6">
												<b>Delivery Terms:</b>
											</Typography>
											<Button
												onClick={() =>
													setShowDeliveryTerms(true)
												}>
												Click to see delivery terms
											</Button>
											{showDeliveryTerms && (
												<Dialog
													open={showDeliveryTerms}
													onClose={() =>
														setShowDeliveryTerms(
															false
														)
													}
													maxWidth="md"
													fullWidth>
													<DialogTitle>
														{"Delivery Terms"}
													</DialogTitle>
													<DialogContent>
														<Typography>
															{
																selectedData?.deliver_terms
															}
														</Typography>
													</DialogContent>
													<DialogActions>
														<Button
															onClick={() =>
																setShowDeliveryTerms(
																	false
																)
															}>
															Close
														</Button>
													</DialogActions>
												</Dialog>
											)}
										</Stack>
									</Grid>
									<Grid size={{ xs: 12, md: 4 }}>
										<Stack
											direction={"row"}
											spacing={1}
											alignItems="center">
											<Typography variant="h6">
												<b>Financial Terms:</b>
											</Typography>
											<Button
												onClick={() =>
													setShowFinancialTerms(true)
												}>
												Click to see delivery terms
											</Button>
											{showFinancialTerms && (
												<Dialog
													open={showFinancialTerms}
													onClose={() =>
														setShowFinancialTerms(
															false
														)
													}
													maxWidth="md"
													fullWidth>
													<DialogTitle>
														{"Financial Terms"}
													</DialogTitle>
													<DialogContent>
														<Typography>
															{
																selectedData?.deliver_terms
															}
														</Typography>
													</DialogContent>
													<DialogActions>
														<Button
															onClick={() =>
																setShowFinancialTerms(
																	false
																)
															}>
															Close
														</Button>
													</DialogActions>
												</Dialog>
											)}
										</Stack>
									</Grid>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Card>
										<CardHeader title={"Attachments"} />
										{/* <CardContent>
								<Dropzone
									onDrop={(acceptedFiles) => {
										handleAcceptedFiles(
											acceptedFiles,
											() => {}
										);
									}}>
									{({ getRootProps, getInputProps }) => (
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
														bgcolor: "purple",
														"&:hover": {
															bgcolor:
																"darkviolet",
														},
														fontWeight: 600,
														textTransform: "none",
													}}>
													Select File
												</Button>
											</div>
										</Box>
									)}
								</Dropzone>
							</CardContent> */}

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
														Pq_attachments_params.page <
														Pq_attachments_params.no_of_pages
													) {
														getPQAttachments({
															...Pq_attachments_params,
															quotation: id,
															page:
																Pq_attachments_params?.page +
																1,
															page_size: 10,
														});
													}
												}
											}}>
											{pq_attachment_loading && <Loader />}

											{pq_attachments?.length != 0 ? (
												pq_attachments?.map((document) => {
													return (
														document?.path && (
															<HorizontalFilePreview
																file={document}
															/>
														)
													);
												})
											) : (
												<CardContent
													sx={{
														border: "1px solid grey",
														borderRadius: "10px",
														mb: 2,
													}}>
													<Typography textAlign={"center"}>
														No Attachments
													</Typography>
												</CardContent>
											)}
										</ScrollableList>
									</Card>
								</Grid>
							</Grid>
						</Box>
						{/* File Upload */}
						<Divider
							sx={{
								my: 2,
							}}
						/>
						<Box>
							<TableComponent
								showPagination={false}
								containerHeight={440}
								count={
									selectedData?.quotationitems?.length
										? selectedData?.quotationitems?.length
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
		</Box>
	);
};

export default PurchaseQuotationView;
