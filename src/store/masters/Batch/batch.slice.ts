import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	getBatchs,
	getBatchsById,
	addBatchs,
	deleteBatchs,
} from "./batch.action";
import { RootState } from "@src/store/store";
import { Batch, BatchsInitialState } from "./batch.types";
import { systemSelector } from "@src/store/system/system.slice";

const initialState: BatchsInitialState = {
	error: "",
	status: "",
	loading: false,
	model: false,
	batchsList: [],
	batchsCount: 0,
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

const batchSlice = createSlice({
	name: "batch",
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
			.addCase(getBatchs.pending, (state, action) => {
				state.status = "getBatchs loading";
				state.loading = true;
			})
			.addCase(getBatchs.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getBatchs succeeded";
				state.loading = false;
				state.batchsList = response.results;
				state.batchsCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getBatchs.rejected, (state, action) => {
				state.status = "getBatchs failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getBatchsById.pending, (state, action) => {
				state.status = "getBatchsById loading";
				state.loading = true;
			})
			.addCase(getBatchsById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getBatchsById.rejected, (state, action) => {
				state.status = "getBatchsById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addBatchs.pending, (state, action) => {
				state.status = "addBatchs loading";
				state.loading = true;
			})
			.addCase(addBatchs.fulfilled, (state, action) => {
				state.status = "addBatchs succeeded";
				// state.loading = false;
			})
			.addCase(addBatchs.rejected, (state, action) => {
				state.status = "addBatchs failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteBatchs.pending, (state, action) => {
				state.status = "deleteBatchs loading";
				state.loading = true;
			})
			.addCase(deleteBatchs.fulfilled, (state, action) => {
				state.status = "deleteBatchs succeeded";
				state.loading = false;
			})
			.addCase(deleteBatchs.rejected, (state, action) => {
				state.status = "deleteBatchs failed";
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
} = batchSlice.actions;

export const batchSelector = (state: RootState) => state.masters.batch;

export const selectBatchs = createSelector(
	[batchSelector, systemSelector],
	(batch, system) => {
		return {
			batch,
			system,
		};
	}
);

export default batchSlice.reducer;
