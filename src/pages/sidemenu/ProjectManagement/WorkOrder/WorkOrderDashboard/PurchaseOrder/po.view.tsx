import {
	Box,
	Button,
	Card,
	CardContent,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid2 as Grid,
	Stack,
	Typography,
	useTheme,
	Alert,
	Avatar,
	DialogContentText,
	IconButton,
	styled,
	List,
	Tabs,
	Tab,
	InputLabel,
} from "@mui/material";
import GoBack from "@src/components/GoBack";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import { updateSidenav } from "@src/store/customise/customise";
import { selectEnquiry } from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.slice";
import {
	getPurchaseOrderById,
	postPODocuments,
	purchaseOrderApproval,
	// purchaseOrderCheckApproval,
	updatePurchaseOrderStatus,
} from "@src/store/sidemenu/project_management/PurchaseOrder/po.action";
import {
	selectPurchaseOrders,
	getPurchaseCheckApprove,
	purchasesCheckApproveSuccessful,
	setIsModalOpen,
	setIsRejectModalOpen,
	setConfirmModal,
	setUploadDocument,
	setApprovedData,
} from "@src/store/sidemenu/project_management/PurchaseOrder/po.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	CheckCircle,
	Close,
	LocationOn,
	ThumbDown,
	ThumbUp,
} from "@mui/icons-material";
import { getUserDetails } from "@src/store/userprofile/profile.action";
import { selectUserProfiles } from "@src/store/userprofile/profile.slice";
import InfoIcon from "@mui/icons-material/Info";
import Timeline from "../timeline";
import { LoadingButton } from "@mui/lab";
import { FileType, FileUploader, FormInput } from "@src/components";
import {
	LuArrowLeftCircle,
	LuFile,
	LuLoader,
	LuPlus,
	LuX,
} from "react-icons/lu";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import TextArea from "@src/components/form/TextArea";
import PaymentRequest from "./paymentRequest";
import SelectComponent from "@src/components/form/SelectComponent";
import { pdf } from "@react-pdf/renderer";
import { PurchaseOrderPrintContent } from "@src/pages/sidemenu/PrintPDF/purchaseOrder";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";
import Swal from "sweetalert2";
import ApprovalWorkflow from "@src/components/Approvals";
import { CustomModal } from "@src/components/Modal";

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "200px",
	marginTop: "0px",
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

