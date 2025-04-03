import { Download, FileUploadOutlined, Visibility } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Box,
	Grid2 as Grid,
	Typography,
	Button,
	TextField,
	Avatar,
	styled,
	List,
	IconButton,
	Tooltip,
	Zoom,
	Stack,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Dialog,
	DialogContent,
} from "@mui/material";
import { FileType } from "@src/components";
import { useTaskActions } from "@src/store/sidemenu/task_management/tasks/tasks.action";
import { useTaskSelector } from "@src/store/sidemenu/task_management/tasks/tasks.slice";
import moment from "moment";
import React, { SyntheticEvent, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import {
	LuFile,
	LuLink,
	LuLoader,
	LuSendHorizonal,
	LuUpload,
	LuX,
} from "react-icons/lu";
import { v4 as uuidv4 } from "uuid";

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "300px",
	marginTop: "15px",
	marginBottom: "15px",
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

export const Comments = () => {
	const [newComment, setNewComment] = useState("");
	const [commentFiles, setCommentFiles] = useState<any[]>([]);
	const [selectedDoc, setSelectedDoc] = useState<any>();

	const {
		tasks: {
			comments,
			commentsCount,
			comment_params,
			comments_loading,
			selectedData,
		},
		system: { userAccessList },
	} = useTaskSelector();

	const id = selectedData?.id ? selectedData?.id : "";

	const {
		reducer: { },
		extraReducer: { getTaskComments, postTaskComments },
	} = useTaskActions();

	const hide = () => {
		setNewComment("");
		setCommentFiles([]);
	};
	const handleAdd = () => {
		const data = {
			task_id: id ? id : "",
			comment: newComment,
		};

		postTaskComments({
			data,
			files: commentFiles.map((e) => e.originalObj),
			params: {
				...comment_params,
				page: 1,
			},
			hide,
		});
		getTaskComments({
			...comment_params,
			task: id,
			search: "",
			page: 1,
			page_size: 10,
		});
	};

	useMemo(() => {
		getTaskComments({
			...comment_params,
			task: id,
			search: "",
			page: 1,
			page_size: 10,
		});
	}, []);

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

		const documents = [...(commentFiles || []), modifiedFiles[0]];

		// dispatch(setUploadDocument(documents));

		setCommentFiles(documents);
	};
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
			const filter = !file?.id
				? commentFiles?.filter((e) => e.uuid != file.uuid)
				: commentFiles?.map((e) =>
					e.id == file.id ? { ...e, dodelete: true } : e
				);
			setCommentFiles(filter);
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
				}} mt={1}>
				<Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
						<Typography sx={{ fontWeight: 600, color: "grey.700" }}>
							{fileName}
						</Typography>
						<Typography component={"p"} color={"grey.700"}>
							{file.formattedSize}
						</Typography>
					</Box>
				</Box>
				<IconButton sx={{ marginLeft: "auto", my: "auto" }}>
					<LuX size={18} onClick={() => handleDismiss()} />
				</IconButton>
			</Box>
		);
	};

	return (
		<>
			<Typography variant={"subtitle2"}>
				Comments ({commentsCount})
			</Typography>
			<Box sx={{ mt: "28px" }}>
				<ScrollableList
					onScroll={(e: SyntheticEvent) => {
						const { target } = e as any;

						if (
							Math.ceil(
								target?.scrollTop + target?.offsetHeight
							) == target?.scrollHeight
						) {
							if (
								comment_params.page < comment_params.no_of_pages
							) {
								getTaskComments({
									...comment_params,
									page: comment_params?.page + 1,
									page_size: 10,
								});
							}
						}
					}}>
					{comments &&
						comments.map((comment) => {
							return (
								<Box
									sx={{
										display: "flex",
										gap: "12px",
										mt: "20px",
									}}>
									<Avatar
										variant="circular"
										src={comment?.user?.fullname?.charAt(0)}
										sx={{ height: "32px", width: "32px" }}
									/>
									<Box width={"100%"}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
											}}>
											<Box>
												<Typography
													component={"h5"}
													sx={{
														mb: "8px",
														color: "grey.700",
														fontWeight: 500,
														fontSize: "13px",
													}}>
													{comment?.user?.fullname} (
													{comment?.user?.username})
												</Typography>
											</Box>
											<Typography
												component={"p"}
												sx={{
													color: "grey.700",
													fontSize: "10px",
													fontWeight: 500,
												}}>
												{comment?.created_on
													? moment(
														comment?.created_on
													)?.format("LLL")
													: "N/A"}
											</Typography>
										</Box>
										<Typography
											component={"p"}
											sx={{
												color: "grey.700",
												fontSize: "13px",
											}}>
											{comment.comment}
										</Typography>

										<Box sx={{ pl: 8 }}>
											{comment.attachments.length !==
												0 && (
													<Typography
														variant="subtitle2"
														sx={{ mb: 1 }}>
														Attachments:
													</Typography>
												)}
											{comment.attachments.length !==
												0 && (
													<Box
														sx={{
															display: "flex",
															flexWrap: "wrap",
															gap: 2,
														}}>
														{comment.attachments.map(
															(attachment, index) => (
																// <Card
																// 	key={index}
																// 	sx={{
																// 		maxWidth: 200,
																// 	}}>
																// 	<CardMedia
																// 		component="img"
																// 		height="140"
																// 		image={
																// 			attachment.preview
																// 		}
																// 		alt={
																// 			attachment.path
																// 		}
																// 	/>
																// 	<CardContent>
																// 		<Typography
																// 			variant="body2"
																// 			color="text.secondary"
																// 			noWrap>
																// 			{
																// 				attachment.path
																// 			}
																// 		</Typography>
																// 	</CardContent>
																// 	<CardActions>
																// 		<Typography
																// 			component="a"
																// 			href={
																// 				attachment.preview
																// 			}
																// 			target="_blank"
																// 			rel="noopener noreferrer">
																// 			<Visibility />
																// 		</Typography>
																// 		<Typography
																// 			component="a"
																// 			href={
																// 				attachment.file
																// 			}
																// 			download={
																// 				attachment.file
																// 			}>
																// 			<Download />
																// 		</Typography>
																// 	</CardActions>
																// </Card>

																<>
																	<Typography
																		key={index}
																		component={
																			"a"
																		}
																		target="_blank"
																		color="primary"
																		href={
																			attachment.preview
																		}
																		onClick={() =>
																			setSelectedDoc(
																				attachment
																			)
																		}
																		sx={{
																			cursor: "pointer",
																			textDecoration:
																				"none",
																			display:
																				"flex",
																			alignItems:
																				"center",
																			gap: 1,
																		}}>
																		<LuLink />{" "}
																		{
																			attachment?.path?.substring(0, attachment?.path?.lastIndexOf("."))
																		}
																	</Typography>

																	{/* <Dialog
																	fullWidth
																	maxWidth={
																		false
																	} // Removes default size constraints
																	open={
																		selectedDoc?.id ==
																		attachment?.id
																	}
																	onClose={() =>
																		setSelectedDoc(
																			{}
																		)
																	}>
																	{attachment?.path?.slice(
																		attachment?.path?.lastIndexOf(
																			"."
																		),
																		-1
																	) ==
																		"jpeg" && (
																		<img
																			src={
																				attachment?.preview
																			}
																			alt={
																				attachment?.path
																			}
																			style={{
																				maxWidth:
																					"100%",
																				maxHeight:
																					"100vh",
																			}}
																		/>
																	)}
																	<DialogContent
																		style={{
																			width: "100vw",
																			maxWidth:
																				"none",
																			padding: 0,
																		}}>
																		{attachment?.path?.slice(
																			attachment?.path?.lastIndexOf(
																				"."
																			),
																			-1
																		) ===
																		"pdf" ? (
																			<iframe
																				src={
																					attachment?.preview
																				}
																				title="File Preview"
																				style={{
																					width: "100%",
																					height: "80vh",
																					border: "none",
																				}}
																			/>
																		) : (
																			<Typography>
																				No
																				preview
																				available
																				for
																				this
																				file
																				type.
																			</Typography>
																		)}
																	</DialogContent>
																	<Button
																		onClick={() =>
																			setSelectedDoc(
																				{}
																			)
																		}
																		style={{
																			marginTop: 10,
																		}}>
																		Close
																	</Button>
																</Dialog> */}
																</>
															)
														)}
													</Box>
												)}
										</Box>

										{/* </ScrollableList> */}
									</Box>
								</Box>
							);
						})}

					{comments_loading && (
						<Box textAlign={"center"} mt={"12px"}>
							<Button
								size="small"
								color="error"
								sx={{
									"& > svg": {
										"@keyframes spin": {
											from: {
												transform: "rotate(0deg)",
											},
											to: {
												transform: "rotate(360deg)",
											},
										},
									},
								}}
								startIcon={
									<LuLoader
										size={16}
										style={{
											marginRight: "6px",
											animation:
												"spin 1.5s linear infinite",
										}}
									/>
								}>
								Load More
							</Button>
						</Box>
					)}
				</ScrollableList>
				<Box
					sx={{
						border: "1px solid divider",
						borderRadius: "5px",
						mt: "28px",
					}}>
					<Box mb={2}>
						<Dropzone
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
										{userAccessList?.indexOf("TaskManagement.add_taskcommentattachment") !== -1 && (
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
										)}
									</div>
								</Box>
							)}
						</Dropzone>

						{/* <IconButton sx={{ px: "8px" }}>
								<LuAtSign size={16} />
							</IconButton> */}
					</Box>
					<ScrollableList>
						{commentFiles?.length != 0 &&
							commentFiles?.map((document) => {
								return (
									document?.path && (
										<HorizontalFilePreview
											file={document}
										/>
									)
								);
							})}
					</ScrollableList>
					<TextField
						id="outlined-multiline-static"
						placeholder="Your Comment..."
						rows={3}
						multiline
						fullWidth
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
					/>
					{userAccessList?.indexOf("TaskManagement.add_taskcomment") !== -1 && (
						<Stack direction="row" justifyContent="flex-end" mt={1}>
							<LoadingButton
								loading={comments_loading}
								variant="contained"
								startIcon={<LuSendHorizonal size={16} />}
								onClick={handleAdd}
								disabled={!newComment}
								size="medium"
								color="secondary">
								Submit
							</LoadingButton>
						</Stack>
					)}
				</Box>
			</Box>
		</>
	);
};
