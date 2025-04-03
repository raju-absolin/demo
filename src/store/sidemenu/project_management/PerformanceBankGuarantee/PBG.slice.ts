import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState, useAppDispatch } from "@src/store/store";

import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

import { purchaseIndentSelector } from "../purchaseIndent/purchase_indent.slice";
import { PerformanceBankGuaranteeState } from "./PBG.types";
import {
	editProjectPerformanceBankGuarantees,
	getProjectPerformanceBankGuarantees,
	getProjectPerformanceBankGuaranteesById,
	postPerformanceBankGuaranteeMembers,
} from "./PBG.action";
import { workOrdersSelectors } from "../work_order/work_order.slice";

const initialState: PerformanceBankGuaranteeState = {
	loading: false,
	status: "",
	error: "",
	list: [],
	count: 0,
	attachments: [],
	selectedData: {},
	modal: false,
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
		project: "",
	},
	view_modal: false
};

const performanceBankGuaranteeSlice = createSlice({
	name: "performanceBankGuarantee",
	initialState,
	reducers: {
		updateProjectPerformanceBankGuaranteesState: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
		isModalOpen: (state, action) => {
			return {
				...state,
				modal: action.payload,
			};
		},
		isViewModalOpen: (state, action) => {
			return {
				...state,
				view_modal: action.payload,
			};
		},
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
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
		setAttachments: (state, action) => {
			return {
				...state,
				attachments: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(
				getProjectPerformanceBankGuarantees.pending,
				(state, action) => {
					state.status =
						"getProjectPerformanceBankGuarantees pending";
					state.loading = true;
				}
			)
			.addCase(
				getProjectPerformanceBankGuarantees.fulfilled,
				(state, action) => {
					const { response, params } = action.payload;
					state.status =
						"getProjectPerformanceBankGuarantees succeeded";
					state.loading = false;
					state.list = response.results;
					state.count = response.count;
					var noofpages = Math.ceil(
						response.count / params.page_size
					);
					state.pageParams = {
						...state.pageParams,
						...params,
						no_of_pages: noofpages,
					};
				}
			)
			.addCase(
				getProjectPerformanceBankGuarantees.rejected,
				(state, action) => {
					state.status = "getProjectPerformanceBankGuarantees failed";
					state.loading = false;
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			)
			.addCase(
				getProjectPerformanceBankGuaranteesById.pending,
				(state, action) => {
					state.status =
						"getProjectPerformanceBankGuaranteesById pending";
					state.loading = true;
				}
			)
			.addCase(
				getProjectPerformanceBankGuaranteesById.fulfilled,
				(state, action) => {
					const { response }: any = action.payload;
					state.status =
						"getProjectPerformanceBankGuaranteesById succeeded";
					state.loading = false;
					state.selectedData = {
						...response,
					};
				}
			)
			.addCase(
				getProjectPerformanceBankGuaranteesById.rejected,
				(state, action) => {
					state.status =
						"getProjectPerformanceBankGuaranteesById failed";
					state.loading = false;
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			)
			//post Data
			.addCase(
				postPerformanceBankGuaranteeMembers.pending,
				(state, action) => {
					state.status =
						"postPerformanceBankGuaranteeMembers pending";
					state.loading = true;
				}
			)
			.addCase(
				postPerformanceBankGuaranteeMembers.fulfilled,
				(state, action) => {
					state.status =
						"postPerformanceBankGuaranteeMembers succeeded";
					state.loading = false;
				}
			)
			.addCase(
				postPerformanceBankGuaranteeMembers.rejected,
				(state, action) => {
					state.status = "postPerformanceBankGuaranteeMembers failed";
					state.loading = false;
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			)
			//edit Data
			.addCase(
				editProjectPerformanceBankGuarantees.pending,
				(state, action) => {
					state.status =
						"editProjectPerformanceBankGuarantees pending";
					state.loading = true;
				}
			)
			.addCase(
				editProjectPerformanceBankGuarantees.fulfilled,
				(state, action) => {
					state.status =
						"editProjectPerformanceBankGuarantees succeeded";
					state.loading = false;
				}
			)
			.addCase(
				editProjectPerformanceBankGuarantees.rejected,
				(state, action) => {
					state.status =
						"editProjectPerformanceBankGuarantees failed";
					state.loading = false;
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			);
	},
});

// Action creators are generated for each case reducer function
export const {
	isModalOpen,
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	updateProjectPerformanceBankGuaranteesState,
	setAttachments,
	isViewModalOpen
} = performanceBankGuaranteeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const performanceBankGuaranteeSelector = (state: RootState) =>
	state.projectManagement.performanceBankGuarantee;

// Memoized selector
export const selectPerformanceBankGuarantees = createSelector(
	[
		performanceBankGuaranteeSelector,
		workOrdersSelectors,
		systemSelector,
		selectManageGroups,
		miniSelector,
	],
	(performanceBankGuarantee, workOrder, system, groups, mini) => ({
		performanceBankGuarantee,
		workOrder,
		system,
		groups,
		mini,
	})
);

export default performanceBankGuaranteeSlice.reducer;
