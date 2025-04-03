import { yupResolver } from "@hookform/resolvers/yup";
import {
	Avatar,
	Box,
	Button,
	Chip,
	Divider,
	FormLabel,
	Grid2 as Grid,
	IconButton,
	List,
	Paper,
	Stack,
	styled,
	TextareaAutosize,
	Tooltip,
	Typography,
	useTheme,
	Zoom,
} from "@mui/material";
import { FileType, FormInput } from "@src/components";
import TextArea from "@src/components/form/TextArea";
import TableComponent from "@src/components/TableComponenet";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import { selectTenders } from "@src/store/sidemenu/tender_mangement/tenders/tenders.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { LuBook, LuFile, LuPlus } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import Comment from "../Comment";
import AddComment from "../Comment/Comment.add";
import {
	openCommentModal,
	selectComments,
} from "@src/store/sidemenu/tender_mangement/comments/commets.slice";
import Loader from "@src/components/Loader";
import moment from "moment";
import { pdf, Document, Page, Image, View, Text } from "@react-pdf/renderer";
import { BidPrintContent } from "@src/pages/sidemenu/PrintPDF/bidDetails";
import { getCompanyById } from "@src/store/masters/Company/company.action";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import ApprovalWorkflow from "@src/components/Approvals";

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

const HorizontalFilePreview = ({ file }: { file: FileType }) => {
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
			}}
			mt={1}>
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

