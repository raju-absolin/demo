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
} from "@src/store/mini/mini.Action";
import {
	clearMiniDepartments,
	clearMiniLocation,
} from "@src/store/mini/mini.Slice";
import {
	editServiceRequestData,
	postServiceRequestData,
} from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.action";
import {
	useServiceRequestSelector,
	setSelectedData,
	isModalOpen,
} from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.slice";
import { useAppDispatch } from "@src/store/store";
import moment from "moment";
import { useForm } from "react-hook-form";
import { LuInfo, LuX } from "react-icons/lu";
import * as yup from "yup";

const AddServiceRequest = () => {
	const dispatch = useAppDispatch();

	const {
		serviceRequest: { isModalVisible: open, selectedData, pageParams },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniDepartments,
		},
	} = useServiceRequestSelector();

	const closeModal = () => {
		dispatch(isModalOpen(false));
		dispatch(setSelectedData({}));
		reset({
			due_date: "",
			description: "",
			location: null,
			department: null,
		});
	};

	const ServiceRequestSchema = yup.object().shape({
		due_date: yup.string().required("Please select a due date"),
		description: yup.string().required("Please select a description"),
		location: yup
			.object({
				label: yup.string().required("Please select a location"),
				value: yup.string().required("Please select a location"),
			})
			.required("Please select a location")
			.nullable(),
		department: yup
			.object({
				label: yup.string().required("Please select a department"),
				value: yup.string().required("Please select a department"),
			})
			.required("Please select a department")
			.nullable(),
	});

	const {
		control,
		handleSubmit,
		reset,
		getValues,
		// formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(ServiceRequestSchema),
		values: {
			due_date:
				moment(selectedData?.due_date, "DD-MM-YYYY").toISOString() ||
				"",
			description: selectedData?.description || "",
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
		due_date: string;
		description: string;
		location: {
			label: string;
			value: string;
		} | null;
		department: {
			label: string;
			value: string;
		} | null;
	}) => {
		const data = {
			due_date: payload?.due_date
				? moment(payload?.due_date).format("YYYY-MM-DD")
				: "",
			description: payload.description,
			location_id: payload?.location?.value
				? payload?.location?.value
				: "",
			department_id: payload?.department?.value
				? payload?.department?.value
				: "",
		};

		!selectedData?.id
			? dispatch(
					postServiceRequestData({
						data,
						hide: () => {
							closeModal();
						},
						params: pageParams,
					})
				)
			: dispatch(
					editServiceRequestData({
						id: selectedData?.id,
						data,
						hide: () => {
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
								<Stack flex={1}>
									<CustomDatepicker
										required
										control={control}
										name="due_date"
										hideAddon
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										inputClass="form-input"
										minDate={new Date()}
										label={"Due Date"}
										tI={1}
									/>
								</Stack>
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
										// error={fieldState.error != null}
									>
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
							<Grid size={{ xs: 12 }}>
								<TextArea
									required
									name="description"
									label="Description"
									type="text"
									placeholder="Write description here..."
									minRows={3}
									maxRows={5}
									containerSx={{
										display: "grid",
										gap: 1,
									}}
									control={control}
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

export default AddServiceRequest;
