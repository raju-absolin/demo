import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
	postFormData,
} from "@src/helpers/Helper";
import {
	PaymentRequestInitialState,
	PaymentRequest,
} from "./payment_request.types";
import Swal from "sweetalert2";
import { string } from "yup";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getPaymentRequests = createAsyncThunk<
	{
		response: {
			results: PaymentRequest[];
			count: number;
		};
		params: PaymentRequestInitialState["pageParams"];
	},
	PaymentRequestInitialState["pageParams"]
>("project/getPaymentRequests", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`payments/paymentrequest/list/${params.project_id}/${params.po_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		console.error(error);
		throw new Error(error?.message);
	}
});

export const getPaymentRequestById = createAsyncThunk<
	{
		response: PaymentRequest;
	},
	{ id: string }
>("project/getPaymentRequestById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/payments/paymentrequest/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postPaymentRequest = createAsyncThunk<
	any,
	{
		data: any;
		params: PaymentRequestInitialState["pageParams"];
		navigate: any;
	}
>("project/po/postPaymentRequest", async (payload, { dispatch }) => {
	const { data, params, navigate } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/payments/paymentrequest/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			// navigate(-1);
			// POReset();
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Payment Request Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getPaymentRequests(params));
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

export const editPaymentRequest = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: PaymentRequestInitialState["pageParams"];
		navigate: any;
		POReset: any;
	}
>("project/po/editPaymentRequest", async (payload, { dispatch }) => {
	const { id, data, params, navigate, POReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/payments/paymentrequest/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			navigate(-1);
			POReset();
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Payment Request Edited Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getPaymentRequests(params));
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

export const PaymentRequestCheckApproval = createAsyncThunk<
	any,
	{
		payment_request_id: string | number;
	}
>("project/PaymentRequestCheckApproval", async (payload, { dispatch }) => {
	const { payment_request_id } = payload;
	try {
		const response = await postAdd(`/payments/checkapprove/`, {
			payment_request_id,
		});
		if (response.status >= 200 && response.status < 300) {
			Swal.close();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const PaymentRequestApproval = createAsyncThunk<
	any,
	{
		data: any;
	}
>("project/PaymentRequestApproval", async (payload, { dispatch }) => {
	const { data } = payload;
	try {
		const response = await postAdd(`/payments/approve/`, data);
		if (response.status >= 200 && response.status < 300) {
			if (response.data.approved_status == 2) {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "PaymentRequest Approved Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(
					getPaymentRequestById({ id: data?.payment_request_id })
				);
				return response.data;
			} else if (response.data.approved_status == 3) {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "PaymentRequest Rejected Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(
					getPaymentRequestById({ id: data?.payment_request_id })
				);
				return response.data;
			}
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
