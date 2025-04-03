import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getReportList, startPostScheduleReport } from "./reports.actions";
import { ReportsState } from "./reports.types";
import { RootState } from "../store";
import { systemSelector } from "../system/system.slice";
import { miniSelector } from "../mini/mini.Slice";

// Define the initial state using the ReportsState type
const initialState: ReportsState = {
	show: false,
	reportsItemsList: [],
	reportDataList: [],
	reportsDataCount: 0,
	modelName: "",
	columnsList: [],
	reportView: false,
	error: "",
	status: "",
	loading: false,
	scheduleLoading: false,
	scheduleReports: {
		scheduleCount: 0,
		getScheduleReportsData: {},
		getScheduleReportsSuccessData: [],
	},
	pageParams: {
		ParamsData: {
			start_date: "",
			end_date: "",
			no_of_pages: 0,
			page_size: 10,
			page: 1,
			search: "",
		},
		objData: {
			file_format: 5,
			model_name: "",
		},
	},
};

const reportsSlice = createSlice({
	name: "reports",
	initialState,
	reducers: {
		clearData: (state) => {
			return initialState;
		},
		changeParams: (state, action: PayloadAction<any>) => {
			return {
				...state,
				pageParams: action.payload,
			};
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(getReportList.pending, (state) => {
				state.status = "getReportList loading";
				state.loading = true;
			})
			.addCase(
				getReportList.fulfilled,
				(
					state,
					action: PayloadAction<{
						response: { results: any[]; count: number };
						params: {};
					}>
				) => {
					let columns: string[] = [];
					if (action.payload.response?.results.length > 0) {
						columns = Object.keys(
							action.payload.response.results[0]
						);
					}
					return {
						...state,
						status: "getReportList succeeded",
						reportDataList: action.payload.response.results,
						reportsDataCount: action.payload.response.count,
						columnsList: columns?.map((e) => ({
							title: e,
							width: 200,
						})),
						loading: false,
						reportView: true,
						pageParams: {
							...state.pageParams,
							...action.payload.params,
						},
					};
				}
			)
			.addCase(getReportList.rejected, (state, action) => {
				state.status = "getReportList failed";
				state.loading = false;
				state.error = action.error.message || "";
			})
			.addCase(startPostScheduleReport.pending, (state) => {
				state.status = "startPostScheduleReport loading";
				state.loading = true;
			})
			.addCase(
				startPostScheduleReport.fulfilled,
				(state, action: PayloadAction<any>) => {
					state.status = "startPostScheduleReport succeeded";
					state.loading = false;
					state.scheduleReports = {
						...state.scheduleReports,
						getScheduleReportsSuccessData: [
							action.payload,
							...state.scheduleReports
								.getScheduleReportsSuccessData,
						],
					};
				}
			)
			.addCase(startPostScheduleReport.rejected, (state, action) => {
				state.status = "startPostScheduleReport failed";
				state.loading = false;
				state.error = action.error.message || "";
			});
	},
});

// Action creators are generated for each case reducer function
export const { clearData, changeParams } = reportsSlice.actions;

export const reportSelector = (state: RootState) => state.reports;

// Memoized selector
export const selectReports = createSelector(
	[reportSelector, systemSelector, miniSelector],
	(reports, system, mini) => {
		return {
			reports,
			system,
			mini,
		};
	}
);

export default reportsSlice.reducer;
