import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	AssigneUser,
	AssigneUserInitialState,
	ScreenAssigneUser,
} from "./assignUsers.types";
import {
	getAssigneUsers,
	getAssigneUserById,
	postAssigneUserData,
	editAssigneUserDataById,
	deleteAssigneUser,
	getScreenAssigneUsers,
	getAssigneUserHistory,
	postAssigneUserApprovals,
	postCheckAssigneUser,
} from "./assignUsers.action";
import { RootState, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { selectManageGroups } from "../manageGroups/manage_groups.slice";

const initialState: AssigneUserInitialState = {
	error: "",
	status: "",
	loading: false,
	assigneUserList: [],
	assigneUserCount: 0,
	drawer: false,
	selectedData: {},
	filterStatus: false,
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	finalassigneUser: false,
	model: false,
	formRows: [],
	formRowsLoading: false,
	formRowsCount: 0,
	formRowsParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
		screen: "",
		model_path: "",
		instance_id: "",
		// level: 0,
	},
	selectedFormData: {},

	viewModal: false,
	assigneUserHistory: [],
	assigneUserHistoryCount: 0,
	assigneUserHistoryLoading: false,
	assigneUserHistoryParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
		screen: null,
	},
	checkAssigneUser: false,
	checkAssigneUserLoading: false,
	assigneUserPostLoading: false,
	authorized_level: 0,
};

