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
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import { getMRNReturn } from "@src/store/sidemenu/project_management/MRNReturn/mrn_return.action";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniLocation,
	getMiniWarehouse,
	getMiniMRN,
	getMiniVendors,
} from "@src/store/mini/mini.Action";
import {
	clearMiniLocation,
	clearMiniWarehouse,
	clearMiniVendors,
	clearMiniMRN,
} from "@src/store/mini/mini.Slice";
import { selectMRNReturn } from "@src/store/sidemenu/project_management/MRNReturn/mrn_return.slice";
import { useParams } from "react-router-dom";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

type FilterFormData = {
	end_date?: string;
	start_date?: string;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const {
		mrnReturn: { pageParams },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniMRN,
			miniWarehouse,
			miniPurchaseOrder,
			miniVendors,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectMRNReturn(state));

	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		vendor: yup.object().optional().nullable(),
		mrn: yup.object().optional().nullable(),
		location: yup.object().optional().nullable(),
		warehouse: yup.object().optional().nullable(),
	});

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			end_date: "",
			start_date: "",
			mrn: null,
			vendor: null,
			location: null,
			warehouse: null,
		};
		dispatch(
			getMRNReturn({
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
				? moment(values.end_date).format("YYYY-MM-DD")
				: "",
			start_date: values.start_date
				? moment(values.start_date).format("YYYY-MM-DD")
				: "",
			...values,
		};

		dispatch(
			getMRNReturn({
				...pageParams,
				page: 1,
				page_size: 10,
				...formData,
			})
		);
		handleFilter(false);
	});

	useEffect(() => {
		reset({
			end_date: pageParams.end_date,
			start_date: pageParams.start_date,
			location: pageParams.location,
			warehouse: pageParams.warehouse,
			mrn: pageParams.purchaseorder,
			vendor: pageParams.vendor,
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
							Material Received Notes Filters
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
											name="mrn"
											label="MRN"
											control={control}
											rules={{ required: true }}
											options={miniMRN?.list?.map(
												(e: {
													id: string | number;
													code: string;
												}) => ({
													id: e.id,
													name: e.code,
												})
											)}
											loading={miniMRN.loading}
											selectParams={{
												page: miniMRN.miniParams.page,
												page_size:
													miniMRN.miniParams
														.page_size,
												search: miniMRN.miniParams
													.search,
												no_of_pages:
													miniMRN.miniParams
														.no_of_pages,
												project: id ? id : "",
											}}
											hasMore={
												miniMRN.miniParams.page <
												miniMRN.miniParams.no_of_pages
											}
											fetchapi={getMiniMRN}
											clearData={clearMiniMRN}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="vendor"
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
												project: id ? id : "",
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
								</Grid>
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
											name="warehouse"
											label="Warehouse"
											control={control}
											rules={{ required: true }}
											options={miniWarehouse?.list?.map(
												(e: {
													id: string;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniWarehouse?.loading}
											selectParams={{
												page: miniWarehouse?.miniParams
													?.page,
												page_size:
													miniWarehouse?.miniParams
														?.page_size,
												search: miniWarehouse
													?.miniParams?.search,
												no_of_pages:
													miniWarehouse?.miniParams
														?.no_of_pages,
											}}
											hasMore={
												miniWarehouse?.miniParams
													?.page <
												miniWarehouse?.miniParams
													?.no_of_pages
											}
											fetchapi={getMiniWarehouse}
											clearData={clearMiniWarehouse}
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
