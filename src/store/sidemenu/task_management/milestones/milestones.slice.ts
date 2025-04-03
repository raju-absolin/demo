import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { MileStonesState } from "./milestones.types";
import {
	editMileStoneData,
	getMileStones,
	postMileStoneData,
} from "./milestones.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: MileStonesState = {
	loading: false,
	status: "",
	error: "",
	modal: false,
	list: [],
	count: 0,
	selectedData: null,
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
		project: "",
	},
};

const mileStonesSlice = createSlice({
	name: "mileStones",
	initialState,
	reducers: {
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
			.addCase(getMileStones.pending, (state, action) => {
				state.status = "getMileStones pending";
				state.loading = true;
			})
			.addCase(getMileStones.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getMileStones succeeded";
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
			.addCase(getMileStones.rejected, (state, action) => {
				state.status = "getMileStones failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postMileStoneData.pending, (state, action) => {
				state.status = "postMileStoneData pending";
				state.loading = true;
			})
			.addCase(postMileStoneData.fulfilled, (state, action) => {
				state.status = "postMileStoneData succeeded";
				state.loading = false;
			})
			.addCase(postMileStoneData.rejected, (state, action) => {
				state.status = "postMileStoneData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editMileStoneData.pending, (state, action) => {
				state.status = "editMileStoneData pending";
				state.loading = true;
			})
			.addCase(editMileStoneData.fulfilled, (state, action) => {
				state.status = "editMileStoneData succeeded";
				state.loading = false;
			})
			.addCase(editMileStoneData.rejected, (state, action) => {
				state.status = "editMileStoneData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const { isModalOpen, setSelectedData, setIsFilterOpen, setPageParams } =
	mileStonesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const mileStonesSelector = (state: RootState) =>
	state.taskManagement.mileStones;

export const selectMileStones = createSelector(
	[mileStonesSelector, systemSelector, miniSelector],
	(mileStones, system, mini) => ({
		mileStones,
		system,
		mini,
	})
);

export default mileStonesSlice.reducer;
