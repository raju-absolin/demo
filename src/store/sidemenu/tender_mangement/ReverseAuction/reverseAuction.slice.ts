import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { ReverseAuctionInitialState } from "./reverseAuction.types";
import {
	editReverseAuction,
	getReverseAuctionById,
	getReverseAuctions,
	getTenderById,
	postReverseAuction,
} from "./reverseAuction.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { tendersSelectors } from "../tenders/tenders.slice";

const initialState: ReverseAuctionInitialState = {
	loading: false,
	status: "",
	error: "",
	reverseAuctionList: [],
	reverseAuctionCount: 0,
	selectedData: {
		landing_cost: "",
		discount_landing_cost: "",
		landing_cost_margin: "",
		landing_cost_margin_amount: "",
		landing_cost_total: "",
		landing_cost_gst: "",
		landing_cost_gst_amount: "",
		total: "",
		l1_price: "",
		diff_amount: "",
		created_on: "", // Assuming this is a date
	},
	isFilterOpen: false,
	openEditModal: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	tenderItems: [],
};

const reverseAuctionSlice = createSlice({
	name: "purchaseQuatation",
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
		setIsEditModalOpen: (state, action) => {
			return {
				...state,
				openEditModal: action.payload,
			};
		},
		setPageParams: (state, action) => {
			return {
				...state,
				pageParams: action.payload,
			};
		},
		setTenderItems: (state, action) => {
			return {
				...state,
				tenderItems: action.payload,
			};
		},
		setReverseActionItems: (state, action) => {
			return {
				...state,
				reverse_auctionItems: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getReverseAuctions.pending, (state, action) => {
				state.status = "getReverseAuctions pending";
				state.loading = true;
			})
			.addCase(getReverseAuctions.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getReverseAuctions succeeded";
				state.loading = false;
				state.reverseAuctionList = response.results;
				state.reverseAuctionCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getReverseAuctions.rejected, (state, action) => {
				state.status = "getReverseAuctions failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getReverseAuctionById.pending, (state, action) => {
				state.status = "getReverseAuctionById pending";
				state.loading = true;
			})
			.addCase(getReverseAuctionById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getReverseAuctionById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
				};
			})
			.addCase(getReverseAuctionById.rejected, (state, action) => {
				state.status = "getReverseAuctionById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getTenderById.pending, (state, action) => {
				state.status = "getTenderById pending";
				state.loading = true;
			})
			.addCase(getTenderById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getTenderById succeeded";
				state.loading = false;
				state.tenderItems = response.tender_items
					? response.tender_items
					: [];
			})
			.addCase(getTenderById.rejected, (state, action) => {
				state.status = "getTenderById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postReverseAuction.pending, (state, action) => {
				state.status = "postReverseAuction pending";
				state.loading = true;
			})
			.addCase(postReverseAuction.fulfilled, (state, action) => {
				state.status = "postReverseAuction succeeded";
				state.loading = false;
			})
			.addCase(postReverseAuction.rejected, (state, action) => {
				state.status = "postReverseAuction failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editReverseAuction.pending, (state, action) => {
				state.status = "editReverseAuction pending";
				state.loading = true;
			})
			.addCase(editReverseAuction.fulfilled, (state, action) => {
				state.status = "editReverseAuction succeeded";
				state.loading = false;
			})
			.addCase(editReverseAuction.rejected, (state, action) => {
				state.status = "editReverseAuction failed";
				state.loading = false;
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
	setTenderItems,
	setIsEditModalOpen,setReverseActionItems
} = reverseAuctionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const reverseAuctionSelectors = (state: RootState) =>
	state.tenderManagement.reverseAuction;

// Memoized selector
export const selectReverseAuctions = createSelector(
	[reverseAuctionSelectors, tendersSelectors, systemSelector, miniSelector],
	(reverseAuction, tenders, system, mini) => ({
		reverseAuction,
		tenders,
		system,
		mini,
	})
);

export default reverseAuctionSlice.reducer;
