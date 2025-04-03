import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { MaterialIssuesInitialState } from "./mr_issues.types";
import {
	MICheckApproval,
	editMaterialIssues,
	getBatchQuantity,
	getMIById,
	getMRById,
	getMaterialIssues,
	getStockDetails,
	materialIssueApproval,
	postMaterialIssues,
} from "./mr_issues.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: MaterialIssuesInitialState = {
	loading: false,
	status: "",
	error: "",
	miList: [],
	miCount: 0,
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
	batchListCount: 0,
	batchPageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	batchloading: false
};

const materialIssuesSlice = createSlice({
	name: "materialIssues",
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
		getMICheckApprove: (state) => {
			return {
				...state,
				approve_loading: true,
				checkApprove: false,
			};
		},
		miCheckApproveSuccessful: (state, action) => {
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
		setStockAvailable: (state, action) => {
			return {
				...state,
				stock_available: [
					...(state.stock_available ?? []),
					action.payload,
				],
			}
		},
		clearBatchQuantity: (state, action) => {
			return {
				...state,
				batchAgainstItemsList: []
			}
		},
		clearStockAvailable: (state) => {
			return {
				...state,
				stock_available: [], 
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getMaterialIssues.pending, (state, action) => {
				state.status = "getMaterialIssues pending";
				state.loading = true;
			})
			.addCase(getMaterialIssues.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getMaterialIssues succeeded";
				state.loading = false;
				state.batchAgainstItemsList = [];
				state.miList = response.results;
				state.miCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMaterialIssues.rejected, (state, action) => {
				state.status = "getMaterialIssues failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getMIById.pending, (state, action) => {
				state.status = "getMIById pending";
				state.loading = true;
			})
			.addCase(getMIById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getMIById succeeded";
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
					mritem: response?.materialrequest?.mr_items?.reduce((acc: any[], e: any) =>
						acc.concat({ qty: e?.qty })
						, []),
					miitems: response?.miitems?.map((e: any) => {
						return {
							...e,
							price: e?.price,
							// qty: parseInt(e.qty),
							taxtype: {
								id: e?.taxtype,
								name: e?.taxtype_name
							},
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
			.addCase(getMIById.rejected, (state, action) => {
				state.status = "getMIById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postMaterialIssues.pending, (state, action) => {
				state.status = "postMaterialIssues pending";
				state.loading = true;
			})
			.addCase(postMaterialIssues.fulfilled, (state, action) => {
				state.status = "postMaterialIssues succeeded";
				state.loading = false;
			})
			.addCase(postMaterialIssues.rejected, (state, action) => {
				state.status = "postMaterialIssues failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editMaterialIssues.pending, (state, action) => {
				state.status = "editMaterialIssues pending";
				state.loading = true;
			})
			.addCase(editMaterialIssues.fulfilled, (state, action) => {
				state.status = "editMaterialIssues succeeded";
				state.loading = false;
			})
			.addCase(editMaterialIssues.rejected, (state, action) => {
				state.status = "editMaterialIssues failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getMRById.pending, (state, action) => {
				state.status = "getMRById pending";
				state.loading = true;
			})
			.addCase(getMRById.fulfilled, (state, action) => {
				const { response }: any = action.payload;

				state.status = "getMRById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					...state.selectedData,
					mritem: response?.mr_items?.reduce((acc: any[], e: any) =>
						acc.concat({ qty: e?.qty })
						, []),
					miitems: response?.mr_items?.map((e: any) => {
						return {
							...e,
							price: e?.price,
							qty: parseInt(e.qty),
							item: {
								...e.item,
								id: e.item?.id,
								name: e.item?.name,
							},
							batch: {
								id: e.batch?.id,
								name: e.batch?.name,
							},
							taxtype: {
								id: e.taxtype,
								name: e.taxtype_name,
							},
							// make: {
							// 	value: e.item.id,
							// 	label: e.item.name,
							// },
							dodelete: false,
						};
					}),
				};
			})
			.addCase(getMRById.rejected, (state, action) => {
				state.status = "getMRById failed";
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
			})
			.addCase(getStockDetails.rejected, (state, action) => {
				state.status = "getStockDetails failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(materialIssueApproval.pending, (state, action) => {
				state.status = "materialIssueApproval pending";
				state.approve_loading = true;
			})
			.addCase(materialIssueApproval.fulfilled, (state, action) => {
				state.status = "materialIssueApproval succeeded";
				state.approve_loading = false;
			})
			.addCase(materialIssueApproval.rejected, (state, action) => {
				state.status = "materialIssueApproval failed";
				state.approve_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(MICheckApproval.pending, (state, action) => {
				state.status = "MICheckApproval pending";
				state.approve_loading = true;
			})
			.addCase(MICheckApproval.fulfilled, (state, action) => {
				state.status = "MICheckApproval succeeded";
				const { response }: any = action.payload;
				state.checkApprove = true;
				state.approve_loading = false;
			})
			.addCase(MICheckApproval.rejected, (state, action) => {
				state.status = "MICheckApproval failed";
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
export const {
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	clearBatchQuantity,
	setStockAvailable,
	clearStockAvailable,
	getMICheckApprove, miCheckApproveSuccessful, setIsModalOpen, setIsRejectModalOpen
} = materialIssuesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const materialIssuesSelectors = (state: RootState) =>
	state.projectManagement.materialIssues;

// Memoized selector
export const selectMaterialIssues = createSelector(
	[
		materialIssuesSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		materialIssues,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		materialIssues,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export default materialIssuesSlice.reducer;
