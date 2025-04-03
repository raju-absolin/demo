import { createSlice } from "@reduxjs/toolkit";
import {
	getMiniCity,
	getMiniStates,
	getMiniCountries,
	getMiniUsers,
	getUserPermissions,
	getMiniArea,
	getMiniLocation,
	getMiniZone,
	getMiniProjects,
	getMiniTenderNature,
	getMiniCompany,
	getMiniVendor,
	getMiniItems,
	getMiniDepartments,
	getMiniTenderMasterItems,
	getMiniVendors,
	getMiniEnquiry,
	getMiniMake,
	getMiniMoc,
	getMiniCategory,
	getMiniBaseUnits,
	getMiniItemgroups,
	getMiniDocuments,
	getMiniCustomers,
	getMiniLeads,
	getMiniUnits,
	getMiniTax,
	getMiniStages,
	getMiniTenders,
	getMiniWarehouse,
	getMiniPurchaseIndent,
	getMiniUserTypes,
	getAssigneeProjectsMini,
	getPurchaseOrderMini,
	getMiniBatch,
	getMiniMRN,
	getMiniProjectGroups,
	getMiniMileStones,
	getMiniMaterialRequest,
	getMiniMaterialRequestApproval,
	getMiniMaterialIssue,
	getMiniPerformanceBankGuarantee,
	getMiniInspectionAgencies,
	getMiniMRNReturn,
	getMiniMaterialReceipt,
	getMiniStockTransferOut,
	getMiniIssuetoproduction,
	getMiniProductionReceipt,
	getMiniStockTransferIn,
	getMiniDeliveryChallan,
	getMiniDeliveryReturns,
	getMiniExpenditureType,
	getMiniExpenditureSheet,
	getMiniDepartmentUsers,
	getMiniFolders,
	getMiniCurrencies,
	getMiniExpenses,
	getWarehouseByProject,
	getMiniAccountgroups,
	getMiniAccounts,
	getMiniAccountTypes,
	getAllContentTypes,
	getMiniUniqueTender,
	getMiniItemsAgainstWarehouse,
	getMiniMaterialIssueApproval,
	getMiniStockOut,
	getMiniProjectGroupUsers,
	getMiniClientLocations,
	getMiniClientLocationsAganistCustomer,
} from "./mini.Action";
import { RootState } from "../store";

