import { createSlice } from "@reduxjs/toolkit";
import { getBaseunit, getBaseunitById, addBaseunit, getBaseunitsMini, editBaseunit, deleteBaseunit } from "./baseunit.action";
import { RootState } from "@src/store/store";
import { Baseunit, BaseunitInitialState } from "./baseunit.types";

const initialState: BaseunitInitialState = {
	error: "",
	status: "",
	loading: false,
	baseunitList: [],
	baseunitCount: 0,
	searchValue: "",
	drawer: false,
	masterValue: "",
	masterEditId: 0,
	isModelVisible: false,
	selectedData: {
		id: "",name:"",code:""
	},
	filterStatus: false,
	passwordModel: false,
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
};

const baseunitSlice = createSlice({
	name: "baseunit",
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
			.addCase(getBaseunit.pending, (state, action) => {
				state.status = "getBaseunit loading";
				state.loading = true;
			})
			.addCase(getBaseunit.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getBaseunit succeeded";
				state.loading = false;
				state.baseunitList = response.results;
				state.baseunitCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.masterEditId = undefined;
				state.masterValue = "";
			})
			.addCase(getBaseunit.rejected, (state, action) => {
				state.status = "getBaseunit failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getBaseunitById.pending, (state, action) => {
				state.status = "getBaseunitById loading";
				state.loading = true;
			})
			.addCase(getBaseunitById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getBaseunitById.rejected, (state, action) => {
				state.status = "getBaseunitById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addBaseunit.pending, (state, action) => {
				state.status = "addBaseunit loading";
				state.loading = true;
			})
			.addCase(addBaseunit.fulfilled, (state, action) => {
				state.status = "addBaseunit succeeded";
				// state.loading = false;
			})
			.addCase(addBaseunit.rejected, (state, action) => {
				state.status = "addBaseunit failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(editBaseunit.pending, (state, action) => {
				state.status = "editBaseunit loading";
				state.loading = true;
			})
			.addCase(editBaseunit.fulfilled, (state, action) => {
				state.status = "editBaseunit succeeded";
				state.masterEditId = undefined;
				state.masterValue = "";
				// state.loading = false;
			})
			.addCase(editBaseunit.rejected, (state, action) => {
				state.status = "editBaseunit failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getBaseunitsMini.pending, (state, action) => {
				state.status = "getBaseunitsMini loading";
				state.loading = true;
			})
			.addCase(getBaseunitsMini.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getBaseunitsMini succeeded";
				state.loading = false;
				state.baseunitList = response.results;
				state.baseunitCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};

			})
			.addCase(getBaseunitsMini.rejected, (state, action) => {
				state.status = "getBaseunitsMini failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteBaseunit.pending, (state, action) => {
                state.status = "deleteBaseunit loading";
                state.loading = true;
            })
            .addCase(deleteBaseunit.fulfilled, (state, action) => {
                state.status = "deleteBaseunit succeeded";
                state.loading = false
            }
            )
            .addCase(deleteBaseunit.rejected, (state, action) => {
                state.status = "deleteBaseunit failed";
                state.loading = false;
                state.error = action.error?.message || "An unknown error occurred";
            })
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
	setMasterEditId
} = baseunitSlice.actions;

export const baseunitSelector = (state: RootState) =>
	state.masters.baseunit;

export default baseunitSlice.reducer;
