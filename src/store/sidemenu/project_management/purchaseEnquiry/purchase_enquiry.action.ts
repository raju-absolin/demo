import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig, PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import {
	PurchaseEnquiryState,
	PurchaseEnquiry,
} from "./purchase_enquiry.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";

type GetItemsPayloadTypes = PurchaseEnquiryState["pageParams"] & {
	from_date?: string;
	to_date?: string;
};

export const getPurchaseEnquiry = createAsyncThunk<
	{
		response: {
			results: PurchaseEnquiry[];
			count: number;
		};
		params: PageParamsTypes;
	},
	GetItemsPayloadTypes
>("project/getPurchaseEnquiry", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/purchaseenquiry/purchaseenquiries/list/${params.project_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getPurchaseEnquiryById = createAsyncThunk<
	{
		response: PurchaseEnquiry;
	},
	{ id: string }
>("project/PE/getPurchaseEnquiryById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(
			`/purchaseenquiry/purchaseenquiries/${id}/`
		);
		if (response) {
			setTimeout(() => {
				Swal.close();
			}, 1000);
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		Swal.close();
		throw error.message;
	}
});

// export const postItemData = createAsyncThunk<
// 	any,
// 	{
// 		data: {
// 			name: string;
// 		};
// 		params: PageParamsTypes;
// 		hide: (value: boolean) => void;
// 	}
// >("project/PE/postItemData", async (payload, { dispatch }) => {
// 	const { data, params, hide } = payload;
// 	try {
// 		const response = await postAdd(
// 			`/tendermanagement/tenderitemmaster/create/`,
// 			{ ...data }
// 		);
// 		if (response.status >= 200 && response.status < 300) {
// 			hide(true);
// 			dispatch(getPurchaseEnquiry(params));
// 			return response.data;
// 		} else {
// 			throw new Error(response.data);
// 		}
// 	} catch (error: any) {
//
// 		const errormessage = error.response.data
// 			? JSON.stringify(error.response.data)
// 			: error.message;
// 		Swal.fire({
// 			title: `<p style="font-size:20px">Error</p>`,
// 			text: `${errormessage}`,
// 			icon: "error",
// 			confirmButtonText: `Close`,
// 			confirmButtonColor: "#3085d6",
// 		});
// 		throw error.message;
// 	}
// });

// function formatErrorMessage(errorObj: Record<string, any>) {
// 	let errorMessages: string[] = [];
// 	for (const key in errorObj) {
// 		if (Array.isArray(errorObj[key]) && errorObj[key].length > 0) {
// 			if (typeof errorObj[key][0] === "string") {
// 				if (key === "error") {
// 					errorMessages.push(errorObj[key][0]);
// 				} else {
// 					let formattedKey = key.replace(/_id$/, '');
// 					formattedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1).replace(/_/g, ' ');
// 					errorMessages.push(`${formattedKey} is required.`);
// 				}
// 			}
// 			else if (errorObj[key].some(item => typeof item === "object" && item !== null)) {
// 				errorObj[key].forEach((item: Record<string, any>) => {
// 					for (const subKey in item) {
// 						if (Array.isArray(item[subKey]) && item[subKey].length > 0) {
// 							let formattedSubKey = subKey.replace(/_id$/, '');
// 							formattedSubKey = formattedSubKey.charAt(0).toUpperCase() + formattedSubKey.slice(1).replace(/_/g, ' ');
// 							errorMessages.push(`${formattedSubKey} is required.`);
// 						}
// 					}
// 				});
// 			}
// 		}
// 	}

// 	return errorMessages.join("\n");
// }

export const postPurchaseEnquiry = createAsyncThunk<
	any,
	{
		data: any;
		params: PurchaseEnquiryState["pageParams"];
		navigate: any;
		enquriyReset: any;
	}
>("project/PE/postPurchaseEnquiry", async (payload, { dispatch }) => {
	const { data, params, navigate, enquriyReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/purchaseenquiry/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			enquriyReset();
			navigate(-1);

			setTimeout(() => {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Purchase Enquiry Added Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}, 1000);

			dispatch(getPurchaseEnquiry(params));
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
	}
});

// export const getTenderById = createAsyncThunk<
// 	{
// 		response: Tender;
// 	},
// 	{ id: string }
// >("tenders/getTenderById", async (payload) => {
// 	const { id } = payload;
// 	try {
// 		const response = await getList(`/tendermanagement/tenders/${id}/`);
// 		if (response) {
// 			return { response: response.data };
// 		} else {
// 			throw new Error(response);
// 		}
// 	} catch (error: any) {
// 		throw error.message;
// 	}
// });

export const editPurchaseEnquiry = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: PurchaseEnquiryState["pageParams"];
		navigate: any;
		enquriyReset: any;
		// hide: (value: boolean) => void;
	}
>("project/PE/editPurchaseEnquiry", async (payload, { dispatch }) => {
	const { id, data, params, navigate, enquriyReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(
			`/purchaseenquiry/purchaseenquiries/${id}/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			enquriyReset();
			navigate(-1);
			setTimeout(() => {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Purchase Enquiry Edited Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}, 1000);

			dispatch(getPurchaseEnquiry(params));
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});

export const getVendorsByItems = createAsyncThunk<
	any,
	{
		data: string[];
		params: any;
	}
>("project/PE/getVendorsByItems", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/vendorsbyproducts/`, {
			...payload,
		});
		if (response.status >= 200 && response.status < 300) {
			return { response: response.data, params: payload };
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});
