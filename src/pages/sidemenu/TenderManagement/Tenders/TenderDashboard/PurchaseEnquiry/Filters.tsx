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
	selectEnquiry,
	setPageParams,
} from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.slice";
import { getPurchaseEnquiry } from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.action";
import SelectComponent from "@src/components/form/SelectComponent";

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
		purchaseEnquiry: { pageParams },
		tenders: { selectedData: tenderSelectedData },
		system: { userAccessList },
	} = useAppSelector((state) => selectEnquiry(state));

	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		rfqstatus: yup.object().optional().nullable(),
	});

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			project_id: tenderSelectedData.project?.id,
			end_date: "",
			start_date: "",
			rfqstatus: null,
		};
		dispatch(
			getPurchaseEnquiry({
				...pageParams,
				...formData,
			})
		);
		reset({
			end_date: "",
			start_date: "",
		});
	};

	const handleFilterSubmit = handleSubmit((values) => {
		const formData: any = {
			project_id: tenderSelectedData.project?.id,
			end_date: values.end_date
				? moment(values.end_date).add(1, "days").format("YYYY-MM-DD")
				: "",
			start_date: values.start_date
				? moment(values.start_date).format("YYYY-MM-DD")
				: "",
			...values,
		};

		dispatch(
			getPurchaseEnquiry({
				...pageParams,
				page: 1,
				page_size: 10,
				search: "",
				...formData,
			})
		);
		handleFilter(false);
	});

	const rfqStatus = [
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
			name: "PO In Progress",
		},
		{
			id: 4,
			name: "Close",
		},
		{
			id: 4,
			name: "'Compare Quotation",
		},
	];

	useEffect(() => {
		reset({
			end_date: pageParams.end_date,
			start_date: pageParams.start_date,
			rfqstatus: pageParams.rfqstatus,
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
							Purchase Enquiry Filters
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
											name="end_date"
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
											name="start_date"
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
											name="rfqstatus"
											label="Status"
											control={control}
											rules={{ required: true }}
											options={rfqStatus}
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
