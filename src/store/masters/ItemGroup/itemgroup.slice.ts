import { createSlice } from "@reduxjs/toolkit";
import { getItemgroup, getItemgroupById, addItemgroup, editItemgroup } from "./itemgroup.action";
import { RootState } from "@src/store/store";
import { Itemgroup, ItemgroupInitialState } from "./itemgroup.types";

const initialState: ItemgroupInitialState = {
	error: "",
	status: "",
	loading: false,
	itemgroupList: [],
	itemgroupCount: 0,
	searchValue: "",
	drawer: false,
	masterValue: "",
	masterEditId: 0,
	isModelVisible: false,
	selectedData: {
		id: "",
		name: "",
		code: "",
		parent: { label: "", value: "" },
		parent_id: "",
		product_type: "",
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

const itemgroupSlice = createSlice({
	name: "itemgroup",
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
			.addCase(getItemgroup.pending, (state, action) => {
				state.status = "getItemgroup loading";
				state.loading = true;
			})
			.addCase(getItemgroup.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getItemgroup succeeded";
				state.loading = false;
				state.itemgroupList = response.results;
				state.itemgroupCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.masterEditId = undefined;
				state.masterValue = "";
			})
			.addCase(getItemgroup.rejected, (state, action) => {
				state.status = "getItemgroup failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getItemgroupById.pending, (state, action) => {
				state.status = "getItemgroupById loading";
				state.loading = true;
			})
			.addCase(getItemgroupById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getItemgroupById.rejected, (state, action) => {
				state.status = "getItemgroupById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addItemgroup.pending, (state, action) => {
				state.status = "addItemgroup loading";
				state.loading = true;
			})
			.addCase(addItemgroup.fulfilled, (state, action) => {
				state.status = "addItemgroup succeeded";
				// state.loading = false;
			})
			.addCase(addItemgroup.rejected, (state, action) => {
				state.status = "addItemgroup failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(editItemgroup.pending, (state, action) => {
				state.status = "editItemgroup loading";
				state.loading = true;
			})
			.addCase(editItemgroup.fulfilled, (state, action) => {
				state.status = "editItemgroup succeeded";
				state.masterEditId = 0;
				state.masterValue = "";
				// state.loading = false;
			})
			.addCase(editItemgroup.rejected, (state, action) => {
				state.status = "editItemgroup failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
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
} = itemgroupSlice.actions;

export const itemgroupSelector = (state: RootState) =>
	state.masters.itemgroup;

export default itemgroupSlice.reducer;
