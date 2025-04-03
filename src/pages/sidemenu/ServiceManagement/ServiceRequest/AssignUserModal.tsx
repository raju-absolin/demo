import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Fade,
	FormControlLabel,
	Grow,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Slide,
	Stack,
	TextField,
	Typography,
	Zoom,
} from "@mui/material";
import { RadioGroup } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import { selectBatchs } from "@src/store/masters/Batch/batch.slice";
import { getMiniDepartmentUsers } from "@src/store/mini/mini.Action";
import { clearMiniDepartmentUsers } from "@src/store/mini/mini.Slice";
import {
	ChangeServiceRequestAssignee,
	ChangeServiceRequestStatus,
	getServiceRequestById,
} from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.action";
import {
	setOpenDepartmentUserModal,
	useServiceRequestSelector,
} from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.slice";
import { ServiceRequestState } from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.types";
import { useAppDispatch } from "@src/store/store";
import React, { useEffect } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { ValueContainer } from "react-select/dist/declarations/src/components/containers";
import * as yup from "yup";

interface Props {
	pageParams?: ServiceRequestState["pageParams"];
}

const AssignUserModal = ({ pageParams }: Props) => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		serviceRequest: {
			selectedData,
			department_user_modal_open: modal,
			department_user_loading,
			error,
			selected_department_users,
		},
		mini: { miniDepartmentUsers },
		system: { userAccessList },
	} = useServiceRequestSelector();

	const closeModal = () => {
		dispatch(setOpenDepartmentUserModal(false));
	};

	const AssignUserSchema = yup.object().shape({
		users: yup
			.array()
			.of(yup.object())
			.min(1, "At least one member must be selected"),
	});

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(AssignUserSchema),
	});

	const submit = handleSubmit((payload) => {
		const data = {
			user_ids: payload.users.map((e: any) => e.value),
		};
		dispatch(
			ChangeServiceRequestAssignee({
				id: selectedData?.id ? selectedData?.id : "",
				data,
				params: pageParams,
				closeModal,
			})
		);
	});

	useEffect(() => {
		setValue(
			"users",
			selectedData?.assignees?.map((e) => {
				return {
					label: e.fullname,
					value: e.id,
				};
			})
		);
	}, [selectedData]);
	return (
		<>
			<Dialog
				open={modal}
				onClose={() => closeModal()}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				TransitionComponent={Slide}
				PaperProps={{
					style: {
						position: "absolute",
						top: "20px",
						right: "center",
						margin: 0,
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
					Assign Users
					<IconButton onClick={() => closeModal()}>
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
						<form style={{ width: "100%" }}>
							<Stack spacing={2}>
								<Box>
									{/* <SelectComponent
										required
										name="status"
										label="Status"
										control={control}
										rules={{ required: true }}
										options={status_options}
									/> */}
									<SelectComponent
										label="Users"
										name="users"
										placeholder="Select User"
										required={false}
										multiple={true}
										extraProps={{
											hideSelectedOptions: false,
											closeMenuOnSelect: false,
											isClearable: false,
											styles: {
												multiValueRemove: (
													base: any
												) => ({
													...base,
													display: "none",
												}),
											},
										}}
										control={control}
										rules={{
											required: true,
										}}
										options={
											selectedData?.assignees?.map(
												(e: {
													user: {
														id: string | number;
														fullname: string;
													};
												}) => {
													const obj = {
														id: e?.user?.id,
														name: e?.user?.fullname,
														isDisabled: true,
													};
													// if (
													// 	selected_department_users?.some(
													// 		(f) =>
													// 			f?.user?.id ==
													// 			e?.user?.id
													// 	)
													// )
													// 	return {
													// 		...obj,
													// 		isDisabled: true,
													// 	};

													return obj;
												}
											) || []
										}
										onChange={(data) => {}}
										loading={miniDepartmentUsers.loading}
										selectParams={{
											page: miniDepartmentUsers.miniParams
												.page,
											page_size:
												miniDepartmentUsers.miniParams
													.page_size,
											search: miniDepartmentUsers
												.miniParams.search,
											no_of_pages:
												miniDepartmentUsers.miniParams
													.no_of_pages,
										}}
										hasMore={
											miniDepartmentUsers.miniParams
												.page <
											miniDepartmentUsers.miniParams
												.no_of_pages
										}
										fetchapi={getMiniDepartmentUsers}
										clearData={clearMiniDepartmentUsers}
									/>
								</Box>
							</Stack>
						</form>
					</DialogContentText>
				</DialogContent>
				<DialogActions sx={{ p: 2 }}>
					{/* <Button
						onClick={() => closeModal()}
						variant="outlined"
						color="secondary">
						Cancel
					</Button>

					<Button
						variant="contained"
						onClick={() => submit()}
						type="submit"
						color="primary"
						autoFocus>
						Submit
					</Button> */}
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AssignUserModal;
