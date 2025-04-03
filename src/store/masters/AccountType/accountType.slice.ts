import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	getAccountTypes,
	getAccountTypesById,
	addAccountTypes,
} from "./accountType.action";
import { RootState, useAppSelector } from "@src/store/store";
import { AccountTypes, AccountTypesInitialState } from "./accountType.types";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: AccountTypesInitialState = {
	error: "",
	status: "",
	loading: false,
	accountTypesList: [],
	accountTypesCount: 0,
	searchValue: "",
	drawer: false,
	masterValue: "",
	isModelVisible: false,
	filterStatus: false,
	passwordModel: false,
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
};

const accountTypeSlice = createSlice({
	name: "accountTypes",
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
				isModelVisible: action.payload,
			};
		},
		setMasterValue: (state, action) => {
			return {
				...state,
				masterValue: action.payload,
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAccountTypes.pending, (state, action) => {
				state.status = "getAccountTypes loading";
				state.loading = true;
			})
			.addCase(getAccountTypes.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getAccountTypes succeeded";
				state.loading = false;
				state.accountTypesList = response.results;
				state.accountTypesCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getAccountTypes.rejected, (state, action) => {
				state.status = "getAccountTypes failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getAccountTypesById.pending, (state, action) => {
				state.status = "getAccountTypesById loading";
				state.loading = true;
			})
			.addCase(getAccountTypesById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getAccountTypesById.rejected, (state, action) => {
				state.status = "getAccountTypesById failed";
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addAccountTypes.pending, (state, action) => {
				state.status = "addAccountTypes loading";
			})
			.addCase(addAccountTypes.fulfilled, (state, action) => {
				state.status = "addAccountTypes succeeded";
				// state.loading = false;
			})
			.addCase(addAccountTypes.rejected, (state, action) => {
				state.status = "addAccountTypes failed";
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
} = accountTypeSlice.actions;

export const accountTypeSelector = (state: RootState) =>
	state.masters.accountTypes;

export const selectAccountType = createSelector(
	[accountTypeSelector, systemSelector, miniSelector],
	(accountTypes, system, mini) => ({
		accountTypes,
		system,
		mini,
	})
);

export const useDeparmentSelector = () => {
	const selectors = useAppSelector((state) => selectAccountType(state));
	return selectors;
};

export default accountTypeSlice.reducer;
