import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Divider,
	Drawer,
	FormLabel,
	Grid2 as Grid,
	Stack,
	Typography,
} from "@mui/material";
import { CustomDatepicker } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import moment from "moment";
import { useTaskActions } from "@src/store/sidemenu/task_management/tasks/tasks.action";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniLocation,
	getMiniMileStones,
	getMiniProjectGroups,
	getMiniWarehouse,
} from "@src/store/mini/mini.Action";
import {
	clearMiniLocation,
	clearMiniMilestones,
	clearMiniProjectGroups,
	clearMiniWarehouse,
} from "@src/store/mini/mini.Slice";
import { useTaskSelector } from "@src/store/sidemenu/task_management/tasks/tasks.slice";
import { miniType } from "@src/store/mini/mini.Types";
import { useParams } from "react-router-dom";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const {
		tasks: { pageParams },
		mini: { miniProjectGroups, miniMileStones },
		system: { userAccessList },
	} = useTaskSelector();

	const { id } = useParams();

	const {
		reducer: { setPageParams },
		extraReducer: { getTasks },
	} = useTaskActions();

	const priority_options: {
		id: string | number;
		name: string;
	}[] = [
		{
			name: "Low",
			id: 1,
		},
		{
			name: "Moderate",
			id: 2,
		},
		{
			name: "Urgent",
			id: 3,
		},
		{
			name: "Very Urgent",
			id: 4,
		},
	];

	const status_options: {
		id: string | number;
		name: string;
	}[] = [
		{
			name: "Pending",
			id: 1,
		},
		{
			name: "In Progress",
			id: 2,
		},
		{
			name: "Completed",
			id: 3,
		},
		{
			name: "Closed",
			id: 4,
		},
		{
			name: "Reopen",
			id: 4,
		},
	];

	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		group: yup.object().optional().nullable(),
		milestone: yup.object().optional().nullable(),
		priority: yup.object().optional().nullable(),
		status: yup.object().optional().nullable(),
	});

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			end_date: "",
			start_date: "",
			group: null,
			priority: null,
			status: null,
			milestone: null,
		};

		getTasks({
			...pageParams,
			...formData,
		});

		reset(formData);
	};

	const handleFilterSubmit = handleSubmit((values) => {
		const formData: any = {
			end_date: values.end_date
				? moment(values.end_date).add(1, "days").format("YYYY-MM-DD")
				: "",
			start_date: values.start_date
				? moment(values.start_date).format("YYYY-MM-DD")
				: "",
			...values,
		};

		getTasks({
			...pageParams,
			page: 1,
			page_size: 10,
			...formData,
		});
		handleFilter(false);
	});

	useEffect(() => {
		reset({
			end_date: pageParams.end_date,
			start_date: pageParams.start_date,
			group: pageParams.group || null,
			milestone: pageParams.milestone || null,
			priority: pageParams.priority || null,
			status: pageParams.status || null,
		});
	}, [pageParams]);

	const formData = getValues();

	return (
		<>
			<Drawer
				anchor={"right"}
				open={openFilter}
				onClose={() => handleFilter(false)}>
				<Box
					sx={{
						width: 450,
						p: 2,
					}}>
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						<Typography variant="h5" sx={{ mb: 1 }}>
							Task Filters
						</Typography>
						<Divider
							sx={{
								mb: 1,
							}}
						/>

						<form onSubmit={handleFilterSubmit}>
							<Box>
								<Stack
									direction="row"
									spacing={2}
									justifyContent={"space-between"}
									useFlexGap={false}>
									<Stack width={"100%"}>
										<CustomDatepicker
											control={control}
											name="start_date"
											hideAddon
											dateFormat="DD-MM-YYYY"
											showTimeSelect={false}
											timeFormat="h:mm a"
											timeCaption="time"
											inputClass="form-input"
											label={"From Date"}
											tI={1}
										/>
									</Stack>
									<Stack width={"100%"}>
										<CustomDatepicker
											control={control}
											name="end_date"
											hideAddon
											dateFormat="DD-MM-YYYY"
											showTimeSelect={false}
											timeFormat="h:mm a"
											timeCaption="time"
											inputClass="form-input"
											label={"To Date"}
											tI={1}
										/>
									</Stack>
								</Stack>
								<Grid container spacing={1} mt={1}>
									{/* <Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="group"
											label="Group"
											multiple={false}
											control={control}
											rules={{ required: true }}
											options={miniProjectGroups?.list?.map(
												(e: {
													id: string | number;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniProjectGroups?.loading}
											selectParams={{
												page: miniProjectGroups
													?.miniParams?.page,
												page_size:
													miniProjectGroups
														?.miniParams?.page_size,
												search: miniProjectGroups
													?.miniParams?.search,
												no_of_pages:
													miniProjectGroups
														?.miniParams
														?.no_of_pages,
											}}
											hasMore={
												miniProjectGroups?.miniParams
													?.page <
												miniProjectGroups?.miniParams
													?.no_of_pages
											}
											fetchapi={getMiniProjectGroups}
											clearData={clearMiniProjectGroups}
										/>
									</Grid> */}
									{id && (
										<Grid size={{ xs: 12, md: 6 }}>
											<SelectComponent
												name="milestone"
												label="Mile Stones"
												multiple={false}
												control={control}
												rules={{ required: true }}
												options={miniMileStones?.list?.map(
													(e: {
														id: string | number;
														name: string;
													}) => ({
														id: e.id,
														name: e.name,
													})
												)}
												loading={
													miniMileStones?.loading
												}
												selectParams={{
													page: miniMileStones
														?.miniParams?.page,
													page_size:
														miniMileStones
															?.miniParams
															?.page_size,
													search: miniMileStones
														?.miniParams?.search,
													no_of_pages:
														miniMileStones
															?.miniParams
															?.no_of_pages,
												}}
												hasMore={
													miniMileStones?.miniParams
														?.page <
													miniMileStones?.miniParams
														?.no_of_pages
												}
												fetchapi={getMiniMileStones}
												clearData={clearMiniMilestones}
											/>
										</Grid>
									)}
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="priority"
											label="Priority"
											multiple={false}
											control={control}
											rules={{ required: true }}
											options={priority_options}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="status"
											label="Status"
											control={control}
											rules={{ required: true }}
											options={status_options}
										/>
									</Grid>
								</Grid>
							</Box>
							<Box mt={2}>
								<Divider />
								<Stack
									direction="row"
									justifyContent="flex-end"
									spacing={2}
									mt={2}>
									<Button
										variant="outlined"
										onClick={() => {
											handleFilter(false);
											clearFilters();
										}}
										// disabled={
										// 	Object.values(formData).find(
										// 		(e) => e
										// 	)
										// 		? false
										// 		: true
										// }
									>
										Clear
									</Button>
									<Button
										variant="contained"
										type="submit"
										// disabled={
										// 	Object.values(formData).find(
										// 		(e) => e
										// 	)
										// 		? false
										// 		: true
										// }
									>
										Apply
									</Button>
								</Stack>
							</Box>
						</form>
					</Box>
				</Box>
			</Drawer>
		</>
	);
};

export default Filters;
