import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@src/store/store";
import { DeliveryChallanInitialState } from "./DC.types";
import {
	editDeliveryChallan,
	getDeliveryChallanById,
	getDeliveryChallan,
	postDeliveryChallan,
	getStockDetails, deliveryChallanApproval, deliveryChallanCheckApproval,
	getBatchQuantity
} from "./DC.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: DeliveryChallanInitialState = {
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
	approve_loading: false,
	checkApprove: false,
	approved_level: 0,
	approved_status: 0,
	approved_status_name: "",
	approved_data: undefined,
	model: false,
	rejectModel: false,
	reject_description: "",
	batchListCount: 0,
	batchPageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	batchloading: false
};

const deliveryChallanSlice = createSlice({
	name: "deliveryChallan",
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
		getDeliveryChallanCheckApprove: (state) => {
			return {
				...state,
				approve_loading: true,
				checkApprove: false,
			};
		},
		deliveryChallanCheckApproveSuccessful: (state, action) => {
			return {
				...state,
				approve_loading: false,
				checkApprove: action.payload,
			};
		},
		setIsModalOpen: (state, action) => {
			return {
				...state,
				model: action.payload
			}
		},
		setIsRejectModalOpen: (state, action) => {
			return {
				...state,
				rejectModel: action.payload
			}
		},
		clearBatchQuantity: (state, action) => {
			return {
				...state,
				batchAgainstItemsList: []
			}
		}
	},
	extraReducers(builder) {
		builder
			.addCase(getDeliveryChallan.pending, (state, action) => {
				state.status = "getDeliveryChallan pending";
				state.loading = true;
			})
			.addCase(getDeliveryChallan.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getDeliveryChallan succeeded";
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
			.addCase(getDeliveryChallan.rejected, (state, action) => {
				state.status = "getDeliveryChallan failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getDeliveryChallanById.pending, (state, action) => {
				state.status = "getDeliveryChallanById pending";
				state.loading = true;
			})
			.addCase(getDeliveryChallanById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getDeliveryChallanById succeeded";
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
					dchallan_items: response?.dchallan_items?.map((e: any) => {
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
					}),
				};
			})
			.addCase(getDeliveryChallanById.rejected, (state, action) => {
				state.status = "getDeliveryChallanById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postDeliveryChallan.pending, (state, action) => {
				state.status = "postDeliveryChallan pending";
				state.loading = true;
			})
			.addCase(postDeliveryChallan.fulfilled, (state, action) => {
				state.status = "postDeliveryChallan succeeded";
				state.loading = false;
			})
			.addCase(postDeliveryChallan.rejected, (state, action) => {
				state.status = "postDeliveryChallan failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editDeliveryChallan.pending, (state, action) => {
				state.status = "editDeliveryChallan pending";
				state.loading = true;
			})
			.addCase(editDeliveryChallan.fulfilled, (state, action) => {
				state.status = "editDeliveryChallan succeeded";
				state.loading = false;
			})
			.addCase(editDeliveryChallan.rejected, (state, action) => {
				state.status = "editDeliveryChallan failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getStockDetails.pending, (state, action) => {
				state.status = "getStockDetails pending";
				state.loading = true;
			})
			.addCase(getStockDetails.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getStockDetails succeeded";
				state.loading = false;
				state.stock_available = response?.quantity;
			})
			.addCase(getStockDetails.rejected, (state, action) => {
				state.status = "getStockDetails failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deliveryChallanApproval.pending, (state, action) => {
				state.status = "deliveryChallanApproval pending";
				state.approve_loading = true;
			})
			.addCase(deliveryChallanApproval.fulfilled, (state, action) => {
				state.status = "deliveryChallanApproval succeeded";
				state.approve_loading = false;
			})
			.addCase(deliveryChallanApproval.rejected, (state, action) => {
				state.status = "deliveryChallanApproval failed";
				state.approve_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deliveryChallanCheckApproval.pending, (state, action) => {
				state.status = "deliveryChallanCheckApproval pending";
				state.approve_loading = true;
			})
			.addCase(deliveryChallanCheckApproval.fulfilled, (state, action) => {
				state.status = "deliveryChallanCheckApproval succeeded";
				const { response }: any = action.payload;
				state.checkApprove = true;
				state.approve_loading = false;
			})
			.addCase(deliveryChallanCheckApproval.rejected, (state, action) => {
				state.status = "deliveryChallanCheckApproval failed";
				state.approve_loading = false;
				state.checkApprove = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getBatchQuantity.pending, (state, action) => {
				state.status = "getBatchQuantity pending";
				state.batchloading = true;
			})
			.addCase(getBatchQuantity.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getBatchQuantity succeeded";
				state.batchloading = false;
				state.batchAgainstItemsList = response.results;
				state.batchListCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.batchPageParams = {
					...state.batchPageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getBatchQuantity.rejected, (state, action) => {
				state.status = "getBatchQuantity failed";
				state.batchloading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})

	},
});

// Action creators are generated for each case reducer function
export const { setSelectedData, setIsFilterOpen, setPageParams,
	setIsModalOpen, setIsRejectModalOpen, deliveryChallanCheckApproveSuccessful, getDeliveryChallanCheckApprove, clearBatchQuantity
} =
	deliveryChallanSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const DeliveryChallanSelectors = (state: RootState) =>
	state.projectManagement.deliveryChallan;

// Memoized selector
export const selectDeliveryChallan = createSelector(
	[
		DeliveryChallanSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		deliveryChallan,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		deliveryChallan,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export const useDeliveryChallanSelector = () => {
	const selectors = useAppSelector((state) => selectDeliveryChallan(state));
	return selectors;
};

export default deliveryChallanSlice.reducer;
