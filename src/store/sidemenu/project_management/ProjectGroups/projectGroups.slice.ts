import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState, useAppDispatch } from "@src/store/store";

import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

import { purchaseIndentSelector } from "../purchaseIndent/purchase_indent.slice";
import { ProjectGroupsState } from "./projectGroups.types";
import {
	editProjectGroups,
	getProjectGroups,
	getProjectGroupsById,
	getProjectGroupUsers,
	getProjectGroupUsersById,
	postProjectGroup,
	postProjectGroupUser,
} from "./projectGroups.action";
import { workOrdersSelectors } from "../work_order/work_order.slice";

const initialState: ProjectGroupsState = {
	loading: false,
	status: "",
	error: "",
	list: [],
	count: 0,
	selectedData: {},
	modal: false,
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},

	selectedGroupUser: {},
	showUserAdd: false,
	group_user_modal: false,
	group_user_loading: false,
	group_users_list: [],
	group_users_count: 0,
	group_users_params: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
		group: "",
	},
};

const projectGroupsSlice = createSlice({
	name: "projectGroups",
	initialState,
	reducers: {
		updateProjectGroupsState: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
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
		setGroupUserModalOpen: (state, action) => {
			return {
				...state,
				group_user_modal: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getProjectGroups.pending, (state, action) => {
				state.status = "getProjectGroups pending";
				state.loading = true;
			})
			.addCase(getProjectGroups.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getProjectGroups succeeded";
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
			.addCase(getProjectGroups.rejected, (state, action) => {
				state.status = "getProjectGroups failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getProjectGroupUsers.pending, (state, action) => {
				state.status = "getProjectGroupUsers pending";
				state.group_user_loading = true;
			})
			.addCase(getProjectGroupUsers.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getProjectGroupUsers succeeded";
				state.group_user_loading = false;
				state.group_users_list = response.results;
				state.group_users_count = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.group_users_params = {
					...state.group_users_params,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getProjectGroupUsers.rejected, (state, action) => {
				state.status = "getProjectGroupUsers failed";
				state.group_user_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getProjectGroupsById.pending, (state, action) => {
				state.status = "getProjectGroupsById pending";
				state.loading = true;
			})
			.addCase(getProjectGroupsById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getProjectGroupsById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
				};
			})
			.addCase(getProjectGroupsById.rejected, (state, action) => {
				state.status = "getProjectGroupsById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getProjectGroupUsersById.pending, (state, action) => {
				state.status = "getProjectGroupUsersById pending";
				state.group_user_loading = true;
			})
			.addCase(getProjectGroupUsersById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getProjectGroupUsersById succeeded";
				state.group_user_loading = false;
				state.selectedGroupUser = {
					...response,
				};
			})
			.addCase(getProjectGroupUsersById.rejected, (state, action) => {
				state.status = "getProjectGroupUsersById failed";
				state.group_user_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postProjectGroup.pending, (state, action) => {
				state.status = "postProjectGroup pending";
				state.loading = true;
			})
			.addCase(postProjectGroup.fulfilled, (state, action) => {
				state.status = "postProjectGroup succeeded";
				state.loading = false;
			})
			.addCase(postProjectGroup.rejected, (state, action) => {
				state.status = "postProjectGroup failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postProjectGroupUser.pending, (state, action) => {
				state.status = "postProjectGroupUser pending";
				state.group_user_loading = true;
			})
			.addCase(postProjectGroupUser.fulfilled, (state, action) => {
				state.status = "postProjectGroupUser succeeded";
				state.group_user_loading = false;
			})
			.addCase(postProjectGroupUser.rejected, (state, action) => {
				state.status = "postProjectGroupUser failed";
				state.group_user_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editProjectGroups.pending, (state, action) => {
				state.status = "editProjectGroups pending";
				state.loading = true;
			})
			.addCase(editProjectGroups.fulfilled, (state, action) => {
				state.status = "editProjectGroups succeeded";
				state.loading = false;
			})
			.addCase(editProjectGroups.rejected, (state, action) => {
				state.status = "editProjectGroups failed";
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
	updateProjectGroupsState,
	setGroupUserModalOpen,
} = projectGroupsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const projectGroupsSelector = (state: RootState) =>
	state.projectManagement.projectGroups;

// Memoized selector
export const selectGroups = createSelector(
	[
		projectGroupsSelector,
		workOrdersSelectors,
		systemSelector,
		selectManageGroups,
		miniSelector,
	],
	(projectGroups, workOrder, system, groups, mini) => ({
		projectGroups,
		workOrder,
		system,
		groups,
		mini,
	})
);

export default projectGroupsSlice.reducer;
