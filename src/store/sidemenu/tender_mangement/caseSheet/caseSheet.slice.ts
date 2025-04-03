import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { CaseSheetInitialState } from "./caseSheet.types";
import {
	ApproveCaseSheet,
	editCaseSheet,
	getCaseSheetById,
	getCaseSheets,
	postCaseSheet,
	RejectCasesheet,
} from "./caseSheet.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { tendersSelectors } from "../tenders/tenders.slice";

const initialState: CaseSheetInitialState = {
	loading: false,
	status: "",
	error: "",
	approve_loading: false,
	reject_loading: false,
	caseSheetList: [],
	caseSheetCount: 0,
	selectedData: {},
	approve_or_reject_modal: false,
	dailouge_name: "",
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

const caseSheetSlice = createSlice({
	name: "caseSheet",
	initialState,
	reducers: {
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
			};
		},
		setApprove_or_reject_modal: (state, action) => {
			return {
				...state,
				approve_or_reject_modal: action.payload.isOpen,
				dailouge_name: action.payload.dailouge_name,
				selectedData: {
					...action.payload.caseSheet,
				},
			};
		},
		setIsFilterOpen: (state, action) => {
			return {
				...state,
				isFilterOpen: action.payload,
			};
		},
		setPageParams: (state, action) => {
			return {
				...state,
				pageParams: action.payload,
			};
		},
		setCaseSheet: (state, action) => {
			return {
				...state,
				comment: action.payload,
			};
		},
		openCaseSheetModal: (state, action) => {
			return {
				...state,
				commentModal: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getCaseSheets.pending, (state, action) => {
				state.status = "getCaseSheets pending";
				state.loading = true;
			})
			.addCase(getCaseSheets.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getCaseSheets succeeded";
				state.loading = false;
				state.caseSheetList = response.results;
				state.caseSheetCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getCaseSheets.rejected, (state, action) => {
				state.status = "getCaseSheets failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getCaseSheetById.pending, (state, action) => {
				state.status = "getCaseSheetById pending";
				state.loading = true;
			})
			.addCase(getCaseSheetById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getCaseSheetById succeeded";
				state.loading = false;
				state.selectedData = response;
			})
			.addCase(getCaseSheetById.rejected, (state, action) => {
				state.status = "getCaseSheetById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postCaseSheet.pending, (state, action) => {
				state.status = "postCaseSheet pending";
				state.loading = true;
			})
			.addCase(postCaseSheet.fulfilled, (state, action) => {
				state.status = "postCaseSheet succeeded";
				state.loading = false;
			})
			.addCase(postCaseSheet.rejected, (state, action) => {
				state.status = "postCaseSheet failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editCaseSheet.pending, (state, action) => {
				state.status = "editCaseSheet pending";
				state.loading = true;
			})
			.addCase(editCaseSheet.fulfilled, (state, action) => {
				state.status = "editCaseSheet succeeded";
				state.loading = false;
			})
			.addCase(editCaseSheet.rejected, (state, action) => {
				state.status = "editCaseSheet failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(ApproveCaseSheet.pending, (state, action) => {
				state.status = "ApproveCaseSheet pending";
				state.approve_loading = true;
			})
			.addCase(ApproveCaseSheet.fulfilled, (state, action) => {
				state.status = "ApproveCaseSheet succeeded";
				state.approve_loading = false;
			})
			.addCase(ApproveCaseSheet.rejected, (state, action) => {
				state.status = "ApproveCaseSheet failed";
				state.approve_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(RejectCasesheet.pending, (state, action) => {
				state.status = "RejectCasesheet pending";
				state.reject_loading = true;
			})
			.addCase(RejectCasesheet.fulfilled, (state, action) => {
				state.status = "RejectCasesheet succeeded";
				state.reject_loading = false;
			})
			.addCase(RejectCasesheet.rejected, (state, action) => {
				state.status = "RejectCasesheet failed";
				state.reject_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	setCaseSheet,
	openCaseSheetModal,
	setApprove_or_reject_modal,
} = caseSheetSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const caseSheetSelectors = (state: RootState) =>
	state.tenderManagement.casesheet;

// Memoized selector
export const selectCaseSheets = createSelector(
	[caseSheetSelectors, tendersSelectors, systemSelector, miniSelector],
	(caseSheet, tenders, system, mini) => ({
		caseSheet,
		tenders,
		system,
		mini,
	})
);

export default caseSheetSlice.reducer;
