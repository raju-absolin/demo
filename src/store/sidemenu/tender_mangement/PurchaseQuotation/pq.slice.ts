import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { PurchaseQuotationInitialState, QuotationItem } from "./pq.types";
import {
	deletePQAttachment,
	editPurchaseQuotation,
	getPQAttachments,
	getPurchaseEnquiryById,
	getPurchaseQuotationById,
	getPurchaseQuotations,
	getVendorByEnquiryId,
	getVendorsByPE,
	postPQAttachment,
	postPurchaseQuotation,
} from "./pq.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { tendersSelectors } from "../tenders/tenders.slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { PQItem } from "../purchaseEnquiry/purchase_enquiry.types";

const createPQItem = (item: PQItem) => ({
	peItem: item,
	qty: parseInt(item?.quantity || "0", 10), // Fallback to "0" if quantity is undefined
	item: {
		...item?.item,
		value: item?.item?.id || "", // Ensure `value` is always a string
		label: item?.item?.name || "", // Ensure `label` is always a string
	},
	unit: {
		...item?.unit,
		value: item?.unit?.id || "", // Ensure `value` is always a string
		label: item?.unit?.name || "", // Ensure `label` is always a string
	},
	make: {
		...item?.make,
		value: item?.make?.id || undefined, // Allow `undefined` for optional fields
		label: item?.make?.name || undefined,
	},
	taxtype: {
		value: item.taxtype || 0, // Fallback to 0 if `taxtype` is undefined
		label: item.taxtype_name || "", // Fallback to an empty string
	},
});

