import { createSlice } from "@reduxjs/toolkit";
import {
	getVendorItem,
	getVendorItemById,
	addVendorItem,
	editVendorItem,
	deleteVendorItem,
} from "./vendorItems.action";
import { RootState } from "@src/store/store";
import { VendorItem, VendorItemInitialState } from "./vendorItems.types";

const initialState: VendorItemInitialState = {
	error: "",
	status: "",
	loading: false,
	vendorItemList: [],
	vendorItemCount: 0,
	searchValue: "",
	drawer: false,
	model: false,
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

const vendorItemSlice = createSlice({
	name: "vendorItem",
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
				model: action.payload || false,
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
			.addCase(getVendorItem.pending, (state, action) => {
				state.status = "getVendorItem loading";
				state.loading = true;
			})
			.addCase(getVendorItem.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getVendorItem succeeded";
				state.loading = false;
				state.vendorItemList = response.results;
				state.vendorItemCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.masterEditId = 0;
				state.masterValue = "";
			})
			.addCase(getVendorItem.rejected, (state, action) => {
				state.status = "getVendorItem failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getVendorItemById.pending, (state, action) => {
				state.status = "getVendorItemById loading";
				state.loading = true;
			})
			.addCase(getVendorItemById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.selectedData = response;
			})
			.addCase(getVendorItemById.rejected, (state, action) => {
				state.status = "getVendorItemById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addVendorItem.pending, (state, action) => {
				state.status = "addVendorItem loading";
				state.loading = true;
			})
			.addCase(addVendorItem.fulfilled, (state, action) => {
				state.status = "addVendorItem succeeded";
				// state.loading = false;
			})
			.addCase(addVendorItem.rejected, (state, action) => {
				state.status = "addVendorItem failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(editVendorItem.pending, (state, action) => {
				state.status = "editVendorItem loading";
				state.loading = true;
			})
			.addCase(editVendorItem.fulfilled, (state, action) => {
				state.status = "editVendorItem succeeded";
				state.masterEditId = 0;
				state.masterValue = "";
				// state.loading = false;
			})
			.addCase(editVendorItem.rejected, (state, action) => {
				state.status = "editVendorItem failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteVendorItem.pending, (state, action) => {
				state.status = "deleteVendorItem loading";
				state.loading = true;
			})
			.addCase(deleteVendorItem.fulfilled, (state, action) => {
				state.status = "deleteVendorItem succeeded";
				state.loading = false;
			})
			.addCase(deleteVendorItem.rejected, (state, action) => {
				state.status = "deleteVendorItem failed";
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
} = vendorItemSlice.actions;

export const vendorItemSelector = (state: RootState) =>
	state.masters.vendorItems;

export default vendorItemSlice.reducer;
