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
import { miniSelector } from "@src/store/mini/mini.Slice";
import {
	getMiniCountries,
	getMiniStates,
	getMiniCity,
	getMiniLocation,
	getMiniItemgroups,
} from "@src/store/mini/mini.Action";
import {
	LuBook,
	LuDelete,
	LuPersonStanding,
	LuSave,
	LuUser,
	LuX,
} from "react-icons/lu";
import Customers from ".";
import {
	customersSelector,
	setSelectedData,
	setCountryValue,
	setStateValue,
} from "@src/store/masters/Customers/customer.slice";
import { ConsoleView } from "react-device-detect";
import {
	addCustomers,
	editCustomers,
} from "@src/store/masters/Customers/customer.action";

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

const AddCustomerMasters = ({
	modal,
	closeModal,
	mastersName,
	editId,
	mastersValue,
	vendordata,
}: Props) => {
	const dispatch = useAppDispatch();
	const {
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
		},
		customers: { selectedData, countryValue, stateValue },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			mini: miniSelector(state),
			customers: customersSelector(state),
		};
	});

	const vendorSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter your customer name")
			.trim(),
		concerned_officer_name: yup
			.string()
			.required("Please enter your concerned officer name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"concerned officer name should not contain special characters"
			),
		departmentname: yup
			.string()
			.required("Please enter your department name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"department name should not contain special characters"
			),
		address: yup.string().required("Please enter your address"),
		remarks: yup.string().required("Please enter your remarks"),
		email: yup
			.string()
			.email("Please enter a valid email")
			.required("Please enter your email"),
		mobile: yup
			.string()
			.min(10, "Phone number must be exactly 10 digits")
			.max(10, "Phone number cannot exceed 10 digits")
			.required("Please enter your phone number"),
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
		bank_ifsc: yup
			.string()
			.required("Please enter bank IFSC")
			.trim()
			.min(5, "IFSC number must be at least 5 digits")
			.max(15, "IFSC number must be at most 15 digits")
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"IFSC number should not contain special characters"
			),
		gstno: yup
			.string()
			.required("Please enter gst no")
			.trim()
			.min(5, "gst number must be at least 5 digits")
			.max(15, "gst number must be at most 15 digits")
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"gst number should not contain special characters"
			),
		pan_no: yup
			.string()
			.required("Please enter pan no")
			.trim()
			.min(5, "pan number must be at least 5 digits")
			.max(15, "pan number must be at most 15 digits")
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"gst number should not contain special characters"
			),
		tan_no: yup
			.string()
			.required("Please enter tan no")
			.trim()
			.min(5, "tan number must be at least 5 digits")
			.max(15, "tan number must be at most 15 digits")
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"gst number should not contain special characters"
			),
		bank_acc_no: yup
			.string()
			.required("Please enter bank account no")
			.trim()
			.min(5, "bank account number must be at least 5 digits")
			.max(15, "bank account number must be at most 15 digits")
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"bank account number should not contain special characters"
			),
	});

	useEffect(() => {
		if (modal) {
			// Set form values when modal opens
			reset({
				name: selectedData?.name || "",
				concerned_officer_name: selectedData?.concerned_officer_name || "",
				departmentname: selectedData?.departmentname || "",
				remarks: selectedData?.remarks || "",
				mobile: selectedData?.mobile || "",
				email: selectedData?.email || "",
				address: selectedData?.address || "",
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
				city: selectedData?.city
					? {
						label: selectedData.city.name,
						value: selectedData.city.id,
					}
					: null,
				bank_ifsc: selectedData?.bank_ifsc || "",
				bank_acc_no: selectedData?.bank_acc_no || "",
				gstno: selectedData?.gstno || "",
				pan_no: selectedData?.pan_no || "",
				tan_no: selectedData?.tan_no || "",
			});
		} else {
			reset(); // Clear the form when the modal closes
		}
	}, [modal, selectedData]);

	const { control, handleSubmit, reset, setValue } = useForm<any>({
		resolver: yupResolver(vendorSchema),
		values: {
			name: selectedData?.name ? selectedData?.name : "",
			concerned_officer_name: selectedData?.concerned_officer_name ? selectedData?.concerned_officer_name : "",
			departmentname: selectedData?.departmentname || "",
			remarks: selectedData?.remarks || "",
			mobile: selectedData?.mobile ? selectedData?.mobile : "",
			email: selectedData?.email ? selectedData?.email : "",
			address: selectedData?.address ? selectedData?.address : "",
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
			bank_ifsc: selectedData?.bank_ifsc ? selectedData?.bank_ifsc : "",
			bank_acc_no: selectedData?.bank_acc_no
				? selectedData?.bank_acc_no
				: "",
			gstno: selectedData?.gstno ? selectedData?.gstno : "",
			pan_no: selectedData?.pan_no ? selectedData?.pan_no : "",
			tan_no: selectedData?.tan_no ? selectedData?.tan_no : "",
		},
	});
	const handleAddCustomers = (data: any) => {
		const obj = {
			name: data.name,
			concerned_officer_name:data?.concerned_officer_name,
			departmentname: data?.departmentname,
			remarks: data?.remarks,
			mobile: data.mobile,
			email: data.email,
			address: data.address,
			country_id: data.country?.value,
			state_id: data.state?.value,
			city_id: data.city?.value,
			gstno: data.gstno,
			bank_acc_no: data.bank_acc_no,
			bank_ifsc: data.bank_ifsc,
			pan_no: data.pan_no,
			tan_no: data.tan_no,
		};

		dispatch(addCustomers({ obj }));
		closeModal();
		dispatch(setSelectedData({}));
		reset();
	};

	const handleUpdateCustomers = (updatedata: any) => {
		const obj = {
			id: vendordata?.id,
			name: updatedata.name,
			concerned_officer_name: updatedata?.concerned_officer_name,
			departmentname: updatedata?.departmentname,
			remarks: updatedata?.remarks,
			mobile: updatedata.mobile,
			email: updatedata.email,
			address: updatedata.address,
			country_id: updatedata.country?.value,
			state_id: updatedata.state?.value,
			city_id: updatedata.city?.value,
			gstno: updatedata.gstno,
			bank_acc_no: updatedata.bank_acc_no,
			bank_ifsc: updatedata.bank_ifsc,
			pan_no: updatedata.pan_no,
			tan_no: updatedata.tan_no,
		};
		dispatch(editCustomers({ obj }));
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
					sx={{ px: "25px", pt: "12px !important", pb: 0 }}>
					<DialogContentText
						id="alert-dialog-description"
						sx={
							{
								// width: 500,
							}
						}>
						<form style={{ width: "100%" }}>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12 }}>
									<Typography
										// bgcolor={"grey.200"}
										component={"h5"}
										sx={{
											display: "flex",
											alignItems: "center",
											mt: 1,
											textTransform: "uppercase",
										}}>
										<LuUser
											size={20}
											style={{ marginRight: "6px" }}
										/>

										<Typography
											component={"span"}
											fontSize={"16px"}
											variant="body1">
											Customer Details
										</Typography>
									</Typography>
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<FormInput
										name="name"
										required
										label="Name"
										type="text"
										placeholder="Enter Name here..."
										control={control}
									/>
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<FormInput
										required
										name="concerned_officer_name"
										label="Concerned Officer Name"
										type="text"
										placeholder="Enter Concerned Officer Name here..."
										control={control}
									/>
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<FormInput
										required
										name="departmentname"
										label="Department Name"
										type="text"
										placeholder="Enter Department Name here..."
										control={control}
									/>
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<Controller
										name="mobile"
										control={control}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<InputLabel
													required
													htmlFor="mobile"
													style={{
														fontWeight: "medium",
													}}
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
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<FormInput
										required
										name="email"
										label="Email"
										type="text"
										placeholder="Enter Email here..."
										control={control}
									/>
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<SelectComponent
										required
										name="country"
										label="Country"
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
											dispatch(
												setCountryValue(val?.value)
											);
											setValue("state", null);
											setValue("city", null);
											setValue("address", null);
										}}
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
									/>
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<SelectComponent
										required
										name="state"
										label="State"
										control={control}
										rules={{ required: true }}
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
											page_size:
												miniStatesParams.page_size,
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
									/>
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<SelectComponent
										required
										name="city"
										label="City"
										control={control}
										rules={{ required: true }}
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
											no_of_pages:
												miniCityParams.no_of_pages,
											state__country: countryValue,
											state: stateValue,
										}}
										hasMore={
											miniCityParams.page <
											miniCityParams.no_of_pages
										}
										fetchapi={getMiniCity}
									/>
								</Grid>
								<Grid
									size={{
										xs: 12,
									}}>
									<TextArea
										required
										name="address"
										label="Address"
										type="text"
										placeholder="Write Address here..."
										minRows={3}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
									/>
								</Grid>

								<Grid size={{ xs: 12 }}>
									<Typography
										bgcolor={"grey.200"}
										component={"h5"}
										sx={{
											p: "8px",
											display: "flex",
											alignItems: "center",
											mt: 1,
											textTransform: "uppercase",
										}}>
										<LuBook
											size={20}
											style={{ marginRight: "6px" }}
										/>

										<Typography
											component={"span"}
											fontSize={"16px"}
											variant="body1">
											Bank Details
										</Typography>
									</Typography>
								</Grid>

								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<Controller
										name="bank_acc_no"
										control={control}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<InputLabel
													required
													htmlFor="bank_acc_no"
													style={{
														fontWeight: "medium",
													}}
													error={
														fieldState.error != null
													}>
													Bank Account No
												</InputLabel>
												<OutlinedInput
													id="bank_acc_no"
													{...field}
													type="text"
													placeholder="Enter Bank Account No"
													sx={{
														width: "100%",
														mt: 1,
													}}
													error={
														fieldState.error != null
													}
													inputProps={{
														maxLength: 15,
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
														{
															fieldState.error
																.message
														}
													</FormHelperText>
												)}
											</>
										)}
									/>
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<FormInput
										required
										name="bank_ifsc"
										label="Bank IFSC"
										type="text"
										placeholder="Enter Bant IFSC here..."
										control={control}
									/>
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<FormInput
										required
										name="pan_no"
										label="PAN No"
										type="text"
										placeholder="Enter PAN No here..."
										control={control}
									/>
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<FormInput
										required
										name="tan_no"
										label="Tan No"
										type="text"
										placeholder="Enter Tan No here..."
										control={control}
									/>
								</Grid>
								<Grid
									size={{
										xs: 12,
										md: 4,
									}}>
									<FormInput
										required
										name="gstno"
										label="GST No"
										type="text"
										placeholder="Enter GST No here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12 }}>
									<Typography
										bgcolor={"grey.200"}
										component={"h5"}
										sx={{
											p: "8px",
											display: "flex",
											alignItems: "center",
											mt: 1,
											textTransform: "uppercase",
										}}>
										<LuBook
											size={20}
											style={{ marginRight: "6px" }}
										/>

										<Typography
											component={"span"}
											fontSize={"16px"}
											variant="body1">
											Miscellinous
										</Typography>
									</Typography>
								</Grid>
								<Grid
									size={{
										xs: 12,
									}}>
									<TextArea
										required
										name="remarks"
										label="Remarks"
										type="text"
										placeholder="Write Remarks here..."
										minRows={3}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
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
							onClick={handleSubmit(handleAddCustomers)}
							type="submit"
							color="primary"
							autoFocus>
							Submit
						</Button>
					) : (
						<Button
							variant="contained"
							onClick={handleSubmit(handleUpdateCustomers)}
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
export default AddCustomerMasters;
