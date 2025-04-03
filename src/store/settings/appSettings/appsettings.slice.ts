import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { appSettingsAdd, getAppSettings } from "./appsettings.action";
import { RootState } from "@src/store/store";

const appsettingsSlice = createSlice({
    name: "appSettings",
    initialState: {
        listCount: 0,
        appSettingsData: {
            SMS__MSG_VAR: "",
            SMS__NUMBER_VAR: "",
            SMS__URL: "",
            SMTP__BACKEND: "",
            SMTP__HOST: "",
            SMTP__PASSWORD: "",
            SMTP__PORT: "",
            SMTP__USER: "",
            SMTP__USE_TLS: false,
            THIRDPARTY__URL: "",
            THIRDPARTY__TOKEN: "",
        },
        model: false,
        loading: false,
        error: "",
        status: "",

    },
    reducers: {
        SetTLS: (state, action) => {
            return {
                ...state,
                appSettingsData: {
                    ...state.appSettingsData,
                    SMTP__USE_TLS: action.payload
                }
            }
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getAppSettings.pending, (state, action) => {
                state.loading = true;
                state.status = "getAppSettings pending";
            })
            .addCase(getAppSettings.fulfilled, (state, action) => {
                state.status = "getAppSettings succeeded";
                const { response } = action.payload;
                state.loading = false;
                state.appSettingsData = {
                    SMS__MSG_VAR: response.SMS__MSG_VAR,
                    SMS__NUMBER_VAR: response.SMS__NUMBER_VAR,
                    SMS__URL: response.SMS__URL,
                    SMTP__BACKEND: response?.SMTP__BACKEND,
                    SMTP__HOST: response?.SMTP__HOST,
                    SMTP__PASSWORD: response?.SMTP__PASSWORD,
                    SMTP__PORT: response?.SMTP__PORT,
                    SMTP__USER: response?.SMTP__USER,
                    SMTP__USE_TLS: response?.SMTP__USE_TLS,
                    THIRDPARTY__URL: response?.THIRDPARTY__URL,
                    THIRDPARTY__TOKEN: response?.THIRDPARTY__TOKEN,
                }
            })
            .addCase(getAppSettings.rejected, (state, action) => {
                state.status = "getAppSettings failed";
                state.loading = false;
                state.error = action.error.message || "An unknown error occurred";;
            })
            .addCase(appSettingsAdd.pending, (state, action) => {
                state.loading = true;
                state.status = "appSettingsAdd pending";
            })
            .addCase(appSettingsAdd.fulfilled, (state, action) => {
                state.status = "appSettingsAdd succeeded";
                state.loading = false;
            })
            .addCase(appSettingsAdd.rejected, (state, action) => {
                state.status = "appSettingsAdd failed";
                state.loading = false;
                state.error = action.error.message || "An unknown error occurred";;
            })
    }
});

// Action creators are generated for each case reducer function
export const {
    SetTLS
} = appsettingsSlice.actions;

export const appsettingsSelector = (state: RootState) =>
    state.settings.appSettings;

export default appsettingsSlice.reducer;
