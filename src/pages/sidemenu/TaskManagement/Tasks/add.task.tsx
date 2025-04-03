import { yupResolver } from "@hookform/resolvers/yup";
import { FileUploadOutlined } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Grid2 as Grid,
	Stack,
	styled,
	List,
	Box,
	Avatar,
	Typography,
} from "@mui/material";
import {
	CustomDatepicker,
	FileType,
	FormInput,
	HorizontalFilePreview,
} from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import {
	getMiniMileStones,
	getMiniProjectGroups,
	getMiniProjectGroupUsers,
	getMiniUsers,
	getMiniUserTypes,
} from "@src/store/mini/mini.Action";
import {
	clearMiniMilestones,
	clearMiniProjectGroups,
	clearMiniUsers,
	clearMiniUserTypes,
} from "@src/store/mini/mini.Slice";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import { useTaskActions } from "@src/store/sidemenu/task_management/tasks/tasks.action";
import {
	selectTasks,
	useTaskSelector,
} from "@src/store/sidemenu/task_management/tasks/tasks.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import { SyntheticEvent, useEffect } from "react";
import Dropzone from "react-dropzone";
import { useForm, useWatch } from "react-hook-form";
import { LuFile, LuX } from "react-icons/lu";
import { useLocation, useParams } from "react-router-dom";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";

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