const assigneUserSlice = createSlice({
	name: "assigneUser",
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
		setSelectedFormData: (state, action) => {
			return {
				...state,
				selectedFormData: action.payload,
			};
		},
		isModelVisible: (state, action) => {
			return {
				...state,
				model: action.payload,
			};
		},
		setViewModel: (state, action) => {
			return {
				...state,
				viewModal: action.payload,
			};
		},
		setFormRows: (state, action) => {
			return {
				...state,
				formRows: action.payload,
			};
		},
		SetSwitchAssigneUser: (state, action) => {
			return {
				...state,
				selectedData: {
					...state.selectedData,
					finalassigneUser: action.payload,
				},
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAssigneUsers.pending, (state, action) => {
				state.status = "getAssigneUsers loading";
				state.loading = true;
			})
			.addCase(getAssigneUsers.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getAssigneUsers succeeded";
				state.loading = false;
				state.assigneUserList = response.results?.map((e) => {
					return {
						...e,
						screen: e?.screen?.id
							? {
									...e?.screen,
									label: e?.screen?.model || "",
									value: e?.screen?.id || 0,
								}
							: null,

						levelno: e?.level || "",
					};
				});
				state.assigneUserCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getAssigneUsers.rejected, (state, action) => {
				state.status = "getAssigneUsers failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getScreenAssigneUsers.pending, (state, action) => {
				state.status = "getScreenAssigneUsers loading";
				state.formRowsLoading = true;
			})
			.addCase(getScreenAssigneUsers.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getScreenAssigneUsers succeeded";
				state.formRowsLoading = false;
				var list: ScreenAssigneUser[] = [];

				const modified_fields: ScreenAssigneUser[] = response.results;

				if (params?.page == 1) {
					list = modified_fields;
				} else {
					list = [...state.formRows, ...modified_fields];
				}
				state.formRows = list;
				state.assigneUserCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.formRowsParams = {
					...state.formRowsParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getScreenAssigneUsers.rejected, (state, action) => {
				state.status = "getScreenAssigneUsers failed";
				state.formRowsLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getAssigneUserById.pending, (state, action) => {
				state.status = "getAssigneUserById loading";
				state.loading = true;
			})
			.addCase(getAssigneUserById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getAssigneUserById succeeded";
				state.loading = false;
				// state.finalassigneUser = response?.finalassigneUser;
				state.selectedData = {
					...response,
					screen: response?.screen?.id
						? {
								...response?.screen,
								label: response?.screen?.model || "",
								value: response?.screen?.id || 0,
							}
						: null,

					levelno: response?.level || "",
				};
			})
			.addCase(getAssigneUserById.rejected, (state, action) => {
				state.status = "getAssigneUserById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// post user
			//post Data
			.addCase(postAssigneUserData.pending, (state, action) => {
				state.status = "postAssigneUserData loading";
				state.loading = true;
			})
			.addCase(postAssigneUserData.fulfilled, (state, action) => {
				state.status = "postAssigneUserData succeeded";
				state.loading = false;
				state.model = false;
			})
			.addCase(postAssigneUserData.rejected, (state, action) => {
				state.status = "postAssigneUserData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// edit user
			.addCase(editAssigneUserDataById.pending, (state, action) => {
				state.status = "editAssigneUserDataById loading";
				state.loading = true;
			})
			.addCase(editAssigneUserDataById.fulfilled, (state, action) => {
				state.status = "editAssigneUserDataById succeeded";
				state.loading = false;
				state.model = false;
			})
			.addCase(editAssigneUserDataById.rejected, (state, action) => {
				state.status = "editAssigneUserDataById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteAssigneUser.pending, (state, action) => {
				state.status = "deleteAssigneUser loading";
				state.loading = true;
			})
			.addCase(deleteAssigneUser.fulfilled, (state, action) => {
				state.status = "deleteAssigneUser succeeded";
				state.loading = false;
			})
			.addCase(deleteAssigneUser.rejected, (state, action) => {
				state.status = "deleteAssigneUser failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getAssigneUserHistory.pending, (state, action) => {
				state.status = "getAssigneUserHistory loading";
				state.assigneUserHistoryLoading = true;
			})
			.addCase(getAssigneUserHistory.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getAssigneUserHistory succeeded";
				state.assigneUserHistoryLoading = false;
				state.assigneUserHistory = response.results;
				state.assigneUserCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.assigneUserHistoryParams = {
					...state.assigneUserHistoryParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getAssigneUserHistory.rejected, (state, action) => {
				state.status = "getAssigneUserHistory failed";
				state.assigneUserHistoryLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postAssigneUserApprovals.pending, (state, action) => {
				state.status = "postAssigneUserApprovals loading";
				state.assigneUserPostLoading = true;
			})
			.addCase(postAssigneUserApprovals.fulfilled, (state, action) => {
				state.status = "postAssigneUserApprovals succeeded";
				state.assigneUserPostLoading = false;
				state.authorized_level = action.payload;
			})
			.addCase(postAssigneUserApprovals.rejected, (state, action) => {
				state.status = "postAssigneUserApprovals failed";
				state.assigneUserPostLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postCheckAssigneUser.pending, (state, action) => {
				state.status = "postCheckAssigneUser loading";
				state.checkAssigneUserLoading = true;
			})
			.addCase(postCheckAssigneUser.fulfilled, (state, action) => {
				state.status = "postCheckAssigneUser succeeded";
				state.checkAssigneUserLoading = false;
				state.checkAssigneUser = action.payload;
			})
			.addCase(postCheckAssigneUser.rejected, (state, action) => {
				state.status = "postCheckAssigneUser failed";
				state.checkAssigneUserLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	clearUserData,
	setSelectedData,
	isModelVisible,
	SetSwitchAssigneUser,
	setFormRows,
	setSelectedFormData,
	setViewModel,
} = assigneUserSlice.actions;

export const AssigneUserSelector = (state: RootState) =>
	state.settings.assigneUser;

// Memoized selector
export const memoAssigneUser = createSelector(
	[AssigneUserSelector, selectManageGroups, systemSelector, miniSelector],
	(assigneUser, manageGroups, system, mini) => ({
		assigneUser,
		manageGroups,
		system,
		mini,
	})
);
// custom hook
export const useAssigneUserSelector = () => {
	const selectors = useAppSelector((state) => memoAssigneUser(state));
	return selectors;
};

export default assigneUserSlice.reducer;
