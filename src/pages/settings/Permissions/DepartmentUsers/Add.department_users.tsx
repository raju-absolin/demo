import { yupResolver } from "@hookform/resolvers/yup";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Grid2 as Grid,
	Stack,
	InputLabel,
	Box,
	Tooltip,
	Zoom,
} from "@mui/material";
import { CustomDatepicker } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import {
	getMiniDepartments,
	getMiniLocation,
	getMiniUsers,
} from "@src/store/mini/mini.Action";
import {
	clearMiniDepartments,
	clearMiniLocation,
	clearMiniUsers,
} from "@src/store/mini/mini.Slice";
import {
	editMangeDepartmentUsersDataById,
	postMangeDepartmentUsersData,
} from "@src/store/settings/Permissions/DepartmentUsers/department_users.action";
import {
	useDepartmentUserSelector,
	setSelectedData,
	setIsModalOpen,
} from "@src/store/settings/Permissions/DepartmentUsers/department_users.slice";
import { useAppDispatch } from "@src/store/store";
import moment from "moment";
import { useForm } from "react-hook-form";
import { LuInfo, LuX } from "react-icons/lu";
import * as yup from "yup";

const AddDepartmentUser = () => {
	const dispatch = useAppDispatch();

	const {
		departmentUsers: { isModalOpen: open, selectedData, pageParams },
		mini: {
			miniUserList,
			miniUserLoading,
			miniUserParams,
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniDepartments,
		},
	} = useDepartmentUserSelector();

	const closeModal = () => {
		dispatch(setIsModalOpen(false));
		dispatch(setSelectedData({}));
		reset({
			is_hod: undefined,
			user: undefined,
			location: undefined,
			department: undefined,
		});
	};

	const DepartmentUserSchema = yup.object().shape({
		is_hod: yup
			.object({
				label: yup.string().required("Please select a is_hod"),
				value: yup.boolean().required("Please select a is_hod"),
			})
			.required("Please select a is_hod"),
		user: yup
			.object({
				label: yup.string().required("Please select a user"),
				value: yup.string().required("Please select a user"),
			})
			.required("Please select a user"),
		location: yup
			.object({
				label: yup.string().required("Please select a location"),
				value: yup.string().required("Please select a location"),
			})
			.required("Please select a location"),
		department: yup
			.object({
				label: yup.string().required("Please select a department"),
				value: yup.string().required("Please select a department"),
			})
			.required("Please select a department"),
	});

	const {
		control,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(DepartmentUserSchema),
		values: {
			is_hod: selectedData?.is_hod
				? {
						label: selectedData?.is_hod ? "Yes" : "No",
						value: selectedData?.is_hod,
					}
				: null,
			user: selectedData?.user?.id
				? {
						label: selectedData?.user?.fullname,
						value: selectedData?.user?.id,
					}
				: null,
			location: selectedData?.location?.id
				? {
						label: selectedData?.location?.name,
						value: selectedData?.location?.id,
					}
				: null,
			department: selectedData?.department?.id
				? {
						label: selectedData?.department?.name,
						value: selectedData?.department?.id,
					}
				: null,
		},
	});

	const handleAdd = (payload: {
		is_hod: {
			label: string;
			value: boolean;
		};
		user: {
			label: string;
			value: string;
		};
		location: {
			label: string;
			value: string;
		};
		department: {
			label: string;
			value: string;
		};
	}) => {
		const data = {
			user_id: payload?.user?.value ? payload?.user?.value : "",
			is_hod: payload?.is_hod?.value ? payload?.is_hod?.value : false,
			location_id: payload?.location?.value
				? payload?.location?.value
				: "",
			department_id: payload?.department?.value
				? payload?.department?.value
				: "",
		};

		!selectedData?.id
			? dispatch(
					postMangeDepartmentUsersData({
						data,
						close: () => {
							closeModal();
						},
						params: pageParams,
					})
				)
			: dispatch(
					editMangeDepartmentUsersDataById({
						id: selectedData?.id,
						data,
						close: () => {
							closeModal();
						},
						params: pageParams,
					})
				);
	};

	const getValuesLocation = getValues("location");

	return (
		<Dialog
			open={open}
			onClose={() => {
				closeModal();
			}}
			sx={{
				"& .MuiDialog-paper": {
					width: "800px",
				},
			}}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle
				sx={{
					bgcolor: "primary.main",
					color: "white",
					p: 1,
					px: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
				variant="h4"
				id="alert-dialog-title">
				{selectedData?.id
					? "Update Service Request"
					: "Add Service Request"}
				<IconButton
					onClick={() => {
						closeModal();
					}}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
				<DialogContentText id="alert-dialog-description">
					<form style={{ width: "100%" }}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 6 }}>
								<SelectComponent
									required
									name="user"
									label="Users"
									multiple={false}
									control={control}
									rules={{ required: true }}
									options={miniUserList.map(
										(e: {
											id: string | number;
											fullname: string;
										}) => ({
											id: e.id,
											name: e.fullname,
										})
									)}
									loading={miniUserLoading}
									selectParams={{
										page: miniUserParams.page,
										page_size: miniUserParams.page_size,
										search: miniUserParams.search,
										no_of_pages: miniUserParams.no_of_pages,
									}}
									hasMore={
										miniUserParams.page <
										miniUserParams.no_of_pages
									}
									fetchapi={getMiniUsers}
									clearData={clearMiniUsers}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<SelectComponent
									required
									name="location"
									label="Location"
									multiple={false}
									control={control}
									rules={{ required: true }}
									options={miniLocationList.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniLocationLoading}
									selectParams={{
										page: miniLocationParams.page,
										page_size: miniLocationParams.page_size,
										search: miniLocationParams.search,
										no_of_pages:
											miniLocationParams.no_of_pages,
									}}
									hasMore={
										miniLocationParams.page <
										miniLocationParams.no_of_pages
									}
									fetchapi={getMiniLocation}
									clearData={clearMiniLocation}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack direction={"row"} alignItems={"center"}>
									<InputLabel
										sx={{
											".MuiInputLabel-asterisk": {
												color: "red",
											},
										}}
										id={"department"}
										required={true}
										style={{
											fontWeight: "medium",
										}}
										error={errors.department != null}>
										Department
									</InputLabel>
									<Tooltip
										TransitionComponent={Zoom}
										title="Select a location before selecting a department">
										<IconButton
											size="small"
											sx={{
												cursor: "pointer",
											}}>
											<LuInfo color="#3e60d5" />
										</IconButton>
									</Tooltip>
								</Stack>
								<SelectComponent
									name="department"
									label=""
									multiple={false}
									control={control}
									rules={{ required: true }}
									options={miniDepartments?.list?.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									disabled={!getValuesLocation?.value}
									loading={miniDepartments?.loading}
									selectParams={{
										page: miniDepartments?.miniParams?.page,
										page_size:
											miniDepartments?.miniParams
												?.page_size,
										search: miniDepartments?.miniParams
											?.search,
										no_of_pages:
											miniDepartments?.miniParams
												?.no_of_pages,
										location: getValuesLocation?.value,
									}}
									hasMore={
										miniDepartments?.miniParams?.page <
										miniDepartments?.miniParams?.no_of_pages
									}
									fetchapi={getMiniDepartments}
									clearData={clearMiniDepartments}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<SelectComponent
									required
									name="is_hod"
									label="Is HOD"
									multiple={false}
									control={control}
									rules={{ required: true }}
									options={[
										{
											id: true,
											name: "Yes",
										},
										{
											id: false,
											name: "No",
										},
									]}
								/>
							</Grid>
						</Grid>
					</form>
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button
					onClick={() => closeModal()}
					variant="outlined"
					color="secondary">
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit(handleAdd as any)}
					color="primary"
					autoFocus>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddDepartmentUser;
