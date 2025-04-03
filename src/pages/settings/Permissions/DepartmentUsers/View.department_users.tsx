import React, { ChangeEvent, useEffect } from "react";
import {
	Grid,
	Paper,
	Typography,
	Tabs,
	Tab,
	Box,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableContainer,
	IconButton,
	Card,
	styled,
	tableCellClasses,
	CardContent,
	TablePagination,
} from "@mui/material";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	selectManageUsers,
	setUserLoginParams,
	setUserDeviceParams,
} from "@src/store/settings/manageUsers/manage_users.slice";
import { systemSelector } from "@src/store/system/system.slice";
import {
	getUserActivityList,
	getUserById,
	getUserDeviceList,
	getUserLoginList,
} from "@src/store/settings/manageUsers/manage_users.action";
import { useNavigate, useParams } from "react-router-dom";
import GoBack from "@src/components/GoBack";
import moment from "moment";
import { LuArrowLeftCircle } from "react-icons/lu";

// Define types for the user and table data

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.grey[100],
		color: theme.palette.primary,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const UserDetails = () => {
	const [activeTab, setActiveTab] = useState(0);
	const navigate = useNavigate();

	const {
		manageUser: {
			loginLoading,
			userLoginParams,
			userLoginList,
			loginCount,
			deviceLoading,
			userDeviceParams,
			userDeviceList,
			userDeviceCount,
			useActivityCount,
			activityLoading,
			userActivityParams,
			userActivityList,
			selectedData,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			manageUser: selectManageUsers(state),
			system: systemSelector(state),
		};
	});
	const dispatch = useAppDispatch();
	const { id } = useParams();

	useEffect(() => {
		dispatch(getUserById({ id: id ? id : "" }));
	}, []);
	useEffect(() => {
		if (selectedData) {
			console.log("userLoginParams", userLoginParams);
			dispatch(
				getUserLoginList({
					params: userLoginParams,
					username: selectedData?.username || "",
					user_type: localStorage.getItem("user_type") || "",
				})
			);
		}
	}, [selectedData]);

	const handleTabChange = (event: React.SyntheticEvent, tabValue: number) => {
		setActiveTab(tabValue);
		if (tabValue == 0) {
			dispatch(
				getUserLoginList({
					params: {
						...userLoginParams,
						search: "",
						page: 1,
					},
					username: selectedData?.username || "",
					user_type: localStorage.getItem("user_type") || "",
				})
			);
		} else if (tabValue == 1) {
			dispatch(
				getUserDeviceList({
					params: {
						...userDeviceParams,
						search: "",
						page: 1,
					},
					username: selectedData?.username || "",
					user_type: localStorage.getItem("user_type") || "",
				})
			);
		} else if (tabValue == 2) {
			dispatch(
				getUserActivityList({
					params: {
						...userActivityParams,
						search: "",
						page: 1,
					},
					id: id,
				})
			);
		}
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		if (activeTab == 0) {
			dispatch(
				getUserLoginList({
					params: {
						...userLoginParams,
						page: newPage + 1,
					},
					username: selectedData?.username || "",
					user_type: localStorage.getItem("user_type") || "",
				})
			);
		} else if (activeTab == 1) {
			dispatch(
				getUserDeviceList({
					params: {
						...userDeviceParams,
						page: newPage + 1,
					},
					username: selectedData?.username || "",
					user_type: localStorage.getItem("user_type") || "",
				})
			);
		} else if (activeTab == 2) {
			dispatch(
				getUserActivityList({
					params: {
						...userActivityParams,
						page: newPage + 1,
					},
					id: id,
				})
			);
		}
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		if (activeTab == 0) {
			dispatch(
				setUserLoginParams({
					...userLoginParams,
					page_size: parseInt(event.target.value),
					username: selectedData.username,
					user_type: localStorage.getItem("user_type"),
					page: userLoginParams.page,
				})
			);
			dispatch(
				getUserLoginList({
					params: {
						...userLoginParams,
						search: "",
						page: 1,
						page_size: parseInt(event.target.value),
					},
					username: selectedData?.username || "",
					user_type: localStorage.getItem("user_type") || "",
				})
			);
		} else if (activeTab == 1) {
			dispatch(
				setUserDeviceParams({
					...userDeviceParams,
					page_size: parseInt(event.target.value),
					username: selectedData.username,
					user_type: localStorage.getItem("user_type"),
					page:
						userDeviceParams.page == 0 ? 1 : userDeviceParams.page,
				})
			);
			dispatch(
				getUserDeviceList({
					params: {
						...userDeviceParams,
						search: "",
						page: 1,
						page_size: parseInt(event.target.value),
					},
					username: selectedData?.username,
					user_type: localStorage.getItem("user_type") || "",
				})
			);
		} else if (activeTab == 2) {
			dispatch(
				getUserActivityList({
					params: {
						...userActivityParams,
						search: "",
						page: 1,
						page_size: parseInt(event.target.value),
					},
					id: id,
				})
			);
		}
	};

	return (
		<>
			<Box
				sx={{
					my: 2,
				}}>
				<Card>
					<CardContent>
						<Typography
							variant="h4"
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 2,
								cursor: "pointer",
							}}
							onClick={() => {
								navigate("/pages/settings/manage-users", {
									relative: "path",
								});
							}}>
							<LuArrowLeftCircle />
							User Details
						</Typography>
						<Box p={4}>
							<Grid container spacing={2}>
								<Grid item xs={2}>
									{/* Image Placeholder */}
									<Paper
										elevation={3}
										sx={{
											height: 100,
											width: 100,
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}>
										<PersonIcon style={{ fontSize: 50 }} />
									</Paper>
								</Grid>

								<Grid item xs={10}>
									<Grid container spacing={2}>
										<Grid item xs={3}>
											<Typography
												variant="h5"
												color="text.primary">
												User Name
											</Typography>
											<Typography>
												{selectedData?.username}
											</Typography>
										</Grid>
										<Grid item xs={3}>
											<Typography
												variant="h5"
												color="text.primary">
												Full Name
											</Typography>
											<Typography>
												{selectedData?.fullname}
											</Typography>
										</Grid>
										<Grid item xs={3}>
											<Typography
												variant="h5"
												color="text.primary">
												Email
											</Typography>
											<Typography>
												{selectedData?.email}
											</Typography>
										</Grid>
										<Grid item xs={3}>
											<Typography
												variant="h5"
												color="text.primary">
												Mobile Number
											</Typography>
											<Typography>
												{selectedData?.phone}
											</Typography>
										</Grid>
										<Grid item xs={3}>
											<Typography
												variant="h5"
												color="text.primary">
												Gender
											</Typography>
											<Typography>
												{selectedData?.gender_name}
											</Typography>
										</Grid>
										<Grid item xs={3}>
											<Typography
												variant="h5"
												color="text.primary">
												Device Access
											</Typography>
											<Typography>
												{
													selectedData?.device_access_name
												}
											</Typography>
										</Grid>

										<Grid item xs={3}>
											<Typography
												variant="h5"
												color="text.primary">
												Location
											</Typography>
											{selectedData?.locations?.map(
												(loc: {
													label: string;
													value: string;
												}) => {
													return (
														<Typography>
															{" "}
															{loc?.label}
														</Typography>
													);
												}
											)}
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</Box>

			<Card sx={{ padding: 2, border: "none", marginTop: "20px" }}>
				<Box>
					<Tabs value={activeTab} onChange={handleTabChange}>
						<Tab label="Logins" />
						<Tab label="Devices" />
						<Tab label="Activity" />
					</Tabs>

					{activeTab === 0 && (
						<Box>
							<TableContainer component={Paper}>
								<Table
									sx={{ minWidth: 700 }}
									aria-label="customized table">
									<TableHead>
										<TableRow>
											<StyledTableCell>
												S.No
											</StyledTableCell>
											<StyledTableCell>
												Device Name
											</StyledTableCell>
											<StyledTableCell>
												Device Type
											</StyledTableCell>
											<StyledTableCell>
												Login
											</StyledTableCell>
											<StyledTableCell>
												Logout
											</StyledTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{userLoginList?.length > 0 ? (
											userLoginList?.map((row, index) => (
												<TableRow key={row.id}>
													<TableCell>
														{index + 1}
													</TableCell>
													<TableCell>
														{row.name}
													</TableCell>
													<TableCell>
														{row.device?.type_name}
													</TableCell>
													<TableCell>
														{moment(
															row.login
														).format(
															"DD-MM-YYYY, h:mm:ss a"
														)}
													</TableCell>
													<TableCell>
														{" "}
														{moment() <
														moment(row.logout) ? (
															<span>Active</span>
														) : (
															moment(
																row.logout
															).format(
																"DD-MM-YYYY, h:mm:ss a"
															)
														)}
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell
													colSpan={5}
													align="center">
													<Box
														display="flex"
														flexDirection="column"
														justifyContent="center"
														alignItems="center"
														height={150}>
														{/* <PersonIcon style={{ fontSize: 50 }} /> */}
														<Typography>
															No data
														</Typography>
													</Box>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</TableContainer>
							<TablePagination
								rowsPerPageOptions={[
									10,
									20,
									50,
									100,
									{ label: "All", value: -1 },
								]}
								component="div"
								count={loginCount}
								rowsPerPage={userLoginParams.page_size}
								page={userLoginParams.page - 1}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Box>
					)}

					{activeTab === 1 && (
						<Box>
							{/* Table for Devices */}
							<TableContainer component={Paper}>
								<Table
									sx={{ minWidth: 700 }}
									aria-label="customized table">
									<TableHead>
										<TableRow>
											<StyledTableCell>
												S.No
											</StyledTableCell>
											<StyledTableCell>
												Device Name
											</StyledTableCell>
											<StyledTableCell>
												Device Type
											</StyledTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{userDeviceList?.length > 0 ? (
											userDeviceList.map(
												(device, index) => (
													<TableRow key={device.id}>
														<TableCell>
															{index + 1}
														</TableCell>
														<TableCell>
															{device.name}
														</TableCell>
														<TableCell>
															{device.type_name}
														</TableCell>
													</TableRow>
												)
											)
										) : (
											<TableRow>
												<TableCell
													colSpan={3}
													align="center">
													<Box
														display="flex"
														flexDirection="column"
														justifyContent="center"
														alignItems="center"
														height={150}>
														{/* <PersonIcon style={{ fontSize: 50 }} /> */}
														<Typography>
															No data
														</Typography>
													</Box>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</TableContainer>
							<TablePagination
								rowsPerPageOptions={[
									10,
									20,
									50,
									100,
									{ label: "All", value: -1 },
								]}
								component="div"
								count={userDeviceCount}
								rowsPerPage={userDeviceParams.page_size}
								page={userDeviceParams.page - 1}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Box>
					)}

					{activeTab === 2 && (
						<Box>
							{/* Table for Activity */}
							<TableContainer component={Paper}>
								<Table
									sx={{ minWidth: 700 }}
									aria-label="customized table">
									<TableHead>
										<TableRow>
											<StyledTableCell>
												S.No
											</StyledTableCell>
											<StyledTableCell>
												Date
											</StyledTableCell>
											<StyledTableCell>
												Table Name
											</StyledTableCell>
											<StyledTableCell>
												Type Name
											</StyledTableCell>
											<StyledTableCell>
												User Name
											</StyledTableCell>
											<StyledTableCell>
												Employee Code
											</StyledTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{userActivityList?.length > 0 ? (
											userActivityList.map(
												(act, index) => (
													<TableRow key={act.id}>
														<TableCell>
															{index + 1}
														</TableCell>
														<TableCell>
															{moment(
																act.createdon
															).format(
																"DD-MM-YYYY, h:mm:ss a"
															)}
														</TableCell>
														<TableCell>
															{act.tablename}
														</TableCell>
														<TableCell>
															{act.type_name}
														</TableCell>
														<TableCell>
															{act.user?.fullname}
														</TableCell>
														<TableCell>
															{act.user?.username}
														</TableCell>
													</TableRow>
												)
											)
										) : (
											<TableRow>
												<TableCell
													colSpan={6}
													align="center">
													<Box
														display="flex"
														flexDirection="column"
														justifyContent="center"
														alignItems="center"
														height={150}>
														{/* <PersonIcon style={{ fontSize: 50 }} /> */}
														<Typography>
															No data
														</Typography>
													</Box>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</TableContainer>
							<TablePagination
								rowsPerPageOptions={[
									10,
									20,
									50,
									100,
									{ label: "All", value: -1 },
								]}
								component="div"
								count={useActivityCount}
								rowsPerPage={userActivityParams.page_size}
								page={userActivityParams.page - 1}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Box>
					)}
				</Box>
				{/* </Box> */}
			</Card>
		</>
	);
};

export default UserDetails;
