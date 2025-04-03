import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Divider,
	Drawer,
	Grid2 as Grid,
	Stack,
	Typography,
} from "@mui/material";
import { CustomDatepicker } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import { getProjectGroups } from "@src/store/sidemenu/project_management/ProjectGroups/projectGroups.action";
import SelectComponent from "@src/components/form/SelectComponent";
import { selectGroups } from "@src/store/sidemenu/project_management/ProjectGroups/projectGroups.slice";
import { getMiniUsers, getMiniUserTypes } from "@src/store/mini/mini.Action";
import { clearMiniUsers, clearMiniUserTypes } from "@src/store/mini/mini.Slice";
import { useParams } from "react-router-dom";
import { toDate } from "date-fns";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};
const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const {
		projectGroups: { pageParams },
		system: { userAccessList },
	} = useAppSelector((state) => selectGroups(state));

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
			project: id ? id : "",
			end_date: "",
			start_date: "",
		};
		dispatch(
			getProjectGroups({
				...pageParams,
				...formData,
			})
		);
		reset(formData);
	};

	const handleFilterSubmit = handleSubmit((values) => {
		const formData: any = {
			project: id ? id : "",
			...values,
			end_date: values.end_date
				? moment(values.end_date).add(1, "days").format("YYYY-MM-DD")
				: "",
			start_date: values.start_date
				? moment(values.start_date).format("YYYY-MM-DD")
				: "",
		};
		if (Object.values(values).length > 0) {

			dispatch(
				getProjectGroups({
					...pageParams,
					page: 1,
					page_size: 10,
					search: "",
					...formData,
				})
			);
		}
		handleFilter(false);
	});

	const SCREENTPYE_CHOICES = [
		{
			id: 1,
			name: "Tender",
		},
		{
			id: 2,
			name: "Project",
		},
	];

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
							Project Groups Filters
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
											minDate={moment(
												formData.start_date
											).toDate()}
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
