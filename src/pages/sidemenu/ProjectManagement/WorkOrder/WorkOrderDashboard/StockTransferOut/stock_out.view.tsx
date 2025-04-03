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
	selectStockOut,
	setIsRejectModalOpen,
	stockOutCheckApproveSuccessful,
	getStockOutCheckApprove,
	setIsModalOpen,
} from "@src/store/sidemenu/project_management/StockTransferOut/stock_out.slice";
import {
	getStockOutById,
	stockOutApproval,
	stockOutCheckApproval,
} from "@src/store/sidemenu/project_management/StockTransferOut/stock_out.action";
import TextArea from "@src/components/form/TextArea";
import { LuX } from "react-icons/lu";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import Timeline from "../timeline";
import InfoIcon from "@mui/icons-material/Info";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import { fetchNotificationList } from "@src/store/notifications/notification.actions";

const StockOutView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const [showRejDescription, setShowRejDescription] = useState(false);
	const dispatch = useAppDispatch();

	const {
		stockOut: {
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
	} = useAppSelector((state) => selectStockOut(state));

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		dispatch(
			getStockOutById({
				id: id ? id : "",
			})
		);
		dispatch(stockOutCheckApproval({ stocktransferout_id: id ? id : "" }));
	}, [id]);

	const renderData = [
		{
			label: "Code",
			value: selectedData?.code,
		},
		{
			label: "Created On",
			value: moment(selectedData?.date).format("DD-MM-YYYY"),
		},
		{
			label: "Stock Transfer Out Status",
			value: selectedData?.sostatus_name,
		},
		{
			label: "From Warehouse",
			value: selectedData?.warehouse?.name,
		},
		{
			label: "To Warehouse",
			value: selectedData?.to_warehouse?.name,
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
		batch:string,
		quantity: string | number,
		unit: string,
		description: string,
	) {
		return {
			index,
			name,
			batch,
			quantity,
			unit,
			description,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.soitems
			?.filter((e) => !e?.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				return createData(
					index,
					row?.item?.name ? row?.item?.name : "",
					row?.batch?.batchname ? row?.batch?.batchname : "",
					row?.qty ? row?.qty : 0,
					row?.unit?.name ? row?.unit.name : "",
					row?.description ? row?.description : "",
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getStockOut({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getStockOut({
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
	function stockTransferOutApprove() {
		var data = {
			stocktransferout_id: id,
			approved_level: approved_level + 1,
			approved_status: 2,
			description: selectedData?.description,
		};
		dispatch(stockOutApproval({ data }));
		dispatch(setIsModalOpen(false));
		dispatch(
			fetchNotificationList({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
		dispatch(stockOutCheckApproval({ stocktransferout_id: id ? id : "" }));
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
			stocktransferout_id: id,
			approved_level: approved_level + 1,
			approved_status: 3,
			description: payload?.reject_description,
		};
		dispatch(stockOutApproval({ data }));
		dispatch(setIsRejectModalOpen(false));
		dispatch(
			fetchNotificationList({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
		dispatch(stockOutCheckApproval({ stocktransferout_id: id ? id : "" }));
	};

	return (
		<>
			{" "}
			<Grid container spacing={2}>
				<Grid size={{ xs: 8 }}>
					<GoBack
						is_goback={true}
						go_back_url={`/work_order/view/${projectId}/${tab}/project/stock_transfer_out/`}
						title={`Stock Transfer Out`}
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
										<Grid size={{ xs: 6, md:4 }}>
											<Stack
												direction={"row"}
												spacing={1}
												alignItems="center">
												<Typography variant="h6">
													Description:
												</Typography>
												<Button
													onClick={() =>
														setShowDescription(true)
													}>
													Click to see description
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
										{approved_status_name == "Rejected" && (
											<Grid size={{ xs: 6, md: 4 }}>
												<Stack
													direction={"row"}
													spacing={1}
													alignItems="center">
													<Typography variant="h6">
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
																		selectedData?.stocktransferoutapprovals?.map((val: any) => {
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
											containerHeight={440}
											count={
												selectedData?.soitems?.length
													? selectedData?.soitems
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
								"StockTransfer.change_stocktransferoutapproval"
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
														disabled={
															approved_status_name == "Approved" || approved_status_name == "Rejected"
														}
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
									approved_data?.stocktransferoutapprovals
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
										onClick={stockTransferOutApprove}
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
							Stock Transfer Out Reject
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

export default StockOutView;
