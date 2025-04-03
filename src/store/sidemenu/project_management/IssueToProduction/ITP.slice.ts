import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@src/store/store";
import { IssueToProductionInitialState } from "./ITP.types";
import {
	editIssueToProduction,
	getIssueToProductionById,
	getIssueToProduction,
	postIssueToProduction,
	getStockDetails,
	issueToProductionApproval,
	issueToProductionCheckApproval,
	getBatchQuantity,
} from "./ITP.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: IssueToProductionInitialState = {
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

const issueToProductionSlice = createSlice({
	name: "issueToProduction",
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
		getIssueToProducitonCheckApprove: (state) => {
			return {
				...state,
				approve_loading: true,
				checkApprove: false,
			};
		},
		ITPCheckApproveSuccessful: (state, action) => {
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
			.addCase(getIssueToProduction.pending, (state, action) => {
				state.status = "getIssueToProduction pending";
				state.loading = true;
			})
			.addCase(getIssueToProduction.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getIssueToProduction succeeded";
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
			.addCase(getIssueToProduction.rejected, (state, action) => {
				state.status = "getIssueToProduction failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getIssueToProductionById.pending, (state, action) => {
				state.status = "getIssueToProductionById pending";
				state.loading = true;
			})
			.addCase(getIssueToProductionById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getIssueToProductionById succeeded";
				state.loading = false;
				state.approved_data = response;
				state.approved_level = response?.approved_level;
				state.approved_status = response?.approved_status;
				state.approved_status_name = response?.approved_status_name;
				state.selectedData = {
					...response,
					issuetoproductionitems:
						response?.issuetoproductionitems?.map((e: any) => {
							return {
								...e,
								qty: parseInt(e.qty),
								item: {
									...e.item,
									value: e.item?.id,
									label: e.item?.name,
								},
								unit: {
									...e.unit,
									value: e.unit?.id,
									label: e.unit?.name,
								},
								batch: {
									...e.batch,
									value: e?.batch?.id,
									label: e?.batch?.name,
								},
								dodelete: false,
							};
						}),
				};
			})
			.addCase(getIssueToProductionById.rejected, (state, action) => {
				state.status = "getIssueToProductionById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postIssueToProduction.pending, (state, action) => {
				state.status = "postIssueToProduction pending";
				state.loading = true;
			})
			.addCase(postIssueToProduction.fulfilled, (state, action) => {
				state.status = "postIssueToProduction succeeded";
				state.loading = false;
			})
			.addCase(postIssueToProduction.rejected, (state, action) => {
				state.status = "postIssueToProduction failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editIssueToProduction.pending, (state, action) => {
				state.status = "editIssueToProduction pending";
				state.loading = true;
			})
			.addCase(editIssueToProduction.fulfilled, (state, action) => {
				state.status = "editIssueToProduction succeeded";
				state.loading = false;
			})
			.addCase(editIssueToProduction.rejected, (state, action) => {
				state.status = "editIssueToProduction failed";
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
			.addCase(issueToProductionApproval.pending, (state, action) => {
				state.status = "issueToProductionApproval pending";
				state.approve_loading = true;
			})
			.addCase(issueToProductionApproval.fulfilled, (state, action) => {
				state.status = "issueToProductionApproval succeeded";
				state.approve_loading = false;
			})
			.addCase(issueToProductionApproval.rejected, (state, action) => {
				state.status = "issueToProductionApproval failed";
				state.approve_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(issueToProductionCheckApproval.pending, (state, action) => {
				state.status = "issueToProductionCheckApproval pending";
				state.approve_loading = true;
			})
			.addCase(issueToProductionCheckApproval.fulfilled, (state, action) => {
				state.status = "issueToProductionCheckApproval succeeded";
				const { response }: any = action.payload;
				state.checkApprove = true;
				state.approve_loading = false;
			})
			.addCase(issueToProductionCheckApproval.rejected, (state, action) => {
				state.status = "issueToProductionCheckApproval failed";
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
export const { setSelectedData, setIsFilterOpen, setPageParams, clearBatchQuantity,
	getIssueToProducitonCheckApprove, setIsModalOpen, setIsRejectModalOpen, ITPCheckApproveSuccessful
} =
	issueToProductionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const IssueToProductionSelectors = (state: RootState) =>
	state.projectManagement.issueToProduction;

// Memoized selector
export const selectIssueToProduction = createSelector(
	[
		IssueToProductionSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		issueToProduction,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		issueToProduction,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export const useIssueToProductionSelector = () => {
	const selectors = useAppSelector((state) => selectIssueToProduction(state));
	return selectors;
};

export default issueToProductionSlice.reducer;
