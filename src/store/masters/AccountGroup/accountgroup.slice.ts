import { createSlice } from "@reduxjs/toolkit";
import {
	getAccountgroup,
	getAccountgroupById,
	addAccountgroup,
	editAccountgroup,
} from "./accountgroup.action";
import { RootState } from "@src/store/store";
import { Accountgroup, AccountgroupInitialState } from "./accountgroup.types";

const initialState: AccountgroupInitialState = {
	error: "",
	status: "",
	loading: false,
	accountgroupList: [],
	accountgroupCount: 0,
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

const accountgroupSlice = createSlice({
	name: "accountgroup",
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
			.addCase(getAccountgroup.pending, (state, action) => {
				state.status = "getAccountgroup loading";
				state.loading = true;
			})
			.addCase(getAccountgroup.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getAccountgroup succeeded";
				state.loading = false;
				state.accountgroupList = response.results;
				state.accountgroupCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.masterEditId = undefined;
				state.masterValue = "";
			})
			.addCase(getAccountgroup.rejected, (state, action) => {
				state.status = "getAccountgroup failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getAccountgroupById.pending, (state, action) => {
				state.status = "getAccountgroupById loading";
				state.loading = true;
			})
			.addCase(getAccountgroupById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getAccountgroupById.rejected, (state, action) => {
				state.status = "getAccountgroupById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addAccountgroup.pending, (state, action) => {
				state.status = "addAccountgroup loading";
				state.loading = true;
			})
			.addCase(addAccountgroup.fulfilled, (state, action) => {
				state.status = "addAccountgroup succeeded";
				// state.loading = false;
			})
			.addCase(addAccountgroup.rejected, (state, action) => {
				state.status = "addAccountgroup failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(editAccountgroup.pending, (state, action) => {
				state.status = "editAccountgroup loading";
				state.loading = true;
			})
			.addCase(editAccountgroup.fulfilled, (state, action) => {
				state.status = "editAccountgroup succeeded";
				state.masterEditId = 0;
				state.masterValue = "";
				// state.loading = false;
			})
			.addCase(editAccountgroup.rejected, (state, action) => {
				state.status = "editAccountgroup failed";
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
} = accountgroupSlice.actions;

export const accountgroupSelector = (state: RootState) =>
	state.masters.accountgroup;

export default accountgroupSlice.reducer;
