import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Divider,
	Drawer,
	FormLabel,
	Stack,
	Typography,
} from "@mui/material";
import { CustomDatepicker } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	bidingItemSelector,
	setPageParams,
} from "@src/store/sidemenu/tender_mangement/bidingitems/biding_items.slice";
import moment from "moment";
import { getItems } from "@src/store/sidemenu/tender_mangement/bidingitems/biding_items.action";
import { BidingItemsState } from "@src/store/sidemenu/tender_mangement/bidingitems/biding_items.types";

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
	const {
		bidingItems: { pageParams },
	} = useAppSelector((state) => ({
		bidingItems: bidingItemSelector(state),
	}));
	//Form Submission
	const filterSchema = yup.object({
		start_date: yup.string().optional(),
		end_date: yup.string().optional(),
	});

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(filterSchema),
		values: {
			start_date: pageParams.start_date,
			end_date: pageParams.end_date,
		},
	});

	const handleChangeInput = (data: {}) => {
		dispatch(
			setPageParams({
				...pageParams,
				...data,
			})
		);
	};

	const clearFilters = () => {
		const formData = {
			start_date: "",
			end_date: "",
		};
		dispatch(
			getItems({
				...pageParams,
				...formData,
			})
		);
		handleFilter(false);
		reset();
	};

	const handleFilterSubmit = ({ start_date, end_date }: FilterFormData) => {
		const formData = {
			start_date: moment(start_date).format("YYYY-MM-DD"),
			end_date: moment(end_date).add(1, "days").format("YYYY-MM-DD"),
		};

		dispatch(
			getItems({
				...pageParams,
				page: 1,
				page_size: 10,
				search: "",
				...formData,
			})
		);
		handleFilter(false);
	};

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
							Bid Item Filters
						</Typography>
						<Divider
							sx={{
								mb: 1,
							}}
						/>
						<form>
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
									<Button
										variant="contained"
										type="submit"
										onClick={handleSubmit(
											handleFilterSubmit as () => void
										)}>
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
