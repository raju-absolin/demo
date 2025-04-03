import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@src/store/store";
import {
	ServiceRequestAttachment,
	ServiceRequestAttachmentsState,
} from "./serviceRequestAttachments.types";
import {
	editServiceRequestAttachmentData,
	getServiceRequestAttachmentById,
	getServiceRequestAttachments,
	postServiceRequestAttachmentData,
} from "./serviceRequestAttachments.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: ServiceRequestAttachmentsState = {
	loading: false,
	status: "",
	error: "",
	list: [],
	count: 0,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

const serviceRequestAttachmentSlice = createSlice({
	name: "serviceRequestAttachment",
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
				pageParams: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getServiceRequestAttachments.pending, (state, action) => {
				state.status = "getServiceRequestAttachments pending";
				state.loading = true;
			})
			.addCase(
				getServiceRequestAttachments.fulfilled,
				(state, action) => {
					const { response, params } = action.payload;
					state.status = "getServiceRequestAttachments succeeded";
					state.loading = false;

					var list = [];
					if (params?.page == 1) {
						list = response.results;
					} else {
						list = [...state.list, ...response.results];
					}

					list = list
						? list?.map((document) => {
								const split: string[] | undefined =
									document?.file?.split("/");
								return {
									...document,
									path: split ? split[split.length - 1] : "",
									preview: document?.file,
									formattedSize: "",
								};
							})
						: [];

					state.list = list as any;

					state.count = response.count;
					var noofpages = Math.ceil(
						response.count / params.page_size
					);

					state.pageParams = {
						...state.pageParams,
						...params,
						no_of_pages: noofpages,
					};
				}
			)
			.addCase(getServiceRequestAttachments.rejected, (state, action) => {
				state.status = "getServiceRequestAttachments failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(
				getServiceRequestAttachmentById.pending,
				(state, action) => {
					state.status = "getServiceRequestAttachmentById pending";
					state.loading = true;
				}
			)
			.addCase(
				getServiceRequestAttachmentById.fulfilled,
				(state, action) => {
					const { response } = action.payload;
					state.status = "getServiceRequestAttachmentById succeeded";
					state.loading = false;

					const split: string[] | undefined =
						response?.file?.split("/");
					state.selectedData = {
						...response,
						path: split ? split[split.length - 1] : "",
						preview: response?.file,
						formattedSize: "",
					};
				}
			)
			.addCase(
				getServiceRequestAttachmentById.rejected,
				(state, action) => {
					state.status = "getServiceRequestAttachmentById failed";
					state.loading = false;
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			)
			//post Data
			.addCase(
				postServiceRequestAttachmentData.pending,
				(state, action) => {
					state.status = "postServiceRequestAttachmentData pending";
					state.loading = true;
				}
			)
			.addCase(
				postServiceRequestAttachmentData.fulfilled,
				(state, action) => {
					state.status = "postServiceRequestAttachmentData succeeded";
					state.loading = false;
				}
			)
			.addCase(
				postServiceRequestAttachmentData.rejected,
				(state, action) => {
					state.status = "postServiceRequestAttachmentData failed";
					state.loading = false;
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			)
			//edit Data
			.addCase(
				editServiceRequestAttachmentData.pending,
				(state, action) => {
					state.status = "editServiceRequestAttachmentData pending";
					state.loading = true;
				}
			)
			.addCase(
				editServiceRequestAttachmentData.fulfilled,
				(state, action) => {
					state.status = "editServiceRequestAttachmentData succeeded";
					state.loading = false;
				}
			)
			.addCase(
				editServiceRequestAttachmentData.rejected,
				(state, action) => {
					state.status = "editServiceRequestAttachmentData failed";
					state.loading = false;
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			);
	},
});

// Action creators are generated for each case reducer function
export const { setSelectedData, setPageParams } =
	serviceRequestAttachmentSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const serviceRequestAttachmentSelector = (state: RootState) =>
	state.serviceManagement.serviceRequestAttachment;

// Memoized selector
export const selectServiceRequestAttachmentsAttachments = createSelector(
	[serviceRequestAttachmentSelector, systemSelector, miniSelector],
	(serviceRequestAttachment, system, mini) => ({
		serviceRequestAttachment,
		system,
		mini,
	})
);

export const useServiceRequestAttachmentSelector = () => {
	const selectors = useAppSelector((state) =>
		selectServiceRequestAttachmentsAttachments(state)
	);
	return selectors;
};

export default serviceRequestAttachmentSlice.reducer;
