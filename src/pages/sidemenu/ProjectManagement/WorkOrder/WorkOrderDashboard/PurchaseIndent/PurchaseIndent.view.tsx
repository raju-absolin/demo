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
	Typography,
	useTheme,
} from "@mui/material";
import GoBack from "@src/components/GoBack";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import { selectIndent } from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.slice";
import { getPurchaseIndentById } from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeftCircle } from "react-icons/lu";
import { pdf } from "@react-pdf/renderer";
import { PurchaseIndentPrintContent } from "@src/pages/sidemenu/PrintPDF/purchaseIndent";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";
import ApprovalWorkflow from "@src/components/Approvals";

const PurchaseIndentView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const {
		purchaseIndent: { selectedData, pageParams },
		system: { userAccessList },
	} = useAppSelector((state) => selectIndent(state));
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
			getPurchaseIndentById({
				id: id ? id : "",
			})
		);
		dispatch(setCompanyData({}));
	}, [id]);

	const renderData = [
		{
			label: "PI Code",
			value: selectedData?.code,
		},
		{
			label: "PI Status",
			value: (
				<span>
					{!selectedData?.pistatus ? (
						"None"
					) : (
						<Chip
							sx={{
								width: 100,
							}}
							label={
								<Typography>
									{selectedData?.pistatus_name}
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
								switch (selectedData?.pistatus) {
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
			label: "location",
			value: selectedData?.location?.name,
		},
		{
			label: "warehouse",
			value: selectedData?.warehouse?.name,
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
		// {
		// 	title: "Date & Time",
		// 	width: 100,
		// },
		{
			title: "Quantity",
			width: 100,
		},
		{
			title: "Unit",
			width: 100,
		},
		{
			title: "Description",
			width: 100,
		},
	];

	function createData(
		index: number,
		item_name: string,
		make: string,
		// date: string,
		quantity: string | number,
		unit: string,
		description: React.JSX.Element
	) {
		return {
			index,
			item_name,
			make,
			// date,
			quantity,
			unit,
			description,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.piitems
			?.filter((e: any) => !e.dodelete)
			?.map((row: any, key: number) => {
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
					row.make?.name,
					// moment(row.date).format("LLL"),
					row.qty,
					row?.unit?.name,
					description
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getPurchaseIndent({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getPurchaseIndent({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};

	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<PurchaseIndentPrintContent
				purchaseIndentData={selectedData}
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
			<PurchaseIndentPrintContent
				purchaseIndentData={selectedData}
				companyData={companyData}
			/>
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "PurchaseIndent.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} else {
			console.error("Failed to generate PDF");
		}
	};

	return (
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
						gap: "24px",
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
									`/work_order/view/${projectId}/${tab}/project/purchase_indent/`,
									{
										relative: "path",
									}
								);
							}}>
							<LuArrowLeftCircle
								color={theme.palette.primary.main}
							/>
							Purchase Indent
						</Typography>
						<Box sx={{ flex: 1 }} />
						<Box sx={{ display: "flex", gap: 2 }}>
							{
								// userAccessList?.indexOf("System.all_data") !==
								// 	-1 && (
								<>
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
															?.project?.company,
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
															?.project?.company,
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
								// )
							}
						</Box>
					</Card>
					<Box
						sx={{
							my: 0,
						}}>
						<Card>
							<CardContent>
								<Box
									p={4}
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
								<Divider
									sx={{
										my: 2,
									}}
								/>
								<Box>
									<TableComponent
										showPagination={false}
										count={
											selectedData?.piitems?.length
												? selectedData?.piitems?.length
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
						app_label={"PurchaseIndent"}
						model_name={"purchaseindent"}
						instance_id={id || ""}
						callback={() => {
							dispatch(
								getPurchaseIndentById({
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

export default PurchaseIndentView;
