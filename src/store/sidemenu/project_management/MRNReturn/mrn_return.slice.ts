import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { MRNReturnReturnInitialState } from "./mrn_return.types";
import {
	editMRNReturn,
	getMRNById,
	getMRNReturnById,
	getMRNReturn,
	postMRNReturn,
	getStockDetails,
	postMRNReturnDocuments,
	getBatchQuantity,
} from "./mrn_return.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: MRNReturnReturnInitialState = {
	loading: false,
	status: "",
	error: "",
	mrnReturnList: [],
	mrnReturnCount: 0,
	selectedData: {},
	isFilterOpen: false,
	loading_documents: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	vendorsByMRN: [],
	vendorsByMRNLoading: false,
	documents: [],
	selectedItems: [],
	mrndata: {},
	batchAgainstItemsList: [],
	batchListCount: 0,
	batchPageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	batchloading: false
};

const mrnReturnSlice = createSlice({
	name: "mrnReturn",
	initialState,
	reducers: {
		clearVendorsByPE: (state, action) => {
			return {
				...state,
				vendorsByMRN: [],
				vendorsByMRNLoading: false,
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
				documents: action.payload,
			};
		},
		setSelectedItems: (state, action) => {
			return {
				...state,
				selectedItems: action.payload,
			};
		},
		clearBatchQuantity: (state, action) => {
			return {
				...state,
				batchAgainstItemsList: []
			}
		}
	},
	extraReducers(builder) {
		builder
			.addCase(getMRNReturn.pending, (state, action) => {
				state.status = "getMRNReturn pending";
				state.loading = true;
			})
			.addCase(getMRNReturn.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getMRNReturn succeeded";
				state.loading = false;
				state.mrnReturnList = response.results;
				state.mrnReturnCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.selectedData = {};
				state.documents = [];
			})
			.addCase(getMRNReturn.rejected, (state, action) => {
				state.status = "getMRNReturn failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getMRNReturnById.pending, (state, action) => {
				state.status = "getMRNReturnById pending";
				state.loading = true;
			})
			.addCase(getMRNReturnById.fulfilled, (state, action) => {
				const { response, mrn_return_items }: any = action.payload;
				state.status = "getMRNReturnById succeeded";
				state.loading = false;
				// const mrn_return_items = response?.mrnreturn_items?.map(
				// 	(e: any) => {
				// 		return {
				// 			...e,
				// 			price: e?.price,
				// 			qty: parseInt(e.qty),
				// 			item: {
				// 				id: e.item?.id,
				// 				name: e.item?.name,
				// 			},
				// 			batch_name: e.batch?.name,
				// 			batch: {
				// 				id: e?.batch?.id,
				// 				name: e?.batch?.name,
				// 			},
				// 			dodelete: false,
				// 		};
				// 	}
				// );
				state.selectedData = {
					...response,
					location: {
						...response.location,
						label: response?.location?.name,
						value: response?.location?.id,
					},
					warehouse: {
						...response.warehouse,
						label: response?.warehouse?.name,
						value: response?.warehouse?.id,
					},
					mrnreturnitem: response?.mrn?.mrn_items?.reduce(
						(acc: any[], e: any) => acc.concat({ qty: e?.qty }),
						[]
					),
					mrnreturn_items: mrn_return_items,
				};
				state.selectedItems = mrn_return_items;
				state.documents = response.documents?.map((document: any) => {
					const split: string[] | undefined =
						document?.file?.split("/");
					return {
						...document,
						path: split ? split[split.length - 1] : "",
						preview: document?.file,
						formattedSize: "",
					};
				});
				state.vendorsByMRN = response.vendors?.map((e: Vendor) => {
					return {
						...e,
						label: e.name,
						value: e.id,
					};
				});
			})
			.addCase(getMRNReturnById.rejected, (state, action) => {
				state.status = "getMRNReturnById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postMRNReturn.pending, (state, action) => {
				state.status = "postMRNReturn pending";
				state.loading = true;
			})
			.addCase(postMRNReturn.fulfilled, (state, action) => {
				state.status = "postMRNReturn succeeded";
				state.loading = false;
			})
			.addCase(postMRNReturn.rejected, (state, action) => {
				state.status = "postMRNReturn failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editMRNReturn.pending, (state, action) => {
				state.status = "editMRNReturn pending";
				state.loading = true;
			})
			.addCase(editMRNReturn.fulfilled, (state, action) => {
				state.status = "editMRNReturn succeeded";
				state.loading = false;
			})
			.addCase(editMRNReturn.rejected, (state, action) => {
				state.status = "editMRNReturn failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getMRNById.pending, (state, action) => {
				state.status = "getMRNById pending";
				state.loading = true;
			})
			.addCase(getMRNById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getMRNById succeeded";
				state.loading = false;
				state.selectedData = {
					...state.selectedData,
					mrnreturnitem: response?.mrn_items?.reduce(
						(acc: any[], e: any) => acc.concat({ qty: e?.qty }),
						[]
					),
					mrnreturn_items: response?.mrn_items,
				};
				state.mrndata = response;
				state.vendorsByMRN = [
					{
						id: response.vendor.id,
						name: response.vendor.name,
					},
				];
			})
			.addCase(getMRNById.rejected, (state, action) => {
				state.status = "getMRNById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getStockDetails.pending, (state, action) => {
				state.status = "getStockDetails pending";
				state.loading = true;
			})
			.addCase(getStockDetails.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getStockDetails succeeded";
				state.loading = false;
				state.stock_available = parseInt(response?.quantity);
			})
			.addCase(getStockDetails.rejected, (state, action) => {
				state.status = "getStockDetails failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postMRNReturnDocuments.pending, (state, action) => {
				state.status = "postMRNReturnDocuments pending";
				state.document_loading = true;
			})
			.addCase(postMRNReturnDocuments.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "postMRNReturnDocuments succeeded";
				state.document_loading = false;

				const split: string[] | undefined = response?.file?.split("/");
				state.documents = [
					...(state.documents || []),
					{
						...response,
						path: split ? split[split.length - 1] : "",
						preview: response.file,
						formattedSize: "",
					},
				];
			})
			.addCase(postMRNReturnDocuments.rejected, (state, action) => {
				state.status = "postMRNReturnDocuments failed";
				state.document_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getBatchQuantity.pending, (state, action) => {
				state.status = "getBatchQuantity pending";
				state.batchloading = true;
			})
			.addCase(getBatchQuantity.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getBatchQuantity succeeded";
				state.batchloading = false;
				state.batchAgainstItemsList = response.results;
				state.batchListCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.batchPageParams = {
					...state.batchPageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getBatchQuantity.rejected, (state, action) => {
				state.status = "getBatchQuantity failed";
				state.batchloading = false;
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
	clearBatchQuantity
} = mrnReturnSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const mrnReturnSelectors = (state: RootState) =>
	state.projectManagement.mrnReturn;

// Memoized selector
export const selectMRNReturn = createSelector(
	[
		mrnReturnSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		mrnReturn,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		mrnReturn,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export default mrnReturnSlice.reducer;
