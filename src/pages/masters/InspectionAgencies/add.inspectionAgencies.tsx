import react, { ChangeEvent, useEffect, useState } from "react";
import {
	Button,
	Checkbox,
	Chip,
	DialogContentText,
	OutlinedInput,
	TextareaAutosize,
} from "@mui/material";
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
import { Control, Controller, useForm } from "react-hook-form";
import {
	CheckboxInput,
	ComponentContainerCard,
	FormInput,
	PasswordInput,
} from "@src/components";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { addLocation } from "@src/store/masters/Locations/location.action";
import { countrySelector } from "@src/store/masters/Country/country.slice";
import { setMasterValue } from "@src/store/masters/Locations/location.slice";
import { systemSelector } from "@src/store/system/system.slice";
import TextArea from "@src/components/form/TextArea";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	clearMiniLocation,
	miniSelector,
	setCountryValue,
	setStateValue,
} from "@src/store/mini/mini.Slice";
import {
	getMiniCountries,
	getMiniStates,
	getMiniCity,
	getMiniLocation,
	getMiniItemgroups,
} from "@src/store/mini/mini.Action";
import { LuBook, LuDelete, LuSave, LuX } from "react-icons/lu";
import InspectionAgencies from ".";
import {
	inspectionAgenciesSelector,
	setSelectedData,
	useInspectionAgencySelector,
} from "@src/store/masters/InspectionAgencies/inspection_agencies.slice";
import { ConsoleView } from "react-device-detect";
import {
	addInspectionAgencies,
	editInspectionAgencies,
} from "@src/store/masters/InspectionAgencies/inspection_agencies.action";

type Props = {
	modal: boolean;
	closeModal: () => void;
	mastersName: string;
	editId?: number;
	mastersValue: string;
	vendordata?: {
		id?: string | number | undefined;
		name?: string;
		mobile?: string;
		email?: string;
		address?: string;
		country_id?: string | number;
		state_id?: string | number;
		city_id?: string | number;
		gstno?: string;
		bank_acc_no?: string;
		bank_ifsc?: string;
		pan_no?: string;
		tan_no?: string;
	};
};

