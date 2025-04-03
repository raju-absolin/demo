import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@src/store/store";
import { ServiceRequestApprovalsState } from "./serviceRequestApprovals.types";
import {
	ChangeServiceRequestStatus,
	editServiceRequestData,
	getServiceRequestById,
	getServiceRequestApprovals,
	postServiceRequestData,
} from "./serviceRequestApprovals.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: ServiceRequestApprovalsState = {
	loading: false,
	loading_documents: false,
	status: "",
	error: "",
	list: [],
	count: 0,
	isModalVisible: false,
	openViewModal: false,
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	uploadDocuments: [],

	selectedData: {},

	status_loading: false,
	status_modal_open: false,

	department_user_loading: false,
	department_user_modal_open: false,
	selected_department_users: [],
};

const serviceRequestSlice = createSlice({
	name: "serviceRequest",
	initialState,
	reducers: {
		isModalOpen: (state, action) => {
			return {
				...state,
				isModalVisible: action.payload,
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
		setOpenStatusModal: (state, action) => {
			return {
				...state,
				status_modal_open: action.payload,
			};
		},
		setOpenDepartmentUserModal: (state, action) => {
			return {
				...state,
				department_user_modal_open: action.payload,
			};
		},
		setSelectedUsers: (state, action) => {
			return {
				...state,
				selected_department_users: action.payload,
			};
		},
		setOpenViewModal: (state, action) => {
			return {
				...state,
				openViewModal: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getServiceRequestApprovals.pending, (state, action) => {
				state.status = "getServiceRequestApprovals pending";
				state.loading = true;
			})
			.addCase(getServiceRequestApprovals.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getServiceRequestApprovals succeeded";
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
			.addCase(getServiceRequestApprovals.rejected, (state, action) => {
				state.status = "getServiceRequestApprovals failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getServiceRequestById.pending, (state, action) => {
				state.status = "getServiceRequestById pending";
				state.loading = true;
			})
			.addCase(getServiceRequestById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getServiceRequestById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
				};
			})
			.addCase(getServiceRequestById.rejected, (state, action) => {
				state.status = "getServiceRequestById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postServiceRequestData.pending, (state, action) => {
				state.status = "postServiceRequestData pending";
				state.loading = true;
			})
			.addCase(postServiceRequestData.fulfilled, (state, action) => {
				state.status = "postServiceRequestData succeeded";
				state.loading = false;
			})
			.addCase(postServiceRequestData.rejected, (state, action) => {
				state.status = "postServiceRequestData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editServiceRequestData.pending, (state, action) => {
				state.status = "editServiceRequestData pending";
				state.loading = true;
			})
			.addCase(editServiceRequestData.fulfilled, (state, action) => {
				state.status = "editServiceRequestData succeeded";
				state.loading = false;
			})
			.addCase(editServiceRequestData.rejected, (state, action) => {
				state.status = "editServiceRequestData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(ChangeServiceRequestStatus.pending, (state, action) => {
				state.status = "ChangeServiceRequestStatus pending";
				state.status_loading = true;
			})
			.addCase(ChangeServiceRequestStatus.fulfilled, (state, action) => {
				state.status = "ChangeServiceRequestStatus succeeded";
				state.status_loading = false;
			})
			.addCase(ChangeServiceRequestStatus.rejected, (state, action) => {
				state.status = "ChangeServiceRequestStatus failed";
				state.status_loading = false;
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
	setUploadDocument,
	setOpenStatusModal,
	setOpenDepartmentUserModal,
	setSelectedUsers,
	setOpenViewModal,
} = serviceRequestSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const serviceRequestSelector = (state: RootState) =>
	state.serviceManagement.serviceRequestApproval;

// Memoized selector
export const selectServiceRequests = createSelector(
	[serviceRequestSelector, systemSelector, miniSelector],
	(serviceRequest, system, mini) => ({
		serviceRequest,
		system,
		mini,
	})
);

export const useServiceRequestSelector = () => {
	const selectors = useAppSelector((state) => selectServiceRequests(state));
	return selectors;
};

export default serviceRequestSlice.reducer;
