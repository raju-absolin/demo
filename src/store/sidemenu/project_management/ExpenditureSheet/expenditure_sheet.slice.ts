import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { ExpenditureSheetInitialState } from "./expenditure_sheet.types";
import {
	editExpenditureSheet,
	getExpenditureSheetById,
	getExpenditureSheet,
	postExpenditureSheet,
	ExpenditureSheetApproval,
	ExpenditureSheetCheckApproval,
} from "./expenditure_sheet.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: ExpenditureSheetInitialState = {
	loading: false,
	status: "",
	error: "",
	expenditureSheetList: [],
	expenditureSheetCount: 0,
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
	client_status_name: "",
	approved_data: undefined,
	model: false,
	rejectModel: false,
	reject_description: "",
	confirmModel: false,
	uploadDocuments: [],
	document_loading: false,
};

const expenditureSheetSlice = createSlice({
	name: "expenditureSheet",
	initialState,
	reducers: {
		clearVendorsByPE: (state, action) => {
			return {
				...state,
				vendorsByPE: [],
				vendorsByPELoading: false,
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
		setUploadDocument: (state, action) => {
			return {
				...state,
				uploadDocuments: action.payload,
			};
		},
		getCheckApprove: (state) => {
			return {
				...state,
				approve_loading: true,
				checkApprove: false,
			};
		},
		CheckApproveSuccessful: (state, action) => {
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
	},
	extraReducers(builder) {
		builder
			.addCase(getExpenditureSheet.pending, (state, action) => {
				state.status = "getExpenditureSheet pending";
				state.loading = true;
			})
			.addCase(getExpenditureSheet.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getExpenditureSheet succeeded";
				state.loading = false;
				state.expenditureSheetList = response.results;
				state.expenditureSheetCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				// state.invoice_document = {};
			})
			.addCase(getExpenditureSheet.rejected, (state, action) => {
				state.status = "getExpenditureSheet failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getExpenditureSheetById.pending, (state, action) => {
				state.status = "getExpenditureSheetById pending";
				state.loading = true;
			})
			.addCase(getExpenditureSheetById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getExpenditureSheetById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					location: {
						...response.location,
						label: response?.location?.name,
						value: response?.location?.id,
					},
					expendituresheetitems: response?.expendituresheetitems?.map(
						(e: any) => {
							return {
								...e,
								expendituretype: {
									label: e?.expendituretype_name,
									value: e?.expendituretype,
								},
								expendituretype_name: e?.expendituretype_name,
								expenses: {
									...e.expances,
									label: e.expances?.name,
									value: e.expances?.id,
								},
								dodelete: false,
								approved_amount: e?.approved_amount,
								documents: e.documents?.map((document: any) => {
									const split: string[] | undefined =
										document?.file?.split("/");
									return {
										...document,
										path: split
											? split[split.length - 1]
											: "",
										preview: document?.file,
										formattedSize: "",
									};
								}),
							};
						}
					),
				};
			})
			.addCase(getExpenditureSheetById.rejected, (state, action) => {
				state.status = "getExpenditureSheetById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postExpenditureSheet.pending, (state, action) => {
				state.status = "postExpenditureSheet pending";
				state.loading = true;
			})
			.addCase(postExpenditureSheet.fulfilled, (state, action) => {
				state.status = "postExpenditureSheet succeeded";
				state.loading = false;
			})
			.addCase(postExpenditureSheet.rejected, (state, action) => {
				state.status = "postExpenditureSheet failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editExpenditureSheet.pending, (state, action) => {
				state.status = "editExpenditureSheet pending";
				state.loading = true;
			})
			.addCase(editExpenditureSheet.fulfilled, (state, action) => {
				state.status = "editExpenditureSheet succeeded";
				state.loading = false;
			})
			.addCase(editExpenditureSheet.rejected, (state, action) => {
				state.status = "editExpenditureSheet failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(ExpenditureSheetApproval.pending, (state, action) => {
				state.status = "ExpenditureSheetApproval pending";
				state.approve_loading = true;
			})
			.addCase(ExpenditureSheetApproval.fulfilled, (state, action) => {
				state.status = "ExpenditureSheetApproval succeeded";
				state.approve_loading = false;
			})
			.addCase(ExpenditureSheetApproval.rejected, (state, action) => {
				state.status = "ExpenditureSheetApproval failed";
				state.approve_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(ExpenditureSheetCheckApproval.pending, (state, action) => {
				state.status = "ExpenditureSheetCheckApproval pending";
				state.approve_loading = true;
			})
			.addCase(
				ExpenditureSheetCheckApproval.fulfilled,
				(state, action) => {
					state.status = "ExpenditureSheetCheckApproval succeeded";
					const { response }: any = action.payload;
					state.checkApprove = true;
					state.approve_loading = false;
				}
			)
			.addCase(
				ExpenditureSheetCheckApproval.rejected,
				(state, action) => {
					state.status = "ExpenditureSheetCheckApproval failed";
					state.approve_loading = false;
					state.checkApprove = false;
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			);
	},
});

// Action creators are generated for each case reducer function
export const {
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	clearVendorsByPE,
	setUploadDocument,
	setIsModalOpen,
	setIsRejectModalOpen,
	CheckApproveSuccessful,
	getCheckApprove,
} = expenditureSheetSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const expenditureSheetSelectors = (state: RootState) =>
	state.projectManagement.expenditureSheet;

// Memoized selector
export const selectExpenditureSheet = createSelector(
	[
		expenditureSheetSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		expenditureSheet,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		expenditureSheet,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export default expenditureSheetSlice.reducer;
