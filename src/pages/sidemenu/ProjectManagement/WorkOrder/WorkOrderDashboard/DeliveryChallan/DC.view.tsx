import {
	Alert,
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
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
import { updateSidenav } from "@src/store/customise/customise";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectMaterialIssues } from "@src/store/sidemenu/project_management/MaterialIssue/mr_issues.slice";
import { getMIById } from "@src/store/sidemenu/project_management/MaterialIssue/mr_issues.action";
import {
	getDeliveryChallanById,
	deliveryChallanCheckApproval,
	deliveryChallanApproval,
} from "@src/store/sidemenu/project_management/DeliveryChallan/DC.action";
import {
	useDeliveryChallanSelector,
	setIsModalOpen,
	setIsRejectModalOpen,
	deliveryChallanCheckApproveSuccessful,
	getDeliveryChallanCheckApprove,
} from "@src/store/sidemenu/project_management/DeliveryChallan/DC.slice";
import { LuArrowLeftCircle } from "react-icons/lu";
import { pdf } from "@react-pdf/renderer";
import TextArea from "@src/components/form/TextArea";
import { LuX } from "react-icons/lu";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import Timeline from "../timeline";
import InfoIcon from "@mui/icons-material/Info";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import { DeliveryChallanPrintContent } from "@src/pages/sidemenu/PrintPDF/deliveryChallan";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";
import { fetchNotificationList } from "@src/store/notifications/notification.actions";

