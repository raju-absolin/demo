import { useCallback, useEffect, useState } from "react";
import {
	Box,
	Button,
	Stack,
	IconButton,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Dialog,
	Slide,
	Divider,
} from "@mui/material";
import { useAppDispatch } from "@src/store/store";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { clearMiniUsers } from "@src/store/mini/mini.Slice";
import {
	getScreenAssigneUsers,
	postScreenAssigneUserData,
} from "@src/store/settings/AssignUsers/assignUsers.action";
import { useAssigneUserSelector } from "@src/store/settings/AssignUsers/assignUsers.slice";
import SelectComponent from "../form/SelectComponent";
import { getMiniUsers } from "@src/store/mini/mini.Action";
import TextArea from "../form/TextArea";
import { GroupedAvatars } from "./GroupedAvatars";
import { LoadingButton } from "@mui/lab";
import { UsersList } from "./UsersList";
import { ScreenAssigneUser } from "@src/store/settings/AssignUsers/assignUsers.types";

type Props = {
	instance_id: string;
	modal_path: string;
	callback: (assigness: ScreenAssigneUser[]) => void;
};

const AssignUserModal = ({ instance_id, modal_path, callback }: Props) => {
	const [modal, setOpen] = useState<boolean>(false);
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		mini: { miniUserList, miniUserLoading, miniUserParams },
		assigneUser: {
			formRowsParams,
			formRowsLoading,
			formRows,
			formRowsCount,
		},
	} = useAssigneUserSelector();

	const closeModal = () => {
		reset({
			description: "",
			user: null,
		});
		setOpen(false);
	};

	const AssignUserSchema = yup.object().shape({
		user: yup
			.object()
			.shape({
				label: yup.string().required("This field is required"),
				value: yup.string().required("This field is required"),
			})
			.typeError("This field is required")
			.required("This field is required"),
		description: yup.string().optional(),
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

	const submit = handleSubmit(
		(payload) => {
			const obj = {
				user_id: payload?.user?.value,
				instance_id: instance_id,
				description: payload?.description,
				model_path: modal_path,
			};
			dispatch(
				postScreenAssigneUserData({
					obj,
					hide: () => {
						reset();
						// closeModal();
					},
					pageParams: {
						...formRowsParams,
						// model_path :model_path,
					},
				})
			);
		},
		(err) => {
			console.error(err);
		}
	);

	useEffect(() => {
		if (instance_id && modal_path) {
			dispatch(
				getScreenAssigneUsers({
					...formRowsParams,
					instance_id: instance_id,
					model_path: modal_path,
				})
			);
		}
	}, [instance_id, modal_path, modal]);

	useCallback(() => callback(formRows), [formRows])();

	console.log(formRows);
	return (
		<>
			<GroupedAvatars
				data={
					(formRows?.length != 0
						? formRows?.map((e) => e?.user)
						: []) as User[]
				}
				open={modal}
				setOpen={setOpen}
			/>
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
									<SelectComponent
										label="User"
										name="user"
										placeholder="Select User"
										required={false}
										multiple={false}
										// extraProps={{
										// 	hideSelectedOptions: false,
										// 	closeMenuOnSelect: false,
										// }}
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
										onClick={() => closeModal()}
										variant="outlined"
										color="secondary">
										Cancel
									</Button>

									<LoadingButton
										loading={formRowsLoading}
										variant="contained"
										onClick={() => submit()}
										// type="submit"
										color="primary"
										autoFocus>
										Submit
									</LoadingButton>
								</DialogActions>
							</Stack>
						</form>
					</DialogContentText>
					<Divider
						sx={{
							mt: 2,
							mb: 0,
						}}
					/>
					<UsersList
					// initialUsers={
					// 	(formRows?.length != 0
					// 		? formRows?.map((e) => e?.user)
					// 		: []) as User[]
					// }
					// pageParams={formRowsParams}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default AssignUserModal;
