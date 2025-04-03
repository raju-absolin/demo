import react, { ChangeEvent, useEffect, useState } from "react";
import {
	Button,
	DialogContentText,
	FormControlLabel,
	FormHelperText,
	Grid2 as Grid,
	InputLabel,
	OutlinedInput,
	Switch,
	Typography,
} from "@mui/material";
import {
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "@src/components";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	setSelectedData,
	ApprovalSelector,
	SetSwitchApproval,
} from "@src/store/settings/Permissions/Approvals/approval.slice";
import {
	postApprovalData,
	editApprovalDataById,
} from "@src/store/settings/Permissions/Approvals/approval.action";
import { LuX } from "react-icons/lu";
import { LoadingButton } from "@mui/lab";
import { systemSelector } from "@src/store/system/system.slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	clearMiniUserTypes,
	miniSelector,
	setMiniUserParams,
	clearMiniProjects,
	clearMiniTenders,
} from "@src/store/mini/mini.Slice";
import {
	getMiniUserTypes,
	getMiniUsers,
	getMiniProjects,
	getMiniTenders,
} from "@src/store/mini/mini.Action";
import { Co2Sharp } from "@mui/icons-material";
import { getWorkOrderById } from "@src/store/sidemenu/project_management/work_order/work_order.action";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";

type Props = {
	modal: boolean;
	setModalOpen: (value: boolean) => void;
};

