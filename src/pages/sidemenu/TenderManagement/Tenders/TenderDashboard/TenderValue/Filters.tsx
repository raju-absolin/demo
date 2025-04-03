import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Divider,
	Drawer,
	FormLabel,
	Stack,
	TextField,
} from "@mui/material";
import { CustomDatepicker } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import {
	selectTenders,
	setPageParams,
} from "@src/store/sidemenu/tender_mangement/tenders/tenders.slice";
import { getTenderValue } from "@src/store/sidemenu/tender_mangement/TenderValue/tender_value.action";
import { useParams } from "react-router-dom";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

type FilterFormData = {
	start_date?: string;
	end_date?: string;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const { id, tab } = useParams();
	const {
		tenders: { pageParams },
	} = useAppSelector((state) => selectTenders(state));

	//Form Submission
	const filterSchema = yup.object({
		start_date: yup.string().optional(),
		end_date: yup.string().optional(),
	});

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(filterSchema),
		values: {
			start_date: pageParams?.start_date
				? moment(pageParams.start_date).format("YYYY-MM-DD")
				: "",
			end_date: pageParams?.end_date
				? moment(pageParams.end_date).format("YYYY-MM-DD")
				: "",
		},
	});

	const clearFilters = () => {
		const formData = {
			start_date: "",
			end_date: "",
		};
		reset();

		dispatch(
			getTenderValue({
				...pageParams,
				...formData,
				tender: id,
			})
		);
	};
	
	const handleFilterSubmit = handleSubmit((values) => {
		const formData: any = {
			start_date: values.start_date
				? moment(values.start_date).format("YYYY-MM-DD")
				: "",
			end_date: values.end_date
				? moment(values.end_date).add(1, "days").format("YYYY-MM-DD")
				: "",
		};

		dispatch(
			getTenderValue({
				...pageParams,
				page: 1,
				page_size: 10,
				search: "",
				...formData,
				tender: id,
			})
		);
	});

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
						<div style={{ marginBottom: "15px" }}>
							Bid Value Filter
						</div>
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
