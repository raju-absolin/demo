import { createSlice } from "@reduxjs/toolkit";
import { getTax, getTaxById, addTax, editTax, deleteTax } from "./tax.action";
import { RootState } from "@src/store/store";
import { Tax, TaxInitialState } from "./tax.types";

const initialState: TaxInitialState = {
	error: "",
	status: "",
	loading: false,
	taxList: [],
	taxCount: 0,
	searchValue: "",
	drawer: false,
	masterValue: "",
    masterEditId:"",
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

const taxSlice = createSlice({
	name: "tax",
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
			.addCase(getTax.pending, (state, action) => {
				state.status = "getTax loading";
				state.loading = true;
			})
			.addCase(getTax.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getTax succeeded";
				state.loading = false;
				state.taxList = response.results;
				state.taxCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
                state.masterEditId= "";
                state.masterValue = "";
			})
			.addCase(getTax.rejected, (state, action) => {
				state.status = "getTax failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getTaxById.pending, (state, action) => {
				state.status = "getTaxById loading";
				state.loading = true;
			})
			.addCase(getTaxById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getTaxById.rejected, (state, action) => {
				state.status = "getTaxById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addTax.pending, (state, action) => {
				state.status = "addTax loading";
				state.loading = true;
			})
			.addCase(addTax.fulfilled, (state, action) => {
				state.status = "addTax succeeded";
				// state.loading = false;
			})
			.addCase(addTax.rejected, (state, action) => {
				state.status = "addTax failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
            .addCase(editTax.pending, (state, action) => {
				state.status = "editTax loading";
				state.loading = true;
			})
			.addCase(editTax.fulfilled, (state, action) => {
				state.status = "editTax succeeded";
                state.masterEditId="";
                state.masterValue = "";
				// state.loading = false;
			})
			.addCase(editTax.rejected, (state, action) => {
				state.status = "editTax failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})	
			.addCase(deleteTax.pending, (state, action) => {
				state.status = "deleteTax loading";
				state.loading = true;
			})
			.addCase(deleteTax.fulfilled, (state, action) => {
				state.status = "deleteTax succeeded";
				state.loading = false
			}
			)
			.addCase(deleteTax.rejected, (state, action) => {
				state.status = "deleteTax failed";
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
} = taxSlice.actions;

export const taxSelector = (state: RootState) =>
	state.masters.tax;

export default taxSlice.reducer;
