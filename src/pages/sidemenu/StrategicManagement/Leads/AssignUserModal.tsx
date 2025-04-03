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
import {
	getMiniDepartmentUsers,
	getMiniUsers,
} from "@src/store/mini/mini.Action";
import {
	clearMiniDepartmentUsers,
	clearMiniUsers,
} from "@src/store/mini/mini.Slice";
import { ChangeLeadAssignees } from "@src/store/sidemenu/strategic_management/leads/leads.action";
import {
	setIsUsersModalOpen,
	selectLeads,
} from "@src/store/sidemenu/strategic_management/leads/leads.slice";
import { LeadsState } from "@src/store/sidemenu/strategic_management/leads/leads.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { useEffect } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { ValueContainer } from "react-select/dist/declarations/src/components/containers";
import * as yup from "yup";

interface Props {
	pageParams?: LeadsState["pageParams"];
}

const AssignUserModal = ({ pageParams }: Props) => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		leads: { selectedData, isUsersModalOpen: modal, selected_users },
		mini: { miniUserList, miniUserLoading, miniUserParams },
	} = useAppSelector((state) => selectLeads(state));

	const closeModal = () => {
		reset({
			assign_to: null,
		});
		dispatch(setIsUsersModalOpen(false));
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
			assignees_ids: payload.users.map((e: any) => e.value),
		};
		dispatch(
			ChangeLeadAssignees({
				id: selectedData?.id ? selectedData?.id : "",
				data,
				params: pageParams,
				closeModal,
			})
		);
	});

	// useEffect(() => {
	// 	setValue(
	// 		"users",
	// 		selectedData?.assignees?.map((e) => {
	// 			return {
	// 				label: e.fullname,
	// 				value: e.id,
	// 			};
	// 		})
	// 	);
	// }, [selectedData]);
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
						<form style={{ width: "70%" }}>
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
										}}
										control={control}
										rules={{
											required: true,
										}}
										options={miniUserList.map(
											(user: {
												id: string | number;
												fullname: string;
											}) => {
												const obj = {
													id: user?.id,
													name: user?.fullname,
												};
												return obj;
											}
										)}
										onChange={(data) => {}}
										loading={miniUserLoading}
										selectParams={{
											page: miniUserParams.page,
											page_size: miniUserParams.page_size,
											search: miniUserParams.search,
											no_of_pages:
												miniUserParams.no_of_pages,
										}}
										hasMore={
											miniUserParams.page <
											miniUserParams.no_of_pages
										}
										fetchapi={getMiniUsers}
										clearData={clearMiniUsers}
									/>
								</Box>
							</Stack>
						</form>
					</DialogContentText>
				</DialogContent>
				<DialogActions sx={{ p: 2 }}>
					<Button
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
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AssignUserModal;
