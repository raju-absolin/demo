import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@src/store/store";
import { ReceiptFromProductionInitialState } from "./RFP.types";
import {
	editReceiptFromProduction,
	getReceiptFromProductionById,
	getReceiptFromProduction,
	postReceiptFromProduction,
} from "./RFP.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: ReceiptFromProductionInitialState = {
	loading: false,
	status: "",
	error: "",
	list: [],
	count: 0,
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

const receiptFromProductionSlice = createSlice({
	name: "receiptFromProduction",
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
			.addCase(getReceiptFromProduction.pending, (state, action) => {
				state.status = "getReceiptFromProduction pending";
				state.loading = true;
			})
			.addCase(getReceiptFromProduction.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getReceiptFromProduction succeeded";
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
			.addCase(getReceiptFromProduction.rejected, (state, action) => {
				state.status = "getReceiptFromProduction failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getReceiptFromProductionById.pending, (state, action) => {
				state.status = "getReceiptFromProductionById pending";
				state.loading = true;
			})
			.addCase(
				getReceiptFromProductionById.fulfilled,
				(state, action) => {
					const { response }: any = action.payload;
					state.status = "getReceiptFromProductionById succeeded";
					state.loading = false;
					state.selectedData = {
						...response,
						preceipt_items: response?.preceipt_items?.map(
							(e: any) => {
								return {
									...e,
									qty: parseInt(e.qty),
									item: {
										...e?.item,
										value: e.item?.id,
										label: e.item?.name,
									},
									unit: {
										...e?.unit,
										value: e.unit?.id,
										label: e.unit?.name,
									},
									batch: {
										...e?.batch,
										value: e?.batch?.id,
										label: e?.batch?.name,
									},
									dodelete: false,
								};
							}
						),
					};
				}
			)
			.addCase(getReceiptFromProductionById.rejected, (state, action) => {
				state.status = "getReceiptFromProductionById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postReceiptFromProduction.pending, (state, action) => {
				state.status = "postReceiptFromProduction pending";
				state.loading = true;
			})
			.addCase(postReceiptFromProduction.fulfilled, (state, action) => {
				state.status = "postReceiptFromProduction succeeded";
				state.loading = false;
			})
			.addCase(postReceiptFromProduction.rejected, (state, action) => {
				state.status = "postReceiptFromProduction failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editReceiptFromProduction.pending, (state, action) => {
				state.status = "editReceiptFromProduction pending";
				state.loading = true;
			})
			.addCase(editReceiptFromProduction.fulfilled, (state, action) => {
				state.status = "editReceiptFromProduction succeeded";
				state.loading = false;
			})
			.addCase(editReceiptFromProduction.rejected, (state, action) => {
				state.status = "editReceiptFromProduction failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const { setSelectedData, setIsFilterOpen, setPageParams } =
	receiptFromProductionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const ReceiptFromProductionSelectors = (state: RootState) =>
	state.projectManagement.receiptFromProduction;

// Memoized selector
export const selectReceiptFromProduction = createSelector(
	[
		ReceiptFromProductionSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		receiptFromProduction,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		receiptFromProduction,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export const useReceiptFromProductionSelector = () => {
	const selectors = useAppSelector((state) =>
		selectReceiptFromProduction(state)
	);
	return selectors;
};

export default receiptFromProductionSlice.reducer;
