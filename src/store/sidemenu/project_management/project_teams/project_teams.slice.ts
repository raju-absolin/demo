import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState, useAppDispatch } from "@src/store/store";

import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

import { purchaseIndentSelector } from "../purchaseIndent/purchase_indent.slice";
import { ProjectTeamsState } from "./project_teams.types";
import {
	editProjectTeams,
	getProjectTeams,
	getProjectTeamsById,
	postTeamMembers,
} from "./project_teams.action";
import { Team } from "../work_order/work_order.types";
import { workOrdersSelectors } from "../work_order/work_order.slice";

const initialState: ProjectTeamsState = {
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
};

const projectTeamsSlice = createSlice({
	name: "projectTeams",
	initialState,
	reducers: {
		updateProjectTeamsState: (state, action) => {
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
	},
	extraReducers(builder) {
		builder
			.addCase(getProjectTeams.pending, (state, action) => {
				state.status = "getProjectTeams pending";
				state.loading = true;
			})
			.addCase(getProjectTeams.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getProjectTeams succeeded";
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
			.addCase(getProjectTeams.rejected, (state, action) => {
				state.status = "getProjectTeams failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getProjectTeamsById.pending, (state, action) => {
				state.status = "getProjectTeamsById pending";
				state.loading = true;
			})
			.addCase(getProjectTeamsById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getProjectTeamsById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
				};
			})
			.addCase(getProjectTeamsById.rejected, (state, action) => {
				state.status = "getProjectTeamsById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postTeamMembers.pending, (state, action) => {
				state.status = "postTeamMembers pending";
				state.loading = true;
			})
			.addCase(postTeamMembers.fulfilled, (state, action) => {
				state.status = "postTeamMembers succeeded";
				state.loading = false;
			})
			.addCase(postTeamMembers.rejected, (state, action) => {
				state.status = "postTeamMembers failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editProjectTeams.pending, (state, action) => {
				state.status = "editProjectTeams pending";
				state.loading = true;
			})
			.addCase(editProjectTeams.fulfilled, (state, action) => {
				state.status = "editProjectTeams succeeded";
				state.loading = false;
			})
			.addCase(editProjectTeams.rejected, (state, action) => {
				state.status = "editProjectTeams failed";
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
	updateProjectTeamsState,
} = projectTeamsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const projectTeamsSelector = (state: RootState) =>
	state.projectManagement.projectTeams;

// Memoized selector
export const selectTeams = createSelector(
	[
		projectTeamsSelector,
		workOrdersSelectors,
		systemSelector,
		selectManageGroups,
		miniSelector,
	],
	(teams, workOrder, system, groups, mini) => ({
		teams,
		workOrder,
		system,
		groups,
		mini,
	})
);

export default projectTeamsSlice.reducer;
