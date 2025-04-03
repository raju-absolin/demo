import { Description, ThumbDown, ThumbUp } from "@mui/icons-material";
import {
	Alert,
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Grid2 as Grid,
	IconButton,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import GoBack from "@src/components/GoBack";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import {
	selectExpenditureSheet,
	setIsModalOpen,
	getCheckApprove,
	setSelectedData,
	setIsRejectModalOpen,
	CheckApproveSuccessful,
	setUploadDocument,
} from "@src/store/sidemenu/project_management/ExpenditureSheet/expenditure_sheet.slice";
import {
	getExpenditureSheetById,
	ExpenditureSheetApproval,
	ExpenditureSheetCheckApproval,
} from "@src/store/sidemenu/project_management/ExpenditureSheet/expenditure_sheet.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Timeline from "../timeline";
import InfoIcon from "@mui/icons-material/Info";
import { LuArrowLeftCircle, LuEye, LuX } from "react-icons/lu";
import TextArea from "@src/components/form/TextArea";
import { LoadingButton } from "@mui/lab";
import { getApprovals } from "@src/store/settings/Permissions/Approvals/approval.action";
import { ApprovalSelector } from "@src/store/settings/Permissions/Approvals/approval.slice";
import { FormInput } from "@src/components";
import { BlobProvider, pdf, PDFDownloadLink } from "@react-pdf/renderer";
import { ExpenditureSheetPrintContent } from "@src/pages/sidemenu/PrintPDF/expenditureSheet";
import ApprovalTreeModal from "./AprrovalTreeModal";

const ExpenditureSheetView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const dispatch = useAppDispatch();
	const [itemId, setItemId] = useState("");

	const {
		expenditureSheet: {
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
			uploadDocuments,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectExpenditureSheet(state));
	const navigate = useNavigate();

	const {
		approval: { approvalList },
	} = useAppSelector((state) => {
		return {
			approval: ApprovalSelector(state),
		};
	});

	useEffect(() => {
		dispatch(
			getExpenditureSheetById({
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
			label: "Project",
			value: selectedData?.project?.name,
		},
		{
			label: "Mode of Payment",
			value: selectedData?.mode_of_payment_name,
		},
		// {
		// 	label: "Received Amount",
		// 	value: selectedData?.received_amount,
		// },
		{
			label: "Employee Name",
			value: selectedData?.employee_name,
		},
		{
			label: "Created By",
			value: selectedData?.created_by?.fullname,
		},
		{
			label: "Status",
			value: (
				<span>
					{!selectedData?.approved_status ? (
						"None"
					) : (
						<Chip
							sx={{
								width: 100,
							}}
							label={
								<Typography>
									{selectedData?.approved_status_name}
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
								switch (selectedData?.approved_status) {
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
	const handleClose = () => {
		dispatch(setIsModalOpen(false));
	};
	const showApproveModal = (id: string) => {
		setItemId(id);
		dispatch(setIsModalOpen(true));
	};
	const closeModal = () => {
		dispatch(setIsRejectModalOpen(false));
	};
	function expenditureItemApprove() {
		var data = {
			expendituresheetitem_id: itemId,
			approved_amount: selectedData?.approved_amount,
			approved_level: approved_level + 1,
			approved_status: 2,
			description: selectedData?.description,
		};
		dispatch(ExpenditureSheetApproval({ data, id: id ? id : "" }));
		dispatch(setIsModalOpen(false));
		setItemId("");
	}

	const rejectSchema = yup.object().shape({
		reject_description: yup
			.string()
			.required("Please enter your description")
			.trim(),
	});
	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(rejectSchema),
		values: {
			reject_description: selectedData?.reject_description
				? selectedData?.reject_description
				: "",
		},
	});
	const onSubmit = (payload: any) => {
		const data = {
			expendituresheetitem_id: itemId,
			approved_level: approved_level + 1,
			approved_status: 3,
			description: payload?.reject_description,
		};
		dispatch(ExpenditureSheetApproval({ data, id: id ?? "" }));
		dispatch(setIsRejectModalOpen(false));
		setItemId("");
	};
	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Place Of Visit",
			width: 100,
		},
		{
			title: "Expenditure Type",
			width: 100,
		},
		{
			title: "Expenses",
			width: 100,
		},
		{
			title: "Amount",
			width: 100,
		},
		{
			title: "Attachments",
			width: 100,
		},
		{
			title: "Description",
			width: 100,
		},
		{
			title: "Remarks",
			width: 100,
		},
		// {
		// 	title: "Approved By",
		// 	width: 100,
		// },
		{
			title: "Approved Amount",
			width: 100,
		},
		{
			title: "Approved Level",
			width: 100,
		},
		{
			title: "Approved Status",
			width: 100,
		},
		{
			title: "Approved/Reject",
			width: 100,
		},
	];

	function createData(
		index: number,
		place_of_visit: string,
		type_of_expenditure: string,
		expenses: string,
		amount: string,
		attachments: React.JSX.Element,
		description: React.JSX.Element,
		remarks: React.JSX.Element,
		// approvedBy: string,
		approvedAmt: React.JSX.Element,
		approvedlevel: string,
		approvedStatus: string,
		approveOrReject: React.JSX.Element
	) {
		return {
			index,
			place_of_visit,
			type_of_expenditure,
			expenses,
			amount,
			attachments,
			description,
			remarks,
			// approvedBy,
			approvedAmt,
			approvedlevel,
			approvedStatus,
			approveOrReject,
		};
	}
	const [opentreeModal, setOpenTreeModal] = useState(false);
	const rows = useMemo(() => {
		return selectedData?.expendituresheetitems
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
				const remarks = (
					<ReadMore
						text={row.remarks ? row.remarks : ""}
						maxLength={30}
					/>
				);
				// const approvedAmt = (
				//     <Box>
				//         <form action="">
				//             <FormInput
				//                 control={control}
				//                 name={`items.${key}.approved_amount`}
				//                 helperText="Approved Amount"
				//                 label=""
				//                 type="number"
				//                 placeholder="Enter approved amount here..."
				//                 onChange={(event) => {
				//                     dispatch(setSelectedData({
				//                         ...selectedData,
				//                         approved_amount: event.target.value,
				//                     }));
				//                 }}
				//             />
				//         </form>
				//     </Box>
				// )
				const attachments = (
					<>
						{uploadDocuments?.length != 0
							? uploadDocuments?.map((document: any) => {
									return (
										document?.file && (
											<img
												src={document.file}
												alt="Document Preview"
												key={document.code}
												style={{
													width: "100px",
													height: "auto",
													margin: "5px",
												}}
											/>
										)
									);
								})
							: "No Documents"}
					</>
				);
				const approveOrReject = (
					<Stack
						alignItems={"center"}
						direction={"row"}
						justifyContent={"center"}
						spacing={2}>
						{row?.checkApprove &&
							userAccessList?.indexOf(
								"Payments.change_expendituresheetitemapproval"
							) !== -1 && (
								<Grid
									container
									spacing={2}
									sx={{ mt: 2, p: 2 }}>
									<Grid size={{ xs: 6 }}>
										<Button
											variant="contained"
											color="primary"
											fullWidth
											disabled={
												approved_status_name ==
													"Approved" ||
												approved_status_name ==
													"Rejected"
											}
											// startIcon={<ThumbUp />}
											onClick={() =>
												showApproveModal(row?.id)
											}>
											Approve
										</Button>
									</Grid>
									<Grid size={{ xs: 6 }}>
										<Button
											variant="contained"
											color="error"
											fullWidth
											disabled={
												approved_status_name ==
												"Rejected"
											}
											// startIcon={<ThumbDown />}
											onClick={() => {
												dispatch(
													setIsRejectModalOpen(true)
												);
												setItemId(row?.id);
											}}>
											Reject
										</Button>
									</Grid>
								</Grid>
							)}
						<LuEye
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={() => {
								setOpenTreeModal(true);
							}}
						/>
						{opentreeModal && (
							<ApprovalTreeModal
								data={row?.expendituresheetitemapprovals}
								open={opentreeModal}
								setOpen={setOpenTreeModal}
							/>
						)}{" "}
					</Stack>
				);
				return createData(
					index,
					row?.place_of_visit,
					row?.expendituretype_name,
					row?.expances?.name,
					row.amount,
					attachments,
					description,
					remarks,
					// row?.approved_by?.username,
					row?.approved_amount,
					row?.approved_level,
					row?.approved_status_name,
					approveOrReject
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getExpenditureSheet({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getExpenditureSheet({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};
	const theme = useTheme();

	const onHandlePrintPreview = async () => {
		const blob = await pdf(
			<ExpenditureSheetPrintContent expenditureSheetData={selectedData} />
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

	const onHandleDownload = async () => {
		const blob = await pdf(
			<ExpenditureSheetPrintContent expenditureSheetData={selectedData} />
		).toBlob();

		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "ExpenditureSheet.pdf";
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
				<Grid size={{ xs: 12 }}>
					{/* <GoBack
                    is_goback={true}
                    go_back_url={`/work_order/view/${projectId}/${tab}/project/expenditure_sheet/`}
                    title={`Expenditure Sheet`}
                    showSaveButton={false}
                    loading={false}> */}
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
										`/work_order/view/${projectId}/${tab}/project/expenditure_sheet/`,
										{
											relative: "path",
										}
									);
								}}>
								<LuArrowLeftCircle
									color={theme.palette.primary.main}
								/>
								Expenditure Sheet
							</Typography>
							<Box sx={{ flex: 1 }} />
							<Box sx={{ display: "flex", gap: 2 }}>
								{userAccessList?.indexOf("System.all_data") !==
									-1 && (
									<>
										<Button
											variant="contained"
											size="large"
											onClick={onHandlePrintPreview}>
											Print
										</Button>
										<Button
											variant="contained"
											size="large"
											onClick={onHandleDownload}>
											Download PDF
										</Button>
									</>
								)}
							</Box>
						</Card>
						<Box
							sx={{
								my: 2,
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
													<Grid
														size={{
															xs: 12,
															md: 4,
														}}>
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
												selectedData
													?.expendituresheetitems
													?.length
													? selectedData
															?.expendituresheetitems
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
								</CardContent>
							</Card>
						</Box>
					</Box>
				</Grid>
				{/* <Grid size={{ xs: 4 }}>
                <Card sx={{ mt: 2, p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid mt={2} ml={4}>
                            <Avatar
                                sx={{ width: 50, height: 50, mt: 1 }}
                                src=""
                            />
                        </Grid>

                        <Grid size={{ xs: 6 }} mt={2}>
                            <Box>
                                <Typography variant="body1">
                                    <strong>Name: </strong>
                                    {approved_data?.username || "None"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Email: </strong>
                                    {approved_data?.email || "None"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Mobile: </strong>
                                    {approved_data?.phone || "None"}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    {row?.checkApprove && (
                        <Grid container spacing={2} sx={{ mt: 2, p: 1 }}>
                            <Grid size={{ xs: 6 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={approved_status_name == "Approved"}
                                    startIcon={<ThumbUp />}
                                    onClick={showApproveModal}
                                >
                                    Approve
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    startIcon={<ThumbDown />}
                                    onClick={() => dispatch(setIsRejectModalOpen(true))}
                                >
                                    Reject
                                </Button>
                            </Grid>
                        </Grid>
                    )}

                    <Box sx={{ mt: 2 }}>
                        <Alert
                            severity={
                                approved_status === 1
                                    ? "info"
                                    : approved_status === 2
                                        ? "success"
                                        : "error"
                            }
                        >
                            {approved_status_name}
                        </Alert>
                    </Box>
                    {approved_level != 0 &&
                        <Timeline approvalData={approved_data?.materialrequestapprovals} />
                    }
                </Card>
            </Grid> */}
				{model && (
					<Dialog
						open={model}
						onClose={handleClose}
						maxWidth="sm"
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description">
						<DialogContent
							sx={{
								px: "24px",
								pt: "12px !important",
								pb: 0,
								p: 3,
								paddingTop: 2,
							}}>
							<DialogContentText
								id="alert-dialog-description"
								sx={{
									width: 500,
								}}>
								<Typography
									variant="h5"
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
										cursor: "pointer",
									}}>
									<IconButton aria-label="info">
										<InfoIcon color="primary" />
									</IconButton>
									Are you sure want to Approve?
								</Typography>
								<DialogActions sx={{ p: 2 }}>
									<Button
										onClick={handleClose}
										variant="outlined"
										color="secondary"
										style={{ cursor: "pointer" }}>
										Cancel
									</Button>
									<Button
										variant="contained"
										type="submit"
										color="primary"
										onClick={expenditureItemApprove}
										autoFocus>
										Ok
									</Button>
								</DialogActions>
							</DialogContentText>
						</DialogContent>
					</Dialog>
				)}

				{rejectModel && (
					<Dialog
						open={rejectModel}
						onClose={closeModal}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description">
						<DialogTitle
							sx={{
								bgcolor: "primary.main",
								color: "white",
								p: 1,
								px: 2,
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
							variant="h4"
							id="alert-dialog-title">
							Reject Expenditure Sheet
							<IconButton onClick={closeModal}>
								<LuX color="white" />
							</IconButton>
						</DialogTitle>
						<DialogContent
							sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
							<DialogContentText
								id="alert-dialog-description"
								sx={{
									width: 500,
								}}>
								<form
									style={{ width: "100%" }}
									onSubmit={handleSubmit(onSubmit)}>
									<TextArea
										name="reject_description"
										label="Description"
										type="text"
										placeholder="Write Description here..."
										minRows={3}
										maxRows={5}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
									/>
									<DialogActions sx={{ p: 2 }}>
										<Button
											onClick={closeModal}
											variant="outlined"
											color="secondary">
											Cancel
										</Button>
										<LoadingButton
											variant="contained"
											type="submit"
											color="primary"
											loading={loading}
											autoFocus>
											Submit
										</LoadingButton>
									</DialogActions>
								</form>
							</DialogContentText>
						</DialogContent>
					</Dialog>
				)}
			</Grid>
		</>
	);
};

export default ExpenditureSheetView;
