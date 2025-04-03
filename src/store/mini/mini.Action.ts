import { createAsyncThunk } from "@reduxjs/toolkit";

import { addParams, getList, getParamsList } from "../../helpers/Helper";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "../sidemenu/errorMsgFormat";
import { enqueueSnackbar } from "notistack";
import { User } from "../settings/manageUsers/manage_users.types";

export const seralizeParams = (payload: any) => {
	var params: any = {};
	for (const k in payload) {
		if (Object.hasOwnProperty.call(payload, k)) {
			if (k === "type") {
				params.type = payload.type.join(",");
			} else {
				if (payload[k] !== "" && k !== "no_of_pages") {
					params[k] = payload[k];
				}
			}
		}
	}
	return params;
};

export const getUserPermissions = createAsyncThunk(
	"/getUserPermissions",
	async () => {
		try {
			const response = await getList("/users/userpermissions/");

			if (response.data) {
				return response.data;
			} else {
				throw new Error(response.data);
			}
		} catch (error: any) {
			throw error.message;
		}
	}
);
export const getMiniItemgroups = createAsyncThunk(
	"/getMiniItemgroups",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/mini/itemgroups/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniAccountgroups = createAsyncThunk(
	"/getMiniAccountgroups",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/mini/accountgroups/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniAccountTypes = createAsyncThunk(
	"/getMiniAccountTypes",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/accounttype/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniCountries = createAsyncThunk(
	"/getMiniCountries",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/countries/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniStates = createAsyncThunk(
	"/getMiniStates",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/states/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniCity = createAsyncThunk("/getMiniCity", async (payload) => {
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList("/masters/cities/mini/", params);

		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		return error.message;
	}
});

export const getMiniVendor = createAsyncThunk(
	"/getMiniVendor",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList("/masters/vendors/", params);

			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getMiniDocuments: any = createAsyncThunk(
	"/getMiniDocuments",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/document/mini/",
				params
			);

			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getMiniItems = createAsyncThunk(
	"/getMiniItems",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/mini/items/",
				params
			);

			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniAccounts = createAsyncThunk(
	"/getMiniAccounts",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/mini/accounts/",
				params
			);

			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getMiniArea = createAsyncThunk("/getMiniArea", async (payload) => {
	var params = seralizeParams(payload);

	try {
		const response = await getParamsList("/masters/area/mini/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		return error.message;
	}
});
export const getMiniLocation = createAsyncThunk(
	"/getMiniLocation",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/locations/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniZone = createAsyncThunk("/getMiniZone", async (payload) => {
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList("/masters/zone/mini/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		return error.message;
	}
});

export const getMiniUsers = createAsyncThunk(
	"/getMiniUsers",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList("/users/mini/users/", params);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniProjectGroupUsers = createAsyncThunk<
	{
		response: {
			results: User[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{
		project_id: string;
		group_id: string;
	} & PageParamsTypes
>("/getMiniProjectGroupUsers", async (payload) => {
	const { project_id, group_id } = payload;
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList(
			`/taskmanagement/projectgroupusers/list/${project_id}/${group_id}/`,
			params
		);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		return error.message;
	}
});
export const getMiniProjects = createAsyncThunk(
	"/getMiniProjects",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/projectmanagement/projects/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getMiniMake = createAsyncThunk("/getMiniMake", async (payload) => {
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList("/masters/makes/mini/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		return error.message;
	}
});
export const getMiniCategory = createAsyncThunk(
	"/getMiniCategory",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/mini/categorys/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniMoc = createAsyncThunk("/getMiniMoc", async (payload) => {
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList("/masters/mocs/mini/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		return error.message;
	}
});
export const getMiniBaseUnits = createAsyncThunk(
	"/getMiniBaseUnits",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList("/masters/uom/mini/", params);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniTenderNature = createAsyncThunk(
	"/getMiniTenderNature",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/sourceportal/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getMiniCompany = createAsyncThunk(
	"/getMiniCompany",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/compinies/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniDepartments = createAsyncThunk(
	"/getMiniDepartments",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/mini/departments/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniTenderMasterItems = createAsyncThunk(
	"/getMiniTenderMasterItems",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/tenders/tenderitemmaster/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniVendors = createAsyncThunk(
	"/getMiniVendors",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/mini/vendors/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniEnquiry = createAsyncThunk(
	"/getMiniEnquiry",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/purchaseenquiry/mini/purchaseenquiries/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniCustomers = createAsyncThunk(
	"/getMiniCustomers",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/mini/customers/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniLeads = createAsyncThunk(
	"/getMiniLeads",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList("/leads/mini/lead/", params);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniUnits = createAsyncThunk(
	"/getMiniUnits",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList("/masters/unit/mini/", params);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniTax = createAsyncThunk("/getMiniTax", async (payload) => {
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList("/masters/taxs/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		return error.message;
	}
});
export const getMiniStages = createAsyncThunk(
	"/getMiniStages",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList("/masters/stage/", params);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniTenders = createAsyncThunk(
	"/getMiniTenders",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/tenders/mini/tender/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniUniqueTender = createAsyncThunk(
	"/getMiniUniqueTender",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/tenders/minirtender/tender/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniWarehouse = createAsyncThunk(
	"/getMiniWarehouse",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/warehouse/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniPurchaseIndent = createAsyncThunk(
	"/getMiniPurchaseIndent",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/purchaseindent/purchaseindent/mini",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniUserTypes = createAsyncThunk(
	"/getMiniUserTypes",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/permissions/usertypes/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getAssigneeProjectsMini = createAsyncThunk(
	"/getAssigneeProjectsMini",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/projectmanagement/assignprojects/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getPurchaseOrderMini = createAsyncThunk(
	"/getPurchaseOrderMini",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/purchaseorder/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniBatch = createAsyncThunk(
	"/getMiniBatch",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/batch/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniMRN = createAsyncThunk("/getMiniMRN", async (payload) => {
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList(
			"/materialreceivednote/mini/mrns/",
			params
		);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		return error.message;
	}
});
export const getMiniProjectGroups = createAsyncThunk(
	"/getMiniProjectGroups",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/projectmanagement/projectgroup/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniMileStones = createAsyncThunk(
	"/getMiniMileStones",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/taskmanagement/milestone/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniMaterialRequest = createAsyncThunk(
	"/getMiniMaterialRequest",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/materialrequest/mini/materialrequests/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getMiniMaterialIssue = createAsyncThunk(
	"/getMiniMaterialIssue",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/materialissue/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniPerformanceBankGuarantee = createAsyncThunk(
	"/getMiniPerformanceBankGuarantee",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/performancebankguarantees/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniInspectionAgencies = createAsyncThunk(
	"/getMiniInspectionAgencies",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/mini/inspectionagencies/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniIssuetoproduction = createAsyncThunk(
	"/getMiniIssuetoproduction",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/production/issuetoproduction/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniMRNReturn = createAsyncThunk(
	"/getMiniMRNReturn",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/mrnreturns/mini/mrn_returns/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getMiniMaterialReceipt = createAsyncThunk(
	"/getMiniMaterialReceipt",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/materialreceipt/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getMiniStockTransferOut = createAsyncThunk(
	"/getMiniStockTransferOut",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/stocktransfer/stockout/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniProductionReceipt = createAsyncThunk(
	"/getMiniProductionReceipt",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList("/production/mini/", params);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniStockTransferIn = createAsyncThunk(
	"/getMiniStockTransferIn",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/stocktransfer/stockin/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniDeliveryChallan = createAsyncThunk(
	"/getMiniDeliveryChallan",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/delivery/mini/deliverychallans/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniDeliveryReturns = createAsyncThunk(
	"/getMiniDeliveryReturns",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/delivery/mini/deliveryreturns/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getMiniExpenditureSheet = createAsyncThunk(
	"/getMiniExpenditureSheet",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/payments/mini/expendituresheet/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getMiniExpenditureType = createAsyncThunk(
	"/getMiniExpenditureType",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/expendituretype/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniDepartmentUsers = createAsyncThunk(
	"/getMiniDepartmentUsers",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/users/userdepartments/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniFolders = createAsyncThunk(
	"/getMiniFolders",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/filesystem/mini/folders/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniCurrencies = createAsyncThunk(
	"/getMiniCurrencies",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/mini/currencies/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniExpenses = createAsyncThunk(
	"/getMiniExpenses",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/masters/mini/expances/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getWarehouseByProject = createAsyncThunk<
	{
		response: {
			results: [];
			count: number;
		};
		params: PageParamsTypes;
	},
	any
>("project/warehouse/getWarehouseByProject", async (payload) => {
	const { project_id, params } = payload;
	try {
		const response = await getParamsList(
			`/masters/warehouse/list/${project_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		console.log(error);
		throw new Error(error?.message);
	}
});

export const getMiniMaterialRequestApproval = createAsyncThunk(
	"/getMiniMaterialRequestApproval",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/materialrequest/mini/approvedlist/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getAllContentTypes = createAsyncThunk(
	"/getAllContentTypes",
	async (payload) => {
		var params = addParams(payload);
		try {
			const response = await getParamsList(
				"/users/authorization_contenttypes/",
				params
			);

			console.log(response);
			if (response) {
				return { response, params: payload };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			const errResult = formatErrorMessage(error.response.data);
			const formattedErrResult = errResult.replace(/\n/g, "<br>");
			enqueueSnackbar(formattedErrResult || "Unexpected Error Occured", {
				variant: "error",
			});
			throw error.message;
		}
	}
);

export const getMiniItemsAgainstWarehouse = createAsyncThunk<
	{
		response: {
			results: [];
			count: number;
		};
		params: PageParamsTypes;
	},
	any
>("project/warehouse/items/getMiniItemsAgainstWarehouse", async (payload) => {
	const { project_id, warehouse_id, params } = payload;
	try {
		const response = await getParamsList(
			`/projectmanagement/stockitemview/${project_id}/${warehouse_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error?.message);
	}
});
export const getMiniMaterialIssueApproval = createAsyncThunk(
	"/getMiniMaterialIssueApproval",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/materialissue/mini/for_mrlist/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const getMiniStockOut = createAsyncThunk(
	"/getMiniStockOut",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/stocktransfer/stockout/minilist/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const getMiniClientLocations = createAsyncThunk(
	"/getMiniClientLocations",
	async (payload) => {
		var params = addParams(payload);
		try {
			const response = await getParamsList(
				"/masters/clientlocation/mini/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
);
export const getMiniClientLocationsAganistCustomer = createAsyncThunk<
	{
		response: {
			results: [];
			count: number;
		};
		params: PageParamsTypes & {
			customer_id?: string;
		};
	},
	PageParamsTypes & {
		customer_id?: string;
	}
>("/getMiniClientLocationsAganistCustomer", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/masters/clientlocation/againstcustomer/${payload?.customer_id}/`,
			params
		);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
