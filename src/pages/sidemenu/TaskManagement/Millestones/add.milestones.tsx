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
} from "@mui/material";
import { CustomDatepicker, FormInput } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import {
	getMiniProjectGroups,
	getMiniUserTypes,
} from "@src/store/mini/mini.Action";
import {
	clearMiniProjectGroups,
	clearMiniUserTypes,
} from "@src/store/mini/mini.Slice";
import { miniType } from "@src/store/mini/mini.Types";
import { useMileStoneActions } from "@src/store/sidemenu/task_management/milestones/milestones.action";
import { selectMileStones } from "@src/store/sidemenu/task_management/milestones/milestones.slice";
import { useAppSelector } from "@src/store/store";
import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import { useParams } from "react-router-dom";
import * as yup from "yup";

const AddTask = () => {
	const {
		mileStones: { modal, selectedData, pageParams },
		system: { userAccessList },
		mini: { miniProjectGroups },
	} = useAppSelector((state) => selectMileStones(state));

	const { id, tab } = useParams();

	const {
		reducer: { isModalOpen, setSelectedData },
		extraReducer: { postMileStoneData, editMileStoneData },
	} = useMileStoneActions();

	const clearData = () => {
		setSelectedData(null);
	};

	useEffect(() => {
		!selectedData?.id && clearData();
	}, [selectedData]);

	const TaskSchema = yup.object().shape({
		startdate: yup.string().required("Please select a start date"),
		duedate: yup
					.date()
					.transform((curr, orig) => (orig === "" ? null : new Date(curr))) 
					.test(
						"expiry-date-validation",
						"Due date cannot be equal or earlier than the start date",
						function (value) {
							const { startdate } = this.parent;
							if (!value || !startdate) return true;
							const issueTimestamp = new Date(startdate).getTime();
							const expiryTimestamp = new Date(value).getTime();
		
							return expiryTimestamp > issueTimestamp;
						}
					)
					.required("Please select a due date"),
		// duedate: yup.string().required("Please select a due date"),
		remarks: yup.string().trim().required("Please select a remarks"),
		description: yup.string().trim().required("Please select a description"),
		name: yup.string().trim().required("Please select a name"),
	});

	const { control, handleSubmit, reset, getValues } = useForm<any>({
		resolver: yupResolver(TaskSchema),
		values: {
			startdate: selectedData?.startdate
				? moment(
						selectedData?.startdate,
						"YYYY-MM-DD hh:mm a"
					).toISOString()
				: "",
			duedate: selectedData?.duedate
				? moment(
						selectedData?.duedate,
						"YYYY-MM-DD hh:mm a"
					).toISOString()
				: "",
			description: selectedData?.description
				? selectedData?.description
				: "",
			name: selectedData?.name ? selectedData?.name : "",
			remarks: selectedData?.remarks ? selectedData?.remarks : "",
		},
	});

	const getValuesStartDate = getValues("startdate");

	const hide = () => {
		isModalOpen(false);
		clearData();
		reset();
	};

	const handleAdd = (payload: {
		startdate: string;
		name: string;
		duedate: string;
		description: string;
		remarks: string;
	}) => {
		const data = {
			project_id: id ? id : "",
			name: payload?.name ? payload?.name : "",
			description: payload?.description ? payload?.description : "",
			remarks: payload?.remarks ? payload?.remarks : "",
			startdate: payload?.startdate
				? moment(payload.startdate).toISOString()
				: "",
			duedate: payload?.duedate
				? moment(payload.duedate).toISOString()
				: "",
		};

		!selectedData?.id
			? postMileStoneData({
					data,
					hide,
					params: pageParams,
				})
			: editMileStoneData({
					id: selectedData?.id ? selectedData?.id : "",
					data,
					hide,
					params: pageParams,
				});
	};

	return (
		<Dialog
			open={modal}
			onClose={() => {
				hide();
			}}
			// sx={{
			// 	"& .MuiDialog-paper": {
			// 		width: "800px",
			// 	},
			// }}
			fullWidth
			maxWidth="lg"
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
				{"Add Mile stone"}
				<IconButton
					onClick={() => {
						hide();
					}}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
				<DialogContentText id="alert-dialog-description">
					<form style={{ width: "100%" }}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12 }}>
								<FormInput
									control={control}
									name={`name`}
									label="Name"
									type="text"
									required
									placeholder="Enter name here..."
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack width={"100%"}>
									<CustomDatepicker
										control={control}
										name="startdate"
										hideAddon
										required
										minDate={new Date()}
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										inputClass="form-input"
										label={"Start Date"}
										tI={1}
									/>
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack width={"100%"}>
									<CustomDatepicker
										control={control}
										name="duedate"
										required
										hideAddon
										// disabled={!getValuesStartDate}
										// helperText={
										// 	!getValuesStartDate
										// 		? "Please select start date before selecting due date"
										// 		: ""
										// }
										minDate={moment(
											getValuesStartDate,
											"DD-MM-YYYY"
										).toDate()}
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										inputClass="form-input"
										label={"Due Date"}
										tI={1}
									/>
								</Stack>
							</Grid>
							 <Grid size={{ xs: 12, md: 6 }}>
								<TextArea
									name="description"
									label="Description"
									type="text"
									placeholder="Write Description here..."
									minRows={3}
									required
									maxRows={5}
									containerSx={{
										display: "grid",
										gap: 1,
									}}
									control={control}
								/>
							</Grid>
							 <Grid size={{ xs: 12, md: 6}}>
								<TextArea
									name="remarks"
									label="Remarks"
									required
									type="text"
									placeholder="Write remarks here..."
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
					onClick={() => hide()}
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

export default AddTask;