const initialState = {
	status: "",
	error: "",
	loading: false,
	countryValue: "",
	stateValue: "",
	userAccessList: [],
	miniItemgroupList: [],
	miniItemgroupLoading: false,
	miniAccountgroupList: [],
	miniAccountgroupLoading: false,
	miniCountriesList: [],
	miniCountryLoading: false,
	miniStatesList: [],
	miniStateLoading: false,
	miniCityList: [],
	miniCityLoading: false,
	miniUserList: [],
	miniUserLoading: false,
	miniAreaList: [],
	miniAreaLoading: false,
	miniLocationList: [],
	miniLocationLoading: false,
	miniZoneList: [],
	miniZoneLoading: false,

	miniClientLocationList: [],
	miniClientLocationLoading: false,
	miniClientLocationCount: 0,

	warehouseByProject: {
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

	miniExpenses: {
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

	miniCurrencies: {
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

	miniStockTransferIn: {
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
	miniExpenditureType: {
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

	miniExpenditureSheet: {
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

	miniStockTransferOut: {
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

	miniMaterialReceipt: {
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

	miniMRNReturn: {
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

	miniMaterialIssue: {
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
	miniMaterialRequestApproval: {
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
	miniMaterialRequest: {
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
	//application minis
	miniMRN: {
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

	miniPurchaseOrder: {
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

	miniProject: {
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
	miniBatch: {
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
	miniMake: {
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
	miniCategory: {
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
	miniBaseUnit: {
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
	miniMoc: {
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

	miniTenderNature: {
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
	miniItemsList: {
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
	miniAccountsList: {
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
	miniCompany: {
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
	miniDepartments: {
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
	miniTenderMasterItems: {
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
	miniVendors: {
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
	miniDocuments: {
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
	miniEnquiry: {
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
	miniCustomers: {
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
	miniClientLocationsAganistCustomer: {
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
	miniLeads: {
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
	miniUnits: {
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
	miniTax: {
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
	miniStages: {
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
	miniTenders: {
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
	miniWarehouse: {
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
	miniPurchaseIndent: {
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
	miniUserTypes: {
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
	miniProjectGroups: {
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
	miniMileStones: {
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
	performanceBankGuarantee: {
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
	inspectionAgencies: {
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
	issueToProduction: {
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
	productionReport: {
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
	miniDeliveryChallan: {
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
	miniDeliveryReturnNote: {
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
	miniDepartmentUsers: {
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
	miniFolders: {
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
	miniAccountTypes: {
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
	miniAllContentTypes: {
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

	warehouseAgainstItems: {
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
	miniMaterialIssueApproval: {
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
	miniStockOut: {
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

	// Params
	miniItemgroupParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	miniAccountgroupParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	miniCountryParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	miniStatesParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	miniCityParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	miniVendorParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	miniAreaParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	miniLocationParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	miniZoneParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	miniUserParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	miniClientLocationParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
};
const miniSlice = createSlice({
	name: "mini",
	initialState,
	reducers: {
		clearMiniCountry: (state, action) => {
			return {
				...state,
				miniCountriesList: initialState?.miniStatesList,
				miniCountryLoading: initialState?.miniStateLoading,
				miniCountryParams: initialState?.miniStatesParams,
			};
		},
		clearMiniStates: (state, action) => {
			return {
				...state,
				miniStatesList: initialState?.miniStatesList,
				miniStateLoading: initialState?.miniStateLoading,
				miniStatesParams: initialState?.miniStatesParams,
			};
		},
		clearMiniCities: (state, action) => {
			return {
				...state,
				miniCityList: initialState?.miniCityList,
				miniCityLoading: initialState?.miniCityLoading,
				miniCityParams: initialState?.miniCityParams,
			};
		},
		setMiniStatesParams: (state, action) => {
			return {
				...state,
				miniStatesParams: action.payload,
			};
		},
		setMiniZoneParams: (state, action) => {
			return {
				...state,
				miniZoneParams: action.payload,
			};
		},
		setMiniAreaParams: (state, action) => {
			return {
				...state,
				miniAreaParams: action.payload,
			};
		},
		setMiniLocationParams: (state, action) => {
			return {
				...state,
				miniLocationParams: action.payload,
			};
		},
		clearMiniLocation: (state, action) => {
			return {
				...state,
				miniLocationParams: initialState.miniLocationParams,
				miniLocationList: initialState.miniLocationList,
				miniLocationLoading: false,
			};
		},
		setMiniCityParams: (state, action) => {
			return {
				...state,
				miniCityParams: action.payload,
			};
		},

		setMiniUserParams: (state, action) => {
			return {
				...state,
				miniUserParams: action.payload,
			};
		},
		clearMiniUsers: (state, action) => {
			return {
				...state,
				miniUserList: [],
				miniUserLoading: false,
				miniUserParams: initialState.miniUserParams,
			};
		},
		clearTenderNature: (state, action) => {
			return {
				...state,
				miniTenderNature: initialState.miniTenderNature,
			};
		},
		clearMiniProjects: (state, action) => {
			return {
				...state,
				miniProject: initialState.miniProject,
			};
		},
		clearMiniMake: (state, action) => {
			return {
				...state,
				miniMake: initialState.miniMake,
			};
		},
		clearMiniDepartments: (state, action) => {
			return {
				...state,
				miniDepartments: initialState.miniDepartments,
			};
		},
		clearMiniCompany: (state, action) => {
			return {
				...state,
				miniCompany: initialState.miniCompany,
			};
		},
		clearMiniTenderMasterItems: (state, action) => {
			return {
				...state,
				miniTenderMasterItems: initialState.miniTenderMasterItems,
			};
		},
		clearMiniEnquiry: (state, action) => {
			return {
				...state,
				miniEnquiry: initialState.miniEnquiry,
			};
		},
		clearMiniVendors: (state, action) => {
			return {
				...state,
				miniVendors: initialState.miniVendors,
			};
		},
		setCountryValue: (state, action) => {
			return {
				...state,
				countryValue: action.payload,
			};
		},
		setStateValue: (state, action) => {
			return {
				...state,
				stateValue: action.payload,
			};
		},
		clearMiniDocuments: (state, action) => {
			return {
				...state,
				miniDocuments: initialState.miniDocuments,
			};
		},
		clearMiniCustomers: (state, action) => {
			return {
				...state,
				miniCustomers: initialState.miniDocuments,
			};
		},
		clearMiniItems: (state, action) => {
			return {
				...state,
				miniItemsList: initialState.miniItemsList,
			};
		},
		clearMiniAccounts: (state, action) => {
			return {
				...state,
				miniAccountsList: initialState.miniAccountsList,
			};
		},
		clearMiniLeads: (state, action) => {
			return {
				...state,
				miniLeads: initialState.miniLeads,
			};
		},
		clearMiniItemGroups: (state, action) => {
			return {
				...state,
				miniItemgroupList: initialState.miniItemgroupList,
				miniItemgroupLoading: initialState.miniItemgroupLoading,
				miniItemgroupParams: initialState.miniItemgroupParams,
			};
		},
		clearMiniAccountGroups: (state, action) => {
			return {
				...state,
				miniAccountgroupList: initialState.miniAccountgroupList,
				miniAccountgroupLoading: initialState.miniAccountgroupLoading,
				miniAccountgroupParams: initialState.miniAccountgroupParams,
			};
		},
		clearMiniBaseUnits: (state, action) => {
			return {
				...state,
				miniBaseUnit: initialState.miniBaseUnit,
			};
		},
		clearMiniUnits: (state, action) => {
			return {
				...state,
				miniUnits: initialState.miniUnits,
			};
		},
		clearMiniTax: (state, action) => {
			return {
				...state,
				miniTax: initialState.miniTax,
			};
		},
		clearMiniStages: (state, action) => {
			return {
				...state,
				miniStages: initialState.miniStages,
			};
		},
		clearMiniTenders: (state, action) => {
			return {
				...state,
				miniTenders: initialState.miniTenders,
			};
		},
		clearMiniWarehouse: (state, action) => {
			return {
				...state,
				miniWarehouse: initialState.miniWarehouse,
			};
		},
		clearMiniPurchaseIndent: (state, action) => {
			return {
				...state,
				miniPurchaseIndent: initialState.miniPurchaseIndent,
			};
		},
		clearMiniUserTypes: (state, action) => {
			return {
				...state,
				miniUserTypes: initialState.miniUserTypes,
			};
		},
		clearMiniPurchaseOrder: (state, action) => {
			return {
				...state,
				miniPurchaseOrder: initialState.miniPurchaseOrder,
			};
		},
		clearMiniBatch: (state, action) => {
			return {
				...state,
				miniBatch: initialState.miniBatch,
			};
		},
		clearMiniMRN: (state, action) => {
			return {
				...state,
				miniMRN: initialState.miniMRN,
			};
		},
		clearMiniProjectGroups: (state, action) => {
			return {
				...state,
				miniProjectGroups: initialState.miniProjectGroups,
			};
		},
		clearMiniMilestones: (state, action) => {
			return {
				...state,
				miniMileStones: initialState.miniMileStones,
			};
		},
		clearMiniMaterialRequest: (state, action) => {
			return {
				...state,
				miniMaterialRequest: initialState.miniMaterialRequest,
			};
		},
		clearMiniMaterialRequestApproval: (state, action) => {
			return {
				...state,
				miniMaterialRequestApproval:
					initialState.miniMaterialRequestApproval,
			};
		},
		clearMiniMaterialIssue: (state, action) => {
			return {
				...state,
				miniMaterialIssue: initialState.miniMaterialIssue,
			};
		},
		clearMiniPerformanceBankGuarantee: (state, action) => {
			return {
				...state,
				performanceBankGuarantee: initialState.performanceBankGuarantee,
			};
		},
		clearMiniInspectionAgencies: (state, action) => {
			return {
				...state,
				inspectionAgencies: initialState.inspectionAgencies,
			};
		},
		clearMiniMRNReturn: (state, action) => {
			return {
				...state,
				miniMRNReturn: initialState.miniMRNReturn,
			};
		},
		clearMiniMaterialReceipt: (state, action) => {
			return {
				...state,
				miniMaterialReceipt: initialState.miniMaterialReceipt,
			};
		},
		clearMiniStockTransferOut: (state, action) => {
			return {
				...state,
				miniStockTransferOut: initialState.miniStockTransferOut,
			};
		},
		clearMiniIssueToProduction: (state, action) => {
			return {
				...state,
				issueToProduction: initialState.issueToProduction,
			};
		},
		clearMiniProductionReceipt: (state, action) => {
			return {
				...state,
				productionReport: initialState.productionReport,
			};
		},
		clearMiniStockTransferIn: (state, action) => {
			return {
				...state,
				miniStockTransferIn: initialState.miniStockTransferIn,
			};
		},
		clearMiniDeliveryChallan: (state, action) => {
			return {
				...state,
				miniDeliveryChallan: initialState.miniDeliveryChallan,
			};
		},
		clearMiniDeliveryReturnNote: (state, action) => {
			return {
				...state,
				miniDeliveryReturnNote: initialState.miniDeliveryReturnNote,
			};
		},
		clearMiniExpenditureType: (state, action) => {
			return {
				...state,
				miniExpenditureType: initialState.miniExpenditureType,
			};
		},
		clearMiniExpenditureSheet: (state, action) => {
			return {
				...state,
				miniExpenditureSheet: initialState.miniExpenditureSheet,
			};
		},
		clearMiniDepartmentUsers: (state, action) => {
			return {
				...state,
				miniDepartmentUsers: initialState.miniDepartmentUsers,
			};
		},
		clearMiniFolders: (state, action) => {
			return {
				...state,
				miniFolders: initialState.miniFolders,
			};
		},
		clearMiniCurrencies: (state, action) => {
			return {
				...state,
				miniCurrencies: initialState.miniCurrencies,
			};
		},
		clearMiniExpenses: (state, action) => {
			return {
				...state,
				miniExpenses: initialState.miniExpenses,
			};
		},
		clearWarehouseByProject: (state, action) => {
			return {
				...state,
				warehouseByProject: initialState.warehouseByProject,
			};
		},
		clearMiniAccountType: (state, action) => {
			return {
				...state,
				miniAccountTypes: initialState.miniAccountTypes,
			};
		},
		clearMiniAllContentTypes: (state, action) => {
			return {
				...state,
				miniAllContentTypes: initialState.miniAllContentTypes,
			};
		},
		clearWarehouseAgainstItems: (state, action) => {
			return {
				...state,
				warehouseAgainstItems: initialState.warehouseAgainstItems,
			};
		},
		clearMiniMoc: (state, action) => {
			return {
				...state,
				miniMoc: initialState.miniMoc,
			};
		},
		clearMiniMaterialIssueApproval: (state, action) => {
			return {
				...state,
				miniMaterialIssueApproval:
					initialState.miniMaterialIssueApproval,
			};
		},
		clearStockOut: (state, action) => {
			return {
				...state,
				miniStockOut: initialState.miniStockOut,
			};
		},

		clearMiniClientLocation: (state, action) => {
			return {
				...state,
				miniClientLocationList: initialState.miniClientLocationList,
				miniClientLocationLoading:
					initialState.miniClientLocationLoading,
				miniClientLocationParams: initialState.miniClientLocationParams,
			};
		},
		clearMiniClientLocationsAganistCustomer: (state, action) => {
			return {
				...state,
				miniClientLocationsAganistCustomer:
					initialState.miniClientLocationsAganistCustomer,
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUserPermissions.pending, (state, action) => {
				state.status = "getUserPermissions loading";
				state.loading = true;
			})
			.addCase(getUserPermissions.fulfilled, (state, action) => {
				state.status = "getUserPermissions succeeded";
				state.loading = false;
				state.userAccessList = action.payload.response;
			})
			.addCase(getUserPermissions.rejected, (state, action) => {
				state.status = "getUserPermissions failed";
				state.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniItemgroups.pending, (state, action) => {
				state.status = "getMiniItemgroups loading";
				state.miniItemgroupLoading = true;
			})
			.addCase(getMiniItemgroups.fulfilled, (state, action) => {
				state.status = "getMiniItemgroups succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniItemgroupList, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniItemgroupParams?.page_size
				);
				state.miniItemgroupList = list;
				state.miniItemgroupLoading = false;
				state.miniItemgroupParams = {
					...state.miniItemgroupParams,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMiniItemgroups.rejected, (state, action) => {
				state.status = "getMiniItemgroups failed";
				state.miniItemgroupLoading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniAccountgroups.pending, (state, action) => {
				state.status = "getMiniAccountgroups loading";
				state.miniAccountgroupLoading = true;
			})
			.addCase(getMiniAccountgroups.fulfilled, (state, action) => {
				state.status = "getMiniAccountgroups succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniAccountgroupList, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniAccountgroupParams?.page_size
				);
				state.miniAccountgroupList = list;
				state.miniAccountgroupLoading = false;
				state.miniAccountgroupParams = {
					...state.miniAccountgroupParams,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMiniAccountgroups.rejected, (state, action) => {
				state.status = "getMiniAccountgroups failed";
				state.miniAccountgroupLoading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniCountries.pending, (state, action) => {
				state.status = "getMiniCountries loading";
				state.miniCountryLoading = true;
			})
			.addCase(getMiniCountries.fulfilled, (state, action) => {
				state.status = "getMiniCountries succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniCountriesList, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniCountryParams?.page_size
				);
				state.miniCountriesList = list;
				state.miniCountryLoading = false;
				state.miniCountryParams = {
					...state.miniCountryParams,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMiniCountries.rejected, (state, action) => {
				state.status = "getMiniCountries failed";
				state.miniCountryLoading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniStates.pending, (state, action) => {
				state.status = "getMiniStates loading";
				state.miniStateLoading = true;
			})
			.addCase(getMiniStates.fulfilled, (state, action) => {
				state.status = "getMiniStates succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniStatesList, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniStatesParams?.page_size
				);
				state.miniStatesList = list;
				state.miniStateLoading = false;
				state.miniStatesParams = {
					...state.miniStatesParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMiniStates.rejected, (state, action) => {
				state.status = "getMiniStates failed";
				state.miniStateLoading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})

			.addCase(getMiniCity.pending, (state, action) => {
				state.status = "getMiniCity loading";
				state.miniCityLoading = true;
			})
			.addCase(getMiniCity.fulfilled, (state, action) => {
				state.status = "getMiniCity succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniCityList, ...response.results];
				}

				var noofpages = Math.ceil(
					response.count / state.miniCityParams?.page_size
				);
				state.miniCityList = list;
				state.miniCityLoading = false;
				state.miniCityParams = {
					...state.miniCityParams,
					...params,
					no_of_pages: noofpages,
				};
			})

			.addCase(getMiniCity.rejected, (state, action) => {
				state.status = "getMiniCity failed";
				state.miniCityLoading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})

			.addCase(getMiniArea.pending, (state, action) => {
				state.status = "getMiniArea loading";
				state.miniAreaLoading = true;
			})
			.addCase(getMiniArea.fulfilled, (state, action) => {
				state.status = "getMiniArea succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniAreaList, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniAreaParams?.page_size
				);
				state.miniAreaList = list;
				state.miniAreaLoading = false;
				state.miniAreaParams = {
					...state.miniAreaParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMiniArea.rejected, (state, action) => {
				state.status = "getMiniArea failed";
				state.miniAreaLoading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniLocation.pending, (state, action) => {
				state.status = "getMiniLocation loading";
				state.miniLocationLoading = true;
			})
			.addCase(getMiniLocation.fulfilled, (state, action) => {
				state.status = "getMiniLocation succeeded";

				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniLocationList, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniLocationParams?.page_size
				);
				state.miniLocationList = list;
				state.miniLocationLoading = false;
				state.miniLocationParams = {
					...state.miniLocationParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMiniLocation.rejected, (state, action) => {
				state.status = "getMiniLocation failed";
				state.miniLocationLoading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniZone.pending, (state, action) => {
				state.status = "getMiniZone loading";
				state.miniZoneLoading = true;
			})
			.addCase(getMiniZone.fulfilled, (state, action) => {
				state.status = "getMiniZone succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniZoneList, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniZoneParams?.page_size
				);
				state.miniZoneList = list;
				state.miniZoneLoading = false;
				state.miniZoneParams = {
					...state.miniZoneParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMiniZone.rejected, (state, action) => {
				state.status = "getMiniZone failed";
				state.miniZoneLoading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniUsers.pending, (state, action) => {
				state.status = "getMiniUsers loading";
				state.loading = true;
			})
			.addCase(getMiniUsers.fulfilled, (state, action) => {
				state.status = "getMiniUsers succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniUserList, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniUserParams?.page_size
				);
				state.miniUserList = list;
				state.loading = false;
				state.miniUserParams = {
					...state.miniUserParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMiniUsers.rejected, (state, action) => {
				state.status = "getMiniUsers failed";
				state.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniProjectGroupUsers.pending, (state, action) => {
				state.status = "getMiniProjectGroupUsers loading";
				state.loading = true;
			})
			.addCase(getMiniProjectGroupUsers.fulfilled, (state, action) => {
				state.status = "getMiniProjectGroupUsers succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniUserList, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniUserParams?.page_size
				);
				state.miniUserList = list as never[];
				state.loading = false;
				state.miniUserParams = {
					...state.miniUserParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMiniProjectGroupUsers.rejected, (state, action) => {
				state.status = "getMiniProjectGroupUsers failed";
				state.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniProjects.pending, (state, action) => {
				state.status = "getMiniProjects loading";
				state.miniProject.loading = true;
			})
			.addCase(getMiniProjects.fulfilled, (state, action) => {
				state.status = "getMiniProjects succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniProject.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniProject.miniParams?.page_size
				);
				state.miniProject = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniProject.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniProjects.rejected, (state, action) => {
				state.status = "getMiniProjects failed";
				state.miniProject.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})

			.addCase(getMiniMake.pending, (state, action) => {
				state.status = "getMiniMake loading";
				state.miniMake.loading = true;
			})
			.addCase(getMiniMake.fulfilled, (state, action) => {
				state.status = "getMiniMake succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniMake.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniMake.miniParams?.page_size
				);
				state.miniMake = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniMake.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniMake.rejected, (state, action) => {
				state.status = "getMiniMake failed";
				state.miniMake.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})

			.addCase(getMiniCategory.pending, (state, action) => {
				state.status = "getMiniCategory loading";
				state.miniCategory.loading = true;
			})
			.addCase(getMiniCategory.fulfilled, (state, action) => {
				state.status = "getMiniCategory succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniCategory.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniCategory.miniParams?.page_size
				);
				state.miniCategory = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniCategory.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniCategory.rejected, (state, action) => {
				state.status = "getMiniCategory failed";
				state.miniCategory.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniMoc.pending, (state, action) => {
				state.status = "getMiniMoc loading";
				state.miniMoc.loading = true;
			})
			.addCase(getMiniMoc.fulfilled, (state, action) => {
				state.status = "getMiniMoc succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniMoc.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniMoc.miniParams?.page_size
				);
				state.miniMoc = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniMoc.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniMoc.rejected, (state, action) => {
				state.status = "getMiniMoc failed";
				state.miniMoc.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniBaseUnits.pending, (state, action) => {
				state.status = "getMiniBaseUnits loading";
				state.miniBaseUnit.loading = true;
			})
			.addCase(getMiniBaseUnits.fulfilled, (state, action) => {
				state.status = "getMiniBaseUnits succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response;
				} else {
					list = [...state.miniBaseUnit.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniBaseUnit.miniParams?.page_size
				);
				state.miniBaseUnit = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniBaseUnit.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniBaseUnits.rejected, (state, action) => {
				state.status = "getMiniBaseUnits failed";
				state.miniBaseUnit.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})

			.addCase(getMiniTenderNature.pending, (state, action) => {
				state.status = "getMiniTenderNature loading";
				state.miniTenderNature.loading = true;
			})
			.addCase(getMiniTenderNature.fulfilled, (state, action) => {
				state.status = "getMiniTenderNature succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniTenderNature.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniTenderNature.miniParams?.page_size
				);
				state.miniTenderNature = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniTenderNature.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniTenderNature.rejected, (state, action) => {
				state.status = "getMiniTenderNature failed";
				state.miniTenderNature.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})

			.addCase(getMiniVendor.pending, (state, action) => {
				state.status = "getMiniVendor loading";
				state.miniVendors.loading = true;
			})
			.addCase(getMiniVendor.fulfilled, (state, action) => {
				state.status = "getMiniVendor succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniVendors.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniVendors.miniParams?.page_size
				);
				state.miniVendors = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniVendors.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniVendor.rejected, (state, action) => {
				state.status = "getMiniVendor failed";
				state.miniVendors.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})

			.addCase(getMiniDocuments.pending, (state, action) => {
				state.status = "getMiniDocuments loading";
				state.miniDocuments.loading = true;
			})
			.addCase(getMiniDocuments.fulfilled, (state, action) => {
				state.status = "getMiniDocuments succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniDocuments.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniDocuments.miniParams?.page_size
				);
				state.miniDocuments = {
					list: response.results,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniDocuments.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniDocuments.rejected, (state, action) => {
				state.status = "getMiniDocuments failed";
				state.miniDocuments.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})

			.addCase(getMiniItems.pending, (state, action) => {
				state.status = "getMiniItems loading";
				state.miniItemsList.loading = true;
			})
			.addCase(getMiniItems.fulfilled, (state, action) => {
				state.status = "getMiniItems succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniItemsList.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniItemsList.miniParams?.page_size
				);
				state.miniItemsList = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniItemsList.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniItems.rejected, (state, action) => {
				state.status = "getMiniItems failed";
				state.miniItemsList.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniAccounts.pending, (state, action) => {
				state.status = "getMiniAccounts loading";
				state.miniAccountsList.loading = true;
			})
			.addCase(getMiniAccounts.fulfilled, (state, action) => {
				state.status = "getMiniAccounts succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniAccountsList.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniAccountsList.miniParams?.page_size
				);
				state.miniAccountsList = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniAccountsList.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniAccounts.rejected, (state, action) => {
				state.status = "getMiniAccounts failed";
				state.miniAccountsList.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})

			.addCase(getMiniCompany.pending, (state, action) => {
				state.status = "getMiniCompany loading";
				state.miniCompany.loading = true;
			})
			.addCase(getMiniCompany.fulfilled, (state, action) => {
				state.status = "getMiniCompany succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniCompany.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniCompany.miniParams?.page_size
				);
				state.miniCompany = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniCompany.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniCompany.rejected, (state, action) => {
				state.status = "getMiniCompany failed";
				state.miniCompany.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniDepartments.pending, (state, action) => {
				state.status = "getMiniDepartments loading";
				state.miniDepartments.loading = true;
			})
			.addCase(getMiniDepartments.fulfilled, (state, action) => {
				state.status = "getMiniDepartments succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniDepartments.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniDepartments.miniParams?.page_size
				);
				state.miniDepartments = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniDepartments.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniDepartments.rejected, (state, action) => {
				state.status = "getMiniDepartments failed";
				state.miniTenderMasterItems.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniTenderMasterItems.pending, (state, action) => {
				state.status = "getMiniTenderMasterItems loading";
				state.miniTenderMasterItems.loading = true;
			})
			.addCase(getMiniTenderMasterItems.fulfilled, (state, action) => {
				state.status = "getMiniTenderMasterItems succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniTenderMasterItems.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniTenderMasterItems.miniParams?.page_size
				);
				state.miniTenderMasterItems = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniTenderMasterItems.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniTenderMasterItems.rejected, (state, action) => {
				state.status = "getMiniTenderMasterItems failed";
				state.miniTenderMasterItems.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniVendors.pending, (state, action) => {
				state.status = "getMiniVendors loading";
				state.miniVendors.loading = true;
			})
			.addCase(getMiniVendors.fulfilled, (state, action) => {
				state.status = "getMiniVendors succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniVendors.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniVendors.miniParams?.page_size
				);
				state.miniVendors = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniVendors.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniVendors.rejected, (state, action) => {
				state.status = "getMiniVendors failed";
				state.miniVendors.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniEnquiry.pending, (state, action) => {
				state.status = "getMiniEnquiry loading";
				state.miniEnquiry.loading = true;
			})
			.addCase(getMiniEnquiry.fulfilled, (state, action) => {
				state.status = "getMiniEnquiry succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniEnquiry.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniEnquiry.miniParams?.page_size
				);
				state.miniEnquiry = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniEnquiry.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniEnquiry.rejected, (state, action) => {
				state.status = "getMiniEnquiry failed";
				state.miniEnquiry.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniCustomers.pending, (state, action) => {
				state.status = "getMiniCustomers loading";
				state.miniCustomers.loading = true;
			})
			.addCase(getMiniCustomers.fulfilled, (state, action) => {
				state.status = "getMiniCustomers succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniCustomers.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniCustomers.miniParams?.page_size
				);
				state.miniCustomers = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniCustomers.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniCustomers.rejected, (state, action) => {
				state.status = "getMiniCustomers failed";
				state.miniCustomers.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniLeads.pending, (state, action) => {
				state.status = "getMiniLeads loading";
				state.miniLeads.loading = true;
			})
			.addCase(getMiniLeads.fulfilled, (state, action) => {
				state.status = "getMiniLeads succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniLeads.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniLeads.miniParams?.page_size
				);
				state.miniLeads = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniLeads.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniLeads.rejected, (state, action) => {
				state.status = "getMiniLeads failed";
				state.miniLeads.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniUnits.pending, (state, action) => {
				state.status = "getMiniUnits loading";
				state.miniUnits.loading = true;
			})
			.addCase(getMiniUnits.fulfilled, (state, action) => {
				state.status = "getMiniUnits succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniUnits.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniUnits.miniParams?.page_size
				);
				state.miniUnits = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniUnits.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniUnits.rejected, (state, action) => {
				state.status = "getMiniUnits failed";
				state.miniUnits.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniTax.pending, (state, action) => {
				state.status = "getMiniTax loading";
				state.miniTax.loading = true;
			})
			.addCase(getMiniTax.fulfilled, (state, action) => {
				state.status = "getMiniTax succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniTax.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniTax.miniParams?.page_size
				);
				state.miniTax = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniTax.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniTax.rejected, (state, action) => {
				state.status = "getMiniTax failed";
				state.miniTax.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniStages.pending, (state, action) => {
				state.status = "getMiniStages loading";
				state.miniStages.loading = true;
			})
			.addCase(getMiniStages.fulfilled, (state, action) => {
				state.status = "getMiniStages succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniStages.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniStages.miniParams?.page_size
				);
				state.miniStages = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniStages.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniStages.rejected, (state, action) => {
				state.status = "getMiniStages failed";
				state.miniStages.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniTenders.pending, (state, action) => {
				state.status = "getMiniTenders loading";
				state.miniTenders.loading = true;
			})
			.addCase(getMiniTenders.fulfilled, (state, action) => {
				state.status = "getMiniTenders succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniTenders.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniTenders.miniParams?.page_size
				);
				state.miniTenders = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniTenders.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniTenders.rejected, (state, action) => {
				state.status = "getMiniTenders failed";
				state.miniTenders.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniUniqueTender.pending, (state, action) => {
				state.status = "getMiniUniqueTender loading";
				state.miniTenders.loading = true;
			})
			.addCase(getMiniUniqueTender.fulfilled, (state, action) => {
				state.status = "getMiniUniqueTender succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniTenders.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniTenders.miniParams?.page_size
				);
				state.miniTenders = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniTenders.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniUniqueTender.rejected, (state, action) => {
				state.status = "getMiniUniqueTender failed";
				state.miniTenders.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniWarehouse.pending, (state, action) => {
				state.status = "getMiniWarehouse loading";
				state.miniWarehouse.loading = true;
			})
			.addCase(getMiniWarehouse.fulfilled, (state, action) => {
				state.status = "getMiniWarehouse succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniWarehouse.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniWarehouse.miniParams?.page_size
				);
				state.miniWarehouse = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniWarehouse.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniWarehouse.rejected, (state, action) => {
				state.status = "getMiniWarehouse failed";
				state.miniWarehouse.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniPurchaseIndent.pending, (state, action) => {
				state.status = "getMiniPurchaseIndent loading";
				state.miniPurchaseIndent.loading = true;
			})
			.addCase(getMiniPurchaseIndent.fulfilled, (state, action) => {
				state.status = "getMiniPurchaseIndent succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniPurchaseIndent.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniPurchaseIndent.miniParams?.page_size
				);
				state.miniPurchaseIndent = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniPurchaseIndent.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniPurchaseIndent.rejected, (state, action) => {
				state.status = "getMiniPurchaseIndent failed";
				state.miniPurchaseIndent.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniUserTypes.pending, (state, action) => {
				state.status = "getMiniUserTypes loading";
				state.miniUserTypes.loading = true;
			})
			.addCase(getMiniUserTypes.fulfilled, (state, action) => {
				state.status = "getMiniUserTypes succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniUserTypes.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniUserTypes.miniParams?.page_size
				);
				state.miniUserTypes = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniUserTypes.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniUserTypes.rejected, (state, action) => {
				state.status = "getMiniUserTypes failed";
				state.miniUserTypes.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getAssigneeProjectsMini.pending, (state, action) => {
				state.status = "getAssigneeProjectsMini loading";
				state.miniProject.loading = true;
			})
			.addCase(getAssigneeProjectsMini.fulfilled, (state, action) => {
				state.status = "getAssigneeProjectsMini succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniProject.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniProject.miniParams?.page_size
				);
				state.miniProject = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniProject.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getAssigneeProjectsMini.rejected, (state, action) => {
				state.status = "getAssigneeProjectsMini failed";
				state.miniProject.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getPurchaseOrderMini.pending, (state, action) => {
				state.status = "getPurchaseOrderMini loading";
				state.miniPurchaseOrder.loading = true;
			})
			.addCase(getPurchaseOrderMini.fulfilled, (state, action) => {
				state.status = "getPurchaseOrderMini succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniPurchaseOrder.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniPurchaseOrder.miniParams?.page_size
				);
				state.miniPurchaseOrder = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniPurchaseOrder.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getPurchaseOrderMini.rejected, (state, action) => {
				state.status = "getPurchaseOrderMini failed";
				state.miniPurchaseOrder.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniBatch.pending, (state, action) => {
				state.status = "getMiniBatch loading";
				state.miniBatch.loading = true;
			})
			.addCase(getMiniBatch.fulfilled, (state, action) => {
				state.status = "getMiniBatch succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniBatch.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniBatch.miniParams?.page_size
				);
				state.miniBatch = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniBatch.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniBatch.rejected, (state, action) => {
				state.status = "getMiniBatch failed";
				state.miniBatch.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniMRN.pending, (state, action) => {
				state.status = "getMiniMRN loading";
				state.miniMRN.loading = true;
			})
			.addCase(getMiniMRN.fulfilled, (state, action) => {
				state.status = "getMiniMRN succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniMRN.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniMRN.miniParams?.page_size
				);
				state.miniMRN = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniMRN.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniMRN.rejected, (state, action) => {
				state.status = "getMiniMRN failed";
				state.miniMRN.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniProjectGroups.pending, (state, action) => {
				state.status = "getMiniProjectGroups loading";
				state.miniProjectGroups.loading = true;
			})
			.addCase(getMiniProjectGroups.fulfilled, (state, action) => {
				state.status = "getMiniProjectGroups succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniProjectGroups.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniProjectGroups.miniParams?.page_size
				);
				state.miniProjectGroups = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniProjectGroups.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniProjectGroups.rejected, (state, action) => {
				state.status = "getMiniProjectGroups failed";
				state.miniProjectGroups.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniMileStones.pending, (state, action) => {
				state.status = "getMiniMileStones loading";
				state.miniMileStones.loading = true;
			})
			.addCase(getMiniMileStones.fulfilled, (state, action) => {
				state.status = "getMiniMileStones succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniMileStones.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniMileStones.miniParams?.page_size
				);
				state.miniMileStones = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniMileStones.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniMileStones.rejected, (state, action) => {
				state.status = "getMiniMileStones failed";
				state.miniMileStones.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(
				getMiniPerformanceBankGuarantee.pending,
				(state, action) => {
					state.status = "getMiniPerformanceBankGuarantee loading";
					state.performanceBankGuarantee.loading = true;
				}
			)
			.addCase(
				getMiniPerformanceBankGuarantee.fulfilled,
				(state, action) => {
					state.status = "getMiniPerformanceBankGuarantee succeeded";
					var response = action.payload.response;
					var params = action.payload.params;
					var list = [];
					if (params?.page == 1) {
						list = response.results;
					} else {
						list = [
							...state.performanceBankGuarantee.list,
							...response.results,
						];
					}
					var noofpages = Math.ceil(
						response.count /
							state.performanceBankGuarantee.miniParams?.page_size
					);
					state.performanceBankGuarantee = {
						list: list,
						count: response.count,
						loading: false,
						miniParams: {
							...state.performanceBankGuarantee.miniParams,
							...params,
							no_of_pages: noofpages,
						},
					};
				}
			)
			.addCase(
				getMiniPerformanceBankGuarantee.rejected,
				(state, action) => {
					state.status = "getMiniPerformanceBankGuarantee failed";
					state.performanceBankGuarantee.loading = false;
					state.error = action.error.message ?? "Some Error occurred";
				}
			)
			.addCase(getMiniInspectionAgencies.pending, (state, action) => {
				state.status = "getMiniInspectionAgencies loading";
				state.inspectionAgencies.loading = true;
			})
			.addCase(getMiniInspectionAgencies.fulfilled, (state, action) => {
				state.status = "getMiniInspectionAgencies succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.inspectionAgencies.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.inspectionAgencies.miniParams?.page_size
				);
				state.inspectionAgencies = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.inspectionAgencies.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniInspectionAgencies.rejected, (state, action) => {
				state.status = "getMiniInspectionAgencies failed";
				state.inspectionAgencies.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniMaterialRequest.pending, (state, action) => {
				state.status = "getMiniMaterialRequest loading";
				state.miniMaterialRequest.loading = true;
			})
			.addCase(getMiniMaterialRequest.fulfilled, (state, action) => {
				state.status = "getMiniMaterialRequest succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniMaterialRequest.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniMaterialRequest.miniParams?.page_size
				);
				state.miniMaterialRequest = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniMaterialRequest.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniMaterialRequest.rejected, (state, action) => {
				state.status = "getMiniMaterialRequest failed";
				state.miniMaterialRequest.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniMaterialIssue.pending, (state, action) => {
				state.status = "getMiniMaterialIssue loading";
				state.miniMaterialIssue.loading = true;
			})
			.addCase(getMiniMaterialIssue.fulfilled, (state, action) => {
				state.status = "getMiniMaterialIssue succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniMaterialIssue.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniMaterialIssue.miniParams?.page_size
				);
				state.miniMaterialIssue = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniMaterialIssue.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniMaterialIssue.rejected, (state, action) => {
				state.status = "getMiniMaterialIssue failed";
				state.miniMaterialIssue.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniIssuetoproduction.pending, (state, action) => {
				state.status = "getMiniIssuetoproduction loading";
				state.issueToProduction.loading = true;
			})
			.addCase(getMiniIssuetoproduction.fulfilled, (state, action) => {
				state.status = "getMiniIssuetoproduction succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.issueToProduction.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.issueToProduction.miniParams?.page_size
				);
				state.issueToProduction = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.issueToProduction.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniIssuetoproduction.rejected, (state, action) => {
				state.status = "getMiniIssuetoproduction failed";
				state.issueToProduction.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniMRNReturn.pending, (state, action) => {
				state.status = "getMiniMRNReturn loading";
				state.miniMRNReturn.loading = true;
			})
			.addCase(getMiniMRNReturn.fulfilled, (state, action) => {
				state.status = "getMiniMRNReturn succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniMRNReturn.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniMRNReturn.miniParams?.page_size
				);
				state.miniMRNReturn = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniMRNReturn.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniMRNReturn.rejected, (state, action) => {
				state.status = "getMiniMRNReturn failed";
				state.miniMRNReturn.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniMaterialReceipt.pending, (state, action) => {
				state.status = "getMiniMaterialReceipt loading";
				state.miniMaterialReceipt.loading = true;
			})
			.addCase(getMiniMaterialReceipt.fulfilled, (state, action) => {
				state.status = "getMiniMaterialReceipt succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniMaterialReceipt.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniMaterialReceipt.miniParams?.page_size
				);
				state.miniMaterialReceipt = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniMaterialReceipt.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniMaterialReceipt.rejected, (state, action) => {
				state.status = "getMiniMaterialReceipt failed";
				state.miniMaterialReceipt.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniProductionReceipt.pending, (state, action) => {
				state.status = "getMiniProductionReceipt loading";
				state.productionReport.loading = true;
			})
			.addCase(getMiniProductionReceipt.fulfilled, (state, action) => {
				state.status = "getMiniProductionReceipt succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.productionReport.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.productionReport.miniParams?.page_size
				);
				state.productionReport = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.productionReport.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniProductionReceipt.rejected, (state, action) => {
				state.status = "getMiniProductionReceipt failed";
				state.productionReport.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniStockTransferOut.pending, (state, action) => {
				state.status = "getMiniStockTransferOut loading";
				state.miniStockTransferOut.loading = true;
			})
			.addCase(getMiniStockTransferOut.fulfilled, (state, action) => {
				state.status = "getMiniStockTransferOut succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniStockTransferOut.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniStockTransferOut.miniParams?.page_size
				);
				state.miniStockTransferOut = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniStockTransferOut.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniStockTransferOut.rejected, (state, action) => {
				state.status = "getMiniStockTransferOut failed";
				state.miniStockTransferOut.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniStockTransferIn.pending, (state, action) => {
				state.status = "getMiniStockTransferIn loading";
				state.miniStockTransferIn.loading = true;
			})
			.addCase(getMiniStockTransferIn.fulfilled, (state, action) => {
				state.status = "getMiniStockTransferIn succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniStockTransferIn.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniStockTransferIn.miniParams?.page_size
				);
				state.miniStockTransferIn = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniStockTransferIn.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniStockTransferIn.rejected, (state, action) => {
				state.status = "getMiniStockTransferIn failed";
				state.miniStockTransferIn.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniDeliveryChallan.pending, (state, action) => {
				state.status = "getMiniDeliveryChallan loading";
				state.miniDeliveryChallan.loading = true;
			})
			.addCase(getMiniDeliveryChallan.fulfilled, (state, action) => {
				state.status = "getMiniDeliveryChallan succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniDeliveryChallan.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniDeliveryChallan.miniParams?.page_size
				);
				state.miniDeliveryChallan = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniDeliveryChallan.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniDeliveryChallan.rejected, (state, action) => {
				state.status = "getMiniDeliveryChallan failed";
				state.miniDeliveryChallan.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniDeliveryReturns.pending, (state, action) => {
				state.status = "getMiniDeliveryReturns loading";
				state.miniDeliveryReturnNote.loading = true;
			})
			.addCase(getMiniDeliveryReturns.fulfilled, (state, action) => {
				state.status = "getMiniDeliveryReturns succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniDeliveryReturnNote.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniDeliveryReturnNote.miniParams?.page_size
				);
				state.miniDeliveryReturnNote = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniDeliveryReturnNote.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniDeliveryReturns.rejected, (state, action) => {
				state.status = "getMiniDeliveryReturns failed";
				state.miniDeliveryReturnNote.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniExpenditureType.pending, (state, action) => {
				state.status = "getMiniExpenditureType loading";
				state.miniExpenditureType.loading = true;
			})
			.addCase(getMiniExpenditureType.fulfilled, (state, action) => {
				state.status = "getMiniExpenditureType succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniExpenditureType.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniExpenditureType.miniParams?.page_size
				);
				state.miniExpenditureType = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniExpenditureType.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniExpenditureType.rejected, (state, action) => {
				state.status = "getMiniExpenditureType failed";
				state.miniExpenditureType.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniExpenditureSheet.pending, (state, action) => {
				state.status = "getMiniExpenditureSheet loading";
				state.miniExpenditureSheet.loading = true;
			})
			.addCase(getMiniExpenditureSheet.fulfilled, (state, action) => {
				state.status = "getMiniExpenditureSheet succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniExpenditureSheet.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniExpenditureSheet.miniParams?.page_size
				);
				state.miniExpenditureSheet = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniExpenditureSheet.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniExpenditureSheet.rejected, (state, action) => {
				state.status = "getMiniExpenditureSheet failed";
				state.miniExpenditureSheet.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniDepartmentUsers.pending, (state, action) => {
				state.status = "getMiniDepartmentUsers loading";
				state.miniDepartmentUsers.loading = true;
			})
			.addCase(getMiniDepartmentUsers.fulfilled, (state, action) => {
				state.status = "getMiniDepartmentUsers succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniDepartmentUsers.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniDepartmentUsers.miniParams?.page_size
				);
				state.miniDepartmentUsers = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniDepartmentUsers.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniDepartmentUsers.rejected, (state, action) => {
				state.status = "getMiniDepartmentUsers failed";
				state.miniDepartmentUsers.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniFolders.pending, (state, action) => {
				state.status = "getMiniFolders loading";
				state.miniFolders.loading = true;
			})
			.addCase(getMiniFolders.fulfilled, (state, action) => {
				state.status = "getMiniFolders succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniFolders.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniFolders.miniParams?.page_size
				);
				state.miniFolders = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniFolders.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniFolders.rejected, (state, action) => {
				state.status = "getMiniFolders failed";
				state.miniFolders.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniCurrencies.pending, (state, action) => {
				state.status = "getMiniCurrencies loading";
				state.miniCurrencies.loading = true;
			})
			.addCase(getMiniCurrencies.fulfilled, (state, action) => {
				state.status = "getMiniCurrencies succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniCurrencies.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniCurrencies.miniParams?.page_size
				);
				state.miniCurrencies = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniCurrencies.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniCurrencies.rejected, (state, action) => {
				state.status = "getMiniCurrencies failed";
				state.miniCurrencies.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniExpenses.pending, (state, action) => {
				state.status = "getMiniExpenses loading";
				state.miniExpenses.loading = true;
			})
			.addCase(getMiniExpenses.fulfilled, (state, action) => {
				state.status = "getMiniExpenses succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniExpenses.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniExpenses.miniParams?.page_size
				);
				state.miniExpenses = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniExpenses.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniExpenses.rejected, (state, action) => {
				state.status = "getMiniExpenses failed";
				state.miniExpenses.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getWarehouseByProject.pending, (state, action) => {
				state.status = "getWarehouseByProject loading";
				state.warehouseByProject.loading = true;
			})
			.addCase(getWarehouseByProject.fulfilled, (state, action) => {
				state.status = "getWarehouseByProject succeeded";
				const { response, params } = action.payload;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.warehouseByProject.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.warehouseByProject.miniParams?.page_size
				);
				state.warehouseByProject = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.warehouseByProject.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getWarehouseByProject.rejected, (state, action) => {
				state.status = "getWarehouseByProject failed";
				state.warehouseByProject.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(
				getMiniMaterialRequestApproval.pending,
				(state, action) => {
					state.status = "getMiniMaterialRequestApproval loading";
					state.miniMaterialRequest.loading = true;
				}
			)
			.addCase(
				getMiniMaterialRequestApproval.fulfilled,
				(state, action) => {
					state.status = "getMiniMaterialRequestApproval succeeded";
					var response = action.payload.response;
					var params = action.payload.params;
					var list = [];
					if (params?.page == 1) {
						list = response.results;
					} else {
						list = [
							...state.miniMaterialRequestApproval.list,
							...response.results,
						];
					}
					var noofpages = Math.ceil(
						response.count /
							state.miniMaterialRequestApproval.miniParams
								?.page_size
					);
					state.miniMaterialRequestApproval = {
						list: list,
						count: response.count,
						loading: false,
						miniParams: {
							...state.miniMaterialRequestApproval.miniParams,
							...params,
							no_of_pages: noofpages,
						},
					};
				}
			)
			.addCase(
				getMiniMaterialRequestApproval.rejected,
				(state, action) => {
					state.status = "getMiniMaterialRequestApproval failed";
					state.miniMaterialRequestApproval.loading = false;
					state.error = action.error.message ?? "Some Error occurred";
				}
			)
			.addCase(getMiniAccountTypes.pending, (state, action) => {
				state.status = "getMiniAccountTypes loading";
				state.miniAccountTypes.loading = true;
			})
			.addCase(getMiniAccountTypes.fulfilled, (state, action) => {
				state.status = "getMiniAccountTypes succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniAccountTypes.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniAccountTypes.miniParams?.page_size
				);
				state.miniAccountTypes = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniAccountTypes.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniAccountTypes.rejected, (state, action) => {
				state.status = "getMiniAccountTypes failed";
				state.miniAccountTypes.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getAllContentTypes.pending, (state, action) => {
				state.status = "getAllContentTypes loading";
				state.miniAllContentTypes.loading = true;
			})
			.addCase(getAllContentTypes.fulfilled, (state, action) => {
				state.status = "getAllContentTypes succeeded";
				const { response, params }: any = action.payload;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniAllContentTypes.list,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count /
						state.miniAllContentTypes.miniParams?.page_size
				);
				state.miniAllContentTypes = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniAllContentTypes.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getAllContentTypes.rejected, (state, action) => {
				state.status = "getAllContentTypes failed";
				state.miniAllContentTypes.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})

			.addCase(getMiniItemsAgainstWarehouse.pending, (state, action) => {
				state.status = "getMiniItemsAgainstWarehouse loading";
				state.warehouseAgainstItems.loading = true;
			})
			.addCase(
				getMiniItemsAgainstWarehouse.fulfilled,
				(state, action) => {
					state.status = "getMiniItemsAgainstWarehouse succeeded";
					const { response, params } = action.payload;
					var list = [];
					if (params?.page == 1) {
						list = response.results;
					} else {
						list = [
							...state.warehouseAgainstItems.list,
							...response.results,
						];
					}
					var noofpages = Math.ceil(
						response.count /
							state.warehouseAgainstItems.miniParams?.page_size
					);
					state.warehouseAgainstItems = {
						list: list,
						count: response.count,
						loading: false,
						miniParams: {
							...state.warehouseAgainstItems.miniParams,
							...params,
							no_of_pages: noofpages,
						},
					};
				}
			)
			.addCase(getMiniItemsAgainstWarehouse.rejected, (state, action) => {
				state.status = "getMiniItemsAgainstWarehouse failed";
				state.warehouseAgainstItems.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniMaterialIssueApproval.pending, (state, action) => {
				state.status = "getMiniMaterialIssueApproval loading";
				state.miniMaterialIssueApproval.loading = true;
			})
			.addCase(
				getMiniMaterialIssueApproval.fulfilled,
				(state, action) => {
					state.status = "getMiniMaterialIssueApproval succeeded";
					var response = action.payload.response;
					var params = action.payload.params;
					var list = [];
					if (params?.page == 1) {
						list = response.results;
					} else {
						list = [
							...state.miniMaterialIssueApproval.list,
							...response.results,
						];
					}
					var noofpages = Math.ceil(
						response.count /
							state.miniMaterialIssueApproval.miniParams
								?.page_size
					);
					state.miniMaterialIssueApproval = {
						list: list,
						count: response.count,
						loading: false,
						miniParams: {
							...state.miniMaterialIssueApproval.miniParams,
							...params,
							no_of_pages: noofpages,
						},
					};
				}
			)
			.addCase(getMiniMaterialIssueApproval.rejected, (state, action) => {
				state.status = "getMiniMaterialIssueApproval failed";
				state.miniMaterialIssueApproval.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniStockOut.pending, (state, action) => {
				state.status = "getMiniStockOut loading";
				state.miniStockOut.loading = true;
			})
			.addCase(getMiniStockOut.fulfilled, (state, action) => {
				state.status = "getMiniStockOut succeeded";
				var response = action.payload.response;
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.miniStockOut.list, ...response.results];
				}
				var noofpages = Math.ceil(
					response.count / state.miniStockOut.miniParams?.page_size
				);
				state.miniStockOut = {
					list: list,
					count: response.count,
					loading: false,
					miniParams: {
						...state.miniStockOut.miniParams,
						...params,
						no_of_pages: noofpages,
					},
				};
			})
			.addCase(getMiniStockOut.rejected, (state, action) => {
				state.status = "getMiniStockOut failed";
				state.miniStockOut.loading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(getMiniClientLocations.pending, (state, action) => {
				state.status = "getMiniClientLocations loading";
				state.miniClientLocationLoading = true;
			})
			.addCase(getMiniClientLocations.fulfilled, (state, action) => {
				state.status = "getMiniClientLocations succeeded";
				state.miniClientLocationLoading = false;
				var response = action.payload.response;

				console.log(response);
				var params = action.payload.params;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [
						...state.miniClientLocationList,
						...response.results,
					];
				}
				var noofpages = Math.ceil(
					response.count / state.miniClientLocationParams?.page_size
				);
				state.miniClientLocationList = list;
				state.miniClientLocationCount = response.count;
				state.miniClientLocationParams = {
					...state.miniClientLocationParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getMiniClientLocations.rejected, (state, action) => {
				state.status = "getMiniClientLocations failed";
				state.miniClientLocationLoading = false;
				state.error = action.error.message ?? "Some Error occurred";
			})
			.addCase(
				getMiniClientLocationsAganistCustomer.pending,
				(state, action) => {
					state.status =
						"getMiniClientLocationsAganistCustomer loading";
					state.miniClientLocationsAganistCustomer.loading = true;
				}
			)
			.addCase(
				getMiniClientLocationsAganistCustomer.fulfilled,
				(state, action) => {
					state.status =
						"getMiniClientLocationsAganistCustomer succeeded";
					var response = action.payload.response;
					var params = action.payload.params;
					var list = [];
					if (params?.page == 1) {
						list = response.results;
					} else {
						list = [
							...state.miniClientLocationsAganistCustomer.list,
							...response.results,
						];
					}
					var noofpages = Math.ceil(
						response.count /
							state.miniClientLocationsAganistCustomer.miniParams
								?.page_size
					);
					state.miniClientLocationsAganistCustomer = {
						list: list,
						count: response.count,
						loading: false,
						miniParams: {
							...state.miniClientLocationsAganistCustomer
								.miniParams,
							...params,
							no_of_pages: noofpages,
						},
					};
				}
			)
			.addCase(
				getMiniClientLocationsAganistCustomer.rejected,
				(state, action) => {
					state.status =
						"getMiniClientLocationsAganistCustomer failed";
					state.miniClientLocationsAganistCustomer.loading = false;
					state.error = action.error.message ?? "Some Error occurred";
				}
			);
	},
});

// Action creators are generated for each case reducer function
export const {
	clearMiniAllContentTypes,
	clearMiniCountry,
	clearMiniStates,
	clearMiniCities,
	setMiniStatesParams,
	setMiniZoneParams,
	setMiniAreaParams,
	setMiniLocationParams,
	clearMiniLocation,
	setMiniCityParams,
	setMiniUserParams,
	clearMiniUsers,
	clearTenderNature,
	clearMiniProjects,
	clearMiniDepartments,
	clearMiniCompany,
	clearMiniTenderMasterItems,
	clearMiniEnquiry,
	clearMiniVendors,
	clearMiniMake,
	setCountryValue,
	setStateValue,
	clearMiniCustomers,
	clearMiniItems,
	clearMiniLeads,
	clearMiniItemGroups,
	clearMiniBaseUnits,
	clearMiniUnits,
	clearMiniTax,
	clearMiniDocuments,
	clearMiniStages,
	clearMiniTenders,
	clearMiniWarehouse,
	clearMiniPurchaseIndent,
	clearMiniUserTypes,
	clearMiniPurchaseOrder,
	clearMiniBatch,
	clearMiniMRN,
	clearMiniProjectGroups,
	clearMiniMilestones,
	clearMiniMaterialRequest,
	clearMiniMaterialRequestApproval,
	clearMiniMaterialIssueApproval,
	clearMiniMaterialIssue,
	clearMiniPerformanceBankGuarantee,
	clearMiniInspectionAgencies,
	clearMiniMRNReturn,
	clearMiniMaterialReceipt,
	clearMiniStockTransferOut,
	clearMiniIssueToProduction,
	clearMiniProductionReceipt,
	clearMiniStockTransferIn,
	clearMiniDeliveryChallan,
	clearMiniDeliveryReturnNote,
	clearMiniExpenditureType,
	clearMiniExpenditureSheet,
	clearMiniDepartmentUsers,
	clearMiniFolders,
	clearMiniCurrencies,
	clearMiniExpenses,
	clearWarehouseByProject,
	clearMiniAccountGroups,
	clearMiniAccountType,
	clearMiniMoc,
	clearWarehouseAgainstItems,
	clearStockOut,
	clearMiniClientLocation,
	clearMiniClientLocationsAganistCustomer,
} = miniSlice.actions;

export const miniSelector = (state: RootState) => state.mini;

export default miniSlice.reducer;
