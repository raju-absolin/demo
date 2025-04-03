import { createSlice } from "@reduxjs/toolkit";
import { getDocument, getDocumentById, addDocument, editDocument, deleteDocument } from "./document.action";
import { RootState } from "@src/store/store";
import { Document, DocumentInitialState } from "./document.types";

const initialState: DocumentInitialState = {
	error: "",
	status: "",
	loading: false,
	documentList: [],
	documentCount: 0,
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

const documentSlice = createSlice({
	name: "document",
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
			.addCase(getDocument.pending, (state, action) => {
				state.status = "getDocument loading";
				state.loading = true;
			})
			.addCase(getDocument.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getDocument succeeded";
				state.loading = false;
				state.documentList = response.results;
				state.documentCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
                state.masterEditId= 0;
                state.masterValue = "";
			})
			.addCase(getDocument.rejected, (state, action) => {
				state.status = "getDocument failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getDocumentById.pending, (state, action) => {
				state.status = "getDocumentById loading";
				state.loading = true;
			})
			.addCase(getDocumentById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterValue = response.name;
				state.selectedData = response;
			})
			.addCase(getDocumentById.rejected, (state, action) => {
				state.status = "getDocumentById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addDocument.pending, (state, action) => {
				state.status = "addDocument loading";
				state.loading = true;
			})
			.addCase(addDocument.fulfilled, (state, action) => {
				state.status = "addDocument succeeded";
				// state.loading = false;
			})
			.addCase(addDocument.rejected, (state, action) => {
				state.status = "addDocument failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
            .addCase(editDocument.pending, (state, action) => {
				state.status = "editDocument loading";
				state.loading = true;
			})
			.addCase(editDocument.fulfilled, (state, action) => {
				state.status = "editDocument succeeded";
                state.masterEditId= 0;
                state.masterValue = "";
				// state.loading = false;
			})
			.addCase(editDocument.rejected, (state, action) => {
				state.status = "editDocument failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})		
			.addCase(deleteDocument.pending, (state, action) => {
                state.status = "deleteDocument loading";
                state.loading = true;
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.status = "deleteDocument succeeded";
                state.loading = false
            }
            )
            .addCase(deleteDocument.rejected, (state, action) => {
                state.status = "deleteDocument failed";
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
} = documentSlice.actions;

export const documentSelector = (state: RootState) =>
	state.masters.document;

export default documentSlice.reducer;
