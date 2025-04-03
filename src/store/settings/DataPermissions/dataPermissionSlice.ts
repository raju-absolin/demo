import {
	ActionReducerMapBuilder,
	AsyncThunk,
	createSelector,
	createSlice,
	PayloadAction,
} from "@reduxjs/toolkit";
import {
	deleteDataPermission,
	editDataPermission,
	getDataPermissions,
	getExcludePermission,
	getModalsList,
	getModelData,
	postDataPermission,
	postExcludePermission,
} from "./dataPermissionAction";
import { DataPermissionInitialState } from "./dataPermissionTypes";
import { RootState, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { selectManageGroups } from "../manageGroups/manage_groups.slice";

const initialState: DataPermissionInitialState = {
	status: "",
	error: "",
	loading: false,

	dataPermissionsList: [],
	dataPermissionsLoading: false,
	dataPermissionsCount: 0,
	dataPermissionsParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	modelDataList: [],
	modelDataLoading: false,
	modelDataCount: 0,
	modelDataParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	modelsList: [],
	modelsLoading: false,
	modelsCount: 0,
	modelsParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	is_exclusion: false,
	exclussionLoading: false,
	selectedData: {},
	selectedModelData: {},
};

const dataPermissionsSlice = createSlice({
	name: "dataPermissions",
	initialState,
	reducers: {
		updateDataPermissionState: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
		clearDataPermissionState: (state, action) => {
			return initialState;
		},
		clearModelData: (state, action) => {
			return {
				...state,
				modelDataList: initialState.modelDataList,
				modelDataLoading: initialState.modelDataLoading,
				modelDataCount: initialState.modelDataCount,
				modelDataParams: initialState.modelDataParams,
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getDataPermissions.pending, (state, action) => {
				state.status = "getDataPermissions loading";
				state.dataPermissionsLoading = true;
			})
			.addCase(getDataPermissions.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getDataPermissions succeeded";
				state.dataPermissionsLoading = false;
				state.dataPermissionsList = response.results;
				state.dataPermissionsCount = response.count;
				const noofpages = Math.ceil(
					response.count / state[`dataPermissionsParams`]?.page_size
				);
				const resultParams = {
					...params,
					no_of_pages: noofpages,
				};
				state.dataPermissionsParams = resultParams;
			})
			.addCase(getDataPermissions.rejected, (state, action) => {
				state.status = "getDataPermissions failed";
				state.dataPermissionsLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postDataPermission.pending, (state, action) => {
				state.status = "postDataPermission loading";
				state.dataPermissionsLoading = true;
			})
			.addCase(postDataPermission.fulfilled, (state, action) => {
				state.status = "postDataPermission succeeded";
				state.dataPermissionsLoading = false;
			})
			.addCase(postDataPermission.rejected, (state, action) => {
				state.status = "postDataPermission failed";
				state.dataPermissionsLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(editDataPermission.pending, (state, action) => {
				state.status = "editDataPermission loading";
				state.dataPermissionsLoading = true;
			})
			.addCase(editDataPermission.fulfilled, (state, action) => {
				state.status = "editDataPermission succeeded";
				state.dataPermissionsLoading = false;
			})
			.addCase(editDataPermission.rejected, (state, action) => {
				state.status = "editDataPermission failed";
				state.dataPermissionsLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteDataPermission.pending, (state, action) => {
				state.status = "deleteDataPermission loading";
				state.dataPermissionsLoading = true;
			})
			.addCase(deleteDataPermission.fulfilled, (state, action) => {
				state.status = "deleteDataPermission succeeded";
				state.dataPermissionsLoading = false;
			})
			.addCase(deleteDataPermission.rejected, (state, action) => {
				state.status = "deleteDataPermission failed";
				state.dataPermissionsLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getModalsList.pending, (state, action) => {
				state.status = "getModalsList loading";
				state.modelsLoading = true;
			})
			.addCase(getModalsList.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getModalsList succeeded";
				state.modelsLoading = false;

				var list = [];
				if (params?.page == 1) {
					list = response?.results;
				} else {
					list = [...state.modelsList, ...response?.results];
				}

				const noofpages = Math.ceil(
					response.count / state[`modelsParams`]?.page_size
				);
				const resultParams = {
					...params,
					no_of_pages: noofpages,
				};

				state.modelsList = list;
				state.modelsCount = response.count;
				state.modelsParams = resultParams;
			})
			.addCase(getModalsList.rejected, (state, action) => {
				state.status = "getModalsList failed";
				state.modelsLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getModelData.pending, (state, action) => {
				state.status = "getModelData loading";
				state.modelDataLoading = true;
			})
			.addCase(getModelData.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getModelData succeeded";
				state.modelDataLoading = false;

				var list = [];
				if (params?.page == 1) {
					list = response?.results;
				} else {
					list = [...state.modelDataList, ...response?.results];
				}

				const noofpages = Math.ceil(
					response.count / state?.modelDataParams?.page_size
				);
				const resultParams = {
					...params,
					no_of_pages: noofpages,
				};

				state.modelDataList =
					list as DataPermissionInitialState["modelDataList"];
				state.modelDataCount = response.count;
				state.modelDataParams = resultParams;
			})
			.addCase(getModelData.rejected, (state, action) => {
				state.status = "getModelData failed";
				state.modelDataLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getExcludePermission.pending, (state, action) => {
				state.status = "getExcludePermission loading";
				state.exclussionLoading = true;
			})
			.addCase(getExcludePermission.fulfilled, (state, action) => {
				state.status = "getExcludePermission succeeded";
				state.exclussionLoading = false;
				const a = action.payload?.pop()?.exclusions;
				state.is_exclusion = a || false;
			})
			.addCase(getExcludePermission.rejected, (state, action) => {
				state.status = "getExcludePermission failed";
				state.exclussionLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postExcludePermission.pending, (state, action) => {
				state.status = "postExcludePermission loading";
				state.exclussionLoading = true;
			})
			.addCase(postExcludePermission.fulfilled, (state, action) => {
				state.status = "postExcludePermission succeeded";
				state.exclussionLoading = false;
				const a = action.payload?.pop()?.exclusions;
				state.is_exclusion = a || false;
			})
			.addCase(postExcludePermission.rejected, (state, action) => {
				state.status = "postExcludePermission failed";
				state.exclussionLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

export const {
	updateDataPermissionState,
	clearDataPermissionState,
	clearModelData,
} = dataPermissionsSlice.actions;

export const dataPermissionSelector = (state: RootState) =>
	state.settings.dataPermissions;

// Memoized selector
export const memoDataPermission = createSelector(
	[dataPermissionSelector, selectManageGroups, systemSelector, miniSelector],
	(dataPermissions, manageProfile, system, mini) => ({
		dataPermissions,
		manageProfile,
		system,
		mini,
	})
);

export const useDataPermissionSelector = () => {
	const selectors = useAppSelector((state) => memoDataPermission(state));
	return selectors;
};

export default dataPermissionsSlice.reducer;
