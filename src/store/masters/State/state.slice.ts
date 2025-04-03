import { createSlice } from "@reduxjs/toolkit";
import {
	getStates,
	getStatesById,
	addStates,
	getStatesMini,
	deleteState,
} from "./state.action";
import { RootState } from "@src/store/store";
import { States, StatesInitialState } from "./state.types";

const initialState: StatesInitialState = {
	error: "",
	status: "",
	loading: false,
	statesList: [],
	statesCount: 0,
	searchValue: "",
	drawer: false,
	masterValue: "",
	isModelVisible: false,
	isFilterOpen: false,
	selectedData: {},
	filterStatus: false,
	passwordModel: false,
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	masterEditId: 0,
};

const stateSlice = createSlice({
	name: "states",
	initialState,
	reducers: {
		clearUserData: (state, action) => {
			return initialState;
		},
		setIsPasswordModel: (state, action) => {
			return {
				...state,
				passwordModel: action.payload,
			};
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
		setIsFilterOpen: (state, action) => {
			return {
				...state,
				isFilterOpen: action.payload,
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getStates.pending, (state, action) => {
				state.status = "getStates loading";
				state.loading = true;
			})
			.addCase(getStates.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getStates succeeded";
				state.loading = false;
				state.statesList = response.results;
				state.statesCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getStates.rejected, (state, action) => {
				state.status = "getStates failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getStatesById.pending, (state, action) => {
				state.status = "getStatesById loading";
				state.loading = true;
			})
			.addCase(getStatesById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getStatesById.rejected, (state, action) => {
				state.status = "getStatesById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addStates.pending, (state, action) => {
				state.status = "addStates loading";
				state.loading = true;
			})
			.addCase(addStates.fulfilled, (state, action) => {
				state.status = "addStates succeeded";
				// state.loading = false;
			})
			.addCase(addStates.rejected, (state, action) => {
				state.status = "addStates failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getStatesMini.pending, (state, action) => {
				state.status = "getStatesMini loading";
				state.loading = true;
			})
			.addCase(getStatesMini.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getStatesMini succeeded";
				state.loading = false;
				state.statesList = response.results;
				state.statesCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getStatesMini.rejected, (state, action) => {
				state.status = "getStatesMini failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteState.pending, (state, action) => {
				state.status = "deleteState loading";
				state.loading = true;
			})
			.addCase(deleteState.fulfilled, (state, action) => {
				state.status = "deleteState succeeded";
				state.loading = false;
			})
			.addCase(deleteState.rejected, (state, action) => {
				state.status = "deleteState failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	clearUserData,
	setIsPasswordModel,
	setSelectedData,
	setSearchValue,
	isModelVisible,
	setMasterValue,
	setMasterEditId,
	setIsFilterOpen,
} = stateSlice.actions;

export const stateSelector = (state: RootState) => state.masters.states;

export default stateSlice.reducer;
