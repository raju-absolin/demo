import { yupResolver } from "@hookform/resolvers/yup";
import { Delete, Edit } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Grid2 as Grid,
	Box,
	Stack,
	Chip,
	Typography,
	Paper,
	Collapse,
	InputLabel,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Avatar,
	styled,
} from "@mui/material";
import { FormInput } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import Loader from "@src/components/Loader";
import { getMiniUsers } from "@src/store/mini/mini.Action";
import { clearMiniUsers } from "@src/store/mini/mini.Slice";
import {
	deleteProjectGroupUsersById,
	editProjectGroups,
	getProjectGroupUsers,
	postProjectGroup,
	postProjectGroupUser,
	useProjectGroupsActions,
} from "@src/store/sidemenu/project_management/ProjectGroups/projectGroups.action";
import { selectGroups } from "@src/store/sidemenu/project_management/ProjectGroups/projectGroups.slice";
import {
	ProjectGroupsState,
	Group,
	GroupUser,
} from "@src/store/sidemenu/project_management/ProjectGroups/projectGroups.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { SyntheticEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuArrowRight, LuPlusCircle, LuX } from "react-icons/lu";
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

interface Props {
	open: boolean;
	hide: (reset: any) => void;
	selectedData: Group;
	project_id: string;
	params: ProjectGroupsState["pageParams"];
}

