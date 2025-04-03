import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState, useAppDispatch } from "@src/store/store";

import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

import { purchaseIndentSelector } from "../purchaseIndent/purchase_indent.slice";
import { ExtendedEndDateState } from "./EED.types";
import {
	getProjectExtendedEndDates,
	// editProjectExtendedEndDates,
	// getProjectExtendedEndDatesById,
	postExtendedEndDateMembers,
} from "./EED.action";
import { workOrdersSelectors } from "../work_order/work_order.slice";

const initialState: ExtendedEndDateState = {
	loading: false,
	status: "",
	error: "",
	list: [],
	attachments: [],
	count: 0,
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
};

const extendedEndDateSlice = createSlice({
	name: "extendedEndDate",
	initialState,
	reducers: {
		updateProjectExtendedEndDatesState: (state, action) => {
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
			.addCase(getProjectExtendedEndDates.pending, (state, action) => {
				state.status = "getProjectExtendedEndDates pending";
				state.loading = true;
			})
			.addCase(getProjectExtendedEndDates.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getProjectExtendedEndDates succeeded";
				state.loading = false;
				state.list = response.results;
				state.count = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.attachments = [];
			})
			.addCase(getProjectExtendedEndDates.rejected, (state, action) => {
				state.status = "getProjectExtendedEndDates failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// .addCase(
			// 	getProjectExtendedEndDatesById.pending,
			// 	(state, action) => {
			// 		state.status = "getProjectExtendedEndDatesById pending";
			// 		state.loading = true;
			// 	}
			// )
			// .addCase(
			// 	getProjectExtendedEndDatesById.fulfilled,
			// 	(state, action) => {
			// 		const { response }: any = action.payload;
			// 		state.status = "getProjectExtendedEndDatesById succeeded";
			// 		state.loading = false;
			// 		state.selectedData = {
			// 			...response,
			// 		};
			// 	}
			// )
			// .addCase(
			// 	getProjectExtendedEndDatesById.rejected,
			// 	(state, action) => {
			// 		state.status = "getProjectExtendedEndDatesById failed";
			// 		state.loading = false;
			// 		state.error =
			// 			action.error?.message || "An unknown error occurred";
			// 	}
			// )
			//post Data
			.addCase(postExtendedEndDateMembers.pending, (state, action) => {
				state.status = "postExtendedEndDateMembers pending";
				state.loading = true;
			})
			.addCase(postExtendedEndDateMembers.fulfilled, (state, action) => {
				state.status = "postExtendedEndDateMembers succeeded";
				state.loading = false;
			})
			.addCase(postExtendedEndDateMembers.rejected, (state, action) => {
				state.status = "postExtendedEndDateMembers failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
		//edit Data
		// .addCase(editProjectExtendedEndDates.pending, (state, action) => {
		// 	state.status = "editProjectExtendedEndDates pending";
		// 	state.loading = true;
		// })
		// .addCase(editProjectExtendedEndDates.fulfilled, (state, action) => {
		// 	state.status = "editProjectExtendedEndDates succeeded";
		// 	state.loading = false;
		// })
		// .addCase(editProjectExtendedEndDates.rejected, (state, action) => {
		// 	state.status = "editProjectExtendedEndDates failed";
		// 	state.loading = false;
		// 	state.error =
		// 		action.error?.message || "An unknown error occurred";
		// });
	},
});

// Action creators are generated for each case reducer function
export const {
	isModalOpen,
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	updateProjectExtendedEndDatesState,
	setAttachments,
} = extendedEndDateSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const extendedEndDateSelector = (state: RootState) =>
	state.projectManagement.extendedEndDate;

// Memoized selector
export const selectExtendedEndDates = createSelector(
	[
		extendedEndDateSelector,
		workOrdersSelectors,
		systemSelector,
		selectManageGroups,
		miniSelector,
	],
	(extendedEndDate, workOrder, system, groups, mini) => ({
		extendedEndDate,
		workOrder,
		system,
		groups,
		mini,
	})
);

export default extendedEndDateSlice.reducer;
