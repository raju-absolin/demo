import { createSlice } from "@reduxjs/toolkit";
import { SynchronizationInitialState } from "./synchronization.types";
import {
    startSync, syncStatus, getSyncList, getSyncLogList, syncSettingsAdd, getSyncSettings
} from "./synchronization.action";
import { RootState } from "@src/store/store";

const initialState: SynchronizationInitialState = {
    loading: false,
    status: "",
    error: "",
    syncList: [],
    syncValue: 0,
    syncParams: {
        no_of_pages: 0,
        page_size: 10,
        page: 1,
        search: "",
    },
    syncLogList: [],
    syncLogId: "",
    syncLogParams: {
        no_of_pages: 0,
        page_size: 10,
        page: 1,
        search: "",
    },
    synLogCount: 0,
    syncTypeName: "",
    syncLogLoading: false,
    syncLoading: false,
    synCount: 0,
    syncSettingsData: {},
    openModal: false,
    selectedData: {
        focus_username: "",
        focus_password: "",
        focus_base_url: ""
    }
};


const synchronizationSlice = createSlice({
    name: "sync",
    initialState,
    reducers: {
        setSyncParams: (state, action) => {
            state.syncParams = action.payload
        },
        setSyncValue: (state, action) => {
            state.syncValue = action.payload
        },
        setSyncTypeName: (state, action) => {
            state.syncTypeName = action.payload
        },
        setOpenModel: (state, action) => {
            return {
                ...state,
                openModal: action.payload,
            };
        },
        InputChangeValue: (state, action) => {
            return {
                ...state,
                syncSettingsData: {
                    ...state.syncSettingsData,
                    [action.payload.key]: action.payload.value,
                },
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(startSync.pending, (state, action) => {
                state.status = "startSync loading";
                state.loading = true;
            })
            .addCase(startSync.fulfilled, (state, action) => {
                state.status = "startSync succeeded";
                state.loading = true;

            })
            .addCase(startSync.rejected, (state, action) => {
                state.status = "startSync failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // getbyid
            .addCase(syncStatus.pending, (state, action) => {
                state.status = "syncStatus loading";
                state.loading = true;
            })
            .addCase(syncStatus.fulfilled, (state, action) => {
                state.status = "syncStatus succeeded";
                state.loading = action.payload.loading;
            })
            .addCase(syncStatus.rejected, (state, action) => {
                state.status = "syncStatus failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // post user
            //post Data
            .addCase(getSyncList.pending, (state, action) => {
                state.status = "getSyncList loading";
                state.syncLoading = true;
            })
            .addCase(getSyncList.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getSyncList succeeded";
				state.loading = false;
				state.syncList = response.results;
				state.synCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.syncParams = {
					...state.syncParams,
					...params,
					no_of_pages: noofpages,
				};
			})
            .addCase(getSyncList.rejected, (state, action) => {
                state.status = "getSyncList failed";
                state.syncLoading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // edit user
            .addCase(getSyncLogList.pending, (state, action) => {
                state.status = "getSyncLogList loading";
                state.syncLogLoading = true;
            })
            .addCase(getSyncLogList.rejected, (state, action) => {
                state.status = "sync Log Status failed";
                state.syncLogLoading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(getSyncLogList.fulfilled, (state, action) => {
                state.status = "sync Log Status succeeded";
                const { response, params } = action.payload;
                state.syncLogLoading = false;
                var noofpages = Math.ceil(
                    response.count / state.syncLogParams.page_size
                );
                state.synLogCount = response.count;
                state.syncLogList = response.results;
                state.syncLogParams = {
                    ...state.syncLogParams,
                    no_of_pages: noofpages,
                };
            })
            .addCase(getSyncSettings.pending, (state, action) => {
                state.loading = true;
                state.status = "getSyncSettings pending";
            })
            .addCase(getSyncSettings.fulfilled, (state, action) => {
                state.status = "getSyncSettings succeeded";
                state.loading = false;
                state.syncSettingsData = {
                    focus_username: action.payload.focus_username,
                    focus_password: action.payload.focus_password,
                    focus_base_url: action.payload.focus_base_url,
                    focus_companycode: action.payload.focus_companycode,
                    focus_sync_on: action.payload.focus_sync_on,
                    amcu_username: action.payload.amcu_username,
                    amcu_password: action.payload.amcu_password,
                    amcu_baseurl: action.payload.amcu_baseurl,
                    amcu_api_key: action.payload.amcu_api_key,
                    amcu_sync_on: action.payload.amcu_sync_on,
                    enable_auto_sync: action.payload.enable_auto_sync,
                    amcu_enable_auto_sync: action.payload.amcu_enable_auto_sync,
                }
            })
            .addCase(getSyncSettings.rejected, (state, action) => {
                state.status = "getSyncSettings failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(syncSettingsAdd.pending, (state, action) => {
                state.loading = true;
                state.status = "SyncSettingsAdd pending";
            })
            .addCase(syncSettingsAdd.fulfilled, (state, action) => {
                state.status = "SyncSettingsAdd succeeded";
                state.loading = false;
            })
            .addCase(syncSettingsAdd.rejected, (state, action) => {
                state.status = "SyncSettingsAdd failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })

    },
});

// Action creators are generated for each case reducer function
export const { setSyncParams,
    setSyncValue,
    setOpenModel,
    setSyncTypeName,
    InputChangeValue } =
    synchronizationSlice.actions;

export const synchronizationSelector = (state: RootState) =>
    state.settings.synchronization;

export default synchronizationSlice.reducer;
