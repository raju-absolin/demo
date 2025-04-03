import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@src/store/store";
import { BidingItemsState } from "./biding_items.types";
import { editItemData, getItems, postItemData } from "./biding_items.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: BidingItemsState = {
	loading: false,
	status: "",
	error: "",
	itemsList: [],
	itemsCount: 0,
	modal: false,
	selectedData: {
		name: "",
	},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

const bidingItemsSlice = createSlice({
	name: "bidingItems",
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
			.addCase(getItems.pending, (state, action) => {
				state.status = "getItems pending";
				state.loading = true;
			})
			.addCase(getItems.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getItems succeeded";
				state.loading = false;
				state.itemsList = response.results;
				state.itemsCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);

				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getItems.rejected, (state, action) => {
				state.status = "getItems failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postItemData.pending, (state, action) => {
				state.status = "postItemData pending";
				state.loading = true;
			})
			.addCase(postItemData.fulfilled, (state, action) => {
				state.status = "postItemData succeeded";
				state.loading = false;
			})
			.addCase(postItemData.rejected, (state, action) => {
				state.status = "postItemData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editItemData.pending, (state, action) => {
				state.status = "editItemData pending";
				state.loading = true;
			})
			.addCase(editItemData.fulfilled, (state, action) => {
				state.status = "editItemData succeeded";
				state.loading = false;
			})
			.addCase(editItemData.rejected, (state, action) => {
				state.status = "editItemData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const { isModalOpen, setSelectedData, setIsFilterOpen, setPageParams } =
	bidingItemsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const bidingItemSelector = (state: RootState) =>
	state.tenderManagement.bidingItems;

export const memoBidItems = createSelector(
	[bidingItemSelector, systemSelector, miniSelector],
	(bidingItems, system, mini) => ({
		bidingItems,
		system,
		mini,
	})
);

export const useBidItemsSelector = () => {
	const selectors = useAppSelector((state) => memoBidItems(state));
	return selectors;
};

export default bidingItemsSlice.reducer;
