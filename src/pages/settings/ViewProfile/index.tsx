import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
	Box,
	Avatar,
	Typography,
	Card,
	Grid2 as Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	ListItemButton,
	Stack,
	Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import DevicesIcon from "@mui/icons-material/Devices";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { userProfileSelector } from "@src/store/userprofile/profile.slice";
import {
	ChangePasswordSubmit,
	getUserDetails,
	getUserDeviceList,
	getUserLogList,
} from "@src/store/userprofile/profile.action";
import TableComponent from "@src/components/TableComponenet";
import moment from "moment";
import { FormInput } from "@src/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const ViewProfile = () => {
	const dispatch = useAppDispatch();
	const [selectedIndex, setSelectedIndex] = useState(0);

	const {
		userProfile: {
			profilesList,
			userActivityList,
			selectedData,
			profileActivityParams,
			userActivityCount,
			loading,
			profileDeviceList,
			profileDeviceCount,
			profileDeviceParams,
		},
	} = useAppSelector((state) => {
		return {
			userProfile: userProfileSelector(state),
		};
	});

	useEffect(() => {
		dispatch(getUserDetails());
	}, []);

	const user = {
		profilePicture: "",
		name: profilesList?.username,
		email: profilesList?.email,
		mobile: profilesList?.phone,
		personalInfo: {
			profileName: profilesList?.username,
			firstName: profilesList?.first_name,
			lastName: profilesList?.last_name,
			email: profilesList?.email,
			phone: profilesList?.phone,
			gender: profilesList?.gender_name,
			address: profilesList?.address,
		},
	};

	const handleListItemClick = (index: number) => {
		setSelectedIndex(index);
		reset();
		if (index === 1) {
			dispatch(
				getUserLogList({
					...profileActivityParams,
					page: 1,
					page_size: 10,
				})
			);
		} else if (index === 2) {
			dispatch(
				getUserDeviceList({
					...profileDeviceParams,
					page: 1,
					page_size: 10,
				})
			);
		}
	};

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Device Name",
			width: 100,
		},
		{
			title: "Device Type",
			width: 100,
		},
		{
			title: "Login",
			width: 100,
		},
		{
			title: "Logout",
			width: 100,
		},
	];

	function createData(
		index: number,
		device_name?: string,
		device_type?: string,
		login?: string,
		logout?: string
	) {
		return {
			index,
			device_name,
			device_type,
			login,
			logout,
		};
	}

	const rows = useMemo(() => {
		return userActivityList?.map((row, key) => {
			const index =
				(profileActivityParams.page - 1) *
					profileActivityParams.page_size +
				(key + 1);

			return createData(
				index,
				row?.device?.name,
				row?.device?.type_name,
				moment(row?.login).format("LLL"),
				moment(row?.logout).format("LLL")
			);
		});
	}, [userActivityList, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getUserLogList({
				...profileActivityParams,
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getUserLogList({
				...profileActivityParams,
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleDeviceChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getUserDeviceList({
				...profileDeviceParams,
				page: newPage + 1,
			})
		);
	};

	const handleDeviceChangeRowsPerPage = (
		event: ChangeEvent<HTMLInputElement>
	) => {
		dispatch(
			getUserDeviceList({
				...profileDeviceParams,
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	const devicecolumns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Code",
			width: 100,
		},
		{
			title: "Device Name",
			width: 100,
		},
		{
			title: "Device Type",
			width: 100,
		},
		{
			title: "Status",
			width: 100,
		},
	];

	function devicecreateData(
		index: number,
		code?: string,
		device_name?: string,
		device_type?: string,
		is_active?: string
	) {
		return {
			index,
			code,
			device_name,
			device_type,
			is_active,
		};
	}
	const deviceRows = useMemo(() => {
		return profileDeviceList?.map((row, key) => {
			const index =
				(profileDeviceParams.page - 1) * profileDeviceParams.page_size +
				(key + 1);
			return devicecreateData(
				index,
				row?.code,
				row?.name,
				row?.type_name,
				row?.is_active == true ? "Active" : "In Active"
			);
		});
	}, [profileDeviceList, devicecreateData]);

	const passwordSchema = yup.object().shape({
		old_password: yup
			.string()
			.trim()
			.required("Please enter your old password"),
		newPassword: yup
			.string()
			.trim()
			.required("Please enter your new password"),
		password: yup
			.string()
			.trim()
			.oneOf(
				[yup.ref("newPassword")],
				"Password doesn't match with new password"
			)
			.required("Please enter your password"),
	});

	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(passwordSchema),
		values: {
			old_password: selectedData?.old_password
				? selectedData?.old_password
				: "",
			newPassword: selectedData?.newPassword
				? selectedData?.newPassword
				: "",
			password: selectedData?.password ? selectedData?.password : "",
		},
	});

	const onSubmit = (data: any) => {
		dispatch(ChangePasswordSubmit({ data, reset }));
	};
	return (
		<Box sx={{ py: 2 }}>
			<Card sx={{ padding: 3, marginBottom: 2 }}>
				<Typography variant="h4">View Profile</Typography>
			</Card>

			<Grid container spacing={2}>
				<Grid size={{ xs: 12, md: 3 }}>
					<Card sx={{ padding: 3 }}>
						<List>
							<ListItem disablePadding>
								<ListItemButton
									selected={selectedIndex === 0}
									onClick={() => handleListItemClick(0)}>
									<ListItemIcon>
										<PersonIcon />
									</ListItemIcon>
									<ListItemText primary="Personal Information" />
								</ListItemButton>
							</ListItem>
							<Divider />
							<ListItem disablePadding>
								<ListItemButton
									selected={selectedIndex === 1}
									onClick={() => handleListItemClick(1)}>
									<ListItemIcon>
										<DevicesIcon />
									</ListItemIcon>
									<ListItemText primary="Login Activity" />
								</ListItemButton>
							</ListItem>
							<Divider />
							<ListItem disablePadding>
								<ListItemButton
									selected={selectedIndex === 2}
									onClick={() => handleListItemClick(2)}>
									<ListItemIcon>
										<DevicesIcon />
									</ListItemIcon>
									<ListItemText primary="Devices" />
								</ListItemButton>
							</ListItem>
							<Divider />
							<ListItem disablePadding>
								<ListItemButton
									selected={selectedIndex === 3}
									onClick={() => handleListItemClick(3)}>
									<ListItemIcon>
										<LockIcon />
									</ListItemIcon>
									<ListItemText primary=" Change Password" />
								</ListItemButton>
							</ListItem>
						</List>
					</Card>
				</Grid>

				{selectedIndex === 0 && (
					<Grid size={{ xs: 12, md: 9 }}>
						<Card>
							<Box sx={{ padding: 3 }}>
								<Typography
									variant="h5"
									fontWeight="bold"
									gutterBottom>
									Personal Information
								</Typography>
							</Box>
							<Divider />
							<Box sx={{ padding: 3 }}>
								<Grid container spacing={2}>
									{Object.entries(user.personalInfo).map(
										([label, value]) => (
											<Grid
												size={{ xs: 12, sm: 6 }}
												key={label}>
												<Typography
													variant="subtitle2"
													color="text.secondary"
													gutterBottom>
													{label
														.replace(
															/([A-Z])/g,
															" $1"
														)
														.toUpperCase()}
												</Typography>
												<Typography>{value}</Typography>
											</Grid>
										)
									)}
								</Grid>
							</Box>
						</Card>
					</Grid>
				)}
				{selectedIndex === 1 && (
					<Grid size={{ xs: 12, md: 9 }}>
						<Card>
							<Box sx={{ padding: 3 }}>
								<Typography
									variant="h5"
									fontWeight="bold"
									gutterBottom>
									Activity
								</Typography>
							</Box>
							<Stack>
								<TableComponent
									count={userActivityCount}
									columns={columns}
									rows={rows ? rows : []}
									loading={loading}
									page={
										profileActivityParams?.page
											? profileActivityParams?.page
											: 1
									}
									pageSize={
										profileActivityParams?.page_size
											? profileActivityParams?.page_size
											: 10
									}
									handleChangePage={handleChangePage}
									handleChangeRowsPerPage={
										handleChangeRowsPerPage
									}
								/>
							</Stack>
						</Card>
					</Grid>
				)}
				{selectedIndex === 2 && (
					<Grid size={{ xs: 12, md: 9 }}>
						<Card>
							<Box sx={{ padding: 3 }}>
								<Typography
									variant="h5"
									fontWeight="bold"
									gutterBottom>
									Device Logs
								</Typography>
							</Box>
							<Stack>
								<TableComponent
									count={profileDeviceCount}
									columns={devicecolumns}
									rows={deviceRows ? deviceRows : []}
									loading={loading}
									page={
										profileDeviceParams?.page
											? profileDeviceParams?.page
											: 1
									}
									pageSize={
										profileDeviceParams?.page_size
											? profileDeviceParams?.page_size
											: 10
									}
									handleChangePage={handleDeviceChangePage}
									handleChangeRowsPerPage={
										handleDeviceChangeRowsPerPage
									}
								/>
							</Stack>
						</Card>
					</Grid>
				)}
				{selectedIndex === 3 && (
					<Grid size={{ xs: 12, md: 9 }}>
						<Card sx={{ padding: 3 }}>
							<Box sx={{ paddingBottom: 2 }}>
								<Typography
									variant="h5"
									fontWeight="bold"
									gutterBottom>
									Change Password
								</Typography>
							</Box>
							<Divider />
							<form
								style={{ width: "100%" }}
								onSubmit={handleSubmit(onSubmit)}>
								<Grid
									size={{ xs: 12, md: 4 }}
									sx={{ pb: 2, mt: 2 }}>
									<FormInput
										required
										name="old_password"
										label="Old Password"
										type="password"
										placeholder="Enter old password here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }} sx={{ pb: 2 }}>
									<FormInput
										required
										name="newPassword"
										label="New Password"
										type="password"
										placeholder="Enter new password here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }} sx={{ pb: 2 }}>
									<FormInput
										required
										name="password"
										label="Confirm Password"
										type="password"
										placeholder="Enter confirm password here..."
										control={control}
									/>
								</Grid>
								<Button
									variant="contained"
									type="submit"
									color="primary"
									autoFocus>
									Update
								</Button>
							</form>
						</Card>
					</Grid>
				)}
			</Grid>
		</Box>
	);
};

export default ViewProfile;
