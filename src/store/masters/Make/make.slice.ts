import { createSlice } from "@reduxjs/toolkit";
import { getMake, getMakeById, addMake,getMakesMini, editMake, deleteMake } from "./make.action";
import { RootState } from "@src/store/store";
import { Make, MakeInitialState } from "./make.types";

const initialState: MakeInitialState = {
	error: "",
	status: "",
	loading: false,
	makeList: [],
	makeCount: 0,
	searchValue: "",
	drawer: false,
	masterValue: "",
    masterEditId: 0,
	isModelVisible: false,
	selectedData: {id: "",name:"",code:""},
	filterStatus: false,
	passwordModel: false,
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
};

const makeSlice = createSlice({
	name: "make",
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
	},
	extraReducers: (builder) => {
		builder
			.addCase(getMake.pending, (state, action) => {
				state.status = "getMake loading";
				state.loading = true;
			})
			.addCase(getMake.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getMake succeeded";
				state.loading = false;
				state.makeList = response.results;
				state.makeCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
                state.masterEditId= undefined;
                state.masterValue = "";
			})
			.addCase(getMake.rejected, (state, action) => {
				state.status = "getMake failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getMakeById.pending, (state, action) => {
				state.status = "getMakeById loading";
				state.loading = true;
			})
			.addCase(getMakeById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getMakeById.rejected, (state, action) => {
				state.status = "getMakeById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addMake.pending, (state, action) => {
				state.status = "addMake loading";
				state.loading = true;
			})
			.addCase(addMake.fulfilled, (state, action) => {
				state.status = "addMake succeeded";
				// state.loading = false;
			})
			.addCase(addMake.rejected, (state, action) => {
				state.status = "addMake failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
            .addCase(editMake.pending, (state, action) => {
				state.status = "editMake loading";
				state.loading = true;
			})
			.addCase(editMake.fulfilled, (state, action) => {
				state.status = "editMake succeeded";
                state.masterEditId= 0;
                state.masterValue = "";
				// state.loading = false;
			})
			.addCase(editMake.rejected, (state, action) => {
				state.status = "editMake failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getMakesMini.pending, (state, action) => {
				state.status = "getMakesMini loading";
				state.loading = true;
			})
			.addCase(getMakesMini.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getMakesMini succeeded";
				state.loading = false;
				state.makeList = response.results;
				state.makeCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};

			})
			.addCase(getMakesMini.rejected, (state, action) => {
				state.status = "getMakesMini failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteMake.pending, (state, action) => {
				state.status = "deleteMake loading";
				state.loading = true;
			})
			.addCase(deleteMake.fulfilled, (state, action) => {
				state.status = "deleteMake succeeded";
				state.loading = false
			}
			)
			.addCase(deleteMake.rejected, (state, action) => {
				state.status = "deleteMake failed";
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
} = makeSlice.actions;

export const makeSelector = (state: RootState) =>
	state.masters.make;

export default makeSlice.reducer;
