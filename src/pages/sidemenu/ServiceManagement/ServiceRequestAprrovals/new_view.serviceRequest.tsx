import {
	CalendarMonthOutlined,
	FileUploadOutlined,
	InfoOutlined,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Box,
	Chip,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogProps,
	Grid2 as Grid,
	DialogTitle,
	IconButton,
	Stack,
	Typography,
	Paper,
	Button,
	TextField,
	List,
	styled,
	Avatar,
	Divider,
	Tooltip,
	Zoom,
	AvatarGroup,
} from "@mui/material";
import { FileType } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import { miniType } from "@src/store/mini/mini.Types";
import { getServiceRequestById } from "@src/store/sidemenu/service_management/ServiceRequestApprovals/serviceRequestApprovals.action";
import {
	selectServiceRequests,
	useServiceRequestSelector,
	setSelectedData,
	setOpenViewModal,
	setOpenStatusModal,
	setOpenDepartmentUserModal,
} from "@src/store/sidemenu/service_management/ServiceRequestApprovals/serviceRequestApprovals.slice";
import moment from "moment";
import React, {
	ReactNode,
	SyntheticEvent,
	useEffect,
	useMemo,
	useState,
} from "react";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import {
	LuArrowRight,
	LuChevronRight,
	LuFile,
	LuLoader,
	LuPen,
	LuPlus,
	LuSendHorizonal,
	LuX,
} from "react-icons/lu";
import { useParams } from "react-router-dom";
import ServiceRequestOverview from "../ServiceRequestOveriew/index";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import StatusModal from "./StatusModal";
import ServiceDocuments from "../ServiceDocuments";
import { clearServiceRequestComments } from "@src/store/sidemenu/service_management/ServiceRequestComments/serviceRequestComments.slice";
import { Comments } from "./Comments";
import AssignUserModal from "@src/components/AssignUser";
import ApprovalWorkflow from "@src/components/Approvals";

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "300px",
	marginTop: "15px",
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
// const GroupedAvatars = () => {
// 	const dispatch = useAppDispatch();
// 	const {
// 		serviceRequest: { selectedData },
// 		system: { serviceRequestMenuItemsList },
// 	} = useServiceRequestSelector();
// 	return (
// 		<Box>
// 			<Stack direction={"row"} alignItems={"center"}>
// 				<AvatarGroup
// 					max={7}
// 					onClick={() => {
// 						dispatch(setOpenDepartmentUserModal(true));
// 					}}>
// 					{selectedData?.assignees?.length != 0 ? (
// 						<>
// 							{selectedData?.assignees?.map((user) => {
// 								return (
// 									<Avatar
// 										variant="circular"
// 										src={user?.fullname?.charAt(0)}
// 										sx={{ height: "32px", width: "32px" }}
// 									/>
// 								);
// 							})}
// 						</>
// 					) : (
// 						<Box>
// 							<Button
// 								startIcon={<LuPlus />}
// 								variant={"outlined"}
// 								onClick={() => {
// 									dispatch(setOpenDepartmentUserModal(true));
// 								}}>
// 								Add Assignees
// 							</Button>
// 						</Box>
// 					)}
// 					<IconButton
// 						sx={{
// 							color: "primary",
// 						}}
// 						onClick={() => {
// 							dispatch(setOpenDepartmentUserModal(true));
// 						}}>
// 						<LuChevronRight
// 							style={{
// 								color: "inherit",
// 							}}
// 						/>
// 					</IconButton>
// 				</AvatarGroup>
// 			</Stack>
// 		</Box>
// 	);
// };

