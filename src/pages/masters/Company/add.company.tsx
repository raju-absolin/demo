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
import Company from ".";
import {
	companySelector,
	setSelectedData,
	setCompanyLogo,
} from "@src/store/masters/Company/company.slice";
import { ConsoleView } from "react-device-detect";
import {
	addCompany,
	editCompany,
} from "@src/store/masters/Company/company.action";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type Props = {
	modal: boolean;
	closeModal: () => void;
	mastersName: string;
	editId?: number;
	mastersValue: string;
	companyData?: {
		id?: string;
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

const AddCompanyMasters = ({
	modal,
	closeModal,
	mastersName,
	editId,
	mastersValue,
	companyData,
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
			countryValue,
			stateValue,
		},
		companys: { selectedData, companylogo },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			mini: miniSelector(state),
			companys: companySelector(state),
		};
	});

	const vendorSchema = yup.object().shape<any>({
		name: yup
			.string()
			.required("Please enter your company name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"company name should not contain special characters"
			),
		remarks: yup.string().required("Please enter your remarks").trim(),
		// address: yup.string().required("Please enter your address").trim(),
		// pincode: yup
		// 	.string()
		// 	.required("Please enter your pincode")
		// 	.matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
		// gstno: yup
		// 	.string()
		// 	.required("Please enter your GST number")
		// 	.trim()
		// 	.matches(
		// 		/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3}$/,
		// 		"Invalid GST number format"
		// 	),
		// email: yup
		// 	.string()
		// 	.email("Please enter a valid email")
		// 	.required("Please enter your email"),
		// mobile: yup
		// 	.string()
		// 	.min(10, "Phone number must be exactly 10 digits")
		// 	.max(10, "Phone number cannot exceed 10 digits")
		// 	.required("Please enter your phone number"),
	});
	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(vendorSchema),
		values: {
			name: selectedData?.name ? selectedData?.name : "",
			remarks: selectedData?.remarks ? selectedData?.remarks : "",
			// mobile: selectedData?.mobile ? selectedData?.mobile : "",
			// email: selectedData?.email ? selectedData?.email : "",
			// address: selectedData?.address ? selectedData?.address : "",
			// gstno: selectedData?.gstno ? selectedData?.gstno : "",
			// pincode: selectedData?.pincode ? selectedData?.pincode : "",
			// companylogo: selectedData?.logo ? selectedData?.logo : null,
		},
	});
	useEffect(() => {
		if (modal) {
			dispatch(setCompanyLogo({}));
			reset({
				name: selectedData?.name || "",
				remarks: selectedData?.remarks || "",
				// mobile: selectedData?.mobile || "",
				// email: selectedData?.email || "",
				// address: selectedData?.address || "",
				// gstno: selectedData?.gstno || "",
				// pincode: selectedData?.pincode || "",
			});
		} else {
			reset();
		}
	}, [modal, selectedData]);

	const handleAddCompany = (data: any) => {
		const formData = new FormData();
		if (companylogo?.originalObj instanceof File) {
			formData.append("logo", companylogo.originalObj);
		}
		formData.append("name", data.name);
		formData.append("remarks", data.remarks);
		// formData.append("mobile", data.mobile);
		// formData.append("email", data.email);
		// formData.append("address", data.address);
		// formData.append("pincode", data.pincode);
		// formData.append("gstno", data.gstno);
		dispatch(addCompany({ formData }));
		closeModal();
		dispatch(setSelectedData({}));
		reset();
	};

	const handleUpdateCompany = (updatedata: any) => {
		const formData = new FormData();
		if (companylogo?.originalObj instanceof File) {
			formData.append("logo", companylogo.originalObj);
		}
		// formData.append("id", companyData?.id);
		formData.append("name", updatedata.name);
		formData.append("remarks", updatedata.remarks);
		// formData.append("mobile", updatedata.mobile);
		// formData.append("email", updatedata.email);
		// formData.append("address", updatedata.address);
		// formData.append("pincode", updatedata.pincode);
		// formData.append("gstno", updatedata.gstno);
		dispatch(editCompany({ id: companyData?.id, formData }));
		closeModal();
		dispatch(setSelectedData({}));
	};
	const [logoSrc, setLogoSrc] = useState<string | null>(null);

	const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const logo = event.target.files;
		const formatBytes = (bytes: number, decimals: number = 2) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = [
				"Bytes",
				"KB",
				"MB",
				"GB",
				"TB",
				"PB",
				"EB",
				"ZB",
				"YB",
			];

			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return (
				parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
				" " +
				sizes[i]
			);
		};
		const filesArray = logo ? Array.from(logo) : [];

		const modifiedFiles = filesArray.map((file) =>
			Object.assign({}, file, {
				originalObj: file,
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);
		const documents = modifiedFiles[0];
		dispatch(setCompanyLogo(documents));
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
								<Grid size={{ xs: 12 }}>
									<FormInput
										name="name"
										label="Name"
										required
										type="text"
										placeholder="Enter Company here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12 }}>
									<TextArea
										name="remarks"
										required
										label="Description"
										type="text"
										placeholder="Write Description here..."
										minRows={4}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
									/>
								</Grid>
								{/* <Grid size={{ xs: 12, md: 4 }}>
									<Controller
										name="mobile"
										control={control}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<InputLabel
													htmlFor="mobile"
													style={{
														fontWeight: "medium",
													}}
													error={
														fieldState.error != null
													}>
													Mobile{" "}
													<span
														style={{
															color: "red",
														}}>
														*
													</span>
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
									<TextArea
										name="address"
										required
										label="Address"
										type="text"
										placeholder="Write Address here..."
										minRows={1}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Controller
										name="pincode"
										control={control}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<InputLabel
													htmlFor="pincode"
													style={{
														fontWeight: "medium",
													}}
													required
													error={
														fieldState.error != null
													}>
													Pincode
												</InputLabel>
												<OutlinedInput
													id="pincode"
													// {...other}
													{...field}
													type="text"
													placeholder="Enter Pincode here..."
													sx={{
														width: "100%",
														mt: 1,
													}}
													error={
														fieldState.error != null
													}
													required
													inputProps={{
														maxLength: 6,
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
														Please enter pincode
													</FormHelperText>
												)}
											</>
										)}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<FormInput
										name="gstno"
										required
										label="Gstno"
										type="text"
										placeholder="Enter GST here..."
										control={control}
									/>
								</Grid>
								<Grid
									size={{ xs: 12 }}
									style={{
										marginBottom: "20px",
										position: "relative",
									}}>
									<input
										accept="image/*"
										type="file"
										id="companylogo"
										style={{ display: "none" }}
										onChange={handleLogoUpload}
									/>
									<label
										htmlFor="companylogo"
										style={{
											cursor: "pointer",
											position: "relative",
											display: "inline-block",
										}}>
										<CloudUploadIcon
											style={{
												fontSize: 80,
												border: "1px solid #aaa",
												padding: "0px 10px 0px 10px",
												marginRight: "25px",
											}}
										/>
									</label>
									{selectedData?.logo != null &&
										editId != undefined && (
											<img
												src={selectedData?.logo}
												alt=""
												style={{
													maxWidth: "150px",
													maxHeight: "150px",
													objectFit: "contain",
												}}
											/>
										)}
									{companylogo?.preview && editId == 0 && (
										<img
											src={companylogo?.preview}
											alt=""
											style={{
												maxWidth: "150px",
												maxHeight: "150px",
												objectFit: "contain",
											}}
										/>
									)}
									<p
										style={{
											fontSize: "14px",
										}}>
										Upload Logo
									</p>
								</Grid> */}
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
							onClick={handleSubmit(handleAddCompany)}
							type="submit"
							color="primary"
							autoFocus>
							Submit
						</Button>
					) : (
						<Button
							variant="contained"
							onClick={handleSubmit(handleUpdateCompany)}
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
export default AddCompanyMasters;
