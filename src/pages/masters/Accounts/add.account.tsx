import react, { ChangeEvent, useEffect, useState } from "react";
import {
	Avatar,
	Button,
	CardContent,
	CardHeader,
	Checkbox,
	Chip,
	Container,
	DialogContentText,
	FormHelperText,
	List,
	ListItem,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextareaAutosize,
	useTheme,
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Control, Controller, useForm } from "react-hook-form";
import {
	CheckboxInput,
	ComponentContainerCard,
	FileType,
	FileUploader,
	FormInput,
	PageBreadcrumb,
	PasswordInput,
} from "@src/components";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import { accountgroupSelector } from "@src/store/masters/AccountGroup/accountgroup.slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	clearMiniBaseUnits,
	clearMiniAccountGroups,
	clearMiniMake,
	miniSelector,
	setCountryValue,
	setStateValue,
	clearMiniCountry,
	clearMiniStates,
	clearMiniCities,
	clearMiniAccountType,
	clearMiniClientLocation,
} from "@src/store/mini/mini.Slice";
import {
	getMiniAccountgroups,
	getMiniMake,
	getMiniMoc,
	getMiniCategory,
	getMiniBaseUnits,
	getMiniCountries,
	getMiniStates,
	getMiniCity,
	getMiniAccountTypes,
	getMiniClientLocations,
} from "@src/store/mini/mini.Action";
import {
	LuBook,
	LuDelete,
	LuFile,
	LuPlus,
	LuSave,
	LuTrash2,
	LuX,
} from "react-icons/lu";
import PageTitle from "@src/components/PageTitle";
import { TreeItem, TreeView } from "@mui/lab";
import { RiAddCircleFill } from "react-icons/ri";
import {
	isModelVisible,
	accountsSelector,
	setUploadImages,
	setSelectedData,
} from "@src/store/masters/Account/accounts.slice";
import { getMakesMini } from "@src/store/masters/Make/make.action";
import {
	addAccounts,
	editAccounts,
	getGroups,
	getAccounts,
	getAccountsById,
} from "@src/store/masters/Account/accounts.action";
import MasterPageTitle from "@src/components/MasterPageTitle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DiscordOutlined } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import TextArea from "@src/components/form/TextArea";

