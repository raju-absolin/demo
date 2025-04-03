import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { StockInInitialState } from "./stock_in.types";
import {
	editStockIn,
	getStockInById,
	getStockIn,
	postStockIn,
	getStockOutById,
} from "./stock_in.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: StockInInitialState = {
	loading: false,
	status: "",
	error: "",
	stockInList: [],
	stockInCount: 0,
	selectedData: {},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

const stockInSlice = createSlice({
	name: "stockIn",
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
			.addCase(getStockIn.pending, (state, action) => {
				state.status = "getStockIn pending";
				state.loading = true;
			})
			.addCase(getStockIn.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getStockIn succeeded";
				state.loading = false;
				state.stockInList = response.results;
				state.stockInCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getStockIn.rejected, (state, action) => {
				state.status = "getStockIn failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getStockInById.pending, (state, action) => {
				state.status = "getStockInById pending";
				state.loading = true;
			})
			.addCase(getStockInById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getStockInById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					warehouse: {
						...response.warehouse,
						label: response?.warehouse?.name,
						value: response?.warehouse?.id,
					},
					from_warehouse: {
						...response.from_warehouse,
						label: response?.from_warehouse?.name,
						value: response?.from_warehouse?.id,
					},
					soitemQty: response?.stocktransferout?.soitems?.reduce((acc: any[], e: any) =>
						acc.concat({ qty: e?.qty })
						, []),
					siitems: response?.siitems?.map((e: any) => {
						return {
							...e,
							qty: e.qty,
							item: {
								id: e.item?.id,
								name: e.item?.name,
							},
							unit: {
								id: e.unit?.id,
								name: e.unit?.name,
							},
							dodelete: false,
						};
					}),
				};
			})
			.addCase(getStockInById.rejected, (state, action) => {
				state.status = "getStockInById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postStockIn.pending, (state, action) => {
				state.status = "postStockIn pending";
				state.loading = true;
			})
			.addCase(postStockIn.fulfilled, (state, action) => {
				state.status = "postStockIn succeeded";
				state.loading = false;
			})
			.addCase(postStockIn.rejected, (state, action) => {
				state.status = "postStockIn failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editStockIn.pending, (state, action) => {
				state.status = "editStockIn pending";
				state.loading = true;
			})
			.addCase(editStockIn.fulfilled, (state, action) => {
				state.status = "editStockIn succeeded";
				state.loading = false;
			})
			.addCase(editStockIn.rejected, (state, action) => {
				state.status = "editStockIn failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getStockOutById.pending, (state, action) => {
				state.status = "getStockOutById pending";
				state.loading = true;
			})
			.addCase(getStockOutById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getStockOutById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					warehouse: {
						...response.warehouse,
						label: response?.warehouse?.name,
						value: response?.warehouse?.id,
					},
					from_warehouse: {
						...response.to_warehouse,
						label: response?.to_warehouse?.name,
						value: response?.to_warehouse?.id,
					},
					soitemQty: response?.soitems?.reduce((acc: any[], e: any) =>
						acc.concat({ qty: e?.qty })
						, []),
					siitems: response?.soitems?.map((e: any) => {
						return {
							...e,
							qty: e.qty,
							item: {
								id: e.item?.id,
								name: e.item?.name,
							},
							unit: {
								id: e.unit?.id,
								name: e.unit?.name,
							},
							dodelete: false,
						};
					}),
				};
			})
			.addCase(getStockOutById.rejected, (state, action) => {
				state.status = "getStockOutById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
	},
});

// Action creators are generated for each case reducer function
export const {
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
} = stockInSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stockInSelectors = (state: RootState) =>
	state.projectManagement.stockIn;

// Memoized selector
export const selectStockIn = createSelector(
	[
		stockInSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		stockIn,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		stockIn,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export default stockInSlice.reducer;
