import { createSelector, createSlice } from "@reduxjs/toolkit";
import { UserProfile, UserProfileInitialState } from "./profile.types";
import {
    getUserDetails, ChangePasswordSubmit,
    getUserLogList,
    getUserDeviceList
} from "./profile.action";
import { RootState } from "@src/store/store";

const initialState: UserProfileInitialState = {
    error: "",
    status: "",
    loading: false,
    profilesList: {
        id: "",
        username: "",
        first_name: "",
        last_name: "",
        fullname: "",
        phone: "",
        email: "",
        groups: [],
        device_access: undefined,
        is_active: false,
        newPassword: "",
        confirmPassword: "",
        old_password: "",
        password: ""
    },
    profilesCount: 0,
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
        old_password: "",
        password: ""
    },
    loginLoading: false,
    profileLoginParams: {
        no_of_pages: 0,
        page_size: 10,
        page: 1,
        search: "",
    },
    userActivityList: [],
    loginCount: 0,
    deviceLoading: false,
    profileDeviceParams: {
        no_of_pages: 0,
        page_size: 10,
        page: 1,
        search: "",
    },
    profileDeviceList: [],
    profileDeviceCount: 0,
    activityLoading: false,
    profileActivityParams: {
        no_of_pages: 0,
        page_size: 10,
        page: 1,
        search: "",
    },
    userActivityCount: 0,
    filterStatus: false,
    passwordModel: false,
    pageParams: {
        no_of_pages: 0,
        page_size: 10,
        page: 1,
        search: "",
    },

};

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        clearUserData: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetails.pending, (state, action) => {
                state.status = "getUserDetails loading";
                state.loading = true;
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                const response = action.payload;
                state.status = "getUserDetails succeeded";
                state.loading = false;
                state.profilesList = response;
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.status = "getUserDetails failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(getUserLogList.pending, (state, action) => {
                state.status = "getUserLogList loading";
                state.loading = true;
            })
            .addCase(getUserLogList.fulfilled, (state, action) => {
                const { response, params } = action.payload;
                state.status = "getUserLogList succeeded";
                state.loading = false;
                state.userActivityList = response.results;
                state.userActivityCount = response.count;
                var noofpages = Math.ceil(response.count / params.page_size);
                state.profileActivityParams = {
                    ...state.profileActivityParams,
                    ...params,
                    no_of_pages: noofpages,
                };
            })
            .addCase(getUserLogList.rejected, (state, action) => {
                state.status = "getUserLogList failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(getUserDeviceList.pending, (state, action) => {
                state.status = "getUserDeviceList loading";
                state.loading = true;
            })
            .addCase(getUserDeviceList.fulfilled, (state, action) => {
                const { response, params } = action.payload;
                state.status = "getUserDeviceList succeeded";
                state.loading = false;
                state.profileDeviceList = response.results;
                state.profileDeviceCount = response.count;
                var noofpages = Math.ceil(response.count / params.page_size);
                state.profileDeviceParams = {
                    ...state.profileDeviceParams,
                    ...params,
                    no_of_pages: noofpages,
                };
            })
            .addCase(getUserDeviceList.rejected, (state, action) => {
                state.status = "getUserDeviceList failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(ChangePasswordSubmit.pending, (state, action) => {
                state.status = "ChangePasswordSubmit loading";
                state.loading = true;
            })
            .addCase(ChangePasswordSubmit.fulfilled, (state, action) => {
                state.status = "ChangePasswordSubmit succeeded";
                state.loading = false;
            })
            .addCase(ChangePasswordSubmit.rejected, (state, action) => {
                state.status = "ChangePasswordSubmit failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
    },
});

export const userProfileSelector = (state: RootState) => state.userProfile;

export const selectUserProfiles = createSelector([userProfileSelector], (userprofile) => {
    return {
        userprofile,
    };
});

export default userProfileSlice.reducer;
