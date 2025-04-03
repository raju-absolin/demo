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
	selectPurchaseOrders,
	setPageParams,
} from "@src/store/sidemenu/project_management/PurchaseOrder/po.slice";
import { getPurchaseOrders } from "@src/store/sidemenu/project_management/PurchaseOrder/po.action";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniLocation,
	getMiniEnquiry,
	getMiniWarehouse,
	getMiniVendors,
} from "@src/store/mini/mini.Action";
import {
	clearMiniEnquiry,
	clearMiniLocation,
	clearMiniVendors,
	clearMiniWarehouse,
} from "@src/store/mini/mini.Slice";

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
	const {
		purchaseOrder: { pageParams },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniVendors,
			miniEnquiry,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectPurchaseOrders(state));

	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		approved_status: yup.object().optional().nullable(),
		location: yup.object().optional().nullable(),
		vendor: yup.object().optional().nullable(),
		purchase_enquiry: yup.object().optional().nullable(),
	});

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			end_date: "",
			start_date: "",
			approved_status: null,
			vendor: null,
			purchase_enquiry: null,
			location: null,
		};
		dispatch(
			getPurchaseOrders({
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
			...values,
		};

		dispatch(
			getPurchaseOrders({
				...pageParams,
				page: 1,
				page_size: 10,
				...formData,
			})
		);
		handleFilter(false);
	});

	const approved_status = [
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
	];

	useEffect(() => {
		reset({
			end_date: pageParams.end_date,
			start_date: pageParams.start_date,
			approved_status: pageParams.approved_status,
			location: pageParams.location,
			vendor: pageParams.vendor,
			purchase_enquiry: pageParams.purchase_enquiry,
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
							Purchase Order Filters
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
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="purchase_enquiry"
											label="Purchase Enquiry"
											control={control}
											rules={{ required: true }}
											options={miniEnquiry.list.map(
												(e: {
													id: string | number;
													code: string;
												}) => ({
													id: e.id,
													name: e.code,
												})
											)}
											loading={miniEnquiry.loading}
											selectParams={{
												page: miniEnquiry.miniParams
													.page,
												page_size:
													miniEnquiry.miniParams
														.page_size,
												search: miniEnquiry.miniParams
													.search,
												no_of_pages:
													miniEnquiry.miniParams
														.no_of_pages,
											}}
											hasMore={
												miniEnquiry.miniParams.page <
												miniEnquiry.miniParams
													.no_of_pages
											}
											fetchapi={getMiniEnquiry}
											clearData={clearMiniEnquiry}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="approved_status"
											label="Status"
											control={control}
											rules={{ required: true }}
											options={approved_status}
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
										}}
										>
										Clear
									</Button>
									<Button
										variant="contained"
										type="submit"
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
