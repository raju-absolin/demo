import react, { ChangeEvent, useEffect, useState } from "react";
import {
	Button,
	Checkbox,
	Chip,
	DialogContentText,
	FormHelperText,
	InputLabel,
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
import { systemSelector } from "@src/store/system/system.slice";
import { itemgroupSelector } from "@src/store/masters/ItemGroup/itemgroup.slice";
import TextArea from "@src/components/form/TextArea";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	clearMiniItemGroups,
	clearMiniStates,
	miniSelector,
} from "@src/store/mini/mini.Slice";
import {
	getMiniCountries,
	getMiniStates,
	getMiniCity,
	getMiniLocation,
	getMiniItemgroups,
} from "@src/store/mini/mini.Action";
import {
	vendorsSelector,
	setSelectedData,
	setCountryValue,
	setStateValue,
} from "@src/store/masters/Vendors/vendors.slice";
import {
	addVendors,
	editVendors,
} from "@src/store/masters/Vendors/vendors.action";
import { LuX } from "react-icons/lu";

type Props = {
	modal: boolean;
	closeModal: () => void;
	mastersName: string;
	editId?: any;
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
		item_group_ids?: [];
		item_groups?: { label: string; value: string | number }[] | null;
		gstno?: string;
		bank_acc_no?: string;
		bank_ifsc?: string;
		pan_no?: string;
		tan_no?: string;
	};
};

