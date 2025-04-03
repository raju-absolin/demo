import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { PurchaseOrderInitialState } from "./po.types";
import {
	editPurchaseOrder,
	getPurchaseOrderById,
	getPurchaseOrders,
	getVendorByOrderId,
	postPODocuments,
	postPurchaseOrder,
	purchaseOrderApproval,
	// purchaseOrderCheckApproval,
	updatePurchaseOrderStatus,
} from "./po.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";

const initialState: PurchaseOrderInitialState = {
	loading: false,
	status: "",
	error: "",
	purchaseOrderList: [],
	purchaseOrderCount: 0,
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	vendorsByPO: [],
	vendorsByPOLoading: false,
	approve_loading: false,
	checkApprove: false,
	approved_level: 0,
	approved_status: 0,
	approved_status_name: "",
	approved_data: {},
	model: false,
	rejectModel: false,
	confirmModel: false,
	reject_description: "",
	uploadDocuments: [],
	document_loading: false,
	client_status_name: "",
	generatePOModal: false,
	purchasePrice: 0,
	TaxPrice: 0,
	TaxAmount: 0,
	selectedData: {},
};

const purchaseOrderSlice = createSlice({
	name: "purchaseOrder",
	initialState,
	reducers: {
		clearVendorsByPO: (state, action) => {
			return {
				...state,
				vendorsByPO: [],
				vendorsByPOLoading: false,
			};
		},
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
			};
		},
		setApprovedData: (state, action) => {
			return {
				...state,
				approved_data: action.payload,
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
		getPurchaseCheckApprove: (state) => {
			return {
				...state,
				approve_loading: true,
				checkApprove: false,
			};
		},
		purchasesCheckApproveSuccessful: (state, action) => {
			return {
				...state,
				approve_loading: false,
				checkApprove: action.payload,
			};
		},
		setIsModalOpen: (state, action) => {
			return {
				...state,
				model: action.payload,
			};
		},
		setIsRejectModalOpen: (state, action) => {
			return {
				...state,
				rejectModel: action.payload,
			};
		},
		setConfirmModal: (state, action) => {
			return {
				...state,
				confirmModel: action.payload,
			};
		},
		setUploadDocument: (state, action) => {
			return {
				...state,
				uploadDocuments: action.payload,
			};
		},
		setGeneratePOModalOpen: (state, action) => {
			return {
				...state,
				generatePOModal: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getPurchaseOrders.pending, (state, action) => {
				state.status = "getPurchaseOrders pending";
				state.loading = true;
			})
			.addCase(getPurchaseOrders.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getPurchaseOrders succeeded";
				state.loading = false;
				state.purchaseOrderList = response.results;
				state.purchaseOrderCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getPurchaseOrders.rejected, (state, action) => {
				state.status = "getPurchaseOrders failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getPurchaseOrderById.pending, (state, action) => {
				state.status = "getPurchaseOrderById pending";
				state.loading = true;
			})
			.addCase(getPurchaseOrderById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getPurchaseOrderById succeeded";
				state.approved_data = response;
				state.approved_level = response?.approved_level;
				state.approved_status = response?.approved_status;
				state.approved_status_name = response?.approved_status_name;
				state.client_status_name = response?.client_status_name;
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
				state.purchasePrice = response?.poitems?.reduce(
					(sum: number, e: any) =>
						sum + (parseFloat(e.price) * parseInt(e.qty) || 0),
					0
				);
				(state.TaxAmount = response?.poitems?.map((e: any) => {
					const qty = e?.qty ? +e?.qty : 0;
					const tem_price = e?.price ? parseFloat(e?.price) : 0;

					const discount_percentage = e?.discount ? +e?.discount : 0;
					const discount_amount =
						(discount_percentage / 100) * tem_price;
					const price_after_discount = discount_percentage
						? parseFloat(`${tem_price - discount_amount}`).toFixed(
								2
							)
						: tem_price;
					let gross = parseFloat(
						`${qty * parseFloat(`${price_after_discount}`)}`
					).toFixed(2);
					const tax_amount =
						e?.taxType == 2
							? e?.tax?.id
								? (e?.tax?.tax / 100) * parseFloat(gross)
								: 0
							: (() => {
									const basicValue =
										parseFloat(gross) /
										((100 + e?.tax?.tax) / 100);
									const taxamt =
										(basicValue / 100) * e?.tax?.tax;

									gross = parseFloat(
										`${taxamt + basicValue}`
									).toFixed(2);
									return (basicValue / 100) * e?.tax?.tax;
								})();
					return tax_amount;
				})),
					(state.TaxPrice = state.TaxAmount?.reduce(
						(acc: number, num: number) => acc + num,
						0
					).toFixed(2));
				state.selectedData = {
					...state.selectedData,
					...response,
					purchaseenquiry: {
						code: response.purchaseenquiry.code,
						required_date: response.purchaseenquiry.required_date,
						id: response.purchaseenquiry.id,
					},
					poitems: response?.poitems?.map((e: any) => {
						return {
							...e,
							qty: parseInt(e.qty),
							item: {
								id: e.item.id,
								name: e.item.name,
							},
							taxtype: {
								value: e.taxtype,
								label: e.taxtype_name,
							},
							dodelete: false,
						};
					}),
				};
				state.loading = false;
			})
			.addCase(getPurchaseOrderById.rejected, (state, action) => {
				state.status = "getPurchaseOrderById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getVendorByOrderId.pending, (state, action) => {
				state.status = "getVendorByOrderId pending";
				state.vendorsByPOLoading = true;
			})
			.addCase(getVendorByOrderId.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getVendorByOrderId succeeded";
				state.vendorsByPOLoading = false;
				state.vendorsByPO = response.map((e: any) => {
					return {
						id: e.id,
						name: e.name,
					};
				});
			})
			.addCase(getVendorByOrderId.rejected, (state, action) => {
				state.status = "getVendorByOrderId failed";
				state.vendorsByPOLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postPurchaseOrder.pending, (state, action) => {
				state.status = "postPurchaseOrder pending";
				state.loading = true;
			})
			.addCase(postPurchaseOrder.fulfilled, (state, action) => {
				state.status = "postPurchaseOrder succeeded";
				state.loading = false;
			})
			.addCase(postPurchaseOrder.rejected, (state, action) => {
				state.status = "postPurchaseOrder failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editPurchaseOrder.pending, (state, action) => {
				state.status = "editPurchaseOrder pending";
				state.loading = true;
			})
			.addCase(editPurchaseOrder.fulfilled, (state, action) => {
				state.status = "editPurchaseOrder succeeded";
				state.loading = false;
			})
			.addCase(editPurchaseOrder.rejected, (state, action) => {
				state.status = "editPurchaseOrder failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(purchaseOrderApproval.pending, (state, action) => {
				state.status = "purchaseOrderApproval pending";
				state.approve_loading = true;
			})
			.addCase(purchaseOrderApproval.fulfilled, (state, action) => {
				state.status = "purchaseOrderApproval succeeded";
				state.approve_loading = false;
			})
			.addCase(purchaseOrderApproval.rejected, (state, action) => {
				state.status = "purchaseOrderApproval failed";
				state.approve_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// .addCase(purchaseOrderCheckApproval.pending, (state, action) => {
			// 	state.status = "purchaseOrderCheckApproval pending";
			// 	state.approve_loading = true;
			// })
			// .addCase(purchaseOrderCheckApproval.fulfilled, (state, action) => {
			// 	state.status = "purchaseOrderCheckApproval succeeded";
			// 	const { response }: any = action.payload;
			// 	state.checkApprove = true;
			// 	state.approve_loading = false;
			// })
			// .addCase(purchaseOrderCheckApproval.rejected, (state, action) => {
			// 	state.status = "purchaseOrderCheckApproval failed";
			// 	state.approve_loading = false;
			// 	state.checkApprove = false;
			// 	state.error =
			// 		action.error?.message || "An unknown error occurred";
			// })
			.addCase(postPODocuments.pending, (state, action) => {
				state.status = "postPODocuments pending";
				state.document_loading = true;
			})
			.addCase(postPODocuments.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "postPODocuments succeeded";
				state.document_loading = false;

				// const split: string[] | undefined = response?.file?.split("/");
				// state.uploadDocuments = [
				// 	...(state.uploadDocuments || []),
				// 	{
				// 		...response,
				// 		path: split ? split[split.length - 1] : "",
				// 		preview: response.file,
				// 		formattedSize: "",
				// 	},
				// ];
			})
			.addCase(postPODocuments.rejected, (state, action) => {
				state.status = "postPODocuments failed";
				state.document_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(updatePurchaseOrderStatus.pending, (state, action) => {
				state.status = "updatePurchaseOrderStatus pending";
				state.loading = true;
			})
			.addCase(updatePurchaseOrderStatus.fulfilled, (state, action) => {
				state.status = "updatePurchaseOrderStatus succeeded";
				state.loading = false;
			})
			.addCase(updatePurchaseOrderStatus.rejected, (state, action) => {
				state.status = "updatePurchaseOrderStatus failed";
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
	clearVendorsByPO,
	getPurchaseCheckApprove,
	purchasesCheckApproveSuccessful,
	setIsModalOpen,
	setIsRejectModalOpen,
	setConfirmModal,
	setUploadDocument,
	setApprovedData,
	setGeneratePOModalOpen,
} = purchaseOrderSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const purchaseOrderSelectors = (state: RootState) =>
	state.projectManagement.purchaseOrder;

// Memoized selector
export const selectPurchaseOrders = createSelector(
	[
		purchaseOrderSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(purchaseOrder, purchaseEnquiry, workOrder, system, mini, customise) => ({
		purchaseOrder,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export default purchaseOrderSlice.reducer;
