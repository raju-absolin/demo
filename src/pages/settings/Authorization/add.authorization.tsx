import react, { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
	Button,
	DialogContentText,
	Divider,
	FormControlLabel,
	FormHelperText,
	Grid2 as Grid,
	InputLabel,
	List,
	OutlinedInput,
	Stack,
	styled,
	Switch,
	Typography,
	useTheme,
} from "@mui/material";
import {
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput, ScrollableList } from "@src/components";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@src/store/store";
import {
	setFormRows,
	setSelectedData,
	setSelectedFormData,
	SetSwitchAuthorization,
	useAuthorizationSelector,
} from "@src/store/settings/Authorization/authorization.slice";
import {
	postAuthorizationData,
	editAuthorizationDataById,
	postScreenAuthorizationData,
	editScreenAuthorizationDataById,
	deleteScreenAuthorization,
	getScreenAuthorizations,
	getAuthorizationById,
} from "@src/store/settings/Authorization/authorization.action";
import { LuMinusCircle, LuPlusCircle, LuX } from "react-icons/lu";
import { LoadingButton } from "@mui/lab";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	clearMiniAllContentTypes,
	clearMiniUsers,
	clearMiniUserTypes,
} from "@src/store/mini/mini.Slice";
import {
	getMiniUserTypes,
	getAllContentTypes,
	getMiniUsers,
} from "@src/store/mini/mini.Action";
import { ScreenAuthorization } from "@src/store/settings/Authorization/authorization.types";
import { v4 as uuidV4 } from "uuid";
import { getProfileList } from "@src/store/settings/manageGroups/manage_groups.action";
import { clearProfileData } from "@src/store/settings/manageGroups/manage_groups.slice";
import { addParams } from "@src/helpers/Helper";
import Swal from "sweetalert2";
import { debounce } from "@src/helpers";

type Props = {
	modal: boolean;
	setModalOpen: (value: boolean) => void;
};

