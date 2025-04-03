import { createSlice } from "@reduxjs/toolkit";
import {
	getLocation,
	getLocationById,
	addLocation,
	getLocationsMini,
	deleteLocation,
} from "./location.action";
import { RootState } from "@src/store/store";
import { Location, LocationInitialState } from "./location.types";

const initialState: LocationInitialState = {
	error: "",
	status: "",
	loading: false,
	locationList: [],
	locationCount: 0,
	searchValue: "",
	drawer: false,
	masterValue: "",
	isModelVisible: false,
	selectedData: {
		id: "",
		code: "",
	},
	filterStatus: false,
	passwordModel: false,
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	masterEditId: 0,
	isFilterOpen: false,
};

const locationSlice = createSlice({
	name: "location",
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
			.addCase(getLocation.pending, (state, action) => {
				state.status = "getLocation loading";
				state.loading = true;
			})
			.addCase(getLocation.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getLocation succeeded";
				state.loading = false;
				state.locationList = response.results;
				state.locationCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getLocation.rejected, (state, action) => {
				state.status = "getLocation failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getLocationById.pending, (state, action) => {
				state.status = "getLocationById loading";
				state.loading = true;
			})
			.addCase(getLocationById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.selectedData = response;
				(state.selectedData.companies =
					state.selectedData?.companies?.map((e) => {
						return {
							label: e.name,
							value: e.id,
						};
					})),
					(state.masterValue = response.name);
			})
			.addCase(getLocationById.rejected, (state, action) => {
				state.status = "getLocationById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addLocation.pending, (state, action) => {
				state.status = "addLocation loading";
				state.loading = true;
			})
			.addCase(addLocation.fulfilled, (state, action) => {
				state.status = "addLocation succeeded";
				// state.loading = false;
			})
			.addCase(addLocation.rejected, (state, action) => {
				state.status = "addLocation failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getLocationsMini.pending, (state, action) => {
				state.status = "getLocationsMini loading";
				state.loading = true;
			})
			.addCase(getLocationsMini.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getLocationsMini succeeded";
				state.loading = false;
				state.locationList = response.results;
				state.locationCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getLocationsMini.rejected, (state, action) => {
				state.status = "getLocationsMini failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteLocation.pending, (state, action) => {
				state.status = "deleteLocation loading";
				state.loading = true;
			})
			.addCase(deleteLocation.fulfilled, (state, action) => {
				state.status = "deleteLocation succeeded";
				state.loading = false;
			})
			.addCase(deleteLocation.rejected, (state, action) => {
				state.status = "deleteLocation failed";
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
	setIsFilterOpen,
	setPageParams,
} = locationSlice.actions;

export const locationSelector = (state: RootState) => state.masters.location;

export default locationSlice.reducer;
