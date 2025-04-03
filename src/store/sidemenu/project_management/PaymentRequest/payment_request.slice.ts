import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { PaymentRequestInitialState } from "./payment_request.types";
import {
	editPaymentRequest,
	getPaymentRequestById,
	getPaymentRequests,
	postPaymentRequest,
	PaymentRequestApproval,
	PaymentRequestCheckApproval,
} from "./payment_request.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseOrderSelectors } from "../PurchaseOrder/po.slice";

const initialState: PaymentRequestInitialState = {
	loading: false,
	status: "",
	error: "",
	paymentRequestList: [],
	paymentRequestCount: 0,
	selectedData: {},
	isFilterOpen: false,
	isPRViewOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	vendorsByPO: [],
	vendorsByPOLoading: false,
	approve_loading: false,
	checkApprove: false,
	approved_level: 0,
	approved_status: 0,
	approved_status_name: "",
	approved_data: {},
	model: false,
	rejectModel: false,
	confirmModel: false,
	reject_description: "",
	uploadDocuments: [],
	document_loading: false,
	client_status_name: "",
	base_price: "",
};

const paymentRequestSlice = createSlice({
	name: "paymentRequest",
	initialState,
	reducers: {
		clearVendorsByPO: (state, action) => {
			return {
				...state,
				vendorsByPO: [],
				vendorsByPOLoading: false,
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
		setIsPRViewOpen: (state, action) => {
			return {
				...state,
				isPRViewOpen: action.payload,
			};
		},
		setPageParams: (state, action) => {
			return {
				...state,
				pageParams: action.payload,
			};
		},
		getPurchaseCheckApprove: (state) => {
			return {
				...state,
				approve_loading: true,
				checkApprove: false,
			};
		},
		purchasesCheckApproveSuccessful: (state, action) => {
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
		setConfirmModal: (state, action) => {
			return {
				...state,
				confirmModel: action.payload,
			};
		},
		// setPaymentList: (state, action) => {
		//     return {
		//         ...state,
		//         paymentList: [...(state.paymentList ?? []), action.payload],
		//     };
		// },
	},
	extraReducers(builder) {
		builder
			.addCase(getPaymentRequests.pending, (state, action) => {
				state.status = "getPaymentRequests pending";
				state.loading = true;
			})
			.addCase(getPaymentRequests.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getPaymentRequests succeeded";
				state.loading = false;
				state.paymentRequestList = response.results?.map((val: any) => {
					return {
						...val,
						vendor: {
							...val.vendor,
							label: val?.vendor?.name,
							value: val?.vendor?.id,
						},
						purchase_order: {
							...val.purchase_order,
							label: val?.purchase_order?.code,
							value: val?.purchase_order?.id,
						},
					};
				});
				state.paymentRequestCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getPaymentRequests.rejected, (state, action) => {
				state.status = "getPaymentRequests failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getPaymentRequestById.pending, (state, action) => {
				state.status = "getPaymentRequestById pending";
				state.loading = true;
			})
			.addCase(getPaymentRequestById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getPaymentRequestById succeeded";
				state.loading = false;
				state.approved_data = response;
				state.approved_level = response?.approved_level;
				state.approved_status = response?.approved_status;
				state.approved_status_name = response?.approved_status_name;
				state.client_status_name = response?.client_status_name;
				state.selectedData = response;
			})
			.addCase(getPaymentRequestById.rejected, (state, action) => {
				state.status = "getPaymentRequestById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postPaymentRequest.pending, (state, action) => {
				state.status = "postPaymentRequest pending";
				state.loading = true;
			})
			.addCase(postPaymentRequest.fulfilled, (state, action) => {
				state.status = "postPaymentRequest succeeded";
				state.loading = false;
			})
			.addCase(postPaymentRequest.rejected, (state, action) => {
				state.status = "postPaymentRequest failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editPaymentRequest.pending, (state, action) => {
				state.status = "editPaymentRequest pending";
				state.loading = true;
			})
			.addCase(editPaymentRequest.fulfilled, (state, action) => {
				state.status = "editPaymentRequest succeeded";
				state.loading = false;
			})
			.addCase(editPaymentRequest.rejected, (state, action) => {
				state.status = "editPaymentRequest failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(PaymentRequestApproval.pending, (state, action) => {
				state.status = "PaymentRequestApproval pending";
				state.approve_loading = true;
			})
			.addCase(PaymentRequestApproval.fulfilled, (state, action) => {
				state.status = "PaymentRequestApproval succeeded";
				state.approve_loading = false;
			})
			.addCase(PaymentRequestApproval.rejected, (state, action) => {
				state.status = "PaymentRequestApproval failed";
				state.approve_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(PaymentRequestCheckApproval.pending, (state, action) => {
				state.status = "PaymentRequestCheckApproval pending";
				state.approve_loading = true;
			})
			.addCase(PaymentRequestCheckApproval.fulfilled, (state, action) => {
				state.status = "PaymentRequestCheckApproval succeeded";
				const { response }: any = action.payload;
				state.checkApprove = true;
				state.approve_loading = false;
			})
			.addCase(PaymentRequestCheckApproval.rejected, (state, action) => {
				state.status = "PaymentRequestCheckApproval failed";
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
	clearVendorsByPO,
	getPurchaseCheckApprove,
	purchasesCheckApproveSuccessful,
	setIsModalOpen,
	setIsRejectModalOpen,
	setConfirmModal,
	setIsPRViewOpen,
	// setPaymentList,
} = paymentRequestSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const paymentRequestSelectors = (state: RootState) =>
	state.projectManagement.paymentRequest;

// Memoized selector
export const selectPaymentRequests = createSelector(
	[
		paymentRequestSelectors,
		purchaseEnquirySelector,
		purchaseOrderSelectors,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		paymentRequest,
		purchaseEnquiry,
		purchaseOrder,
		workOrder,
		system,
		mini,
		customise
	) => ({
		paymentRequest,
		purchaseEnquiry,
		purchaseOrder,
		workOrder,
		system,
		mini,
		customise,
	})
);

export default paymentRequestSlice.reducer;
