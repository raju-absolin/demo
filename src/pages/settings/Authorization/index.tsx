import React, {
	ChangeEvent,
	Dispatch,
	Fragment,
	SyntheticEvent,
	useEffect,
	useState,
} from "react";
("@mui/material/TablePagination/TablePaginationActions");
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	deleteAuthorization,
	getAuthorizationById,
	getAuthorizations,
	getScreenAuthorizations,
} from "@src/store/settings/Authorization/authorization.action";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import TableComponent from "@src/components/TableComponenet";
import { systemSelector } from "@src/store/system/system.slice";
import { Link, useOutletContext } from "react-router-dom";
import {
	LuEye,
	LuMoreHorizontal,
	LuMoreVertical,
	LuPencil,
	LuPlus,
	LuPlusCircle,
	LuTrash2,
} from "react-icons/lu";
import TopComponent from "../TopComponent";
import {
	isModelVisible,
	setSelectedData,
	AuthorizationSelector,
	setViewModel,
	useAuthorizationSelector,
} from "@src/store/settings/Authorization/authorization.slice";
import AddAuthorization from "./add.authorization";

import {
	Box,
	Button,
	IconButton,
	InputLabel,
	Menu,
	MenuItem,
	Popover,
	Stack,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import ViewAuthorization from "./viewauthorization";
import { getAllContentTypes } from "@src/store/mini/mini.Action";
import { clearMiniAllContentTypes } from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const AuthorizationPermissions = () => {
	const dispatch = useAppDispatch();
	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();

	const {
		authorization: {
			loading,
			authorizationCount,
			authorizationList,
			pageParams,
			model,
			formRowsParams,
		},
		mini: { miniAllContentTypes },
		system: { userAccessList },
	} = useAuthorizationSelector();

	const [anchorEl, setAnchorEl] = useState(null);
	const deleteOpen = Boolean(anchorEl);
	const [currentId, setCurrentId] = useState(null);

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Screen",
			width: 100,
		},
		{
			title: "Level",
			width: 100,
		},
		// {
		//     title: "Final Authorization",
		//     width: 100,
		// },
		{
			title: "Actions",
			width: 100,
		},
	];
	const handleDeleteClick = (event: any, id: any) => {
		setCurrentId(id);
		setAnchorEl(event.currentTarget);
	};
	const handleDeleteClose = () => {
		setAnchorEl(null);
	};
	const confirmDelete = (deleteId: any) => {
		dispatch(
			deleteAuthorization({
				id: deleteId,
				pageParams,
			})
		);
		handleDeleteClose();
	};
	function createData(
		index: number,
		screen: string,
		levelno: number | string,
		actions: React.JSX.Element
	) {
		return {
			index,
			screen,
			levelno,
			actions,
		};
	}

	const { control } = useForm<any>();

	const [anchorEls, setAnchorEls] = useState<{
		[key: string]: HTMLElement | null;
	}>({});

	const handleClick = (
		event: React.MouseEvent<HTMLElement>,
		rowId: string
	) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: event.currentTarget }));
	};

	const handleClose = (rowId: string) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: null }));
	};

	const rows = authorizationList?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

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
						anchorEls[row?.id ? row.id : ""] ? "true" : undefined
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
					{userAccessList?.indexOf(
						"Users.change_authorizationdefnition"
					) !== -1 && (
						<MenuItem
							onClick={() => {
								dispatch(
									getAuthorizationById({
										id: row?.id || "",
									})
								);
								dispatch(
									getScreenAuthorizations({
										...formRowsParams,
										page: 1,
										page_size: 10,
										screen: row?.screen?.value || null,
										// level: row?.level || "",
									})
								);
								dispatch(isModelVisible(true));
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
					{userAccessList?.indexOf(
						"Users.view_authorizationdefnition"
					) !== -1 && (
						<MenuItem
							onClick={() => {
								dispatch(
									getAuthorizationById({
										id: row?.id || "",
									})
								);
								dispatch(
									getScreenAuthorizations({
										...formRowsParams,
										page: 1,
										page_size: 10,
										screen: row?.screen?.value || null,
									})
								);
								dispatch(setViewModel(true));
								handleClose(row?.id ? row.id : "");
							}}>
							<Stack
								direction={"row"}
								alignItems={"center"}
								spacing={2}>
								<LuEye
									style={{
										cursor: "pointer",
										color: "#fc6f03",
									}}
								/>
								<Typography>View</Typography>
							</Stack>
						</MenuItem>
					)}
					{userAccessList?.indexOf(
						"Users.delete_authorizationdefnition"
					) !== -1 && (
						<MenuItem
							onClick={(e) => {
								handleDeleteClick(e, row?.id);
							}}>
							<Stack
								direction={"row"}
								alignItems={"center"}
								spacing={2}>
								<LuTrash2
									style={{
										cursor: "pointer",
										color: "#fc6f03",
										// fontSize: 16,
									}}
								/>
								<Typography>Delete</Typography>
							</Stack>
						</MenuItem>
					)}
				</Menu>
				<Box
					sx={{
						display: "flex",
						gap: 2,
						justifyContent: "start",
					}}>
					{userAccessList?.indexOf(
						"Users.delete_authorizationdefnition"
					) !== -1 && (
						<>
							<Popover
								id={currentId ? String(currentId) : undefined}
								open={deleteOpen}
								anchorEl={anchorEl}
								onClose={() => {
									handleDeleteClose();
									handleClose(row?.id ? row.id : "");
								}}
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
										}}
										autoFocus>
										Yes
									</Button>
									<Button
										variant="outlined"
										size="small"
										onClick={() => {
											handleDeleteClose();
											handleClose(row?.id ? row.id : "");
										}}
										style={{ marginLeft: "20px" }}>
										No
									</Button>
								</div>
							</Popover>
						</>
					)}
				</Box>
			</>
		);
		return createData(
			index,
			row?.screen?.model || "",
			row?.level || "",
			actions
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getAuthorizations({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getAuthorizations({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getAuthorizations({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	useEffect(() => {
		dispatch(
			getAuthorizations({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext.setTitle("Authorization");
		outletContext.setSubtitle("Settings");
	}, []);

	const openModal = (value: boolean) => {
		dispatch(setSelectedData({}));
		dispatch(isModelVisible(value));
	};
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getAuthorizations({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	return (
		<>
			<TopComponent
				permissionPreFix="Users"
				permissionPostFix="authorizationdefnition"
				navigateLink={""}
				showAddButton={false}
				addButtonName="Add Authorization"
				openModal={openModal}
				handleSearch={handleSearch}
				showFilterButton={false}
				filteredData={pageParams}
				handleInputChange={handleInputChange}>
				<Stack
					sx={{
						flexDirection: {
							xs: "row",
						},
						gap: 1,
					}}>
					<Stack
						direction={"row"}
						justifyContent={"center"}
						alignItems={"center"}
						spacing={2}
						sx={{
							marginTop: "-7px !important",
						}}>
						<InputLabel
							sx={{
								".MuiInputLabel-asterisk": {
									color: "red",
								},
							}}
							id={"screen"}
							style={{
								fontWeight: "medium",
								// marginBottom: "7px",
								marginTop: "7px",
							}}>
							Screen :
						</InputLabel>
						<Box>
							<SelectComponent
								name="screen"
								label=""
								placeholder="Select a screen"
								control={control}
								options={miniAllContentTypes.list?.map(
									(e: {
										contenttype: {
											id: number;
										};
										id: number;
										name: string;
									}) => ({
										id: e?.contenttype?.id,
										name: e.name,
									})
								)}
								onChange={(value) => {
									dispatch(
										getAuthorizations({
											...pageParams,
											search: "",
											page: 1,
											page_size: 10,
											screen: value.value || "",
										})
									);
								}}
								loading={miniAllContentTypes.loading}
								selectParams={{
									page: miniAllContentTypes.miniParams.page,
									page_size:
										miniAllContentTypes.miniParams
											.page_size,
									search: miniAllContentTypes.miniParams
										.search,
									no_of_pages:
										miniAllContentTypes.miniParams
											.no_of_pages,
								}}
								hasMore={
									miniAllContentTypes.miniParams.page <
									miniAllContentTypes.miniParams.no_of_pages
								}
								fetchapi={getAllContentTypes}
								clearData={clearMiniAllContentTypes}
							/>
						</Box>
					</Stack>

					<Box>
						{userAccessList?.indexOf(
							`Users.add_authorizationdefnition`
						) !== -1 && (
							<Button
								variant="contained"
								color="primary"
								size="large"
								endIcon={<LuPlusCircle size={"16px"} />}
								onClick={(event: SyntheticEvent) => {
									const target =
										event.target as HTMLButtonElement;
									openModal(true);
									target.blur();
								}}>
								Add Authorization
							</Button>
						)}
					</Box>
				</Stack>
			</TopComponent>
			<TableComponent
				count={authorizationCount}
				columns={columns}
				rows={rows}
				loading={loading}
				page={pageParams.page}
				pageSize={pageParams.page_size}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>

			<AddAuthorization modal={model} setModalOpen={openModal} />
			<ViewAuthorization />
		</>
	);
};

export default AuthorizationPermissions;
