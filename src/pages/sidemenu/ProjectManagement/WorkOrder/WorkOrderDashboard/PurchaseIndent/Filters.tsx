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
import {
	selectIndent,
	setPageParams,
} from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.slice";
import { getPurchaseIndent } from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.action";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniLocation,
	getMiniWarehouse,
	getWarehouseByProject,
} from "@src/store/mini/mini.Action";
import {
	clearMiniLocation,
	clearMiniWarehouse,
	clearWarehouseByProject,
} from "@src/store/mini/mini.Slice";
import { useParams } from "react-router-dom";
import { miniType } from "@src/store/mini/mini.Types";

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
		purchaseIndent: { pageParams },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			warehouseByProject,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectIndent(state));

	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		// pistatus: yup.object().optional().nullable(),
		location: yup
			.object({
				label: yup.string().required(),
				value: yup.string().required(),
			})
			.optional()
			.nullable(),
		warehouse: yup
			.object({
				label: yup.string().required(),
				value: yup.string().required(),
			})
			.optional()
			.nullable(),
	});

	const { control, handleSubmit, reset, getValues, watch } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const getValuesLocation = watch("location");

	const clearFilters = () => {
		const formData = {
			end_date: "",
			start_date: "",
			pistatus: null,
			location: null,
			warehouse: null,
		};
		dispatch(
			getPurchaseIndent({
				...pageParams,
				...formData,
			})
		);
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
		if (Object.values(values).length > 0) {
			dispatch(
				getPurchaseIndent({
					...pageParams,
					page: 1,
					page_size: 10,
					...formData,
				})
			);
		}
		handleFilter(false);
	});

	const pistatus = [
		{
			id: 1,
			name: "Pending",
		},
		{
			id: 2,
			name: "PE In Prograss",
		},
		{
			id: 3,
			name: "Purchase Enquiry",
		},
	];

	useEffect(() => {
		reset({
			end_date: pageParams.end_date,
			start_date: pageParams.start_date,
			// pistatus: pageParams.pistatus,
			location: pageParams.location as any,
			warehouse: pageParams.warehouse as any,
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
							Purchase Indent Filters
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
											name="warehouse"
											label="Warehouse"
											control={control}
											rules={{ required: true }}
											options={warehouseByProject?.list?.map(
												(e: {
													id: string;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={
												warehouseByProject?.loading
											}
											selectParams={{
												page: warehouseByProject
													?.miniParams?.page,
												page_size:
													warehouseByProject
														?.miniParams?.page_size,
												search: warehouseByProject
													?.miniParams?.search,
												no_of_pages:
													warehouseByProject
														?.miniParams
														?.no_of_pages,
												project_id: id ? id : "",
												location:
													getValuesLocation?.value,
											}}
											disabled={!getValuesLocation?.value}
											helperText={
												!getValuesLocation?.value
													? "Select a location before selecting a warehouse"
													: ""
											}
											hasMore={
												warehouseByProject?.miniParams
													?.page <
												warehouseByProject?.miniParams
													?.no_of_pages
											}
											fetchapi={getWarehouseByProject}
											clearData={clearWarehouseByProject}
										/>
									</Grid>
									{/* <Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="pistatus"
											label="Status"
											control={control}
											rules={{ required: true }}
											options={pistatus}
										/>
									</Grid> */}
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
