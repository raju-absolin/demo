import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	getStages,
	getStagesById,
	addStages,
	deleteStages,
} from "./stages.action";
import { RootState } from "@src/store/store";
import { Stage, StagesInitialState } from "./stages.types";
import { systemSelector } from "@src/store/system/system.slice";

const initialState: StagesInitialState = {
	error: "",
	status: "",
	loading: false,
	model: false,
	stagesList: [],
	stagesCount: 0,
	searchValue: "",
	drawer: false,
	masterValue: "",
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
	masterEditId: 0,
};

const stagesSlice = createSlice({
	name: "stages",
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
			return {
				...state,
				model: action.payload,
			};
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
			.addCase(getStages.pending, (state, action) => {
				state.status = "getStages loading";
				state.loading = true;
			})
			.addCase(getStages.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getStages succeeded";
				state.loading = false;
				state.stagesList = response.results;
				state.stagesCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getStages.rejected, (state, action) => {
				state.status = "getStages failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getStagesById.pending, (state, action) => {
				state.status = "getStagesById loading";
				state.loading = true;
			})
			.addCase(getStagesById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getStagesById.rejected, (state, action) => {
				state.status = "getStagesById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addStages.pending, (state, action) => {
				state.status = "addStages loading";
				state.loading = true;
			})
			.addCase(addStages.fulfilled, (state, action) => {
				state.status = "addStages succeeded";
				// state.loading = false;
			})
			.addCase(addStages.rejected, (state, action) => {
				state.status = "addStages failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteStages.pending, (state, action) => {
				state.status = "deleteStages loading";
				state.loading = true;
			})
			.addCase(deleteStages.fulfilled, (state, action) => {
				state.status = "deleteStages succeeded";
				state.loading = false;
			})
			.addCase(deleteStages.rejected, (state, action) => {
				state.status = "deleteStages failed";
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
} = stagesSlice.actions;

export const stagesSelector = (state: RootState) => state.masters.stages;

export const selectStages = createSelector(
	[stagesSelector, systemSelector],
	(stages, system) => {
		return {
			stages,
			system,
		};
	}
);

export default stagesSlice.reducer;