const AddVendorMasters = ({
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
		vendors: { selectedData, countryValue, stateValue },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			itemgroup: itemgroupSelector(state),
			mini: miniSelector(state),
			vendors: vendorsSelector(state),
		};
	});
	const vendorSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter your vendor name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"vendor name should not contain special characters"
			),
		address: yup.string().required("Please enter your address"),
		email: yup
			.string()
			.email("Please enter a valid email")
			.required("Please enter your email"),
		mobile: yup
			.string()
			.min(10, "Phone number must be exactly 10 digits")
			.max(10, "Phone number cannot exceed 10 digits")
			.required("Please enter your phone number"),
		item_groups: yup
			.array()
			.of(
				yup.object().shape({
					label: yup
						.string()
						.required("Each itemgroup must have a label"),
					value: yup
						.string()
						.required("Each itemgroup must have a value"),
				})
			)
			.min(1, "Select at least one itemgroup")
			.required("Please select a itemgroup"),
		country: yup.object().shape({
			label: yup.string().required("Please select country"),
			value: yup.string().required("Please select country"),
		}).required("Please select country"),
		state: yup.object({
			label: yup.string().required("Please select state"),
			value: yup.string().required("Please select state"),
		}).required("Please select state"),
		city: yup.object().shape({
			label: yup.string().required("Please select city"),
			value: yup.string().required("Please select city"),
		}).required("Please select city"),
		bank_ifsc: yup
			.string()
			.required("Please enter bank IFSC")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"IFSC should not contain special characters"
			),
		gstno: yup
			.string()
			.required("Please enter gst no")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"gst number should not contain special characters"
			),
		pan_no: yup
			.string()
			.required("Please enter pan no")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"gst number should not contain special characters"
			),
		tan_no: yup
			.string()
			.required("Please enter tan no")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"gst number should not contain special characters"
			),
		bank_acc_no: yup.string().required("Please enter bank account no"),
	});

	useEffect(() => {
		if (modal) {
			// Set form values when modal opens
			reset({
				name: selectedData?.name || "",
				mobile: selectedData?.mobile || "",
				email: selectedData?.email || "",
				address: selectedData?.address || "",
				item_groups:
					selectedData?.item_groups?.map((item) => ({
						label: item.label || "",
						value: item.value || "",
					})) || [],
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

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		//formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(vendorSchema),
		values: {
			name: selectedData?.name ? selectedData?.name : "",
			mobile: selectedData?.mobile ? selectedData?.mobile : "",
			email: selectedData?.email ? selectedData?.email : "",
			address: selectedData?.address ? selectedData?.address : "",
			item_groups: selectedData?.item_groups
				? selectedData.item_groups?.map(
					(item: { label: any; value: any }) => ({
						label: item.label || "",
						value: item.value || "",
					})
				)
				: [],
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
					label: `${selectedData?.city?.name}`,
					value: `${selectedData?.city?.id}`,
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

	const handleAddVendors = (data: any) => {
		const obj = {
			name: data.name,
			mobile: data.mobile,
			email: data.email,
			address: data.address,
			country_id: data.country?.value,
			state_id: data.state?.value,
			city_id: data.city?.value,
			item_group_ids: data.item_groups?.map(
				(item: { value: string; label: string }) => item.value
			),
			gstno: data.gstno,
			bank_acc_no: data.bank_acc_no,
			bank_ifsc: data.bank_ifsc,
			pan_no: data.pan_no,
			tan_no: data.tan_no,
		};

		dispatch(addVendors({ obj }));
		closeModal();
		dispatch(setSelectedData({}));
	};

	const handleUpdateVendors = (updatedata: any) => {
		const obj = {
			id: vendordata?.id,
			name: updatedata.name,
			mobile: updatedata.mobile,
			email: updatedata.email,
			address: updatedata.address,
			country_id: updatedata.country?.value,
			state_id: updatedata.state?.value,
			city_id: updatedata.city?.value,
			item_group_ids: updatedata.item_groups
				? updatedata.item_groups?.map(
					(item: { value: string; label: string }) => item.value
				)
				: vendordata?.item_groups?.map((item) => item.value),
			gstno: updatedata.gstno,
			bank_acc_no: updatedata.bank_acc_no,
			bank_ifsc: updatedata.bank_ifsc,
			pan_no: updatedata.pan_no,
			tan_no: updatedata.tan_no,
		};
		dispatch(editVendors({ obj }));
		closeModal();
		dispatch(setSelectedData({}));
	};

	return (
		<>
			<Dialog
				open={modal}
				onClose={closeModal}
				maxWidth="lg"
				// sx={{
				//     display: 'flex',
				//     flexDirection: 'column',
				//     height: '90vh', // Set the overall dialog height
				//   }}
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
								<Grid size={{ xs: 12, md: 4 }}>
									<FormInput
										name="name"
										label="Name"
										required
										type="text"
										placeholder="Enter Vendor here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Controller
										name="mobile"
										control={control}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<InputLabel
													htmlFor="mobile"
													required
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
								<Grid size={{ xs: 12, md: 4 }}>
									<FormInput
										name="email"
										label="Email"
										required
										type="text"
										placeholder="Enter Email here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<SelectComponent
										name="item_groups"
										label="Item Group"
										control={control}
										required
										multiple={true}
										options={miniItemgroupList?.map(
											(e: {
												id: string | number;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										loading={miniItemgroupLoading}
										selectParams={{
											page: miniItemgroupParams.page,
											page_size:
												miniItemgroupParams.page_size,
											search: miniItemgroupParams.search,
											no_of_pages:
												miniItemgroupParams.no_of_pages,
										}}
										hasMore={
											miniItemgroupParams.page <
											miniItemgroupParams.no_of_pages
										}
										fetchapi={getMiniItemgroups}
										clearData={clearMiniItemGroups}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<SelectComponent
										name="country"
										label="Country"
										control={control}
										required
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
											dispatch(setCountryValue(val?.value));
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
								<Grid size={{ xs: 12, md: 4 }}>
									<SelectComponent
										name="state"
										label="State"
										control={control}
										required
										options={miniStatesList}
										loading={miniStateLoading}
										onChange={(val) => {
											dispatch(setStateValue(val.value));
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
										clearData={clearMiniStates}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
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
								<Grid size={{ xs: 12, md: 4 }}>
									<TextArea
										name="address"
										label="Address"
										type="text"
										required
										placeholder="Write Address here..."
										minRows={1}
										containerSx={{
											display: "grid",
											gap: 1,
											// height: "150px",
											// overflow: "auto"
										}}
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Controller
										name="bank_acc_no"
										control={control}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<InputLabel
													htmlFor="bank_acc_no"
													style={{
														fontWeight: "medium",
													}}
													required
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
														Please enter bank
														account number
													</FormHelperText>
												)}
											</>
										)}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<FormInput
										name="bank_ifsc"
										label="Bank IFSC"
										type="text"
										required
										placeholder="Enter Bant IFSC here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<FormInput
										name="pan_no"
										label="PAN No"
										type="text"
										required
										placeholder="Enter PAN No here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<FormInput
										name="tan_no"
										label="Tan No"
										type="text"
										required
										placeholder="Enter Tan No here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<FormInput
										name="gstno"
										label="GST No"
										type="text"
										required
										placeholder="Enter GST No here..."
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
							onClick={handleSubmit(handleAddVendors)}
							type="submit"
							color="primary"
							autoFocus>
							Submit
						</Button>
					) : (
						<Button
							variant="contained"
							onClick={handleSubmit(handleUpdateVendors)}
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
export default AddVendorMasters;