const AddTask = () => {
	const {
		tasks: { modal, selectedData, pageParams, task_attachments },
		system: { userAccessList },
		mini: {
			miniProjectGroups,
			miniMileStones,
			miniUserList,
			miniUserLoading,
			miniUserParams,
		},
	} = useAppSelector((state) => selectTasks(state));

	const dispatch = useAppDispatch();

	const location = useLocation();

	const { id, tab } = useParams();

	const {
		reducer: { isModalOpen, setSelectedData, setUploadDocument },
		extraReducer: { postTaskData, editTaskData },
	} = useTaskActions();

	const clearData = () => {
		setSelectedData(null);
		reset({
			startdate: "",
			duedate: "",
			subject: "",
			description: "",
			remarks: "",
			group: null,
			priority: null,
			milestone: null,
		});
	};

	useEffect(() => {
		!selectedData?.id && clearData();
	}, [selectedData]);

	const priority_options: { id: string | number; name: string }[] = [
		{
			name: "Low",
			id: 1,
		},
		{
			name: "Moderate",
			id: 2,
		},
		{
			name: "Urgent",
			id: 3,
		},
		{
			name: "Very Urgent",
			id: 4,
		},
	];

	const TaskSchema = yup.object().shape({
		// user: yup
		// 	.object({
		// 		label: yup.string().required("Please select a user"),
		// 		value: yup.string().required("Please select a user"),
		// 	})
		// 	.required("Please select a user to assign")
		// 	.nullable(),
		subject: yup.string().required("Please select a subject"),
		// group: yup
		// 	.object({
		// 		label: yup.string().required("Please select a group"),
		// 		value: yup.string().required("Please select a group"),
		// 	})
		// 	.nullable()
		// 	.when(`${id}`, (id, schema) => {
		// 		return schema.deps[0] &&
		// 			schema.deps[0] !== "undefined" &&
		// 			schema.deps[0] !== "0"
		// 			? schema.required("Please select a group to assign")
		// 			: schema.optional();
		// 	}),
		users: yup
			.array()
			.of(
				yup.object({
					label: yup.string().required("Please select a user"),
					value: yup.string().required("Please select a user"),
				})
			)
			.when("id", (id, schema) => {
				return id[0] == "undefined"
					? schema.optional()
					: schema.required("Please select a user");
			}),
		milestone: yup
			.object({
				label: yup.string().optional(),
				value: yup.string().optional(),
			})
			.optional()
			.nullable(),
		priority: yup
			.object({
				label: yup.string().required("Please select a priority"),
				value: yup.number().required("Please select a priority"),
			})
			.required("Please select a priority")
			.nullable(),
		startdate: yup.string().required("Please select a start date"),
		duedate: yup
			.date()
			.transform((curr, orig) => (orig === "" ? null : new Date(curr)))
			.test(
				"expiry-date-validation",
				"Due date cannot be earlier than the start date",
				function (value) {
					const { startdate } = this.parent;
					if (!value || !startdate) return true;
					const issueTimestamp = new Date(startdate).getTime();
					const expiryTimestamp = new Date(value).getTime();

					return expiryTimestamp >= issueTimestamp;
				}
			)
			.required("Please select a due date"),
		// duedate: yup.string().required("Please select a due date"),
		description: yup.string().required("Please select a description"),
		remarks: yup.string().required("Please select a remarks"),
	});

	const {
		control,
		handleSubmit,
		reset,
		getValues,
		setValue,
		// formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(TaskSchema),
		values: {
			// user: selectedData?.user?.id
			// 	? {
			// 			label: selectedData?.user?.fullname,
			// 			value: selectedData?.user?.id,
			// 		}
			// 	: null,
			// group: selectedData?.group?.id
			// 	? {
			// 			label: selectedData?.group?.name,
			// 			value: selectedData?.group?.id,
			// 		}
			// 	: null,
			users:
				selectedData?.users?.map((e: any) => ({
					label: e?.fullname,
					value: e?.id,
				})) || [],

			milestone: selectedData?.milestone?.id
				? {
						label: selectedData?.milestone?.name,
						value: selectedData?.milestone?.id,
					}
				: null,
			priority: selectedData?.priority
				? {
						label: selectedData?.priority_name,
						value: selectedData?.priority,
					}
				: null,
			startdate: selectedData?.startdate
				? moment(
						selectedData?.startdate,
						"YYYY-MM-DD hh:mm a"
					).toISOString()
				: "",
			duedate: selectedData?.duedate
				? moment(
						selectedData?.duedate,
						"YYYY-MM-DD hh:mm a"
					).toISOString()
				: "",
			description: selectedData?.description,
			subject: selectedData?.subject,
			remarks: selectedData?.remarks,
		},
	});

	const getValuesStartDate = getValues("startdate");
	const getValuesGroup = getValues("group");

	const hide = () => {
		isModalOpen(false);
		clearData();
		reset();
	};

	const handleAdd = (payload: {
		group: {
			label: string;
			value: string;
		} | null;
		users:
			| {
					label: string;
					value: string;
			  }[]
			| null;
		priority: {
			label: string;
			value: number;
		} | null;
		milestone: {
			label: string;
			value: string;
		} | null;
		startdate: string;
		duedate: string;
		subject: string;
		description: string;
		remarks: string;
	}) => {
		let model_path = "TaskManagement.task";
		const documents = task_attachments?.length
			? task_attachments.filter((item) => item?.path)
			: [];
		const data = {
			project_id: id ? id : "",
			subject: payload?.subject ? payload?.subject : "",
			// group_id: payload?.group?.value ? payload?.group?.value : "",
			users_ids: payload?.users
				? payload?.users?.map((e) => e.value)
				: [],
			priority: payload?.priority?.value,
			description: payload?.description ? payload?.description : "",
			remarks: payload?.remarks ? payload?.remarks : "",
			milestone_id: payload?.milestone?.value
				? payload?.milestone?.value
				: "",
			startdate: payload?.startdate
				? moment(payload.startdate).toISOString()
				: "",
			duedate: payload?.duedate
				? moment(payload.duedate).toISOString()
				: "",
			type: id ? 1 : 2,
		};

		!selectedData?.id
			? postTaskData({
					data,
					hide,
					params: pageParams,
					documents,
					model_path,
				})
			: editTaskData({
					id: selectedData?.id ? selectedData?.id : "",
					data,
					hide,
					params: pageParams,
					documents,
				});
	};

	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

		/**
		 * Formats the size
		 */
		const formatBytes = (bytes: number, decimals: number = 2) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = [
				"Bytes",
				"KB",
				"MB",
				"GB",
				"TB",
				"PB",
				"EB",
				"ZB",
				"YB",
			];

			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return (
				parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
				" " +
				sizes[i]
			);
		};

		// Creating a new array with the modified files
		const modifiedFiles = files.map((file) =>
			Object.assign({}, file, {
				originalObj: file,
				uuid: uuidv4(),
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);

		const documents = [...(task_attachments || []), modifiedFiles[0]];

		setUploadDocument(documents);
	};

	const watchedStartDate = useWatch({ control, name: "startdate" });

	return (
		<Dialog
			open={modal}
			onClose={() => {
				hide();
			}}
			// sx={{
			// 	"& .MuiDialog-paper": {
			// 		width: "800px",
			// 	},
			// }}
			fullWidth
			maxWidth="lg"
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
				{selectedData?.id == undefined ? "Add Task" : "Edit Task"}
				<IconButton
					onClick={() => {
						hide();
					}}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
				<DialogContentText id="alert-dialog-description">
					<form style={{ width: "100%" }}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12 }}>
								<FormInput
									control={control}
									name={`subject`}
									label="Subject"
									type="text"
									placeholder="Enter subject here..."
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack width={"100%"}>
									<CustomDatepicker
										control={control}
										name="startdate"
										hideAddon
										minDate={new Date()}
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										inputClass="form-input"
										label={"Start Date"}
										tI={1}
									/>
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack width={"100%"}>
									<CustomDatepicker
										control={control}
										name="duedate"
										hideAddon
										minDate={moment(
											getValuesStartDate,
											"DD-MM-YYYY"
										).toDate()}
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										inputClass="form-input"
										label={"Due Date"}
										tI={1}
									/>
								</Stack>
							</Grid>
							{id ? (
								<>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="group"
											label="Group"
											multiple={false}
											control={control}
											rules={{ required: true }}
											options={miniProjectGroups?.list?.map(
												(e: {
													id: string | number;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniProjectGroups?.loading}
											selectParams={{
												page: miniProjectGroups
													?.miniParams?.page,
												page_size:
													miniProjectGroups
														?.miniParams?.page_size,
												search: miniProjectGroups
													?.miniParams?.search,
												no_of_pages:
													miniProjectGroups
														?.miniParams
														?.no_of_pages,
												project: id ? id : "",
											}}
											hasMore={
												miniProjectGroups?.miniParams
													?.page <
												miniProjectGroups?.miniParams
													?.no_of_pages
											}
											fetchapi={getMiniProjectGroups}
											clearData={clearMiniProjectGroups}
											onChange={async (projectGroup) => {
												const a = await dispatch(
													getMiniProjectGroupUsers({
														page: miniUserParams?.page,
														page_size:
															miniUserParams?.page_size,
														search: miniProjectGroups
															?.miniParams
															?.search,
														no_of_pages:
															miniUserParams?.no_of_pages,
														project_id: id
															? id
															: "",
														group_id:
															projectGroup?.value ||
															"",
													})
												).unwrap();

												console.log(a);
												setValue(
													"users",
													a.response.results?.map(
														(e: any) => ({
															label: e?.user
																?.fullname,
															value: e?.user?.id,
														})
													)
												);
											}}
										/>
									</Grid>
									{/* <Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="users"
											label="Users"
											multiple={true}
											control={control}
											rules={{ required: true }}
											options={miniUserList?.map(
												(e: {
													user: {
														id: string | number;
														fullname: string;
													};
												}) => ({
													id: e?.user?.id,
													name: e?.user?.fullname,
												})
											)}
											disabled={!getValuesGroup?.value}
											helperText={
												getValuesGroup?.value
													? ""
													: "Please select a group"
											}
											loading={miniUserLoading}
											selectParams={{
												page: miniUserParams?.page,
												page_size:
													miniUserParams?.page_size,
												search: miniProjectGroups
													?.miniParams?.search,
												no_of_pages:
													miniUserParams?.no_of_pages,
												project_id: id ? id : "",
												group_id:
													getValuesGroup?.value || "",
											}}
											hasMore={
												miniUserParams?.page <
												miniUserParams?.no_of_pages
											}
											fetchapi={getMiniProjectGroupUsers}
											clearData={clearMiniUsers}
										/>
									</Grid> */}
								</>
							) : (
								<Grid size={{ xs: 12, md: 6 }}>
									<SelectComponent
										name="users"
										label="Users"
										multiple={true}
										control={control}
										rules={{ required: true }}
										options={miniUserList?.map(
											(e: {
												id: string | number;
												fullname: string;
											}) => ({
												id: e.id,
												name: e.fullname,
											})
										)}
										loading={miniUserLoading}
										selectParams={{
											page: miniUserParams?.page,
											page_size:
												miniUserParams?.page_size,
											search: miniProjectGroups
												?.miniParams?.search,
											no_of_pages:
												miniUserParams?.no_of_pages,
											project: id ? id : "",
										}}
										hasMore={
											miniUserParams?.page <
											miniUserParams?.no_of_pages
										}
										fetchapi={getMiniUsers}
										clearData={clearMiniUsers}
									/>
								</Grid>
							)}
							{id && (
								<Grid size={{ xs: 12, md: 6 }}>
									<SelectComponent
										name="milestone"
										label="Mile Stones"
										multiple={false}
										control={control}
										rules={{ required: true }}
										options={miniMileStones?.list?.map(
											(e: {
												id: string | number;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										loading={miniMileStones?.loading}
										selectParams={{
											page: miniMileStones?.miniParams
												?.page,
											page_size:
												miniMileStones?.miniParams
													?.page_size,
											search: miniMileStones?.miniParams
												?.search,
											no_of_pages:
												miniMileStones?.miniParams
													?.no_of_pages,
											project: id ? id : "",
										}}
										hasMore={
											miniMileStones?.miniParams?.page <
											miniMileStones?.miniParams
												?.no_of_pages
										}
										fetchapi={getMiniMileStones}
										clearData={clearMiniMilestones}
									/>
								</Grid>
							)}
							{/* <Grid size={{ xs: 12, md: 6 }}>
								<SelectComponent
									name="user"
									label="User"
									multiple={false}
									control={control}
									rules={{ required: true }}
									options={miniUserList.map(
										(e: {
											id: string | number;
											fullname: string;
										}) => ({
											id: e.id,
											name: e.fullname,
										})
									)}
									loading={miniUserLoading}
									selectParams={{
										page: miniUserParams.page,
										page_size: miniUserParams.page_size,
										search: miniUserParams.search,
										no_of_pages: miniUserParams.no_of_pages,
									}}
									hasMore={
										miniUserParams.page <
										miniUserParams.no_of_pages
									}
									fetchapi={getMiniUsers}
									clearData={clearMiniUsers}
								/>
							</Grid> */}
							<Grid size={{ xs: 12, md: 6 }}>
								<SelectComponent
									name="priority"
									label="Priority"
									multiple={false}
									control={control}
									rules={{ required: true }}
									options={priority_options}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2} mt={2}>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextArea
									name="description"
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
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextArea
									name="remarks"
									label="Remarks"
									type="text"
									placeholder="Write remarks here..."
									minRows={3}
									maxRows={5}
									containerSx={{
										display: "grid",
										gap: 1,
									}}
									control={control}
								/>
							</Grid>
							<Dropzone
								onDrop={(acceptedFiles) => {
									handleAcceptedFiles(
										acceptedFiles,
										() => {}
									);
								}}>
								{({ getRootProps, getInputProps }) => (
									<Box>
										<Box className="fallback">
											<input
												{...getInputProps()}
												name="file"
												type="file"
												multiple
											/>
										</Box>
										<div
											className="dz-message needsclick"
											{...getRootProps()}>
											<Button
												variant="contained"
												startIcon={
													<FileUploadOutlined />
												}
												sx={{
													bgcolor: "purple",
													"&:hover": {
														bgcolor: "darkviolet",
													},
													fontWeight: 600,
													textTransform: "none",
												}}>
												Select File
											</Button>
										</div>
									</Box>
								)}
							</Dropzone>
							<Grid size={{ xs: 12 }}>
								<ScrollableList>
									{task_attachments?.length != 0 &&
										task_attachments
											?.filter((e) => !e.dodelete)
											?.map((document) => {
												return (
													document?.preview && (
														<HorizontalFilePreview
															file={document}
															attachments={
																task_attachments
															}
															setAttachments={(
																documents
															) => {
																setUploadDocument(
																	documents
																);
															}}
														/>
													)
												);
											})}
								</ScrollableList>
							</Grid>
						</Grid>
					</form>
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button
					onClick={() => hide()}
					variant="outlined"
					color="secondary">
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit(handleAdd as any, (error) => {
						console.log("errors", error);
					})}
					color="primary"
					autoFocus>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddTask;