const OverView = () => {
	const { id, tab } = useParams();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const {
		tenders: { selectedData, loading, uploadDocuments },
		comments: { commentModal },
		system: { userAccessList },
	} = useAppSelector((state) => selectComments(state));

	const {
		company: { companyData },
	} = useAppSelector((state) => {
		return {
			company: companySelector(state),
		};
	});

	useEffect(() => {
		dispatch(
			getTenderById({
				id: id ? id : "",
			})
		);
		dispatch(setCompanyData({}));
	}, []);

	const renderData = [
		{
			label: "Name",
			value: selectedData?.name,
		},
		{
			label: "Lead Name",
			value: selectedData.lead?.name,
		},
		{
			label: "Bid Number",
			value: selectedData.tender_no,
		},
		{
			label: "Source Portal",
			value: selectedData.sourceportal?.name,
		},
		{
			label: "Bid Type",
			value: selectedData?.tender_type?.name,
		},
		{
			label: "Project",
			value: selectedData?.project?.name,
		},
		{
			label: "Company",
			value: selectedData.company?.name,
		},
		{
			label: "Customer",
			value: selectedData.customer?.name,
		},
		{
			label: "Department",
			value: selectedData.department,
		},
		{
			label: "Product Type",
			value: selectedData.product_type_name,
		},
		{
			label: "Bid Opening Date and Time",
			value: selectedData.tender_open_datetime,
		},
		{
			label: "Bid End Date",
			value: selectedData.tender_datetime,
		},
		{
			label: "Bid Extension Date",
			value: selectedData.tender_extension_datetime,
		},
		{
			label: "Bid Assigned Date",
			value: selectedData.assigned_on
				? moment(selectedData.assigned_on).format(
						"DD-MM-YYYY hh:mm:ss a"
					)
				: "",
		},
		{
			label: "Pre-Bid Meeting Date",
			value: moment(selectedData?.pre_bid_date).format("DD-MM-YYYY"),
		},
		{
			label: "Pre-Bid Meeting Place",
			value: selectedData.pre_bid_place,
		},
		{
			label: "Pre-Bid Meeting Address",
			value: selectedData.pre_bid_meet_address,
		},
		{
			label: "Ministry/State",
			value: selectedData.ministry,
		},
		{
			label: "Minimum Average Annual Turnover",
			value: selectedData.annual_turnover,
		},
		{
			label: "Years of Experience for Similar Services",
			value: selectedData.years_of_experiance,
		},
		{
			label: "MSS Exemption for Years of Experience & Turnover",
			value: selectedData.is_mss_exemption ? "Yes" : "No",
		},
		{
			label: "Startup Exemption for Years of Experience",
			value: selectedData.is_start_exemption ? "Yes" : "No",
		},
		{
			label: "Documents Required from Seller",
			value: selectedData.documents_required_seller,
		},
		{
			label: "Time Allowed for Technical Clarifications_seller",
			value: selectedData.time_allowed_clarification_days,
		},
		{
			label: "Inspection Required",
			value: selectedData.is_inspection ? "Yes" : "No",
		},
		{
			label: "Reverse Auction",
			value: selectedData.is_reverse_auction ? "Yes" : "No",
		},
		{
			label: "Evaluation Method",
			value: selectedData.evaluation_method,
		},
		{
			label: "Description",
			value: selectedData.description,
		},

		{
			label: "Status",
			value: (
				<Chip
					label={
						<Typography>
							{selectedData.authorized_status_name}
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
						switch (selectedData.authorized_status) {
							case 1:
								tagColor = "warning";
								break;
							case 2:
								tagColor = "success"; // MUI does not have 'blue', using 'info' instead
								break;
							case 3:
								tagColor = "error";
								break;
							case 4:
								tagColor = "default";
								break;
							default:
								tagColor = "default"; // Fallback color
						}
						return tagColor;
					})()}
				/>
			),
		},
		// {
		// 	label: "Assigned Users",
		// 	value: (
		// 		<Stack direction={"row"} flex={1}>
		// 			<Grid container spacing={1}>
		// 				{selectedData.assign_to?.map((e) => (
		// 					<Grid>
		// 						<Tooltip
		// 							TransitionComponent={Zoom}
		// 							title={`Username: ${e?.username}`}>
		// 							<Chip
		// 								label={
		// 									<Typography>
		// 										{e.fullname}
		// 									</Typography>
		// 								}
		// 							/>
		// 						</Tooltip>
		// 					</Grid>
		// 				))}
		// 			</Grid>
		// 		</Stack>
		// 	),
		// },
	];

	const theme = useTheme();

	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<BidPrintContent
				tenderData={selectedData}
				companyData={companyData}
			/>
		).toBlob();
		var blobURL = URL.createObjectURL(blob);

		var iframe = document.createElement("iframe");
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
			<BidPrintContent
				tenderData={selectedData}
				companyData={companyData}
			/>
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "Tender.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} else {
			console.error("Failed to generate PDF");
		}
	};

	return (
		<Box>
			{!loading ? (
				<Grid container spacing={2}>
					<Grid
						size={{
							xs: 12,
							lg: 6,
						}}>
						<Paper
							elevation={1}
							sx={{
								p: 2,
								backgroundColor: theme.palette.background.paper,
								border: "1px solid lightgrey",
								width: {
									xs: "100%",
									xl: "100%",
								},
							}}>
							<Box>
								<Grid container spacing={2}>
									{renderData &&
										renderData.map((item) => {
											if (
												item.label === "Project" &&
												selectedData.authorized_status !==
													5
											) {
												return "";
											} else {
												return (
													<Grid
														size={{
															xs: 12,
														}}>
														<Box>
															<Stack
																direction="row"
																spacing={2}
																alignItems="center"
																justifyContent="start">
																<FormLabel>
																	<Typography variant="h5">
																		{
																			item.label
																		}{" "}
																		:
																	</Typography>
																</FormLabel>
																<Typography
																	variant="subtitle1"
																	color="primary.main">
																	{item.value}
																</Typography>
															</Stack>
														</Box>
													</Grid>
												);
											}
										})}

									{/* {selectedData?.authorized_status !== 1 && (
										<Stack
											direction="row"
											alignItems="center"
											spacing={1}>
											<FormLabel>Status:</FormLabel>
											<Chip
												label={
													<Typography>
														{
															selectedData.authorized_status_name
														}
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
													switch (
														selectedData.authorized_status
													) {
														case 1:
															tagColor =
																"warning";
															break;
														case 2:
															tagColor =
																"success"; // MUI does not have 'blue', using 'info' instead
															break;
														case 3:
															tagColor = "error";
															break;
														case 4:
															tagColor = "error";
															break;
														default:
															tagColor =
																"default"; // Fallback color
													}
													return tagColor;
												})()}
											/>
										</Stack>
									)} */}
								</Grid>
							</Box>
						</Paper>
					</Grid>
					<Grid
						size={{
							xs: 12,
							lg: 6,
						}}>
						<Stack direction={"row"} gap={2} justifyContent={"end"}>
							{userAccessList?.indexOf("System.all_data") !==
								-1 && (
								<Button
									variant="contained"
									size="large"
									onClick={() => {
										if (
											!companyData ||
											Object.keys(companyData).length ===
												0
										) {
											dispatch(
												getCompanyById({
													id: selectedData?.company
														?.id,
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
							)}
							{userAccessList?.indexOf("System.all_data") !==
								-1 && (
								<Button
									variant="contained"
									size="large"
									onClick={() => {
										if (
											!companyData ||
											Object.keys(companyData).length ===
												0
										) {
											dispatch(
												getCompanyById({
													id: selectedData?.company
														?.id,
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
							)}
						</Stack>
						<Grid container spacing={2}>
							{selectedData?.lead_documents &&
								selectedData?.lead_documents?.length > 0 && (
									<Grid size={{ xs: 12, lg: 6 }}>
										<Typography variant="h6">
											Lead Documents:
										</Typography>
										<ScrollableList>
											{selectedData?.lead_documents?.map(
												(document) => {
													if (!document?.dodelete)
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
								)}
						</Grid>
						<Grid container spacing={2} mt={2}>
							{selectedData?.budget_documents &&
								selectedData?.budget_documents?.length > 0 && (
									<Grid size={{ xs: 12, lg: 6 }}>
										<Typography variant="h6">
											Budget Quotation Documents:
										</Typography>
										<ScrollableList>
											{selectedData?.budget_documents?.map(
												(document) => {
													if (!document?.dodelete)
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
								)}
						</Grid>
						<Grid container spacing={2} mt={2}>
							{uploadDocuments &&
								uploadDocuments?.length! > 0 && (
									<Grid size={{ xs: 12, lg: 6 }}>
										<Typography variant="h6">
											Bid Documents:
										</Typography>
										<ScrollableList>
											{uploadDocuments?.map(
												(document) => {
													if (!document?.dodelete)
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
								)}
						</Grid>

						{selectedData?.authorized_status !== 4 && (
							<Grid size={{ xs: 12, lg: 8 }}>
								<ApprovalWorkflow
									data={selectedData}
									app_label={"TenderManagement"}
									model_name={"tender"}
									instance_id={id || ""}
									callback={() => {
										dispatch(
											getTenderById({
												id: id || "",
											})
										);
									}}
								/>
							</Grid>
						)}
					</Grid>
				</Grid>
			) : (
				<Loader />
			)}
		</Box>
	);
};

export default OverView;
