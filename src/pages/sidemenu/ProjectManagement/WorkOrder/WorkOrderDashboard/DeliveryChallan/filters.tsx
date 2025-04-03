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
import { getDeliveryChallan } from "@src/store/sidemenu/project_management/DeliveryChallan/DC.action";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniLocation,
	getMiniWarehouse,
	getPurchaseOrderMini,
	getMiniCustomers,
	getMiniMaterialRequest,
} from "@src/store/mini/mini.Action";
import {
	clearMiniLocation,
	clearMiniWarehouse,
	clearMiniCustomers,
	clearMiniPurchaseOrder,
	clearMiniMaterialRequest,
} from "@src/store/mini/mini.Slice";
import { selectDeliveryChallan } from "@src/store/sidemenu/project_management/DeliveryChallan/DC.slice";
import { useParams } from "react-router-dom";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const {
		deliveryChallan: { pageParams },
		mini: { miniCustomers },
		system: { userAccessList },
	} = useAppSelector((state) => selectDeliveryChallan(state));

	const DC_TYPE_OPTIONS = [
		{
			id: 1,
			name: "Returnble",
		},
		{
			id: 2,
			name: "NonReturnble",
		},
	];

	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		dc_type: yup.object().optional().nullable(),
		customer: yup.object().optional().nullable(),
	});

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			end_date: "",
			start_date: "",
			dc_type: null,
			customer: null,
		};
		dispatch(
			getDeliveryChallan({
				...pageParams,
				...formData,
			})
		);
		reset(formData);
	};

	const handleFilterSubmit = handleSubmit((values) => {
		const formData: any = {
			project: id ? id : "",
			end_date: values.end_date
				? moment(values.end_date).add(1, "days").format("YYYY-MM-DD")
				: "",
			start_date: values.start_date
				? moment(values.start_date).format("YYYY-MM-DD")
				: "",
			...values,
		};

		dispatch(
			getDeliveryChallan({
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
			customer: pageParams.customer,
			dc_type: pageParams.dc_type,
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
							Delivery Challan Filters
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
											name="customer"
											label="Customers"
											control={control}
											rules={{ required: true }}
											options={miniCustomers?.list?.map(
												(e: {
													id: string;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniCustomers?.loading}
											selectParams={{
												page: miniCustomers?.miniParams
													?.page,
												page_size:
													miniCustomers?.miniParams
														?.page_size,
												search: miniCustomers?.miniParams
													?.search,
												no_of_pages:
													miniCustomers?.miniParams
														?.no_of_pages,
											}}
											hasMore={
												miniCustomers?.miniParams?.page <
												miniCustomers?.miniParams
													?.no_of_pages
											}
											fetchapi={getMiniCustomers}
											clearData={clearMiniCustomers}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="dc_type"
											label="Delivery Challan Type"
											control={control}
											rules={{ required: true }}
											options={DC_TYPE_OPTIONS}
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
