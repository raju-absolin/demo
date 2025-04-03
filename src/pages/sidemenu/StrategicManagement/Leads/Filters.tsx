import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Divider,
	Drawer,
	Stack,
	Typography,
	Grid2 as Grid,
} from "@mui/material";
import { CustomDatepicker, FormInput } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import { getLeads } from "@src/store/sidemenu/strategic_management/leads/leads.action";
import {
	selectLeads,
	setIsFilterOpen,
	setPageParams,
} from "@src/store/sidemenu/strategic_management/leads/leads.slice";
import {
	clearMiniCompany,
	clearMiniCustomers,
	clearMiniDepartmentUsers,
	clearMiniLocation,
	clearMiniVendors,
} from "@src/store/mini/mini.Slice";
import {
	getMiniCompany,
	getMiniCustomers,
	getMiniDepartmentUsers,
	getMiniLocation,
	getMiniVendors,
} from "@src/store/mini/mini.Action";
import SelectComponent from "@src/components/form/SelectComponent";
import Company from "@src/pages/masters/Company";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

type FilterFormData = {
	start_date?: string;
	end_date?: string;
	company?: string;
	location?: string;
	customer?: string;
	lead_item__vendors?: string;
	assignees?: string;
	assigned_by?: string;
	status?: string;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const {
		leads: { pageParams, leadsList },
		mini: {
			miniCompany,
			miniCustomers,
			miniVendors,
			miniDepartmentUsers,
			miniLocationLoading,
			miniLocationList,
			miniLocationParams,
		},
	} = useAppSelector((state) => selectLeads(state));

	//Form Submission
	const filterSchema = yup.object({
		start_date: yup.string().optional(),
		end_date: yup.string().optional(),
		assigned_by: yup.string().trim().optional(),
		company: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		location: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		customer: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		lead_item__vendors: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		assignees: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		status: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
	});

	useEffect(() => {
		reset({
			end_date: pageParams.end_date,
			start_date: pageParams.start_date,
			lead_item__vendors: pageParams?.lead_item__vendors
				? pageParams?.lead_item__vendors
				: null,
			location: pageParams?.location ? pageParams?.location : null,
			company: pageParams?.company ? pageParams?.company : null,
			assignees: pageParams?.assignees ? pageParams?.assignees : null,
			assigned_by: pageParams?.assigned_by
				? pageParams?.assigned_by
				: null,
			customer: pageParams?.customer ? pageParams?.customer : null,
			status: pageParams?.status ? pageParams?.status : null,
		});
	}, [pageParams]);

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
		values: {
			start_date: pageParams.start_date,
			end_date: pageParams.end_date,
			company: pageParams.company,
			location: pageParams.location,
			customer: pageParams.customer,
			lead_item__vendors: pageParams.lead_item__vendors,
			assignees: pageParams.assignees,
			assigned_by: pageParams.assigned_by,
			status: pageParams.status,
		},
	});

	const clearFilters = () => {
		const formData = {
			start_date: "",
			end_date: "",
			company: null,
			location: null,
			lead_item__vendors: null,
			assignees: null,
			assigned_by: "",
			customer: null,
			status: null,
		};
		dispatch(
			getLeads({
				...pageParams,
				...formData,
			})
		);
		dispatch(setIsFilterOpen(false));
	};
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
			name: "Rejected",
			id: 3,
		},
	];

	const handleFilterSubmit = handleSubmit((values) => {
		const formData = {
			start_date: values.start_date
				? moment(values.start_date).format("YYYY-MM-DD")
				: "",
			end_date: values.end_date
				? moment(values.end_date).format("YYYY-MM-DD")
				: "",
			company: values.company,
			location: values.location,
			customer: values.customer,
			lead_item__vendors: values.lead_item__vendors,
			assignees: values.assignees,
			status: values.status,
		};

		dispatch(
			getLeads({
				...pageParams,
				page: 1,
				page_size: 10,
				search: "",
				...formData,
			})
		);
		dispatch(setIsFilterOpen(false));
	});

	const formData = getValues();
	// let leadAssignees: any[] = [];

	// leadsList?.forEach((val) => {
	// 	if (val?.assignees) {
	// 		leadAssignees = val.assignees;
	// 	}
	// });

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
							Lead Filters
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
											name="company"
											label="Company"
											control={control}
											rules={{ required: true }}
											options={miniCompany.list.map(
												(e: {
													id: string | number;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniCompany.loading}
											selectParams={{
												page: miniCompany.miniParams
													.page,
												page_size:
													miniCompany.miniParams
														.page_size,
												search: miniCompany.miniParams
													.search,
												no_of_pages:
													miniCompany.miniParams
														.no_of_pages,
											}}
											hasMore={
												miniCompany.miniParams.page <
												miniCompany.miniParams
													.no_of_pages
											}
											fetchapi={getMiniCompany}
											clearData={clearMiniCompany}
										/>
									</Grid>
									<Grid size={{ xs: 12, sm: 6 }}>
										<SelectComponent
											name="location"
											label="Location"
											control={control}
											rules={{ required: true }}
											options={miniLocationList?.map(
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
											name="customer"
											label="Customer"
											control={control}
											rules={{ required: true }}
											options={miniCustomers.list.map(
												(e: {
													id: string;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniCustomers.loading}
											selectParams={{
												page: miniCustomers.miniParams
													.page,
												page_size:
													miniCustomers.miniParams
														.page_size,
												search: miniCustomers.miniParams
													.search,
												no_of_pages:
													miniCustomers.miniParams
														.no_of_pages,
											}}
											hasMore={
												miniCustomers.miniParams.page <
												miniCustomers.miniParams
													.no_of_pages
											}
											fetchapi={getMiniCustomers}
											clearData={clearMiniCustomers}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="lead_item__vendors"
											label="Vendor"
											control={control}
											rules={{ required: true }}
											options={miniVendors.list.map(
												(e: {
													id: string | number;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniVendors.loading}
											selectParams={{
												page: miniVendors.miniParams
													.page,
												page_size:
													miniVendors.miniParams
														.page_size,
												search: miniVendors.miniParams
													.search,
												no_of_pages:
													miniVendors.miniParams
														.no_of_pages,
											}}
											hasMore={
												miniVendors.miniParams.page <
												miniVendors.miniParams
													.no_of_pages
											}
											fetchapi={getMiniVendors}
											clearData={clearMiniVendors}
										/>
									</Grid>
									{/* <Grid size={{ xs: 12, sm: 6 }}>
										<SelectComponent
											label="Assigned Users"
											name="assignees"
											required={false}
											multiple={false}
											control={control}
											rules={{
												required: true,
											}}
											options={
												leadAssignees?.map(
													(e: {
														id: string | number;
														fullname: string;
													}) => ({
														id: e.id,
														name: e.fullname,
													})
												) || []
											}
											onChange={(data) => {}}
											loading={
												miniDepartmentUsers.loading
											}
											selectParams={{
												page: miniDepartmentUsers
													.miniParams.page,
												page_size:
													miniDepartmentUsers
														.miniParams.page_size,
												search: miniDepartmentUsers
													.miniParams.search,
												no_of_pages:
													miniDepartmentUsers
														.miniParams.no_of_pages,
											}}
											hasMore={
												miniDepartmentUsers.miniParams
													.page <
												miniDepartmentUsers.miniParams
													.no_of_pages
											}
											fetchapi={getMiniDepartmentUsers}
											clearData={clearMiniDepartmentUsers}
										/>
									</Grid> */}
									<Grid size={{ xs: 12, md: 6 }}>
										<FormInput
											name="assigned_by"
											label="Assigned By"
											type="text"
											placeholder="Enter Assigned By"
											control={control}
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
										// disabled={
										// 	Object.values(formData).find(
										// 		(e) => e
										// 	)
										// 		? false
										// 		: true
										// }
										onClick={() => {
											clearFilters();
										}}>
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
