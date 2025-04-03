import {
	Avatar,
	Box,
	Button,
	Chip,
	FormLabel,
	Grid2 as Grid,
	IconButton,
	List,
	Paper,
	Stack,
	styled,
	Tooltip,
	Typography,
	useTheme,
	Zoom,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { useNavigate, useParams } from "react-router-dom";
import {
	selectLeads,
	setShowPreview,
} from "@src/store/sidemenu/strategic_management/leads/leads.slice";
import { pdf } from "@react-pdf/renderer";
import moment from "moment";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import { useEffect, useState } from "react";
import { setSelectedData } from "@src/store/settings/manageUsers/manage_users.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";
import { LeadPrintContent } from "@src/pages/sidemenu/PrintPDF/leadDetails";
import { LuFile, LuX } from "react-icons/lu";
import { FileType } from "@src/components";
import ApprovalWorkflow from "@src/components/Approvals";
import { getLeadById } from "@src/store/sidemenu/strategic_management/leads/leads.action";

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "500px",
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

const LeadDetails = () => {
	const { id, tab } = useParams();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const {
		leads: { selectedData, uploadDocuments, showPreview },
		system: { userAccessList },
	} = useAppSelector((state) => selectLeads(state));

	const {
		company: { companyData },
	} = useAppSelector((state) => {
		return {
			company: companySelector(state),
		};
	});

	useEffect(() => {
		dispatch(setShowPreview(false));
		dispatch(setSelectedData({}));
	}, []);

	const renderData = [
		{
			label: "Code",
			value: selectedData?.code,
		},
		{
			label: "Status",
			value: (
				<>
					<span>
						{!selectedData.authorized_status ? (
							"None"
						) : (
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
						)}
					</span>
				</>
			),
		},
		{
			label: "Priority",
			value: (
				<span>
					{!selectedData.priority ? (
						"None"
					) : (
						<Chip
							label={
								<Typography>
									{selectedData.priority_name}
								</Typography>
							}
							style={{
								backgroundColor: (() => {
									switch (selectedData.priority) {
										case 1:
											return "#ADD8E6"; // Light Blue
										case 2:
											return "#4682B4"; // Steel Blue
										case 3:
											return "#00008B"; // Dark Blue
										default:
											return "#ADD8E6"; // Fallback color
									}
								})(),
								color: "#fff", // Text color for contrast
								height: "40px", // Fixed height
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								borderRadius: "20px", // Optional for rounded corners
							}}
						/>
					)}
				</span>
			),
		},
		{
			label: "Name",
			value: selectedData?.name,
		},
		{
			label: "BD Name",
			value: selectedData?.bdm?.fullname,
		},
		{
			label: "Mobile Number",
			value: selectedData?.mobile,
		},
		{
			label: "Email",
			value: selectedData?.email,
		},
		{
			label: "Location",
			value: selectedData?.location?.name,
		},
		{
			label: "Company",
			value: selectedData?.company?.name,
		},
		{
			label: "Customer",
			value: selectedData?.customer?.name,
		},
		{
			label: "Client Location",
			value: selectedData?.client_location?.name,
		},
		{
			label: "Lead Entry Date",
			value: selectedData?.date
				? moment(selectedData?.date, "YYYY-MM-DD").format("DD-MM-YYYY")
				: "No Entry Date",
		},
		{
			label: "Due Date",
			value: selectedData?.due_date
				? moment(selectedData?.due_date, "YYYY-MM-DD").format(
						"DD-MM-YYYY"
					)
				: "No Due Date",
		},
		{
			label: "Enquiry Date",
			value: selectedData?.enquiry_date
				? moment(selectedData?.enquiry_date, "YYYY-MM-DD").format(
						"DD-MM-YYYY"
					)
				: "No Due Date",
		},
		{
			label: "Created On",
			value: selectedData?.created_on,
		},
		{
			label: "Remarks",
			value: selectedData?.remarks,
		},
	];

	const theme = useTheme();

	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<LeadPrintContent
				leadData={selectedData}
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
	const [blobContent, setBlobContent] = useState<string | null>(null);

	async function onHandlePreview(companyData: any) {
		dispatch(setShowPreview(true));
		const blob = await pdf(
			<LeadPrintContent
				leadData={selectedData}
				companyData={companyData}
			/>
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			setBlobContent(url);
		} else {
			console.error("Failed to generate PDF");
		}
	}

	async function onHandleDownload(companyData: any) {
		const blob = await pdf(
			<LeadPrintContent
				leadData={selectedData}
				companyData={companyData}
			/>
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "Lead.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} else {
			console.error("Failed to generate PDF");
		}
	}

	return (
		<>
			{!showPreview ? (
				<Box>
					<Grid container spacing={2}>
						<Grid
							size={{
								xs: 12,
								lg: 4,
							}}>
							<Paper
								elevation={1}
								sx={{
									p: 2,
									backgroundColor:
										theme.palette.background.paper,
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
																		{
																			item.label
																		}{" "}
																		:
																	</Typography>
																</FormLabel>
																<Typography
																	variant="subtitle1"
																	color={
																		theme
																			.palette
																			.mode ==
																		"light"
																			? "primary.main"
																			: theme
																					.palette
																					.text
																					.primary
																	}>
																	{item.value}
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
								lg: 8,
							}}>
							<Stack
								direction={"row"}
								gap={2}
								justifyContent={"end"}>
								{userAccessList?.indexOf("System.all_data") !==
									-1 && (
									<Button
										variant="contained"
										size="large"
										onClick={() => {
											if (
												!companyData ||
												Object.keys(companyData)
													.length === 0
											) {
												dispatch(
													getCompanyById({
														id: selectedData
															?.company?.id,
													})
												).then(async (res: any) => {
													onHandlePrintPreview(
														res.payload?.response
													);
												});
											} else {
												onHandlePrintPreview(
													companyData
												);
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
												Object.keys(companyData)
													.length === 0
											) {
												dispatch(
													getCompanyById({
														id: selectedData
															?.company?.id,
													})
												).then(async (res: any) => {
													onHandlePreview(
														res.payload?.response
													);
												});
											} else {
												onHandlePreview(companyData);
											}
										}}>
										Preview
									</Button>
								)}
							</Stack>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, lg: 6 }}>
									<Typography variant="h6">
										Uploaded Documents:
									</Typography>
									<ScrollableList>
										{uploadDocuments?.length != 0 &&
											uploadDocuments?.map((document) => {
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
								{selectedData?.authorized_status !== 4 && (
									<Grid size={{ xs: 12, lg: 6 }}>
										<ApprovalWorkflow
											data={selectedData}
											app_label={"LeadManagement"}
											model_name={"lead"}
											instance_id={id || ""}
											callback={() => {
												dispatch(
													getLeadById({
														id: id || "",
													})
												);
											}}
										/>
									</Grid>
								)}
							</Grid>
						</Grid>
					</Grid>
				</Box>
			) : (
				<Box>
					<Button
						variant="contained"
						size="large"
						sx={{ mb: 2 }}
						onClick={() => {
							dispatch(setShowPreview(false));
						}}>
						Back
					</Button>
					{userAccessList?.indexOf("System.all_data") !== -1 && (
						<Button
							sx={{ ml: 2, mb: 2 }}
							variant="contained"
							size="large"
							onClick={() => {
								if (
									!companyData ||
									Object.keys(companyData).length === 0
								) {
									dispatch(
										getCompanyById({
											id: selectedData?.company?.id,
										})
									).then(async (res: any) => {
										onHandleDownload(res.payload?.response);
									});
								} else {
									onHandleDownload(companyData);
								}
							}}>
							Download
						</Button>
					)}
					{blobContent && (
						<embed src={blobContent} width="100%" height="800px" />
					)}
				</Box>
			)}
		</>
	);
};

export default LeadDetails;
