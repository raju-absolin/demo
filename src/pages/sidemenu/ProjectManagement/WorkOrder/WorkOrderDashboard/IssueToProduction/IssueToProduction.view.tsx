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
import { useParams } from "react-router-dom";
import {
	getIssueToProductionById,
	issueToProductionApproval,
	issueToProductionCheckApproval,
} from "@src/store/sidemenu/project_management/IssueToProduction/ITP.action";
import TextArea from "@src/components/form/TextArea";
import { LuX } from "react-icons/lu";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import Timeline from "../timeline";
import InfoIcon from "@mui/icons-material/Info";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import {
	useIssueToProductionSelector,
	getIssueToProducitonCheckApprove,
	ITPCheckApproveSuccessful,
	setIsModalOpen,
	setIsRejectModalOpen,
} from "@src/store/sidemenu/project_management/IssueToProduction/ITP.slice";
import { fetchNotificationList } from "@src/store/notifications/notification.actions";

const MIView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const [showRejDescription, setShowRejDescription] = useState(false);
	const dispatch = useAppDispatch();

	const {
		issueToProduction: {
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
	} = useIssueToProductionSelector();

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		dispatch(
			getIssueToProductionById({
				id: id ? id : "",
			})
		);
		dispatch(
			issueToProductionCheckApproval({
				issue_toproduction_id: id ? id : "",
			})
		);
	}, [id]);

	const renderData = [
		{
			label: "Code",
			value: selectedData?.code,
		},
		{
			label: "Date Of Issue",
			value: moment(selectedData?.date).format("DD-MM-YYYY"),
		},
		{
			label: "Warehouse",
			value: selectedData?.warehouse?.name,
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
			title: "Date",
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
		unit: JSX.Element,
		batch: JSX.Element,
		date: JSX.Element,
		quantity: JSX.Element,
		description: JSX.Element
	) {
		return {
			index,
			name,
			unit,
			batch,
			date,
			quantity,
			description,
		};
	}
	const rows = useMemo(() => {
		return selectedData?.issuetoproductionitems
			?.filter((e) => !e.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const quantity = <Typography>{row?.qty}</Typography>;
				const unit = <Box>{row?.unit?.label}</Box>;
				const batch = <Box>{row?.batch?.label}</Box>;
				const date = (
					<Typography>
						{row?.date
							? moment(row?.date).format("DD-MM-YYYY")
							: ""}
					</Typography>
				);
				const description = (
					<ReadMore
						text={row.description ? row.description : ""}
						maxLength={30}
					/>
				);

				return createData(
					index,
					row?.item?.label ? row?.item?.label : "",
					batch,
					date,
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

	const handleClose = () => {
		dispatch(setIsModalOpen(false));
	};
	const showApproveModal = () => {
		dispatch(setIsModalOpen(true));
	};
	const closeModal = () => {
		dispatch(setIsRejectModalOpen(false));
	};
	function ITPApprove() {
		var data = {
			issue_toproduction_id: id,
			approved_level: approved_level + 1,
			approved_status: 2,
			description: selectedData?.description,
		};
		dispatch(issueToProductionApproval({ data }));
		dispatch(setIsModalOpen(false));
		dispatch(
			fetchNotificationList({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
		dispatch(issueToProductionCheckApproval({ issue_toproduction_id: id ? id : "" }));
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
			issue_toproduction_id: id,
			approved_level: approved_level + 1,
			approved_status: 3,
			description: payload?.reject_description,
		};
		dispatch(issueToProductionApproval({ data }));
		dispatch(setIsRejectModalOpen(false));
		dispatch(
			fetchNotificationList({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
		dispatch(issueToProductionCheckApproval({ issue_toproduction_id: id ? id : "" }));
	};

	return (
		<>
			{" "}
			<Grid container spacing={2}>
				<Grid size={{ xs: 8 }}>
					<GoBack
						is_goback={true}
						go_back_url={`/work_order/view/${projectId}/${tab}/project/issue_to_production/`}
						title={`Issue to Production`}
						showSaveButton={false}
						loading={false}>
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
															{item.label}:{" "}
															{item?.value as any}
														</Typography>
													</Grid>
												);
											})}
										</Grid>
										<Grid size={{ xs: 12, md: 6 }} mt={2}>
											<Stack
												direction={"row"}
												spacing={1}
												alignItems="center">
												<Typography variant="h5">
													Remarks:
												</Typography>
												<Button
													onClick={() =>
														setShowDescription(true)
													}>
													Click to see Remarks
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
															{"Remarks"}
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
																			selectedData?.issuetoproductionapprovals?.map((val: any) => {
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
												selectedData
													?.issuetoproductionitems
													?.length
													? selectedData
														?.issuetoproductionitems
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
					</GoBack>
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
								"Production.change_issuetoproductionapproval"
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
												</Grid></>)}
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
									approved_data?.issuetoproductionapprovals
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
										onClick={ITPApprove}
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
							Issue To Production Reject
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
