import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	Authorization,
	AuthorizationInitialState,
	ScreenAuthorization,
} from "./authorization.types";
import {
	getAuthorizations,
	getAuthorizationById,
	postAuthorizationData,
	editAuthorizationDataById,
	deleteAuthorization,
	getScreenAuthorizations,
	getAuthorizationHistory,
	postAuthorizationApprovals,
	postCheckAuthorization,
} from "./authorization.action";
import { RootState, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { selectManageGroups } from "../manageGroups/manage_groups.slice";

const initialState: AuthorizationInitialState = {
	error: "",
	status: "",
	loading: false,
	authorizationList: [],
	authorizationCount: 0,
	drawer: false,
	selectedData: {},
	filterStatus: false,
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	finalauthorization: false,
	model: false,
	formRows: [
		{
			temp_id: "",
			type: null,
			user_or_group: null,
		},
	],
	formRowsLoading: false,
	formRowsCount: 0,
	formRowsParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
		screen: null,
		level: "",
	},
	selectedFormData: {},

	viewModal: false,
	authorizationHistory: [],
	authorizationHistoryCount: 0,
	authorizationHistoryLoading: false,
	authorizationHistoryParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
		screen: null,
	},
	checkAuthorization: false,
	checkAuthorizationLoading: false,
	authorizationPostLoading: false,
	authorized_level: 0,
};

const authorizationSlice = createSlice({
	name: "authorization",
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
		SetSwitchAuthorization: (state, action) => {
			return {
				...state,
				selectedData: {
					...state.selectedData,
					finalauthorization: action.payload,
				},
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAuthorizations.pending, (state, action) => {
				state.status = "getAuthorizations loading";
				state.loading = true;
			})
			.addCase(getAuthorizations.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getAuthorizations succeeded";
				state.loading = false;
				state.authorizationList = response.results?.map((e) => {
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
				state.authorizationCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getAuthorizations.rejected, (state, action) => {
				state.status = "getAuthorizations failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getScreenAuthorizations.pending, (state, action) => {
				state.status = "getScreenAuthorizations loading";
				state.formRowsLoading = true;
			})
			.addCase(getScreenAuthorizations.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getScreenAuthorizations succeeded";
				state.formRowsLoading = false;
				var list: ScreenAuthorization[] = [];

				const modified_fields: ScreenAuthorization[] =
					response.results?.map((e: any) => {
						return {
							...e,
							type: e?.type
								? {
										label: e?.type_name,
										value: e?.type,
									}
								: null,
							user_or_group:
								e?.type == 1
									? e?.user?.id
										? {
												...e.user,
												label: e?.user?.fullname,
												value: e?.user?.id,
											}
										: null
									: e?.group?.id
										? {
												...e.group,
												label: e?.group?.name,
												value: e?.group?.id,
											}
										: null,
						};
					});

				if (params?.page == 1) {
					list = modified_fields;
				} else {
					list = [...state.formRows, ...modified_fields];
				}
				state.formRows = [
					{
						id: "",
						type: null,
						user_or_group: null,
					},
					...list,
				];
				state.authorizationCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.formRowsParams = {
					...state.formRowsParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getScreenAuthorizations.rejected, (state, action) => {
				state.status = "getScreenAuthorizations failed";
				state.formRowsLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getAuthorizationById.pending, (state, action) => {
				state.status = "getAuthorizationById loading";
				state.loading = true;
			})
			.addCase(getAuthorizationById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getAuthorizationById succeeded";
				state.loading = false;
				// state.finalauthorization = response?.finalauthorization;
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
			.addCase(getAuthorizationById.rejected, (state, action) => {
				state.status = "getAuthorizationById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// post user
			//post Data
			.addCase(postAuthorizationData.pending, (state, action) => {
				state.status = "postAuthorizationData loading";
				state.loading = true;
			})
			.addCase(postAuthorizationData.fulfilled, (state, action) => {
				state.status = "postAuthorizationData succeeded";
				state.loading = false;
				state.model = false;
			})
			.addCase(postAuthorizationData.rejected, (state, action) => {
				state.status = "postAuthorizationData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// edit user
			.addCase(editAuthorizationDataById.pending, (state, action) => {
				state.status = "editAuthorizationDataById loading";
				state.loading = true;
			})
			.addCase(editAuthorizationDataById.fulfilled, (state, action) => {
				state.status = "editAuthorizationDataById succeeded";
				state.loading = false;
				state.model = false;
			})
			.addCase(editAuthorizationDataById.rejected, (state, action) => {
				state.status = "editAuthorizationDataById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteAuthorization.pending, (state, action) => {
				state.status = "deleteAuthorization loading";
				state.loading = true;
			})
			.addCase(deleteAuthorization.fulfilled, (state, action) => {
				state.status = "deleteAuthorization succeeded";
				state.loading = false;
			})
			.addCase(deleteAuthorization.rejected, (state, action) => {
				state.status = "deleteAuthorization failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getAuthorizationHistory.pending, (state, action) => {
				state.status = "getAuthorizationHistory loading";
				state.authorizationHistoryLoading = true;
			})
			.addCase(getAuthorizationHistory.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getAuthorizationHistory succeeded";
				state.authorizationHistoryLoading = false;
				state.authorizationHistory = response.results;
				state.authorizationCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.authorizationHistoryParams = {
					...state.authorizationHistoryParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getAuthorizationHistory.rejected, (state, action) => {
				state.status = "getAuthorizationHistory failed";
				state.authorizationHistoryLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postAuthorizationApprovals.pending, (state, action) => {
				state.status = "postAuthorizationApprovals loading";
				state.authorizationPostLoading = true;
			})
			.addCase(postAuthorizationApprovals.fulfilled, (state, action) => {
				state.status = "postAuthorizationApprovals succeeded";
				state.authorizationPostLoading = false;
				state.authorized_level = action.payload;
			})
			.addCase(postAuthorizationApprovals.rejected, (state, action) => {
				state.status = "postAuthorizationApprovals failed";
				state.authorizationPostLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postCheckAuthorization.pending, (state, action) => {
				state.status = "postCheckAuthorization loading";
				state.checkAuthorizationLoading = true;
				state.checkAuthorization = false;
			})
			.addCase(postCheckAuthorization.fulfilled, (state, action) => {
				state.status = "postCheckAuthorization succeeded";
				state.checkAuthorizationLoading = false;
				state.checkAuthorization = true;
			})
			.addCase(postCheckAuthorization.rejected, (state, action) => {
				state.status = "postCheckAuthorization failed";
				state.checkAuthorizationLoading = false;
				state.checkAuthorization = false;
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
	SetSwitchAuthorization,
	setFormRows,
	setSelectedFormData,
	setViewModel,
} = authorizationSlice.actions;

export const AuthorizationSelector = (state: RootState) =>
	state.settings.authorization;

// Memoized selector
export const memoAuthorization = createSelector(
	[AuthorizationSelector, selectManageGroups, systemSelector, miniSelector],
	(authorization, manageGroups, system, mini) => ({
		authorization,
		manageGroups,
		system,
		mini,
	})
);
export const useAuthorizationSelector = () => {
	const selectors = useAppSelector((state) => memoAuthorization(state));
	return selectors;
};

export default authorizationSlice.reducer;