const initialState: PurchaseQuotationInitialState = {
	loading: false,
	status: "",
	error: "",
	purchaseQuotationList: [],
	purchaseQuotationCount: 0,
	selectedData: {},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	vendorsByPE: {
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
	pq_attachment_loading: false,
	pq_attachments: [],
	pq_attachments_count: 0,
	Pq_attachments_params: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	uploadDocuments: [],

	selectedItems: [],
	pe_loading: false,
};

const purchaseQuotationSlice = createSlice({
	name: "purchaseQuatation",
	initialState,
	reducers: {
		clearVendorsByPE: (state, action) => {
			return {
				...state,
				vendorsByPE: initialState.vendorsByPE,
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
				pq_attachments: action.payload,
			};
		},
		setSelectedItems: (state, action) => {
			return {
				...state,
				selectedItems: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getPurchaseQuotations.pending, (state, action) => {
				state.status = "getPurchaseQuotations pending";
				state.loading = true;
			})
			.addCase(getPurchaseQuotations.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getPurchaseQuotations succeeded";
				state.loading = false;
				state.purchaseQuotationList = response.results;
				state.purchaseQuotationCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getPurchaseQuotations.rejected, (state, action) => {
				state.status = "getPurchaseQuotations failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getPurchaseQuotationById.pending, (state, action) => {
				state.status = "getPurchaseQuotationById pending";
				state.loading = true;
			})
			.addCase(getPurchaseQuotationById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getPurchaseQuotationById succeeded";
				state.loading = false;

				const pq_items: QuotationItem[] =
					response?.quotationitems?.map((e: QuotationItem) => {
						return {
							...e,
							original_quantity: e.originalqty,
							qty: e?.qty ? parseInt(`${e?.qty}`) : "",
							item: {
								...e?.item,
								value: e?.item?.id,
								label: e?.item?.name,
							},
							make: {
								...e?.make,
								value: e?.make?.id,
								label: e?.make?.name,
							},
							taxtype: {
								value: e.taxtype,
								label: e.taxtype_name,
							},
							tax: {
								...e.tax,
								value: e.tax?.id,
								label: e.tax?.name,
							},
							peItem: e,
							dodelete: false,
						};
					}) || [];
				state.selectedData = {
					...state.selectedData,
					...response,
					purchase_enquiry: {
						name: response.purchase_enquiry.code,
						id: response.purchase_enquiry.id,
					},
					quotationitems: pq_items,
				};
				state.selectedItems = pq_items;
				state.pq_attachments = response.documents?.map(
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
			.addCase(getPurchaseQuotationById.rejected, (state, action) => {
				state.status = "getPurchaseQuotationById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postPurchaseQuotation.pending, (state, action) => {
				state.status = "postPurchaseQuotation pending";
				state.loading = true;
			})
			.addCase(postPurchaseQuotation.fulfilled, (state, action) => {
				state.status = "postPurchaseQuotation succeeded";
				state.loading = false;
			})
			.addCase(postPurchaseQuotation.rejected, (state, action) => {
				state.status = "postPurchaseQuotation failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editPurchaseQuotation.pending, (state, action) => {
				state.status = "editPurchaseQuotation pending";
				state.loading = true;
			})
			.addCase(editPurchaseQuotation.fulfilled, (state, action) => {
				state.status = "editPurchaseQuotation succeeded";
				state.loading = false;
			})
			.addCase(editPurchaseQuotation.rejected, (state, action) => {
				state.status = "editPurchaseQuotation failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getVendorsByPE.pending, (state, action) => {
				state.status = "getVendorsByPE loading";
				state.vendorsByPE.loading = true;
			})
			.addCase(getVendorsByPE.fulfilled, (state, action) => {
				state.status = "getVendorsByPE succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.vendorsByPE.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.vendorsByPE.miniParams?.page_size
				);
				state.vendorsByPE = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.vendorsByPE.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getVendorsByPE.rejected, (state, action) => {
				state.status = "getVendorsByPE failed";
				state.vendorsByPE.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getPurchaseEnquiryById.pending, (state, action) => {
				state.status = "getPurchaseEnquiryById pending";
				state.pe_loading = true;
			})
			.addCase(getPurchaseEnquiryById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getPurchaseEnquiryById succeeded";
				state.pe_loading = false;

				state.selectedData = {
					...state.selectedData,
					...response,
					purchase_enquiry: {
						name: response?.code,
						id: response?.id,
					},
					quotationitems: response?.pqitems?.map((e: PQItem) => {
						const peItem = createPQItem(e);
						return {
							...e,
							...peItem,
							id: "",
						};
					}) as any,
				};
			})
			.addCase(getPurchaseEnquiryById.rejected, (state, action) => {
				state.status = "getPurchaseEnquiryById failed";
				state.pe_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			}) // get PQ attachments
			.addCase(getPQAttachments.pending, (state, action) => {
				state.status = "getPQAttachments pending";
				state.pq_attachment_loading = true;
			})
			.addCase(getPQAttachments.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getPQAttachments succeeded";
				state.pq_attachment_loading = false;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.pq_attachments, ...response.results];
				}

				list = list
					? list?.map((document) => {
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

				state.pq_attachments = list;
				state.pq_attachments_count = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);

				state.Pq_attachments_params = {
					...state.Pq_attachments_params,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getPQAttachments.rejected, (state, action) => {
				state.status = "getPQAttachments failed";
				state.pq_attachment_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post attachment Data
			.addCase(postPQAttachment.pending, (state, action) => {
				state.status = "postPQAttachment pending";
				state.pq_attachment_loading = true;
			})
			.addCase(postPQAttachment.fulfilled, (state, action) => {
				state.status = "postPQAttachment succeeded";
				state.pq_attachment_loading = false;
			})
			.addCase(postPQAttachment.rejected, (state, action) => {
				state.status = "postPQAttachment failed";
				state.pq_attachment_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//delete attachment Data
			.addCase(deletePQAttachment.pending, (state, action) => {
				state.status = "deletePQAttachment pending";
				state.pq_attachment_loading = true;
			})
			.addCase(deletePQAttachment.fulfilled, (state, action) => {
				state.status = "deletePQAttachment succeeded";
				state.pq_attachment_loading = false;
			})
			.addCase(deletePQAttachment.rejected, (state, action) => {
				state.status = "deletePQAttachment failed";
				state.pq_attachment_loading = false;
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
	clearVendorsByPE,
	setUploadDocument,
	setSelectedItems,
} = purchaseQuotationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const purchaseQuotationSelectors = (state: RootState) =>
	state.tenderManagement.purchaseQuatation;

// Memoized selector
export const selectPurchaseQuotations = createSelector(
	[
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		tendersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(purchaseQuotation, purchaseEnquiry, tenders, system, mini, customise) => ({
		purchaseQuotation,
		purchaseEnquiry,
		tenders,
		system,
		mini,
		customise,
	})
);

export default purchaseQuotationSlice.reducer;
