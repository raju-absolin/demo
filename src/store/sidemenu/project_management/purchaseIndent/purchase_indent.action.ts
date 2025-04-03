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
	PurchaseIndentState,
	PurchaseIndent,
	Purchase_Indent_Items_State,
} from "./purchase_indent.types";
import Swal from "sweetalert2";
import { enqueueSnackbar } from "notistack";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getPurchaseIndent = createAsyncThunk<
	{
		response: {
			results: PurchaseIndent[];
			count: number;
		};
		params: PurchaseIndentState["pageParams"];
	},
	PurchaseIndentState["pageParams"]
>("getPurchaseIndent", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/purchaseindent/purchaseindent/`,
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

export const getPurchaseIndentById = createAsyncThunk<
	{
		response: PurchaseIndent;
	},
	{
		id: string;
	}
>("PI/getItemById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/purchaseindent/purchaseindent/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});
// function formatErrorMessage(errorObj: Record<string, any>) {
// 	let errorMessages: string[] = [];
// 	for (const key in errorObj) {
// 		if (Array.isArray(errorObj[key]) && errorObj[key].length > 0) {
// 			if (errorObj[key].some(item => typeof item === "object" && item !== null)) {
// 				errorObj[key].forEach((item: Record<string, any>) => {
// 					for (const subKey in item) {
// 						if (Array.isArray(item[subKey]) && item[subKey].length > 0) {
// 							let formattedSubKey = subKey.replace(/_id$/, '');
// 							formattedSubKey = formattedSubKey.charAt(0).toUpperCase() + formattedSubKey.slice(1).replace(/_/g, ' ');
// 							errorMessages.push(`${formattedSubKey} is required.`);
// 						}
// 					}
// 				});
// 			} else {
// 				let formattedKey = key.replace(/_id$/, '');
// 				formattedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1).replace(/_/g, ' ');
// 				errorMessages.push(`${formattedKey} is required.`);
// 			}
// 		}
// 	}
// 	return errorMessages.join("\n");
// }

export const postPurchaseIndent = createAsyncThunk<
	any,
	{
		data: any;
		params: PurchaseIndentState["pageParams"];
		navigate: any;
		indentReset: any;
	}
>("PI/postPurchaseIndent", async (payload, { dispatch }) => {
	const { data, params, navigate, indentReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(
			`/purchaseindent/purchaseindent/create/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			indentReset();
			navigate(-1);

			setTimeout(() => {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Purchase Indent Added Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}, 2000);

			dispatch(getPurchaseIndent(params));
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
		throw error.message;
	}
});

export const editPurchaseIndent = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: PurchaseIndentState["pageParams"];
		navigate: any;
		indentReset: any;
		// hide: (value: boolean) => void;
	}
>("PI/editPurchaseIndent", async (payload, { dispatch }) => {
	const { id, data, params, navigate, indentReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(
			`/purchaseindent/purchaseindent/${id}/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			indentReset();
			navigate(-1);

			setTimeout(() => {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Purchase Indent Edited Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}, 2000);

			dispatch(getPurchaseIndent(params));
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

export const getPurchaseIndentItems = createAsyncThunk<
	{
		response: {
			results: Purchase_Indent_Items_State["list"];
			count: number;
		};
		params: Purchase_Indent_Items_State["miniParams"];
	},
	Purchase_Indent_Items_State["miniParams"]
>("getPurchaseIndentItems", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/purchaseindent/purchaseindentitem/`,
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
