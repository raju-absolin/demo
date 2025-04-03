import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { DocumentInitialState } from "./document.types";
import {
	editDocument,
	getDocumentById,
	getDocuments,
	postDocuments,
} from "./document.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { tendersSelectors } from "../tenders/tenders.slice";

const initialState: DocumentInitialState = {
	loading: false,
	status: "",
	error: "",
	documentList: [],
	documentCount: 0,
	selectedData: {
		id: "",
		is_submitted: false,
		type: 0,
		type_name: "",
	},
	isFilterOpen: false,
	openAddDocumentModal: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	tenderDocuments: [],
	checkedList: [],
	attachments: []
};

const documentSlice = createSlice({
	name: "caseSheet",
	initialState,
	reducers: {
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
			};
		},
		setIsFilterOpen: (state, action) => {
			return {
				...state,
				isFilterOpen: action.payload,
			};
		},
		setPageParams: (state, action) => {
			return {
				...state,
				pageParams: action.payload,
			};
		},
		setCheckedList: (state, action) => {
			return {
				...state,
				checkedList: action.payload,
			};
		},
		setOpenAddDocumentModal: (state, action) => {
			return {
				...state,
				openAddDocumentModal: action.payload,
			};
		},
		addNewDocument: (state, action) => {
			return {
				...state,
				tenderDocuments: [...state.tenderDocuments, action.payload],
			};
		},
		setAttachments: (state, action) => {
			return {
				...state,
				attachments: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getDocuments.pending, (state, action) => {
				state.status = "getDocuments pending";
				state.loading = true;
			})
			.addCase(getDocuments.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getDocuments succeeded";
				state.loading = false;
				state.documentList = response.results;
				state.documentCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getDocuments.rejected, (state, action) => {
				state.status = "getDocuments failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getDocumentById.pending, (state, action) => {
				state.status = "getDocumentById pending";
				state.loading = true;
			})
			.addCase(getDocumentById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getDocumentById succeeded";
				state.loading = false;
				state.selectedData = response;
				const split: string[] | undefined = response?.file?.split("/");
				state.attachments = [
					...(state.attachments || []),
					{
						...response,
						path: split ? split[split.length - 1] : "",
						preview: response.file,
						formattedSize: "",
					},
				];

			})
			.addCase(getDocumentById.rejected, (state, action) => {
				state.status = "getDocumentById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postDocuments.pending, (state, action) => {
				state.status = "postDocuments pending";
				state.loading = true;
			})
			.addCase(postDocuments.fulfilled, (state, action) => {
				state.status = "postDocuments succeeded";
				state.loading = false;
			})
			.addCase(postDocuments.rejected, (state, action) => {
				state.status = "postDocuments failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editDocument.pending, (state, action) => {
				state.status = "editDocument pending";
				state.loading = true;
			})
			.addCase(editDocument.fulfilled, (state, action) => {
				state.status = "editDocument succeeded";
				state.loading = false;
			})
			.addCase(editDocument.rejected, (state, action) => {
				state.status = "editDocument failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	setCheckedList,
	addNewDocument,
	setOpenAddDocumentModal,
	setAttachments
} = documentSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const documentSelectors = (state: RootState) =>
	state.tenderManagement.document;

// Memoized selector
export const selectDocument = createSelector(
	[documentSelectors, tendersSelectors, systemSelector, miniSelector],
	(document, tenders, system, mini) => ({
		document,
		tenders,
		system,
		mini,
	})
);

export default documentSlice.reducer;
