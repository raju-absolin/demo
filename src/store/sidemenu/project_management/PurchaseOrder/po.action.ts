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
import { PurchaseOrderInitialState, Order } from "./po.types";
import Swal from "sweetalert2";
import { string } from "yup";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getPurchaseOrders = createAsyncThunk<
	{
		response: {
			results: Order[];
			count: number;
		};
		params: PurchaseOrderInitialState["pageParams"];
	},
	PurchaseOrderInitialState["pageParams"]
>("project/po/getPurchaseOrders", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`purchaseorder/purchaseorder/list/${params.project_id}/`,
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

export const getPurchaseOrderById = createAsyncThunk<
	{
		response: Order;
	},
	{ id: string | number | undefined }
>("project/po/getPurchaseOrderById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/purchaseorder/${id}`);
		if (response) {
			Swal.close();
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const getVendorByOrderId = createAsyncThunk<
	{
		response: Order;
	},
	{ id: string }
>("project/po/getVendorByOrderId", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/purchaseorder/pobyvendor/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postPurchaseOrder = createAsyncThunk<
	any,
	{
		data: any;
		params: PurchaseOrderInitialState["pageParams"];
		navigate: any;
		POReset: any;
	}
>("project/po/postPurchaseOrder", async (payload, { dispatch }) => {
	const { data, params, navigate, POReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/purchaseorder/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			POReset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Purchase Order Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getPurchaseOrders(params));
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

export const editPurchaseOrder = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: PurchaseOrderInitialState["pageParams"];
		POReset: () => void;
	}
>("project/po/editPurchaseOrder", async (payload, { dispatch }) => {
	const { id, data, params, POReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/purchaseorder/${id}`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			POReset();
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Purchase Order Edited Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getPurchaseOrders(params));
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

// export const purchaseOrderCheckApproval = createAsyncThunk<
// 	any,
// 	{
// 		purchase_order_id: string | number;
// 	}
// >("project/po/purchaseOrderCheckApproval", async (payload, { dispatch }) => {
// 	const { purchase_order_id } = payload;
// 	try {
// 		const response = await postAdd(`/purchaseorder/checkapprove/`, {
// 			purchase_order_id,
// 		});
// 		if (response.status >= 200 && response.status < 300) {
// 			Swal.close();
// 			return response.data;
// 		} else {
// 			throw new Error(response.data);
// 		}
// 	} catch (error: any) {
// 		throw error.message;
// 	}
// });

export const purchaseOrderApproval = createAsyncThunk<
	any,
	{
		data: any;
		navigate: any;
	}
>("project/pq/purchaseOrderApproval", async (payload, { dispatch }) => {
	const { data, navigate } = payload;
	try {
		const response = await postAdd(`/purchaseorder/approve/`, data);
		if (response.status >= 200 && response.status < 300) {
			if (response.data.approved_status == 2) {
				dispatch(getPurchaseOrderById({ id: data?.purchase_order_id }));
				return response.data;
			} else if (response.data.approved_status == 3) {
				dispatch(getPurchaseOrderById({ id: data?.purchase_order_id }));
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
export const postPODocuments = createAsyncThunk<
	any,
	{
		data: {
			file: File;
			purchase_order_id: string;
		};
	}
>("/postPODocuments", async (payload, { dispatch }) => {
	const { data } = payload;
	try {
		const response = await postFormData(
			`/purchaseorder/purchaseorderattachments/create/`,
			{
				...data,
			}
		);
		return { response: response.data };
	} catch (err) {
		throw err;
	}
});
export const updatePurchaseOrderStatus = createAsyncThunk<
	any,
	{
		id: number | string;
		data: {
			client_status: string;
			confirm_remarks: string;
		};
		params: PurchaseOrderInitialState["pageParams"];
		navigate: any;
	}
>("project/po/updatePurchaseOrderStatus", async (payload, { dispatch }) => {
	const { id, data, params, navigate } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/purchaseorder/poconfirm/${id}`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			await dispatch(getPurchaseOrderById({ id: id }));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Status Updated Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				setTimeout(() => {
					Swal.close();
				}, 100);
				// navigate(-1);
			});
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
