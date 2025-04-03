import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Grid2 as Grid,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Switch,
	Typography,
	Card,
	OutlinedInput,
	FormControlLabel,
} from "@mui/material";
import { CustomDatepicker, FormInput } from "@src/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import GoBack from "@src/components/GoBack";
import { useOutletContext } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	appSettingsAdd,
	getAppSettings,
} from "@src/store/settings/appSettings/appsettings.action";
import {
	appsettingsSelector,
	SetTLS,
} from "@src/store/settings/appSettings/appsettings.slice";
import { systemSelector } from "@src/store/system/system.slice";
import {
	editGlobalVariables,
	getGlobalVariables,
} from "@src/store/settings/globalVariables/global_variables.action";
import {
	globalVariableSelector,
	updateGlobalVariable,
} from "@src/store/settings/globalVariables/global_variables.slice";
import moment from "moment";

// Example Component
const AppSettings = () => {
	const dispatch = useAppDispatch();
	const {
		appsettings: { appSettingsData },
		globalVariables: { globalVariablesData },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			appsettings: appsettingsSelector(state),
			system: systemSelector(state),
			globalVariables: globalVariableSelector(state),
		};
	});

	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();

	const settingSchema = yup.object().shape({
		SMS__MSG_VAR: yup.string().required("Please enter your message"),
		SMS__NUMBER_VAR: yup
			.string()
			.required("Please enter your number variable"),
		SMS__URL: yup.string().required("Please enter your url"),
		SMTP__BACKEND: yup.string().required("Please enter your backend"),
		SMTP__HOST: yup.string().required("Please enter your host"),
		SMTP__PORT: yup.string().required("Please enter your port"),
		SMTP__USER: yup.string().required("Please enter your username"),
		SMTP__PASSWORD: yup.string().required("Please enter your password"),
		SMTP__USE_TLS: yup.boolean().optional(),
		THIRDPARTY__URL: yup.string().required("Please enter your party url"),
		THIRDPARTY__TOKEN: yup
			.string()
			.required("Please enter your party token"),
	});
	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(settingSchema),
		values: {
			SMS__MSG_VAR: appSettingsData.SMS__MSG_VAR,
			SMS__NUMBER_VAR: appSettingsData.SMS__NUMBER_VAR,
			SMS__URL: appSettingsData.SMS__URL,
			SMTP__BACKEND: appSettingsData.SMTP__BACKEND,
			SMTP__HOST: appSettingsData.SMTP__HOST,
			SMTP__PASSWORD: appSettingsData.SMTP__PASSWORD,
			SMTP__PORT: appSettingsData.SMTP__PORT,
			SMTP__USER: appSettingsData.SMTP__USER,
			SMTP__USE_TLS: appSettingsData.SMTP__USE_TLS
				? appSettingsData?.SMTP__USE_TLS
				: false,
			THIRDPARTY__URL: appSettingsData.THIRDPARTY__URL,
			THIRDPARTY__TOKEN: appSettingsData.THIRDPARTY__TOKEN,
		},
	});

	const globalSchema = yup.object().shape({
		helplinephone: yup
			.string()
			.required("Please enter your help line number"),
		helplineemail: yup
			.string()
			.email("Please enter a valid email")
			.required("Please enter your email"),
		cutofftime: yup.string().required("Please enter your cutofftime"),
		recentorderdeactivatecount: yup
			.string()
			.required("Please enter your recent order deactivate count"),
		maxdeliverydays: yup
			.string()
			.required("Please enter your max delivery days"),
	});
	const { control: globalcontrol, handleSubmit: handleGlobalSubmit } =
		useForm<any>({
			resolver: yupResolver(globalSchema),
			values: {
				cutofftime: globalVariablesData.cutofftime
					? moment(globalVariablesData.cutofftime, "HH:mm")
					: "",
				helplinephone: globalVariablesData.helplinephone
					? globalVariablesData.helplinephone
					: "",
				helplineemail: globalVariablesData.helplineemail
					? globalVariablesData.helplineemail
					: "",
				recentorderdeactivatecount:
					globalVariablesData.recentorderdeactivatecount
						? globalVariablesData.recentorderdeactivatecount
						: "",
				maxdeliverydays: globalVariablesData.maxdeliverydays
					? globalVariablesData.maxdeliverydays
					: "",
			},
		});
	useEffect(() => {
		dispatch(getAppSettings());
		dispatch(getGlobalVariables());
		outletContext?.setTitle("App Settings");
		outletContext?.setSubtitle("Settings");
	}, []);

	const createAppSettings = (data: any) => {
		const obj = {
			...data,
		};
		dispatch(appSettingsAdd(obj));
	};
	const updateGlobalVariables = (data1: any) => {
		const data = {
			helplinephone: data1.helplinephone,
			helplineemail: data1.helplineemail,
			cutofftime: moment(data1.cutofftime).format("HH:mm"),
			recentorderdeactivatecount: data1.recentorderdeactivatecount,
			maxdeliverydays: data1.maxdeliverydays,
		};
		dispatch(
			editGlobalVariables({
				data,
			})
		);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(SetTLS(event.target.checked));
	};

	return (
		<>
			<GoBack
				is_goback={true}
				title="App Settings"
				showSaveButton={false}
				loading={false}>
				<Box
					sx={{
						my: 2,
					}}>
					<Card>
						<Box p={4}>
							<form
								action=""
								onSubmit={handleSubmit(createAppSettings)}>
								{/* SMS Section */}
								<Typography
									variant="h6"
									gutterBottom
									sx={{ mb: 2 }}>
									SMS Configuration
								</Typography>
								<Grid container spacing={3}>
									<Grid
										size={{ xs: 12, md: 4 }}
										sx={{ mb: 2 }}>
										<FormInput
											name="SMS__MSG_VAR"
											label="Message"
											type="text"
											placeholder="Enter Message here..."
											control={control}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 4 }}>
										<FormInput
											name="SMS__NUMBER_VAR"
											label="Number Variables"
											type="text"
											placeholder="Enter Message here..."
											control={control}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 4 }}>
										<FormInput
											name="SMS__URL"
											label="URL"
											type="text"
											placeholder="Enter Message here..."
											control={control}
										/>
									</Grid>
								</Grid>
								{/* </Box>
                    </Card>
                    <Card sx={{ padding: 2, border: 'none', marginTop: '20px' }}>
                        <Box p={4}> */}
								{/* Email Configuration */}
								<Typography
									variant="h6"
									gutterBottom
									sx={{ mb: 2 }}>
									Email Configuration
								</Typography>
								<Grid container spacing={3}>
									<Grid size={{ xs: 12, md: 4 }}>
										<FormInput
											name="SMTP__BACKEND"
											label="Backend"
											type="text"
											placeholder="Enter  here..."
											control={control}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 4 }}>
										<FormInput
											name="SMTP__HOST"
											label="Host"
											type="text"
											placeholder="Enter Host here..."
											control={control}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 4 }}>
										<Controller
											name="SMTP__PORT"
											control={control}
											defaultValue=""
											render={({ field, fieldState }) => (
												<>
													<InputLabel
														htmlFor="SMTP__PORT"
														style={{
															fontWeight:
																"medium",
														}}
														error={
															fieldState.error !=
															null
														}>
														Port
													</InputLabel>
													<OutlinedInput
														id="SMTP__PORT"
														// {...other}
														{...field}
														type="text"
														placeholder="Enter Port here..."
														sx={{
															width: "100%",
															mt: 1,
														}}
														error={
															fieldState.error !=
															null
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
												</>
											)}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 4 }}>
										<FormInput
											name="SMTP__USER"
											label="User"
											type="text"
											placeholder="Enter User Email here..."
											control={control}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 4 }}>
										<FormInput
											name="SMTP__PASSWORD"
											label="Password"
											type="password"
											placeholder="Enter Passsword here..."
											control={control}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 4 }}>
										{/* <FormControlLabel
                                            control={
                                                <Switch checked={appSettingsData?.SMTP__USE_TLS}
                                                onChange={handleChange}
                                                name="SMTP__USE_TLS" />
                                            }
                                            label=" Use TLS"
                                        /> */}
										<FormControlLabel
											style={{ marginTop: "20px" }}
											label={
												<Typography variant="h5">
													Use TLS
												</Typography>
											}
											control={
												<Switch
													checked={
														appSettingsData?.SMTP__USE_TLS
													}
													onChange={(
														event: React.ChangeEvent<HTMLInputElement>
													) => {
														dispatch(
															SetTLS(
																event.target
																	.checked
															)
														);
													}}
													name="SMTP__USE_TLS"
												/>
											}
										/>
									</Grid>
								</Grid>
								{/* <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                                    3rd Party Configuration
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <FormInput
                                            name="THIRDPARTY__URL"
                                            label="3rd Party URL"
                                            type="text"
                                            placeholder="Enter party Url here..."
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <FormInput
                                            name="THIRDPARTY__TOKEN"
                                            label="3rd Party Token"
                                            type="text"
                                            placeholder="Enter party token here..."
                                            control={control}
                                        />
                                    </Grid>
                                </Grid> */}
								<Button
									variant="contained"
									color="primary"
									sx={{ mt: 4 }}
									type="submit">
									Update
								</Button>
							</form>
						</Box>
					</Card>
					{/* <Card sx={{ padding: 2, border: 'none', marginTop: '20px' }}>
                        <Box p={4}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 0 }}>
                                Global Variables
                            </Typography>
                            <form action='' onSubmit={handleGlobalSubmit(updateGlobalVariables)}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name="helplinephone"
                                            control={globalcontrol}
                                            defaultValue=""
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <InputLabel
                                                        htmlFor="helplinephone"
                                                        style={{ fontWeight: "medium" }}
                                                        error={fieldState.error != null}>
                                                        Help Line Number
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        id="helplinephone"
                                                        // {...other}
                                                        {...field}
                                                        type="text"
                                                        placeholder="Enter Help Line Number here..."
                                                        sx={{ width: "100%", mt: 1 }}
                                                        error={fieldState.error != null}
                                                        inputProps={{
                                                            maxLength: 10, style: { padding: "10px 12px" },
                                                            onKeyDown: (e) => {
                                                                // Prevent non-numeric input
                                                                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                                                                    e.preventDefault();
                                                                }
                                                            },
                                                        }}
                                                    />
                                                </>
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <FormInput
                                            name="helplineemail"
                                            label="Email"
                                            type="text"
                                            placeholder="Enter email here..."
                                            control={globalcontrol}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <CustomDatepicker
                                            control={globalcontrol}
                                            name="cutofftime"
                                            hideAddon
                                            dateFormat="hh:mm"
                                            showTimeSelect={true}
                                            timeFormat="h:mm a"
                                            timeCaption="time"
                                            showTimeSelectOnly={true}
                                            minDate={new Date()}
                                            inputClass="form-input"
                                            label={"Cut Off Time"}
                                            tI={1}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <FormInput
                                            name="recentorderdeactivatecount"
                                            label="Recent Order Deactivate Count"
                                            type="number"
                                            placeholder="Enter recent Deactivate Count here..."
                                            control={globalcontrol}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <FormInput
                                            name="maxdeliverydays"
                                            label="Maximum Delivery Days"
                                            type="number"
                                            placeholder="Enter max Delivery Days here..."
                                            control={globalcontrol}
                                        />
                                    </Grid>
                                </Grid>
                                <Button variant="contained" color="primary" sx={{ mt: 4 }} type="submit">
                                    Update
                                </Button>
                            </form>
                        </Box>
                    </Card> */}
				</Box>
			</GoBack>
		</>
	);
};

export default AppSettings;
