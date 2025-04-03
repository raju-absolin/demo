import { createSlice } from "@reduxjs/toolkit";
import {
	ContentTypeDetails,
	ManageGroupInitialState,
	PermissionListType,
	Permissions,
} from "./manage_groups.types";
import {
	getPermissionsList,
	getProfilebyID,
	getProfileList,
} from "./manage_groups.action";
import { RootState } from "@src/store/store";

const initialState: ManageGroupInitialState = {
	listCount: 0,
	profileList: [],
	adminProfileList: [],
	adminListCount: 0,
	manualRegProfileList: [],
	manualRegCount: 0,
	appPermissionsList: [],
	checkedPermissions: [],
	profileData: {},
	model: false,
	loading: false,
	status: "",
	error: "",
	permissionsLoading: false,
	profileParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
		currentSort: "code",
		sortOrder: "-",
	},
	// modalProps: {
	// 	isOpen: false,
	// 	title: "",
	// 	// context: "",
	// 	okText: "",
	// 	closeText: "",
	// 	status: "info",
	// },
	expanded: [],
};

const manageProfileSlice = createSlice({
	name: "manageProfile",
	initialState,
	reducers: {
		setModalProps: (state, action) => {
			return {
				...state,
				modalProps: action.payload,
			};
		},
		setExpanded: (state, action) => {
			return {
				...state,
				expanded: action.payload,
			};
		},
		InputChangeValue: (state, action) => {
			return {
				...state,
				profileData: {
					...state.profileData,
					[action.payload.key]: action.payload.value,
				},
			};
		},
		// checkAppPermission: (state, action) => {
		//
		// 	state.appPermissionsList.map((item) => {
		// 		if (item.id === action.payload.appPermission_id) {
		// 			item.appPermissionsChecked = !item.appPermissionsChecked;
		// 			if (item.appPermissionsChecked == true) {
		// 				item.contenttypedetails.map((appitem) => {
		// 					item.appPermissionsChecked = true;
		// 					appitem.permissions.map((permission) => {
		// 						permission.permissionChecked = true;
		// 						state.checkedPermissions = [
		// 							...state.checkedPermissions,
		// 							permission,
		// 						];
		// 					});
		// 				});
		// 			} else {
		// 				item.contenttypedetails.map((appitem) => {
		// 					item.appPermissionsChecked = false;
		// 					appitem.permissions.map((permission) => {
		// 						permission.permissionChecked = false;
		// 						state.checkedPermissions =
		// 							state.checkedPermissions.filter(
		// 								(permission1: any) => {
		// 									if (
		// 										permission1.id !== permission.id
		// 									) {
		// 										return true;
		// 									}
		// 									return false;
		// 								}
		// 							);
		// 					});
		// 				});
		// 			}
		// 		}
		// 		return item;
		// 	});
		// },

		checkAppPermission: (state, action) => {
			const { appPermission_id } = action.payload;

			// Update appPermissionsList immutably
			state.appPermissionsList = state.appPermissionsList.map((item) => {
				if (item.id === appPermission_id) {
					// Toggle appPermissionsChecked status
					const appPermissionChecked = !item.appPermissionsChecked;

					// Update contenttypedetails and permissions accordingly
					const updatedContentTypeDetails =
						item.contenttypedetails.map((appitem) => {
							const updatedPermissions = appitem.permissions.map(
								(permission) => {
									return {
										...permission,
										permissionChecked: appPermissionChecked, // Set permissionChecked based on toggle
									};
								}
							);

							return {
								...appitem,
								permissions: updatedPermissions,
							};
						});

					// Update checkedPermissions based on appPermissionChecked
					if (appPermissionChecked) {
						// Add all permissions to checkedPermissions
						item.contenttypedetails.forEach((appitem) => {
							appitem.permissions.forEach((permission) => {
								if (
									!state.checkedPermissions.find(
										(p: any) => p.id === permission.id
									)
								) {
									state.checkedPermissions.push(permission);
								}
							});
						});
					} else {
						// Remove all permissions from checkedPermissions
						item.contenttypedetails.forEach((appitem) => {
							appitem.permissions.forEach((permission) => {
								state.checkedPermissions =
									state.checkedPermissions.filter(
										(p: any) => p.id !== permission.id
									);
							});
						});
					}

					// Return the updated item with new checked state
					return {
						...item,
						appPermissionsChecked: appPermissionChecked,
						contenttypedetails: updatedContentTypeDetails,
					};
				}

				// Return the unchanged item
				return item;
			});
		},

		// checkPermission: (state, action) => {
		//
		// 	if (state.appPermissionsList.length !== 0) {
		// 		state.appPermissionsList.forEach((item) => {
		// 			if (action.payload.appPermission_id == item.id) {
		// 				item.contenttypedetails.forEach((appitem) => {
		// 					if (action.payload.contentType_id == appitem.id) {
		// 						appitem.permissions.forEach((permission) => {
		// 							if (
		// 								action.payload.permission_id ==
		// 								permission.id
		// 							) {
		// 								permission.permissionChecked =
		// 									action.payload.value;
		// 								if (action.payload.value === true) {
		// 									item.appPermissionsChecked = true;
		// 									appitem.contentTypeChecked = true;
		// 									state.checkedPermissions = [
		// 										...state.checkedPermissions,
		// 										permission,
		// 									];
		// 								} else {
		// 									state.checkedPermissions =
		// 										state.checkedPermissions.filter(
		// 											(permission: any) => {
		// 												if (
		// 													permission.id !==
		// 													action.payload
		// 														.permission_id
		// 												) {
		// 													return true;
		// 												}
		// 												return false;
		// 											}
		// 										);
		// 								}
		// 							}
		// 						});
		// 					}
		// 				});
		// 			}
		// 		});
		// 	}
		// },

		checkPermission: (state, action) => {
			if (state.appPermissionsList.length !== 0) {
				// Update the appPermissionsList immutably
				state.appPermissionsList = state.appPermissionsList.map(
					(item) => {
						if (action.payload.appPermission_id === item.id) {
							// Update contenttypedetails immutably
							const updatedContentTypeDetails =
								item.contenttypedetails.map((appitem) => {
									if (
										action.payload.contentType_id ===
										appitem.id
									) {
										// Update permissions immutably
										const updatedPermissions =
											appitem.permissions.map(
												(permission) => {
													if (
														action.payload
															.permission_id ===
														permission.id
													) {
														// Toggle the permissionChecked state based on action.payload.value
														permission = {
															...permission,
															permissionChecked:
																action.payload
																	.value,
														};

														if (
															action.payload
																.value === true
														) {
															// Add the permission to checkedPermissions if it's being checked
															state.checkedPermissions =
																[
																	...state.checkedPermissions,
																	permission,
																];
															item.appPermissionsChecked =
																true;
															appitem.contentTypeChecked =
																true;
														} else {
															// Remove the permission from checkedPermissions if unchecked
															state.checkedPermissions =
																state.checkedPermissions.filter(
																	(
																		perm: any
																	) =>
																		perm.id !==
																		action
																			.payload
																			.permission_id
																);
														}
													}
													return permission;
												}
											);

										return {
											...appitem,
											permissions: updatedPermissions,
										};
									}
									return appitem;
								});

							return {
								...item,
								contenttypedetails: updatedContentTypeDetails,
							};
						}
						return item;
					}
				);
			}
		},

		setProfileParams: (state, action) => {
			return {
				...state,
				profileParams: action.payload,
			};
		},
		profileDelete: (state, action) => {
			return {
				...state,
				loading: true,
			};
		},
		clearProfileData: (state) => {
			return {
				...state,
				loading: false,
				profileData: {},
				appPermissionsList: [],
				checkedPermissions: [],
			};
		},

		clearprofileParams: (state) => {
			return {
				...state,
				loading: false,
				profileParams: {
					no_of_pages: 0,
					page_size: 10,
					page: 1,
					search: "",
					currentSort: "code",
					sortOrder: "-",
				},
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getProfileList.pending, (state, action) => {
				state.status = "getProfileList loading";
				state.loading = true;
			})
			.addCase(getProfileList.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getProfileList succeeded";
				state.loading = false;
				state.profileList = response.results;
				state.listCount = response.count;
			})
			.addCase(getProfileList.rejected, (state, action) => {
				state.status = "getProfileList failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getProfilebyID.pending, (state, action) => {
				state.status = "getProfilebyID loading";
				state.loading = true;
			})
			.addCase(getProfilebyID.fulfilled, (state, action) => {
				const { response } = action.payload;

				const permissionsIds = response.permissions;

				// Create a new list for appPermissionsList with immutability in mind
				const updatedAppPermissionsList = state.appPermissionsList?.map(
					(item: PermissionListType) => {
						// Create a new list for contenttypedetails
						const updatedContentTypeDetails =
							item.contenttypedetails.map(
								(appitem: ContentTypeDetails) => {
									// Create a new list for permissions
									const updatedPermissions =
										appitem.permissions.map(
											(permission: Permissions) => {
												const isPermissionChecked =
													permissionsIds.includes(
														permission.id
													);
												if (isPermissionChecked) {
													// Add to the list of checked permissions
													state.checkedPermissions = [
														...state.checkedPermissions,
														permission,
													];
												}

												return {
													...permission,
													permissionChecked:
														isPermissionChecked, // Set permissionChecked based on permissionsIds
												};
											}
										);

									return {
										...appitem,
										permissions: updatedPermissions,
										contentTypeChecked:
											updatedPermissions.some(
												(perm) => perm.permissionChecked
											),
									};
								}
							);

						return {
							...item,
							contenttypedetails: updatedContentTypeDetails,
							appPermissionsChecked:
								updatedContentTypeDetails.some(
									(ct) => ct.contentTypeChecked
								),
						};
					}
				);

				// Update the state immutably
				state.appPermissionsList = updatedAppPermissionsList;
				state.status = "getProfilebyID succeeded";
				state.loading = false;

				// Update profile data immutably
				state.profileData = {
					...response,
				};
			})
			.addCase(getProfilebyID.rejected, (state, action) => {
				state.status = "getProfilebyID failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getPermissionsList
			.addCase(getPermissionsList.pending, (state, action) => {
				state.status = "getPermissionsList loading";
				state.permissionsLoading = true;
			})
			.addCase(getPermissionsList.fulfilled, (state, action) => {
				const { response, id } = action.payload;
				state.status = "getPermissionsList succeeded";
				state.permissionsLoading = false;
				if (state.appPermissionsList.length == 0) {
					var permissionlist = response.map((item) => {
						var contentTypeList = item.contenttypedetails.map(
							(appitem) => {
								var permissionList = appitem.permissions.map(
									(permission) => {
										// permission.permissionChecked = false;
										return {
											...permission,
											permissionChecked: false,
										};
									}
								);
								return {
									...appitem,
									permissions: permissionList,
									contentTypeChecked: false,
								};
							}
						);
						return {
							...item,
							appPermissionsChecked: false,
							contenttypedetails: contentTypeList,
						};
					});
					state.appPermissionsList = permissionlist;
				}
			})
			.addCase(getPermissionsList.rejected, (state, action) => {
				state.status = "getPermissionsList failed";
				state.permissionsLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	InputChangeValue,
	checkAppPermission,
	checkPermission,
	clearprofileParams,
	setProfileParams,
	profileDelete,
	clearProfileData,
	setExpanded,
	setModalProps,
} = manageProfileSlice.actions;

export const selectManageGroups = (state: RootState) =>
	state.settings.manageProfile;

export default manageProfileSlice.reducer;