const AddInspectionAgenciesMasters = ({
	modal,
	closeModal,
	mastersName,
	editId,
	mastersValue,
	vendordata,
}: Props) => {
	const dispatch = useAppDispatch();
	const {
		mini: { miniLocationList, miniLocationLoading, miniLocationParams },
		inspectionAgencies: { selectedData },
		system: { userAccessList },
	} = useInspectionAgencySelector();

	const vendorSchema = yup.object().shape({
		concerned_officer: yup
			.string()
			.required("Please enter your inspectionAgencies name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"concerned officer name should not contain special characters"
			),
		concerned_officer_email: yup
			.string()
			.email("Please enter a valid email")
			.required("Please enter your email"),
		concerned_officer_mobile: yup
			.string()
			.min(10, "Phone number must be exactly 10 digits")
			.max(10, "Phone number cannot exceed 10 digits")
			.required("Please enter your phone number"),
		location: yup
			.object({
				label: yup.string().required("location is required"),
				value: yup.string().required("location is required"),
			})
			.required("Please select location"),
	});

	useEffect(() => {
		if (modal) {
			reset({
				concerned_officer: selectedData?.concerned_officer || "",
				concerned_officer_mobile:
					selectedData?.concerned_officer_mobile || "",
				concerned_officer_email:
					selectedData?.concerned_officer_email || "",
				location: selectedData?.location
					? {
							label: selectedData?.location.name,
							value: selectedData?.location.id,
						}
					: null,
			});
		} else {
			reset();
		}
	}, [modal, selectedData]);

	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(vendorSchema),
		values: {
			concerned_officer: selectedData?.concerned_officer || "",
			concerned_officer_mobile:
				selectedData?.concerned_officer_mobile || "",
			concerned_officer_email:
				selectedData?.concerned_officer_email || "",
			location: selectedData?.location
				? {
						label: selectedData?.location.name,
						value: selectedData?.location.id,
					}
				: null,
		},
	});
	const handleAddInspectionAgencies = (data: any) => {
		const obj = {
			concerned_officer: data?.concerned_officer || "",
			concerned_officer_mobile: data?.concerned_officer_mobile || "",
			concerned_officer_email: data?.concerned_officer_email || "",
			location_id: data?.location?.value,
		};
		dispatch(addInspectionAgencies({ obj }));
		closeModal();
		dispatch(setSelectedData({}));
		reset();
	};

	const handleUpdateInspectionAgencies = (updatedata: any) => {
		const obj = {
			id: vendordata?.id,
			concerned_officer: updatedata?.concerned_officer || "",
			concerned_officer_mobile:
				updatedata?.concerned_officer_mobile || "",
			concerned_officer_email: updatedata?.concerned_officer_email || "",
			location_id: updatedata?.location?.value,
		};
		dispatch(editInspectionAgencies({ obj }));
		closeModal();
		dispatch(setSelectedData({}));
	};
	return (
		<>
			<Dialog
				open={modal}
				onClose={closeModal}
				maxWidth="lg"
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
					{editId == undefined || editId == 0 ? "Add " : "Update "}
					{mastersName}
					<IconButton onClick={closeModal}>
						<LuX color="white" />
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{ px: "30px", pt: "12px !important", pb: 0 }}>
					<DialogContentText
						id="alert-dialog-description"
						sx={
							{
								// width: 500,
							}
						}>
						<form style={{ width: "100%" }}>
							<Grid container spacing={3}>
								<Grid size={{ xs: 12, md: 6 }}>
									<FormInput
										name="concerned_officer"
										label="Name"
										required
										type="text"
										placeholder="Enter InspectionAgencies here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<Controller
										name="concerned_officer_mobile"
										control={control}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<InputLabel
													htmlFor="mobile"
													style={{
														fontWeight: "medium",
													}}
													required
													error={
														fieldState.error != null
													}>
													Mobile
												</InputLabel>
												<OutlinedInput
													id="mobile"
													// {...other}
													{...field}
													type="text"
													placeholder="Enter Mobile Number here..."
													sx={{
														width: "100%",
														mt: 1,
													}}
													error={
														fieldState.error != null
													}
													inputProps={{
														maxLength: 10,
														style: {
															padding:
																"10px 12px",
														},
														onKeyDown: (e) => {
															// Prevent non-numeric input
															if (
																!/[0-9]/.test(
																	e.key
																) &&
																e.key !==
																	"Backspace"
															) {
																e.preventDefault();
															}
														},
													}}
												/>
												{fieldState.error?.message && (
													<FormHelperText
														error={
															fieldState.error !=
															null
														}>
														Please enter mobile
														number
													</FormHelperText>
												)}
											</>
										)}
									/>
									{/* <FormInput
                                        name="mobile"
                                        label="Mobile"
                                        type="text"
                                        placeholder="Enter Mobile Number here..."
                                        control={control}
                                        inputProps={{
                                            maxLength: 10,
                                            onKeyDown: (e) => {
                                                // Prevent non-numeric input
                                                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                                                    e.preventDefault();
                                                }
                                            },
                                        }}
                                    /> */}
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<FormInput
										name="concerned_officer_email"
										label="Email"
										required
										type="text"
										placeholder="Enter Email here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<SelectComponent
										name="location"
										label="Location"
										control={control}
										required
										options={miniLocationList?.map(
											(e: {
												id: string | number;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										loading={miniLocationLoading}
										selectParams={{
											page: miniLocationParams.page,
											page_size:
												miniLocationParams.page_size,
											search: miniLocationParams.search,
											no_of_pages:
												miniLocationParams.no_of_pages,
										}}
										hasMore={
											miniLocationParams.page <
											miniLocationParams.no_of_pages
										}
										fetchapi={getMiniLocation}
										clearData={clearMiniLocation}
									/>
								</Grid>
							</Grid>
						</form>
					</DialogContentText>
				</DialogContent>
				<DialogActions sx={{ p: 2 }}>
					<Button
						onClick={closeModal}
						variant="outlined"
						color="secondary">
						Cancel
					</Button>
					{editId == undefined || editId == 0 ? (
						<Button
							variant="contained"
							onClick={handleSubmit(handleAddInspectionAgencies)}
							type="submit"
							color="primary"
							autoFocus>
							Submit
						</Button>
					) : (
						<Button
							variant="contained"
							onClick={handleSubmit(
								handleUpdateInspectionAgencies
							)}
							type="submit"
							color="primary"
							autoFocus>
							Update
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</>
	);
};
export default AddInspectionAgenciesMasters;