const ViewServiceRequest = () => {
	const dispatch = useAppDispatch();
	const {
		serviceRequest: { selectedData, pageParams, openViewModal: viewModal },
		system: { userAccessList },
		mini: { miniProjectGroups, miniMileStones },
	} = useServiceRequestSelector();

	const clearData = () => {
		dispatch(setSelectedData(null));
		dispatch(clearServiceRequestComments());
	};

	const hide = () => {
		dispatch(setOpenViewModal(false));
		clearData();
		// dispatch(clear_task_attachment());
	};

	return (
		<Dialog
			open={viewModal}
			onClose={() => {
				hide();
			}}
			// sx={{
			// 	"& .MuiDialog-paper": {
			// 		width: "800px",
			// 	},
			// }}
			fullWidth
			maxWidth={"xxl" as "xl"}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle
				sx={{
					// bgcolor: "primary.main",
					// color: "white",
					p: 1,
					px: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
				variant="h4"
				id="alert-dialog-title">
				<Box>
					<Stack
						justifyContent="space-between"
						direction={"row"}
						alignItems={"center"}
						spacing={2}>
						<Typography variant="subtitle1">
							Request No: {selectedData?.code}
						</Typography>
						<LuArrowRight />

						{selectedData?.authorized_status == 2 && (
							<>
								{/* <AssignUserModal /> */}
								{/* <GroupedAvatars /> */}

								<AssignUserModal
									instance_id={selectedData?.id || ""}
									modal_path={"TaskManagement.task"}
									callback={() => {}}
								/>
							</>
						)}
						<>
							<span>
								{!selectedData?.authorized_status ? (
									"None"
								) : (
									<Chip
										label={
											<Typography>
												{
													selectedData.authorized_status_name
												}
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
											switch (
												selectedData.authorized_status
											) {
												case 1:
													tagColor = "warning";
													break;
												case 2:
													tagColor = "success";
													break;
												case 3:
													tagColor = "error";
													break;
												case 4:
													tagColor = "default";
													break;

												default:
													tagColor = "default";
											}
											return tagColor;
										})()}
									/>
								)}
							</span>
							<Stack direction="row" spacing={1}>
								{userAccessList?.indexOf(
									"FacilityManagement.can_approve_servicerequest"
								) !== -1 && (
									<Tooltip
										TransitionComponent={Zoom}
										title="Change Status">
										<IconButton
											onClick={() => {
												dispatch(
													setOpenStatusModal(true)
												);
												dispatch(
													getServiceRequestById({
														id: selectedData?.id
															? selectedData?.id
															: "",
													})
												);
											}}>
											<LuPen
												style={{
													cursor: "pointer",
													color: "#cc6d2e",
													fontSize: 16,
												}}
											/>
										</IconButton>
									</Tooltip>
								)}
							</Stack>
						</>
					</Stack>
				</Box>
				<IconButton
					onClick={() => {
						hide();
					}}>
					<LuX
					//  color="white"
					/>
				</IconButton>
			</DialogTitle>
			<DialogContent>
				{/* <DialogContentText id="alert-dialog-description"> */}
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, lg: 8 }}>
						<Stack spacing={2}>
							<Paper
								variant="outlined"
								sx={{
									p: 2,
								}}>
								<Stack spacing={1}>
									<Typography variant="subtitle2">
										Description :
									</Typography>
									<Typography>
										{selectedData?.description}
									</Typography>
								</Stack>
							</Paper>
							<Paper
								variant="outlined"
								sx={{
									p: 2,
								}}>
								<Stack spacing={1}>
									<Typography variant="subtitle2">
										Remarks :
									</Typography>
									<Typography>
										{selectedData?.remarks}
									</Typography>
								</Stack>
							</Paper>
							<Paper
								variant="outlined"
								sx={{
									p: 2,
								}}>
								<Stack spacing={1}>
									<ServiceDocuments
										selectedData={selectedData}
									/>
								</Stack>
							</Paper>
							<Paper
								variant="outlined"
								sx={{
									p: 2,
								}}>
								<Stack spacing={1}>
									<Comments />
								</Stack>
							</Paper>
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, lg: 4 }}>
						<ServiceRequestOverview />
						{selectedData &&
							selectedData?.authorized_status !== 4 && (
								<Grid size={{ xs: 12 }}>
									<ApprovalWorkflow
										data={selectedData}
										app_label={"FacilityManagement"}
										model_name={"servicerequest"}
										instance_id={selectedData?.id || ""}
										callback={() => {
											dispatch(
												getServiceRequestById({
													id: selectedData?.id || "",
												})
											);
										}}
									/>
								</Grid>
							)}
					</Grid>
				</Grid>
				{/* </DialogContentText> */}
			</DialogContent>
			<StatusModal />
		</Dialog>
	);
};

export default ViewServiceRequest;
