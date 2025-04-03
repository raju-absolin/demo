import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { TenderItemMasterInitialState } from "./tenderItems.types";
import {
	editTenderItem,
	getTenderItemById,
	getTenderItems,
	postTenderItem,
} from "./tenderItems.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { tendersSelectors } from "../tenders/tenders.slice";

const initialState: TenderItemMasterInitialState = {
	loading: false,
	status: "",
	error: "",
	tenderItemsList: [],
	tenderItemsCount: 0,
	selectedData: {},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

const tendersItemsSlice = createSlice({
	name: "system",
	initialState,
	reducers: {
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
			.addCase(getTenderItems.pending, (state, action) => {
				state.status = "getTenderItems pending";
				state.loading = true;
			})
			.addCase(getTenderItems.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getTenderItems succeeded";
				state.loading = false;
				state.tenderItemsList = response.results;
				state.tenderItemsCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getTenderItems.rejected, (state, action) => {
				state.status = "getTenderItems failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getTenderItemById.pending, (state, action) => {
				state.status = "getTenderItemById pending";
				state.loading = true;
			})
			.addCase(getTenderItemById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getTenderItemById succeeded";
				state.loading = false;
				state.selectedData = response;
			})
			.addCase(getTenderItemById.rejected, (state, action) => {
				state.status = "getTenderItemById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postTenderItem.pending, (state, action) => {
				state.status = "postTenderItem pending";
				state.loading = true;
			})
			.addCase(postTenderItem.fulfilled, (state, action) => {
				state.status = "postTenderItem succeeded";
				state.loading = false;
			})
			.addCase(postTenderItem.rejected, (state, action) => {
				state.status = "postTenderItem failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editTenderItem.pending, (state, action) => {
				state.status = "editTenderItem pending";
				state.loading = true;
			})
			.addCase(editTenderItem.fulfilled, (state, action) => {
				state.status = "editTenderItem succeeded";
				state.loading = false;
			})
			.addCase(editTenderItem.rejected, (state, action) => {
				state.status = "editTenderItem failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const { setSelectedData, setIsFilterOpen, setPageParams } =
	tendersItemsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const tendersItemsSelectors = (state: RootState) =>
	state.tenderManagement.tenders;

// Memoized selector
export const selectTenderItems = createSelector(
	[
		tendersItemsSelectors,
		tendersSelectors,
		systemSelector,
		selectManageGroups,
		miniSelector,
	],
	(tendersItems, tenders, system, groups, mini) => ({
		tendersItems,
		tenders,
		system,
		groups,
		mini,
	})
);

export default tendersItemsSlice.reducer;
