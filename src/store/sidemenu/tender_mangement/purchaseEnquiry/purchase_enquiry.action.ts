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
>("getPurchaseEnquiry", async (payload) => {
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
>("PE/getPurchaseEnquiryById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(
			`/purchaseenquiry/purchaseenquiries/${id}/`
		);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postPurchaseEnquiry = createAsyncThunk<
	any,
	{
		data: any;
		params: PurchaseEnquiryState["pageParams"];
		navigate: any;
		enquriyReset: any;
	}
>("PE/postPurchaseEnquiry", async (payload, { dispatch }) => {
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
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Purchase Enquiry Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				navigate(-1);
			});
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
		throw error.message;
	}
});

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
>("PE/editPurchaseEnquiry", async (payload, { dispatch }) => {
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
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Purchase Enquiry Updated Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				navigate(-1);
			});
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
>("PE/getVendorsByItems", async (payload, { dispatch }) => {
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
