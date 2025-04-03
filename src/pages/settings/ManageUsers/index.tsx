import React, {
	ChangeEvent,
	Dispatch,
	Fragment,
	useEffect,
	useState,
} from "react";
("@mui/material/TablePagination/TablePaginationActions");
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	getUserById,
	getUsers,
	updatePassword,
	userActive,
	userInActive,
} from "@src/store/settings/manageUsers/manage_users.action";
import * as yup from "yup";
import {
	selectManageUsers,
	setIsPasswordModel,
	setSelectedData,
} from "@src/store/settings/manageUsers/manage_users.slice";
import TableComponent from "@src/components/TableComponenet";
import { systemSelector } from "@src/store/system/system.slice";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
	LuEye,
	LuMoreHorizontal,
	LuMoreVertical,
	LuPencil,
	LuRectangleHorizontal,
	LuX,
} from "react-icons/lu";
import TopComponent from "../TopComponent";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	FormControlLabel,
	Grid,
	Grid2,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Switch,
	Typography,
} from "@mui/material";
import { FormInput, PageBreadcrumb, ThumbnailView } from "@src/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const ManageGroups = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();

	const {
		manageUser: {
			usersList,
			passwordModel,
			pageParams,
			loading,
			usersCount,
			selectedData,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			manageUser: selectManageUsers(state),
			system: systemSelector(state),
		};
	});

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "UserName",
			width: 100,
		},
		{
			title: "Full Name",
			width: 100,
		},
		{
			title: "Email",
			width: 100,
		},
		{
			title: "Phone",
			width: 100,
		},
		// {
		// 	title: "Password",
		// 	width: 100,
		// },
		{
			title: "Group",
			width: 100,
		},
		{
			title: "Status",
			width: 100,
		},
		{
			title: "Actions",
			width: 100,
		},
	];

	function createData(
		index: number,
		username: string,
		fullname: string,
		email: string,
		phone: string,
		// password: false | React.JSX.Element,
		group: string,
		status: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			username,
			fullname,
			email,
			phone,
			// password,
			group,
			status,
			actions,
		};
	}

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

	const rows = usersList.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		// const password = userAccessList?.indexOf("Users.change_user") !==
		// 	-1 && (
		// 	<Button
		// 		size={"small"}
		// 		disabled={
		// 			!row.is_active &&
		// 			userAccessList?.indexOf("Users.change_user") !== -1
		// 		}
		// 		onClick={() => {
		// 			dispatch(setIsPasswordModel(true));
		// 			dispatch(setSelectedData(row));
		// 		}}>
		// 		Change Password
		// 	</Button>
		// );
		const group = row?.groups
			?.map((group: { name: string; id: string }) => {
				return group?.name;
			})
			.join(", ");

		console.log(group);
		const status =
			// <FormControlLabel
			// 	control={
			// 		<Switch
			// 			checked={row.is_active}
			// 			onChange={(event) => {
			// 				if (event.target.checked) {
			// 					dispatch(
			// 						userActive({
			// 							id: row.id || "",
			// 							pageParams,
			// 						})
			// 					);
			// 				} else {
			// 					dispatch(
			// 						userInActive({
			// 							id: row.id || "",
			// 							pageParams,
			// 						})
			// 					);
			// 				}
			// 			}}
			// 		/>
			// 	}
			// 	label={row.is_active ? "Active" : "In Active"}
			// />

			row.is_active ? (
				<Typography color="success">Active</Typography>
			) : (
				<Typography color="error">In Active</Typography>
			);

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
					{userAccessList?.indexOf("auth.change_group") !== -1 && (
						<MenuItem
							onClick={() => {
								handleClose(row?.id ? row.id : "");
								navigate(
									`/pages/settings/manage-users/${row.id}`
								);
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
					<MenuItem
						onClick={() => {
							handleClose(row?.id ? row.id : "");
							dispatch(setSelectedData({}));
							dispatch(
								getUserById({
									id: row.id ? row.id : "",
								})
							);
							navigate(
								`/pages/settings/manage-users/${row.id}/view`
							);
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
					<MenuItem
						disabled={
							!row.is_active &&
							userAccessList?.indexOf("Users.change_user") !== -1
						}
						onClick={() => {
							dispatch(setIsPasswordModel(true));
							dispatch(setSelectedData(row));
							handleClose(row?.id ? row.id : "");
						}}>
						<Stack
							direction={"row"}
							alignItems={"center"}
							spacing={2}>
							<LuRectangleHorizontal
								style={{
									cursor: "pointer",
									color: "#fc6f03",
								}}
							/>
							<Typography>Change Password</Typography>
						</Stack>
					</MenuItem>
					<Divider />
					<MenuItem>
						<Stack
							direction={"row"}
							alignItems={"center"}
							spacing={2}>
							<FormControlLabel
								control={
									<Switch
										checked={row.is_active}
										onChange={(event) => {
											if (event.target.checked) {
												dispatch(
													userActive({
														id: row.id || "",
														pageParams,
													})
												);
											} else {
												dispatch(
													userInActive({
														id: row.id || "",
														pageParams,
													})
												);
											}
											handleClose(row?.id ? row.id : "");
										}}
									/>
								}
								label={row.is_active ? "Active" : "In Active"}
							/>
						</Stack>
					</MenuItem>
				</Menu>
			</>
		);

		return createData(
			index,
			row.username || "",
			row.fullname || "",
			row.email || "",
			row.phone || "",
			// password,
			group || "",
			status,
			actions
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getUsers({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getUsers({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getUsers({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getUsers({
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext.setTitle("Manage Users");
		outletContext.setSubtitle("Settings");
	}, []);

	const userSchema = yup.object().shape({
		newPassword: yup
			.string()
			.min(8, "Password must be at least 8 characters long")
			.required("New Password is required"),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref("newPassword"), ""], "Passwords must match")
			.required("Confirm Password is required"),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(userSchema), // Use yup resolver for validation
	});

	const onSubmit = (data: any) => {
		const obj = {
			password: data.newPassword,
		};
		dispatch(
			updatePassword({ id: selectedData?.id || "", obj, pageParams })
		);
		dispatch(setIsPasswordModel(false));
		// reset();
	};
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getUsers({
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
				permissionPostFix="user"
				navigateLink={"/pages/settings/manage-users/0"}
				showAddButton={true}
				showFilterButton={false}
				addButtonName="Add User"
				handleSearch={handleSearch}
				handleInputChange={handleInputChange}
			/>
			<TableComponent
				count={usersCount}
				columns={columns}
				rows={rows}
				loading={loading}
				page={pageParams.page}
				pageSize={pageParams.page_size}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>

			<Dialog
				open={passwordModel}
				onClose={() => dispatch(setIsPasswordModel(false))}
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
					Change Password
					<IconButton
						onClick={() => dispatch(setIsPasswordModel(false))}>
						<LuX
						//  color="white"
						/>
					</IconButton>
				</DialogTitle>
				<Divider />
				<DialogContent
					sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
					<DialogContentText
						id="alert-dialog-description"
						sx={{
							width: 500,
						}}>
						<form
							style={{ width: "100%" }}
							onSubmit={handleSubmit(onSubmit)}>
							<Grid container spacing={1}>
								{/* Old Password */}
								<Grid item xs={12} md={12}>
									<FormInput
										name="newPassword"
										label="New Password"
										type="password"
										placeholder="Enter new password"
										control={control}
										error={!!errors.newPassword}
										helperText={errors.newPassword?.message}
									/>
								</Grid>
								<Grid item xs={12} md={12}>
									<FormInput
										name="confirmPassword"
										label="Confirm Password"
										type="password"
										placeholder="Confirm new password"
										control={control}
										error={!!errors.confirmPassword}
										helperText={
											errors.confirmPassword?.message
										}
									/>
								</Grid>
							</Grid>
							<DialogActions sx={{ p: 2 }}>
								<Button
									onClick={() =>
										dispatch(setIsPasswordModel(false))
									}
									variant="outlined"
									color="secondary">
									Cancel
								</Button>
								{/* {edit_Id == undefined || edit_Id == 0 ? */}
								<Button
									variant="contained"
									type="submit"
									color="primary"
									autoFocus>
									Submit
								</Button>
								{/* :
									<Button
										variant="contained"
										type="submit"
										color="primary"
										autoFocus>
										Update
									</Button>
								} */}
							</DialogActions>
						</form>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ManageGroups;
