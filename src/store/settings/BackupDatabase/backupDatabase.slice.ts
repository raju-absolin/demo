import { createSlice } from "@reduxjs/toolkit";
import {
    getBackUpDataBaseList,
    getDataBaseBackUP,
    DataBaseVerifyPassword
} from "./backupDatabase.action";
import { RootState } from "@src/store/store";

export const backupDatabaseSlice = createSlice({
    name: "backupDatabase",
    initialState: {
        listCount: 0,
        backUpDataBaselist: [
            {
                id:"",
                code:"",
                name:"",
                createdon:"",
            }
        ],
        locationManagerData: {},
        backupData: {
            password: "",
        },
        model: false,
        passwordModel: false,
        dataBaseId: 0,
        backUpDataBaseParams: {
            no_of_pages: 0,
            page_size: 10,
            page: 1,
            search: "",
            currentSort: "code",
            sortOrder: "-",
        },
        loading: false,
        error: "",
        status: "",
        verifyPwdloading: false,
        pageParams: {
            no_of_pages: 0,
            page_size: 10,
            page: 1,
            search: "",
        },
    },
    reducers: {
        loadingStatus: (state, action) => {
            return { ...state, loading: action.payload };
        },
        setBackUpDataBaseParams: (state, action) => {
            return {
                ...state,
                backUpDataBaseParams: action.payload,
            };
        },
        isPasswordModel: (state, action) => {
            if (!action.payload.model) {
                return {
                    ...state,
                    passwordModel: action.payload.model,
                    backupData: { password: "" },
                    dataBaseId: 0,
                    verifyPwdloading: false
                };
            } else {
                return {
                    ...state,
                    passwordModel: action.payload.model,
                    dataBaseId: action.payload.Id

                };
            }
        },
        InputChangeValue: (state, action) => {
            return {
                ...state,
                backupData: {
                    ...state.backupData,
                    [action.payload.key]: action.payload.value,
                },
            }
        },
        apiError: (state, action) => {
            return { ...state, loading: false, error_msg: action.payload, verifyPwdloading: false };
        },
        setVerifyPassword: (state, action) => {
            return {
                ...state,
                verifyPassword: action.payload
            };
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getBackUpDataBaseList.pending, (state, action) => {
                state.status = "getBackUpDataBaseList loading";
                state.loading = true;
            })
            .addCase(getBackUpDataBaseList.fulfilled, (state, action) => {
                const { response, params } = action.payload;
                state.status = "getBackUpDataBaseList succeeded";
                state.loading = false;
                state.backUpDataBaselist = response.results;
                state.listCount = response.count;
                var noofpages = Math.ceil(response.count / params.page_size);
                state.pageParams = {
                    ...state.pageParams,
                    ...params,
                    no_of_pages: noofpages,
                };
            })
            .addCase(getBackUpDataBaseList.rejected, (state, action) => {
                state.status = "getBackUpDataBaseList failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })

            .addCase(getDataBaseBackUP.pending, (state, action) => {
                state.status = "getDataBaseBackUP loading";
                state.loading = true;
            })
            .addCase(getDataBaseBackUP.fulfilled, (state, action) => {
                state.status = "getDataBaseBackUP succeeded";
                state.loading = false
                // state.model = true;
                // state.rowdata = {...action.payload};
            })
            .addCase(getDataBaseBackUP.rejected, (state, action) => {
                state.status = "getDataBaseBackUP failed";
                state.loading = false;
                state.error = action.error.message || "An Unknown error occured";
            })

            .addCase(DataBaseVerifyPassword.pending, (state, action) => {
                state.status = "DataBaseVerifyPassword loading";
                state.verifyPwdloading = true;
            })
            .addCase(DataBaseVerifyPassword.fulfilled, (state, action) => {
                state.status = "DataBaseVerifyPassword succeeded";
                state.verifyPwdloading = false;
            })
            .addCase(DataBaseVerifyPassword.rejected, (state, action) => {
                state.status = "DataBaseVerifyPassword failed";
                state.verifyPwdloading = false;
                state.error = action.error.message || "An Unknown error occured";
            })
    }
});

// Action creators are generated for each case reducer function
export const {
    setBackUpDataBaseParams,
    loadingStatus,
    isPasswordModel,
    InputChangeValue,
    apiError,
    setVerifyPassword
} = backupDatabaseSlice.actions;

export const backupDatabaseSelector = (state: RootState) =>
    state.settings.backupDatabase;

export default backupDatabaseSlice.reducer;
