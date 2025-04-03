import { createSlice } from "@reduxjs/toolkit";
import { ScheduleReportsInitialState } from "./schedulereports.types";
import {
    getScheduleReports, startDeleteScheduleReportById
} from "./schedulereports.action";
import { RootState } from "@src/store/store";

const initialState: ScheduleReportsInitialState = {
    error: "",
    status: "",
    loading: false,
    listCount: 0,
    drawer: false,
    scheduleReports: [],
    pageParams: {
        no_of_pages: 0,
        page_size: 10,
        page: 1,
        search: "",
    },

};

const schedlueReportsSlice = createSlice({
    name: "scheduleReport",
    initialState,
    reducers: {
        changeParams: (state, action) => {
            state.pageParams = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getScheduleReports.pending, (state, action) => {
                state.status = "getScheduleReports loading";
                state.loading = true;
            })
            .addCase(getScheduleReports.fulfilled, (state, action) => {
                const { response, params } = action.payload;
                state.status = "getScheduleReports succeeded";
                state.loading = false;
                state.listCount = response.count;
                state.scheduleReports = response.results;
            })
            .addCase(getScheduleReports.rejected, (state, action) => {
                state.status = "getScheduleReports failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(startDeleteScheduleReportById.pending, (state, action) => {
                state.status = "startDeleteScheduleReportById loading";
                state.loading = true;
            })
            .addCase(startDeleteScheduleReportById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "startDeleteScheduleReportById succeeded";
            })
            .addCase(startDeleteScheduleReportById.rejected, (state, action) => {
                state.status = "startDeleteScheduleReportById failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
    },
});

// Action creators are generated for each case reducer function
export const { changeParams } =
schedlueReportsSlice.actions;

export const schedlueReportsSelector = (state: RootState) =>
    state.settings.schedlueReport;

export default schedlueReportsSlice.reducer;
