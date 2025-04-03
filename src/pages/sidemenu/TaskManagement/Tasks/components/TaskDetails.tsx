import {
	CalendarMonthOutlined,
	FileUploadOutlined,
	InfoOutlined,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Box,
	Chip,
	Grid2 as Grid,
	IconButton,
	Typography,
	Button,
	List,
	styled,
	Avatar,
	Divider,
	Tooltip,
	Zoom,
} from "@mui/material";
import { FileType } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import { miniType } from "@src/store/mini/mini.Types";
import { useTaskActions } from "@src/store/sidemenu/task_management/tasks/tasks.action";
import { useTaskSelector } from "@src/store/sidemenu/task_management/tasks/tasks.slice";
import { Task } from "@src/store/sidemenu/task_management/tasks/tasks.types";
import moment from "moment";
import React, { SyntheticEvent, useEffect } from "react";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { LuFile, LuX } from "react-icons/lu";
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
const HorizontalFilePreview = ({ file }: { file: any }) => {
	const {
		reducer: { setSelectedData },
		extraReducer: {
			editTaskData,
			postTaskAttachment,
			deleteTaskAttachment,
		},
	} = useTaskActions();

	const {
		tasks: { task_attachment_params },
	} = useTaskSelector();

	function handleDismiss() {
		deleteTaskAttachment({
			id: file.id ? file.id : "",
			params: task_attachment_params,
		});
	}
	let fileName = "";
	if (!file?.path) return "";

	const dotIndex = file?.path.lastIndexOf(".");
	const baseName =
		dotIndex > 0 ? file?.path?.substring(0, dotIndex) : file?.path;

	fileName =
		baseName.length > 15 ? baseName.substring(0, 15) + "..." : baseName;
	return (
		<Box
			id={file.name}
			sx={{
				border: "1px solid",
				borderColor: "divider",
				borderRadius: "6px",
				p: "12px",
				display: "flex",
			}}
			mt={1}>
			<Box
				sx={{ display: "flex", alignItems: "center", gap: "12px" }}
				onClick={() => {
					window.open(file.preview);
				}}>
				{file.preview ? (
					<Avatar
						variant="rounded"
						sx={{
							height: "48px",
							width: "48px",
							bgcolor: "grey",
							objectFit: "cover",
						}}
						alt={file.path}
						src={file.preview}
					/>
				) : (
					<Typography
						component={"span"}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "primary.main",
							fontWeight: 600,
							borderRadius: "6px",
							height: "48px",
							width: "48px",
							bgcolor: "#3e60d51a",
						}}>
						<LuFile />
					</Typography>
				)}
				<Box>
					<Typography
						sx={{ fontWeight: 600, color: "grey.700" }}
						variant="subtitle2">
						{fileName}
					</Typography>
					<Typography component={"p"} color={"grey.700"}>
						{file.formattedSize}
					</Typography>
				</Box>
			</Box>
			{/* <IconButton sx={{ marginLeft: "auto", my: "auto" }}>
				<LuX size={18} onClick={() => handleDismiss()} />
			</IconButton> */}
		</Box>
	);
};

