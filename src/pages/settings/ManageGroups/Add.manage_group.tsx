import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Paper,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
	CheckboxInput,
	ComponentContainerCard,
	FormInput,
	PasswordInput,
} from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { CustomizedAccordion } from "./CustomAccordian";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	clearProfileData,
	clearprofileParams,
	InputChangeValue,
	selectManageGroups,
	setModalProps,
} from "@src/store/settings/manageGroups/manage_groups.slice";
import {
	getPermissionsList,
	getProfilebyID,
	getProfileList,
	submitProfile,
} from "@src/store/settings/manageGroups/manage_groups.action";
import { CustomModal, CustomModalProps } from "@src/components/Modal";

import Swal from "sweetalert2";
import GroupPermissions from "./newGroupsUI";

const AddManageGroup = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	// const [modalProps, setModalProps] = useState<any | undefined>();
	const { id } = useParams();
	const {
		manageGroups: {
			appPermissionsList,
			checkedPermissions,
			profileData,
			// modalProps,
		},
	} = useAppSelector((state) => {
		return {
			manageGroups: selectManageGroups(state),
		};
	});

	const loginFormSchema = yup.object({
		name: yup.string().required("Group name is required"),
	});

	const { control, handleSubmit } = useForm({
		resolver: yupResolver(loginFormSchema),
		values: {
			name: profileData.name ? profileData.name : "",
		},
	});

	const handleAdd = (data: { name: string }) => {
		var permission_ids = [];
		permission_ids = checkedPermissions.map((permission: any) => {
			return permission.id;
		});
		const profileObj = {
			...data,
			id: id,
			permission_ids: permission_ids,
		};

		if (profileObj.permission_ids.length !== 0) {
			Swal.fire({
				title: `<p style="font-size:20px">Are you sure?</p>`,
				text: "You won't be able to revert this!",
				icon: "warning",
				showCancelButton: true,
				cancelButtonColor: "#d33",
				confirmButtonText: `Save`,
				confirmButtonColor: "#3085d6",
				allowOutsideClick: false,
			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
					dispatch(
						submitProfile({ profileObj, navigate, clearDataFn })
					);
				} else if (result.isDenied) {
					Swal.fire("Changes are not saved", "", "info");
				}
			});
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">Permission Error</p>`,
				text: "Please select at least one permission.",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
				allowOutsideClick: false,
			});
		}
	};

	function clearDataFn() {
		dispatch(clearProfileData());
		dispatch(clearprofileParams());
	}

	useEffect(() => {
		clearDataFn();
	}, []);

	useEffect(() => {
		dispatch(getPermissionsList({ id: id ? id : "" }));
	}, [id]);

	return (
		<GoBack
			is_goback={false}
			title={`${id && id != "0" ? "Update" : "Add"} Group`}
			showSaveButton={true}
			onSave={handleSubmit(handleAdd)}
			loading={false}>
			<>
				{/* {modalProps?.isOpen && <CustomModal {...modalProps} />} */}
				{/* <Box
			sx={{
				my: 2,
			}}>
			<Card>
				<CardContent>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, lg: 6, xl: 3 }}>
							<Box pt={"20px"}>
								<form>
									<FormInput
										name="name"
										label="Group Name"
										containerSx={{ mb: "12px" }}
										type="text"
										placeholder="Enter group name"
										control={control}
									/>
								</form>
							</Box>
						</Grid>
					</Grid>
					<Divider
						sx={{
							my: 2,
						}}
					/>
					<Grid size={{ lg: 6 }}>
						<CustomizedAccordion
						// appPermissionsList={appPermissionsList}
						/>
					</Grid>
				</CardContent>
			</Card>
		</Box> */}
				<GroupPermissions control={control} />
			</>
		</GoBack>
	);
};

export default AddManageGroup;
