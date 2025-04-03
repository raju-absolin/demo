import { ThumbDown, ThumbUp } from "@mui/icons-material";
import {
	Alert,
	Avatar,
	Box,
	Button,
	Card,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid2 as Grid,
	IconButton,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Timeline from "./Timeline";
import { useAuthorizationSelector } from "@src/store/settings/Authorization/authorization.slice";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@src/store/store";
import {
	getAuthorizationHistory,
	postAuthorizationApprovals,
	postCheckAuthorization,
} from "@src/store/settings/Authorization/authorization.action";
import { LuX } from "react-icons/lu";
import TextArea from "../form/TextArea";
import { LoadingButton } from "@mui/lab";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "@src/types";

interface BaseApprovalData {
	created_by?: User;
	authorized_status_name?: string;
	authorized_status?: number;
	current_authorized_level?: number;
	current_authorized_status?: number;
	current_authorized_status_name?: string;
}

// Generic type extending the base interface
type Props<T extends BaseApprovalData> = {
	data: T;
	app_label: string;
	model_name: string;
	instance_id: string;
	callback: () => void;
};

const ApprovalWorkflow = <T extends BaseApprovalData>({
	data,
	app_label,
	model_name,
	instance_id,
	callback,
}: Props<T>) => {
	const dispatch = useAppDispatch();
	const [aprrovalModal, setApproveModal] = useState(false);
	const [rejectModel, setRejectModal] = useState(false);
	const {
		authorization: {
			authorizationHistory,
			authorizationHistoryCount,
			authorizationHistoryLoading,
			authorizationHistoryParams,

			checkAuthorization,
			checkAuthorizationLoading,
			authorizationPostLoading,
		},
		system: { userAccessList },
	} = useAuthorizationSelector();

	const model_path = `${app_label}.${model_name}`;

	const {
		current_authorized_status,
		current_authorized_status_name,
		authorized_status_name,
		authorized_status,
		current_authorized_level,
	} = data;

	// check Aprrove Logic
	useEffect(() => {
		if (app_label && model_name && instance_id) {
			dispatch(
				postCheckAuthorization({
					app_label,
					model_name,
					instance_id,
					obj: {
						instance_id,
					},
					callback: () => {},
				})
			);
		} else {
			console.error(
				"postCheckAuthorization 'no: app_label && model_name && instance_id'"
			);
		}
	}, [app_label, model_name, instance_id]);

	const Schema = yup.object().shape({
		description: yup
			.string()
			.required("Please enter your description")
			.trim(),
	});
	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(Schema),
	});

	// approve
	const showApproveModal = (value: boolean) => {
		setApproveModal(value);
	};
	const handleApproveModalClose = () => {
		setApproveModal(false);
	};
	type FormPayload = {
		description: string;
	};
	function handleApprove(payload: FormPayload) {
		const data = {
			app_label: app_label,
			model_name: model_name,
			obj: {
				instance_id: `${instance_id}`,
				authorized_status: 2,
				description: payload?.description,
			},
			callback: () => {
				callback();
				setApproveModal(false);
				setRejectModal(false);
				reset();
			},
			pageParams: authorizationHistoryParams,
		};
		dispatch(postAuthorizationApprovals(data));
	}

	// reject

	const showRejectModal = (value: boolean) => {
		setRejectModal(value);
	};
	const handleRejectModalClose = () => {
		setRejectModal(false);
	};

	const onRejectButtonClose = (payload: FormPayload) => {
		const data = {
			app_label: app_label,
			model_name: model_name,
			obj: {
				instance_id: `${instance_id}`,
				authorized_status: 3,
				description: payload?.description,
			},
			callback: () => {
				callback();
				setApproveModal(false);
				setRejectModal(false);
				reset();
			},
			pageParams: authorizationHistoryParams,
		};
		dispatch(postAuthorizationApprovals(data));
	};

	useEffect(() => {
		if (model_path && instance_id) {
			dispatch(
				getAuthorizationHistory({
					model_path: model_path,
					instance_id: instance_id,
					params: authorizationHistoryParams,
				})
			);
		} else {
			console.error(
				"getAuthorizationHistory 'no: model_path && instance_id'"
			);
		}
	}, [model_path, instance_id]);
	return (
		<div>
			<Grid size={{}}>
				{/* <Card sx={{ mt: 2, px: 2, pt: 0, pb: 2 }}> */}
				{/* <Grid container spacing={2}> */}
				{/* Avatar */}
				{/* <Grid mt={2} ml={4}>
							<Avatar
								sx={{ width: 50, height: 50, mt: 1 }}
								src=""
							/>
						</Grid> */}

				{/* User Info */}
				{/* <Grid size={{ xs: 8 }} mt={2}>
							<Box>
								<Typography variant="body1">
									<strong>Name: </strong>
									{data?.created_by?.fullname || "None"}
								</Typography>
								<Typography variant="body1">
									<strong>Email: </strong>
									{data?.created_by?.email || "None"}
								</Typography>
								<Typography variant="body1">
									<strong>Mobile: </strong>
									{data?.created_by?.phone || "None"}
								</Typography>
							</Box>
						</Grid> */}
				{/* </Grid> */}
				{checkAuthorization && (
					<Grid container spacing={2} sx={{ mt: 2, p: 1 }}>
						<Grid size={{ xs: 6 }}>
							<Button
								variant="contained"
								color="success"
								// disabled={
								// 	// authorized_status_name == "Approved" ||
								// 	current_authorized_status_name ==
								// 	"Approved"
								// }
								fullWidth
								startIcon={<ThumbUp />}
								onClick={() => {
									showApproveModal(true);
								}}>
								Approve
							</Button>
						</Grid>
						<Grid size={{ xs: 6 }}>
							<Button
								variant="contained"
								color="error"
								fullWidth
								// disabled={
								// 	current_authorized_status_name ==
								// 	"Rejected"
								// }
								startIcon={<ThumbDown />}
								onClick={() => {
									showRejectModal(true);
								}}>
								Reject
							</Button>
						</Grid>
					</Grid>
				)}

				{/* Alert */}
				{!authorizationPostLoading && (
					<Box sx={{ mt: 2 }}>
						<Alert
							severity={
								authorized_status === 1
									? "info"
									: authorized_status === 2
										? "success"
										: "error"
							}>
							{authorized_status_name}
						</Alert>
					</Box>
				)}
				{authorizationHistory?.length != 0 && (
					<Timeline approvalData={authorizationHistory} />
				)}
				{/* </Card> */}
			</Grid>

			{aprrovalModal && (
				<Dialog
					open={aprrovalModal}
					onClose={handleApproveModalClose}
					maxWidth="sm"
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description">
					<DialogContent
						sx={{
							px: "24px",
							pt: "12px !important",
							pb: 0,
							p: 3,
							paddingTop: 2,
						}}>
						<DialogContentText
							id="alert-dialog-description"
							sx={{
								width: 500,
							}}>
							<Typography
								variant="h5"
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									cursor: "pointer",
								}}>
								<IconButton aria-label="info">
									<InfoCircleOutlined color="primary" />
								</IconButton>
								Are you sure want to Approve?
							</Typography>
							<form
								style={{ width: "100%" }}
								onSubmit={handleSubmit(handleApprove)}>
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
								<DialogActions sx={{ p: 2 }}>
									<Button
										onClick={handleApproveModalClose}
										variant="outlined"
										color="secondary"
										style={{ cursor: "pointer" }}>
										Cancel
									</Button>
									<LoadingButton
										variant="contained"
										type="submit"
										color="primary"
										loading={authorizationPostLoading}
										autoFocus>
										Submit
									</LoadingButton>
								</DialogActions>
							</form>
						</DialogContentText>
					</DialogContent>
				</Dialog>
			)}

			{rejectModel && (
				<Dialog
					open={rejectModel}
					onClose={handleRejectModalClose}
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
						Purchase Order Reject
						<IconButton onClick={handleRejectModalClose}>
							<LuX color="white" />
						</IconButton>
					</DialogTitle>
					<DialogContent
						sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
						<DialogContentText
							id="alert-dialog-description"
							sx={{
								width: 500,
							}}>
							<form
								style={{ width: "100%" }}
								onSubmit={handleSubmit(onRejectButtonClose)}>
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
								<DialogActions sx={{ p: 2 }}>
									<Button
										onClick={handleRejectModalClose}
										variant="outlined"
										color="secondary">
										Cancel
									</Button>
									<LoadingButton
										variant="contained"
										type="submit"
										color="primary"
										loading={authorizationPostLoading}
										autoFocus>
										Submit
									</LoadingButton>
								</DialogActions>
							</form>
						</DialogContentText>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};

export default ApprovalWorkflow;
