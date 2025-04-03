import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Divider, Drawer, Stack, Typography } from "@mui/material";
import { CustomDatepicker } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import { getStates } from "@src/store/masters/State/state.action";
import { stateSelector } from "@src/store/masters/State/state.slice";
import { systemSelector } from "@src/store/system/system.slice";
import { LoadingButton } from "@mui/lab";
import { clearMiniCountry, miniSelector } from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniCountries } from "@src/store/mini/mini.Action";
import { miniType } from "@src/store/mini/mini.Types";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

interface FilterFormData {
	created_on_start?: string;
	created_on_end?: string;
	country?: miniType | null;
}

const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const {
		state: { pageParams, loading },
		mini: { miniCountryParams, miniCountriesList, miniCountryLoading },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			state: stateSelector(state),
			system: systemSelector(state),
			mini: miniSelector(state),
		};
	});

	//Form Submission
	const filterSchema = yup.object({
		created_on_start: yup.string().optional(),
		created_on_end: yup.string().optional(),
		country: yup
			.object({
				label: yup.string().required("Please select country"),
				value: yup.string().required("Please select country"),
			})
			.required("Please select country"),
	});

	const { control, handleSubmit, reset, getValues } = useForm({
		resolver: yupResolver(filterSchema),
		defaultValues: {
			created_on_start: pageParams.created_on_start || "",
			created_on_end: pageParams.created_on_end || "",
			country: (pageParams?.country?.value
				? pageParams.country
				: null) as any,
		},
	});

	const clearFilters = () => {
		const formData = {
			created_on_start: "",
			created_on_end: "",
			country: null,
		};
		dispatch(
			getStates({
				...pageParams,
				...formData,
			})
		);
		reset(formData as any);
	};

	const handleFilterSubmit = ({
		created_on_start,
		created_on_end,
		country,
	}: FilterFormData) => {
		console.log(country);
		const formData = {
			created_on_start: created_on_start
				? moment(created_on_start).format("YYYY-MM-DD")
				: "",
			created_on_end: created_on_end
				? moment(created_on_end).format("YYYY-MM-DD")
				: "",
			country: country?.value ? country : null,
		};

		dispatch(
			getStates({
				...pageParams,
				page: 1,
				page_size: 10,
				search: "",
				...formData,
			})
		);
	};

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
							State Filters
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
											name="created_on_start"
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
											name="created_on_end"
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
								<Stack
									direction="row"
									spacing={2}
									mt={1}
									justifyContent={"space-between"}
									useFlexGap={false}>
									<Stack width={"100%"}>
										<SelectComponent
											name="country"
											label="Country"
											required
											control={control}
											rules={{ required: true }}
											options={miniCountriesList?.map(
												(e: {
													id: string | number;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniCountryLoading}
											selectParams={{
												page: miniCountryParams.page,
												page_size:
													miniCountryParams.page_size,
												search: miniCountryParams.search,
												no_of_pages:
													miniCountryParams.no_of_pages,
											}}
											hasMore={
												miniCountryParams.page <
												miniCountryParams.no_of_pages
											}
											fetchapi={getMiniCountries}
											clearData={clearMiniCountry}
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
									<LoadingButton
										loading={loading}
										variant="contained"
										type="submit"
										onClick={handleSubmit(
											handleFilterSubmit as () => void
										)}>
										Apply
									</LoadingButton>
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
