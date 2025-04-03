import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { MaterialReceivedNotesInitialState, Mrn, MrnItem } from "./mrn.types";
import {
	editMaterialReceivedNotes,
	getMRNById,
	getMaterialReceivedNotes,
	postMaterialReceivedNotes,
	getPurchaseOrderById,
	getPOItems,
} from "./mrn.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: MaterialReceivedNotesInitialState = {
	loading: false,
	status: "",
	error: "",
	mrnList: [],
	mrnCount: 0,
	selectedData: {},
	isFilterOpen: false,
	loading_documents: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	vendorsByPE: [],
	vendorsByPELoading: false,
	invoice_document: [],
	selectedItems: [],
	purchaseorderLoading: false,
	poCount: 0,
	popageParams: {
		no_of_pages: 0,
		page_size: 10,
		ordering: "",
		page: 1,
		search: "",
		parent: ""
	},
	POItems: []
};

const materialReceivedNotesSlice = createSlice({
	name: "materialReceivedNotes",
	initialState,
	reducers: {
		clearVendorsByPE: (state, action) => {
			return {
				...state,
				vendorsByPE: [],
				vendorsByPELoading: false,
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
				invoice_document: action.payload,
			};
		},
		setSelectedItems: (state, action) => {
			return {
				...state,
				selectedItems: action.payload,
			};
		},
		clearPOItems: (state, action) => {
			return {
				...state,
				POItems: initialState.POItems,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getMaterialReceivedNotes.pending, (state, action) => {
				state.status = "getMaterialReceivedNotes pending";
				state.loading = true;
			})
			.addCase(getMaterialReceivedNotes.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getMaterialReceivedNotes succeeded";
				state.loading = false;
				state.mrnList = response.results;
				state.mrnCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.invoice_document = [];
			})
			.addCase(getMaterialReceivedNotes.rejected, (state, action) => {
				state.status = "getMaterialReceivedNotes failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getMRNById.pending, (state, action) => {
				state.status = "getMRNById pending";
				state.loading = true;
			})
			.addCase(getMRNById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getMRNById succeeded";
				state.loading = false;
				const mrn_items: MrnItem[] =
					response?.mrn_items?.map((e: MrnItem) => ({
						...e,
						qty: parseInt(`${e.qty}`),
						taxtype: {
							id: e?.taxtype,
							name: e?.taxtype_name || "",
						},
						batch_name: e?.batch?.name || "",
						dodelete: false,
						purchase_price: response?.purchaseorder?.poitems
							?.filter(poItem => poItem?.item?.id === e?.item?.id) // Match item-wise
							?.map(poItem => ({ last_purchase_value: poItem.last_purchase_value })) || [],
					})) || [];

				state.selectedData = {
					...response,
					purchaseorder: {
						...response?.purchaseorder,
						label: response?.purchaseorder?.code || "",
						value: response?.purchaseorder?.id || "",
					},
					location: {
						...response?.location,
						label: response?.location?.name || "",
						value: response?.location?.id || "",
					},
					purchase_price: response?.purchaseorder?.poitems?.reduce(
						(acc: { last_purchase_value: string | undefined }[], e) => {
							if (e?.last_purchase_value) {
								acc.push({ last_purchase_value: e.last_purchase_value });
							}
							return acc;
						},
						[]
					),
					mrnitem: response?.purchaseorder?.poitems?.reduce(
						(acc: { qty: string | undefined }[], e) =>
							acc.concat({ qty: e?.qty }),
						[] as { qty: string | undefined }[] // Explicitly specify the type of the initial value
					),
					mrn_items: mrn_items,
				};
				state.selectedItems = mrn_items;
				let documents =
					response?.invoice_document != null
						? [response?.invoice_document]
						: [];
				state.invoice_document = documents?.map((document: any) => {
					const split: string[] | undefined =
						document?.file?.split("/");
					return {
						...document,
						path: split ? split[split.length - 1] : "",
						preview: document?.file,
						formattedSize: "",
					};
				});
				state.vendorsByPE = [
					{
						id: response?.vendor?.id || "",
						name: response?.vendor?.name || "",
					},
				];
			})
			.addCase(getMRNById.rejected, (state, action) => {
				state.status = "getMRNById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postMaterialReceivedNotes.pending, (state, action) => {
				state.status = "postMaterialReceivedNotes pending";
				state.loading = true;
			})
			.addCase(postMaterialReceivedNotes.fulfilled, (state, action) => {
				state.status = "postMaterialReceivedNotes succeeded";
				state.loading = false;
			})
			.addCase(postMaterialReceivedNotes.rejected, (state, action) => {
				state.status = "postMaterialReceivedNotes failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editMaterialReceivedNotes.pending, (state, action) => {
				state.status = "editMaterialReceivedNotes pending";
				state.loading = true;
			})
			.addCase(editMaterialReceivedNotes.fulfilled, (state, action) => {
				state.status = "editMaterialReceivedNotes succeeded";
				state.loading = false;
			})
			.addCase(editMaterialReceivedNotes.rejected, (state, action) => {
				state.status = "editMaterialReceivedNotes failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getPurchaseOrderById.pending, (state, action) => {
				state.status = "getPurchaseOrderById pending";
				state.purchaseorderLoading = true;
			})
			.addCase(getPurchaseOrderById.fulfilled, (state, action) => {
				const { response }: any = action.payload;

				state.status = "getPurchaseOrderById succeeded";
				state.purchaseorderLoading = false;
				const mrn_items: MrnItem[] =
					response?.poitems?.map((e: any) => {
						return {
							...e,
							taxtype: {
								id: e.taxtype,
								name: e.taxtype_name,
							},
							make: {
								...e.make,
								value: e?.make?.id,
								label: e?.make?.name,
							},
							dodelete: false,
						};
					}) || [];
				state.purchaseorder = {
					...response,
					mrnitem: response?.poitems?.reduce(
						(acc: any[], e: any) => acc.concat({ qty: e?.qty }),
						[]
					),
					mrn_items: mrn_items,
				};
				state.vendorsByPE = [
					{
						id: response.vendor.id,
						name: response.vendor.name,
					},
				];
			})
			.addCase(getPurchaseOrderById.rejected, (state, action) => {
				state.status = "getPurchaseOrderById failed";
				state.purchaseorderLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getPOItems.pending, (state, action) => {
				state.status = "getPOItems pending";
				state.loading = true;
			})
			.addCase(getPOItems.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getPOItems succeeded";
				state.loading = false;
				state.POItems = response?.results;
				state.poCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.popageParams = {
					...state.popageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.invoice_document = [];
			})
			.addCase(getPOItems.rejected, (state, action) => {
				state.status = "getPOItems failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
	},
});

// Action creators are generated for each case reducer function
export const {
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	clearVendorsByPE,
	setUploadDocument,
	setSelectedItems,
	clearPOItems
} = materialReceivedNotesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const materialReceivedNotesSelectors = (state: RootState) =>
	state.projectManagement.materialReceivedNotes;

// Memoized selector
export const selectMaterialReceivedNotes = createSelector(
	[
		materialReceivedNotesSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		materialReceivedNotes,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		materialReceivedNotes,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export default materialReceivedNotesSlice.reducer;