const ViewGroupDetails = ({
	open,
	hide,
	selectedData,
	project_id,
	params,
}: Props) => {
	const dispatch = useAppDispatch();

	const {
		reducers: { updateState },
		extraReducers: {},
	} = useProjectGroupsActions();

	const {
		projectGroups,
		projectGroups: {
			showUserAdd,
			group_users_params,
			group_users_list,
			group_users_count,
			group_user_loading,
		},
		mini: { miniUserList, miniUserLoading, miniUserParams },
		system: { userAccessList },
	} = useAppSelector((state) => selectGroups(state));

	const GroupSchema = yup.object().shape({
		user: yup
			.object({
				label: yup.string().required("user is required"),
				value: yup.string().required("user is required"),
			})
			.required("user is required")
			.nullable(),
	});

	const {
		control,
		handleSubmit,
		reset,
		//formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(GroupSchema),
	});

	const handleAdd = handleSubmit(
		(payload: {
			user: {
				label: string;
				value: string;
			};
		}) => {
			const data = {
				group_id: selectedData?.id ? selectedData?.id : "",
				user_id: payload?.user?.value ? payload?.user?.value : "",
			};

			dispatch(
				postProjectGroupUser({
					data,
					hide: () => {
						updateState({
							...projectGroups,
							showUserAdd: !showUserAdd,
						});
						reset({
							user: null,
						});
					},
					params: group_users_params,
				})
			);
		}
	);

	// Delete a checklist item
	const deleteItem = (item: GroupUser) => {
		dispatch(
			deleteProjectGroupUsersById({
				id: item?.id ? item?.id : "",
				params: group_users_params,
			})
		);
	};

	useEffect(() => {
		dispatch(
			getProjectGroupUsers({
				...group_users_params,
				group: selectedData?.id ? selectedData?.id : "",
				page: 1,
				page_size: 10,
			})
		);
	}, [selectedData?.id]);
	return (
		<Dialog
			open={open}
			onClose={() => {
				hide(reset);
			}}
			fullWidth
			maxWidth={"md" as "xl"}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
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
				<Stack alignItems={"center"} direction={"row"} spacing={2}>
					<p>{selectedData.name?.toUpperCase()}</p>
					<LuArrowRight />
					<p>
						<Chip
							label={
								<Typography>{selectedData?.code}</Typography>
							}
							color="primary"
						/>
					</p>
				</Stack>
				<IconButton
					onClick={() => {
						hide(reset);
					}}>
					<LuX
					//  color="white"
					/>
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<Grid container spacing={2}>
						<Grid size={{ xs: 12 }}>
							<Paper
								variant="outlined"
								sx={{
									p: 2,
								}}>
								<Typography
									color="primary"
									variant="subtitle1"
									sx={{
										display: "flex",
										justifyContent: "space-between",
									}}>
									<Typography variant="h4">Users</Typography>
									<Button
										size="large"
										onClick={() => {
											updateState({
												...projectGroups,
												showUserAdd: !showUserAdd,
											});
										}}>
										<Stack
											spacing={1}
											direction={"row"}
											alignItems={"center"}>
											{/* <LuPlusCircle /> */}
											<p>
												{!showUserAdd
													? "Add User"
													: "Hide Fields"}
											</p>
										</Stack>
									</Button>
								</Typography>

								<Collapse in={showUserAdd}>
									<Box>
										<Grid container spacing={2}>
											<Grid
												size={{
													xs: 12,
												}}>
												<Stack
													direction={"row"}
													alignItems={"center"}
													spacing={2}
													flex={1}>
													<InputLabel
														sx={{
															".MuiInputLabel-asterisk":
																{
																	color: "red",
																},
														}}
														id={"user"}
														required={true}
														style={{
															fontWeight:
																"medium",
															marginBottom: "7px",
														}}>
														User
													</InputLabel>
													<Grid
														size={{
															xs: 12,
															md: 6,
															lg: 4,
														}}>
														<SelectComponent
															label=""
															name="user"
															placeholder="Select User"
															required={false}
															multiple={false}
															control={control}
															rules={{
																required: true,
															}}
															options={miniUserList
																.filter(
																	(e: {
																		id:
																			| string
																			| number;
																		fullname: string;
																	}) =>
																		!group_users_list?.some(
																			(
																				f
																			) =>
																				f
																					?.user
																					?.id ==
																				e?.id
																		)
																)
																.map(
																	(e: {
																		id:
																			| string
																			| number;
																		fullname: string;
																	}) => ({
																		id: e.id,
																		name: e.fullname,
																	})
																)}
															loading={
																miniUserLoading
															}
															selectParams={{
																page: miniUserParams.page,
																page_size:
																	miniUserParams.page_size,
																search: miniUserParams.search,
																no_of_pages:
																	miniUserParams.no_of_pages,
															}}
															hasMore={
																miniUserParams.page <
																miniUserParams.no_of_pages
															}
															fetchapi={
																getMiniUsers
															}
															clearData={
																clearMiniUsers
															}
														/>
													</Grid>
													<Grid
														size={{
															xs: 12,
															md: 6,
															lg: 4,
														}}>
														<Button
															sx={{
																mt: 1,
															}}
															onClick={() => {
																handleAdd();
															}}
															variant="outlined"
															size="large">
															Add
														</Button>
													</Grid>
												</Stack>
											</Grid>
										</Grid>
									</Box>
								</Collapse>

								<Box>
									{group_user_loading ? (
										<Loader />
									) : (
										<Box>
											<List>
												<ScrollableList
													onScroll={(
														e: SyntheticEvent
													) => {
														const { target } =
															e as any;

														if (
															Math.ceil(
																target?.scrollTop +
																	target?.offsetHeight
															) ==
															target?.scrollHeight
														) {
															if (
																group_users_params.page <
																group_users_params.no_of_pages
															) {
																dispatch(
																	getProjectGroupUsers(
																		{
																			...group_users_params,
																			page:
																				group_users_params?.page +
																				1,
																			page_size: 10,
																			group: selectedData?.id
																				? selectedData?.id
																				: "",
																		}
																	)
																);
															}
														}
													}}>
													{group_users_list.length !=
													0 ? (
														group_users_list?.map(
															(item) => {
																return (
																	<ListItem
																		key={
																			item.id
																		}
																		sx={{
																			display:
																				"flex",
																			alignItems:
																				"center",
																		}}>
																		<>
																			<ListItemText
																				secondary={
																					<Stack
																						direction={
																							"row"
																						}
																						spacing={
																							2
																						}
																						alignItems={
																							"center"
																						}>
																						<Avatar
																							variant="circular"
																							src={item?.user?.fullname?.charAt(
																								0
																							)}
																							sx={{
																								height: "32px",
																								width: "32px",
																							}}
																						/>
																						<Typography variant="subtitle2">
																							{
																								item
																									.user
																									?.fullname
																							}
																						</Typography>
																					</Stack>
																				}
																			/>
																			<ListItemSecondaryAction>
																				<IconButton
																					onClick={() =>
																						deleteItem(
																							item
																						)
																					}>
																					<Delete />
																				</IconButton>
																			</ListItemSecondaryAction>
																		</>
																	</ListItem>
																);
															}
														)
													) : (
														<Typography color="error">
															No Users Assigned to
															this groups
														</Typography>
													)}
												</ScrollableList>
											</List>
										</Box>
									)}
								</Box>
							</Paper>
						</Grid>
					</Grid>
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};

export default ViewGroupDetails;
