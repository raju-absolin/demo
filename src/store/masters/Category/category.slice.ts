import { createSlice } from "@reduxjs/toolkit";
import { getCategory, getCategoryById, addCategory, editCategory, deleteCategory } from "./category.action";
import { RootState } from "@src/store/store";
import { Category, CategoryInitialState } from "./category.types";

const initialState: CategoryInitialState = {
	error: "",
	status: "",
	loading: false,
	categoryList: [],
	categoryCount: 0,
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

const categorySlice = createSlice({
	name: "category",
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
			.addCase(getCategory.pending, (state, action) => {
				state.status = "getCategory loading";
				state.loading = true;
			})
			.addCase(getCategory.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getCategory succeeded";
				state.loading = false;
				state.categoryList = response.results;
				state.categoryCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
                state.masterEditId= 0;
                state.masterValue = "";
			})
			.addCase(getCategory.rejected, (state, action) => {
				state.status = "getCategory failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getCategoryById.pending, (state, action) => {
				state.status = "getCategoryById loading";
				state.loading = true;
			})
			.addCase(getCategoryById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getCategoryById.rejected, (state, action) => {
				state.status = "getCategoryById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addCategory.pending, (state, action) => {
				state.status = "addCategory loading";
				state.loading = true;
			})
			.addCase(addCategory.fulfilled, (state, action) => {
				state.status = "addCategory succeeded";
				// state.loading = false;
			})
			.addCase(addCategory.rejected, (state, action) => {
				state.status = "addCategory failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
            .addCase(editCategory.pending, (state, action) => {
				state.status = "editCategory loading";
				state.loading = true;
			})
			.addCase(editCategory.fulfilled, (state, action) => {
				state.status = "editCategory succeeded";
                state.masterEditId= 0;
                state.masterValue = "";
				// state.loading = false;
			})
			.addCase(editCategory.rejected, (state, action) => {
				state.status = "editCategory failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})			
			.addCase(deleteCategory.pending, (state, action) => {
                state.status = "deleteCategory loading";
                state.loading = true;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.status = "deleteCategory succeeded";
                state.loading = false
            }
            )
            .addCase(deleteCategory.rejected, (state, action) => {
                state.status = "deleteCategory failed";
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
} = categorySlice.actions;

export const categorySelector = (state: RootState) =>
	state.masters.category;

export default categorySlice.reducer;
