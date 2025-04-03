import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";

import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { TenderValueState } from "./tender_value.types";
import {
	editTenderValue,
	getTenderValue,
	postTenderValue,
} from "./tender_value.action";
import { tendersSelectors } from "../tenders/tenders.slice";

const initialState: TenderValueState = {
	loading: false,
	status: "",
	error: "",
	itemsList: [],
	itemsCount: 0,
	modal: false,
	selectedData: {},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

const tenderValueSlice = createSlice({
	name: "tenderValue",
	initialState,
	reducers: {
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
	},
	extraReducers(builder) {
		builder
			.addCase(getTenderValue.pending, (state, action) => {
				state.status = "getTenderValue pending";
				state.loading = true;
			})
			.addCase(getTenderValue.fulfilled, (state, action) => {
				const { response, params }: any = action.payload;
				state.status = "getTenderValue succeeded";
				state.loading = false;
				state.itemsList = response;
				state.itemsCount = response.count;
				state.itemsList = response.results
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getTenderValue.rejected, (state, action) => {
				state.status = "getTenderValue failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// .addCase(getTenderById.pending, (state, action) => {
			// 	state.status = "getTenderById pending";
			// 	state.loading = true;
			// })
			// .addCase(getTenderById.fulfilled, (state, action) => {
			// 	const { response } = action.payload;
			// 	state.status = "getTenderById succeeded";
			// 	state.loading = false;
			// 	state.selectedData = {
			// 		...response,
			// 		department: response.department_name,
			// 		project: {
			// 			name: response.project.name,
			// 			id: response.project.id,
			// 		},
			// 		tender_type: {
			// 			name: response.tender_type_name,
			// 			id: response.tender_type,
			// 		},
			// 		tendernature: {
			// 			name: response.tendernature.name,
			// 			id: response.tendernature.id,
			// 		},
			// 		tender_items: response.tender_items.map((e) => {
			// 			return {
			// 				...e,
			// 				tenderitemmaster: {
			// 					...e.tenderitemmaster,
			// 					label: e.tenderitemmaster.name,
			// 					value: e.tenderitemmaster.id,
			// 				},
			// 				dodelete: false,
			// 			};
			// 		}),
			// 	};
			// })
			// .addCase(getTenderById.rejected, (state, action) => {
			// 	state.status = "getTenderById failed";
			// 	state.loading = false;
			// 	state.error =
			// 		action.error?.message || "An unknown error occurred";
			// })
			//post Data
			.addCase(postTenderValue.pending, (state, action) => {
				state.status = "postTenderValue pending";
				state.loading = true;
			})
			.addCase(postTenderValue.fulfilled, (state, action) => {
				state.status = "postTenderValue succeeded";
				state.loading = false;
			})
			.addCase(postTenderValue.rejected, (state, action) => {
				state.status = "postTenderValue failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editTenderValue.pending, (state, action) => {
				state.status = "editTenderValue pending";
				state.loading = true;
			})
			.addCase(editTenderValue.fulfilled, (state, action) => {
				state.status = "editTenderValue succeeded";
				state.loading = false;
			})
			.addCase(editTenderValue.rejected, (state, action) => {
				state.status = "editTenderValue failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const { isModalOpen, setSelectedData, setIsFilterOpen, setPageParams } =
	tenderValueSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const tenderValueSelector = (state: RootState) =>
	state.tenderManagement.tenderValue;

// Memoized selector
export const selectTenderValue = createSelector(
	[
		tenderValueSelector,
		tendersSelectors,
		systemSelector,
		selectManageGroups,
		miniSelector,
	],
	(tenderValue, tenders, system, groups, mini) => ({
		tenderValue,
		tenders,
		system,
		groups,
		mini,
	})
);

export default tenderValueSlice.reducer;