const AddAuthorization = ({ modal, setModalOpen }: Props) => {
	const dispatch = useAppDispatch();

	const {
		authorization: {
			loading,
			selectedData,
			finalauthorization,
			pageParams,
			model,
			formRows,
			formRowsLoading,
			formRowsParams,
			selectedFormData,
		},
		mini: {
			miniUserList,
			miniUserLoading,
			miniUserParams,

			miniAllContentTypes,
		},
		manageGroups: { profileList, loading: profilesloading, profileParams },
		system: { userAccessList },
	} = useAuthorizationSelector();

	const TYPE_CHOICES = [
		{ name: "User", id: 1 },
		{ name: "Group", id: 2 },
	];

	const authorizationSchema = yup.object().shape({
		screen: yup.object().shape({
			label: yup.string().required("Please select screen"),
			value: yup.string().required("Please select screen"),
		}),
		levelno: yup.string().trim().required("Please enter your level number"),
		// finalauthorization: yup.boolean().optional(),
	});
	const authorizationSchemaMutiple = yup.object().shape({
		rows: yup.array().of(
			yup.object().shape({
				type: yup
					.object()
					.shape({
						label: yup.string().required("Please select type"),
						value: yup.string().required("Please select type"),
					})
					.typeError("Please select type")
					.required("Please select type"),
				user_or_group: yup
					.object()
					.shape({
						label: yup.string().required("This field is required"),
						value: yup.string().required("This field is required"),
					})
					.typeError("This field is required")
					.required("This field is required"),
				level: yup.string().required("This field is required"),
				finalauthorization: yup.boolean().optional(),
			})
		),
	});

	const { control, handleSubmit, reset, getValues, setValue } = useForm<any>({
		resolver: yupResolver(authorizationSchema),
		values: {
			screen: selectedData?.screen
				? {
						label: selectedData?.screen?.label,
						value: selectedData?.screen?.value,
					}
				: null,
			levelno: selectedData?.levelno || "",
		},
	});
	const {
		control: control2,
		handleSubmit: handleSubmit2,
		reset: reset2,
		getValues: getValues2,
		setValue: setValue2,
	} = useForm<any>({
		resolver: yupResolver(authorizationSchemaMutiple),
		values: {
			rows: formRows.map((e: ScreenAuthorization) => ({
				type: e?.type
					? {
							label: e?.type?.label,
							value: e?.type?.value,
						}
					: null,
				user_or_group: e?.user_or_group
					? {
							label: e?.user_or_group?.label,
							value: e?.user_or_group?.value,
						}
					: null,
				level: e?.level || "",
			})),
		},
	});

	console.log(getValues2());

	const createRow = () => {
		dispatch(
			setFormRows([
				{
					temp_id: uuidV4(),
					type: null,
					user_or_group: null,
				},
				...formRows,
			])
		);
	};
	const deleteRow = (row: ScreenAuthorization) => {
		dispatch(
			deleteScreenAuthorization({
				id: row?.id || "",
				pageParams: {
					...formRowsParams,
					screen: selectedData?.screen?.value || "",
				},
			})
		);
	};

	const hide = () => {
		reset({
			screen: null,
			levelno: "",
			// type: null,
			// user_or_group: null,
			// finalauthorization: false,
		});
		reset({
			rows: formRows.map((e: ScreenAuthorization) => ({
				type: null,
				user_or_group: null,
			})),
		});
		dispatch(
			setFormRows([
				{
					id: "",
					type: null,
					user_or_group: null,
				},
			])
		);
		dispatch(setSelectedData({}));
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(SetSwitchAuthorization(event.target.checked));
	};

	const onScreenAuthSubmit = () => {
		const hasitem = formRows?.find(
			(e) =>
				e?.type?.value == selectedFormData?.type?.value &&
				e?.user_or_group?.value ==
					selectedFormData?.user_or_group?.value &&
				e?.level == selectedFormData?.level
		);
		if (hasitem) {
			return Swal.fire({
				title: `<p style="font-size:20px">${selectedFormData?.user_or_group?.label} ${selectedFormData?.type?.value == 1 ? "user" : "group"} already exists</p>`,
				icon: "error",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		} else {
			const auth_payload = {
				id: selectedFormData.id ? selectedFormData.id : "",
				type: selectedFormData.type?.value || 0,
				user_id: (selectedFormData?.type?.value == 1
					? selectedFormData?.user_or_group?.value
					: "") as string,
				group_id: (selectedFormData?.type?.value == 2
					? selectedFormData?.user_or_group?.value
					: "") as number,
				screen_id: (selectedData?.screen?.id || 0) as number,
				level: (selectedFormData?.level || 0) as number,
			};
			const obj = addParams(auth_payload);

			if (!selectedFormData?.id) {
				dispatch(
					postScreenAuthorizationData({
						obj: obj,
						hide: () => {
							createRow();
							dispatch(setSelectedFormData({}));
						},
						pageParams: {
							...formRowsParams,
							screen: selectedData?.screen?.value || "",
						},
					})
				);
			} else {
				dispatch(
					editScreenAuthorizationDataById({
						obj: obj,
						hide: () => {
							dispatch(setSelectedFormData({}));
						},
						pageParams: {
							...formRowsParams,
							screen: selectedData?.screen?.value || "",
						},
					})
				);
			}
		}
	};
	const onSubmit = (data: any) => {
		const definition_payload = {
			id: selectedData?.id ? selectedData?.id : "",
			screen_id: data?.screen?.value,
			level: data?.levelno,
		};

		const obj = addParams(definition_payload);

		if (!selectedData?.id) {
			dispatch(
				postAuthorizationData({
					obj: obj,
					hide: () => {
						if (
							selectedFormData?.type?.value &&
							selectedFormData?.user_or_group?.value
						) {
							onScreenAuthSubmit();
						}
						hide();
					},
					pageParams: pageParams,
				})
			);
		} else {
			dispatch(
				editAuthorizationDataById({
					obj: obj,
					hide: () => {
						if (
							selectedFormData?.type?.value &&
							selectedFormData?.user_or_group?.value
						) {
							onScreenAuthSubmit();
						}
						hide();
					},
					pageParams: pageParams,
				})
			);
		}
	};

	const theme = useTheme();

	// useEffect(() => {
	// 	if (selectedData?.id && selectedData?.screen?.value) {
	// 		dispatch(
	// 			getAuthorizationById({
	// 				id: selectedData?.id || "",
	// 			})
	// 		);
	// 		dispatch(
	// 			getScreenAuthorizations({
	// 				...formRowsParams,
	// 				screen: selectedData?.screen?.value || null,
	// 			})
	// 		);
	// 	}
	// }, [selectedData]);

	const debouncedSearch = useCallback(
		debounce((obj: any) => {
			// handleSearch({ search: value });
			dispatch(
				editScreenAuthorizationDataById({
					obj: obj,
					hide: () => {},
					pageParams: formRowsParams,
				})
			);
		}, 300),
		[editScreenAuthorizationDataById]
	);
	return (
		<>
			<Dialog
				open={modal}
				onClose={() => {
					hide();
					setModalOpen(false);
				}}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				maxWidth="md">
				<DialogTitle
					sx={{
						// bgcolor: "primary.main",
						// color: "white",
						p: 1,
						px: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
					variant="h4"
					id="alert-dialog-title">
					{!selectedData?.id ? "Add " : "Update "}
					Authorization
					<IconButton
						onClick={() => {
							hide();
							setModalOpen(false);
						}}>
						<LuX color="" />
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
					<DialogContentText>
						<form
							style={{ width: "100%" }}
							onSubmit={handleSubmit(onSubmit)}>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, sm: 5.5 }}>
									<SelectComponent
										required
										name="screen"
										label="Screen"
										placeholder="Select a screen"
										control={control}
										options={miniAllContentTypes.list?.map(
											(e: {
												contenttype: {
													id: number;
												};
												id: number;
												name: string;
											}) => ({
												id: e?.contenttype?.id,
												name: e.name,
											})
										)}
										onChange={(value) => {
											console.log(value);
											dispatch(
												setSelectedData({
													...selectedData,
													screen: value,
												})
											);
											// 		dispatch(
											// getScreenAuthorizations({
											// 	...formRowsParams,
											// 	page: 1,
											// 	page_size: 10,
											// 	screen: row?.screen?.value || null,
											// 	// level: row?.level || "",
											// })
											// );
										}}
										loading={miniAllContentTypes.loading}
										selectParams={{
											page: miniAllContentTypes.miniParams
												.page,
											page_size:
												miniAllContentTypes.miniParams
													.page_size,
											search: miniAllContentTypes
												.miniParams.search,
											no_of_pages:
												miniAllContentTypes.miniParams
													.no_of_pages,
										}}
										hasMore={
											miniAllContentTypes.miniParams
												.page <
											miniAllContentTypes.miniParams
												.no_of_pages
										}
										fetchapi={getAllContentTypes}
										clearData={clearMiniAllContentTypes}
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 5.5 }}>
									<FormInput
										required
										name="levelno"
										label="Final Level No"
										type="number"
										placeholder="Enter Level Number here"
										control={control}
										onChange={(e) => {
											dispatch(
												setSelectedData({
													...selectedData,
													levelno: e.target.value,
												})
											);
										}}
									/>
								</Grid>
								<Grid size={{ xs: 12 }}>
									<Divider />
								</Grid>
								<Grid size={{ xs: 12 }}>
									<ScrollableList
										styles={{
											maxHeight: "550px",
											padding: 0,
										}}
										list={formRows}
										loading={formRowsLoading}
										params={{
											...formRowsParams,
											screen:
												selectedData?.screen?.value ||
												"",
										}}
										fetchapi={getScreenAuthorizations}
										keyExtractor={(item) => item?.id || ""} // Uses `id` as key
										renderItem={(
											row,
											index,
											selectedRow,
											handleSelect
										) => {
											return (
												<form>
													<Grid
														container
														spacing={2}
														mt={1}>
														<Grid
															size={{
																xs: 12,
																sm: 3,
															}}>
															<SelectComponent
																required
																name={`rows.${index}.type`}
																label="Type"
																control={
																	control2
																}
																disabled={
																	row.id
																		? true
																		: false
																}
																helperText={
																	row.id
																		? `This field is disabled`
																		: ""
																}
																options={
																	TYPE_CHOICES
																}
																onChange={(
																	value
																) => {
																	if (
																		row?.id
																	) {
																		const auth_payload =
																			{
																				id: row.id
																					? row.id
																					: "",
																				type:
																					value?.value ||
																					0,
																				user_id:
																					(row
																						?.type
																						?.value ==
																					1
																						? row
																								?.user_or_group
																								?.value
																						: "") as string,
																				group_id:
																					(row
																						?.type
																						?.value ==
																					2
																						? row
																								?.user_or_group
																								?.value
																						: "") as number,
																				screen_id:
																					(selectedData
																						?.screen
																						?.id ||
																						0) as number,
																				level: (row?.level ||
																					0) as number,
																			};
																		const obj =
																			addParams(
																				auth_payload
																			);

																		dispatch(
																			editAuthorizationDataById(
																				{
																					obj: obj,
																					hide: () => {},
																					pageParams:
																						pageParams,
																				}
																			)
																		);
																	} else {
																		dispatch(
																			setSelectedFormData(
																				{
																					...selectedFormData,
																					type: value,
																				}
																			)
																		);
																	}
																	dispatch(
																		setFormRows(
																			[
																				...formRows?.map(
																					(
																						e
																					) => {
																						if (
																							e.id ==
																							row.id
																						) {
																							return {
																								...e,
																								type: value,
																							};
																						}
																						return e;
																					}
																				),
																			]
																		)
																	);
																}}
															/>
														</Grid>
														<Grid
															size={{
																xs: 12,
																sm: 4,
															}}
															sx={{
																mt: row?.type
																	?.value
																	? 0
																	: 2.5,
															}}>
															<SelectComponent
																name={`rows.${index}.user_or_group`}
																label={
																	row?.type
																		?.value
																		? row
																				?.type
																				?.value ==
																			1
																			? "User"
																			: "Group"
																		: ""
																}
																control={
																	control2
																}
																options={(row
																	?.type
																	?.value == 1
																	? miniUserList?.map(
																			(
																				e: any
																			) => ({
																				name: e.fullname,
																				id: e.id,
																			})
																		)
																	: profileList
																)?.map(
																	(
																		e: any
																	) => ({
																		id: e.id,
																		name: e.name,
																	})
																)}
																onChange={(
																	value
																) => {
																	if (
																		row?.id
																	) {
																		const auth_payload =
																			{
																				id: row.id
																					? row.id
																					: "",
																				type:
																					row
																						.type
																						?.value ||
																					0,
																				user_id:
																					(row
																						?.type
																						?.value ==
																					1
																						? value?.value
																						: "") as string,
																				group_id:
																					(row
																						?.type
																						?.value ==
																					2
																						? value?.value
																						: "") as number,
																				screen_id:
																					(selectedData
																						?.screen
																						?.id ||
																						0) as number,
																				level: (row?.level ||
																					0) as number,
																			};
																		const obj =
																			addParams(
																				auth_payload
																			);
																		dispatch(
																			editScreenAuthorizationDataById(
																				{
																					obj: obj,
																					hide: () => {},
																					pageParams:
																						formRowsParams,
																				}
																			)
																		);
																	} else {
																		dispatch(
																			setSelectedFormData(
																				{
																					...selectedFormData,
																					user_or_group:
																						value,
																				}
																			)
																		);
																	}
																}}
																loading={
																	row?.type
																		?.value ==
																	1
																		? miniUserLoading
																		: profilesloading
																}
																selectParams={
																	row?.type
																		?.value ==
																	1
																		? {
																				page: miniUserParams.page,
																				page_size:
																					miniUserParams.page_size,
																				search: miniUserParams.search,
																				no_of_pages:
																					miniUserParams.no_of_pages,
																			}
																		: {
																				page: profileParams.page,
																				page_size:
																					profileParams.page_size,
																				search: profileParams.search,
																				no_of_pages:
																					profileParams.no_of_pages,
																			}
																}
																hasMore={
																	row?.type
																		?.value ==
																	1
																		? profileParams.page <
																			profileParams.no_of_pages
																		: miniUserParams.page <
																			miniUserParams.no_of_pages
																}
																fetchapi={
																	row?.type
																		?.value ==
																	1
																		? getMiniUsers
																		: getProfileList
																}
																clearData={
																	row?.type
																		?.value ==
																	1
																		? clearMiniUsers
																		: clearProfileData
																}
															/>
														</Grid>
														<Grid
															size={{
																xs: 12,
																sm: 4,
															}}>
															<FormInput
																required
																name={`rows.${index}.level`}
																label="Level No"
																type="number"
																placeholder="Enter Level Number here"
																control={
																	control2
																}
																onChange={(
																	e
																) => {
																	if (
																		row?.id
																	) {
																		const auth_payload =
																			{
																				id: row.id
																					? row.id
																					: "",
																				type:
																					row
																						.type
																						?.value ||
																					0,
																				user_id:
																					(row
																						?.type
																						?.value ==
																					1
																						? row
																								?.user_or_group
																								?.value
																						: "") as string,
																				group_id:
																					(row
																						?.type
																						?.value ==
																					2
																						? row
																								?.user_or_group
																								?.value
																						: "") as number,
																				screen_id:
																					(selectedData
																						?.screen
																						?.id ||
																						0) as number,
																				level: (e
																					.target
																					.value ||
																					0) as number,
																			};
																		const obj =
																			addParams(
																				auth_payload
																			);
																		debouncedSearch(
																			obj
																		);
																	} else {
																		dispatch(
																			setSelectedFormData(
																				{
																					...selectedFormData,
																					level: e
																						.target
																						.value,
																				}
																			)
																		);
																	}
																}}
															/>
														</Grid>
														<Grid
															size={{
																xs: 12,
																sm: 1,
															}}>
															<Stack
																direction={
																	"row"
																}
																spacing={0.1}
																mt={3}>
																{!row?.id && (
																	<IconButton
																		onClick={handleSubmit2(
																			onScreenAuthSubmit,
																			(
																				err
																			) => {
																				console.log(
																					err
																				);
																			}
																		)}>
																		<LuPlusCircle
																			style={{
																				color: theme
																					?.palette
																					?.primary
																					?.light,
																			}}
																		/>
																	</IconButton>
																)}
																{row?.id && (
																	<IconButton
																		onClick={() =>
																			deleteRow(
																				row
																			)
																		}>
																		<LuMinusCircle
																			style={{
																				color: theme
																					?.palette
																					?.error
																					?.light,
																			}}
																		/>
																	</IconButton>
																)}
															</Stack>
														</Grid>
													</Grid>
												</form>
											);
										}}
									/>
								</Grid>
							</Grid>
							<DialogActions
								sx={{
									p: 2,
									//  pr: 12
								}}>
								<Button
									onClick={() => {
										hide();
										setModalOpen(false);
									}}
									variant="outlined"
									color="secondary">
									Cancel
								</Button>
								{!selectedData?.id ? (
									<LoadingButton
										variant="contained"
										type="submit"
										color="primary"
										loading={loading}
										autoFocus>
										Submit
									</LoadingButton>
								) : (
									<LoadingButton
										variant="contained"
										type="submit"
										color="primary"
										loading={loading}
										autoFocus>
										Update
									</LoadingButton>
								)}
							</DialogActions>
						</form>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};
export default AddAuthorization;
