import React from "react";
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
import { getPurchaseQuotations } from "@src/store/sidemenu/project_management/PurchaseQuotation/pq.action";
import {
	setPageParams,
	selectPurchaseQuotations,
} from "@src/store/sidemenu/project_management/PurchaseQuotation/pq.slice";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniEnquiry, getMiniVendors } from "@src/store/mini/mini.Action";
import { clearMiniEnquiry, clearMiniVendors } from "@src/store/mini/mini.Slice";
import { useParams } from "react-router-dom";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const {
		purchaseQuotation: { pageParams },
		mini: { miniEnquiry, miniVendors },
		system: { userAccessList },
	} = useAppSelector((state) => selectPurchaseQuotations(state));
	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		vendor: yup.object().optional().nullable(),
		purchase_enquiry: yup.object().optional().nullable(),
		qstatus: yup.object().optional().nullable(),
	});

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			start_date: "",
			end_date: "",
			vendor: null,
			purchase_enquiry: null,
			qstatus: null,
		};
		reset(formData);
		dispatch(
			getPurchaseQuotations({
				...pageParams,
				...formData,
			})
		);
		handleFilter(false);
	};

	const handleFilterSubmit = handleSubmit((values) => {
		const formData: any = {
			start_date: values.start_date
				? moment(values.start_date).format("YYYY-MM-DD")
				: "",
			end_date: values.end_date
				? moment(values.end_date).add(1, "days").format("YYYY-MM-DD")
				: "",
			vendor: values.vendor,
			purchase_enquiry: values.purchase_enquiry,
			qstatus: values.qstatus,
		};

		dispatch(
			getPurchaseQuotations({
				...pageParams,
				page: 1,
				page_size: 10,
				search: "",
				...formData,
			})
		);
		handleFilter(false);
	});

	const qstatus = [
		{
			id: 1,
			name: "Pending",
		},
		{
			id: 2,
			name: "Open",
		},
		{
			id: 3,
			name: "Close",
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
							Purchase Quotation Filters
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
												project: id ? id : "",
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
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="qstatus"
											label="Status"
											control={control}
											rules={{ required: true }}
											options={qstatus}
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