const AddAccount = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [accountImage, setAccountImage] = useState({});
	const { id } = useParams();
	const [open, setOpen] = useState(false);
	const theme = useTheme();
	const [units, setUnitlist] = useState<
		{
			uom_id: any;
			label: string;
			value: string;
			dodelete: boolean;
		}[]
	>([]);

	const [filteredData, setFilteredData] = useState<any[]>([]);
	let filterUnitsData: any[] = [];

	const {
		accounts: { selectedData, masterEditId, image },
		mini: {
			miniAccountgroupParams,
			miniAccountgroupList,
			miniAccountgroupLoading,

			miniCountriesList,
			miniCountryLoading,
			miniCountryParams,

			miniStateLoading,
			miniStatesList,
			miniStatesParams,

			miniCityList,
			miniCityLoading,
			miniCityParams,
			miniAccountTypes,

			miniClientLocationList,
			miniClientLocationLoading,
			miniClientLocationParams,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			accountgroup: accountgroupSelector(state),
			mini: miniSelector(state),
			accounts: accountsSelector(state),
		};
	});
	const TYPE_CHOICES = [
		{ name: "Material", id: 1 },
		{ name: "Service", id: 2 },
	];

	useEffect(() => {
		if (id != undefined) {
			dispatch(getAccountsById({ id: id }));
		}
		dispatch(setSelectedData({}));
		dispatch(
			getGroups({
				search: "",
				page: 1,
				page_size: 10,
			})
		);
	}, []);

	const accountSchema = yup.object().shape({
		name: yup.string().required("Please enter your account name").trim(),
		mobile: yup
			.string()
			.matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
			.required("Mobile number is required")
			.trim(),
		email: yup.string().email().required("Please enter your email").trim(),
		address: yup.string().required("Please enter your address").trim(),
		pincode: yup.string().required("Please enter your pincode").trim(),
		pan_no: yup
			.string()
			.matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format")
			.required("Please enter your PAN number")
			.trim(),
		gst_no: yup
			.string()
			.matches(
				/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
				"Invalid GST format"
			)
			.required("Please enter your GST number")
			.trim(),
		remarks: yup.string().required("Please enter description").trim(),
		parent: yup
			.object()
			.shape({
				label: yup.string().required("Please select group"),
				value: yup.string().required("Please select group"),
			})
			.required("Please select group"),

		account_type: yup
			.object()
			.shape({
				label: yup.string().required("Please select account type"),
				value: yup.string().required("Please select account type"),
			})
			.required("Please select account type"),
		country: yup
			.object()
			.shape({
				label: yup.string().required("Please select country"),
				value: yup.number().required("Please select country"),
			})
			.required("Please select country"),
		state: yup
			.object()
			.shape({
				label: yup.string().required("Please select state"),
				value: yup.number().required("Please select state"),
			})
			.required("Please select state"),
		city: yup
			.object()
			.shape({
				label: yup.string().required("Please select city"),
				value: yup.number().required("Please select city"),
			})
			.required("Please select city"),
		client_location_ids: yup
			.array()
			.of(
				yup.object().shape({
					label: yup.string().when("account_type", {
						is: (account_type: any) => account_type?.value === 5,
						then: (schema) =>
							schema.required("Please select client location"),
						otherwise: (schema) => schema,
					}),
					value: yup.mixed().when("account_type", {
						is: (account_type: any) => account_type?.value === 5,
						then: (schema) =>
							schema
								.test(
									"isValid",
									"Please select client location",
									(value) =>
										typeof value === "string" ||
										typeof value === "number"
								)
								.required("Please select client location"),
						otherwise: (schema) => schema,
					}),
				})
			)
			.when("account_type", {
				is: (account_type: any) => account_type?.value === 5,
				then: (schema) =>
					schema.required("Please select client location"),
				otherwise: (schema) => schema.notRequired(),
			}),
	});

	const { control, handleSubmit, reset, getValues } = useForm<any>({
		resolver: yupResolver(accountSchema),
		mode: "onChange", // Validates onChange
		values: {
			name: selectedData?.name ? selectedData?.name : "",
			mobile: selectedData?.mobile ? selectedData?.mobile : "",
			email: selectedData?.email ? selectedData?.email : "",
			address: selectedData?.address ? selectedData?.address : "",
			pincode: selectedData?.pincode ? selectedData?.pincode : "",
			pan_no: selectedData?.pan_no ? selectedData?.pan_no : "",
			gst_no: selectedData?.gst_no ? selectedData?.gst_no : "",
			remarks: selectedData?.remarks ? selectedData?.remarks : "",
			parent: selectedData?.parent
				? {
						label: selectedData?.parent
							? `${selectedData?.parent.name}`
							: "",
						value: selectedData?.parent
							? `${selectedData?.parent.id}`
							: "",
					}
				: null,
			account_type: selectedData?.account_type?.id
				? {
						label: selectedData?.account_type?.name
							? `${selectedData?.account_type?.name}`
							: "",
						value: selectedData?.account_type?.id
							? `${selectedData?.account_type?.id}`
							: "",
					}
				: null,
			country: selectedData?.country?.id
				? {
						label: selectedData?.country?.name
							? `${selectedData?.country?.name}`
							: "",
						value: selectedData?.country?.id
							? `${selectedData?.country?.id}`
							: "",
					}
				: null,
			state: selectedData?.state?.id
				? {
						label: selectedData?.state?.name
							? `${selectedData?.state?.name}`
							: "",
						value: selectedData?.state?.id
							? `${selectedData?.state?.id}`
							: "",
					}
				: null,
			city: selectedData?.city?.id
				? {
						label: selectedData?.city?.name
							? `${selectedData?.city?.name}`
							: "",
						value: selectedData?.city?.id
							? `${selectedData?.city?.id}`
							: "",
					}
				: null,
			client_location_ids: selectedData?.client_locations?.map((e) => {
				return {
					label: e.name,
					value: e.id,
				};
			}),
		},
	});
	const baseUnitValue = getValues("baseunit");
	const unitValue = getValues("units");
	const formData = getValues();

	console.log("baseUnitValue", baseUnitValue);
	console.log("unitValue", unitValue);
	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

		/**
		 * Formats the size
		 */
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
		const modifiedFiles = files.map((file) => {
			const isImage = URL.createObjectURL(file);

			return Object.assign({}, file, {
				originalObj: file, // Store the original file object
				preview: isImage ? URL.createObjectURL(file) : null, // Generate preview if image
				formattedSize: formatBytes(file.size), // Format file size
			});
		});
		// Make sure to check if there are any files before dispatching
		if (modifiedFiles.length > 0) {
			const formData = new FormData();
			modifiedFiles.forEach((file) => {
				formData.append("file", file.originalObj); // Append each file (original File object)
			});

			dispatch(setUploadImages(modifiedFiles[0]));
			setAccountImage(formData);
		}
	};

	const handleSubmitAccount = (data: any) => {
		const image =
			typeof data.image == typeof "" || !data.image
				? null
				: data.image[0];
		const obj = {
			id: id || "",
			name: data.name,
			remarks: data.remarks,
			mobile: data.mobile,
			email: data.email,
			address: data.address,
			pincode: data.pincode,
			pan_no: data.pan_no,
			gst_no: data.gst_no,
			account_type: data.account_type?.value,
			country_id: data.country?.value,
			state_id: data.state?.value,
			city_id: data.city?.value,
			parent_id: data.parent?.value,
			type: 2,
			client_location_ids: data?.client_location_ids?.map(
				(e: any) => e.value
			),
		};
		if (id != undefined && id != "0" && id != "undefined") {
			dispatch(
				editAccounts({
					id: id ? id : "",
					obj,
					image: image,
					clearData: () => {
						navigate("/pages/masters/accounts");
						dispatch(setUploadImages({}));
						reset();
					},
				})
			);
		} else {
			dispatch(
				addAccounts({
					obj,
					image: image,
					clearData: () => {
						navigate("/pages/masters/accounts");
						dispatch(setUploadImages({}));
						reset();
					},
				})
			);
		}
	};
	const HorizontalFilePreview = ({ file }: { file: any }) => {
		function handleDismiss() {
			dispatch(setUploadImages({}));
		}
		return (
			<Box
				id={file.name}
				sx={{
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "6px",
					p: "12px",
					display: "flex",
				}}>
				<Box
					sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
					{file.preview ? (
						<Avatar
							variant="rounded"
							sx={{
								height: "48px",
								width: "48px",
								bgcolor: "white",
								objectFit: "cover",
							}}
							alt={file.path}
							src={file.preview}
						/>
					) : (
						<Typography
							component={"span"}
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "primary.main",
								fontWeight: 600,
								borderRadius: "6px",
								height: "48px",
								width: "48px",
								bgcolor: "#3e60d51a",
							}}>
							<LuFile />
						</Typography>
					)}
					<Box>
						<Typography sx={{ fontWeight: 600, color: "grey.700" }}>
							{file.path}
						</Typography>
						<Typography component={"p"} color={"grey.700"}>
							{file.formattedSize}
						</Typography>
					</Box>
				</Box>
				<IconButton sx={{ marginLeft: "auto", my: "auto" }}>
					<LuX size={18} onClick={() => handleDismiss()} />
				</IconButton>
			</Box>
		);
	};
	console.log("units", units);
	const unitSchema = yup.object().shape({
		name: yup.object().shape({
			label: yup.string().required("Please select unit"),
			value: yup.string().required("Please select unit"),
		}),
		unitvalue: yup
			.string()
			.required("Please enter your unit value")
			.trim()
			.matches(
				/^[0-9 ]*$/,
				"unit value should not contain alphabets & special characters"
			),
	});
	const {
		control: unitcontrol,
		handleSubmit: handleUnitSubmit,
		reset: unitReset,
	} = useForm<any>({
		resolver: yupResolver(unitSchema),
	});

	const onUnitSubmit = (unitData: any) => {
		const unitObj = {
			uom_id: unitData.name?.value,
			label: unitData.name ? unitData.name?.label : "",
			value: unitData.unitvalue ? unitData.unitvalue : 1,
			dodelete: false,
		};
		setUnitlist((prevList) => {
			const newAddunitlist = [...prevList, unitObj];
			const newUnitlist = [...newAddunitlist];
			return newUnitlist;
		});
		setOpen(false);
	};

	const deleteBaseUnit = (unit: any) => {
		const deleteUnitlist = units?.filter(
			(val) => unit?.uom_id != val?.uom_id
		);
		setUnitlist(deleteUnitlist);
	};

	return (
		<Box sx={{ padding: 2 }}>
			<MasterPageTitle
				prefix={"Masters"}
				postfix={"account"}
				pageTitle="Accounts"
				goBack={true}
				modalVisible={true}
				pageText={""}
				navigationToAdd={"/pages/masters/account"}>
				<Card sx={{ marginTop: "20px" }}>
					<CardContent>
						<form
							action=""
							onSubmit={handleSubmit(
								handleSubmitAccount,
								(errors) => {
									console.log(errors);
								}
							)}>
							<Grid container spacing={4}>
								{/* <Grid item xs={3}>
                            <Card>
                                <CardHeader
                                    title="GROUPS"
                                    className="bg-transparent border-bottom"
                                />
                                <CardContent>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => openModal(true)}
                                        startIcon={<RiAddCircleFill size={22} />}
                                    >
                                        Group
                                    </Button>
                                    <List>
                                        {itemgroupList.map((item, index) => (
                                            <ListItem button onClick={() => onItemClick(item)} key={index}
                                                className="cursor-pointer">
                                                <ListItemText primary={item.name} />
                                            </ListItem>
                                        ))}
                                    </List>

                                </CardContent>
                            </Card>
                        </Grid> */}
								<Grid size={{ xs: 12 }}>
									<Grid container spacing={2}>
										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<FormInput
												name="name"
												label="Account Name"
												required
												type="text"
												placeholder="Enter Account Name here..."
												control={control}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<FormInput
												name="mobile"
												label="Mobile Number"
												required
												type="number"
												placeholder="Enter Mobile Number here..."
												control={control}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<FormInput
												name="email"
												label="Email"
												required
												type="email"
												placeholder="Enter Email here..."
												control={control}
											/>
										</Grid>

										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<FormInput
												name="address"
												label="Address"
												required
												type="text"
												placeholder="Enter Address here..."
												control={control}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<FormInput
												name="pincode"
												label="Pincode"
												required
												type="number"
												placeholder="Enter Pincode here..."
												control={control}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<FormInput
												name="pan_no"
												label="Pan Number"
												required
												type="text"
												placeholder="Enter Pan Number here..."
												control={control}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<FormInput
												name="gst_no"
												label="GST Number"
												required
												type="text"
												placeholder="Enter GST Number here..."
												control={control}
											/>
										</Grid>

										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<SelectComponent
												name="account_type"
												label="Account Type"
												required
												control={control}
												options={miniAccountTypes?.list?.map(
													(e: {
														choice: number;
														name: string;
													}) => ({
														id: e.choice,
														name: e.name,
													})
												)}
												loading={
													miniAccountTypes?.loading
												}
												selectParams={{
													page: miniAccountTypes
														?.miniParams?.page,
													page_size:
														miniAccountTypes
															?.miniParams
															?.page_size,
													search: miniAccountTypes
														?.miniParams?.search,
													no_of_pages:
														miniAccountTypes
															?.miniParams
															?.no_of_pages,
												}}
												fetchapi={getMiniAccountTypes}
												clearData={clearMiniAccountType}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<SelectComponent
												name="country"
												label="Country"
												required
												control={control}
												options={miniCountriesList?.map(
													(e: {
														id: number;
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
												fetchapi={getMiniCountries}
												clearData={clearMiniCountry}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<SelectComponent
												name="state"
												label="State"
												required
												disabled={
													!formData?.country?.value
												}
												control={control}
												options={miniStatesList?.map(
													(e: {
														id: number;
														name: string;
													}) => ({
														id: e.id,
														name: e.name,
													})
												)}
												loading={miniStateLoading}
												selectParams={{
													page: miniStatesParams.page,
													page_size:
														miniStatesParams.page_size,
													search: miniStatesParams.search,
													no_of_pages:
														miniStatesParams.no_of_pages,
													country:
														formData?.country
															?.value,
												}}
												fetchapi={getMiniStates}
												clearData={clearMiniStates}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<SelectComponent
												name="city"
												label="City"
												required
												control={control}
												disabled={
													!formData?.country?.value &&
													!formData?.state?.value
												}
												options={miniCityList?.map(
													(e: {
														id: number;
														name: string;
													}) => ({
														id: e.id,
														name: e.name,
													})
												)}
												loading={miniCityLoading}
												selectParams={{
													page: miniCityParams.page,
													page_size:
														miniCityParams.page_size,
													search: miniCityParams.search,
													no_of_pages:
														miniCityParams.no_of_pages,
													country:
														formData?.country
															?.value,
													state: formData?.state
														?.value,
												}}
												fetchapi={getMiniCity}
												clearData={clearMiniCities}
											/>
										</Grid>
										{formData.account_type?.value == 5 && (
											<Grid
												size={{ xs: 12, sm: 6, md: 3 }}>
												<SelectComponent
													name="client_location_ids"
													label="Client Locations"
													multiple
													required
													disabled={
														!formData?.country
															?.value &&
														!formData?.state
															?.value &&
														!formData?.city?.value
													}
													control={control}
													options={miniClientLocationList?.map(
														(e: {
															id: number | string;
															name: string;
														}) => ({
															id: e.id,
															name: e.name,
														})
													)}
													loading={
														miniClientLocationLoading
													}
													selectParams={{
														page: miniClientLocationParams?.page,
														page_size:
															miniClientLocationParams?.page_size,
														search: miniClientLocationParams?.search,
														no_of_pages:
															miniClientLocationParams?.no_of_pages,
														country:
															formData?.country
																?.value,
														state: formData?.state
															?.value,
														city: formData?.city
															?.value,
													}}
													fetchapi={
														getMiniClientLocations
													}
													clearData={
														clearMiniClientLocation
													}
												/>
											</Grid>
										)}

										<Grid size={{ xs: 12, sm: 6, md: 3 }}>
											<SelectComponent
												name="parent"
												label="Account Group"
												required
												control={control}
												options={miniAccountgroupList?.map(
													(e: {
														id: number;
														name: string;
													}) => ({
														id: e.id,
														name: e.name,
													})
												)}
												hasMore={
													miniAccountgroupParams.page <
													miniAccountgroupParams.no_of_pages
												}
												loading={
													miniAccountgroupLoading
												}
												selectParams={{
													page: miniAccountgroupParams.page,
													page_size:
														miniAccountgroupParams.page_size,
													search: miniAccountgroupParams.search,
													no_of_pages:
														miniAccountgroupParams.no_of_pages,
												}}
												fetchapi={getMiniAccountgroups}
												clearData={
													clearMiniAccountGroups
												}
											/>
										</Grid>
									</Grid>
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
							</Grid>
							<Box
								sx={{
									display: "flex",
									mt: 3,
									gap: 2,
								}}
								justifyContent="center"
								alignItems="center">
								<Button
									variant="contained"
									color="primary"
									type="submit"
									style={{ width: "15%" }}>
									{id != "undefined" && id != "0"
										? "Update"
										: "Submit"}
								</Button>
							</Box>
						</form>
					</CardContent>
				</Card>
			</MasterPageTitle>
		</Box>
	);
};
export default AddAccount;
