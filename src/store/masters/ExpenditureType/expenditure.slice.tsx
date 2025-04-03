import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	getExpenditureType,
	getExpenditureTypeById,
	addExpenditureType,
	deleteExpenditureType,
} from "./expenditure.action";
import { RootState } from "@src/store/store";
import { ExpenditureType, ExpenditureTypeInitialState } from "./expenditure.types";
import { systemSelector } from "@src/store/system/system.slice";

const initialState: ExpenditureTypeInitialState = {
	error: "",
	status: "",
	loading: false,
	model: false,
	expenditureTypeList: [],
	expenditureTypeCount: 0,
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

const expenditureTypeSlice = createSlice({
	name: "expenditureType",
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
			.addCase(getExpenditureType.pending, (state, action) => {
				state.status = "getExpenditureType loading";
				state.loading = true;
			})
			.addCase(getExpenditureType.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getExpenditureType succeeded";
				state.loading = false;
				state.expenditureTypeList = response.results;
				state.expenditureTypeCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getExpenditureType.rejected, (state, action) => {
				state.status = "getExpenditureType failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getExpenditureTypeById.pending, (state, action) => {
				state.status = "getExpenditureTypeById loading";
				state.loading = true;
			})
			.addCase(getExpenditureTypeById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getExpenditureTypeById.rejected, (state, action) => {
				state.status = "getExpenditureTypeById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addExpenditureType.pending, (state, action) => {
				state.status = "addExpenditureType loading";
				state.loading = true;
			})
			.addCase(addExpenditureType.fulfilled, (state, action) => {
				state.status = "addExpenditureType succeeded";
				// state.loading = false;
			})
			.addCase(addExpenditureType.rejected, (state, action) => {
				state.status = "addExpenditureType failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteExpenditureType.pending, (state, action) => {
				state.status = "deleteExpenditureType loading";
				state.loading = true;
			})
			.addCase(deleteExpenditureType.fulfilled, (state, action) => {
				state.status = "deleteExpenditureType succeeded";
				state.loading = false;
			})
			.addCase(deleteExpenditureType.rejected, (state, action) => {
				state.status = "deleteExpenditureType failed";
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
} = expenditureTypeSlice.actions;

export const expenditureTypeSelector = (state: RootState) => state.masters.expenditureType;

export const selectExpenditureType = createSelector(
	[expenditureTypeSelector, systemSelector],
	(expenditureType, system) => {
		return {
			expenditureType,
			system,
		};
	}
);

export default expenditureTypeSlice.reducer;