export const TaskDetails = () => {
	const { id } = useParams();
	const {
		tasks: {
			selectedData,
			pageParams,
			task_attachments,
			task_attachments_count,
			task_attachment_params,
			task_attachments_loading,
		},
		system: { userAccessList },
	} = useTaskSelector();

	const {
		reducer: { setSelectedData },
		extraReducer: { editTaskData, postTaskAttachment, getTaskAttachments },
	} = useTaskActions();

	const status_options: {
		id: string | number;
		name: string;
	}[] = [
		{
			name: "Pending",
			id: 1,
		},
		{
			name: "In Progress",
			id: 2,
		},
		{
			name: "Completed",
			id: 3,
		},
		{
			name: "Closed",
			id: 4,
		},
		{
			name: "Reopen",
			id: 5,
		},
	];

	const { control, handleSubmit, reset, getValues, setValue } = useForm({});

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

		// // Creating a new array with the modified files
		// const modifiedFiles = files.map((file) =>
		// 	Object.assign({}, file, {
		// 		originalObj: file,
		// 		preview:URL.createObjectURL(file),
		// 		formattedSize: formatBytes(file.size),
		// 	})
		// );

		postTaskAttachment({
			data: {
				task_id: selectedData?.id ? selectedData?.id : "",
				file: files[0],
			},
			params: task_attachment_params,
		});

		// const documents = [...(uploadDocuments || []), modifiedFiles[0]];

		// dispatch(setUploadDocument(documents));
	};

	useEffect(() => {
		if (selectedData) {
			getTaskAttachments({
				...task_attachment_params,
				page: 1,
				page_size: 10,
				task: selectedData?.id ? selectedData?.id : "",
			});

			setValue("status", {
				label: selectedData.status_name,
				value: selectedData.status,
			});
		}
	}, [selectedData]);

	return (
		<Box
			sx={{
				p: 2,
				border: "1px solid #e0e0e0",
				borderRadius: 2,
				boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
				bgcolor: "#fff",
			}}>
			{/* Task Info Section */}
			<Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
				Task Info
			</Typography>
			<Typography
				variant="body2"
				sx={{ display: "flex", alignItems: "center" }}>
				<strong>Created By:</strong>{" "}
				{selectedData?.created_by?.fullname} (
				{selectedData?.created_by?.fullname})
			</Typography>
			{selectedData?.modified_by?.fullname && (
				<Typography
					variant="body2"
					sx={{ display: "flex", alignItems: "center" }}>
					<strong>Modified By:</strong>{" "}
					{selectedData?.modified_by?.fullname} (
					{selectedData?.modified_by?.username})
					<InfoOutlined
						fontSize="small"
						sx={{ ml: 0.5, color: "gray" }}
					/>
				</Typography>
			)}
			<Divider sx={{ my: 2 }} />

			{/* Status */}
			<Box sx={{ mb: 2 }}>
				<Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
					Status:
				</Typography>

				<SelectComponent
					name={`status`}
					label=""
					placeholder="Select Status"
					control={control}
					rules={{ required: true }}
					options={status_options}
					onChange={(value) => {
						const data = {
							project_id: id ? id : "",
							subject: selectedData?.subject
								? selectedData?.subject
								: "",
							group_id: selectedData?.group?.id
								? selectedData?.group?.id
								: "",
							users_ids: selectedData?.users
								? (selectedData?.users?.map((e) =>
										e.id?.toString()
									) as string[])
								: [],
							priority: selectedData?.priority,
							description: selectedData?.description
								? selectedData?.description
								: "",
							remarks: selectedData?.remarks
								? selectedData?.remarks
								: "",
							milestone_id: selectedData?.milestone?.id
								? selectedData?.milestone?.id
								: "",
							startdate: selectedData?.startdate
								? moment(selectedData.startdate).toISOString()
								: "",
							duedate: selectedData?.duedate
								? moment(selectedData.duedate).toISOString()
								: "",
							type: id ? 1 : 2,
							status: value.value,
						};

						editTaskData({
							id: selectedData?.id ? selectedData?.id : "",
							data,
							hide: () => {
								setSelectedData({
									...(selectedData || {}),
									status: value.value,
									status_name: value.label,
								} as Task);
							},
							params: pageParams,
							documents: [],
						});
					}}
				/>
			</Box>

			{/* Dates */}
			<Box
				sx={{
					display: {
						sm: "block",
						xl: "flex",
					},
					justifyContent: "space-between",
					mb: 2,
				}}>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<CalendarMonthOutlined
						fontSize="small"
						sx={{ mr: 1, color: "gray" }}
					/>
					<Typography variant="body2">
						Start Date:{" "}
						{selectedData?.startdate
							? moment(selectedData?.startdate).format(
									"DD-MM-YYYY"
								)
							: "N/A"}
					</Typography>
				</Box>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<CalendarMonthOutlined
						fontSize="small"
						sx={{ mr: 1, color: "gray" }}
					/>
					<Typography variant="body2">
						Due Date: {""}
						{selectedData?.duedate
							? moment(selectedData?.duedate).format("DD-MM-YYYY")
							: "N/A"}
					</Typography>
				</Box>
			</Box>

			{/* Priority */}
			<Box sx={{ mb: 2 }}>
				<Typography variant="body2" sx={{ fontWeight: 600 }}>
					Priority:{" "}
					<>
						<span>
							{!selectedData?.priority ? (
								"None"
							) : (
								<Chip
									label={
										<Typography>
											{selectedData?.priority_name}
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
										switch (selectedData?.priority) {
											case 1:
												tagColor = "warning";
												break;
											case 2:
												tagColor = "success"; // MUI does not have 'blue', using 'info' instead
												break;
											case 3:
												tagColor = "error";
												break;
											case 4:
												tagColor = "success";
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
				</Typography>
			</Box>

			{/* Task Type */}
			{id ? (
				<Box sx={{ mb: 2 }}>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						Group: {selectedData?.group?.name}
					</Typography>
				</Box>
			) : (
				<Box sx={{ mb: 2 }}>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						Users:{" "}
						<Grid container spacing={1}>
							{selectedData?.users?.length !== 0
								? selectedData?.users?.map((e) => (
										<Grid>
											<Tooltip
												TransitionComponent={Zoom}
												title={`Username: ${e?.username}`}>
												<Chip
													label={
														<Typography>
															{e.fullname}
														</Typography>
													}
												/>
											</Tooltip>
										</Grid>
									))
								: "No Assignees"}
						</Grid>
					</Typography>
				</Box>
			)}
			{id && (
				<Box sx={{ mb: 2 }}>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						Mile Stone: {selectedData?.milestone?.name}
					</Typography>
				</Box>
			)}

			{/* Assignees */}
			{/* <Box sx={{ mb: 2 }}>
				<Typography variant="body2" sx={{ fontWeight: 600 }}>
					Assignees: {selectedData?.created_by?.fullname} -{" "}
					{selectedData?.created_by?.fullname}
				</Typography>
			</Box> */}

			{/* File Upload */}

			{/* <Dropzone
				onDrop={(acceptedFiles) => {
					handleAcceptedFiles(acceptedFiles, () => { });
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
								startIcon={<FileUploadOutlined />}
								sx={{
									bgcolor: "purple",
									"&:hover": { bgcolor: "darkviolet" },
									fontWeight: 600,
									textTransform: "none",
								}}>
								Select File
							</Button>
						</div>
					</Box>
				)}
			</Dropzone> */}

			<ScrollableList
				onScroll={(e: SyntheticEvent) => {
					const { target } = e as any;

					if (
						Math.ceil(target?.scrollTop + target?.offsetHeight) ==
						target?.scrollHeight
					) {
						if (
							task_attachment_params.page <
							task_attachment_params.no_of_pages
						) {
							getTaskAttachments({
								...task_attachment_params,
								page: task_attachment_params?.page + 1,
								page_size: 10,
							});
						}
					}
				}}>
				{task_attachments?.length != 0 &&
					task_attachments?.map((document) => {
						return (
							document?.path && (
								<HorizontalFilePreview file={document} />
							)
						);
					})}
			</ScrollableList>
		</Box>
	);
};
