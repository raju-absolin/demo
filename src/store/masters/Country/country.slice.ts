import { createSlice } from "@reduxjs/toolkit";
import {
	getCountry,
	getCountryById,
	addCountry,
	getCountriesMini,
	deleteCountry,
} from "./country.action";
import { RootState } from "@src/store/store";
import { Country, CountryInitialState } from "./country.types";

const initialState: CountryInitialState = {
	error: "",
	status: "",
	loading: false,
	countryList: [],
	countryCount: 0,
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

const countrySlice = createSlice({
	name: "country",
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
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCountry.pending, (state, action) => {
				state.status = "getCountry loading";
				state.loading = true;
			})
			.addCase(getCountry.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getCountry succeeded";
				state.loading = false;
				state.countryList = response.results;
				state.countryCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getCountry.rejected, (state, action) => {
				state.status = "getCountry failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getCountryById.pending, (state, action) => {
				state.status = "getCountryById loading";
				state.loading = true;
			})
			.addCase(getCountryById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getCountryById.rejected, (state, action) => {
				state.status = "getCountryById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addCountry.pending, (state, action) => {
				state.status = "addCountry loading";
				state.loading = true;
			})
			.addCase(addCountry.fulfilled, (state, action) => {
				state.status = "addCountry succeeded";
				// state.loading = false;
			})
			.addCase(addCountry.rejected, (state, action) => {
				state.status = "addCountry failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getCountriesMini.pending, (state, action) => {
				state.status = "getCountriesMini loading";
				state.loading = true;
			})
			.addCase(getCountriesMini.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getCountriesMini succeeded";
				state.loading = false;
				state.countryList = response.results;
				state.countryCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getCountriesMini.rejected, (state, action) => {
				state.status = "getCountriesMini failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteCountry.pending, (state, action) => {
				state.status = "deleteCountry loading";
				state.loading = true;
			})
			.addCase(deleteCountry.fulfilled, (state, action) => {
				state.status = "deleteCountry succeeded";
				state.loading = false;
			})
			.addCase(deleteCountry.rejected, (state, action) => {
				state.status = "deleteCountry failed";
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
} = countrySlice.actions;

export const countrySelector = (state: RootState) => state.masters.country;

export default countrySlice.reducer;
