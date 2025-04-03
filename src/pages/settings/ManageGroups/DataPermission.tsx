import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

import {
	deleteDataPermission,
	editDataPermission,
	getDataPermissions,
	getExcludePermission,
	getModalsList,
	getModelData,
	postDataPermission,
	postExcludePermission,
} from "@src/store/settings/DataPermissions/dataPermissionAction";

import {
	useDataPermissionSelector,
	clearModelData,
	updateDataPermissionState,
} from "@src/store/settings/DataPermissions/dataPermissionSlice";
import { useAppDispatch } from "@src/store/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProfilebyID } from "@src/store/settings/manageGroups/manage_groups.action";
import {
	Typography,
	Grid2 as Grid,
	Divider,
	Button,
	Drawer,
	List,
	Card,
	ListItem,
	styled,
	FormControlLabel,
	Checkbox,
	Box,
	CardHeader,
	Slide,
	Stack,
	Popover,
	InputAdornment,
	TextField,
	IconButton,
	MenuItem,
	Menu,
} from "@mui/material";
import {
	Check,
	Close,
	CloseOutlined,
	Delete,
	DeleteOutlined,
	EditOutlined,
	Save,
	SaveOutlined,
	Menu as MenuIcon,
} from "@mui/icons-material";
import GoBack from "@src/components/GoBack";
import {
	FormValues,
	ModelData,
} from "@src/store/settings/DataPermissions/dataPermissionTypes";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import { LoadingButton } from "@mui/lab";
import TableComponent from "@src/components/TableComponenet";
import { LuMoreHorizontal, LuPencil, LuSearch } from "react-icons/lu";

const ScrollableList = styled(List)<Record<string, any>>(
	({ theme, ...props }) => ({
		maxHeight: props?.styles?.maxHeight,
		marginTop: "0px",
		overflowY: "auto",
		padding: "0 8px",
		"&::-webkit-scrollbar": {
			width: "8px",
		},
		"&::-webkit-scrollbar-thumb": {
			backgroundColor: theme.palette.primary.main,
			borderRadius: "8px",
		},
		...props.styles,
	})
);

type EditState = {
	id: number;
	bool: boolean;
};

const ModelItems = ({
	selectedItem,
	handleSelect,
	styles,
}: {
	selectedItem: number | null;
	handleSelect: (item: ModelData) => void;
	styles: Record<string, any>;
}) => {
	const dispatch = useAppDispatch();
	const {
		dataPermissions: {
			dataPermissionsList: list,
			dataPermissionsCount: count,
			dataPermissionsParams: pageParams,
			dataPermissionsLoading: loading,
			selectedData,

			modelDataList: modelDataList,
			modelDataCount: modelDataCount,
			modelDataParams: modelDataParams,
			modelDataLoading: modelDataLoading,
			selectedModelData,

			modelsList: modelsList,
			modelsCount: modelsCount,
			modelsParams: modelsParams,
			modelsLoading: modelsLoading,

			exclussionLoading: exclusionsLoading,
			is_exclusion,
		},
		system: { userAccessList },
		manageProfile: { profileData },
	} = useDataPermissionSelector();

	const loadMoreItems = (event: SyntheticEvent) => {
		if (!modelsLoading) {
			const { target } = event as any;
			if (
				Math.ceil(target.scrollTop + target.offsetHeight) ==
				target.scrollHeight
			) {
				if (modelsParams.page < modelsParams.no_of_pages) {
					dispatch(
						getModalsList({
							...modelsParams,
							page: modelsParams.page + 1,
						})
					);
				}
			}
		}
	};
	return (
		<ScrollableList onScroll={loadMoreItems} styles={styles}>
			{modelsList?.map((model) => (
				<ListItem
					key={model?.id}
					sx={(theme) => ({
						background:
							selectedItem === model.id
								? "#e6f7ff"
								: theme.palette.background.paper, // Highlight selected item
						cursor: "pointer",
						paddingLeft: "1rem",
						borderRadius: "10px",
						border: "1px solid #dddddd",
						marginBottom: "8px", // Adds spacing between rows
					})}
					onClick={() => handleSelect(model)}>
					<Typography
						sx={(theme) => ({
							color:
								selectedItem === model.id
									? theme.palette.common.black
									: theme.palette.text.primary,
						})}
						variant={"subtitle1"}>
						{model?.name}
					</Typography>
				</ListItem>
			))}
		</ScrollableList>
	);
};

