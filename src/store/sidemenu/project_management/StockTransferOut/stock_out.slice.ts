import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { StockOutInitialState } from "./stock_out.types";
import {
	editStockOut,
	getStockOutById,
	getStockOut,
	postStockOut,
	getStockDetails,
	stockOutApproval,
	stockOutCheckApproval,
	getStockBatchDetails,
} from "./stock_out.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: StockOutInitialState = {
	loading: false,
	stock_loading: false,
	status: "",
	error: "",
	stockoutList: [],
	stockoutCount: 0,
	selectedData: {},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	approve_loading: false,
	checkApprove: false,
	approved_level: 0,
	approved_status: 0,
	approved_status_name: "",
	approved_data: undefined,
	model: false,
	rejectModel: false,
	reject_description: "",
	batchesAganistItem: {
		loading: false,
		list: [],
		count: 0,
		miniParams: {
			item_id: "",
			page: 1,
			page_size: 10,
			search: "",
			no_of_pages: 0,
		},
	},
};

const stockOutSlice = createSlice({
	name: "stockOut",
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
		getStockOutCheckApprove: (state) => {
			return {
				...state,
				approve_loading: true,
				checkApprove: false,
			};
		},
		stockOutCheckApproveSuccessful: (state, action) => {
			return {
				...state,
				approve_loading: false,
				checkApprove: action.payload,
			};
		},
		setIsModalOpen: (state, action) => {
			return {
				...state,
				model: action.payload,
			};
		},
		setIsRejectModalOpen: (state, action) => {
			return {
				...state,
				rejectModel: action.payload,
			};
		},
		clearBatchesAgainstItem: (state) => {
			return {
				...state,
				batchesAganistItem: initialState?.batchesAganistItem,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getStockOut.pending, (state, action) => {
				state.status = "getStockOut pending";
				state.loading = true;
			})
			.addCase(getStockOut.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getStockOut succeeded";
				state.loading = false;
				state.stockoutList = response.results;
				state.stockoutCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getStockOut.rejected, (state, action) => {
				state.status = "getStockOut failed";
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
				state.approved_data = response;
				state.approved_level = response?.approved_level;
				state.approved_status = response?.approved_status;
				state.approved_status_name = response?.approved_status_name;
				state.selectedData = {
					...response,
					warehouse: {
						...response.warehouse,
						label: response?.warehouse?.name,
						value: response?.warehouse?.id,
					},
					to_warehouse: {
						...response.to_warehouse,
						label: response?.to_warehouse?.name,
						value: response?.to_warehouse?.id,
					},
					soitems: response?.soitems?.map((e: any) => {
						return {
							...e,
							qty: parseInt(e.qty),
							// item: e.batch?.item,
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
								item: e?.batch?.item?.id,
								itemname: e?.batch?.item?.name,
								batch: e?.batch?.id,
								batchname: e?.batch?.name,
								quantity: e?.batch?.qty,
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
			//post Data
			.addCase(postStockOut.pending, (state, action) => {
				state.status = "postStockOut pending";
				state.loading = true;
			})
			.addCase(postStockOut.fulfilled, (state, action) => {
				state.status = "postStockOut succeeded";
				state.loading = false;
			})
			.addCase(postStockOut.rejected, (state, action) => {
				state.status = "postStockOut failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editStockOut.pending, (state, action) => {
				state.status = "editStockOut pending";
				state.loading = true;
			})
			.addCase(editStockOut.fulfilled, (state, action) => {
				state.status = "editStockOut succeeded";
				state.loading = false;
			})
			.addCase(editStockOut.rejected, (state, action) => {
				state.status = "editStockOut failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getStockDetails.pending, (state, action) => {
				state.status = "getStockDetails pending";
				state.stock_loading = true;
			})
			.addCase(getStockDetails.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getStockDetails succeeded";
				state.stock_loading = false;
				state.stock_available = response?.quantity;
			})
			.addCase(getStockDetails.rejected, (state, action) => {
				state.status = "getStockDetails failed";
				state.stock_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getStockBatchDetails.pending, (state, action) => {
				state.status = "getStockBatchDetails loading";
				state.batchesAganistItem.loading = true;
			})
			.addCase(getStockBatchDetails.fulfilled, (state, action) => {
				state.status = "getStockBatchDetails succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.batchesAganistItem.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.batchesAganistItem.miniParams?.page_size
				);
				state.batchesAganistItem = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.batchesAganistItem.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getStockBatchDetails.rejected, (state, action) => {
				state.status = "getStockBatchDetails failed";
				state.batchesAganistItem.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(stockOutApproval.pending, (state, action) => {
				state.status = "stockOutApproval pending";
				state.approve_loading = true;
			})
			.addCase(stockOutApproval.fulfilled, (state, action) => {
				state.status = "stockOutApproval succeeded";
				state.approve_loading = false;
			})
			.addCase(stockOutApproval.rejected, (state, action) => {
				state.status = "stockOutApproval failed";
				state.approve_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(stockOutCheckApproval.pending, (state, action) => {
				state.status = "stockOutCheckApproval pending";
				state.approve_loading = true;
			})
			.addCase(stockOutCheckApproval.fulfilled, (state, action) => {
				state.status = "stockOutCheckApproval succeeded";
				const { response }: any = action.payload;
				state.checkApprove = true;
				state.approve_loading = false;
			})
			.addCase(stockOutCheckApproval.rejected, (state, action) => {
				state.status = "stockOutCheckApproval failed";
				state.approve_loading = false;
				state.checkApprove = false;
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
	setIsModalOpen,
	setIsRejectModalOpen,
	getStockOutCheckApprove,
	stockOutCheckApproveSuccessful,
	clearBatchesAgainstItem,
} = stockOutSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stockOutSelectors = (state: RootState) =>
	state.projectManagement.stockOut;

// Memoized selector
export const selectStockOut = createSelector(
	[
		stockOutSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		stockOut,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		stockOut,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export default stockOutSlice.reducer;
