import React, {
	SyntheticEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	Avatar,
	Button,
	TextField,
	Card,
	CardHeader,
	CardContent,
	IconButton,
	Typography,
	List,
	ListItem,
	Box,
	CircularProgress,
	styled,
	useTheme,
} from "@mui/material";
import { Delete as DeleteIcon, Reply as ReplyIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	selectbq_comments,
	setPageParams,
	setSelectedData,
} from "@src/store/sidemenu/strategic_management/leads_comments/bq_comments.slice";
import {
	postCommentData,
	getComments,
} from "@src/store/sidemenu/strategic_management/leads_comments/bq_comments.action";

import { useParams } from "react-router-dom";
import { Comment as CommentTypes } from "@src/store/sidemenu/strategic_management/leads_comments/bq_comments.types";
import { LuLoader, LuSendHorizonal } from "react-icons/lu";

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

const Comments = () => {
	const [newComment, setNewComment] = useState("");
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		bq_comments: { bq_commentList, pageParams, bq_commentCount, loading },
	} = useAppSelector((state) => selectbq_comments(state));

	const hide = () => {
		setNewComment("");
	};
	const handleAdd = () => {
		const data = {
			lead_id: id ? id : "",
			comment: newComment,
		};

		dispatch(
			postCommentData({
				data,
				params: pageParams,
				hide,
			})
		);
	};

	useMemo(() => {
		dispatch(
			getComments({
				...pageParams,
				lead: id,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
	}, []);

	return (
		<>
			<Typography component={"h4"}>
				Comments ({bq_commentCount})
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
							if (pageParams.page < pageParams.no_of_pages) {
								dispatch(
									getComments({
										...pageParams,
										page: pageParams?.page + 1,
										page_size: 10,
									})
								);
							}
						}
					}}>
					{bq_commentList &&
						bq_commentList.map((comment) => {
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
												{comment?.created_on?.toLocaleString()}
											</Typography>
										</Box>
										<Typography
											component={"p"}
											sx={{
												color: "grey.600",
												fontSize: "13px",
											}}>
											{comment.comment}
										</Typography>
									</Box>
								</Box>
							);
						})}

					{loading && (
						<Box textAlign={"center"} mt={"12px"}>
							<Button
								size="small"
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
						onChange={(e) => setNewComment(e.target.value)}
					/>
					<Box
						sx={{
							p: "8px",
							// bgcolor: "grey.100",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<Box>
							{/* <IconButton sx={{ px: "8px", mr: "12px" }}>
                    <LuUpload size={16} />
                </IconButton>
                <IconButton sx={{ px: "8px" }}>
                    <LuAtSign size={16} />
                </IconButton> */}
						</Box>
						<Button
							variant="contained"
							startIcon={<LuSendHorizonal size={16} />}
							onClick={handleAdd}
							disabled={!newComment}
							size="medium"
							color="secondary">
							Submit
						</Button>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default Comments;
