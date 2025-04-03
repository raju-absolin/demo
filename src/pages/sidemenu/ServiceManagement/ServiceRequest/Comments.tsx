import { Download, Visibility } from "@mui/icons-material";
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
import {
	getServiceRequestComments,
	postServiceRequestComments,
} from "@src/store/sidemenu/service_management/ServiceRequestComments/serviceRequestComments.action";
import {
	clearServiceRequestComments,
	useServiceRequestCommentSelector,
} from "@src/store/sidemenu/service_management/ServiceRequestComments/serviceRequestComments.slice";
import { useAppDispatch } from "@src/store/store";
import moment from "moment";
import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import {
	LuFile,
	LuLink,
	LuLoader,
	LuSendHorizonal,
	LuUpload,
	LuX,
} from "react-icons/lu";

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

export const Comments = () => {
	const [newComment, setNewComment] = useState("");
	const dispatch = useAppDispatch();

	const {
		serviceRequestComment: {
			comments,
			commentsCount,
			comment_params,
			comments_loading,
		},
		serviceRequest: { selectedData },
		system: { userAccessList },
	} = useServiceRequestCommentSelector();

	const id = selectedData?.id ? selectedData?.id : "";

	const hide = () => {
		setNewComment("");
	};
	const handleAdd = () => {
		const data = {
			service_request_id: id ? id : "",
			comment: newComment,
		};

		dispatch(
			postServiceRequestComments({
				data,
				params: {
					...comment_params,
					page: 1,
				},
				hide,
			})
		);
	};

	useEffect(() => {
		dispatch(
			getServiceRequestComments({
				...comment_params,
				service_request: id,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
	}, []);

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
								dispatch(
									getServiceRequestComments({
										...comment_params,
										page: comment_params?.page + 1,
										page_size: 10,
									})
								);
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
										src={comment?.created_by?.fullname?.charAt(
											0
										)}
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
													{
														comment?.created_by
															?.fullname
													}{" "}
													(
													{
														comment?.created_by
															?.username
													}
													)
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
															comment?.created_on,
															"DD-MM-YYYY hh:mm a"
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
					<TextField
						id="outlined-multiline-static"
						placeholder="Your Comment..."
						rows={3}
						multiline
						fullWidth
						value={newComment}
						onChange={(e) => setNewComment(e.target.value?.trim())}
					/>
					<Box
						sx={{
							p: "8px",
							// bgcolor: "grey.100",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
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
					</Box>
				</Box>
			</Box>
		</>
	);
};
