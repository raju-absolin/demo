import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState, useAppDispatch } from "@src/store/store";

import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { PQItem, PurchaseEnquiryState, Vendor } from "./purchase_enquiry.types";
import {
	editPurchaseEnquiry,
	getPurchaseEnquiry,
	getPurchaseEnquiryById,
	getVendorsByItems,
	postPurchaseEnquiry,
} from "./purchase_enquiry.action";
import {
	PiItem,
	PurchaseIndent,
} from "../purchaseIndent/purchase_indent.types";
import { purchaseIndentSelector } from "../purchaseIndent/purchase_indent.slice";

const initialState: PurchaseEnquiryState = {
	loading: false,
	status: "",
	error: "",
	itemsList: [],
	itemsCount: 0,
	modal: false,
	vendorsModal: false,
	showAddItem: false,
	item: {},
	selectedData: {},
	selectedVendors: [],
	selectedPIitems: [],
	isFilterOpen: false,
	piItemModalOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	vendorsAganistItems: {
		list: [],
		loading: false,
		count: 0,
		miniParams: {
			no_of_pages: 0,
			page_size: 10,
			page: 1,
			search: "",
		},
	},
};

const purchaseEnquirySlice = createSlice({
	name: "purchaseEnquiry",
	initialState,
	reducers: {
		setShowAddItem: (state, action) => {
			return {
				...state,
				showAddItem: action.payload,
			};
		},
		updatePurchaseEnquiryState: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
		updatePIItems: (state, action) => {
			return {
				...state,
				selectedPIitems: action.payload,
			};
		},
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
		clearVendorsAganistItems: (state, action) => {
			return {
				...state,
				vendorsAganistItems: initialState.vendorsAganistItems,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getPurchaseEnquiry.pending, (state, action) => {
				state.status = "getPurchaseEnquiry pending";
				state.loading = true;
			})
			.addCase(getPurchaseEnquiry.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getPurchaseEnquiry succeeded";
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
			.addCase(getPurchaseEnquiry.rejected, (state, action) => {
				state.status = "getPurchaseEnquiry failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getPurchaseEnquiryById.pending, (state, action) => {
				state.status = "getPurchaseEnquiryById pending";
				state.loading = true;
			})
			.addCase(getPurchaseEnquiryById.fulfilled, (state, action) => {
				const { response }: any = action.payload;

				state.status = "getPurchaseEnquiryById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					pqitems: response?.pqitems?.map((item: PQItem) => {
						return {
							...item,
							item: {
								...item.item,
								label: item.item.name,
								value: item.item.id,
							},
							unit: {
								...item.unit,
								label: item.unit.name,
								value: item.unit.id,
							},
							make: {
								...item?.make,
								label: item?.make?.name,
								value: item?.make?.id,
							},
							peipiis: item.peipiis.map((e: any) => {
								return {
									...e,
									qty: e.quantity,
									unit: e.unit,
									p_indent: e?.p_indent?.id,
									pi_item: e?.pi_item,
									dodelete: false,
								};
							}),
						};
					}),
					vendors: response.vendors?.map((e: Vendor) => {
						return {
							...e,
							label: e.name,
							value: e.id,
						};
					}),
				};
			})
			.addCase(getPurchaseEnquiryById.rejected, (state, action) => {
				state.status = "getPurchaseEnquiryById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postPurchaseEnquiry.pending, (state, action) => {
				state.status = "postPurchaseEnquiry pending";
				state.loading = true;
			})
			.addCase(postPurchaseEnquiry.fulfilled, (state, action) => {
				state.status = "postPurchaseEnquiry succeeded";
				state.loading = false;
			})
			.addCase(postPurchaseEnquiry.rejected, (state, action) => {
				state.status = "postPurchaseEnquiry failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editPurchaseEnquiry.pending, (state, action) => {
				state.status = "editPurchaseEnquiry pending";
				state.loading = true;
			})
			.addCase(editPurchaseEnquiry.fulfilled, (state, action) => {
				state.status = "editPurchaseEnquiry succeeded";
				state.loading = false;
			})
			.addCase(editPurchaseEnquiry.rejected, (state, action) => {
				state.status = "editPurchaseEnquiry failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getVendorsByItems.pending, (state, action) => {
				state.status = "getVendorsByItems loading";
				state.vendorsAganistItems.loading = true;
			})
			.addCase(getVendorsByItems.fulfilled, (state, action) => {
				state.status = "getVendorsByItems succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.vendorsAganistItems.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.vendorsAganistItems.miniParams?.page_size
				);
				state.vendorsAganistItems = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.vendorsAganistItems.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getVendorsByItems.rejected, (state, action) => {
				state.status = "getVendorsByItems failed";
				state.vendorsAganistItems.loading = false;
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
	clearVendorsAganistItems,
	updatePurchaseEnquiryState,
	updatePIItems,
	setShowAddItem,
} = purchaseEnquirySlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const purchaseEnquirySelector = (state: RootState) =>
	state.projectManagement.purchaseEnquiry;

// Memoized selector
export const selectEnquiry = createSelector(
	[
		purchaseEnquirySelector,
		purchaseIndentSelector,
		systemSelector,
		selectManageGroups,
		miniSelector,
	],
	(purchaseEnquiry, purchaseIndent, system, groups, mini) => ({
		purchaseEnquiry,
		purchaseIndent,
		system,
		groups,
		mini,
	})
);

export const usePurchaseEnquiryActions = () => {
	const dispatch = useAppDispatch();
	return {
		updateState: (payload: PurchaseEnquiryState) =>
			dispatch(updatePurchaseEnquiryState(payload)),
		updatePiItems: (payload: PurchaseEnquiryState["selectedPIitems"]) =>
			dispatch(updatePIItems(payload)),
		setShowAddItem: (payload: boolean) => dispatch(setShowAddItem(payload)),
	};
};

export default purchaseEnquirySlice.reducer;
