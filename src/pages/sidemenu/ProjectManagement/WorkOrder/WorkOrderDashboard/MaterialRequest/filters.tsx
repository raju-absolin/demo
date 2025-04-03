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
	selectMaterialRequest,
	setPageParams,
} from "@src/store/sidemenu/project_management/MaterialRequest/material_request.slice";
import { getMaterialRequest } from "@src/store/sidemenu/project_management/MaterialRequest/material_request.action";
import SelectComponent from "@src/components/form/SelectComponent";

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
		materialRequest: { pageParams },
		system: { userAccessList },
	} = useAppSelector((state) => selectMaterialRequest(state));

	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		mr_status: yup.object().optional().nullable(),
	});

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			end_date: "",
			start_date: "",
			mr_status: null,
			location: null,
			warehouse: null,
		};
		dispatch(
			getMaterialRequest({
				...pageParams,
				...formData,
			})
		);
		handleFilter(false);
		reset(formData);
	};

	const handleFilterSubmit = handleSubmit((values) => {
		console.log(values);
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
			getMaterialRequest({
				...pageParams,
				page: 1,
				page_size: 10,
				...formData,
			})
		);
		handleFilter(false);
	});

	const mr_status = [
		{
			id: 1,
			name: "Pending",
		},
		{
			id: 2,
			name: "Locked",
		},
		{
			id: 3,
			name: "Approved",
		},
		{
			id: 4,
			name: "Rejected",
		},
	];

	useEffect(() => {
		reset({
			end_date: pageParams.end_date,
			start_date: pageParams.start_date,
			mr_status: pageParams.mr_status,
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
							Material Request Filters
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
											name="mr_status"
											label="Status"
											control={control}
											rules={{ required: true }}
											options={mr_status}
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