const PurchaseOrderView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState(0);

	const {
		purchaseOrder: {
			selectedData,
			pageParams,
			checkApprove,
			approved_level,
			approved_status,
			approved_status_name,
			approved_data,
			model,
			loading,
			rejectModel,
			confirmModel,
			uploadDocuments,
			document_loading,
			client_status_name,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectPurchaseOrders(state));
	const theme = useTheme();

	const {
		company: { companyData },
	} = useAppSelector((state) => {
		return {
			company: companySelector(state),
		};
	});

	useEffect(() => {
		dispatch(setApprovedData({}));
		dispatch(getUserDetails());
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		dispatch(setCompanyData({}));
	}, []);

	useEffect(() => {
		if (id) {
			dispatch(
				getPurchaseOrderById({
					id: id ? id : "",
				})
			);
			// dispatch(
			// 	purchaseOrderCheckApproval({ purchase_order_id: id ? id : "" })
			// );
		}
	}, [id]);

	const renderData = [
		{
			label: "Code",
			value: selectedData?.code,
		},
		{
			label: "Created On",
			value: moment(selectedData?.created_on).format("DD-MM-YYYY"),
		},
		{
			label: "Purchase Enquiry No",
			value: selectedData?.purchaseenquiry?.code,
		},
		{
			label: "Purchase Enquiry Date",
			value: moment(selectedData?.purchaseenquiry?.required_date).format(
				"DD-MM-YYYY"
			),
		},
		{
			label: "Location",
			value: selectedData?.location?.name,
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
			label: "Created By",
			value: selectedData?.created_by?.fullname,
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
		return selectedData?.poitems
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
		// 	getPurchaseOrder({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getPurchaseOrder({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};
	const handleClose = () => {
		dispatch(setIsModalOpen(false));
	};
	const showApproveModal = () => {
		dispatch(setIsModalOpen(true));
	};
	const closeModal = () => {
		dispatch(setIsRejectModalOpen(false));
		dispatch(setConfirmModal(false));
	};
	function purchaseOrderApprove() {
		var data = {
			purchase_order_id: id,
			approved_level: approved_level + 1,
			approved_status: 2,
			description: selectedData?.description,
		};
		dispatch(purchaseOrderApproval({ data, navigate })).then(() => {
			dispatch(setIsModalOpen(false));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Purchase Order Approved Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		});
		dispatch(
			getPurchaseOrderById({
				id: id ? id : "",
			})
		);
	}
	const rejectSchema = yup.object().shape({
		reject_description: yup
			.string()
			.required("Please enter your description")
			.trim(),
	});
	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(rejectSchema),
		values: {
			reject_description: selectedData?.reject_description
				? selectedData?.reject_description
				: "",
		},
	});

	const onSubmit = (payload: any) => {
		const data = {
			purchase_order_id: id,
			approved_level: approved_level + 1,
			approved_status: 3,
			description: payload?.reject_description,
		};
		dispatch(purchaseOrderApproval({ data, navigate })).then(() => {
			dispatch(setIsModalOpen(false));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Purchase Order Rejected Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		});
		dispatch(setIsRejectModalOpen(false));
		dispatch(
			getPurchaseOrderById({
				id: id ? id : "",
			})
		);
	};

	const CLIENTCONFIRMSTATUS_CHOICES = [
		{ name: "Confirm", id: 1 },
		{ name: "Rejected", id: 3 },
	];
	const confirmSchema = yup.object().shape({
		confirm_remarks: yup
			.string()
			.required("Please enter your description")
			.trim(),
		client_status: yup
			.object({
				label: yup.string().required("Please select a client status"),
				value: yup.string().required("Please select a client status"),
			})
			.required("Please select a client status"),
	});

	const {
		control: confirmControl,
		handleSubmit: handleConfirmSubmit,
		reset: confirmReset,
	} = useForm<any>({
		resolver: yupResolver(confirmSchema),
		values: {
			confirm_remarks: selectedData?.confirm_remarks
				? selectedData?.confirm_remarks
				: "",
			client_status: selectedData?.client_status
				? {
						label: selectedData?.client_status_name,
						value: selectedData?.client_status,
					}
				: null,
		},
	});

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

		// Creating a new array with the modified files
		const modifiedFiles = files.map((file) =>
			Object.assign({}, file, {
				originalObj: file,
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);

		const documents = [...(uploadDocuments || []), modifiedFiles[0]];
		dispatch(setUploadDocument(documents));
		documents?.forEach(async (file) => {
			const data: any = {
				file: file.originalObj,
				purchase_order_id: id,
			};
			dispatch(postPODocuments({ data }));
		});
	};
	const HorizontalFilePreview = ({ file }: { file: any }) => {
		const dispatch = useAppDispatch();
		const {
			purchaseOrder: { uploadDocuments },
		} = useAppSelector((state) => selectPurchaseOrders(state));
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
				mt={2}
				sx={{
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "6px",
					p: "12px",
					display: "flex",
				}}>
				<Box
					sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
			</Box>
		);
	};

	const HorizontalFilePreview1 = ({ file }: { file: any }) => {
		const dispatch = useAppDispatch();
		const {
			purchaseOrder: { uploadDocuments },
		} = useAppSelector((state) => selectPurchaseOrders(state));

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
				mt={2}
				sx={{
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "6px",
					p: "0px",
					display: "flex",
				}}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						p: "12px",
						gap: "12px",
						cursor: "pointer",
						height: "100%",
						width: "100%",
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
			</Box>
		);
	};

	const onConfirmSubmit = (value: any) => {
		const data = {
			client_status: value?.client_status?.value,
			confirm_remarks: value?.confirm_remarks,
		};
		dispatch(
			updatePurchaseOrderStatus({
				id: id ? id : "",
				data,
				params: pageParams,
				navigate,
			})
		);
		confirmReset({
			client_status: null,
			confirm_remarks: "",
		});
		dispatch(setConfirmModal(false));
	};
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};
	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<PurchaseOrderPrintContent
				purchaseOrderData={selectedData}
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
			<PurchaseOrderPrintContent
				purchaseOrderData={selectedData}
				companyData={companyData}
			/>
		).toBlob();

		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "PurchaseOrder.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} else {
			console.error("Failed to generate PDF");
		}
	};
	return (
		<>
			<Grid container spacing={2}>
				<Grid
					size={{
						xs: 12,
						lg: selectedData?.authorized_status !== 4 ? 8.5 : 12,
					}}>
					{/* <GoBack
						is_goback={true}
						go_back_url={`/work_order/view/${projectId}/${tab}/project/purchase_order/`}
						title={`Purchase Order`}
						showSaveButton={false}
						loading={false}> */}
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 1,
						}}
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
										`/work_order/view/${projectId}/${tab}/project/purchase_order/`,
										{
											relative: "path",
										}
									);
								}}>
								<LuArrowLeftCircle
									color={theme.palette.primary.main}
								/>
								Purchase Order
							</Typography>
						</Card>
						<Box mt={0}>
							<Card>
								<Tabs
									value={activeTab}
									onChange={handleTabChange}
									aria-label="Tabs"
									sx={{
										"& .MuiTabs-flexContainer": {
											display: "flex",
										},
										"& .MuiTab-root": {
											flex: 1,
											textAlign: "center",
										},
									}}>
									<Tab label="Details" />
									{approved_status_name === "Approved" && (
										<Tab label="Payment Request" />
									)}
								</Tabs>
								{/* <Divider
									sx={{
										my: 2,
										borderColor: "rgba(0, 0, 0, 0.12)",
									}}
								/> */}
								{activeTab === 0 && (
									<CardContent>
										<Box
											p={1}
											sx={{
												borderRadius: 2,
											}}>
											<Grid container spacing={3}>
												{renderData.map((item) => {
													return (
														<Grid
															size={{
																xs: 12,
																md: 4,
															}}>
															<Typography variant="h6">
																{item.label}:{" "}
																{
																	item?.value as any
																}
															</Typography>
														</Grid>
													);
												})}
											</Grid>
											<Grid
												size={{ xs: 12, md: 4 }}
												mt={2}>
												<Stack
													direction={"row"}
													spacing={1}
													alignItems="center">
													<Typography variant="h5">
														Description:
													</Typography>
													<Button
														onClick={() =>
															setShowDescription(
																true
															)
														}>
														Click to see description
													</Button>
													{showDescription && (
														<Dialog
															open={
																showDescription
															}
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
										</Box>
										<Box
											sx={{
												display: "flex",
												justifyContent: "flex-end",
												gap: 2,
												mb: 2, // Add some margin-bottom to separate buttons from the rest of the content
											}}>
											{userAccessList?.indexOf(
												"System.all_data"
											) !== -1 && (
												<>
													<Button
														variant="contained"
														size="large"
														onClick={() => {
															if (
																!companyData ||
																Object.keys(
																	companyData
																).length === 0
															) {
																dispatch(
																	getCompanyById(
																		{
																			id: selectedData
																				?.project
																				?.company,
																		}
																	)
																).then(
																	async (
																		res: any
																	) => {
																		onHandlePrintPreview(
																			res
																				.payload
																				?.response
																		);
																	}
																);
															} else {
																onHandlePrintPreview(
																	companyData
																);
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
																Object.keys(
																	companyData
																).length === 0
															) {
																dispatch(
																	getCompanyById(
																		{
																			id: selectedData
																				?.project
																				?.company,
																		}
																	)
																).then(
																	async (
																		res: any
																	) => {
																		onHandleDownload(
																			res
																				.payload
																				?.response
																		);
																	}
																);
															} else {
																onHandleDownload(
																	companyData
																);
															}
														}}>
														Download
													</Button>
												</>
											)}
										</Box>
										{client_status_name ==
											"ClientConfirm" && (
											<>
												<Divider
													sx={{
														my: 2,
													}}
												/>
												<Grid container spacing={2}>
													<Grid
														size={{
															xs: 12,
															md: 6,
														}}>
														<Typography variant="subtitle1">
															Vendor Status:{" "}
															{client_status_name ==
															"ClientConfirm"
																? "Confirmed"
																: client_status_name ==
																	  "ClientRejected"
																	? "Rejected"
																	: ""}
														</Typography>
														<Stack
															direction={"row"}
															spacing={1}
															mt={2}>
															<Typography variant="subtitle1">
																Vendor Remarks :{" "}
															</Typography>
															<Typography variant="subtitle1">
																{
																	selectedData?.confirm_remarks
																}
															</Typography>
														</Stack>

														<Typography
															variant="subtitle1"
															mt={1.5}>
															Vendor Documents:
														</Typography>
														{uploadDocuments?.length !=
															0 &&
															uploadDocuments?.map(
																(document) => {
																	return (
																		document?.path && (
																			<HorizontalFilePreview1
																				file={
																					document
																				}
																			/>
																		)
																	);
																}
															)}
													</Grid>
												</Grid>
											</>
										)}
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
													selectedData?.poitems
														?.length
														? selectedData?.poitems
																?.length
														: 0
												}
												columns={columns}
												rows={rows ? rows : []}
												loading={loading}
												page={pageParams.page}
												pageSize={pageParams.page_size}
												handleChangePage={
													handleChangePage
												}
												handleChangeRowsPerPage={
													handleChangeRowsPerPage
												}
											/>
										</Box>
									</CardContent>
								)}
								{activeTab === 1 && (
									<Box
										p={2}
										sx={{
											borderRadius: 2,
										}}>
										<PaymentRequest purchaseOrderId={id} />
									</Box>
								)}
							</Card>
						</Box>
					</Box>
				</Grid>

				{selectedData?.authorized_status !== 4 && (
					<Grid
						size={{
							xs: 12,
							lg: 3.5,
						}}>
						{/* {selectedData?.authorized_status !== 2 && ( */}
						{!selectedData?.client_status && (
							<Box mt={2}>
								<Button
									variant="contained"
									color="info"
									fullWidth
									onClick={() =>
										dispatch(setConfirmModal(true))
									}>
									Confirm
								</Button>
								<CustomModal
									isOpen={confirmModel}
									title={"Purchase Order Confirm"}
									onClose={() => {
										dispatch(setConfirmModal(false));
									}}
									onOK={() => {
										handleConfirmSubmit(onConfirmSubmit)();
									}}
									okText={"Submit"}
									closeText={"Cancel"}
									loading={loading}>
									<Box mt={2}>
										<form style={{ width: "100%" }}>
											<Grid size={{ xs: 12, sm: 6 }}>
												<SelectComponent
													name="client_status"
													label="Client Status"
													required
													control={confirmControl}
													options={CLIENTCONFIRMSTATUS_CHOICES?.map(
														(e: {
															id: number;
															name: string;
														}) => ({
															id: e.id,
															name: e.name,
														})
													)}
												/>
											</Grid>
											<Grid
												size={{ xs: 12, sm: 6 }}
												sx={{ mt: 2 }}>
												<TextArea
													name="confirm_remarks"
													label="Remarks"
													type="text"
													required
													placeholder="Write Remarks here..."
													minRows={3}
													maxRows={5}
													containerSx={{
														display: "grid",
														gap: 1,
													}}
													control={confirmControl}
												/>
											</Grid>
											<Grid
												size={{ xs: 12, sm: 6 }}
												sx={{ mt: 2 }}>
												<FileUploader
													label="Documents"
													name={"documents"}
													control={control}
													showPreview={false}
													text={
														!document_loading
															? "Select a file..."
															: "Loading Please Wait..."
													}
													icon={
														!document_loading
															? LuPlus
															: LuLoader
													}
													iconSize={20}
													selectedFiles={
														uploadDocuments
															? uploadDocuments
															: []
													}
													handleAcceptedFiles={
														handleAcceptedFiles
													}
												/>
											</Grid>
											<Grid
												size={{ xs: 6 }}
												sx={{ mt: 2 }}>
												<ScrollableList>
													{uploadDocuments?.length !=
														0 &&
														uploadDocuments?.map(
															(document) => {
																return (
																	document?.path && (
																		<HorizontalFilePreview
																			file={
																				document
																			}
																		/>
																	)
																);
															}
														)}
												</ScrollableList>
											</Grid>
										</form>
									</Box>
								</CustomModal>
							</Box>
						)}
						{/* )} */}
						<ApprovalWorkflow
							data={selectedData}
							app_label={"PurchaseOrder"}
							model_name={"purchaseorder"}
							instance_id={id || ""}
							callback={() => {
								dispatch(
									getPurchaseOrderById({
										id: id || "",
									})
								);
							}}
						/>
					</Grid>
				)}
			</Grid>
		</>
	);
};

export default PurchaseOrderView;