const MIView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const dispatch = useAppDispatch();

	const {
		deliveryChallan: {
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
		},
		system: { userAccessList },
	} = useDeliveryChallanSelector();
	const navigate = useNavigate();

	const {
		company: { companyData },
	} = useAppSelector((state) => {
		return {
			company: companySelector(state),
		};
	});
	const [showRejDescription, setShowRejDescription] = useState(false);

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		dispatch(
			getDeliveryChallanById({
				id: id ? id : "",
			})
		);
		dispatch(
			deliveryChallanCheckApproval({ delivery_challan_id: id ? id : "" })
		);
		dispatch(setCompanyData({}));
	}, [id]);

	const renderData = [
		{
			label: "Code",
			value: selectedData?.code,
		},
		{
			label: "Customer",
			value: selectedData?.customer?.name,
		},
		{
			label: "Vehicle Number",
			value: selectedData?.vehicle_no,
		},
		{
			label: "Mode Of Transport",
			value: selectedData?.mode_of_transport,
		},
		{
			label: "Mobile",
			value: selectedData?.mobile,
		},
		{
			label: "Email",
			value: selectedData?.email,
		},
		{
			label: "Address",
			value: selectedData?.address,
		},
		{
			label: "Customised Delivery Challan Value",
			value: selectedData?.cust_dcvalue,
		},
		{
			label: "Type",
			value: selectedData?.dc_type_name,
		},
		{
			label: "Description",
			value: selectedData?.description,
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
			title: "Batch",
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
			title: "Description",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		batch: string,
		unit: JSX.Element,
		quantity: JSX.Element,
		description: JSX.Element
	) {
		return {
			index,
			name,
			batch,
			unit,
			quantity,
			description,
		};
	}
	const rows = useMemo(() => {
		return selectedData?.dchallan_items
			?.filter((e) => !e.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const quantity = <Typography>{row?.qty}</Typography>;
				const unit = <Box>{row?.unit?.label}</Box>;
				const description = (
					<ReadMore
						text={row.description ? row.description : ""}
						maxLength={30}
					/>
				);

				return createData(
					index,
					row?.item?.label ? row?.item?.label : "",
					row?.batch?.label ? row?.batch?.label : "",
					quantity,
					unit,
					description
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getMaterialIssues({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getMaterialIssues({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};
	const theme = useTheme();

	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<DeliveryChallanPrintContent
				dcData={selectedData}
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
			<DeliveryChallanPrintContent
				dcData={selectedData}
				companyData={companyData}
			/>
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "DeliveryChallan.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} else {
			console.error("Failed to generate PDF");
		}
	};
	const handleClose = () => {
		dispatch(setIsModalOpen(false));
	};
	const showApproveModal = () => {
		dispatch(setIsModalOpen(true));
	};
	const closeModal = () => {
		dispatch(setIsRejectModalOpen(false));
	};
	function DCApprove() {
		var data = {
			delivery_challan_id: id,
			approved_level: approved_level + 1,
			approved_status: 2,
			description: selectedData?.description,
		};
		dispatch(deliveryChallanApproval({ data }));
		dispatch(setIsModalOpen(false));
		dispatch(
			fetchNotificationList({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
		dispatch(deliveryChallanCheckApproval({ delivery_challan_id: id ? id : "" }));
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
			delivery_challan_id: id,
			approved_level: approved_level + 1,
			approved_status: 3,
			description: payload?.reject_description,
		};
		dispatch(deliveryChallanApproval({ data }));
		dispatch(setIsRejectModalOpen(false));
		dispatch(
			fetchNotificationList({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
		dispatch(deliveryChallanCheckApproval({ delivery_challan_id: id ? id : "" }));
	};

	return (
		<>
			{" "}
			<Grid container spacing={2}>
				<Grid size={{ xs: 8 }}>
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
										`/work_order/view/${projectId}/${tab}/project/delivery_challan/`,
										{
											relative: "path",
										}
									);
								}}>
								<LuArrowLeftCircle
									color={theme.palette.primary.main}
								/>
								Delivery Challan
							</Typography>
							<Box sx={{ flex: 1 }} />
							<Box sx={{ display: "flex", gap: 2 }}>
								{userAccessList?.indexOf("System.all_data") !==
									-1 && (
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
																	?.project
																	?.company,
															})
														).then(async (res: any) => {
															onHandlePrintPreview(
																res.payload
																	?.response
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
																	?.project
																	?.company,
															})
														).then(async (res: any) => {
															onHandleDownload(
																res.payload
																	?.response
															);
														});
													} else {
														onHandleDownload(
															companyData
														);
													}
												}}>
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
														<Typography variant="h6">
															<b>
																{item.label}:{" "}
															</b>
															{item?.value as any}
														</Typography>
													</Grid>
												);
											})}
										</Grid>
										{approved_status_name == "Rejected" && (
											<Grid size={{ xs: 12, md: 6 }}>
												<Stack
													direction={"row"}
													spacing={1}
													alignItems="center">
													<Typography variant="h5">
														Rejected Remarks:
													</Typography>
													<Button
														onClick={() =>
															setShowRejDescription(
																true
															)
														}>
														Click to see remarks
													</Button>
													{showRejDescription && (
														<Dialog
															open={
																showRejDescription
															}
															onClose={() =>
																setShowRejDescription(
																	false
																)
															}
															maxWidth="md"
															fullWidth>
															<DialogTitle>
																{"Remarks"}
															</DialogTitle>
															<DialogContent>
																<Typography>
																	{
																		selectedData?.deliverychallanapprovals?.map((val: any) => {
																			return val?.description
																		})
																	}
																</Typography>
															</DialogContent>
															<DialogActions>
																<Button
																	onClick={() =>
																		setShowRejDescription(
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
										)}
									</Box>
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
												selectedData?.dchallan_items
													?.length
													? selectedData
														?.dchallan_items
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
					</Box>
				</Grid>
				<Grid size={{ xs: 4 }}>
					<Card sx={{ mt: 2, p: 2 }}>
						<Grid container spacing={2}>
							{/* Avatar */}
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
										{selectedData?.created_by?.fullname ||
											"None"}
									</Typography>
									<Typography variant="body1">
										<strong>Email: </strong>
										{selectedData?.created_by?.email ||
											"None"}
									</Typography>
									<Typography variant="body1">
										<strong>Mobile: </strong>
										{selectedData?.created_by?.phone ||
											"None"}
									</Typography>
								</Box>
							</Grid>
						</Grid>
						{checkApprove &&
							userAccessList?.indexOf(
								"Delivery.change_deliverychallanapproval"
							) !== -1 && (
								<Grid
									container
									spacing={2}
									sx={{ mt: 2, p: 1 }}>
									{approved_status_name !=
										"Approved" && (
											<>
												<Grid size={{ xs: 6 }}>
													<Button
														variant="contained"
														color="success"
														fullWidth
														disabled={approved_status_name == "Approved" || approved_status_name == "Rejected"}
														startIcon={<ThumbUp />}
														onClick={showApproveModal}>
														Approve
													</Button>
												</Grid>
												<Grid size={{ xs: 6 }}>
													<Button
														variant="contained"
														color="error"
														fullWidth
														disabled={approved_status_name == "Rejected"}
														startIcon={<ThumbDown />}
														onClick={() =>
															dispatch(
																setIsRejectModalOpen(true)
															)
														}>
														Reject
													</Button>
												</Grid>
											</>)}
								</Grid>
							)}

						{/* Alert */}
						<Box sx={{ mt: 2 }}>
							<Alert
								severity={
									approved_status === 1
										? "info"
										: approved_status === 2
											? "success"
											: "error"
								}>
								{approved_status_name == "Approved" ? approved_status_name : "Level " + approved_level + " " + approved_status_name}
							</Alert>
						</Box>
						{approved_level != 0 && (
							<Timeline
								approvalData={
									approved_data?.deliverychallanapprovals
								}
							/>
						)}
					</Card>
				</Grid>
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
										onClick={DCApprove}
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
							Delivery Challan Reject
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

export default MIView;
