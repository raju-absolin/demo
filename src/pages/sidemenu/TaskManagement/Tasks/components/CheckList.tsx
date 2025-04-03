import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import {
	Box,
	TextField,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Checkbox,
	ListItemSecondaryAction,
	Button,
	Typography,
	Grid2 as Grid,
	Stack,
	Tooltip,
	Zoom,
	styled,
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";
import { useTaskSelector } from "@src/store/sidemenu/task_management/tasks/tasks.slice";
import { useTaskActions } from "@src/store/sidemenu/task_management/tasks/tasks.action";
import { CustomDatepicker, FormInput } from "@src/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniUsers } from "@src/store/mini/mini.Action";
import { clearMiniUsers } from "@src/store/mini/mini.Slice";
import { LuPlus, LuPlusCircle } from "react-icons/lu";
import moment from "moment";
import {
	CheckListData,
	Task_CheckList_Payload,
} from "@src/store/sidemenu/task_management/tasks/tasks.types";
import { LoadingButton } from "@mui/lab";
import { useParams } from "react-router-dom";

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

const Checklist: React.FC = () => {
	const [items, setItems] = useState<CheckListData[]>([]);
	const [newItemText, setNewItemText] = useState("");
	const [newAssignedTo, setNewAssignedTo] = useState("");
	const [editingItemId, setEditingItemId] = useState<string | null>(null);
	const [editingText, setEditingText] = useState("");
	const [editingAssignedTo, setEditingAssignedTo] = useState("");
	const [showAdd, setShowAdd] = useState(false);

	const { id } = useParams();

	const {
		tasks: {
			selectedData,
			task_checklist,
			task_checklist_count,
			task_checklist_loading,
			task_checklist_params,
		},
		system: { userAccessList },
		mini: { miniUserList, miniUserLoading, miniUserParams },
	} = useTaskSelector();

	const {
		reducer: { setTaskChecklist, clear_task_checklist },
		extraReducer: {
			getTaskCheckList,
			editTaskChecklist,
			postTaskChecklist,
			deleteTaskCheckList,
		},
	} = useTaskActions();

	const CheckListSchema = yup.object().shape({
		// user: yup
		// 	.object({
		// 		label: yup.string().required("Please select a user"),
		// 		value: yup.string().required("Please select a user"),
		// 	})
		// 	.required("Please select a user to assign")
		// 	.nullable(),
		task: yup.string().required("Please select a task"),
	});

	const { control, handleSubmit, reset, getValues, setValue } = useForm<any>({
		resolver: yupResolver(CheckListSchema),
	});

	const hide = () => {
		setShowAdd(false);
		reset({
			// user: null,
			task: "",
			date: "",
		});
	};

	// Add a new checklist item
	const addItem = handleSubmit((payload) => {
		if (payload.task.trim() === "") return;
		const data: Task_CheckList_Payload = {
			task_id: selectedData?.id ? selectedData?.id : "",
			description: payload.task,
			is_completed: false,
			project_id: id ? id : "",
			// user_id: payload?.user?.value,
		};

		postTaskChecklist({
			data,
			params: task_checklist_params,
			hide,
		});
	});

	// Toggle completed state
	const toggleCompleted = (item: CheckListData) => {
		const data: Task_CheckList_Payload = {
			task_id: selectedData?.id ? selectedData?.id : "",
			description: item.description,
			is_completed: !item?.is_completed,
			project_id: id ? id : "",
			// user_id: item?.user?.id ? item?.user?.id : "",
		};
		editTaskChecklist({
			id: item?.id,
			data,
			params: task_checklist_params,
			hide,
		});
	};

	// Delete a checklist item
	const deleteItem = (item: CheckListData) => {
		deleteTaskCheckList({
			id: item?.id,
			params: task_checklist_params,
		});
	};

	// Start editing an item
	const startEditing = (item: CheckListData) => {
		setEditingItemId(item.id);
		setValue("task", item?.description);
		// setValue("user", {
		// 	label: item?.user?.fullname,
		// 	value: item?.user?.id,
		// });
		setValue("item", item);
	};

	// Save the edited item
	const saveEditing = handleSubmit((payload) => {
		if (payload.task.trim() === "") return;
		const data: Task_CheckList_Payload = {
			task_id: selectedData?.id ? selectedData?.id : "",
			description: payload.task,
			is_completed: payload?.team?.is_completed,
			project_id: id ? id : "",
			// user_id: payload?.user?.value,
		};
		editTaskChecklist({
			id: payload?.item?.id,
			data,
			params: task_checklist_params,
			hide: () => {
				hide();
				setEditingItemId("");
			},
		});
	});

	useEffect(() => {
		if (selectedData?.id) {
			getTaskCheckList({
				...task_checklist_params,
				project: id ? id : "",
				page: 1,
				page_size: 10,
				task: selectedData?.id ? selectedData?.id : "",
			});
		}
	}, [selectedData, id]);

	const FormFields = useMemo(() => {
		return (
			<>
				{/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
					<Stack width={"100%"}>
						<CustomDatepicker
							control={control}
							name="date"
							hideAddon
							minDate={new Date()}
							dateFormat="DD-MM-YYYY"
							showTimeSelect={false}
							timeFormat="h:mm a"
							timeCaption="time"
							inputClass="form-input"
							label={"Date"}
							tI={1}
						/>
					</Stack>
				</Grid> */}
				<Grid size={{ xs: 12, md: 6 }}>
					<FormInput
						control={control}
						name={`task`}
						label="Task"
						type="text"
						placeholder="Enter task here..."
					/>
				</Grid>
				{/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
					<SelectComponent
						name="user"
						label="Assigne to"
						placeholder={"Select a user"}
						multiple={false}
						control={control}
						rules={{ required: true }}
						options={miniUserList?.map(
							(e: { id: string | number; fullname: string }) => ({
								id: e.id,
								name: e.fullname,
							})
						)}
						loading={miniUserLoading}
						selectParams={{
							page: miniUserParams?.page,
							page_size: miniUserParams?.page_size,
							search: miniUserParams?.search,
							no_of_pages: miniUserParams?.no_of_pages,
						}}
						hasMore={
							miniUserParams?.page < miniUserParams?.no_of_pages
						}
						fetchapi={getMiniUsers}
						clearData={clearMiniUsers}
					/>
				</Grid> */}
			</>
		);
	}, []);

	return (
		<Box>
			<Typography variant="h5" gutterBottom color="primary">
				<Stack direction="row" spacing={1}>
					{userAccessList?.indexOf("TaskManagement.add_checklist") !== -1 && (
						<Tooltip
							placement="top"
							TransitionComponent={Zoom}
							title="Click to toggle add checcklist ">
							<Stack
								direction="row"
								spacing={1}
								onClick={() => {
									setShowAdd(!showAdd);
								}}>
								<LuPlusCircle /> <p>Checklist Item</p>
							</Stack>
						</Tooltip>
					)}
				</Stack>
			</Typography>
			{showAdd && (
				<Box
					sx={{
						display: "flex",
						gap: 2,
						mb: 2,
						transition: "2s linear",
					}}>
					<form
						action=""
						style={{
							width: "100%",
						}}>
						<Grid container spacing={2}>
							{FormFields}
							<Grid size={{ xs: 12, md: 2 }}>
								<Stack mt={3.5}>
									<LoadingButton
										loading={task_checklist_loading}
										size="large"
										variant="contained"
										color="primary"
										onClick={addItem}>
										Add
									</LoadingButton>
								</Stack>
							</Grid>
						</Grid>
					</form>
				</Box>
			)}
			<List>
				<ScrollableList
					onScroll={(e: SyntheticEvent) => {
						const { target } = e as any;

						if (
							Math.ceil(
								target?.scrollTop + target?.offsetHeight
							) == target?.scrollHeight
						) {
							if (
								task_checklist_params.page <
								task_checklist_params.no_of_pages
							) {
								getTaskCheckList({
									...task_checklist_params,
									project: id ? id : "",
									page: task_checklist_params?.page + 1,
									page_size: 10,
									task: selectedData?.id
										? selectedData?.id
										: "",
								});
							}
						}
					}}>
					{task_checklist.map((item) => (
						<ListItem
							key={item.id}
							sx={{ display: "flex", alignItems: "center" }}>
							<Checkbox
								checked={item.is_completed}
								onChange={() => toggleCompleted(item)}
							/>
							{editingItemId === item.id ? (
								<Stack
									direction="row"
									justifyContent="space-between"
									alignItems="center"
									flex={1}>
									<form
										action=""
										style={{
											width: "100%",
										}}>
										<Grid
											container
											spacing={2}
											alignItems="center">
											{FormFields}
										</Grid>
									</form>
									<Box mt={2}>
										<Tooltip
											placement="top"
											TransitionComponent={Zoom}
											title="Click to save the item ">
											<IconButton
												onClick={() =>
													saveEditing(item as any)
												}>
												<Save />
											</IconButton>
										</Tooltip>
									</Box>
								</Stack>
							) : (
								<>
									<ListItemText
										primary={item.description}
										secondary={
											<Box>
												<Typography>
													{/* <b>Assigned to:</b>{" "} */}
													{item?.user?.fullname}
												</Typography>
											</Box>
										}
										sx={{
											textDecoration: item?.is_completed
												? "line-through"
												: "none",
										}}
									/>
									<ListItemSecondaryAction>
										<IconButton
											onClick={() => startEditing(item)}>
											<Edit />
										</IconButton>
										<IconButton
											onClick={() => deleteItem(item)}>
											<Delete />
										</IconButton>
									</ListItemSecondaryAction>
								</>
							)}
						</ListItem>
					))}
				</ScrollableList>
			</List>
		</Box>
	);
};

export default Checklist;
