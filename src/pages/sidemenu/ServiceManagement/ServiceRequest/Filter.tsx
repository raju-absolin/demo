import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Divider, Drawer, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { CustomDatepicker } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import { getServiceRequests } from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.action";
import {
	selectServiceRequests,
	setPageParams,
	useServiceRequestSelector,
} from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.slice";
import { miniType } from "@src/store/mini/mini.Types";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniDepartments, getMiniLocation } from "@src/store/mini/mini.Action";
import { clearMiniDepartments, clearMiniLocation } from "@src/store/mini/mini.Slice";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

type FilterFormData = {
	start_date?: string;
	end_date?: string;
	location?: miniType;
	department?: miniType;
	priority?: miniType;
	status?: miniType
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const {
		serviceRequest: { pageParams },
	} = useAppSelector((state) => selectServiceRequests(state));

	//Form Submission
	const filterSchema = yup.object({
		start_date: yup.string().optional(),
		end_date: yup.string().optional(),
		location: yup.object().optional().nullable(),
		department: yup.object().optional().nullable(),
		priority: yup.object().optional().nullable(),
		approved_status: yup.object().optional().nullable(),
	});

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
		values: {
			start_date: pageParams.start_date,
			end_date: pageParams.end_date,
			location: pageParams.location,
			department: pageParams.department,
			priority: pageParams.priority,
			approved_status: pageParams.approved_status
		},
	});
	const {
		serviceRequest: { isModalVisible: open, selectedData, uploadDocuments },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniDepartments,
		},
	} = useServiceRequestSelector();

	const clearFilters = () => {
		const formData = {
			start_date: "",
			end_date: "",
			location:null,
			department:null,
			priority:null,
			status:null
		};
		dispatch(
			getServiceRequests({
				...pageParams,
				...formData,
			})
		);
		handleFilter(false);
		reset();
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

		dispatch(
			getServiceRequests({
				...pageParams,
				page: 1,
				page_size: 10,
				search: "",
				...formData,
			})
		);
		handleFilter(false);
	});

	const formData = getValues();

	const priority_options: {
		id: string | number;
		name: string;
	}[] = [
			{
				name: "Low",
				id: 1,
			},
			{
				name: "Medium",
				id: 2,
			},
			{
				name: "High",
				id: 3,
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
				name: "Approved",
				id: 2,
			},
			{
				name: "Completed",
				id: 3,
			},
			{
				name: "Reopen",
				id: 4,
			},
			{
				name: "Open",
				id: 4,
			},
			{
				name: "Closed",
				id: 4,
			},
			{
				name: "Rejected",
				id: 4,
			},
		];

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
							Project Filters
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
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="location"
											label="Location"
											control={control}
											rules={{ required: true }}
											options={miniLocationList.map(
												(e: {
													id: string;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniLocationLoading}
											selectParams={{
												page: miniLocationParams.page,
												page_size:
													miniLocationParams.page_size,
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
										<SelectComponent
											name="department"
											label="Department"
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
												location: formData?.location,
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
											multiple={false}
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
											clearFilters();
										}}>
										Clear
									</Button>
									<Button
										variant="contained"
										type="submit">
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