const AddApproval = ({ modal, setModalOpen }: Props) => {
	const dispatch = useAppDispatch();

	const {
		approval: { loading, selectedData, finalapproval, pageParams, model },
		mini: {
			miniUserTypes,
			miniUserParams,
			miniUserList,
			miniUserLoading,
			miniProject,
			miniTenders,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			approval: ApprovalSelector(state),
			system: systemSelector(state),
			mini: miniSelector(state),
		};
	});

	const SCREENTPYE_CHOICES = [
		{ name: "Tender", id: 1 },
		{ name: "Project", id: 2 },
	];

	const APPROVE_TYPE_CHOICES = [
		{ name: "Purchase Order Approval", id: 1 },
		{ name: "Material Request Approval", id: 2 },
		{ name: "Payment Request Approval", id: 3 },
		{ name: "Expenditure Sheet Approval", id: 4 },
		{ name: "Material Issue Approval", id: 5 },
		{ name: "Issue To Production Approval", id: 6 },
		{ name: "Stock Transfer Out Approval", id: 7 },
		{ name: "Delivery Challan Approval", id: 8 },
	];

	const approvalSchema = yup.object().shape({
		levelno: yup.string().trim().required("Please enter your level number"),
		screen_type: yup.object().shape({
			label: yup.string().required("Please select tansaction"),
			value: yup.string().required("Please select transaction"),
		}),
		approve_type: yup.object().shape({
			label: yup.string().required("Please select user"),
			value: yup.string().required("Please select user"),
		}),
		user_type: yup.object().shape({
			label: yup.string().required("Please select user type"),
			value: yup.string().required("Please select user type"),
		}),
		finalapproval: yup.boolean().optional(),
	});
	const hide = () => {
		reset({
			screen_type: null,
			levelno: "",
			approve_type: null,
			user_type: null,
			finalapproval: false,
		});

	};
	const { control, handleSubmit, reset, getValues, setValue } = useForm<any>({
		resolver: yupResolver(approvalSchema),
	});
	useEffect(() => {
		if (selectedData?.id) {
			reset({
				screen_type: selectedData?.screen_type
					? {
						label: selectedData?.screen_type_name,
						value: selectedData?.screen_type,
					}
					: null,
				levelno: selectedData?.levelno || "",
				approve_type: selectedData?.approve_type
					? {
						label: selectedData?.approve_type_name,
						value: selectedData?.approve_type,
					}
					: null,
				user_type: selectedData?.user_type
					? {
						label: selectedData?.user_type?.name,
						value: selectedData?.user_type?.id,
					}
					: null,
				finalapproval: selectedData?.finalapproval || false,
			});
		}
	}, [selectedData, reset]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(SetSwitchApproval(event.target.checked));
	};
	const onSubmit = (data: any) => {
		const obj: {
			id?: string;
			levelno: string;
			screen_type: string;
			approve_type: string;
			user_type_id: string;
			finalapproval: boolean;
		} = {
			levelno: data?.levelno,
			screen_type: data.screen_type?.value,
			approve_type: data.approve_type?.value,
			user_type_id: data?.user_type?.value,
			finalapproval: selectedData?.finalapproval
				? selectedData?.finalapproval
				: false,
		};
		if (!selectedData?.id) {
			const payload = {
				obj,
				hide,
				pageParams,
			};
			dispatch(postApprovalData(payload));
		} else {
			obj.id = selectedData?.id ? selectedData?.id : "";
			const payload = {
				obj,
				hide,
				pageParams,
			};
			dispatch(editApprovalDataById(payload));
		}
	};
	return (
		<>
			<Dialog
				open={modal}
				onClose={() => {
					hide();
					setModalOpen(false);
				}}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				maxWidth="md"
				PaperProps={{
					sx: {
						width: "900px", // Set a custom width
						maxWidth: "none", // Disable default maxWidth
					},
				}}>
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
					{!selectedData?.id ? "Add " : "Update "}
					Approval
					<IconButton onClick={() => {
						hide();
						setModalOpen(false);
					}}>
						<LuX color="white" />
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
					<DialogContentText>
						<form
							style={{ width: "100%" }}
							onSubmit={handleSubmit(onSubmit)}>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, sm: 6 }}>
									<FormInput
										name="levelno"
										label="Level No"
										type="number"
										required
										placeholder="Enter Level Number here"
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<SelectComponent
										name="screen_type"
										label="Screen Type"
										control={control}
										required
										options={SCREENTPYE_CHOICES?.map(
											(e: {
												id: number;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }} sx={{ mt: 2 }}>
									<SelectComponent
										name="approve_type"
										label="Approval Type"
										control={control}
										required
										options={APPROVE_TYPE_CHOICES?.map(
											(e: {
												id: number;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }} sx={{ mt: 2 }}>
									<SelectComponent
										name="user_type"
										label="User Type"
										control={control}
										required
										options={miniUserTypes.list?.map(
											(e: {
												id: number;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										loading={miniUserTypes.loading}
										selectParams={{
											page: miniUserTypes.miniParams.page,
											page_size:
												miniUserTypes.miniParams
													.page_size,
											search: miniUserTypes.miniParams
												.search,
											no_of_pages:
												miniUserTypes.miniParams
													.no_of_pages,
										}}
										fetchapi={getMiniUserTypes}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<FormControlLabel
										style={{ marginTop: "10px" }}
										label={
											// <Typography variant="subtitle1">
											"Final Approval"
											// {/* </Typography> */}
										}
										labelPlacement="top"
										control={
											<Switch
												checked={
													selectedData?.finalapproval
												}
												onChange={handleChange}
												inputProps={{
													"aria-label": "controlled",
												}}
											/>
										}
									/>
								</Grid>
							</Grid>
							<DialogActions sx={{ p: 2 }}>
								<Button
									onClick={() => {
										hide();
										setModalOpen(false);
									}}
									variant="outlined"
									color="secondary">
									Cancel
								</Button>
								{!selectedData?.id ? (
									<LoadingButton
										variant="contained"
										type="submit"
										color="primary"
										loading={loading}
										autoFocus>
										Submit
									</LoadingButton>
								) : (
									<LoadingButton
										variant="contained"
										type="submit"
										color="primary"
										loading={loading}
										autoFocus>
										Update
									</LoadingButton>
								)}
							</DialogActions>
						</form>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};
export default AddApproval;
