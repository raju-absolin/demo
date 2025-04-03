import { yupResolver } from "@hookform/resolvers/yup";
import {
	Avatar,
	Box,
	Button,
	Card,
	IconButton,
	List,
	TextField,
	Typography,
	styled,
} from "@mui/material";
//images
import avatar3 from "@src/assets/images/users/avatar-3.jpg";
import avatar4 from "@src/assets/images/users/avatar-4.jpg";
import TextArea from "@src/components/form/TextArea";
import {
	getComments,
	postComment,
} from "@src/store/sidemenu/tender_mangement/comments/commets.action";
import { selectComments } from "@src/store/sidemenu/tender_mangement/comments/commets.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { SyntheticEvent, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
	LuAtSign,
	LuLoader,
	LuReply,
	LuSendHorizonal,
	LuUpload,
} from "react-icons/lu";
import { useParams } from "react-router-dom";
import * as yup from "yup";

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
		comments: { commentsList, pageParams, commentsCount, loading },
	} = useAppSelector((state) => selectComments(state));

	const hide = () => {
		reset();
	};
	// add item form
	const commentsSchema = yup.object().shape({
		comment: yup
			.string()
			.trim("Comment cannot be empty")
			.required("Please enter a text"),
	});

	const { control, handleSubmit, getValues, reset } = useForm<any>({
		resolver: yupResolver(commentsSchema),
	});

	const getValuesComment = getValues("comment");

	const handleAdd = (payload: { comment: string }) => {
		const data = {
			tender_id: id,
			comment: payload.comment,
		};

		dispatch(
			postComment({
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
				tender: id,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
	}, []);

	const comment_container = useMemo(() => {
		return (
			<TextArea
				name="comment"
				label=""
				type="text"
				placeholder="Write comment here..."
				minRows={3}
				maxRows={5}
				containerSx={{
					display: "grid",
					gap: 1,
				}}
				control={control}
			/>
		);
	}, []);

	return (
		<>
			<Typography component={"h4"}>Comments ({commentsCount})</Typography>
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
					{commentsList &&
						commentsList.map((comment) => {
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
					<form onSubmit={handleSubmit(handleAdd)}>
						{comment_container}
						<Box mt={2} textAlign={"end"}>
							<Button
								type="submit"
								variant="contained"
								startIcon={<LuSendHorizonal size={16} />}
								// disabled={!getValuesComment}
								// onSubmit={handleSubmit(handleAdd)}
								size="medium"
								color="secondary">
								Submit
							</Button>
						</Box>
					</form>
				</Box>
			</Box>
		</>
	);
};

export default Comments;
