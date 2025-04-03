import { createSlice } from "@reduxjs/toolkit";
import { getVendors, getVendorsById, addVendors, editVendors, deleteVendor } from "./vendors.action";
import { RootState } from "@src/store/store";
import { Vendors, VendorsInitialState } from "./vendors.types";

const initialState: VendorsInitialState = {
	error: "",
	status: "",
	loading: false,
	vendorsList: [],
	vendorsCount: 0,
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
	countryValue: "",
	stateValue: "",
	isFilterOpen:false,
};

const vendorsSlice = createSlice({
	name: "vendors",
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
		setCountryValue: (state, action) => {
			return {
				...state,
				countryValue: action.payload,
			};
		},
		setStateValue: (state, action) => {
			return {
				...state,
				stateValue: action.payload,
			};
		},
		setPageParams: (state, action) => {
			return {
				...state,
				pageParams: action.payload,
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
			.addCase(getVendors.pending, (state, action) => {
				state.status = "getVendors loading";
				state.loading = true;
			})
			.addCase(getVendors.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getVendors succeeded";
				state.loading = false;
				state.vendorsList = response.results;
				state.vendorsCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.masterEditId = undefined;
				state.masterValue = "";
			})
			.addCase(getVendors.rejected, (state, action) => {
				state.status = "getVendors failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getVendorsById.pending, (state, action) => {
				state.status = "getVendorsById loading";
				state.loading = true;
			})
			.addCase(getVendorsById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.selectedData = response;
				state.countryValue = state.selectedData.country?.id
				state.selectedData.item_groups = state.selectedData?.item_groups?.map((e) => {
					return {
						label: e.name,
						value: e.id,
					};
				}),
					state.stateValue = state.selectedData.state?.id
			})
			.addCase(getVendorsById.rejected, (state, action) => {
				state.status = "getVendorsById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addVendors.pending, (state, action) => {
				state.status = "addVendors loading";
				state.loading = true;
			})
			.addCase(addVendors.fulfilled, (state, action) => {
				state.status = "addVendors succeeded";
				state.loading = false;
			})
			.addCase(addVendors.rejected, (state, action) => {
				state.status = "addVendors failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(editVendors.pending, (state, action) => {
				state.status = "editVendors loading";
				state.loading = true;
			})
			.addCase(editVendors.fulfilled, (state, action) => {
				state.status = "editVendors succeeded";
				state.masterEditId = 0;
				state.masterValue = "";
				state.loading = false;
				state.selectedData = {};
			})
			.addCase(editVendors.rejected, (state, action) => {
				state.status = "editVendors failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteVendor.pending, (state, action) => {
				state.status = "deleteVendor loading";
				state.loading = true;
			})
			.addCase(deleteVendor.fulfilled, (state, action) => {
				state.status = "deleteVendor succeeded";
				state.loading = false
			}
			)
			.addCase(deleteVendor.rejected, (state, action) => {
				state.status = "deleteVendor failed";
				state.loading = false;
				state.error = action.error?.message || "An unknown error occurred";
			})
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
	setStateValue,
	setCountryValue,
	setPageParams,
	setIsFilterOpen
} = vendorsSlice.actions;

export const vendorsSelector = (state: RootState) =>
	state.masters.vendors;

export default vendorsSlice.reducer;
