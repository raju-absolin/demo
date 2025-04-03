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
import { addCity, editCity } from "@src/store/masters/City/city.action";
import {
	citySelector,
	setMasterValue,
} from "@src/store/masters/City/city.slice";
import { systemSelector } from "@src/store/system/system.slice";
import {
	clearMiniCountry,
	clearMiniStates,
	miniSelector,
	setStateValue,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniCity,
	getMiniCountries,
	getMiniStates,
} from "@src/store/mini/mini.Action";
import { LuX } from "react-icons/lu";

type Props = {
	modal: boolean;
	closeModal: () => void;
	mastersName: string;
	edit_Id?: any;
	mastersValue?: string;
};

const AddCityMasters = ({
	modal,
	closeModal,
	mastersName,
	edit_Id,
	mastersValue,
}: Props) => {
	const dispatch = useAppDispatch();
	const {
		city: { selectedData },
		mini: {
			miniStatesList,
			miniCountryParams,
			miniCountriesList,
			miniCountryLoading,
			miniStatesParams,
			miniStateLoading,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			mini: miniSelector(state),
			city: citySelector(state),
		};
	});

	const citySchema = yup.object().shape({
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
		name: yup
			.string()
			.required("Please enter your city")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"city name should not contain special characters"
			),
	});

	useEffect(() => {
		if (modal) {
			reset({
				name: selectedData?.name || "",
				country: selectedData?.country
					? {
							label: selectedData.country.name,
							value: selectedData.country.id,
						}
					: null,
				state: selectedData?.state
					? {
							label: selectedData.state.name,
							value: selectedData.state.id,
						}
					: null,
			});
		} else {
			reset();
		}
	}, [modal, selectedData]);

	const { control, handleSubmit, reset, getValues } = useForm<any>({
		resolver: yupResolver(citySchema),
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
						label: selectedData?.state
							? `${selectedData?.state.name}`
							: "",
						value: selectedData?.state
							? `${selectedData?.state.id}`
							: "",
					}
				: null,
		},
	});

	const onSubmit = (data: any) => {
		if (edit_Id == undefined || edit_Id == "") {
			const obj = {
				name: data.name,
				country_id: data.country?.value,
				state_id: data.state?.value,
			};
			const payload = {
				obj,
				pageParams: {},
				clearDataFn: () => {
					closeModal();
					reset();
				},
				navigate: (path: string) => {},
			};
			dispatch(addCity(payload));
		} else {
			const obj = {
				id: edit_Id,
				name: data.name,
				country_id: data.country?.value,
				state_id: data.state?.value,
			};
			const payload = {
				obj,
				pageParams: {},
				clearDataFn: () => {
					closeModal();
					reset();
				},
				navigate: (path: string) => {},
			};
			dispatch(editCity(payload));
		}
	};
	const formData = getValues();

	return (
		<>
			<Dialog
				open={modal}
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
									required
									control={control}
									rules={{ required: true }}
									options={miniCountriesList}
									loading={miniCountryLoading}
									onChange={(val) => {
										dispatch(setStateValue(val));
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
							<Grid size={{ xs: 12, md: 4 }} mt={0}>
								<SelectComponent
									name="state"
									label="State"
									required
									control={control}
									rules={{ required: true }}
									options={miniStatesList}
									loading={miniStateLoading}
									onChange={(val) => {
										dispatch(setStateValue(val));
									}}
									selectParams={{
										page: miniStatesParams.page,
										page_size: miniStatesParams.page_size,
										search: miniStatesParams.search,
										no_of_pages:
											miniStatesParams.no_of_pages,
										country: formData?.country?.value,
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
								<FormInput
									sx={{ mt: 4 }}
									name="name"
									label="Name"
									required
									type="text"
									placeholder="Enter City here..."
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
export default AddCityMasters;
