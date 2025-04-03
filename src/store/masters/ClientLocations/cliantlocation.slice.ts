import { createSlice } from "@reduxjs/toolkit";
import {
	getClientLocation,
	getClientLocationById,
	addClientLocation,
	deleteClientLocation,
} from "./cliantlocation.action";
import { RootState } from "@src/store/store";
import {
	ClientLocation,
	ClientLocationInitialState,
} from "./cliantlocation.types";

const initialState: ClientLocationInitialState = {
	error: "",
	status: "",
	loading: false,
	clientLocationList: [],
	clientLocationCount: 0,
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
	model: false,
};

const clientLocationSlice = createSlice({
	name: "clientLocation",
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
			.addCase(getClientLocation.pending, (state, action) => {
				state.status = "getClientLocation loading";
				state.loading = true;
			})
			.addCase(getClientLocation.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getClientLocation succeeded";
				state.loading = false;
				state.clientLocationList = response.results;
				state.clientLocationCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getClientLocation.rejected, (state, action) => {
				state.status = "getClientLocation failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getClientLocationById.pending, (state, action) => {
				state.status = "getClientLocationById loading";
				state.loading = true;
			})
			.addCase(getClientLocationById.fulfilled, (state, action) => {
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
			.addCase(getClientLocationById.rejected, (state, action) => {
				state.status = "getClientLocationById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addClientLocation.pending, (state, action) => {
				state.status = "addClientLocation loading";
				state.loading = true;
			})
			.addCase(addClientLocation.fulfilled, (state, action) => {
				state.status = "addClientLocation succeeded";
				// state.loading = false;
			})
			.addCase(addClientLocation.rejected, (state, action) => {
				state.status = "addClientLocation failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteClientLocation.pending, (state, action) => {
				state.status = "deleteClientLocation loading";
				state.loading = true;
			})
			.addCase(deleteClientLocation.fulfilled, (state, action) => {
				state.status = "deleteClientLocation succeeded";
				state.loading = false;
			})
			.addCase(deleteClientLocation.rejected, (state, action) => {
				state.status = "deleteClientLocation failed";
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
} = clientLocationSlice.actions;

export const clientLocationSelector = (state: RootState) =>
	state.masters.clientLocation;

export default clientLocationSlice.reducer;
