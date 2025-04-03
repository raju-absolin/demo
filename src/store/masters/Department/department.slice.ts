import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	getDepartments,
	getDepartmentsById,
	addDepartments,
} from "./department.action";
import { RootState, useAppSelector } from "@src/store/store";
import { Departments, DepartmentsInitialState } from "./departments.types";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: DepartmentsInitialState = {
	error: "",
	status: "",
	loading: false,
	departmentsList: [],
	departmentsCount: 0,
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

const departmentSlice = createSlice({
	name: "departments",
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
			.addCase(getDepartments.pending, (state, action) => {
				state.status = "getDepartments loading";
				state.loading = true;
			})
			.addCase(getDepartments.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getDepartments succeeded";
				state.loading = false;
				state.departmentsList = response.results;
				state.departmentsCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getDepartments.rejected, (state, action) => {
				state.status = "getDepartments failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getDepartmentsById.pending, (state, action) => {
				state.status = "getDepartmentsById loading";
				state.loading = true;
			})
			.addCase(getDepartmentsById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getDepartmentsById.rejected, (state, action) => {
				state.status = "getDepartmentsById failed";
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addDepartments.pending, (state, action) => {
				state.status = "addDepartments loading";
			})
			.addCase(addDepartments.fulfilled, (state, action) => {
				state.status = "addDepartments succeeded";
				// state.loading = false;
			})
			.addCase(addDepartments.rejected, (state, action) => {
				state.status = "addDepartments failed";
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
} = departmentSlice.actions;

export const departmentSelector = (state: RootState) =>
	state.masters.departments;

export const selectDeparatment = createSelector(
	[departmentSelector, systemSelector, miniSelector],
	(departments, system, mini) => ({
		departments,
		system,
		mini,
	})
);

export const useDeparmentSelector = () => {
	const selectors = useAppSelector((state) => selectDeparatment(state));
	return selectors;
};

export default departmentSlice.reducer;