const DataPermission = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [isSmallScreen, setIsSmallScreen] = useState(
		window.innerWidth < 1023
	);
	const { id } = useParams<{ id: string }>();
	const [edit, setEdit] = useState<EditState>({ id: 0, bool: false });
	const [selectedItem, setSelectedItem] = useState<number | null>(null);
	const containerRef = React.useRef<HTMLElement>(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const deleteOpen = Boolean(anchorEl);
	const [currentId, setCurrentId] = useState(0);

	const {
		dataPermissions: {
			dataPermissionsList: list,
			dataPermissionsCount: count,
			dataPermissionsParams: pageParams,
			dataPermissionsLoading: loading,
			selectedData,

			modelDataList: modelDataList,
			modelDataCount: modelDataCount,
			modelDataParams: modelDataParams,
			modelDataLoading: modelDataLoading,
			selectedModelData,

			modelsList: modelsList,
			modelsCount: modelsCount,
			modelsParams: modelsParams,
			modelsLoading: modelsLoading,

			exclussionLoading: exclusionsLoading,
			is_exclusion,
		},
		system: { userAccessList },
		manageProfile: { profileData },
	} = useDataPermissionSelector();

	const handleSelect = (item: ModelData) => {
		setSelectedItem(item?.id || null);
		dispatch(
			updateDataPermissionState({
				selectedModelData: item,
			})
		);
		dispatch(
			getModelData({
				...modelDataParams,
				app_label: item?.contenttype?.app_label,
				model: item?.contenttype?.model,
			})
		);
		dispatch(
			getDataPermissions({
				...pageParams,
				model_path: `${item?.contenttype?.app_label}.${item?.contenttype?.model}`,
				group: id,
				page: 1,
				page_size: 10,
			})
		);
		dispatch(
			getExcludePermission({
				model_path: `${item?.contenttype?.app_label}.${item?.contenttype?.model}`,
				group_id: id || "",
			})
		);
	};

	useEffect(() => {
		dispatch(
			getModalsList({
				...modelsParams,
				page: 1,
				page_size: 20,
			})
		);

		const handleResize = () => {
			setIsSmallScreen(window.innerWidth < 1023);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const DataPermissioSchema = yup.object().shape({
		instance: yup
			.object({
				label: yup
					.string()
					.required(`Please select a ${selectedModelData?.name}`),
				value: yup
					.number()
					.required(`Please select a ${selectedModelData?.name}`),
			})
			.nullable()
			.required(`Please select a ${selectedModelData?.name}`),
		is_report: yup.boolean().notRequired().defined(),
		is_entry: yup.boolean().notRequired().defined(),
		is_view: yup.boolean().notRequired().defined(),
	});

	const { control, handleSubmit, reset, getValues } = useForm<any>({
		resolver: yupResolver(DataPermissioSchema),
	});

	const onFinish = ({
		instance,
		is_report,
		is_entry,
		is_view,
	}: FormValues) => {
		const data = {
			type: 2,
			group_id: id || "",
			instance_id: instance?.value,
			report: is_report || false,
			entry: is_entry || false,
			view: is_view || false,
			model_path: `${selectedModelData?.contenttype?.app_label}.${selectedModelData?.contenttype?.model}`,
		};

		console.log(data);
		dispatch(
			postDataPermission({
				data,
				params: {
					...pageParams,
					page: 1,
				},
				clearData,
			})
		);
	};

	const EditDataPermissioSchema = yup.object().shape({
		is_report: yup.boolean().optional().defined(),
		is_entry: yup.boolean().optional().defined(),
		is_view: yup.boolean().optional().defined(),
	});

	const { control: editController, handleSubmit: handleEditForm } =
		useForm<any>({
			resolver: yupResolver(EditDataPermissioSchema),
			values: {
				is_report: selectedData?.report || false,
				is_entry: selectedData?.entry || false,
				is_view: selectedData?.view || false,
			},
		});

	const onEditSave = ({ is_report, is_entry, is_view }: FormValues) => {
		const data = {
			id: selectedData?.id,
			type: 2,
			group_id: id || "",
			report: is_report || false,
			entry: is_entry || false,
			view: is_view || false,
			model_path: selectedData?.model_path || "",
			instance_id: selectedData?.instance_id,
		};
		console.log(data);
		dispatch(
			editDataPermission({
				id: selectedData?.id || 0,
				data,
				params: {
					...pageParams,
					page: 1,
				},
				clearData: () => {
					clearData();
					setEdit({
						id: 0,
						bool: false,
					});
				},
			})
		);
	};

	const setFormState = (data: Record<string, any>) => {
		dispatch(
			updateDataPermissionState({
				selectedData: {
					...selectedData,
					...data,
				},
			})
		);
	};

	const clearData = () => {
		dispatch(
			updateDataPermissionState({
				selectedData: {},
			})
		);
		reset({
			instance: null,
			is_report: false,
			is_entry: false,
			is_view: false,
		});
	};

	useEffect(() => {
		clearData();
	}, [selectedItem]);

	useEffect(() => {
		if (id !== "0") {
			dispatch(getProfilebyID({ id: id || "" }));
		}
	}, [id]);
	const columns = [
		{
			title: "S.No",
			width: 30,
		},
		{
			title: "Name",
			width: 30,
		},
		{
			title: "Report",
			width: 30,
		},
		{
			title: "Entry",
			width: 30,
		},
		{
			title: "View",
			width: 30,
		},
		{
			title: "Actions",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		report: React.JSX.Element,
		entry: React.JSX.Element,
		view: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			report,
			entry,
			view,
			actions,
		};
	}

	const handleDeleteClick = (event: any, id: any) => {
		setCurrentId(id);
		setAnchorEl(event.currentTarget);
	};
	const handleDeleteClose = () => {
		setAnchorEl(null);
	};

	const confirmDelete = (deleteId: number) => {
		dispatch(
			deleteDataPermission({
				params: pageParams,
				id: deleteId,
			})
		);
		handleDeleteClose();
	};

	const [anchorEls, setAnchorEls] = useState<{
		[key: string]: HTMLElement | null;
	}>({});

	const handleClick = (
		event: React.MouseEvent<HTMLElement>,
		rowId: string | number
	) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: event.currentTarget }));
	};

	const handleClose = (rowId: string | number) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: null }));
	};

	const rows =
		list?.length != 0 &&
		list?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			const report = (
				<>
					{edit?.id == row?.id && edit?.bool ? (
						<FormInput
							control={editController}
							label={""}
							name="is_report"
							type="checkbox"
							containerSx={{
								mt: 2.5,
							}}
						/>
					) : row?.report ? (
						"Yes"
					) : (
						"No"
					)}
				</>
			);
			const view = (
				<>
					{edit?.id == row?.id && edit?.bool ? (
						<FormInput
							control={editController}
							label={""}
							name="is_view"
							type="checkbox"
							containerSx={{
								mt: 2.5,
							}}
						/>
					) : row?.view ? (
						"Yes"
					) : (
						"No"
					)}
				</>
			);
			const entry = (
				<>
					{edit?.id == row?.id && edit?.bool ? (
						<FormInput
							control={editController}
							label={""}
							name="is_entry"
							type="checkbox"
							containerSx={{
								mt: 2.5,
							}}
						/>
					) : row?.entry ? (
						"Yes"
					) : (
						"No"
					)}
				</>
			);

			console.log(edit);

			const actions = (
				<>
					<IconButton
						sx={{ px: "6px" }}
						tabIndex={key}
						onClick={(e) => handleClick(e, row.id ? row.id : "")}
						aria-controls={
							anchorEls[row?.id ? row.id : ""]
								? "account-menu"
								: undefined
						}
						aria-haspopup="true"
						aria-expanded={
							anchorEls[row?.id ? row.id : ""]
								? "true"
								: undefined
						}>
						<LuMoreHorizontal size={16} />
					</IconButton>

					<Menu
						anchorEl={anchorEls[row?.id ? row.id : ""]}
						id="account-menu"
						open={Boolean(anchorEls[row?.id ? row.id : ""])}
						onClose={() => handleClose(row?.id ? row.id : "")}
						PaperProps={{
							elevation: 0,
							sx: {
								overflow: "visible",
								filter: "drop-shadow(0px 1px 2px rgba(185, 185, 185, 0.32))",
								mt: 1.5,
								"& .MuiAvatar-root": {
									width: 32,
									height: 32,
									ml: -0.5,
									mr: 1,
								},
								"&:before": {
									content: '""',
									display: "block",
									position: "absolute",
									top: 0,
									right: 14,
									width: 10,
									height: 10,
									bgcolor: "background.paper",
									transform: "translateY(-50%) rotate(45deg)",
									zIndex: 0,
								},
							},
						}}
						transformOrigin={{
							horizontal: "right",
							vertical: "top",
						}}
						anchorOrigin={{
							horizontal: "right",
							vertical: "bottom",
						}}>
						{edit?.id != row?.id &&
							!edit?.bool &&
							userAccessList?.indexOf(
								"Users.change_datapermissions"
							) !== -1 && (
								<MenuItem
									onClick={() => {
										setFormState({
											...row,
											is_entry: row?.entry,
											is_view: row?.view,
											is_report: row?.report,
										});
										setEdit({
											id: row.id || 0,
											bool: true,
										});
										handleClose(row?.id ? row.id : "");
									}}>
									<Stack
										direction={"row"}
										alignItems={"center"}
										spacing={2}>
										<LuPencil
											style={{
												cursor: "pointer",
												color: "#fc6f03",
												fontSize: "10px",
											}}
										/>
										<Typography>Edit</Typography>
									</Stack>
								</MenuItem>
							)}

						{edit?.id == row?.id && edit?.bool && (
							<MenuItem
								onClick={() => {
									handleEditForm(onEditSave, (err) =>
										console.log(err)
									)();
									handleClose(row?.id ? row.id : "");
								}}>
								<Stack
									direction={"row"}
									alignItems={"center"}
									spacing={2}>
									<SaveOutlined
										style={{
											cursor: "pointer",
											color: "#fc6f03",
											fontSize: "16px",
										}}
									/>
									<Typography>Save</Typography>
								</Stack>
							</MenuItem>
						)}

						{edit?.id == row?.id && edit?.bool && (
							<MenuItem
								onClick={() => {
									setEdit({
										id: 0,
										bool: false,
									});
									handleClose(row?.id ? row.id : "");
								}}>
								<Stack
									direction={"row"}
									alignItems={"center"}
									spacing={2}>
									<CloseOutlined
										style={{
											cursor: "pointer",
											color: "#fc6f03",
											fontSize: "16px",
										}}
									/>
									<Typography>Close</Typography>
								</Stack>
							</MenuItem>
						)}

						{userAccessList?.indexOf(
							"Users.change_datapermissions"
						) !== -1 && (
							<>
								<MenuItem
									onClick={(e) => {
										handleDeleteClick(e, row?.id);
									}}>
									<Stack
										direction={"row"}
										alignItems={"center"}
										spacing={2}>
										<DeleteOutlined
											style={{
												cursor: "pointer",
												color: "#fc3503",
												fontSize: "16px",
											}}
										/>
										<Typography>Delete</Typography>
									</Stack>
								</MenuItem>
								<Popover
									id={
										currentId
											? String(currentId)
											: undefined
									}
									open={deleteOpen}
									anchorEl={anchorEl}
									onClose={handleDeleteClose}
									anchorOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
									transformOrigin={{
										vertical: "bottom",
										horizontal: "left",
									}}>
									<div style={{ padding: "15px" }}>
										<Typography
											variant="subtitle1"
											gutterBottom>
											Are you sure to delete this Record?
										</Typography>
										<Button
											variant="contained"
											type="submit"
											color="primary"
											onClick={() => {
												confirmDelete(currentId);
												handleClose(
													row?.id ? row.id : ""
												);
											}}
											autoFocus>
											Yes
										</Button>
										<Button
											variant="outlined"
											size="small"
											onClick={handleDeleteClose}
											style={{ marginLeft: "20px" }}>
											No
										</Button>
									</div>
								</Popover>
							</>
						)}
					</Menu>
				</>
			);

			return createData(
				index,
				row?.instance?.name || "",
				report,
				entry,
				view,
				actions
			);
		});

	const handleSort = (field: any) => {
		dispatch(
			getDataPermissions({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getDataPermissions({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};
	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getDataPermissions({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getDataPermissions({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	return (
		<div>
			<GoBack
				is_goback={true}
				title={`${profileData?.name} Permissions`}
				go_back_url={"/pages/settings/manage-profile"}
				showSaveButton={false}
				loading={false}
			/>
			<Divider
				sx={{
					my: 2,
				}}
			/>
			<Grid container spacing={2}>
				<Grid
					sx={{
						minWidth: "300px",
					}}
					size={{
						sm: 12,
						md: 3,
					}}>
					{isSmallScreen ? (
						<>
							<Button
								variant="outlined"
								onClick={() => setOpen(true)}>
								<MenuIcon />
							</Button>
							<Drawer open={open} onClose={() => setOpen(false)}>
								<Card
									sx={{
										px: 1,
										display: "flex",
										flexDirection: "column",
										justifyContent: "flex-start",
									}}>
									<CardHeader title={"Models List"} />
									<ModelItems
										selectedItem={selectedItem}
										handleSelect={handleSelect}
										styles={{
											maxHeight: "100vh",
										}}
									/>
								</Card>
							</Drawer>
						</>
					) : (
						<Card
							sx={{
								px: 1,
								display: "flex",
								flexDirection: "column",
								justifyContent: "flex-start",
							}}>
							<CardHeader title={"Models List"} />
							<List>
								<ModelItems
									selectedItem={selectedItem}
									handleSelect={handleSelect}
									styles={{
										maxHeight: "500px",
									}}
								/>
							</List>
						</Card>
					)}
				</Grid>
				<Grid
					size={{
						sm: 12,
						md: 12,
						lg: 8,
						xl: 9,
					}}>
					{selectedModelData?.id ? (
						<>
							<Typography variant="h4">
								{selectedModelData?.name} Permissions
							</Typography>
							<Grid
								sx={{
									mt: 1,
								}}
								size={{
									xs: 12,
								}}>
								<FormControlLabel
									control={
										<Checkbox
											checked={is_exclusion}
											onChange={(e) => {
												dispatch(
													postExcludePermission({
														model_path: `${selectedModelData?.contenttype?.app_label}.${selectedModelData?.contenttype?.model}`,
														group_id: id || "",
														exclusions:
															e.target.checked,
													})
												);
											}}
										/>
									}
									label="Exclude"
								/>
							</Grid>
							<Divider
								sx={{
									mt: 1,
								}}
							/>
							<Box pt={2}>
								<form
									onSubmit={handleSubmit(onFinish, (err) =>
										console.log(err)
									)}>
									<Grid container spacing={2}>
										<Grid
											size={{
												xs: 12,
												md: 8,
												lg: 4,
												xl: 3,
											}}>
											<SelectComponent
												required
												name="instance"
												label={`${selectedModelData?.name} Data`}
												multiple={false}
												control={control}
												rules={{
													required: true,
												}}
												options={modelDataList}
												loading={modelDataLoading}
												selectParams={{
													page: modelDataParams.page,
													page_size:
														modelDataParams.page_size,
													search: modelDataParams.search,
													no_of_pages:
														modelDataParams.no_of_pages,
													app_label:
														selectedModelData
															?.contenttype
															?.app_label,
													model: selectedModelData
														?.contenttype?.model,
												}}
												hasMore={
													modelDataParams.page <
													modelDataParams.no_of_pages
												}
												fetchapi={getModelData}
												clearData={clearModelData}
											/>
										</Grid>
										<Grid
											size={{
												xs: 12,
												md: 12,
												lg: 6,
												xl: 4,
											}}>
											<Grid
												container
												spacing={2}
												sx={{
													mx: 2,
													justifyContent:
														"space-between",
												}}>
												<Grid
													size={{
														xs: 12,
														md: 3,
														lg: 3,
													}}>
													<FormInput
														control={control}
														label={"Report"}
														name="is_report"
														type="checkbox"
														containerSx={{
															mt: 2.5,
														}}
													/>
												</Grid>
												<Grid
													size={{
														xs: 12,
														md: 3,
														lg: 3,
													}}>
													<FormInput
														control={control}
														label={"Entry"}
														name="is_entry"
														type="checkbox"
														containerSx={{
															mt: 2.5,
														}}
													/>
												</Grid>
												<Grid
													size={{
														xs: 12,
														md: 3,
														lg: 3,
													}}>
													<FormInput
														control={control}
														label={"View"}
														name="is_view"
														type="checkbox"
														containerSx={{
															mt: 2.5,
														}}
													/>
												</Grid>
											</Grid>
										</Grid>

										<Grid
											size={{
												xs: 12,
												md: 6,
												lg: 3,
											}}>
											<LoadingButton
												sx={{
													marginTop: "1.5rem",
												}}
												variant={"contained"}
												type="submit"
												loading={loading}>
												Submit
											</LoadingButton>
										</Grid>
									</Grid>
								</form>
							</Box>
							<Divider
								sx={{
									my: 2,
								}}
							/>
							<Box>
								<Card
									sx={{
										px: 2,
										pt: 2,
									}}>
									<TableComponent
										count={count}
										columns={columns}
										rows={rows ? rows : []}
										loading={loading}
										page={pageParams.page}
										pageSize={pageParams.page_size}
										handleSort={handleSort}
										handleChangePage={handleChangePage}
										handleChangeRowsPerPage={
											handleChangeRowsPerPage
										}
									/>
								</Card>
							</Box>
						</>
					) : (
						<Stack
							justifyContent={"center"}
							alignItems={"center"}
							height={"100%"}
							flex={1}
							spacing={2}>
							<Typography variant={"h3"}>
								Click on the Menu
							</Typography>
							<Typography>
								Select an item from the menu to view details.
							</Typography>
							<br />
						</Stack>
					)}
				</Grid>
			</Grid>
		</div>
	);
};

export default DataPermission;
