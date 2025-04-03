import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	DepartmentUser,
	DepartmentUsersInitialState,
} from "./department_users.types";
import {
	deleteDepartmentUser,
	editMangeDepartmentUsersDataById,
	getDepartmentUserById,
	getDepartmentUsers,
	postMangeDepartmentUsersData,
} from "./department_users.action";
import { RootState, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: DepartmentUsersInitialState = {
	error: "",
	status: "",
	loading: false,
	list: [],
	count: 0,
	isModalOpen: false,
	isFilterOpen: false,
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
};

const departmentUsersSlice = createSlice({
	name: "departmentUsers",
	initialState,
	reducers: {
		clearDepartmentUserData: () => {
			return initialState;
		},
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
			};
		},
		setIsModalOpen: (state, action) => {
			return {
				...state,
				isModalOpen: action.payload.isOpen,
				selectedData: action.payload.data,
			};
		},
		setIsFilterOpen: (state, action) => {
			return {
				...state,
				isFilterOpen: action.payload,
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getDepartmentUsers.pending, (state, action) => {
				state.status = "getDepartmentUsers loading";
				state.loading = true;
			})
			.addCase(getDepartmentUsers.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getDepartmentUsers succeeded";
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
			.addCase(getDepartmentUsers.rejected, (state, action) => {
				state.status = "getDepartmentUsers failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getDepartmentUserById.pending, (state, action) => {
				state.status = "getDepartmentUserById loading";
				state.loading = true;
			})
			.addCase(getDepartmentUserById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.selectedData = response;
				state.loading = false;
			})
			.addCase(getDepartmentUserById.rejected, (state, action) => {
				state.status = "getDepartmentUserById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// post user
			//post Data
			.addCase(postMangeDepartmentUsersData.pending, (state, action) => {
				state.status = "loading";
				state.loading = true;
			})
			.addCase(
				postMangeDepartmentUsersData.fulfilled,
				(state, action) => {
					state.status = "succeeded";
					state.loading = false;
				}
			)
			.addCase(postMangeDepartmentUsersData.rejected, (state, action) => {
				state.status = "failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// edit user
			.addCase(
				editMangeDepartmentUsersDataById.pending,
				(state, action) => {
					state.status = "loading";
					state.loading = true;
				}
			)
			.addCase(
				editMangeDepartmentUsersDataById.fulfilled,
				(state, action) => {
					state.status = "succeeded";
					state.loading = false;
				}
			)
			.addCase(
				editMangeDepartmentUsersDataById.rejected,
				(state, action) => {
					state.status = "failed";
					state.loading = false;
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			)
			// delete user
			.addCase(deleteDepartmentUser.pending, (state, action) => {
				state.status = "loading";
				state.loading = true;
			})
			.addCase(deleteDepartmentUser.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.loading = false;
			})
			.addCase(deleteDepartmentUser.rejected, (state, action) => {
				state.status = "failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	clearDepartmentUserData,
	setSelectedData,
	setIsFilterOpen,
	setIsModalOpen,
} = departmentUsersSlice.actions;

export const selectDepartmentUsers = (state: RootState) =>
	state.settings.departmentUsers;

// Memoized selector
export const departmentUserSelector = createSelector(
	[selectDepartmentUsers, systemSelector, miniSelector],
	(departmentUsers, system, mini) => ({
		departmentUsers,
		system,
		mini,
	})
);

export const useDepartmentUserSelector = () => {
	const selectors = useAppSelector((state) => departmentUserSelector(state));
	return selectors;
};

export default departmentUsersSlice.reducer;
