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
} from "@mui/material";
import GoBack from "@src/components/GoBack";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import {
	selectMaterialRequest,
	setIsModalOpen,
	getMRCheckApprove,
	setIsItemModalOpen,
	setIsRejectModalOpen,
	mrCheckApproveSuccessful,
	setItemName,
	setMRItemData,
} from "@src/store/sidemenu/project_management/MaterialRequest/material_request.slice";
import {
	getMRById,
	// MRCheckApproval,
	materialRequestApproval,
	updateMaterialRequestStatus,
} from "@src/store/sidemenu/project_management/MaterialRequest/material_request.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Timeline from "../timeline";
import InfoIcon from "@mui/icons-material/Info";
import { LuPencil, LuX } from "react-icons/lu";
import TextArea from "@src/components/form/TextArea";
import { LoadingButton } from "@mui/lab";
import { getApprovals } from "@src/store/settings/Permissions/Approvals/approval.action";
import { ApprovalSelector } from "@src/store/settings/Permissions/Approvals/approval.slice";
import ItemModal from "./itemModal";
import { fetchNotificationList } from "@src/store/notifications/notification.actions";
import Swal from "sweetalert2";
import ApprovalWorkflow from "@src/components/Approvals";
import { getPurchaseOrderById } from "@src/store/sidemenu/project_management/MaterialReceivedNotes/mrn.action";

