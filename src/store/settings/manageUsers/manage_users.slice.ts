import { createSlice } from "@reduxjs/toolkit";
import { User, ManageUserInitialState } from "./manage_users.types";
import {
	editMangeUsersDataById,
	getUserById,
	getUsers,
	postMangeUsersData,
	userActive,
	userInActive,
	updatePassword,
	getUserDeviceList,
	getUserActivityList,
	getUserLoginList,
	getUserAuditList,
} from "./manage_users.action";
import { RootState } from "@src/store/store";

const initialState: ManageUserInitialState = {
	error: "",
	status: "",
	loading: false,
	usersList: [],
	usersCount: 0,
	drawer: false,
	selectedData: {
		id: "",
		username: "",
		first_name: "",
		last_name: "",
		fullname: "",
		phone: "",
		alternate_phone: "",
		is_phone_verified: false,
		email: "",
		is_email_verified: false,
		gender: 0,
		gender_name: "",
		groups: [],
		device_access: 0,
		is_active: false,
		latitude: "",
		longitude: "",
		newPassword: "",
		confirmPassword: "",
	},
	loginLoading: false,
	userLoginParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	userLoginList: [],
	loginCount: 0,
	deviceLoading: false,
	userDeviceParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	userDeviceList: [],
	userDeviceCount: 0,
	activityLoading: false,
	userActivityParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	userActivityList: [],
	useActivityCount: 0,

	auditLoading: false,
	userAuditParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	userAuditList: [],
	userAuditCount: 0,
	filterStatus: false,
	passwordModel: false,
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
};

