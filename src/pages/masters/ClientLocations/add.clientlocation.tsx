import react, { ChangeEvent, useEffect, useState } from "react";
import { Button, DialogContentText } from "@mui/material";
import { Control } from "react-hook-form";
import {
	Card,
	TextField,
	InputAdornment,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Grid2 as Grid,
	Paper,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	ListItemText,
	Modal,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	CheckboxInput,
	ComponentContainerCard,
	FormInput,
	PasswordInput,
} from "@src/components";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
	addClientLocation,
	editClientLocation,
} from "@src/store/masters/ClientLocations/cliantlocation.action";
import {
	clientLocationSelector,
	isModelVisible,
	setMasterValue,
} from "@src/store/masters/ClientLocations/cliantlocation.slice";
import { systemSelector } from "@src/store/system/system.slice";
import {
	clearMiniCities,
	clearMiniCountry,
	clearMiniStates,
	miniSelector,
	setCountryValue,
	setStateValue,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniCity,
	getMiniCompany,
	getMiniCountries,
	getMiniItemgroups,
	getMiniStates,
} from "@src/store/mini/mini.Action";
import { LuX } from "react-icons/lu";

const AddClientLocationMasters = () => {
	const dispatch = useAppDispatch();
	const {
		clientLocation: { selectedData, pageParams, model },
		mini: {
			miniStatesList,
			miniCountryParams,
			miniCountriesList,
			miniCountryLoading,
			miniCityList,
			miniItemgroupParams,
			miniStatesParams,
			miniStateLoading,
			miniCityParams,
			miniCityLoading,
			miniItemgroupList,
			miniItemgroupLoading,
			countryValue,
			stateValue,
			miniCompany,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			mini: miniSelector(state),
			clientLocation: clientLocationSelector(state),
		};
	});

	const closeModal = () => {
		dispatch(isModelVisible(false));
	};

	const mastersName = "Client Location";
	const edit_Id = selectedData?.id;

	const clientLocationSchema = yup.object().shape({
		country: yup
			.object()
			.shape({
				label: yup.string().required("Please select country"),
				value: yup.string().required("Please select country"),
			})
			.required("Please select country"),
		state: yup
			.object()
			.shape({
				label: yup.string().required("Please select state"),
				value: yup.string().required("Please select state"),
			})
			.required("Please select state"),
		city: yup
			.object()
			.shape({
				label: yup.string().required("Please select city"),
				value: yup.string().required("Please select city"),
			})
			.required("Please select city"),
		name: yup
			.string()
			.required("Please enter your clientLocation")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"clientLocation name should not contain special characters"
			),
	});
	useEffect(() => {
		if (model) {
			reset({
				name: selectedData?.name || "",
				country: selectedData?.country
					? {
							label: selectedData?.country.name,
							value: selectedData?.country.id,
						}
					: null,
				state: selectedData?.state
					? {
							label: selectedData.state.name,
							value: selectedData.state.id,
						}
					: null,
				city: selectedData?.city
					? {
							label: selectedData.city.name,
							value: selectedData.city.id,
						}
					: null,
			});
		} else {
			reset();
		}
	}, [model, selectedData]);

	const { control, handleSubmit, reset, setValue } = useForm<any>({
		resolver: yupResolver(clientLocationSchema),
		values: {
			name: selectedData?.name ? selectedData?.name : "",
			country: selectedData?.country
				? {
						label: selectedData?.country
							? `${selectedData?.country.name}`
							: "",
						value: selectedData?.country
							? `${selectedData?.country.id}`
							: "",
					}
				: null,
			state: selectedData?.state
				? {
						label: selectedData.state
							? selectedData.state?.name
							: "",
						value: selectedData.state
							? `${selectedData.state.id}`
							: "",
					}
				: null,
			city: selectedData?.city
				? {
						label: selectedData?.city
							? `${selectedData?.city.name}`
							: "",
						value: selectedData?.city
							? `${selectedData?.city.id}`
							: "",
					}
				: null,
		},
	});

	const onSubmit = (data: any) => {
		if (edit_Id == undefined || edit_Id == 0) {
			const obj = {
				name: data.name,
				country_id: data.country?.value,
				state_id: data.state?.value,
				city_id: data.city?.value,
			};
			dispatch(
				addClientLocation({
					obj,
					pageParams,
				})
			);
			closeModal();
			reset();
		} else {
			const obj = {
				id: edit_Id,
				name: data.name,
				country_id: data.country?.value,
				state_id: data.state?.value,
				city_id: data.city?.value,
			};
			dispatch(editClientLocation({ obj, pageParams }));
			closeModal();
			reset();
		}
	};

	return (
		<>
			<Dialog
				open={model}
				onClose={closeModal}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle
					sx={{
						bgcolor: "primary.main",
						color: "white",
						p: 1,
						px: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
					variant="h4"
					id="alert-dialog-title">
					{edit_Id == undefined || edit_Id == 0 ? "Add " : "Update "}
					{mastersName}
					<IconButton onClick={closeModal}>
						<LuX color="white" />
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
					<DialogContentText
						id="alert-dialog-description"
						sx={{
							width: 500,
						}}>
						<form
							style={{ width: "100%" }}
							onSubmit={handleSubmit(onSubmit)}>
							<Grid size={{ xs: 12, md: 4 }} mt={0}>
								<SelectComponent
									name="country"
									label="Country"
									control={control}
									options={miniCountriesList?.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									required
									loading={miniCountryLoading}
									onChange={(val) => {
										dispatch(setCountryValue(val?.value));
										setValue("state", null);
										setValue("city", null);
										setValue("name", "");
									}}
									selectParams={{
										page: miniCountryParams.page,
										page_size: miniCountryParams.page_size,
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
							</Grid>
							<Grid size={{ xs: 12, md: 4 }} mt={2}>
								<SelectComponent
									name="state"
									label="State"
									control={control}
									required
									options={miniStatesList?.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniStateLoading}
									onChange={(val) => {
										dispatch(setStateValue(val?.value));
									}}
									selectParams={{
										page: miniStatesParams.page,
										page_size: miniStatesParams.page_size,
										search: miniStatesParams.search,
										no_of_pages:
											miniStatesParams.no_of_pages,
										country: countryValue,
									}}
									hasMore={
										miniStatesParams.page <
										miniStatesParams.no_of_pages
									}
									fetchapi={getMiniStates}
									clearData={clearMiniStates}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }} mt={2}>
								<SelectComponent
									name="city"
									label="City"
									control={control}
									required
									options={miniCityList?.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniCityLoading}
									selectParams={{
										page: miniCityParams.page,
										page_size: miniCityParams.page_size,
										search: miniCityParams.search,
										no_of_pages: miniCityParams.no_of_pages,
										state__country: countryValue,
										state: stateValue,
									}}
									hasMore={
										miniCityParams.page <
										miniCityParams.no_of_pages
									}
									fetchapi={getMiniCity}
									clearData={clearMiniCities}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }} mt={2}>
								<FormInput
									name="name"
									label="Client Location"
									required
									type="text"
									placeholder="Enter ClientLocation Name here..."
									control={control}
								/>
							</Grid>
							<DialogActions sx={{ p: 2 }}>
								<Button
									onClick={closeModal}
									variant="outlined"
									color="secondary">
									Cancel
								</Button>
								{edit_Id == undefined || edit_Id == "" ? (
									<Button
										variant="contained"
										type="submit"
										color="primary"
										autoFocus>
										Submit
									</Button>
								) : (
									<Button
										variant="contained"
										type="submit"
										color="primary"
										autoFocus>
										Update
									</Button>
								)}
							</DialogActions>
						</form>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};
export default AddClientLocationMasters;