const MaterialRequestView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const [showRejDescription, setShowRejDescription] = useState(false);
	const dispatch = useAppDispatch();

	const {
		materialRequest: {
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
			itemModel,
			itemName,
			itemPageParams,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectMaterialRequest(state));

	const {
		approval: { approvalList },
	} = useAppSelector((state) => {
		return {
			approval: ApprovalSelector(state),
		};
	});
	const navigate = useNavigate();
	useEffect(() => {
		dispatch(
			getMRById({
				id: id ? id : "",
			})
		);
		// dispatch(MRCheckApproval({ material_request_id: id ? id : "" }));
	}, [id]);

	const convertToItem = (value: string, itemdata: any) => {
		dispatch(setMRItemData(itemdata));
		dispatch(setItemName(value));
		dispatch(setIsItemModalOpen(true));
	};

	const renderData = [
		{
			label: "MR Code",
			value: selectedData?.code,
		},
		{
			label: "MR Status",
			value: (
				<span>
					{!selectedData?.mr_status ? (
						"None"
					) : (
						<Chip
							sx={{
								width: 100,
							}}
							label={
								<Typography>
									{selectedData?.mr_status_name}
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
								switch (selectedData?.mr_status_name) {
									case "Approved":
										tagColor = "success";
										break;
									case "Pending":
										tagColor = "warning";
										break;
									case "Rejected":
										tagColor = "error";
										break;
									case "Closed":
										tagColor = "info";
										break;
									default:
										tagColor = "warning";
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
		item_name: React.JSX.Element,
		make: React.JSX.Element,
		date: string,
		quantity: string | number,
		unit: React.JSX.Element,
		description: React.JSX.Element
	) {
		return {
			index,
			item_name,
			make,
			date,
			quantity,
			unit,
			description,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.mr_items
			?.filter((e) => !e.dodelete)
			?.map((row: any, key) => {
				const index =
					(itemPageParams.page - 1) * itemPageParams.page_size +
					(key + 1);

				const description = (
					<ReadMore
						text={row.description ? row.description : ""}
						maxLength={30}
					/>
				);

				const Item = (
					<>
						{row?.item_name !== "" &&
						row?.item_name !== null &&
						(!row?.item ||
							(row?.item?.label === undefined &&
								row?.item?.value === undefined)) ? (
							<>
								{row?.item_name}
								{userAccessList?.indexOf(
									"MaterialRequest.change_materialrequest"
								) !== -1 && (
									<LuPencil
										style={{
											marginLeft: "5px",
											color: "red",
											cursor: "pointer",
										}}
										onClick={() =>
											convertToItem(row?.item_name, row)
										}></LuPencil>
								)}
							</>
						) : (
							row?.item?.name
						)}
					</>
				);
				const Make = (
					<>
						{row?.make_name !== "" &&
						row?.make_name !== null &&
						(!row?.make ||
							(row?.make?.label === undefined &&
								row?.make?.value === undefined)) ? (
							<>{row?.make_name}</>
						) : (
							row?.make?.name
						)}
					</>
				);
				const Unit = (
					<>
						{row?.unit_name !== "" &&
						row?.unit_name !== null &&
						(!row?.unit ||
							(row?.unit?.label === undefined &&
								row?.unit?.value === undefined)) ? (
							<>{row?.unit_name}</>
						) : (
							row?.unit?.name
						)}
					</>
				);
				//row?.item_name ? row?.item_name : row?.item?.name

				return createData(
					index,
					Item,
					Make,
					moment(row.created_on).format("LLL"),
					row.qty,
					Unit,
					description
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getMaterialRequest({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getMaterialRequest({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
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
	function mrApprove() {
		var data = {
			material_request_id: id,
			approved_level: approved_level + 1,
			approved_status: 2,
			description: selectedData?.description,
		};
		dispatch(
			materialRequestApproval({
				data,
				callback: () => {
					dispatch(setIsModalOpen(false));
					// dispatch(
					// 	MRCheckApproval({ material_request_id: id ? id : "" })
					// );
				},
			})
		);
		// .then(() => {

		// })
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
			material_request_id: id,
			approved_level: approved_level + 1,
			approved_status: 3,
			description: payload?.reject_description,
		};
		dispatch(
			materialRequestApproval({
				data,
				callback: () => {
					dispatch(setIsRejectModalOpen(false));
					// dispatch(
					// 	MRCheckApproval({ material_request_id: id ? id : "" })
					// );
				},
			})
		);
	};
	const CloseMaterialRequest = () => {
		const data = {
			mr_status: 5,
		};
		dispatch(
			updateMaterialRequestStatus({
				id: id ?? "",
				data,
				params: {
					...pageParams,
					project_id: projectId,
				},
			})
		);
	};
	return (
		<>
			{" "}
			<Grid container spacing={2}>
				<Grid
					size={{
						xs: 12,
						lg: selectedData?.authorized_status !== 4 ? 8.5 : 12,
					}}>
					<GoBack
						is_goback={true}
						go_back_url={`/work_order/view/${projectId}/${tab}/project/material_request/`}
						title={`Material Request`}
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
														<Typography variant="h5">
															{item.label}:{" "}
															{item.value}
														</Typography>
													</Grid>
												);
											})}
										</Grid>
										{approved_status_name == "Rejected" && (
											<Grid size={{ xs: 12, md: 4 }}>
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
																	{selectedData?.materialrequestapprovals?.map(
																		(
																			val: any
																		) => {
																			return val?.description;
																		}
																	)}
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
											count={
												selectedData?.mr_items?.length
													? selectedData?.mr_items
															?.length
													: 0
											}
											containerHeight={440}
											columns={columns}
											rows={rows ? rows : []}
											loading={false}
											page={itemPageParams.page}
											pageSize={itemPageParams.page_size}
											handleChangePage={handleChangePage}
											handleChangeRowsPerPage={
												handleChangeRowsPerPage
											}
										/>
									</Box>
								</CardContent>
							</Card>
							<Grid size={{ xs: 12 }} mt={2}>
								{approved_status_name == "Approved" && (
									<Stack justifyContent="flex-end">
										<Box
											width={"100%"}
											display={"flex"}
											justifyContent={"flex-end"}>
											<Button
												variant="contained"
												size="large"
												disabled={
													selectedData?.mr_status_name ==
													"Closed"
												}
												onClick={CloseMaterialRequest}
												color="primary"
												autoFocus>
												Close
											</Button>
										</Box>
									</Stack>
								)}
							</Grid>
						</Box>
					</GoBack>
				</Grid>
				{selectedData?.authorized_status !== 4 && (
					<Grid
						size={{
							xs: 12,
							lg: 3.5,
						}}>
						<ApprovalWorkflow
							data={selectedData}
							app_label={"MaterialRequest"}
							model_name={"materialrequest"}
							instance_id={id || ""}
							callback={() => {
								dispatch(
									getMRById({
										id: id || "",
									})
								);
							}}
						/>
					</Grid>
				)}
			</Grid>
		</>
	);
};

export default MaterialRequestView;
