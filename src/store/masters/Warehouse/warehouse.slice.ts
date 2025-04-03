import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	getWarehouses,
	getWarehousesById,
	addWarehouses,
	deleteWarehouses,
} from "./warehouse.action";
import { RootState, useAppSelector } from "@src/store/store";
import { Warehouse, WarehouseInitialState } from "./warehouse.types";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: WarehouseInitialState = {
	error: "",
	status: "",
	loading: false,
	model: false,
	warehousesList: [],
	warehousesCount: 0,
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

const warehouseSlice = createSlice({
	name: "warehouses",
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
			.addCase(getWarehouses.pending, (state, action) => {
				state.status = "getWarehouses loading";
				state.loading = true;
			})
			.addCase(getWarehouses.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getWarehouses succeeded";
				state.loading = false;
				state.warehousesList = response.results;
				state.warehousesCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getWarehouses.rejected, (state, action) => {
				state.status = "getWarehouses failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getWarehousesById.pending, (state, action) => {
				state.status = "getWarehousesById loading";
				state.loading = true;
			})
			.addCase(getWarehousesById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name as string;
				state.selectedData = response;
			})
			.addCase(getWarehousesById.rejected, (state, action) => {
				state.status = "getWarehousesById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addWarehouses.pending, (state, action) => {
				state.status = "addWarehouses loading";
				state.loading = true;
			})
			.addCase(addWarehouses.fulfilled, (state, action) => {
				state.status = "addWarehouses succeeded";
				// state.loading = false;
			})
			.addCase(addWarehouses.rejected, (state, action) => {
				state.status = "addWarehouses failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteWarehouses.pending, (state, action) => {
				state.status = "deleteWarehouses loading";
				state.loading = true;
			})
			.addCase(deleteWarehouses.fulfilled, (state, action) => {
				state.status = "deleteWarehouses succeeded";
				state.loading = false;
			})
			.addCase(deleteWarehouses.rejected, (state, action) => {
				state.status = "deleteWarehouses failed";
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
} = warehouseSlice.actions;

export const warehouseSelector = (state: RootState) => state.masters.warehouse;

export const selectWarehouses = createSelector(
	[warehouseSelector, systemSelector, miniSelector],
	(warehouse, system, mini) => {
		return {
			warehouse,
			mini,
			system,
		};
	}
);

export const useWarehouseSelector = () => {
	const selectors = useAppSelector((state) => selectWarehouses(state));
	return selectors;
};

export default warehouseSlice.reducer;
