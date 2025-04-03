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
} from "@mui/material";
import { FileType } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import { miniType } from "@src/store/mini/mini.Types";
import { useTaskActions } from "@src/store/sidemenu/task_management/tasks/tasks.action";
import {
	selectTasks,
	useTaskSelector,
} from "@src/store/sidemenu/task_management/tasks/tasks.slice";
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
	LuFile,
	LuLoader,
	LuSendHorizonal,
	LuX,
} from "react-icons/lu";
import { useParams } from "react-router-dom";
import Checklist from "./components/CheckList";
import { Comments } from "./components/Comments";
import { TaskDetails } from "./components/TaskDetails";
import AssignUserModal from "@src/components/AssignUser";
import { useAppDispatch } from "@src/store/store";
import { getWorkOrderById } from "@src/store/sidemenu/project_management/work_order/work_order.action";

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

const ViewTask = () => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		tasks: { modal, selectedData, pageParams, viewModal, task_checklist },
		system: { userAccessList },
		mini: { miniProjectGroups, miniMileStones },
	} = useTaskSelector();

	const {
		reducer: { setSelectedData, setViewModal, clear_task_attachment },
		extraReducer: {
			getTaskCheckList,
			editTaskChecklist,
			postTaskChecklist,
			deleteTaskCheckList,
		},
	} = useTaskActions();

	const clearData = () => {
		setSelectedData(null);
	};

	const hide = () => {
		setViewModal(false);
		clearData();
		clear_task_attachment();
	};

	let modal_path = "TaskManagement.task";

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
							{selectedData?.subject}
						</Typography>
						<LuArrowRight />
						<>
							<span>
								{!selectedData?.status ? (
									"None"
								) : (
									<Chip
										label={
											<Typography>
												{selectedData?.status_name}
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
											switch (selectedData?.status) {
												case 1:
													tagColor = "warning";
													break;
												case 2:
													tagColor = "warning"; // MUI does not have 'blue', using 'info' instead
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
						</>
						<AssignUserModal
							instance_id={selectedData?.id || ""}
							modal_path={modal_path}
							callback={() => {}}
						/>
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
										Created At :
										{" " +
											moment(
												selectedData?.created_on
											).format("DD-MM-YYYY")}
									</Typography>
								</Stack>
								<Stack spacing={1}>
									<Typography variant="subtitle2">
										Description :
										{" " + selectedData?.description}
									</Typography>
									{/* <Typography>
										{selectedData?.description}
									</Typography> */}
								</Stack>
							</Paper>
							{task_checklist?.length > 0 &&
								userAccessList?.indexOf(
									"TaskManagement.view_checklist"
								) !== -1 && (
									<Paper
										variant="outlined"
										sx={{
											p: 2,
										}}>
										<Stack spacing={1}>
											<Checklist />
										</Stack>
									</Paper>
								)}
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
						<TaskDetails />
					</Grid>
				</Grid>
				{/* </DialogContentText> */}
			</DialogContent>
		</Dialog>
	);
};

export default ViewTask;
