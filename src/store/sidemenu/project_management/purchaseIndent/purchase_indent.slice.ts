import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";

import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { PiItem, PurchaseIndentState } from "./purchase_indent.types";
import {
	editPurchaseIndent,
	getPurchaseIndent,
	postPurchaseIndent,
	getPurchaseIndentById,
	getPurchaseIndentItems,
} from "./purchase_indent.action";
import State from "@src/pages/masters/State";

const initialState: PurchaseIndentState = {
	loading: false,
	status: "",
	error: "",
	list: [],
	count: 0,
	selectedData: {},
	isFilterOpen: false,
	purchase_indent_items: {
		list: [],
		loading: false,
		count: 0,
		miniParams: {
			no_of_pages: 0,
			page_size: 10,
			page: 1,
			search: "",
			purchaseindent__project: "",
		},
	},
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

const purchaseIndentSlice = createSlice({
	name: "purchaseIndent",
	initialState,
	reducers: {
		isModalOpen: (state, action) => {
			return {
				...state,
				modal: action.payload,
			};
		},
		isVendorsModalOpen: (state, action) => {
			return {
				...state,
				vendorsModal: action.payload.open,
				item: action.payload.item,
				selectedVendors: action.payload.vendors,
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
		clearPurchaseIndentItems: (state, action) => {
			return {
				...state,
				purchase_indent_items: initialState.purchase_indent_items,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getPurchaseIndent.pending, (state, action) => {
				state.status = "getPurchaseIndent pending";
				state.loading = true;
			})
			.addCase(getPurchaseIndent.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getPurchaseIndent succeeded";
				state.loading = false;
				state.list = response.results;
				state.count = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getPurchaseIndent.rejected, (state, action) => {
				state.status = "getPurchaseIndent failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getPurchaseIndentById.pending, (state, action) => {
				state.status = "getPurchaseIndentById pending";
				state.loading = true;
			})
			.addCase(getPurchaseIndentById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getPurchaseIndentById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					location: {
						...response.location,
						label: response.location.name,
						value: response.location.id,
					},
					warehouse: {
						...response.warehouse,
						label: response.warehouse.name,
						value: response.warehouse.id,
					},
					piitems: response?.piitems?.map((item: PiItem) => {
						return {
							...item,
							item: {
								...item.item,
								label: item?.item?.name,
								value: item?.item?.id,
							},
							unit: {
								...item.unit,
								label: item?.unit?.name,
								value: item?.unit?.id,
							},
							make: {
								...item.make,
								label: item.make.name,
								value: item.make.id,
							},
						};
					}),
				};
			})
			.addCase(getPurchaseIndentById.rejected, (state, action) => {
				state.status = "getPurchaseIndentById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postPurchaseIndent.pending, (state, action) => {
				state.status = "postPurchaseIndent pending";
				state.loading = true;
			})
			.addCase(postPurchaseIndent.fulfilled, (state, action) => {
				state.status = "postPurchaseIndent succeeded";
				state.loading = false;
			})
			.addCase(postPurchaseIndent.rejected, (state, action) => {
				state.status = "postPurchaseIndent failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editPurchaseIndent.pending, (state, action) => {
				state.status = "editPurchaseIndent pending";
				state.loading = true;
			})
			.addCase(editPurchaseIndent.fulfilled, (state, action) => {
				state.status = "editPurchaseIndent succeeded";
				state.loading = false;
			})
			.addCase(editPurchaseIndent.rejected, (state, action) => {
				state.status = "editPurchaseIndent failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//get Purchase Indent Items
			.addCase(getPurchaseIndentItems.pending, (state, action) => {
				state.status = "getPurchaseIndentItems loading";
				state.purchase_indent_items.loading = true;
			})
			.addCase(getPurchaseIndentItems.fulfilled, (state, action) => {
				state.status = "getPurchaseIndentItems succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.purchase_indent_items.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.purchase_indent_items.miniParams?.page_size
				);
				state.purchase_indent_items = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.purchase_indent_items.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getPurchaseIndentItems.rejected, (state, action) => {
				state.status = "getPurchaseIndentItems failed";
				state.purchase_indent_items.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	isModalOpen,
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	isVendorsModalOpen,
	clearPurchaseIndentItems,
} = purchaseIndentSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const purchaseIndentSelector = (state: RootState) =>
	state.projectManagement.purchaseIndent;

// Memoized selector
export const selectIndent = createSelector(
	[purchaseIndentSelector, systemSelector, selectManageGroups, miniSelector],
	(purchaseIndent, system, groups, mini) => ({
		purchaseIndent,
		system,
		groups,
		mini,
	})
);

export default purchaseIndentSlice.reducer;
