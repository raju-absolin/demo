import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { MaterialReceiptInitialState } from "./material_receipt.types";
import {
	editMaterialReceipt,
	getMIById,
	getMaterialReceiptById,
	getMaterialReceipt,
	postMaterialReceipt,
} from "./material_receipt.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: MaterialReceiptInitialState = {
	loading: false,
	status: "",
	error: "",
	mtList: [],
	mtCount: 0,
	selectedData: {},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

const materialReceiptSlice = createSlice({
	name: "materialReceipt",
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
			.addCase(getMaterialReceipt.pending, (state, action) => {
				state.status = "getMaterialReceipt pending";
				state.loading = true;
			})
			.addCase(getMaterialReceipt.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getMaterialReceipt succeeded";
				state.loading = false;
				state.mtList = response.results;
				state.mtCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMaterialReceipt.rejected, (state, action) => {
				state.status = "getMaterialReceipt failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getMaterialReceiptById.pending, (state, action) => {
				state.status = "getMaterialReceiptById pending";
				state.loading = true;
			})
			.addCase(getMaterialReceiptById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getMaterialReceiptById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					miitem: response?.material_issue?.miitems?.reduce((acc: any[], e: any) =>
						acc.concat({ qty: e?.qty })
						, []),
					mreceipt_items: response?.mreceipt_items?.map((e: any) => {
						return {
							...e,
							price: e?.price,
							qty: parseInt(e.qty),
							item: {
								id: e.item?.id,
								name: e.item?.name,
							},
							batch: {
								id: e?.batch?.id,
								name: e?.batch?.name
							},
							dodelete: false,
						};
					}),
				};
			})
			.addCase(getMaterialReceiptById.rejected, (state, action) => {
				state.status = "getMaterialReceiptById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postMaterialReceipt.pending, (state, action) => {
				state.status = "postMaterialReceipt pending";
				state.loading = true;
			})
			.addCase(postMaterialReceipt.fulfilled, (state, action) => {
				state.status = "postMaterialReceipt succeeded";
				state.loading = false;
			})
			.addCase(postMaterialReceipt.rejected, (state, action) => {
				state.status = "postMaterialReceipt failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editMaterialReceipt.pending, (state, action) => {
				state.status = "editMaterialReceipt pending";
				state.loading = true;
			})
			.addCase(editMaterialReceipt.fulfilled, (state, action) => {
				state.status = "editMaterialReceipt succeeded";
				state.loading = false;
			})
			.addCase(editMaterialReceipt.rejected, (state, action) => {
				state.status = "editMaterialReceipt failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getMIById.pending, (state, action) => {
				state.status = "getMRById pending";
				state.loading = true;
			})
			.addCase(getMIById.fulfilled, (state, action) => {
				const { response }: any = action.payload;

				state.status = "getMRById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					miitem: response?.miitems?.reduce((acc: any[], e: any) =>
						acc.concat({ qty: e?.qty })
						, []),
					mreceipt_items: response?.miitems?.map((e: any) => {
						return {
							...e,
							price: e?.price,
							qty: parseInt(e.qty),
							poitem: {
								id: e.id,
								name: e.code,
							},
							item: {
								id: e.item.id,
								name: e.item.name,
							},
							make: {
								value: e.item.id,
								label: e.item.name,
							},
							dodelete: false,
						};
					}),
				};
			})
			.addCase(getMIById.rejected, (state, action) => {
				state.status = "getMIById failed";
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
} = materialReceiptSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const materialReceiptSelectors = (state: RootState) =>
	state.projectManagement.materialReceipt;

// Memoized selector
export const selectMaterialReceipt = createSelector(
	[
		materialReceiptSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		materialReceipt,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		materialReceipt,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export default materialReceiptSlice.reducer;
