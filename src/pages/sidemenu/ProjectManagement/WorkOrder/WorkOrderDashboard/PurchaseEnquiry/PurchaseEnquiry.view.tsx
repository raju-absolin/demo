import { Description } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid2 as Grid,
	Tab,
	Tabs,
	Typography,
	useTheme,
} from "@mui/material";
import GoBack from "@src/components/GoBack";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import { selectEnquiry } from "@src/store/sidemenu/project_management/purchaseEnquiry/purchase_enquiry.slice";
import { getPurchaseEnquiryById } from "@src/store/sidemenu/project_management/purchaseEnquiry/purchase_enquiry.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeftCircle } from "react-icons/lu";
import { pdf } from "@react-pdf/renderer";
import { PurchaseEnquiryPrintContent } from "@src/pages/sidemenu/PrintPDF/purchaseEnquiry";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";
import ApprovalWorkflow from "@src/components/Approvals";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
		</div>
	);
}

const PurchaseEnquiryView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const [value, setValue] = React.useState(0);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const {
		purchaseEnquiry: { selectedData, pageParams },
		system: { userAccessList },
	} = useAppSelector((state) => selectEnquiry(state));

	const theme = useTheme();

	const {
		company: { companyData },
	} = useAppSelector((state) => {
		return {
			company: companySelector(state),
		};
	});

	useEffect(() => {
		dispatch(
			getPurchaseEnquiryById({
				id: id ? id : "",
			})
		);
		dispatch(setCompanyData({}));
	}, [id]);

	const renderData = [
		{
			label: "PE Code",
			value: selectedData?.code,
		},
		{
			label: "PE Status",
			value: (
				<span>
					{!selectedData?.rfqstatus ? (
						"None"
					) : (
						<Chip
							sx={{
								minWidth: 100,
							}}
							label={
								<Typography>
									{selectedData?.rfqstatus_name}
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
								switch (selectedData?.rfqstatus) {
									case 1:
										tagColor = "warning";
										break;
									case 2:
										tagColor = "info"; // MUI does not have 'blue', using 'info' instead
										break;
									case 3:
										tagColor = "success";
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
					)}
				</span>
			),
		},
		{
			label: "Project",
			value: selectedData?.project?.name,
		},
		{
			label: "Required Date",
			value: moment(selectedData?.required_date).format("DD-MM-YYYY"),
		},
		{
			label: "Created By",
			value: selectedData?.created_by?.fullname,
		},
		{
			label: "Description",
			value: (
				<>
					<Button onClick={() => setShowDescription(true)}>
						Click to see description
					</Button>
					{showDescription && (
						<Dialog
							open={showDescription}
							onClose={() => setShowDescription(false)}
							maxWidth="md"
							fullWidth>
							<DialogTitle>{"Description"}</DialogTitle>
							<DialogContent>
								<Typography>
									{selectedData?.description}
								</Typography>
							</DialogContent>
							<DialogActions>
								<Button
									onClick={() => setShowDescription(false)}>
									Close
								</Button>
							</DialogActions>
						</Dialog>
					)}
				</>
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
			title: "Make",
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
			title: "Description",
			width: 100,
		},
	];

	const vendor_columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Code",
			width: 100,
		},
		{
			title: "Name",
			width: 100,
		},
		{
			title: "Mobile",
			width: 100,
		},
		{
			title: "Email",
			width: 100,
		},
		{
			title: "Address",
			width: 100,
		},
		{
			title: "Country",
			width: 100,
		},
		{
			title: "State",
			width: 100,
		},
		{
			title: "City",
			width: 100,
		},
	];

	function createDataVendors(
		index: number,
		code?: string,
		name?: string,
		mobile?: string,
		email?: string,
		address?: string,
		country?: string,
		state?: string,
		city?: string
	) {
		return {
			index,
			code,
			name,
			mobile,
			email,
			address,
			country,
			state,
			city,
		};
	}

	function createData(
		index: number,
		item_name: string,
		make: string,
		date: string,
		quantity: string | number,
		description: React.JSX.Element
	) {
		return {
			index,
			item_name,
			make,
			date,
			quantity,
			description,
		};
	}

	const vendor_rows = selectedData?.vendors?.map((row: any, key: number) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		return createDataVendors(
			index,
			row.code,
			row.name,
			row.mobile,
			row.email,
			row.address,
			row.country?.name,
			row.state?.name,
			row.city?.name
		);
	});

	const rows = useMemo(() => {
		return selectedData?.pqitems
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
					row?.make?.name,
					moment(row.date).format("LLL"),
					row.quantity,
					description
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

	function a11yProps(index: number) {
		return {
			id: `simple-tab-${index}`,
			"aria-controls": `simple-tabpanel-${index}`,
		};
	}

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<PurchaseEnquiryPrintContent
				purchaseEnquiryData={selectedData}
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
			<PurchaseEnquiryPrintContent
				purchaseEnquiryData={selectedData}
				companyData={companyData}
			/>
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "PurchaseEnquiry.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} else {
			console.error("Failed to generate PDF");
		}
	};
	return (
		// <GoBack
		// 	is_goback={true}
		// 	go_back_url={`/work_order/view/${projectId}/${tab}/project/purchase_enquiry`}
		// 	title={`Purchase Enquiry`}
		// 	showSaveButton={false}
		// 	loading={false}>
		<Grid container spacing={2}>
			<Grid
				size={{
					xs: 12,
					lg: selectedData?.authorized_status !== 4 ? 8.5 : 12,
				}}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "12px",
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
								navigate(-1);
							}}>
							<LuArrowLeftCircle
								color={theme.palette.primary.main}
							/>
							Purchase Enquiry
						</Typography>
						<Box sx={{ flex: 1 }} />
						<Box sx={{ display: "flex", gap: 2 }}>
							{/* {userAccessList?.indexOf("System.all_data") !==
								-1 && ( */}
							{/* <>
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
											Object.keys(companyData).length ===
												0
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
							</> */}
							{/* )} */}
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
													<Typography variant="h5">
														{item.label}:{" "}
														{item.value}
													</Typography>
												</Grid>
											);
										})}
									</Grid>
								</Box>
								<Box
									sx={{
										borderBottom: 1,
										borderColor: "divider",
									}}>
									<Tabs
										value={value}
										onChange={handleChangeTab}
										aria-label="basic tabs example">
										<Tab
											label={`(${selectedData?.pqitems?.length}) Items`}
											{...a11yProps(0)}
										/>
										<Tab
											label={`(${selectedData?.vendors?.length}) Vendors`}
											{...a11yProps(1)}
										/>
									</Tabs>
								</Box>
								<CustomTabPanel value={value} index={0}>
									<Box>
										<TableComponent
											showPagination={false}
											count={
												selectedData?.pqitems?.length
													? selectedData?.pqitems
															?.length
													: 0
											}
											containerHeight={440}
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
								</CustomTabPanel>
								<CustomTabPanel value={value} index={1}>
									<Box>
										<TableComponent
											showPagination={false}
											count={
												selectedData?.vendors?.length
													? selectedData?.vendors
															?.length
													: 0
											}
											containerHeight={440}
											columns={vendor_columns}
											rows={
												vendor_rows ? vendor_rows : []
											}
											loading={false}
											page={1}
											pageSize={10}
											handleChangePage={() => {}}
											handleChangeRowsPerPage={() => {}}
										/>
									</Box>
								</CustomTabPanel>
							</CardContent>
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
					<ApprovalWorkflow
						data={selectedData}
						app_label={"PurchaseEnquiry"}
						model_name={"purchaseenquiry"}
						instance_id={id || ""}
						callback={() => {
							dispatch(
								getPurchaseEnquiryById({
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

export default PurchaseEnquiryView;
