import { createSlice } from "@reduxjs/toolkit";
import { getBidNature, getBidNatureById, addBidNature, editBidNature, deleteBidnature } from "./bidnature.action";
import { RootState } from "@src/store/store";
import { BidNature, BidNatureInitialState } from "./bidnature.types";

const initialState: BidNatureInitialState = {
	error: "",
	status: "",
	loading: false,
	bidnatureList: [],
	bidnatureCount: 0,
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
};

const bidnatureSlice = createSlice({
	name: "bidnature",
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
			.addCase(getBidNature.pending, (state, action) => {
				state.status = "getBidNature loading";
				state.loading = true;
			})
			.addCase(getBidNature.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getBidNature succeeded";
				state.loading = false;
				state.bidnatureList = response.results;
				state.bidnatureCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
                state.masterEditId= 0;
                state.masterValue = "";
			})
			.addCase(getBidNature.rejected, (state, action) => {
				state.status = "getBidNature failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getBidNatureById.pending, (state, action) => {
				state.status = "getBidNatureById loading";
				state.loading = true;
			})
			.addCase(getBidNatureById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getBidNatureById.rejected, (state, action) => {
				state.status = "getBidNatureById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addBidNature.pending, (state, action) => {
				state.status = "addBidNature loading";
				state.loading = true;
			})
			.addCase(addBidNature.fulfilled, (state, action) => {
				state.status = "addBidNature succeeded";
				// state.loading = false;
			})
			.addCase(addBidNature.rejected, (state, action) => {
				state.status = "addBidNature failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
            .addCase(editBidNature.pending, (state, action) => {
				state.status = "editBidNature loading";
				state.loading = true;
			})
			.addCase(editBidNature.fulfilled, (state, action) => {
				state.status = "editBidNature succeeded";
                state.masterEditId= 0;
                state.masterValue = "";
				// state.loading = false;
			})
			.addCase(editBidNature.rejected, (state, action) => {
				state.status = "editBidNature failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})	
			.addCase(deleteBidnature.pending, (state, action) => {
                state.status = "deleteBidnature loading";
                state.loading = true;
            })
            .addCase(deleteBidnature.fulfilled, (state, action) => {
                state.status = "deleteBidnature succeeded";
                state.loading = false
            }
            )
            .addCase(deleteBidnature.rejected, (state, action) => {
                state.status = "deleteBidnature failed";
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
} = bidnatureSlice.actions;

export const bidnatureSelector = (state: RootState) =>
	state.masters.bidnature;

export default bidnatureSlice.reducer;
