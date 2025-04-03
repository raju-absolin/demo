import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { LeadItem, LeadsState } from "./leads.types";
import {
	ApproveLead,
	ChangeLeadAssignees,
	editLeadData,
	getLeadById,
	getLeads,
	getVendorsByItems,
	postLeadData,
	postLeadDocuments,
	RejectLead,
} from "./leads.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: LeadsState = {
	loading: false,
	loading_documents: false,
	status: "",
	error: "",
	leadsList: [],
	approve_loading: false,
	reject_loading: false,
	leadsCount: 0,
	modal: false,
	selectedData: {},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	vendorsAganistItems: {
		list: [],
		loading: false,
		count: 0,
		miniParams: {
			no_of_pages: 0,
			page_size: 10,
			page: 1,
			search: "",
		},
	},
	uploadDocuments: [],
	showPreview: false,
	isUsersModalOpen: false,
	user_loading: false,
	selected_users: [],
};

const leadsSlice = createSlice({
	name: "leads",
	initialState,
	reducers: {
		isModalOpen: (state, action) => {
			return {
				...state,
				modal: action.payload,
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
		setUploadDocument: (state, action) => {
			return {
				...state,
				uploadDocuments: action.payload,
			};
		},
		clearVendorsAganistItems: (state, action) => {
			return {
				...state,
				vendorsAganistItems: initialState.vendorsAganistItems,
			};
		},
		setIsUsersModalOpen: (state, action) => {
			return {
				...state,
				isUsersModalOpen: action.payload,
			};
		},
		setSelectedUsers: (state, action) => {
			return {
				...state,
				selected_users: action.payload,
			};
		},
		setShowPreview: (state, action) => {
			return {
				...state,
				showPreview: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getLeads.pending, (state, action) => {
				state.status = "getLeads pending";
				state.loading = true;
			})
			.addCase(getLeads.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getLeads succeeded";
				state.loading = false;
				state.leadsList = response.results;
				state.leadsCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);

				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.selectedData = {
					date: "",
					name: "",
					mobile: "",
					email: "",
					lead_items: [],
				};
			})
			.addCase(getLeads.rejected, (state, action) => {
				state.status = "getLeads failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getLeadById.pending, (state, action) => {
				state.status = "getLeadById pending";
				state.loading = true;
			})
			.addCase(getLeadById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getLeadById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					lead_items: response.lead_items?.map((e: any) => {
						return {
							...e,
							item: {
								...e.item,
								value: e.item.id,
								label: e.item.name,
							},
							unit: {
								...e.unit,
								label: e?.unit?.name,
								value: e?.unit?.id,
							},
							vendors: e?.vendors?.map((val: any) => {
								return {
									...val,
									label: val?.name,
									value: val?.id,
								};
							}),
						};
					}),
				};
				state.uploadDocuments = response?.documents
					? response?.documents?.map((document) => {
							const split: string[] | undefined =
								document?.file?.split("/");
							return {
								...document,
								path: split ? split[split.length - 1] : "",
								preview: document?.file,
								formattedSize: "",
							};
						})
					: [];
			})
			.addCase(getLeadById.rejected, (state, action) => {
				state.status = "getLeadById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postLeadData.pending, (state, action) => {
				state.status = "postLeadData pending";
				state.loading = true;
			})
			.addCase(postLeadData.fulfilled, (state, action) => {
				state.status = "postLeadData succeeded";
				state.loading = false;
			})
			.addCase(postLeadData.rejected, (state, action) => {
				state.status = "postLeadData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editLeadData.pending, (state, action) => {
				state.status = "editLeadData pending";
				state.loading = true;
			})
			.addCase(editLeadData.fulfilled, (state, action) => {
				state.status = "editLeadData succeeded";
				state.loading = false;
			})
			.addCase(editLeadData.rejected, (state, action) => {
				state.status = "editLeadData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postLeadDocuments.pending, (state, action) => {
				state.status = "postLeadDocuments pending";
				state.loading_documents = true;
			})
			.addCase(postLeadDocuments.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "postLeadDocuments succeeded";
				state.loading_documents = false;

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
			.addCase(postLeadDocuments.rejected, (state, action) => {
				state.status = "postTenderDocuments failed";
				state.loading_documents = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getVendorsByItems.pending, (state, action) => {
				state.status = "getVendorsByItems loading";
				state.vendorsAganistItems.loading = true;
			})
			.addCase(getVendorsByItems.fulfilled, (state, action) => {
				state.status = "getVendorsByItems succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.vendorsAganistItems.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.vendorsAganistItems.miniParams?.page_size
				);
				state.vendorsAganistItems = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.vendorsAganistItems.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getVendorsByItems.rejected, (state, action) => {
				state.status = "getVendorsByItems failed";
				state.vendorsAganistItems.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(ApproveLead.pending, (state, action) => {
				state.status = "ApproveLead pending";
				state.approve_loading = true;
			})
			.addCase(ApproveLead.fulfilled, (state, action) => {
				state.status = "ApproveLead succeeded";
				state.approve_loading = false;
			})
			.addCase(ApproveLead.rejected, (state, action) => {
				state.status = "ApproveLead failed";
				state.approve_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(RejectLead.pending, (state, action) => {
				state.status = "RejectLead pending";
				state.reject_loading = true;
			})
			.addCase(RejectLead.fulfilled, (state, action) => {
				state.status = "RejectLead succeeded";
				state.reject_loading = false;
			})
			.addCase(RejectLead.rejected, (state, action) => {
				state.status = "RejectLead failed";
				state.reject_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(ChangeLeadAssignees.pending, (state, action) => {
				state.status = "ChangeLeadAssignees pending";
				state.user_loading = true;
			})
			.addCase(ChangeLeadAssignees.fulfilled, (state, action) => {
				state.status = "ChangeLeadAssignees succeeded";
				state.user_loading = false;
			})
			.addCase(ChangeLeadAssignees.rejected, (state, action) => {
				state.status = "ChangeLeadAssignees failed";
				state.user_loading = false;
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
	clearVendorsAganistItems,
	setUploadDocument,
	setIsUsersModalOpen,
	setShowPreview,
} = leadsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const leadSelector = (state: RootState) =>
	state.strategicManagement.leads;

// Memoized selector
export const selectLeads = createSelector(
	[leadSelector, systemSelector, miniSelector],
	(leads, system, mini) => ({
		leads,
		system,
		mini,
	})
);

export default leadsSlice.reducer;
