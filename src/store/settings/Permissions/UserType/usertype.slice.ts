import { createSlice } from "@reduxjs/toolkit";
import { User, UserTypeInitialState } from "./usertype.types";
import {
    getUserTypes, getUserTypeById, postUserTypeData, editUserTypeDataById, deleteUserType
} from "./usertype.action";
import { RootState } from "@src/store/store";

const initialState: UserTypeInitialState = {
    error: "",
    status: "",
    loading: false,
    userTypeList: [],
    usersCount: 0,
    drawer: false,
    selectedData: {
        id: "",
        code: "",
        name: "",
    },
    filterStatus: false,
    pageParams: {
        no_of_pages: 0,
        page_size: 0,
        page: 0,
        search: undefined,
        parent: undefined
    },
    model: false
};

const userTypeSlice = createSlice({
    name: "usertype",
    initialState,
    reducers: {
        clearUserData: () => {
            return initialState;
        },
        setSelectedData: (state, action) => {
            return {
                ...state,
                selectedData: action.payload,
            };
        },
        isModelVisible: (state, action) => {
            return {
                ...state,
                model: action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserTypes.pending, (state, action) => {
                state.status = "getUserTypes loading";
                state.loading = true;
            })
            .addCase(getUserTypes.fulfilled, (state, action) => {
                const { response, params } = action.payload;
                state.status = "getUserTypes succeeded";
                state.loading = false;
                state.userTypeList = response.results;
                state.usersCount = response.count;
                var noofpages = Math.ceil(response.count / params.page_size);
                state.pageParams = {
                    ...state.pageParams,
                    ...params,
                    no_of_pages: noofpages,
                };
            })
            .addCase(getUserTypes.rejected, (state, action) => {
                state.status = "getUserTypes failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // getbyid
            .addCase(getUserTypeById.pending, (state, action) => {
                state.status = "getUserTypeById loading";
                state.loading = true;
            })
            .addCase(getUserTypeById.fulfilled, (state, action) => {
                const { response } = action.payload;
                state.status = "getUserTypeById succeeded";
                state.selectedData = response;
            })
            .addCase(getUserTypeById.rejected, (state, action) => {
                state.status = "getUserTypeById failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // post user
            //post Data
            .addCase(postUserTypeData.pending, (state, action) => {
                state.status = "postUserTypeData loading";
                state.loading = true;
            })
            .addCase(postUserTypeData.fulfilled, (state, action) => {
                state.status = "postUserTypeData succeeded";
                state.loading = false;
                state.model = false;
            })
            .addCase(postUserTypeData.rejected, (state, action) => {
                state.status = "postUserTypeData failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // edit user
            .addCase(editUserTypeDataById.pending, (state, action) => {
                state.status = "editUserTypeDataById loading";
                state.loading = true;
            })
            .addCase(editUserTypeDataById.fulfilled, (state, action) => {
                state.status = "editUserTypeDataById succeeded";
                state.loading = false;
                state.model = false;
            })
            .addCase(editUserTypeDataById.rejected, (state, action) => {
                state.status = "editUserTypeDataById failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(deleteUserType.pending, (state, action) => {
                state.status = "deleteUserType loading";
                state.loading = true;
            })
            .addCase(deleteUserType.fulfilled, (state, action) => {
                state.status = "deleteUserType succeeded";
                state.loading = false;
            })
            .addCase(deleteUserType.rejected, (state, action) => {
                state.status = "deleteUserType failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            });
    },
});

// Action creators are generated for each case reducer function
export const { clearUserData, setSelectedData, isModelVisible } =
    userTypeSlice.actions;

export const UserTypeSelector = (state: RootState) =>
    state.settings.usertype;

export default userTypeSlice.reducer;
