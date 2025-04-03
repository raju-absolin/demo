import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { MaterialConsumptionInitialState } from "./material_consumption.types";
import {
	editMaterialConsumption,
	getMaterialConsumptionById,
	getMaterialConsumption,
	postMaterialConsumption,
	getStockDetails,
	getBatchQuantity,
} from "./material_consumption.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: MaterialConsumptionInitialState = {
	loading: false,
	status: "",
	error: "",
	mcList: [],
	mcCount: 0,
	selectedData: {},
	isFilterOpen: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
	batchListCount: 0,
	stock_available: "",
	batchPageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	batchloading: false
};

const materialConsumptionSlice = createSlice({
	name: "materialConsumption",
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
		clearBatchQuantity: (state, action) => {
			return {
				...state,
				batchAgainstItemsList: []
			}
		}
	},
	extraReducers(builder) {
		builder
			.addCase(getMaterialConsumption.pending, (state, action) => {
				state.status = "getMaterialConsumption pending";
				state.loading = true;
			})
			.addCase(getMaterialConsumption.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getMaterialConsumption succeeded";
				state.loading = false;
				state.mcList = response.results;
				state.mcCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMaterialConsumption.rejected, (state, action) => {
				state.status = "getMaterialConsumption failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getMaterialConsumptionById.pending, (state, action) => {
				state.status = "getMaterialConsumptionById pending";
				state.loading = true;
			})
			.addCase(getMaterialConsumptionById.fulfilled, (state, action) => {
				const { response }: any = action.payload;
				state.status = "getMaterialConsumptionById succeeded";
				state.loading = false;

				state.selectedData = {
					...response,
					miitem: response?.material_issue?.miitems?.reduce(
						(acc: any, e: any) => {
							acc.push({ qty: e?.qty });
							return acc;
						}
					),
					warehouse: {
						...response.warehouse,
						label: response?.warehouse?.name,
						value: response?.warehouse?.id
					},
					mc_items: response?.mc_items?.map(
						(e: any) => {
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
								batch: {
									id: e?.batch?.id,
									batch: e?.batch?.id,
									name: e?.batch?.name,
									batchname: e?.batch?.name,
								},
								dodelete: false,
							};
						}
					),
				};
			})
			.addCase(getMaterialConsumptionById.rejected, (state, action) => {
				state.status = "getMaterialConsumptionById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postMaterialConsumption.pending, (state, action) => {
				state.status = "postMaterialConsumption pending";
				state.loading = true;
			})
			.addCase(postMaterialConsumption.fulfilled, (state, action) => {
				state.status = "postMaterialConsumption succeeded";
				state.loading = false;
			})
			.addCase(postMaterialConsumption.rejected, (state, action) => {
				state.status = "postMaterialConsumption failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editMaterialConsumption.pending, (state, action) => {
				state.status = "editMaterialConsumption pending";
				state.loading = true;
			})
			.addCase(editMaterialConsumption.fulfilled, (state, action) => {
				state.status = "editMaterialConsumption succeeded";
				state.loading = false;
			})
			.addCase(editMaterialConsumption.rejected, (state, action) => {
				state.status = "editMaterialConsumption failed";
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
				state.stock_available = response?.quantity;
			})
			.addCase(getStockDetails.rejected, (state, action) => {
				state.status = "getStockDetails failed";
				state.loading = false;
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
			})
	},
});

// Action creators are generated for each case reducer function
export const { setSelectedData, setIsFilterOpen, setPageParams, clearBatchQuantity } =
	materialConsumptionSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const materialConsumptionSelectors = (state: RootState) =>
	state.projectManagement.materialConsumption;

// Memoized selector
export const selectMaterialConsumption = createSelector(
	[
		materialConsumptionSelectors,
		purchaseQuotationSelectors,
		purchaseEnquirySelector,
		workOrdersSelectors,
		systemSelector,
		miniSelector,
		selectLayoutTheme,
	],
	(
		materialConsumption,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise
	) => ({
		materialConsumption,
		purchaseQuotation,
		purchaseEnquiry,
		workOrder,
		system,
		mini,
		customise,
	})
);

export default materialConsumptionSlice.reducer;
