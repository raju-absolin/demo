import {
	Box,
	Typography,
	Grid2 as Grid,
	Button,
	Divider,
	useTheme,
	Avatar,
	styled,
	List,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import AddBudgetQuotation from "./Add.budget_quotation";
import {
	selectBudgetQuotations,
	setSelectedData,
} from "@src/store/sidemenu/strategic_management/budget_quotation/bq.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { useNavigate, useParams } from "react-router-dom";
import {
	getBudgetQuotationById,
	getBudgetQuotations,
} from "@src/store/sidemenu/strategic_management/budget_quotation/bq.action";
import { BudgetQuotationPrintContent } from "@src/pages/sidemenu/PrintPDF/budgetQuotationLead";
import { pdf } from "@react-pdf/renderer";
import { companySelector } from "@src/store/masters/Company/company.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";
import moment from "moment";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import { LuDelete, LuFile } from "react-icons/lu";
import { FileType } from "@src/components";

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

const BudgetQuotation = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { id, tab } = useParams();
	const [edit, setEdit] = useState(false);
	const {
		budgetQuotation: {
			budgetQuotationList,
			budgetQuotationCount,
			selectedData,
			attachments,
			VECattachments,
			pageParams,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectBudgetQuotations(state));

	const {
		company: { companyData },
	} = useAppSelector((state) => {
		return {
			company: companySelector(state),
		};
	});

	useEffect(() => {
		dispatch(
			getBudgetQuotations({
				...pageParams,
				lead: id,
			})
		);
		dispatch(setSelectedData({}));
	}, []);

	const theme = useTheme();

	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<BudgetQuotationPrintContent
				budgetQuotaionData={budgetQuotationList[0]}
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
			<BudgetQuotationPrintContent
				budgetQuotaionData={budgetQuotationList[0]}
				companyData={companyData}
			/>
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "Lead_BudgetQuotation.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} else {
			console.error("Failed to generate PDF");
		}
	};
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
			title: "Unit",
			width: 100,
		},
		{
			title: "Vendor",
			width: 100,
		},
		{
			title: "Specifications",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		quantity: string | number, //React.JSX.Element,
		unit: React.JSX.Element,
		vendor: string,
		specifications: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			quantity,
			unit,
			vendor,
			specifications,
			actions,
		};
	}
	const rows = useMemo(() => {
		return budgetQuotationList[0]?.budgetaryquotationitems
			?.filter((e) => !e?.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);
				const specifications = (
					<ReadMore
						text={
							row.item_specifications
								? row.item_specifications
								: ""
						}
						maxLength={30}
					/>
				);

				const unit = <Box>{row?.unit?.name}</Box>;
				const vendor = row?.vendors
					?.map((item: { name: string; id: string }) => {
						return item?.name;
					})
					.join(", ");

				const actions = (
					<Box
						sx={{
							display: "flex",
							gap: 2,
						}}>
						<LuDelete
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={() => {
								const fiteredItems =
									selectedData?.lead_items?.map((e) => {
										if (
											e.item.value == row?.item.value &&
											e.unit?.value == row?.unit?.value
										) {
											return {
												...e,
												dodelete: true,
											};
										}
										return e;
									});
								dispatch(
									setSelectedData({
										...selectedData,
										lead_items: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);

				return createData(
					index,
					row?.item?.name,
					Number(row?.quantity),
					unit,
					vendor,
					specifications,
					actions
				);
			});
	}, [selectedData, createData]);
	return (
		<Box>
			{budgetQuotationList && budgetQuotationList.length > 0 && !edit ? (
				// View screen with data from caseSheetList
				budgetQuotationList.map((each) => {
					return (
						<Box
							p={4}
							sx={{
								backgroundColor: `${theme?.palette?.background}`,
								borderRadius: 2,
							}}>
							{/* Centered Title */}
							<Typography
								variant="h4"
								align="center"
								gutterBottom
								sx={{ fontWeight: "bold", color: "#3f51b5" }}>
								Budget Quotation Details
							</Typography>

							<Grid
								container
								justifyContent="flex-end"
								spacing={1}
								mb={1}>
								{userAccessList?.indexOf(
									"LeadManagement.change_budgetaryquotation"
								) !== -1 && (
									<Button
										variant="contained"
										onClick={() => {
											// const budgetQuotationId =
											// 	budgetQuotationList[0]?.id;
											// if (budgetQuotationId) {
											// 	navigate(
											// 		`/leads/view/${id}/${tab}/budget_quotation/${budgetQuotationId}`
											// 	);
											// }
											setEdit(true);
											dispatch(
												getBudgetQuotationById({
													id: each?.id ?? "",
												})
											);
											dispatch(setSelectedData(each));
										}}>
										Edit
									</Button>
								)}
								{userAccessList?.indexOf(
									"LeadManagement.view_budgetaryquotation"
								) !== -1 && (
									<Button
										variant="contained"
										onClick={() => {
											if (
												!companyData ||
												Object.keys(companyData)
													.length === 0
											) {
												dispatch(
													getCompanyById({
														id: budgetQuotationList[0]
															?.lead?.company?.id,
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
								{userAccessList?.indexOf(
									"LeadManagement.export_budgetaryquotation"
								) !== -1 && (
									<Button
										variant="contained"
										onClick={() => {
											if (
												!companyData ||
												Object.keys(companyData)
													.length === 0
											) {
												dispatch(
													getCompanyById({
														id: budgetQuotationList[0]
															?.lead?.company?.id,
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
										Download
									</Button>
								)}
							</Grid>

							{/* Divider for separation */}
							<Divider sx={{ mb: 4 }} />

							{/* Case Sheet Information in Grid */}
							<Grid container spacing={3}>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Date:</strong>{" "}
										{moment(each.date).format("DD-MM-YYYY")}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Lead:</strong> {each.lead?.name}
									</Typography>
								</Grid>

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>BD Name:</strong>{" "}
										{each?.bdm?.fullname}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Company Name:</strong>{" "}
										{each.organization_name}
									</Typography>
								</Grid>

								{/* <Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>User:</strong>{" "}
										{each.user?.fullname}
									</Typography>
								</Grid> */}

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Scope Of Work:</strong>{" "}
										{each?.scope_of_work}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>
											Vendor Evaluation Criteria:
										</strong>{" "}
										{each?.vendor_evaluation_criteria
											? "Yes"
											: "No"}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>
											Pre Qualification Criteria:
										</strong>{" "}
										{each?.pre_qualification_criteria}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>
											Pre-Qualification Requirement :
										</strong>{" "}
										{each?.pre_qualification_requirement}
									</Typography>
								</Grid>
							</Grid>
							<Grid container spacing={2} mt={2}>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Uploaded Documents:</strong>
									</Typography>
									<ScrollableList>
										{attachments?.length != 0 &&
											attachments?.map((document) => {
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
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>
											Vendor Evaluation Criteria
											Documents:
										</strong>
									</Typography>
									<ScrollableList>
										{VECattachments?.length != 0 &&
											VECattachments?.map((document) => {
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
							</Grid>
							<Divider sx={{ my: 2 }} />
							<Grid mt={2}>
								<TableComponent
									count={
										each?.budgetaryquotationitems?.length ??
										0
									}
									columns={columns}
									rows={rows ? rows : []}
									loading={false}
									page={1}
									pageSize={10}
									handleChangePage={() => {}}
									handleChangeRowsPerPage={() => {}}
									showPagination={false}
								/>
							</Grid>
						</Box>
					);
				})
			) : (
				<AddBudgetQuotation setEdit={setEdit} />
			)}
		</Box>
	);
};

export default BudgetQuotation;
