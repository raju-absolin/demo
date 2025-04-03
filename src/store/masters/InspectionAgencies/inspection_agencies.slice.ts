import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	getInspectionAgencies,
	getInspectionAgenciesById,
	addInspectionAgencies,
	editInspectionAgencies,
	deleteInspectionAgencies,
} from "./inspection_agencies.action";
import { RootState, useAppSelector } from "@src/store/store";
import {
	InspectionAgencies,
	InspectionAgenciesInitialState,
} from "./inspection_agencies.types";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: InspectionAgenciesInitialState = {
	error: "",
	status: "",
	loading: false,
	inspectionAgenciesList: [],
	inspectionAgenciesCount: 0,
	searchValue: "",
	drawer: false,
	masterValue: "",
	masterEditId: 0,
	isModelVisible: false,
	selectedData: {},
	filterStatus: false,
	passwordModel: false,
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
};

const inspectionAgenciesSlice = createSlice({
	name: "inspectionAgencies",
	initialState,
	reducers: {
		clearUserData: (state, action) => {
			return initialState;
		},
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
			};
		},
		setSearchValue: (state, action) => {
			return {
				...state,
				searchValue: action.payload,
			};
		},
		isModelVisible: (state, action) => {
			if (!action.payload) {
				return {
					...state,
					model: action.payload,
				};
			} else {
				return {
					...state,
					model: action.payload,
				};
			}
		},
		setMasterValue: (state, action) => {
			return {
				...state,
				masterValue: action.payload,
			};
		},
		setMasterEditId: (state, action) => {
			return {
				...state,
				masterEditId: action.payload,
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getInspectionAgencies.pending, (state, action) => {
				state.status = "getInspectionAgencies loading";
				state.loading = true;
			})
			.addCase(getInspectionAgencies.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getInspectionAgencies succeeded";
				state.loading = false;
				state.inspectionAgenciesList = response.results;
				state.inspectionAgenciesCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.masterEditId = undefined;
				state.masterValue = "";
			})
			.addCase(getInspectionAgencies.rejected, (state, action) => {
				state.status = "getInspectionAgencies failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getInspectionAgenciesById.pending, (state, action) => {
				state.status = "getInspectionAgenciesById loading";
				state.loading = true;
			})
			.addCase(getInspectionAgenciesById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.selectedData = response;
			})
			.addCase(getInspectionAgenciesById.rejected, (state, action) => {
				state.status = "getInspectionAgenciesById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addInspectionAgencies.pending, (state, action) => {
				state.status = "addInspectionAgencies loading";
				state.loading = true;
			})
			.addCase(addInspectionAgencies.fulfilled, (state, action) => {
				state.status = "addInspectionAgencies succeeded";
				state.loading = false;
			})
			.addCase(addInspectionAgencies.rejected, (state, action) => {
				state.status = "addInspectionAgencies failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(editInspectionAgencies.pending, (state, action) => {
				state.status = "editInspectionAgencies loading";
				state.loading = true;
			})
			.addCase(editInspectionAgencies.fulfilled, (state, action) => {
				state.status = "editInspectionAgencies succeeded";
				state.masterEditId = 0;
				state.masterValue = "";
				state.loading = false;
			})
			.addCase(editInspectionAgencies.rejected, (state, action) => {
				state.status = "editInspectionAgencies failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteInspectionAgencies.pending, (state, action) => {
				state.status = "deleteInspectionAgencies loading";
				state.loading = true;
			})
			.addCase(deleteInspectionAgencies.fulfilled, (state, action) => {
				state.status = "deleteInspectionAgencies succeeded";
				state.loading = false;
			})
			.addCase(deleteInspectionAgencies.rejected, (state, action) => {
				state.status = "deleteInspectionAgencies failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	clearUserData,
	setSelectedData,
	setSearchValue,
	isModelVisible,
	setMasterValue,
	setMasterEditId,
} = inspectionAgenciesSlice.actions;

export const inspectionAgenciesSelector = (state: RootState) =>
	state.masters.inspectionAgencies;

export const selectInspectionAgencies = createSelector(
	[inspectionAgenciesSelector, systemSelector, miniSelector],
	(inspectionAgencies, system, mini) => {
		return {
			inspectionAgencies,
			system,
			mini,
		};
	}
);

export const useInspectionAgencySelector = () => {
	const selectors = useAppSelector((state) =>
		selectInspectionAgencies(state)
	);
	return selectors;
};

export default inspectionAgenciesSlice.reducer;
