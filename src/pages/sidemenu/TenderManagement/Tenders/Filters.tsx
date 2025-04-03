import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Grid2 as Grid,
	Button,
	Divider,
	Drawer,
	FormLabel,
	Stack,
	Typography,
} from "@mui/material";
import { CustomDatepicker } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import { getTenders } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import {
	selectTenders,
	setPageParams,
} from "@src/store/sidemenu/tender_mangement/tenders/tenders.slice";

import {
	getMiniCompany,
	getMiniCustomers,
	getMiniProjects,
	getMiniStages,
	getMiniTenderNature,
	getMiniUsers,
} from "@src/store/mini/mini.Action";
import {
	clearMiniCompany,
	clearMiniCustomers,
	clearMiniProjects,
	clearMiniStages,
	clearMiniUsers,
	clearTenderNature,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";

const tender_types: { id: string | number; name: string }[] = [
	{ id: 1, name: "Open Bid" },
	{ id: 2, name: "Limited Bid" },
	{ id: 3, name: "SBC" },
];
const project_types: { id: string | number; name: string }[] = [
	{
		id: 1,
		name: "Open Bid",
	},
	{
		id: 2,
		name: "Limited Bid",
	},
];

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};
const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const {
		tenders: { pageParams },
		mini: {
			miniUserList,
			miniUserLoading,
			miniUserParams,
			miniProject,
			miniCompany,
			miniTenderNature,
			miniCustomers,
			miniStages,
		},
	} = useAppSelector((state) => selectTenders(state));

	const status = [
		{
			id: 1,
			name: "Pending",
		},
		{
			id: 2,
			name: "Approved",
		},
		{
			id: 3,
			name: "Rejected",
		},
		{
			id: 4,
			name: "Cancelled",
		},
		{
			id: 5,
			name: "Converted To Project",
		},
	];

	const { start_date, end_date } = pageParams;
	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		status: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		assign_to: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		tender_stage: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		project: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		tender_type: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		company: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		product_type: yup
			.object({
				label: yup.string().optional().nullable(),
				value: yup.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		sourceportal: yup
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
	});

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const handleChangeInput = (data: {}) => {
		dispatch(
			setPageParams({
				...pageParams,
				...data,
			})
		);
	};

	const clearFilters = () => {
		const formData = {
			end_date: "",
			start_date: "",
			assign_to: null,
			tender_stage: null,
			project: null,
			tender_type: null,
			company: null,
			product_type: null,
			sourceportal: null,
			customer: null,
			status: null,
		};
		dispatch(
			getTenders({
				...pageParams,
				...formData,
			})
		);
		handleFilter(false);
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
			assign_to: values.assign_to,
			tender_stage: values.tender_stage,
			project: values.project,
			tender_type: values.tender_type,
			company: values.company,
			product_type: values.product_type,
			sourceportal: values.sourceportal,
			customer: values.customer,
			status: values.status,
		};

		dispatch(
			getTenders({
				...pageParams,
				page: 1,
				...formData,
			})
		);
		handleFilter(false);
	});

	useEffect(() => {
		reset({
			end_date: pageParams.end_date,
			start_date: pageParams.start_date,
			assign_to: pageParams?.assign_to ? pageParams?.assign_to : null,
			tender_stage: pageParams?.tender_stage
				? pageParams?.tender_stage
				: null,
			project: pageParams?.project ? pageParams?.project : null,
			tender_type: pageParams?.tender_type
				? pageParams?.tender_type
				: null,
			company: pageParams?.company ? pageParams?.company : null,
			product_type: pageParams?.product_type
				? pageParams?.product_type
				: null,
			sourceportal: pageParams?.sourceportal
				? pageParams?.sourceportal
				: null,
			customer: pageParams?.customer ? pageParams?.customer : null,
			status: pageParams?.status ? pageParams?.status : null,
		});
	}, [pageParams]);

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
							Bid Filters
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
									{/* <Grid
										size={{
											xs: 12,
											md: 6,
										}}>
										<SelectComponent
											name="project"
											label="Project"
											control={control}
											rules={{ required: true }}
											options={miniProject?.list.map(
												(e: {
													id: string | number;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniProject?.loading}
											selectParams={{
												page: miniProject?.miniParams
													?.page,
												page_size:
													miniProject?.miniParams
														?.page_size,
												search: miniProject?.miniParams
													?.search,
												no_of_pages:
													miniProject?.miniParams
														?.no_of_pages,
											}}
											hasMore={
												miniProject?.miniParams?.page <
												miniProject?.miniParams
													?.no_of_pages
											}
											fetchapi={getMiniProjects}
											clearData={clearMiniProjects}
										/>
									</Grid> */}
									<Grid
										size={{
											xs: 12,
											md: 6,
										}}>
										<SelectComponent
											name="assign_to"
											label="Assign To"
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
												page_size:
													miniUserParams.page_size,
												search: miniUserParams.search,
												no_of_pages:
													miniUserParams.no_of_pages,
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
											name="tender_type"
											label="Bid Type"
											control={control}
											rules={{ required: true }}
											options={tender_types}
										/>
									</Grid>
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
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="product_type"
											label="Products & Services"
											control={control}
											rules={{ required: true }}
											options={project_types}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="sourceportal"
											label="Source Portal"
											control={control}
											rules={{ required: true }}
											options={miniTenderNature.list.map(
												(e: {
													id: string | number;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniTenderNature.loading}
											selectParams={{
												page: miniTenderNature
													.miniParams.page,
												page_size:
													miniTenderNature.miniParams
														.page_size,
												search: miniTenderNature
													.miniParams.search,
												no_of_pages:
													miniTenderNature.miniParams
														.no_of_pages,
											}}
											hasMore={
												miniTenderNature.miniParams
													.page <
												miniTenderNature.miniParams
													.no_of_pages
											}
											fetchapi={getMiniTenderNature}
											clearData={clearTenderNature}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="tender_stage"
											label="Bid Stage"
											control={control}
											rules={{ required: true }}
											options={miniStages?.list}
											loading={miniStages?.loading}
											selectParams={{
												page: miniStages?.miniParams
													?.page,
												page_size:
													miniStages?.miniParams
														?.page_size,
												search: miniStages?.miniParams
													?.search,
												no_of_pages:
													miniStages?.miniParams
														?.no_of_pages,
											}}
											hasMore={
												miniStages?.miniParams?.page <
												miniStages?.miniParams
													?.no_of_pages
											}
											fetchapi={getMiniStages}
											clearData={clearMiniStages}
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
											name="status"
											label="Status"
											control={control}
											rules={{ required: true }}
											options={status}
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
									<Button variant="contained" type="submit">
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
