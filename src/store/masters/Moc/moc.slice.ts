import { createSlice } from "@reduxjs/toolkit";
import { getMoc, getMocById, addMoc,getMocsMini, editMoc, deleteMOC } from "./moc.action";
import { RootState } from "@src/store/store";
import { Moc, MocInitialState } from "./moc.types";

const initialState: MocInitialState = {
	error: "",
	status: "",
	loading: false,
	mocList: [],
	mocCount: 0,
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

const mocSlice = createSlice({
	name: "moc",
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
			.addCase(getMoc.pending, (state, action) => {
				state.status = "getMoc loading";
				state.loading = true;
			})
			.addCase(getMoc.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getMoc succeeded";
				state.loading = false;
				state.mocList = response.results;
				state.mocCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
                state.masterEditId= undefined;
                state.masterValue = "";
			})
			.addCase(getMoc.rejected, (state, action) => {
				state.status = "getMoc failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getMocById.pending, (state, action) => {
				state.status = "getMocById loading";
				state.loading = true;
			})
			.addCase(getMocById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getMocById.rejected, (state, action) => {
				state.status = "getMocById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addMoc.pending, (state, action) => {
				state.status = "addMoc loading";
				state.loading = true;
			})
			.addCase(addMoc.fulfilled, (state, action) => {
				state.status = "addMoc succeeded";
				// state.loading = false;
			})
			.addCase(addMoc.rejected, (state, action) => {
				state.status = "addMoc failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
            .addCase(editMoc.pending, (state, action) => {
				state.status = "editMoc loading";
				state.loading = true;
			})
			.addCase(editMoc.fulfilled, (state, action) => {
				state.status = "editMoc succeeded";
                state.masterEditId= 0;
                state.masterValue = "";
				// state.loading = false;
			})
			.addCase(editMoc.rejected, (state, action) => {
				state.status = "editMoc failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getMocsMini.pending, (state, action) => {
				state.status = "getMocsMini loading";
				state.loading = true;
			})
			.addCase(getMocsMini.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getMocsMini succeeded";
				state.loading = false;
				state.mocList = response.results;
				state.mocCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};

			})
			.addCase(getMocsMini.rejected, (state, action) => {
				state.status = "getMocsMini failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteMOC.pending, (state, action) => {
				state.status = "deleteMOC loading";
				state.loading = true;
			})
			.addCase(deleteMOC.fulfilled, (state, action) => {
				state.status = "deleteMOC succeeded";
				state.loading = false
			}
			)
			.addCase(deleteMOC.rejected, (state, action) => {
				state.status = "deleteMOC failed";
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
} = mocSlice.actions;

export const mocSelector = (state: RootState) =>
	state.masters.moc;

export default mocSlice.reducer;
