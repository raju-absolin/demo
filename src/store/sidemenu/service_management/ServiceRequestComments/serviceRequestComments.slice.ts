import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@src/store/store";

import {
	getServiceRequestComments,
	postServiceRequestComments,
} from "./serviceRequestComments.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { ServiceRequestCommentsState } from "./serviceRequestComments.types";
import { serviceRequestSelector } from "../ServiceRequest/serviceRequest.slice";

const initialState: ServiceRequestCommentsState = {
	loading: false,
	status: "",
	error: "",
	comments: [],
	commentsCount: 0,
	comments_loading: false,
	comment_params: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
		service_request: "",
	},
};

const serviceRequestCommentSlice = createSlice({
	name: "serviceRequestComment",
	initialState,
	reducers: {
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
			};
		},
		setPageParams: (state, action) => {
			return {
				...state,
				comment_params: action.payload,
			};
		},
		clearServiceRequestComments: (state) => {
			return {
				...state,
				comments: initialState.comments,
				commentsCount: initialState.commentsCount,
				comments_load: initialState.comments_loading,
				comment_params: initialState.comment_params,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getServiceRequestComments.pending, (state, action) => {
				state.status = "getServiceRequestComments pending";
				state.comments_loading = true;
			})
			.addCase(getServiceRequestComments.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getServiceRequestComments succeeded";
				state.comments_loading = false;

				var list = [];
				// const newresponse = response?.results?.map((item) => {
				// 	return {
				// 		...item,
				// 		attachments: item?.attachments?.map((e) => {
				// 			const split: string[] | undefined =
				// 				e?.file?.split("/");
				// 			return {
				// 				...e,
				// 				path: split ? split[split.length - 1] : "",
				// 				preview: e?.file,
				// 				formattedSize: "",
				// 			};
				// 		}),
				// 	};
				// });
				if (params?.page == 1) {
					list = response?.results;
				} else {
					list = [...state.comments, ...response?.results];
				}

				state.comments = list;
				state.commentsCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);

				state.comment_params = {
					...state.comment_params,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getServiceRequestComments.rejected, (state, action) => {
				state.status = "getServiceRequestComments failed";
				state.comments_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})

			//post comments Data
			.addCase(postServiceRequestComments.pending, (state, action) => {
				state.status = "postServiceRequestComments pending";
				state.comments_loading = true;
			})
			.addCase(postServiceRequestComments.fulfilled, (state, action) => {
				state.status = "postServiceRequestComments succeeded";
				state.comments_loading = false;
			})
			.addCase(postServiceRequestComments.rejected, (state, action) => {
				state.status = "postServiceRequestComments failed";
				state.comments_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const { setSelectedData, setPageParams, clearServiceRequestComments } =
	serviceRequestCommentSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const serviceRequestCommentSelector = (state: RootState) =>
	state.serviceManagement.serviceRequestComment;

// Memoized selector
export const selectServiceRequestComments = createSelector(
	[
		serviceRequestCommentSelector,
		serviceRequestSelector,
		systemSelector,
		miniSelector,
	],
	(serviceRequestComment, serviceRequest, system, mini) => ({
		serviceRequestComment,
		serviceRequest,
		system,
		mini,
	})
);

export const useServiceRequestCommentSelector = () => {
	const selectors = useAppSelector((state) =>
		selectServiceRequestComments(state)
	);
	return selectors;
};

export default serviceRequestCommentSlice.reducer;
