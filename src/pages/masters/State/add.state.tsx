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
import { addStates, editStates } from "@src/store/masters/State/state.action";
import {
	stateSelector,
	setMasterValue,
} from "@src/store/masters/State/state.slice";
import { systemSelector } from "@src/store/system/system.slice";
import {
	miniSelector,
	setCountryValue,
	setStateValue,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniCity,
	getMiniCountries,
	getMiniStates,
} from "@src/store/mini/mini.Action";
import { setSelectedData } from "@src/store/settings/manageUsers/manage_users.slice";
import { LuX } from "react-icons/lu";

type Props = {
	modal: boolean;
	closeModal: () => void;
	mastersName: string;
	edit_Id?: any;
	mastersValue?: string;
};

const AddStateMasters = ({
	modal,
	closeModal,
	mastersName,
	edit_Id,
	mastersValue,
}: Props) => {
	const dispatch = useAppDispatch();
	const {
		state: { selectedData, pageParams },
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
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			mini: miniSelector(state),
			state: stateSelector(state),
		};
	});

	const stateSchema = yup.object().shape({
		country: yup.object({
			label: yup.string().required("Please select country"),
			value: yup.string().required("Please select country"),
		}).required("Please select country"),
		name: yup
			.string()
			.required("Please enter your state")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"state name should not contain special characters"
			),
	});

	useEffect(() => {
		if (modal) {
			reset({
				name: selectedData?.name || "",
				country: selectedData?.country
					? {
							label: selectedData?.country.name,
							value: selectedData?.country.id,
						}
					: null,
			});
		} else {
			reset();
		}
	}, [modal, selectedData]);
	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(stateSchema),
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
		},
	});

	const onSubmit = (data: any) => {
		if (edit_Id == undefined || edit_Id == 0) {
			const obj = {
				name: data.name,
				country_id: data.country?.value,
			};
			const payload = {
				obj,
				pageParams: pageParams,
				clearDataFn: () => {},
				navigate: (path: string) => {},
			};
			dispatch(addStates(payload));
			closeModal();
			dispatch(setSelectedData({}));
			reset();
		} else {
			const obj = {
				id: edit_Id,
				name: data.name,
				country_id: data.country?.value,
			};
			const payload = {
				obj,
				pageParams: {},
				clearDataFn: () => {},
				navigate: (path: string) => {},
			};
			dispatch(editStates(payload));
			closeModal();
			dispatch(setSelectedData({}));
			reset();
		}
	};

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
								onChange={(val) => {
									dispatch(setCountryValue(val));
								}}
								selectParams={{
									page: miniCountryParams.page,
									page_size: miniCountryParams.page_size,
									search: miniCountryParams.search,
									no_of_pages: miniCountryParams.no_of_pages,
								}}
								hasMore={
									miniCountryParams.page <
									miniCountryParams.no_of_pages
								}
								fetchapi={getMiniCountries}
							/>
							<Grid size={{ xs: 12, md: 4 }} mt={2}>
								<FormInput
									name="name"
									label="Name"
									required
									type="text"
									placeholder="Enter State here..."
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
								{edit_Id == undefined || edit_Id == 0 ? (
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
export default AddStateMasters;
