import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	FormHelperText,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
	CheckboxInput,
	ComponentContainerCard,
	FormInput,
	PasswordInput,
	SelectInput,
} from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	clearProfileData,
	clearprofileParams,
	selectManageGroups,
} from "@src/store/settings/manageGroups/manage_groups.slice";
import {
	getPermissionsList,
	getProfileList,
} from "@src/store/settings/manageGroups/manage_groups.action";
import { CustomModal, CustomModalProps } from "@src/components/Modal";

import Swal from "sweetalert2";
import { LuBook, LuSave } from "react-icons/lu";
import {
	clearUserData,
	selectManageUsers,
} from "@src/store/settings/manageUsers/manage_users.slice";
import { clearMiniLocation, miniSelector } from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniLocation } from "@src/store/mini/mini.Action";
import {
	editMangeUsersDataById,
	getUserById,
	postMangeUsersData,
} from "@src/store/settings/manageUsers/manage_users.action";
import { UserFormData } from "@src/store/settings/manageUsers/manage_users.types";

const UserForm = ({ onSave }: { onSave: (value: UserFormData) => void }) => {
	const dispatch = useAppDispatch();
	const {
		manageUser: { selectedData },
		manageGroups: { profileList, loading: profilesloading, profileParams },
		mini: { miniLocationList, miniLocationLoading, miniLocationParams },
	} = useAppSelector((state) => {
		return {
			manageUser: selectManageUsers(state),
			mini: miniSelector(state),
			manageGroups: selectManageGroups(state),
		};
	});

	const genderList: { id: string | number; name: string }[] = [
		{ id: 1, name: "Male" },
		{ id: 2, name: "Female" },
		{ id: 3, name: "Others" },
	];

	const device_access_list = [
		{
			id: 1,
			name: "Mobile",
		},
		{
			id: 2,
			name: "Web",
		},
		{
			id: 3,
			name: "Both",
		},
		{
			id: 4,
			name: "None",
		},
	];

	const userSchema = yup.object().shape({
		username: yup.string().required("Please enter your username").trim(),
		firstname: yup.string().required("Please enter your first name").trim(),
		lastname: yup.string().required("Please enter your last name").trim(),
		email: yup
			.string()
			.email("Please enter a valid email")
			.required("Please enter your email"),
		phone: yup
			.string()
			.min(10, "Phone number must be exactly 10 digits")
			.max(10, "Phone number cannot exceed 10 digits")
			.required("Please enter your phone number"),
		groups: yup
			.array()
			.of(
				yup.object().shape({
					label: yup
						.string()
						.required("Each group must have a label"),
					value: yup
						.string()
						.required("Each group must have a value"),
				})
			)
			.min(1, "Select at least one group")
			.required("Please select a group"),
		device_access: yup.object().shape({
			label: yup.string().required("Please select device access"),
			value: yup.string().required("Please select device access"),
		}),
		gender: yup.object().shape({
			label: yup.string().required("Please select a gender"),
			value: yup.string().required("Please select a gender"),
		}),
		// state: yup
		// 	.object()
		// 	.shape({
		// 		name: yup.string().required("Please select a state"),
		// 		id: yup.string().required("Please select a state"),
		// 	}),
		// city: yup
		// 	.object()
		// 	.shape({
		// 		name: yup.string().required("Please select a city"),
		// 		id: yup.string().required("Please select a city"),
		// 	}),
		// area: yup
		// 	.object()
		// 	.shape({
		// 		name: yup.string().required("Please select an area"),
		// 		id: yup.string().required("Please select an area"),
		// 	}),
		// zone: yup
		// 	.object()
		// 	.shape({
		// 		name: yup.string().required("Please select a zone"),
		// 		id: yup.string().required("Please select a zone"),
		// 	}),
		// location: yup
		// 	.array()
		// 	.of(
		// 		yup.object().shape({
		// 			label: yup
		// 				.string()
		// 				.required("Each location must have a label"),
		// 			value: yup
		// 				.string()
		// 				.required("Each location must have a value"),
		// 		})
		// 	)
		// 	.min(1, "Select at least one location")
		// 	.required("Please select a location"),
		// pincode: yup
		// 	.string()
		// 	.min(6, "Pincode must be exactly 6 digits")
		// 	.max(6, "Pincode must be exactly 6 digits")
		// 	.required("Please enter your pincode"),
	});
	const { control, handleSubmit } = useForm<any>({
		resolver: yupResolver(userSchema),
		values: {
			username: selectedData.username,
			firstname: selectedData.first_name,
			lastname: selectedData.last_name,
			email: selectedData.email,
			phone: selectedData.phone,
			groups: selectedData?.groups
				? selectedData.groups?.map(
						(item: { label: any; value: any }) => ({
							label: item.label || "",
							value: item.value || "",
						})
					)
				: [],
			device_access: selectedData.device_access
				? {
						label: selectedData.device_access_name
							? selectedData.device_access_name
							: "",
						value: selectedData.device_access
							? `${selectedData.device_access?.value}`
							: "",
					}
				: null,
			gender: selectedData.gender_name
				? {
						label: selectedData.gender_name
							? selectedData.gender_name
							: "",
						value: selectedData.gender
							? `${selectedData.gender}`
							: "",
					}
				: null,
			// location: selectedData?.locations
			// 	? selectedData.locations?.map((item: { label: any; value: any; }) => ({
			// 		label: item.label || "",
			// 		value: item.value || "",
			// 	}))
			// 	: []
			// pincode: selectedData.pincode ? selectedData.pincode : "",
		},
	});
	return (
		<Grid size={{ xs: 12 }}>
			<Typography
				// bgcolor={"grey.200"}
				component={"h5"}
				sx={{
					p: "8px",
					display: "flex",
					alignItems: "center",
					mb: "36px",
					textTransform: "uppercase",
				}}>
				<LuBook size={20} style={{ marginRight: "6px" }} />
				<Typography
					component={"span"}
					fontSize={"16px"}
					variant="body1">
					Personal Info
				</Typography>
			</Typography>
			<form
				onSubmit={handleSubmit(onSave as any)}
				style={{ width: "100%" }}>
				<Grid container spacing={3}>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="username"
							label="User Name"
							type="text"
							required
							placeholder="Enter user name here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="firstname"
							label="First Name"
							required
							type="text"
							placeholder="Enter first name here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="lastname"
							label="Last Name"
							required
							type="text"
							placeholder="Enter last name here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="phone"
							label="Mobile"
							type="number"
							maxlength={10}
							placeholder="Enter Mobile Number here"
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="email"
							label="Email"
							type="email"
							required
							placeholder="Email"
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="gender"
							required
							label="Gender"
							control={control}
							rules={{ required: true }}
							options={genderList}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="device_access"
							label="Device Access"
							required
							control={control}
							rules={{ required: true }}
							options={device_access_list?.map(
								(e: { id: number; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="groups"
							label="Group"
							required
							control={control}
							rules={{ required: true }}
							options={profileList.map(
								(e: { id: string | number; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							multiple={true}
							loading={profilesloading}
							selectParams={{
								page: profileParams.page,
								page_size: profileParams.page_size,
								search: profileParams.search,
								no_of_pages: profileParams.no_of_pages,
							}}
							hasMore={
								profileParams.page < profileParams.no_of_pages
							}
							fetchapi={getProfileList}
							clearData={clearProfileData}
						/>
					</Grid>
					{/* 
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectInput
							name="groups"
							label="Group"
							type="select"
							placeholder="Select a group"
							control={control}
							data={profileList}
						/>
					</Grid> */}
					{/* <Grid size={{ xs: 12 }}>
						<Typography
							bgcolor={"grey.200"}
							component={"h5"}
							sx={{
								p: "8px",
								display: "flex",
								alignItems: "center",
								mt: 1,
								textTransform: "uppercase",
							}}>
							<LuBook size={20} style={{ marginRight: "6px" }} />
							<Typography
								component={"span"}
								fontSize={"16px"}
								variant="body1">
								Location Info
							</Typography>
						</Typography>
					</Grid> */}
					{/* <Grid size={{ xs: 12, md: 6 }}>
						<SelectInput
							name="state"
							label="State"
							type="select"
							control={control}
							data={cities}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<SelectInput
							name="zone"
							label="Zone"
							type="select"
							control={control}
							data={cities}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<SelectInput
							name="city"
							label="City"
							type="select"
							control={control}
							data={cities}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<SelectInput
							name="area"
							label="Area"
							type="select"
							control={control}
							data={cities}
						/>
					</Grid> */}
					{/* <Grid size={{ xs: 12, md: 6, lg: 3 }} sx={{ mb: 2 }}>
						<SelectComponent
							name="location"
							label="Location"
							control={control}
							rules={{ required: true }}
							options={miniLocationList?.map(
								(e: { id: string | number; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							multiple={true}
							loading={miniLocationLoading}
							required
							dropDownPositoning="relative"
							selectParams={{
								page: miniLocationParams.page,
								page_size: miniLocationParams.page_size,
								search: miniLocationParams.search,
								no_of_pages: miniLocationParams.no_of_pages,
								item: selectedData?.locations?.map(
									(e: any) => e.value
								),
							}}
							hasMore={
								miniLocationParams.page <
								miniLocationParams.no_of_pages
							}
							fetchapi={getMiniLocation}
							clearData={clearMiniLocation}
						/>
					</Grid> */}
					{/* <Grid size={{ xs: 12, md: 6 }}>
						<FormInput
							name="pincode"
							label="Pincode"
							type="number"
							placeholder="Enter pincode here"
							control={control}
						/>
					</Grid> */}
					<Grid size={{ xs: 12 }}>
						<Box textAlign={"right"}>
							<Button
								color="success"
								type="submit"
								variant="contained"
								size="large">
								<LuSave
									size={18}
									style={{ marginRight: "6px" }}
								/>{" "}
								Save
							</Button>
						</Box>
					</Grid>
				</Grid>
			</form>
		</Grid>
	);
};

const AddManageGroup = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const {
		manageUser: { selectedData },
		mini: {},
	} = useAppSelector((state) => {
		return {
			manageUser: selectManageUsers(state),
			mini: miniSelector(state),
		};
	});

	function clearDataFn() {
		dispatch(clearProfileData());
		dispatch(clearprofileParams());
		dispatch(clearUserData());
	}

	useEffect(() => {
		clearDataFn();
	}, []);

	useEffect(() => {
		if (id !== "0") {
			dispatch(getUserById({ id: id ? id : "" }));
		}
	}, [id]);

	useEffect(() => {
		dispatch(
			getProfileList({
				search: "",
				page: 1,
				page_size: 10,
			})
		);
	}, []);

	const onSave = (value: UserFormData) => {
		const data = {
			username: value.username,
			email: value?.email,
			phone: value?.phone,
			first_name: value?.firstname,
			last_name: value?.lastname,
			// location_ids: value.location?.map(
			// 	(item: { value: string; label: string }) => item.value
			// ),
			group_ids: value.groups?.map(
				(item: { value: string; label: string }) => item.value
			),
			gender: value?.gender?.value,
			device_access: value?.device_access.value,
		};
		if (id == "0") {
			dispatch(postMangeUsersData({ data: data }));
			navigate("/pages/settings/manage-users");
		} else {
			dispatch(editMangeUsersDataById({ id: id ? id : "", data: data }));
			navigate("/pages/settings/manage-users");
		}
	};

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} User`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 2,
				}}>
				<Card>
					<CardContent>
						<UserForm onSave={onSave} />
					</CardContent>
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddManageGroup;