const manageUserSlice = createSlice({
	name: "manageUser",
	initialState,
	reducers: {
		clearUserData: () => {
			return initialState;
		},
		setIsPasswordModel: (state, action) => {
			return {
				...state,
				passwordModel: action.payload,
			};
		},
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
			};
		},
		setUserLoginParams: (state, action) => {
			return {
				...state,
				userLoginParams: action.payload,
			};
		},
		setUserDeviceParams: (state, action) => {
			return {
				...state,
				userDeviceParams: action.payload,
			};
		},
		setUserAuditParams: (state, action) => {
			return {
				...state,
				userAuditParams: action.payload,
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUsers.pending, (state, action) => {
				state.status = "getUsers loading";
				state.loading = true;
			})
			.addCase(getUsers.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getUsers succeeded";
				state.loading = false;
				state.usersList = response.results;
				state.usersCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getUsers.rejected, (state, action) => {
				state.status = "getUsers failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getUserById.pending, (state, action) => {
				state.status = "getUserById loading";
				state.loading = true;
			})
			.addCase(getUserById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.selectedData = response;
				(state.selectedData.groups = state.selectedData?.groups?.map(
					(e) => {
						return {
							label: e.name,
							value: e.id,
						};
					}
				)),
					(state.selectedData.locations =
						state.selectedData?.locations?.map((e: any) => {
							return {
								label: e.name,
								value: e.id,
							};
						})),
					(state.loading = false);
				state.selectedData.device_access = {
					label: response.device_access_name,
					value: response.device_access,
				};
			})
			.addCase(getUserById.rejected, (state, action) => {
				state.status = "getUserById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// post user
			//post Data
			.addCase(postMangeUsersData.pending, (state, action) => {
				state.status = "loading";
				state.loading = true;
			})
			.addCase(postMangeUsersData.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.loading = false;
			})
			.addCase(postMangeUsersData.rejected, (state, action) => {
				state.status = "failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// edit user
			.addCase(editMangeUsersDataById.pending, (state, action) => {
				state.status = "loading";
				state.loading = true;
			})
			.addCase(editMangeUsersDataById.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.loading = false;
			})
			.addCase(editMangeUsersDataById.rejected, (state, action) => {
				state.status = "failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(userActive.pending, (state, action) => {
				state.status = "userActive loading";
				state.loading = true;
			})
			.addCase(userActive.fulfilled, (state, action) => {
				state.status = "userActive succeeded";
				// state.loading = false;
			})
			.addCase(userActive.rejected, (state, action) => {
				state.status = "userActive failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(userInActive.pending, (state, action) => {
				state.status = "userInActive loading";
				state.loading = true;
			})
			.addCase(userInActive.fulfilled, (state, action) => {
				state.status = "userInActive succeeded";
				// state.loading = false;
			})
			.addCase(userInActive.rejected, (state, action) => {
				state.status = "userInActive failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(updatePassword.pending, (state, action) => {
				state.status = "updatePassword loading";
				state.loading = true;
			})
			.addCase(updatePassword.fulfilled, (state, action) => {
				state.status = "updatePassword succeeded";
				// state.loading = false;
			})
			.addCase(updatePassword.rejected, (state, action) => {
				state.status = "updatePassword failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getUserLoginList.pending, (state, action) => {
				state.status = "getUserLoginList pending";
				state.loginLoading = true;
			})
			.addCase(getUserLoginList.fulfilled, (state, action) => {
				state.status = "getUserLoginList succeeded";
				const { response, params } = action.payload;
				console.log("response.count45", response.count);
				var noofpages = Math.ceil(
					response.count / state.userLoginParams?.page_size
				);
				console.log("response.count", noofpages);
				state.userLoginList = response.results;
				state.loginCount = response.count;
				state.loginLoading = false;
				state.userLoginParams = {
					...state.userLoginParams,
					no_of_pages: noofpages,
				};
			})
			.addCase(getUserLoginList.rejected, (state, action) => {
				state.status = "getUserLoginList failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})

			.addCase(getUserDeviceList.pending, (state, action) => {
				state.status = "getUserDeviceList pending";
				state.deviceLoading = true;
			})
			.addCase(getUserDeviceList.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getUserDeviceList succeeded";
				state.deviceLoading = false;
				var noofpages = Math.ceil(
					response.count / state.userDeviceParams?.page_size
				);

				state.userDeviceList = response.results;
				state.userDeviceCount = response.count;
				state.userDeviceParams = {
					...state.userDeviceParams,
					no_of_pages: noofpages,
				};
			})
			.addCase(getUserDeviceList.rejected, (state, action) => {
				state.status = "getUserDeviceList failed";
				state.deviceLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})

			.addCase(getUserActivityList.pending, (state, action) => {
				state.status = "getUserActivityList pending";
				state.activityLoading = true;
			})
			.addCase(getUserActivityList.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getUserActivityList succeeded";
				state.activityLoading = false;
				var noofpages = Math.ceil(
					response.count / state.userActivityParams?.page_size
				);

				state.userActivityList = response.results;
				state.useActivityCount = response.count;
				state.userActivityParams = {
					...state.userActivityParams,
					no_of_pages: noofpages,
				};
			})
			.addCase(getUserActivityList.rejected, (state, action) => {
				state.status = "getUserActivityList failed";
				state.activityLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getUserAuditList.pending, (state, action) => {
				state.status = "getUserAuditList pending";
				state.auditLoading = true;
			})
			.addCase(getUserAuditList.fulfilled, (state, action) => {
				const { response, params } = action.payload;

				console.log(response);
				state.status = "getUserAuditList succeeded";
				state.auditLoading = false;
				var noofpages = Math.ceil(
					response.count / state.userAuditParams?.page_size
				);

				console.log(response.results);

				state.userAuditList = response.results?.map((e: any) => {
					try {
						return {
							...e,
							log_data: JSON.parse(e?.log_data),
						};
					} catch (err) {
						return {
							...e,
							log_data: {},
						};
					}
				});
				state.userAuditCount = response.count;
				state.userAuditParams = {
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getUserAuditList.rejected, (state, action) => {
				state.status = "getUserAuditList failed";
				state.auditLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	clearUserData,
	setIsPasswordModel,
	setSelectedData,
	setUserDeviceParams,
	setUserLoginParams,
	setUserAuditParams,
} = manageUserSlice.actions;

export const selectManageUsers = (state: RootState) =>
	state.settings.manageUser;

export default manageUserSlice.reducer;
