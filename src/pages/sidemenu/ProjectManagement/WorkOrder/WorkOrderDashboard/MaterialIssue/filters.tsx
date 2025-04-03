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
import { getMaterialIssues } from "@src/store/sidemenu/project_management/MaterialIssue/mr_issues.action";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniLocation,
	getMiniWarehouse,
	getPurchaseOrderMini,
	getMiniVendors,
	getMiniMaterialRequest,
} from "@src/store/mini/mini.Action";
import {
	clearMiniLocation,
	clearMiniWarehouse,
	clearMiniVendors,
	clearMiniPurchaseOrder,
	clearMiniMaterialRequest,
} from "@src/store/mini/mini.Slice";
import { selectMaterialIssues } from "@src/store/sidemenu/project_management/MaterialIssue/mr_issues.slice";
import { useParams } from "react-router-dom";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

type FilterFormData = {
	end_date?: string;
	start_date?: string;
	warehouse?: any;
	materialrequest?: any;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const {
		materialIssues: { pageParams },
		mini: {
			miniLocationList,
			miniMaterialRequest,
			miniLocationLoading,
			miniLocationParams,
			miniWarehouse,
			miniPurchaseOrder,
			miniVendors,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectMaterialIssues(state));

	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		materialrequest: yup.object().optional().nullable(),
		warehouse: yup.object().optional().nullable(),
	});

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			end_date: "",
			start_date: "",
			materialrequest: null,
			warehouse: null,
		};
		dispatch(
			getMaterialIssues({
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

		dispatch(
			getMaterialIssues({
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
			warehouse: pageParams.warehouse,
			materialrequest: pageParams.materialrequest,
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
							Material Issue Filters
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
											name="materialrequest"
											label="Material Request"
											control={control}
											rules={{ required: true }}
											options={miniMaterialRequest?.list?.map(
												(e: {
													id: string | number;
													code: string;
												}) => ({
													id: e.id,
													name: e.code,
												})
											)}
											loading={
												miniMaterialRequest.loading
											}
											selectParams={{
												page: miniMaterialRequest
													.miniParams.page,
												page_size:
													miniMaterialRequest
														.miniParams.page_size,
												search: miniMaterialRequest
													.miniParams.search,
												no_of_pages:
													miniMaterialRequest
														.miniParams.no_of_pages,
												project: id ? id : "",
											}}
											hasMore={
												miniMaterialRequest.miniParams
													.page <
												miniMaterialRequest.miniParams
													.no_of_pages
											}
											fetchapi={getMiniMaterialRequest}
											clearData={clearMiniMaterialRequest}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="warehouse"
											label="From Warehouse"
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
