import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { BudgetQuotationsState } from "./bq.types";
import {
	editBudgetQuotationData,
	getBudgetQuotationById,
	getBudgetQuotations,
	postBudgetQuotationData,
} from "./bq.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { leadSelector } from "../leads/leads.slice";
import { miniType } from "@src/store/mini/mini.Types";

const initialState: BudgetQuotationsState = {
	loading: false,
	status: "",
	error: "",
	budgetQuotationList: [],
	budgetQuotationCount: 0,
	modal: false,
	selectedData: {},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	attachments: [],
	VECattachments: [],
};

const budgetQuotationSlice = createSlice({
	name: "bidingBudgetQuotations",
	initialState,
	reducers: {
		isModalOpen: (state, action) => {
			return {
				...state,
				modal: action.payload,
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
		setAttachments: (state, action) => {
			return {
				...state,
				attachments: action.payload,
			};
		},
		setVendorEvaluationCriteriaAttachments: (state, action) => {
			return {
				...state,
				VECattachments: action.payload,
			};
		},
		setLeadItems: (state, action) => {
			return {
				...state,
				selectedData: {
					...state.selectedData,
					budgetaryquotationitems: action.payload,
				},
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getBudgetQuotations.pending, (state, action) => {
				state.status = "getBudgetQuotations pending";
				state.loading = true;
			})
			.addCase(getBudgetQuotations.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getBudgetQuotations succeeded";
				state.loading = false;
				state.budgetQuotationList = response.results;
				state.budgetQuotationCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);

				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				if (response.results[0]) {
					state.attachments = response.results[0]?.documents?.map(
						(document) => {
							const split: string[] | undefined =
								document?.file?.split("/");
							return {
								...document,
								path: split ? split[split.length - 1] : "",
								preview: document?.file,
								formattedSize: "",
							};
						}
					);
					state.VECattachments =
						response.results[0]?.vec_documents?.map((document) => {
							const split: string[] | undefined =
								document?.file?.split("/");
							return {
								...document,
								path: split ? split[split.length - 1] : "",
								preview: document?.file,
								formattedSize: "",
							};
						});
				}
			})
			.addCase(getBudgetQuotations.rejected, (state, action) => {
				state.status = "getBudgetQuotations failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getBudgetQuotationById.pending, (state, action) => {
				state.status = "getBudgetQuotationById pending";
				state.loading = true;
			})
			.addCase(getBudgetQuotationById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getBudgetQuotationById succeeded";
				state.loading = false;
				state.VECattachments = response?.vec_documents?.map(
					(document) => {
						const split: string[] | undefined =
							document?.file?.split("/");
						return {
							...document,
							path: split ? split[split.length - 1] : "",
							preview: document?.file,
							formattedSize: "",
						};
					}
				);
				state.attachments = response.documents?.map((document) => {
					const split: string[] | undefined =
						document?.file?.split("/");
					return {
						...document,
						path: split ? split[split.length - 1] : "",
						preview: document?.file,
						formattedSize: "",
					};
				});
				state.selectedData = {
					...response,
					vendor_evaluation_criteria: {
						label: response?.vendor_evaluation_criteria
							? "Yes"
							: "No",
						value: response?.vendor_evaluation_criteria,
					} as miniType & { value: boolean },
					comments: response?.comments?.map((e) => {
						return {
							...e,
							b_quotation: {
								...e.b_quotation,
								value: e.b_quotation?.id,
								label: e.b_quotation?.bdm?.fullname,
							},
						};
					}),
					budgetaryquotationitems:
						response.budgetaryquotationitems?.map((e: any) => {
							return {
								...e,
								item: {
									...e.item,
									value: e.item.id,
									label: e.item.name,
								},
								unit: {
									...e.unit,
									label: e?.unit?.name,
									value: e?.unit?.id,
								},
								vendors: e?.vendors?.map((val: any) => {
									return {
										...val,
										label: val?.name,
										value: val?.id,
									};
								}),
							};
						}),
				};
			})
			.addCase(getBudgetQuotationById.rejected, (state, action) => {
				state.status = "getBudgetQuotationById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postBudgetQuotationData.pending, (state, action) => {
				state.status = "postBudgetQuotationData pending";
				state.loading = true;
			})
			.addCase(postBudgetQuotationData.fulfilled, (state, action) => {
				state.status = "postBudgetQuotationData succeeded";
				state.loading = false;
			})
			.addCase(postBudgetQuotationData.rejected, (state, action) => {
				state.status = "postBudgetQuotationData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editBudgetQuotationData.pending, (state, action) => {
				state.status = "editBudgetQuotationData pending";
				state.loading = true;
			})
			.addCase(editBudgetQuotationData.fulfilled, (state, action) => {
				state.status = "editBudgetQuotationData succeeded";
				state.loading = false;
			})
			.addCase(editBudgetQuotationData.rejected, (state, action) => {
				state.status = "editBudgetQuotationData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	isModalOpen,
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	setAttachments,
	setLeadItems,
	setVendorEvaluationCriteriaAttachments,
} = budgetQuotationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const budgetQuotationSelector = (state: RootState) =>
	state.strategicManagement.budgetQuotation;

// Memoized selector
export const selectBudgetQuotations = createSelector(
	[budgetQuotationSelector, leadSelector, systemSelector, miniSelector],
	(budgetQuotation, leads, system, mini) => ({
		budgetQuotation,
		leads,
		system,
		mini,
	})
);

export default budgetQuotationSlice.reducer;
