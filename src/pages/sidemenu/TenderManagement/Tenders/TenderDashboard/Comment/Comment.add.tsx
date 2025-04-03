import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid2 as Grid,
	IconButton,
} from "@mui/material";
import TextArea from "@src/components/form/TextArea";
import {
	editComment,
	postComment,
} from "@src/store/sidemenu/tender_mangement/comments/commets.action";
import {
	selectComments,
	setComment,
	openCommentModal,
} from "@src/store/sidemenu/tender_mangement/comments/commets.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import * as yup from "yup";

interface Props {
	id: string;
}

const AddComment = ({ id }: Props) => {
	const dispatch = useAppDispatch();
	const {
		comments: { comment, commentModal, pageParams, selectedData },
	} = useAppSelector((state) => selectComments(state));

	const commentSchema = yup.object().shape({
		comment: yup.string().required("Please enter your comment"),
	});

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(commentSchema),
		values: {
			comment: comment ? comment : "",
		},
	});

	const hide = () => {
		reset();
		dispatch(setComment(""));
		dispatch(openCommentModal(false));
	};

	const handleAdd = (values: { comment: string }) => {
		const data = {
			tender_id: id,
			comment: values.comment,
		};

		!selectedData?.id
			? dispatch(
					postComment({
						data,
						params: pageParams,
						hide,
					})
				)
			: dispatch(
					editComment({
						id: selectedData.id,
						data,
						params: pageParams,
						hide,
					})
				);
	};

	const comment_container = useMemo(() => {
		return (
			<Box>
				<form style={{ width: "100%" }}>
					<Box>
						<Grid container spacing={3}>
							<Grid size={{ xs: 12 }}>
								<TextArea
									required
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
							</Grid>
						</Grid>
					</Box>
				</form>
			</Box>
		);
	}, []);
	return (
		<Dialog open={commentModal} onClose={hide} maxWidth={"md"} fullWidth>
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
				{"Add Comment"}
				<IconButton onClick={hide}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent
				sx={{
					overflow: "none",
					// px: "24px",
					// pt: "12px !important",
					// pb: 0,
				}}
				dividers>
				{comment_container}
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button onClick={hide} variant="outlined" color="secondary">
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit(handleAdd as any)}
					type="submit"
					color="primary"
					autoFocus>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddComment;
