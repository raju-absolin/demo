import { yupResolver } from "@hookform/resolvers/yup";
import { Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
	Grid2 as Grid,
	Paper,
	Stack,
	Collapse,
	InputLabel,
	List,
	styled,
	ListItem,
	ListItemText,
	Avatar,
	ListItemSecondaryAction,
	IconButton,
} from "@mui/material";
import SelectComponent from "@src/components/form/SelectComponent";
import Loader from "@src/components/Loader";
import { getMiniUsers } from "@src/store/mini/mini.Action";
import { clearMiniUsers } from "@src/store/mini/mini.Slice";
import {
	deleteSharedFileById,
	getExcludedUsersListByFileId,
	getIncludedUsersListByFileId,
	postSharedFile,
} from "@src/store/sidemenu/file_system/fs.action";
import {
	clearExcludedUserListByFileId,
	setFileShare,
	useFileSystemSelector,
} from "@src/store/sidemenu/file_system/fs.slice";
import { SharedFile } from "@src/store/sidemenu/file_system/fs.types";
import { useAppDispatch } from "@src/store/store";
import React, { SyntheticEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
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
const FileShare = () => {
	const dispatch = useAppDispatch();
	const {
		mini: { miniUserLoading, miniUserParams },
		fileSystem: {
			// fileShareLoading: loading,
			fileShareModal: modal,
			fileShareData,
			// fileShareList,
			// fileShareParams,
			showUserAdd,
			miniExcludedUserListByFileId,
			miniIncludedUserListByFileId,
		},
	} = useFileSystemSelector();

	const closeModal = () => {
		dispatch(
			setFileShare({
				fileShareModal: false,
			})
		);
	};
	const sharedToSchema = yup.object().shape({
		shared_to: yup.object({
			label: yup.string().required("Please select shared to"),
			value: yup.string().required("Please select  shared to"),
		}),
	});

	type ShareFileType = {
		file_id: string;
		shared_to: {
			lable: string;
			value: string;
		};
	};
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(sharedToSchema),
	});

	useEffect(() => {
		if (showUserAdd) {
			reset({
				shared_to: null,
			});
		}
	}, [showUserAdd]);

	const handleAdd = handleSubmit(
		(payload: { shared_to: ShareFileType["shared_to"] }) => {
			const obj = {
				file_id: fileShareData?.file?.id ? fileShareData?.file?.id : "",
				shared_to_id: payload?.shared_to?.value
					? payload?.shared_to?.value
					: "",
			};

			dispatch(
				postSharedFile({
					obj,
					clearData: () => {
						reset({
							shared_to: null,
						});
					},
					params: {
						...miniIncludedUserListByFileId?.miniParams,
						file_id: fileShareData?.file?.id
							? fileShareData?.file?.id
							: "",
					},
				})
			);
		},
		(errors) => {}
	);

	const deleteItem = (item: SharedFile) => {
		dispatch(
			deleteSharedFileById({
				id: item?.id ? item?.id : "",
				params: {
					...miniIncludedUserListByFileId?.miniParams,
					file_id: fileShareData?.file?.id
						? fileShareData?.file?.id
						: "",
				},
			})
		);
	};
	useEffect(() => {
		if (fileShareData?.file?.id) {
			dispatch(
				getIncludedUsersListByFileId({
					...miniIncludedUserListByFileId?.miniParams,
					file_id: fileShareData?.file?.id || "",
					page: 1,
					page_size: 10,
				})
			);
		}
	}, [fileShareData?.file?.id]);
	return (
		<Dialog open={modal} onClose={closeModal} maxWidth="md" fullWidth>
			<DialogTitle>
				<Typography
					variant="h5"
					sx={{
						wordWrap: "break-word",
					}}>
					Share "{fileShareData?.file?.name}"
				</Typography>
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
											dispatch(
												setFileShare({
													showUserAdd: !showUserAdd,
												})
											);
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
															name="shared_to"
															placeholder="Select User"
															required={false}
															multiple={false}
															control={control}
															rules={{
																required: true,
															}}
															options={miniExcludedUserListByFileId?.list?.map(
																(e: {
																	id:
																		| string
																		| number;
																	fullname: string;
																}) => ({
																	id: e?.id,
																	name: e?.fullname,
																})
															)}
															loading={
																miniExcludedUserListByFileId?.loading
															}
															selectParams={{
																page: miniExcludedUserListByFileId
																	?.miniParams
																	?.page,
																page_size:
																	miniExcludedUserListByFileId
																		?.miniParams
																		?.page_size,
																search: miniExcludedUserListByFileId
																	?.miniParams
																	?.search,
																no_of_pages:
																	miniExcludedUserListByFileId
																		?.miniParams
																		?.no_of_pages,
																file_id:
																	fileShareData
																		?.file
																		?.id,
															}}
															hasMore={
																miniExcludedUserListByFileId
																	?.miniParams
																	?.page <
																miniExcludedUserListByFileId
																	?.miniParams
																	?.no_of_pages
															}
															fetchapi={
																getExcludedUsersListByFileId
															}
															clearData={
																clearExcludedUserListByFileId
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
									{miniIncludedUserListByFileId?.loading ? (
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
																miniIncludedUserListByFileId
																	?.miniParams
																	?.page <
																miniIncludedUserListByFileId
																	?.miniParams
																	?.no_of_pages
															) {
																dispatch(
																	getIncludedUsersListByFileId(
																		{
																			...miniIncludedUserListByFileId?.miniParams,
																			file_id:
																				fileShareData
																					?.file
																					?.id ||
																				"",
																			page:
																				miniIncludedUserListByFileId
																					?.miniParams
																					?.page +
																				1,
																			page_size: 10,
																		}
																	)
																);
															}
														}
													}}>
													{miniIncludedUserListByFileId
														?.list?.length != 0 ? (
														miniIncludedUserListByFileId?.list?.map(
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
																							src={item?.shared_to?.fullname?.charAt(
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
																									?.shared_to
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
															Empty Data
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

export default FileShare;
