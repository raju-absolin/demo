import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { BudgetQuotationCommentState } from "./bq_comments.types";
import {
	editCommentData,
	getCommentById,
	getComments,
	postCommentData,
} from "./bq_comments.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { leadSelector } from "../leads/leads.slice";
import { budgetQuotationSelector } from "../budget_quotation/bq.slice";

const initialState: BudgetQuotationCommentState = {
	loading: false,
	status: "",
	error: "",
	bq_commentList: [],
	bq_commentCount: 0,
	modal: false,
	selectedData: {
		comment: "",
	},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

const bq_commentsSlice = createSlice({
	name: "leadcomments",
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
	},
	extraReducers(builder) {
		builder
			.addCase(getComments.pending, (state, action) => {
				state.status = "getComments pending";
				state.loading = true;
			})
			.addCase(getComments.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getComments succeeded";
				state.loading = false;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.bq_commentList, ...response.results];
				}
				var noofpages = Math.ceil(response.count / params.page_size);

				state.bq_commentList = list;
				state.bq_commentCount = response.count;
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getComments.rejected, (state, action) => {
				state.status = "getComments failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getCommentById.pending, (state, action) => {
				state.status = "getCommentById pending";
				state.loading = true;
			})
			.addCase(getCommentById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getCommentById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
				};
			})
			.addCase(getCommentById.rejected, (state, action) => {
				state.status = "getCommentById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postCommentData.pending, (state, action) => {
				state.status = "postCommentData pending";
				state.loading = true;
			})
			.addCase(postCommentData.fulfilled, (state, action) => {
				state.status = "postCommentData succeeded";
				state.loading = false;
			})
			.addCase(postCommentData.rejected, (state, action) => {
				state.status = "postCommentData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editCommentData.pending, (state, action) => {
				state.status = "editCommentData pending";
				state.loading = true;
			})
			.addCase(editCommentData.fulfilled, (state, action) => {
				state.status = "editCommentData succeeded";
				state.loading = false;
			})
			.addCase(editCommentData.rejected, (state, action) => {
				state.status = "editCommentData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const { isModalOpen, setSelectedData, setIsFilterOpen, setPageParams } =
	bq_commentsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const bq_commentsSelector = (state: RootState) =>
	state.strategicManagement.bq_comments;

// Memoized selector
export const selectbq_comments = createSelector(
	[
		bq_commentsSelector,
		budgetQuotationSelector,
		leadSelector,
		systemSelector,
		miniSelector,
	],
	(bq_comments, budgetQuotation, leads, system, mini) => ({
		bq_comments,
		budgetQuotation,
		leads,
		system,
		mini,
	})
);

export default bq_commentsSlice.reducer;
