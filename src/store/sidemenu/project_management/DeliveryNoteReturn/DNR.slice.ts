import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@src/store/store";
import { DeliveryReturnNotesInitialState } from "./DNR.types";
import {
	editDeliveryReturnNotes,
	getDeliveryReturnNotesById,
	getDeliveryReturnNotes,
	postDeliveryReturnNotes,
} from "./DNR.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: DeliveryReturnNotesInitialState = {
	loading: false,
	status: "",
	error: "",
	list: [],
	count: 0,
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

const deliveryReturnNotesSlice = createSlice({
	name: "deliveryReturnNotes",
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
	},
	extraReducers(builder) {
		builder
			.addCase(getDeliveryReturnNotes.pending, (state, action) => {
				state.status = "getDeliveryReturnNotes pending";
				state.loading = true;
			})
			.addCase(getDeliveryReturnNotes.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getDeliveryReturnNotes succeeded";
				state.loading = false;
				state.list = response.results;
				state.count = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getDeliveryReturnNotes.rejected, (state, action) => {
				state.status = "getDeliveryReturnNotes failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getDeliveryReturnNotesById.pending, (state, action) => {
				state.status = "getDeliveryReturnNotesById pending";
				state.loading = true;
			})
			.addCase(getDeliveryReturnNotesById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getDeliveryReturnNotesById succeeded";
				state.loading = false;
				state.selectedData = {
					...response,
					location: {
						...response.location,
						label: response.location.name,
						value: response.location.id,
					},
					warehouse: {
						...response.warehouse,
						label: response.warehouse.name,
						value: response.warehouse.id,
					},
					deliveryreturnnotesitems:
						response?.deliveryreturnnotesitems?.map((e: any) => {
							return {
								...e,
								qty: parseInt(e.qty),
								item: {
									...e?.item,
									value: e.item?.id,
									label: e.item?.name,
								},
								unit: {
									...e?.unit,
									value: e.unit?.id,
									label: e.unit?.name,
								},
								dodelete: false,
							};
						}),
				};
			})
			.addCase(getDeliveryReturnNotesById.rejected, (state, action) => {
				state.status = "getDeliveryReturnNotesById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postDeliveryReturnNotes.pending, (state, action) => {
				state.status = "postDeliveryReturnNotes pending";
				state.loading = true;
			})
			.addCase(postDeliveryReturnNotes.fulfilled, (state, action) => {
				state.status = "postDeliveryReturnNotes succeeded";
				state.loading = false;
			})
			.addCase(postDeliveryReturnNotes.rejected, (state, action) => {
				state.status = "postDeliveryReturnNotes failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editDeliveryReturnNotes.pending, (state, action) => {
				state.status = "editDeliveryReturnNotes pending";
				state.loading = true;
			})
			.addCase(editDeliveryReturnNotes.fulfilled, (state, action) => {
				state.status = "editDeliveryReturnNotes succeeded";
				state.loading = false;
			})
			.addCase(editDeliveryReturnNotes.rejected, (state, action) => {
				state.status = "editDeliveryReturnNotes failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
	},
});

// Action creators are generated for each case reducer function
export const { setSelectedData, setIsFilterOpen, setPageParams } =
	deliveryReturnNotesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const DeliveryReturnNotesSelectors = (state: RootState) =>
	state.projectManagement.deliveryReturnNotes;

// Memoized selector
export const selectDeliveryReturnNotes = createSelector(
	[
		DeliveryReturnNotesSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		deliveryReturnNotes,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		deliveryReturnNotes,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export const useDeliveryReturnNotesSelector = () => {
	const selectors = useAppSelector((state) =>
		selectDeliveryReturnNotes(state)
	);
	return selectors;
};

export default deliveryReturnNotesSlice.reducer;
