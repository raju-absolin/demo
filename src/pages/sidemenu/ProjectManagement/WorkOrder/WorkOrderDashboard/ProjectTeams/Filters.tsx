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
import { getProjectTeams } from "@src/store/sidemenu/project_management/project_teams/project_teams.action";
import SelectComponent from "@src/components/form/SelectComponent";
import { selectTeams } from "@src/store/sidemenu/project_management/project_teams/project_teams.slice";
import { getMiniUsers, getMiniUserTypes } from "@src/store/mini/mini.Action";
import { clearMiniUsers, clearMiniUserTypes } from "@src/store/mini/mini.Slice";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};
const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const {
		teams: { pageParams },
		workOrder: { selectedData: projectData },
		mini: { miniUserTypes, miniUserList, miniUserLoading, miniUserParams },
		system: { userAccessList },
	} = useAppSelector((state) => selectTeams(state));

	//Form Submission
	const filterSchema = yup.object({
		end_date: yup.string().optional(),
		start_date: yup.string().optional(),
		user: yup.object().optional().nullable(),
		user_type: yup.object().optional().nullable(),
		screen_type: yup.object().optional().nullable(),
	});

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
	});

	const clearFilters = () => {
		const formData = {
			transaction_id: projectData?.id,
			end_date: "",
			start_date: "",
			user: null,
			user_type: null,
			screen_type: null,
		};
		dispatch(
			getProjectTeams({
				...pageParams,
				...formData,
			})
		);
		reset(formData);
	};

	const handleFilterSubmit = handleSubmit((values: any) => {
		const formData: any = {
			transaction_id: projectData?.id,
			...values,
			end_date: values.end_date
				? moment(values.end_date).add(1, "days").format("YYYY-MM-DD")
				: "",
			start_date: values.start_date
				? moment(values.start_date).format("YYYY-MM-DD")
				: "",
			user_type: values.user_type?.id,
			screen_type: values.screen_type?.id
		};
		if (Object.values(values).length > 0) {
			dispatch(
				getProjectTeams({
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
			user: pageParams.user,
			user_type: pageParams.user_type,
			screen_type: pageParams.screen_type,
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
							Team Filters
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
											name="user_type"
											label="User Type"
											multiple={false}
											control={control}
											rules={{ required: true }}
											options={miniUserTypes?.list?.map(
												(e: {
													id: string | number;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniUserTypes?.loading}
											selectParams={{
												page: miniUserTypes?.miniParams
													?.page,
												page_size:
													miniUserTypes?.miniParams
														?.page_size,
												search: miniUserTypes
													?.miniParams?.search,
												no_of_pages:
													miniUserTypes?.miniParams
														?.no_of_pages,
											}}
											hasMore={
												miniUserTypes?.miniParams
													?.page <
												miniUserTypes?.miniParams
													?.no_of_pages
											}
											fetchapi={getMiniUserTypes}
											clearData={clearMiniUserTypes}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="user"
											label="User"
											multiple={false}
											control={control}
											rules={{ required: true }}
											options={miniUserList.map(
												(e: {
													id: string | number;
													fullname: string;
												}) => ({
													id: e.id,
													name: e.fullname,
												})
											)}
											loading={miniUserLoading}
											selectParams={{
												page: miniUserParams.page,
												page_size:
													miniUserParams.page_size,
												search: miniUserParams.search,
												no_of_pages:
													miniUserParams.no_of_pages,
											}}
											hasMore={
												miniUserParams.page <
												miniUserParams.no_of_pages
											}
											fetchapi={getMiniUsers}
											clearData={clearMiniUsers}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }}>
										<SelectComponent
											name="screen_type"
											label="Screen Type"
											multiple={false}
											control={control}
											rules={{ required: true }}
											options={SCREENTPYE_CHOICES}
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
											handleFilter(false)
											clearFilters();
										}}>
										Clear
									</Button>
									<Button
										variant="contained"
										type="submit">
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
