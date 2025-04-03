import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@src/store/store";
import { Tender, TendersInitialState } from "./tenders.types";
import {
	ApproveTender,
	editAssignUser,
	editBidStages,
	editTender,
	getTenderById,
	getTenders,
	postPdfUpload,
	postTender,
	postTenderDocuments,
	postTenderJsonData,
	RejectTender,
} from "./tenders.action";
import { selectSystem, systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { commentsSelectors } from "../comments/commets.slice";
import { WritableDraft } from "immer";

const initialState: TendersInitialState = {
	loading: false,
	approve_loading: false,
	reject_loading: false,
	document_loading: false,
	bid_stage_loading: false,
	bid_stage_modal: false,
	status: "",
	error: "",
	tendersList: [],
	tenderCount: 0,
	modal: false,
	selectedData: {},
	isFilterOpen: false,
	assign_to_modal: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	tenderMasterItemModalOpen: false,
	uploadDocuments: [],
	tabs: 0,
	pdf_loading: false,
	userAssigneModal: false,
};

const tendersSlice = createSlice({
	name: "tenders",
	initialState,
	reducers: {
		setTenderState: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
		isModalOpen: (state, action) => {
			return {
				...state,
				modal: action.payload,
			};
		},
		isAssignToModalOpen: (state, action) => {
			return {
				...state,
				assign_to_modal: action.payload,
			};
		},
		setTenderMasterItemModalOpen: (state, action) => {
			return {
				...state,
				tenderMasterItemModalOpen: action.payload,
			};
		},
		setUploadDocument: (state, action) => {
			return {
				...state,
				uploadDocuments: action.payload,
			};
		},
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
		setTabs: (state, action) => {
			return {
				...state,
				tabs: action.payload,
			};
		},
		setExtractedData: (state, action) => {
			return {
				...state,
				extractedData: action.payload,
			};
		},
		setIsUsersModalOpen: (state, action) => {
			return {
				...state,
				userAssigneModal: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getTenders.pending, (state, action) => {
				state.status = "getTenders pending";
				state.loading = true;
			})
			.addCase(getTenders.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getTenders succeeded";
				state.loading = false;
				state.tendersList = response.results as WritableDraft<Tender>[];
				state.tenderCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getTenders.rejected, (state, action) => {
				state.status = "getTenders failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getTenderById.pending, (state, action) => {
				state.status = "getTenderById pending";
				state.loading = true;
			})
			.addCase(getTenderById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getTenderById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					department: response.department_name,
					project: {
						name: response?.project?.name
							? response?.project?.name
							: "",
						id: response?.project?.id ? response?.project?.id : "",
					},
					tender_type: {
						name: response.tender_type_name
							? response.tender_type_name
							: "",
						id: response.tender_type ? response.tender_type : "",
					},
					sourceportal: {
						name: response?.sourceportal?.name
							? response.sourceportal.name
							: "",
						id: response?.sourceportal?.id
							? response?.sourceportal?.id
							: "",
					},
					is_reverse_auction: {
						name: response.is_reverse_auction ? "Yes" : "No",
						id: response.is_reverse_auction ? true : false,
					},
					tender_items: response?.tender_items?.map((e) => {
						return {
							...e,
							tenderitemmaster: {
								...e.tenderitemmaster,
								label: e.tenderitemmaster.name,
								value: e.tenderitemmaster.id,
							},
							dodelete: false,
						};
					}),
					lead_documents: response.lead?.documents?.map(
						(document, index: number) => {
							const split: string[] | undefined =
								document?.file?.split("/");
							return {
								...document,
								path: split ? split[split.length - 1] : "",
								preview: document?.file,
								formattedSize: "",
							};
						}
					),
					budget_documents: response.budgetaryquotationdocuments?.map(
						(document) => {
							const split: string[] | undefined =
								document?.file?.split("/");
							return {
								...document,
								path: split ? split[split.length - 1] : "",
								preview: document?.file,
								formattedSize: "",
							};
						}
					),
				} as any;
				state.uploadDocuments = response.documents?.map((document) => {
					const split: string[] | undefined =
						document?.file?.split("/");
					return {
						...document,
						path: split ? split[split.length - 1] : "",
						preview: document?.file,
						formattedSize: "",
					};
				});
			})
			.addCase(getTenderById.rejected, (state, action) => {
				state.status = "getTenderById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postTender.pending, (state, action) => {
				state.status = "postTender pending";
				state.loading = true;
			})
			.addCase(postTender.fulfilled, (state, action) => {
				state.status = "postTender succeeded";
				state.loading = false;
			})
			.addCase(postTender.rejected, (state, action) => {
				state.status = "postTender failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editTender.pending, (state, action) => {
				state.status = "editTender pending";
				state.loading = true;
			})
			.addCase(editTender.fulfilled, (state, action) => {
				state.status = "editTender succeeded";
				state.loading = false;
			})
			.addCase(editTender.rejected, (state, action) => {
				state.status = "editTender failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editAssignUser.pending, (state, action) => {
				state.status = "editAssignUser pending";
				state.loading = true;
			})
			.addCase(editAssignUser.fulfilled, (state, action) => {
				state.status = "editAssignUser succeeded";
				state.loading = false;
			})
			.addCase(editAssignUser.rejected, (state, action) => {
				state.status = "editAssignUser failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editBidStages.pending, (state, action) => {
				state.status = "editBidStages pending";
				state.bid_stage_loading = true;
			})
			.addCase(editBidStages.fulfilled, (state, action) => {
				state.status = "editBidStages succeeded";
				state.bid_stage_loading = false;
			})
			.addCase(editBidStages.rejected, (state, action) => {
				state.status = "editBidStages failed";
				state.bid_stage_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(ApproveTender.pending, (state, action) => {
				state.status = "ApproveTender pending";
				state.approve_loading = true;
			})
			.addCase(ApproveTender.fulfilled, (state, action) => {
				state.status = "ApproveTender succeeded";
				state.approve_loading = false;
			})
			.addCase(ApproveTender.rejected, (state, action) => {
				state.status = "ApproveTender failed";
				state.approve_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(RejectTender.pending, (state, action) => {
				state.status = "RejectTender pending";
				state.reject_loading = true;
			})
			.addCase(RejectTender.fulfilled, (state, action) => {
				state.status = "RejectTender succeeded";
				state.reject_loading = false;
			})
			.addCase(RejectTender.rejected, (state, action) => {
				state.status = "RejectTender failed";
				state.reject_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postTenderDocuments.pending, (state, action) => {
				state.status = "postTenderDocuments pending";
				state.document_loading = true;
			})
			.addCase(postTenderDocuments.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "postTenderDocuments succeeded";
				state.document_loading = false;

				const split: string[] | undefined = response?.file?.split("/");
				state.uploadDocuments = [
					...(state.uploadDocuments || []),
					{
						...response,
						path: split ? split[split.length - 1] : "",
						preview: response.file,
						formattedSize: "",
					},
				];
			})
			.addCase(postTenderDocuments.rejected, (state, action) => {
				state.status = "postTenderDocuments failed";
				state.document_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postPdfUpload.pending, (state, action) => {
				state.status = "postPdfUpload pending";
				state.pdf_loading = true;
			})
			.addCase(postPdfUpload.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "postPdfUpload succeeded";
				state.pdf_loading = false;
				state.pdfFile = response;
			})
			.addCase(postPdfUpload.rejected, (state, action) => {
				state.status = "postPdfUpload failed";
				state.pdf_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postTenderJsonData.pending, (state, action) => {
				state.status = "postTenderJsonData pending";
				state.pdf_loading = true;
			})
			.addCase(postTenderJsonData.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "postTenderJsonData succeeded";
				state.pdf_loading = false;
				state.extractedData = {
					...response.result.extraction_json_data.data,
				};
			})
			.addCase(postTenderJsonData.rejected, (state, action) => {
				state.status = "postTenderJsonData failed";
				state.pdf_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	isModalOpen,
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	setTabs,
	setUploadDocument,
	setTenderMasterItemModalOpen,
	isAssignToModalOpen,
	setTenderState,
	setExtractedData,
	setIsUsersModalOpen,
} = tendersSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const tendersSelectors = (state: RootState) =>
	state.tenderManagement.tenders;

// Memoized selector
export const selectTenders = createSelector(
	[tendersSelectors, systemSelector, selectManageGroups, miniSelector],
	(tenders, system, groups, mini) => ({
		tenders,
		system,
		groups,
		mini,
	})
);

export const useTenderSelector = () => {
	const state = useAppSelector((state) => selectTenders(state));
	return state;
};

export default tendersSlice.reducer;
