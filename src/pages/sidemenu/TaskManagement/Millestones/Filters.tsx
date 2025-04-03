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
import { useMileStoneActions } from "@src/store/sidemenu/task_management/milestones/milestones.action";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniLocation,
	getMiniMileStones,
	getMiniProjectGroups,
	getMiniWarehouse,
} from "@src/store/mini/mini.Action";
import {
	clearMiniLocation,
	clearMiniMilestones,
	clearMiniProjectGroups,
	clearMiniWarehouse,
} from "@src/store/mini/mini.Slice";
import { miniType } from "@src/store/mini/mini.Types";
import { selectMileStones } from "@src/store/sidemenu/task_management/milestones/milestones.slice";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const {
		mileStones: { pageParams },
	} = useAppSelector((state) => selectMileStones(state));

	const {
		reducer: { setPageParams },
		extraReducer: { getMileStones },
	} = useMileStoneActions();

	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
	});

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			end_date: "",
			start_date: "",
		};

		getMileStones({
			...pageParams,
			...formData,
		});

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

		getMileStones({
			...pageParams,
			page: 1,
			page_size: 10,
			...formData,
		});
		handleFilter(false);
	});

	useEffect(() => {
		reset({
			end_date: pageParams.end_date,
			start_date: pageParams.start_date,
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
							Mile Stones Filters
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
