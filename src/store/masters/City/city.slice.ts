import { createSlice } from "@reduxjs/toolkit";
import {
	getCities,
	getCityById,
	addCity,
	getCitiesMini,
	deleteCity,
} from "./city.action";
import { RootState } from "@src/store/store";
import { City, CityInitialState } from "./city.types";

const initialState: CityInitialState = {
	error: "",
	status: "",
	loading: false,
	cityList: [],
	cityCount: 0,
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

const citySlice = createSlice({
	name: "city",
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
			.addCase(getCities.pending, (state, action) => {
				state.status = "getCities loading";
				state.loading = true;
			})
			.addCase(getCities.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getCities succeeded";
				state.loading = false;
				state.cityList = response.results;
				state.cityCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getCities.rejected, (state, action) => {
				state.status = "getCities failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getCityById.pending, (state, action) => {
				state.status = "getCityById loading";
				state.loading = true;
			})
			.addCase(getCityById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getCityById.rejected, (state, action) => {
				state.status = "getCityById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addCity.pending, (state, action) => {
				state.status = "addCity loading";
				state.loading = true;
			})
			.addCase(addCity.fulfilled, (state, action) => {
				state.status = "addCity succeeded";
				// state.loading = false;
			})
			.addCase(addCity.rejected, (state, action) => {
				state.status = "addCity failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getCitiesMini.pending, (state, action) => {
				state.status = "getCitiesMini loading";
				state.loading = true;
			})
			.addCase(getCitiesMini.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getCitiesMini succeeded";
				state.loading = false;
				state.cityList = response.results;
				state.cityCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getCitiesMini.rejected, (state, action) => {
				state.status = "getCitiesMini failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteCity.pending, (state, action) => {
				state.status = "deleteCity loading";
				state.loading = true;
			})
			.addCase(deleteCity.fulfilled, (state, action) => {
				state.status = "deleteCity succeeded";
				state.loading = false;
			})
			.addCase(deleteCity.rejected, (state, action) => {
				state.status = "deleteCity failed";
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
} = citySlice.actions;

export const citySelector = (state: RootState) => state.masters.city;

export default citySlice.reducer;
