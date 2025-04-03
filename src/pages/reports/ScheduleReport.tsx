import React, { useEffect, useState } from "react";
import {
	Button,
	Card,
	Grid2 as Grid,
	TextField,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
	Stack,
} from "@mui/material";
import { startPostScheduleReport } from "@src/store/reports/reports.actions";
import { format } from "date-fns";
import { RootState, useAppDispatch, useAppSelector } from "@src/store/store"; // Adjust this import based on your store setup
import { CustomDatepicker, FormInput } from "@src/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import SelectComponent from "@src/components/form/SelectComponent";

interface ScheduleReportsViewProps {
	show: boolean;
	schedule_form: any; // Adjust type as needed for your form
	model_name: string;
}

const ScheduleReportsView: React.FC<ScheduleReportsViewProps> = ({
	show,
	schedule_form,
	model_name,
}) => {
	const dispatch = useAppDispatch();
	const pageParams = useAppSelector(
		(state: RootState) => state.reports.pageParams
	);

	const scheduleSchema = yup.object().shape({
		email: yup
			.string()
			.email("Invalid email format")
			.required("Email is required"),
		startdate: yup.string().required("Start Date is required"),
		schedule_time: yup.string().required("Schedule Time is required"),
		frequency: yup.object({
			lable: yup.string().required("Frequency is required"),
			value: yup.string().required("Frequency is required"),
		}),
		repeatdays: yup.string().required("Frequency is required"),
	});

	const { control, handleSubmit, register, reset, setValue, getValues } =
		useForm<any>({
			resolver: yupResolver(scheduleSchema),
		});

	const getValuesFrequency = getValues("frequency");

	useEffect(() => {
		if (getValuesFrequency.value) {
			if (getValuesFrequency.value == 1) {
				return setValue("repeatdays", 1);
			} else if (getValuesFrequency.value == 2) {
				return setValue("repeatdays", 7);
			} else if (getValuesFrequency.value == 3) {
				return setValue("repeatdays", 30);
			} else if (getValuesFrequency.value == 4) {
				return setValue("repeatdays", 365);
			}
		}
	}, [getValuesFrequency]);

	const onSave = handleSubmit((payload) => {
		const {
			objData: { file_format, model_name },
			ParamsData: params,
		} = pageParams;
		const obj = {
			...payload,
			fileformat: file_format,
			time: `${format(payload.startdate!, "yyyy-MM-dd")} ${format(payload.schedule_time, "HH:mm:ss")}`,
			repeatdays:
				payload.frequency.value === 5 ? payload.repeatdays : null,
		};

		const startDate = params.start_date ? params.start_date : "";
		const endDate = params.end_date ? params.end_date : "";

		const paramsData = {
			...params,
			frequency: payload.frequency.value,
			fileformat: file_format,
			start_date: startDate
				? model_name === "HRMS Daily Attendance"
					? format(new Date(startDate), "yyyy-MM-dd")
					: format(new Date(startDate), "yyyy-MM-dd")
				: "",
			end_date:
				model_name === "HRMS Daily Attendance"
					? format(new Date(startDate), "yyyy-MM-dd")
					: params.end_date != null
						? format(new Date(endDate), "yyyy-MM-dd")
						: "",
		};

		dispatch(startPostScheduleReport({ obj, paramsData }));
	});

	const REPEAT_EVERY_CHOICES = [
		{ id: 1, name: "Day" },
		{ id: 2, name: "Week" },
		{ id: 3, name: "Month" },
		{ id: 4, name: "Year" },
		{ id: 5, name: "Custom" },
	];

	return (
		<>
			{show && (
				<Grid container spacing={2} style={{ marginTop: "1rem" }}>
					<Grid size={{ xs: 12 }}>
						<Card>
							<form action="">
								<Grid container spacing={2}>
									<Grid size={{ xs: 12, sm: 6, md: 4 }}>
										<FormInput
											name="email"
											label="Email"
											type="email"
											placeholder="Enter email here..."
											control={control}
										/>
									</Grid>
									<Grid size={{ xs: 12, sm: 6, md: 4 }}>
										<Stack flex={1}>
											<CustomDatepicker
												control={control}
												name="startdate"
												hideAddon
												dateFormat="DD-MM-YYYY hh:mm a"
												showTimeSelect={false}
												timeFormat="h:mm a"
												timeCaption="time"
												inputClass="form-input"
												minDate={new Date()}
												label={"Start Date"}
												tI={1}
											/>
										</Stack>
									</Grid>
									<Grid size={{ xs: 12, sm: 6, md: 4 }}>
										<Stack flex={1}>
											<CustomDatepicker
												control={control}
												name="schedule_time"
												hideAddon
												dateFormat="DD-MM-YYYY hh:mm a"
												showTimeSelectOnly={true}
												showTimeSelect
												timeFormat="h:mm a"
												timeCaption="time"
												inputClass="form-input"
												minDate={new Date()}
												label={"Schedule Time"}
												tI={1}
											/>
										</Stack>
									</Grid>
									<Grid size={{ xs: 12, sm: 6, md: 4 }}>
										<SelectComponent
											name="frequency"
											label="Repeat Every"
											control={control}
											rules={{ required: true }}
											options={REPEAT_EVERY_CHOICES}
										/>
									</Grid>
									<Grid size={{ xs: 12, sm: 6, md: 4 }}>
										<FormInput
											name="repeatdays"
											label="Repeat Days"
											type="number"
											placeholder="Repeat Days"
											control={control}
											maxRows={7}
											disabled={
												getValuesFrequency.value == 5
													? false
													: true
											}
										/>
									</Grid>
								</Grid>
								<Button
									variant="contained"
									color="primary"
									onClick={onSave}>
									Schedule Report
								</Button>
							</form>
						</Card>
					</Grid>
				</Grid>
			)}
		</>
	);
};

export default ScheduleReportsView;
