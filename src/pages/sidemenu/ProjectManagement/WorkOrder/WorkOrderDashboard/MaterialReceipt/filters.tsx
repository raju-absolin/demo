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
	selectMaterialReceipt,
	setPageParams,
} from "@src/store/sidemenu/project_management/MaterialReceipt/material_receipt.slice";
import { getMaterialReceipt } from "@src/store/sidemenu/project_management/MaterialReceipt/material_receipt.action";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniMaterialIssue,
	getMiniWarehouse,
} from "@src/store/mini/mini.Action";
import {
	clearMiniMaterialIssue,
	clearMiniWarehouse,
} from "@src/store/mini/mini.Slice";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

type FilterFormData = {
	end_date?: string;
	start_date?: string;
	mr_status?: any;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const {
		materialReceipt: { pageParams },
		mini: { miniWarehouse, miniMaterialIssue },
		system: { userAccessList },
	} = useAppSelector((state) => selectMaterialReceipt(state));

	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		material_issue: yup.object().optional().nullable(),
		warehouse: yup.object().optional().nullable(),
	});

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			end_date: "",
			start_date: "",
			material_issue: null,
			warehouse: null,
		};
		dispatch(
			getMaterialReceipt({
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
			getMaterialReceipt({
				...pageParams,
				page: 1,
				page_size: 10,
				...formData,
			})
		);
		handleFilter(false);
	});

	// const mr_status = [
	//     {
	//         id: 1,
	//         name: "Pending",
	//     },
	//     {
	//         id: 2,
	//         name: "InProgress",
	//     },
	//     {
	//         id: 3,
	//         name: "Issued",
	//     },
	//     {
	//         id: 4,
	//         name: "Closed"
	//     }
	// ];

	useEffect(() => {
		reset({
			end_date: pageParams.end_date,
			start_date: pageParams.start_date,
			material_issue: pageParams.material_issue,
			warehouse: pageParams.warehouse,
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
							Material Receipt Filters
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
											name="material_issue"
											label="Material Issue"
											control={control}
											rules={{ required: true }}
											options={miniMaterialIssue?.list?.map(
												(e: {
													id: string | number;
													code: string;
												}) => ({
													id: e.id,
													name: e.code,
												})
											)}
											loading={miniMaterialIssue.loading}
											selectParams={{
												page: miniMaterialIssue
													.miniParams.page,
												page_size:
													miniMaterialIssue.miniParams
														.page_size,
												search: miniMaterialIssue
													.miniParams.search,
												no_of_pages:
													miniMaterialIssue.miniParams
														.no_of_pages,
											}}
											hasMore={
												miniMaterialIssue.miniParams
													.page <
												miniMaterialIssue.miniParams
													.no_of_pages
											}
											fetchapi={getMiniMaterialIssue}
											clearData={clearMiniMaterialIssue}
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
