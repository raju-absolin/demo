import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { WorkOrdersInitialState } from "./work_order.types";
import {
	editWorkOrder,
	getProjectTeam,
	getWorkOrderById,
	getWorkOrders,
	postTeamMembers,
	postWorkOrder,
} from "./work_order.action";
import { selectSystem, systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { tendersSelectors } from "../../tender_mangement/tenders/tenders.slice";

const initialState: WorkOrdersInitialState = {
	loading: false,
	status: "",
	error: "",
	workOrdersList: [],
	workOrderCount: 0,
	modal: false,
	selectedData: {},
	isFilterOpen: false,
	team_modal: false,
	team_loading: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	tabs: 0,
	projectTeams: {
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

	bidSelectionModal: false,
	bidSelected: false,
};

const workOrdersSlice = createSlice({
	name: "workOrder",
	initialState,
	reducers: {
		isModalOpen: (state, action) => {
			return {
				...state,
				modal: action.payload,
			};
		},
		isTeamModalOpen: (state, action) => {
			return {
				...state,
				team_modal: action.payload,
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
		setUploadDocument: (state, action) => {
			return {
				...state,
				uploadDocuments: action.payload,
			};
		},
		clearProjectTeams: (state, action) => {
			return {
				...state,
				projectTeams: initialState.projectTeams,
			};
		},
		setBidSelectionModal: (state, action) => {
			return {
				...state,
				bidSelectionModal: action.payload,
			};
		},
		setBidSelected: (state, action) => {
			return {
				...state,
				bidSelected: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getWorkOrders.pending, (state, action) => {
				state.status = "getWorkOrders pending";
				state.loading = true;
			})
			.addCase(getWorkOrders.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getWorkOrders succeeded";
				state.loading = false;
				state.workOrdersList = response.results;
				state.workOrderCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getWorkOrders.rejected, (state, action) => {
				state.status = "getWorkOrders failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getWorkOrderById.pending, (state, action) => {
				state.status = "getWorkOrderById pending";
				state.loading = true;
			})
			.addCase(getWorkOrderById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getWorkOrderById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					project_items: response.project_items?.map((e: any) => {
						return {
							...e,
							tenderitemmaster: {
								...e.tenderitemmaster,
								label: e?.tenderitemmaster?.name,
								value: e?.tenderitemmaster?.id,
							},
							tax: {
								label: e?.tax?.name,
								value: e?.tax,
							},
							taxtype: {
								label: e?.taxtype_name,
								value: e?.taxtype,
							},
							price:
								e?.price !== undefined && e?.price !== null
									? Math.round(Number(e.price)).toString()
									: "0",
							discount:
								e?.discount !== undefined &&
								e?.discount !== null
									? Math.round(Number(e.discount)).toString()
									: "0",
						};
					}),
					tender_documents: response.tender?.documents?.map((document) => {
						const split: string[] | undefined =
							document?.file?.split("/");
						return {
							...document,
							path: split ? split[split.length - 1] : "",
							preview: document?.file,
							formattedSize: "",
						};
					}),
					lead_documents: response.tender?.lead?.documents?.map((document) => {
						const split: string[] | undefined =
							document?.file?.split("/");
						return {
							...document,
							path: split ? split[split.length - 1] : "",
							preview: document?.file,
							formattedSize: "",
						};
					})
				};
				state.uploadDocuments = response.documents?.map(
					(document: any) => {
						const split: string[] | undefined =
							document?.file?.split("/");
						return {
							...document,
							path: split ? split[split.length - 1] : "",
							preview: document?.file,
							formattedSize: "",
						};
					}
				);
			})
			.addCase(getWorkOrderById.rejected, (state, action) => {
				state.status = "getWorkOrderById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postWorkOrder.pending, (state, action) => {
				state.status = "postWorkOrder pending";
				state.loading = true;
			})
			.addCase(postWorkOrder.fulfilled, (state, action) => {
				state.status = "postWorkOrder succeeded";
				state.loading = false;
			})
			.addCase(postWorkOrder.rejected, (state, action) => {
				state.status = "postWorkOrder failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editWorkOrder.pending, (state, action) => {
				state.status = "editWorkOrder pending";
				state.loading = true;
			})
			.addCase(editWorkOrder.fulfilled, (state, action) => {
				state.status = "editWorkOrder succeeded";
				state.loading = false;
			})
			.addCase(editWorkOrder.rejected, (state, action) => {
				state.status = "editWorkOrder failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getProjectTeam.pending, (state, action) => {
				state.status = "getProjectTeam loading";
				state.projectTeams.loading = true;
			})
			.addCase(getProjectTeam.fulfilled, (state, action) => {
				state.status = "getProjectTeam succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				// var list = [];
				// if (params?.page == 1) {
				// 	list = response.results;
				// } else {
				// 	list = [...state.projectTeams.list, ...response.results];
				// }
				var noofpages = Math.ceil(
					response.count / state.projectTeams.miniParams?.page_size
				);
				state.projectTeams = {
					list: response.results,
					count: response.count,
					loading: false,
					miniParams: {
						...state.projectTeams.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getProjectTeam.rejected, (state, action) => {
				state.status = "getProjectTeam failed";
				state.projectTeams.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(postTeamMembers.pending, (state, action) => {
				state.status = "postTeamMembers loading";
				state.team_loading = true;
			})
			.addCase(postTeamMembers.fulfilled, (state, action) => {
				state.status = "postTeamMembers succeeded";
				state.team_loading = false;
			})
			.addCase(postTeamMembers.rejected, (state, action) => {
				state.status = "postTeamMembers failed";
				state.team_loading = false;
				state.error = action.error.message ?? "Some Error occurred";
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
	clearProjectTeams,
	isTeamModalOpen,
	setBidSelectionModal,
	setBidSelected,
} = workOrdersSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const workOrdersSelectors = (state: RootState) =>
	state.projectManagement.workOrder;

// Memoized selector
export const selectWorkOrders = createSelector(
	[
		workOrdersSelectors,
		tendersSelectors,
		systemSelector,
		selectManageGroups,
		miniSelector,
	],
	(workOrder, tender, system, groups, mini) => ({
		workOrder,
		tender,
		system,
		groups,
		mini,
	})
);

export default workOrdersSlice.reducer;
