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
	Typography,
	useTheme,
} from "@mui/material";
import { FileType, FormInput } from "@src/components";
import TextArea from "@src/components/form/TextArea";
import TableComponent from "@src/components/TableComponenet";
import { getWorkOrderById } from "@src/store/sidemenu/project_management/work_order/work_order.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { LuBook, LuFile, LuPlus } from "react-icons/lu";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import Loader from "@src/components/Loader";
import { selectWorkOrders } from "@src/store/sidemenu/project_management/work_order/work_order.slice";
import moment from "moment";
import { updateSidenav } from "@src/store/customise/customise";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import { pdf } from "@react-pdf/renderer";
import { getCompanyById } from "@src/store/masters/Company/company.action";
import { ProjectPrintContent } from "@src/pages/sidemenu/PrintPDF/projectDetails";
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
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		workOrder: { selectedData, loading, uploadDocuments },
		system: { userAccessList },
	} = useAppSelector((state) => selectWorkOrders(state));

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
			getWorkOrderById({
				id: id ? id : "",
			})
		);
		dispatch(setCompanyData({}));
	}, []);

	const renderData = [
		{
			label: "Start Date",
			value: selectedData?.start_date,
		},
		{
			label: "Due Date",
			value: selectedData?.due_date,
		},
		{
			label: "Warranty  Period",
			value: selectedData?.warrenty_period,
		},
		{
			label: "Project",
			value: selectedData?.name,
		},
		{
			label: "Work Order Number",
			value: selectedData?.project_no,
		},
		{
			label: "Bid Number",
			value: selectedData?.tender_no,
		},
		{
			label: "Source Portal",
			value: selectedData?.sourceportal?.name,
		},
		{
			label: "Bid Type",
			value: selectedData?.tender_type_name,
		},

		{
			label: "Company",
			value: selectedData?.company?.name,
		},
		{
			label: "Department",
			value: selectedData?.department_name,
		},
		{
			label: "Product Type",
			value: selectedData?.product_type_name,
		},
		{
			label: "Basic Project Value",
			value: selectedData?.amount,
		},
		// {
		// 	label: "Tax Type",
		// 	value: selectedData?.taxtype_name,
		// },
		// {
		// 	label: "Tax",
		// 	value: selectedData?.tax?.name,
		// },
		{
			label: "Total Value",
			value: selectedData?.total_value,
		},
		{
			label: "Manager",
			value: selectedData?.manager?.fullname,
		},
		{
			label: "Customer",
			value: selectedData?.customer?.name,
		},
		{
			label: "Is Performance Bank Guarantee",
			value: selectedData?.is_performace_bank_guarantee ? "Yes" : "No",
		},
		{
			label: "Performance Bank Guarantee",
			value: selectedData?.performace_bank_guarantee?.name || "N/A",
		},
		{
			label: "Pre Dispatch Inspection",
			value: selectedData?.is_pre_dispatch_inspection ? "Yes" : "No",
		},
		{
			label: "Is Inspection Agency",
			value: selectedData?.is_inspection_agency ? "Yes" : "No",
		},
		{
			label: "Stagewise Inspection",
			value: selectedData?.is_stagewise_inspection ? "Yes" : "No",
		},
		{
			label: "Inspection Agency",
			value: selectedData?.inspection_agency?.concerned_officer || "N/A",
		},
		// {
		// 	label: "GST Percentage",
		// 	value: selectedData?.gst_percentage,
		// },
		{
			label: "Tax Amount",
			value: selectedData?.taxamount,
		},
		{
			label: "Delivery In Lots",
			value: selectedData?.delivery_in_lots,
		},
		{
			label: "Bid Open Date",
			value: selectedData?.tender?.tender_open_datetime
				? moment(
						selectedData?.tender?.tender_open_datetime,
						"DD-MM-YYYY HH:mm"
					).format("DD-MM-YYYY")
				: "",
		},
		{
			label: "Bid End Date",
			value: selectedData?.tender_datetime
				? moment(
						selectedData?.tender_datetime,
						"DD-MM-YYYY HH:mm"
					).format("DD-MM-YYYY")
				: "",
		},
		{
			label: "Project Due Date",
			value: moment(
				selectedData?.tender_due_datetime,
				"DD-MM-YYYY HH:mm"
			).format("DD-MM-YYYY"),
		},
		{
			label: "Delivery Terms",
			value: selectedData?.deliver_terms,
		},
		{
			label: "Financial Terms",
			value: selectedData?.financial_terms,
		},

		{
			label: "Remarks",
			value: selectedData?.remarks,
		},
		{
			label: "Created On",
			value: moment(selectedData?.created_on, "DD-MM-YYYY HH:mm").format(
				"DD-MM-YYYY"
			),
		},
		{
			label: "Created By",
			value: selectedData?.created_by?.fullname,
		},

		{
			label: "Status",
			value: (
				<Chip
					label={<Typography>{selectedData?.status_name}</Typography>}
					color={(() => {
						let tagColor:
							| "default"
							| "primary"
							| "secondary"
							| "success"
							| "error"
							| "info"
							| "warning" = "default";
						switch (selectedData?.status) {
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
								tagColor = "error";
								break;
							default:
								tagColor = "default"; // Fallback color
						}
						return tagColor;
					})()}
				/>
			),
		},
	];

	const theme = useTheme();

	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<ProjectPrintContent
				projectData={selectedData}
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
			<ProjectPrintContent
				projectData={selectedData}
				companyData={companyData}
			/>
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "ProjectDetails.pdf";
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
																	{item.label}{" "}
																	:
																</Typography>
															</FormLabel>
															<Typography
																variant="subtitle1"
																color="primary.main">
																{item?.value}
															</Typography>
														</Stack>
													</Box>
												</Grid>
											);
										})}
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
							{selectedData?.tender_documents &&
								selectedData?.tender_documents?.length > 0 && (
									<Grid size={{ xs: 12, lg: 6 }}>
										<Typography variant="h6">
											Bid Documents:
										</Typography>
										<ScrollableList>
											{selectedData?.tender_documents?.map(
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
							{uploadDocuments?.length != 0 && (
								<Grid size={{ xs: 12, lg: 6 }}>
									<Typography variant="h6">
										Project Documents:
									</Typography>
									<ScrollableList>
										{uploadDocuments?.map((document) => {
											if (!document?.dodelete)
												return (
													document?.path && (
														<HorizontalFilePreview
															file={document}
														/>
													)
												);
										})}
									</ScrollableList>
								</Grid>
							)}
						</Grid>
						{selectedData?.authorized_status !== 4 && (
							<Grid size={{ xs: 12, lg: 8 }}>
								<ApprovalWorkflow
									data={selectedData}
									app_label={"ProjectManagement"}
									model_name={"project"}
									instance_id={id || ""}
									callback={() => {
										dispatch(
											getWorkOrderById({
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
