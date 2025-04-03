import { createSelector, createSlice } from "@reduxjs/toolkit";
import { getLoggedInUsers } from "./current_logged_users.action";
import { CurrentLoggedUsersInitialState } from "./current_logged_users.types";
import { RootState, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: CurrentLoggedUsersInitialState = {
	error: "",
	status: "",
	loading: false,
	list: [],
	count: 0,
	drawer: false,
	filterStatus: false,
	selectedData: {},
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
};
const loggedUsers = createSlice({
	name: "loggedUsers",
	initialState,
	reducers: {
		clearUserData: () => {
			return initialState;
		},
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getLoggedInUsers.pending, (state, action) => {
				state.status = "getLoggedInUsers loading";
				state.loading = true;
			})
			.addCase(getLoggedInUsers.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getLoggedInUsers succeeded";
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
			.addCase(getLoggedInUsers.rejected, (state, action) => {
				state.status = "getLoggedInUsers failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

export const { clearUserData, setSelectedData } = loggedUsers.actions;

export const selectLoggedUsers = (state: RootState) =>
	state.settings.loggedUsers;

// Memoized selector
export const memoLoggedUser = createSelector(
	[selectLoggedUsers, systemSelector, miniSelector],
	(loggedUsers, system, mini) => ({
		loggedUsers,
		system,
		mini,
	})
);

export const useLoggedUserSelector = () => {
	const selectors = useAppSelector((state) => memoLoggedUser(state));
	return selectors;
};

export default loggedUsers.reducer;
