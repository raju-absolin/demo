import { createSlice } from "@reduxjs/toolkit";
import { getCustomers, getCustomersById, addCustomers, editCustomers, deleteCustomers } from "./customer.action";
import { RootState } from "@src/store/store";
import { Customers, CustomersInitialState } from "./customer.types";

const initialState: CustomersInitialState = {
	error: "",
	status: "",
	loading: false,
	customersList: [],
	customersCount: 0,
	searchValue: "",
	drawer: false,
	masterValue: "",
    masterEditId: 0,
	isModelVisible: false,
	selectedData: {},
	filterStatus: false,
	passwordModel: false,
	countryValue: "",
	stateValue: "",
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	isFilterOpen: false,
};

const customersSlice = createSlice({
	name: "customers",
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
		setMasterValue:(state, action) => {
			return {
				...state,
				masterValue: action.payload,
			};
		},
        setMasterEditId:(state, action) => {
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
			.addCase(getCustomers.pending, (state, action) => {
				state.status = "getCustomers loading";
				state.loading = true;
			})
			.addCase(getCustomers.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getCustomers succeeded";
				state.loading = false;
				state.customersList = response.results;
				state.customersCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
                state.masterEditId= undefined;
                state.masterValue = "";
			})
			.addCase(getCustomers.rejected, (state, action) => {
				state.status = "getCustomers failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getCustomersById.pending, (state, action) => {
				state.status = "getCustomersById loading";
				state.loading = true;
			})
			.addCase(getCustomersById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.selectedData = response;
				state.countryValue = state.selectedData.country?.id
				state.stateValue = state.selectedData.state?.id

			})
			.addCase(getCustomersById.rejected, (state, action) => {
				state.status = "getCustomersById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addCustomers.pending, (state, action) => {
				state.status = "addCustomers loading";
				state.loading = true;
			})
			.addCase(addCustomers.fulfilled, (state, action) => {
				state.status = "addCustomers succeeded";
				state.loading = false;
			})
			.addCase(addCustomers.rejected, (state, action) => {
				state.status = "addCustomers failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
            .addCase(editCustomers.pending, (state, action) => {
				state.status = "editCustomers loading";
				state.loading = true;
			})
			.addCase(editCustomers.fulfilled, (state, action) => {
				state.status = "editCustomers succeeded";
                state.masterEditId= 0;
                state.masterValue = "";
				state.loading = false;
				state.selectedData = {};
			})
			.addCase(editCustomers.rejected, (state, action) => {
				state.status = "editCustomers failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteCustomers.pending, (state, action) => {
                state.status = "deleteCustomers loading";
                state.loading = true;
            })
            .addCase(deleteCustomers.fulfilled, (state, action) => {
                state.status = "deleteCustomers succeeded";
                state.loading = false
            }
            )
            .addCase(deleteCustomers.rejected, (state, action) => {
                state.status = "deleteCustomers failed";
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
	setCountryValue,
	setStateValue,
    setMasterEditId,
	setPageParams,
	setIsFilterOpen
} = customersSlice.actions;

export const customersSelector = (state: RootState) =>
	state.masters.customers;

export default customersSlice.reducer;
