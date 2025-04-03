import react, { ChangeEvent, useEffect, useState } from "react";
import {
	Box,
	Button,
	DialogContentText,
	Divider,
	FormControlLabel,
	FormHelperText,
	Grid2 as Grid,
	InputLabel,
	List,
	OutlinedInput,
	Stack,
	styled,
	Switch,
	Typography,
	useTheme,
} from "@mui/material";
import {
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput, ScrollableList } from "@src/components";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@src/store/store";
import {
	setFormRows,
	setSelectedData,
	setSelectedFormData,
	SetSwitchAuthorization,
	setViewModel,
	useAuthorizationSelector,
} from "@src/store/settings/Authorization/authorization.slice";
import {
	postAuthorizationData,
	editAuthorizationDataById,
	postScreenAuthorizationData,
	editScreenAuthorizationDataById,
	deleteScreenAuthorization,
	getScreenAuthorizations,
	getAuthorizationById,
} from "@src/store/settings/Authorization/authorization.action";
import { LuMinusCircle, LuPlusCircle, LuX } from "react-icons/lu";
import { LoadingButton } from "@mui/lab";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	clearMiniAllContentTypes,
	clearMiniUsers,
	clearMiniUserTypes,
} from "@src/store/mini/mini.Slice";
import {
	getMiniUserTypes,
	getAllContentTypes,
	getMiniUsers,
} from "@src/store/mini/mini.Action";
import { ScreenAuthorization } from "@src/store/settings/Authorization/authorization.types";
import { v4 as uuidV4 } from "uuid";
import { getProfileList } from "@src/store/settings/manageGroups/manage_groups.action";
import { clearProfileData } from "@src/store/settings/manageGroups/manage_groups.slice";
import { addParams } from "@src/helpers/Helper";
import Swal from "sweetalert2";

const ViewAuthorization = () => {
	const dispatch = useAppDispatch();

	const {
		authorization: {
			loading,
			selectedData,
			finalauthorization,
			pageParams,
			model,
			formRows,
			formRowsLoading,
			formRowsParams,
			selectedFormData,
			viewModal,
		},
		mini: {
			miniUserList,
			miniUserLoading,
			miniUserParams,

			miniAllContentTypes,
		},
		manageGroups: { profileList, loading: profilesloading, profileParams },
		system: { userAccessList },
	} = useAuthorizationSelector();

	const TYPE_CHOICES = [
		{ name: "User", id: 1 },
		{ name: "Group", id: 2 },
	];

	const hide = () => {
		dispatch(
			setFormRows([
				{
					id: "",
					type: null,
					user_or_group: null,
				},
			])
		);
		dispatch(setSelectedData({}));
		dispatch(setViewModel(false));
	};

	const theme = useTheme();

	return (
		<>
			<Dialog
				open={viewModal}
				onClose={() => {
					hide();
				}}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				maxWidth="md">
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
					Authorization Details
					<IconButton
						onClick={() => {
							hide();
						}}>
						<LuX color="" />
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{ px: "24px", pt: "12px !important", pb: 3 }}>
					<DialogContentText>
						<Grid container spacing={2}>
							<Grid
								size={{
									xs: 12,
								}}>
								<Stack
									direction={"row"}
									spacing={2}
									justifyContent={"space-around"}>
									<Stack spacing={2}>
										<Typography variant="h4">
											Screen
										</Typography>
										<Typography
											textAlign={"center"}
											variant="subtitle2">
											{selectedData?.screen?.label}
										</Typography>
									</Stack>
									<Stack spacing={2}>
										<Typography variant="h4">
											Final Level
										</Typography>
										<Typography
											textAlign={"center"}
											variant="subtitle2">
											{selectedData?.level}
										</Typography>
									</Stack>
								</Stack>
								<Divider
									sx={{
										my: 2,
									}}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
								}}>
								<Stack
									direction={"row"}
									spacing={2}
									justifyContent={"space-around"}>
									<Typography variant="h4">S.No</Typography>
									<Typography variant="h4">Type</Typography>
									<Typography variant="h4">
										User / Group
									</Typography>
									<Typography variant="h4">Level</Typography>
								</Stack>
							</Grid>
							<Grid
								size={{
									xs: 12,
								}}>
								<ScrollableList
									styles={{
										maxHeight: "550px",
									}}
									list={formRows?.filter((row) => row?.id)}
									loading={formRowsLoading}
									params={{
										...formRowsParams,
										screen: selectedData?.screen?.value,
									}}
									fetchapi={getScreenAuthorizations}
									keyExtractor={(item) => item?.id || ""} // Uses `id` as key
									renderItem={(
										row,
										index,
										selectedRow,
										handleSelect
									) => {
										return (
											<>
												<Stack
													direction={"row"}
													spacing={2}
													justifyContent={
														"space-around"
													}>
													<Stack spacing={2}>
														<Typography
															variant="subtitle2"
															textAlign={
																"center"
															}>
															{index + 1}
														</Typography>
													</Stack>
													<Stack spacing={2}>
														<Typography
															variant="subtitle2"
															textAlign={
																"center"
															}>
															{row?.type?.label}
														</Typography>
													</Stack>
													<Stack spacing={2}>
														<Typography
															variant="subtitle2"
															textAlign={
																"center"
															}>
															{
																row
																	?.user_or_group
																	?.label
															}{" "}
														</Typography>
													</Stack>
													<Stack spacing={2}>
														<Typography
															variant="subtitle2"
															textAlign={
																"center"
															}>
															{row?.level}{" "}
														</Typography>
													</Stack>
												</Stack>
												<Divider
													sx={{
														my: 2,
													}}
												/>
											</>
										);
									}}
								/>
							</Grid>
						</Grid>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};
export default ViewAuthorization;
