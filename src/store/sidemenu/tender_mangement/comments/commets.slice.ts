import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { CommentsInitialState } from "./commets.types";
import {
	editComment,
	getCommentById,
	getComments,
	postComment,
} from "./commets.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { tendersSelectors } from "../tenders/tenders.slice";

const initialState: CommentsInitialState = {
	loading: false,
	status: "",
	error: "",
	commentsList: [],
	commentsCount: 0,
	selectedData: {},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	commentModal: false,
};

const commentsSlice = createSlice({
	name: "comments",
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
		setComment: (state, action) => {
			return {
				...state,
				comment: action.payload,
			};
		},
		openCommentModal: (state, action) => {
			return {
				...state,
				commentModal: action.payload,
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
				state.commentsList = response.results;
				state.commentsCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
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
				state.selectedData = response;
			})
			.addCase(getCommentById.rejected, (state, action) => {
				state.status = "getCommentById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postComment.pending, (state, action) => {
				state.status = "postComment pending";
				state.loading = true;
			})
			.addCase(postComment.fulfilled, (state, action) => {
				state.status = "postComment succeeded";
				state.loading = false;
			})
			.addCase(postComment.rejected, (state, action) => {
				state.status = "postComment failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editComment.pending, (state, action) => {
				state.status = "editComment pending";
				state.loading = true;
			})
			.addCase(editComment.fulfilled, (state, action) => {
				state.status = "editComment succeeded";
				state.loading = false;
			})
			.addCase(editComment.rejected, (state, action) => {
				state.status = "editComment failed";
				state.loading = false;
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
	setComment,
	openCommentModal,
} = commentsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const commentsSelectors = (state: RootState) =>
	state.tenderManagement.comments;

// Memoized selector
export const selectComments = createSelector(
	[
		commentsSelectors,
		tendersSelectors,
		systemSelector,
		selectManageGroups,
		miniSelector,
	],
	(comments, tenders, system, groups, mini) => ({
		comments,
		tenders,
		system,
		groups,
		mini,
	})
);

export default commentsSlice.reducer;
