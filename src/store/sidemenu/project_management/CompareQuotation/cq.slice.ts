import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import {
	CheckedListItem,
	CompareQuotation,
	CompareQuotationInitialState,
	CompareQuotationItem,
} from "./cq.types";
import {
	editCompareQuotation,
	getCompareQuotationById,
	getCompareQuotations,
	getPeAgaintComparequotation,
	getPoByPe,
	getPurchaseEnquiryById,
	getPurchaseQuotations,
	postCompareQuotation,
} from "./cq.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseQuotationSelectors } from "../PurchaseQuotation/pq.slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { workOrdersSelectors } from "../work_order/work_order.slice";

const initialState: CompareQuotationInitialState = {
	loading: false,
	isGeneratePoModalOpen: false,
	status: "",
	error: "",
	compareQuotationList: [],
	vendorRelatedItems: [],
	POByPE: [],
	compareQuotationCount: 0,
	selectedData: {},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
		project_id: "",
	},
	PEaganistCQ: {
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
	checkedList: {},

	// PQ
	PQLoading: false,
	purchaseQuotationList: [],
	purchaseQuotationCount: 0,
	PQpageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
		project_id: "",
	},

	// PE
	peSelectedData: {},
	peLoading: false,
};

const compareQuotationSlice = createSlice({
	name: "compareQuotation",
	initialState,
	reducers: {
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
			};
		},
		PESetSelectedData: (state, action) => {
			return {
				...state,
				peSelectedData: action.payload,
			};
		},
		clearPurchaseQuotation: (state, action) => {
			return {
				...state,
				PQLoading: false,
				purchaseQuotationList: [],
				purchaseQuotationCount: 0,
				PQpageParams: {
					page: 1,
					page_size: 10,
					search: "",
					no_of_pages: 0,
					project_id: "",
				},
			};
		},
		setSelectedVendor: (state, action) => {
			return {
				...state,
				selectedVendor: action.payload,
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
		setcheckedList: (state, action) => {
			return {
				...state,
				checkedList: action.payload,
			};
		},
		setVendorRelatedItems: (state, action) => {
			return {
				...state,
				vendorRelatedItems: action.payload,
			};
		},
		setGeneratePOModalOpen: (state, action) => {
			const vendorMap = new Map<string, any>(); // Use Map to track unique vendors by ID

			state.selectedData?.comparequotationitems?.forEach((item) => {
				if (item.vendor && item.vendor.id) {
					const vendorId = item.vendor.id;

					// Check if the vendor is already in the map
					if (!vendorMap.has(vendorId)) {
						vendorMap.set(vendorId, {
							...item.vendor,
							vendorItems:
								state.selectedData?.comparequotationitems?.filter(
									(cqitem) => cqitem?.vendor?.id === vendorId
								), // Array of items for this vendor
							deliverydate: item?.quotation?.deliverydate,
							total:
								state.selectedData?.comparequotationitems
									?.filter(
										(cqitem) =>
											cqitem?.vendor?.id === vendorId
									)
									?.reduce(
										(acc, value) =>
											acc +
											parseInt(`${value?.total_price}`),
										0
									) || 0,

							quotation:
								state.selectedData?.comparequotationitems?.find(
									(cqitem) => cqitem?.vendor?.id === vendorId
								)?.quotation,
						});
					}
				}
			});

			const vendorsData = Array.from(vendorMap.values()).filter(
				(vendor) => {
					return !state.POByPE?.some(
						(e: any) => e.vendor.id === vendor.id
					);
				}
			);
			return {
				...state,
				isGeneratePoModalOpen: action.payload,
				vendorRelatedItems: vendorsData,
				selectedVendor: vendorsData[0],
			};
		},
		clearPEaganistCQ: (state, action) => {
			return {
				...state,
				PEaganistCQ: initialState.PEaganistCQ,
			};
		},
		setPOByPE: (state, action) => {
			return {
				...state,
				POByPE: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getCompareQuotations.pending, (state, action) => {
				state.status = "getCompareQuotations pending";
				state.loading = true;
			})
			.addCase(getCompareQuotations.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getCompareQuotations succeeded";
				state.loading = false;

				state.compareQuotationList = response.results;
				state.compareQuotationCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getCompareQuotations.rejected, (state, action) => {
				state.status = "getCompareQuotations failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getCompareQuotationById.pending, (state, action) => {
				state.status = "getCompareQuotationById pending";
				state.loading = true;
			})
			.addCase(getCompareQuotationById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getCompareQuotationById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					purchase_enquiry: {
						...response.purchase_enquiry,
						name: response.purchase_enquiry.code,
					},
				};
				const obj: any = {};

				const mappedOutput: CheckedListItem[] =
					response.comparequotationitems?.map(
						(e: CompareQuotationItem) => {
							return {
								id: e.id,
								temp_q: e.quotation,
								quotationitem: {
									...e.quotationitem,
									available_qty: e?.qty,
									margin_value: e?.margin_value,
								},
								vendor: e.vendor,
								purchase_enquiry_item_id:
									typeof e?.purchase_enquiry_item == "string"
										? e?.purchase_enquiry_item
										: e?.purchase_enquiry_item?.id,
							};
						}
					);

				response.comparequotationitems.forEach((e: any) => {
					obj[e?.purchase_enquiry_item?.id] = [
						...(obj[e?.purchase_enquiry_item?.id] || []),
						mappedOutput.find(
							(moItem: CheckedListItem) =>
								moItem?.quotationitem?.id ===
								e?.quotationitem?.id
						),
					];
				});

				state.checkedList = obj;
			})
			.addCase(getCompareQuotationById.rejected, (state, action) => {
				state.status = "getCompareQuotationById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getPurchaseQuotations.pending, (state, action) => {
				state.status = "getPurchaseQuotations pending";
				state.PQLoading = true;
			})
			.addCase(getPurchaseQuotations.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getPurchaseQuotations succeeded";
				state.PQLoading = false;

				state.purchaseQuotationList = response.results;
				state.purchaseQuotationCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.PQpageParams = {
					...state.PQpageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getPurchaseQuotations.rejected, (state, action) => {
				state.status = "getPurchaseQuotations failed";
				state.PQLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// PE by id
			.addCase(getPurchaseEnquiryById.pending, (state, action) => {
				state.status = "getPurchaseEnquiryById pending";
				state.peLoading = true;
			})
			.addCase(getPurchaseEnquiryById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getPurchaseEnquiryById succeeded";
				state.peLoading = false;
				state.peSelectedData = {
					...response,
					pqitems: response?.pqitems?.map((e: any) => {
						return {
							...e,
							price: 0,
							total_price: 0,
							qty: parseInt(e.quantity),
							item: {
								...e?.item,
								id: e?.item?.id,
								name: e?.item?.name,
							},
							make: {
								...e?.make,
								value: e?.make?.id,
								label: e?.make?.name,
							},
							dodelete: false,
						};
					}),
				};
			})
			.addCase(getPurchaseEnquiryById.rejected, (state, action) => {
				state.status = "getPurchaseEnquiryById failed";
				state.peLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postCompareQuotation.pending, (state, action) => {
				state.status = "postCompareQuotation pending";
				state.loading = true;
			})
			.addCase(postCompareQuotation.fulfilled, (state, action) => {
				state.status = "postCompareQuotation succeeded";
				state.loading = false;
			})
			.addCase(postCompareQuotation.rejected, (state, action) => {
				state.status = "postCompareQuotation failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editCompareQuotation.pending, (state, action) => {
				state.status = "editCompareQuotation pending";
				state.loading = true;
			})
			.addCase(editCompareQuotation.fulfilled, (state, action) => {
				state.status = "editCompareQuotation succeeded";
				state.loading = false;
			})
			.addCase(editCompareQuotation.rejected, (state, action) => {
				state.status = "editCompareQuotation failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(getPoByPe.pending, (state, action) => {
				state.status = "getPoByPe pending";
				state.loading = true;
			})
			.addCase(getPoByPe.fulfilled, (state, action) => {
				const { response }: any = action.payload;

				state.status = "getPoByPe succeeded";
				state.loading = false;
				state.POByPE = response;

				const vendorMap = new Map<string, any>(); // Use Map to track unique vendors by ID

				state.selectedData?.comparequotationitems?.forEach((item) => {
					if (item.vendor && item.vendor.id) {
						const vendorId = item.vendor.id;

						const vendor_cp_items =
							state.selectedData?.comparequotationitems?.filter(
								(cqitem) => cqitem?.vendor?.id === vendorId
							);

						// Check if the vendor is already in the map
						if (!vendorMap.has(vendorId)) {
							vendorMap.set(vendorId, {
								...item.vendor,
								vendorItems: vendor_cp_items, // Array of items for this vendor
								deliverydate: item?.quotation?.deliverydate,
								total:
									vendor_cp_items?.reduce(
										(acc, value) =>
											acc +
											parseInt(`${value?.total_price}`),
										0
									) || 0,

								quotation:
									state.selectedData?.comparequotationitems?.find(
										(cqitem) =>
											cqitem?.vendor?.id === vendorId
									)?.quotation,
							});
						}
					}
				});

				const vendorsData = Array.from(vendorMap.values()).filter(
					(vendor) => {
						return response?.some(
							(e: any) => e.vendor.id === vendor.id
						);
					}
				);
				state.vendorRelatedItems = vendorsData;
			})
			.addCase(getPoByPe.rejected, (state, action) => {
				state.status = "getPoByPe failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getPeAgaintComparequotation.pending, (state, action) => {
				state.status = "getPeAgaintComparequotation loading";
				state.PEaganistCQ.loading = true;
			})
			.addCase(getPeAgaintComparequotation.fulfilled, (state, action) => {
				state.status = "getPeAgaintComparequotation succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.PEaganistCQ.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.PEaganistCQ.miniParams?.page_size
				);
				state.PEaganistCQ = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.PEaganistCQ.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getPeAgaintComparequotation.rejected, (state, action) => {
				state.status = "getPeAgaintComparequotation failed";
				state.PEaganistCQ.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	setcheckedList,
	setGeneratePOModalOpen,
	setSelectedVendor,
	setVendorRelatedItems,
	clearPEaganistCQ,
	PESetSelectedData,
	clearPurchaseQuotation,
	setPOByPE,
} = compareQuotationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const compareQuotationSelectors = (state: RootState) =>
	state.projectManagement.compareQuotation;

// Memoized selector
export const selectCompareQuotations = createSelector(
	[
		compareQuotationSelectors,
		workOrdersSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		systemSelector,
		miniSelector,
	],
	(
		compareQuotation,
		workOrder,
		purchaseQuotation,
		purchaseEnquiry,
		system,
		mini
	) => ({
		compareQuotation,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
	})
);

export default compareQuotationSlice.reducer;
