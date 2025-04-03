import { createSlice } from "@reduxjs/toolkit";
import { getCompany, getCompanyById, addCompany, editCompany, deleteCompany } from "./company.action";
import { RootState } from "@src/store/store";
import { Company, CompanyInitialState } from "./company.types";

const initialState: CompanyInitialState = {
	error: "",
	status: "",
	loading: false,
	companyList: [],
	companyCount: 0,
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

const companySlice = createSlice({
	name: "company",
	initialState,
	reducers: {
		clearUserData: (state, action) => {
			return initialState;
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
		setCompanyLogo: (state, action) => {
			return {
				...state,
				companylogo: action.payload
			};
		},
		setCompanyData: (state, action) => {
			return {
				...state,
				companyData: action.payload
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCompany.pending, (state, action) => {
				state.status = "getCompany loading";
				state.loading = true;
			})
			.addCase(getCompany.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getCompany succeeded";
				state.loading = false;
				state.companyList = response.results;
				state.companyCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.masterEditId = undefined;
				state.masterValue = "";
			})
			.addCase(getCompany.rejected, (state, action) => {
				state.status = "getCompany failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getCompanyById.pending, (state, action) => {
				state.status = "getCompanyById loading";
				state.loading = true;
			})
			.addCase(getCompanyById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.selectedData = response;
				state.companyData = response;
			})
			.addCase(getCompanyById.rejected, (state, action) => {
				state.status = "getCompanyById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addCompany.pending, (state, action) => {
				state.status = "addCompany loading";
				state.loading = true;
			})
			.addCase(addCompany.fulfilled, (state, action) => {
				state.status = "addCompany succeeded";
				state.loading = false;
			})
			.addCase(addCompany.rejected, (state, action) => {
				state.status = "addCompany failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(editCompany.pending, (state, action) => {
				state.status = "editCompany loading";
				state.loading = true;
			})
			.addCase(editCompany.fulfilled, (state, action) => {
				state.status = "editCompany succeeded";
				state.masterEditId = 0;
				state.masterValue = "";
				state.loading = false;
				state.selectedData = {};
			})
			.addCase(editCompany.rejected, (state, action) => {
				state.status = "editCompany failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteCompany.pending, (state, action) => {
				state.status = "deleteCompany loading";
				state.loading = true;
			})
			.addCase(deleteCompany.fulfilled, (state, action) => {
				state.status = "deleteCompany succeeded";
				state.loading = false
			}
			)
			.addCase(deleteCompany.rejected, (state, action) => {
				state.status = "deleteCompany failed";
				state.loading = false;
				state.error = action.error?.message || "An unknown error occurred";
			})
	},
});

// Action creators are generated for each case reducer function
export const {
	clearUserData,
	setSelectedData,
	setSearchValue,
	isModelVisible,
	setMasterValue,
	setMasterEditId,
	setCompanyLogo,
	setCompanyData
} = companySlice.actions;

export const companySelector = (state: RootState) =>
	state.masters.company;

export default companySlice.reducer;
