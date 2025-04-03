import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
	postFormData,
} from "@src/helpers/Helper";
import {
	PQ_attachment,
	PurchaseQuotationInitialState,
	Quotation,
} from "./pq.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";
import { PurchaseEnquiry } from "../purchaseEnquiry/purchase_enquiry.types";

export const getPurchaseQuotations = createAsyncThunk<
	{
		response: {
			results: Quotation[];
			count: number;
		};
		params: PurchaseQuotationInitialState["pageParams"];
	},
	PurchaseQuotationInitialState["pageParams"]
>("pq/getPurchaseQuotations", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`quotation/quotation/list/`,
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

export const getPurchaseEnquiryById = createAsyncThunk<
	{
		response: PurchaseEnquiry;
	},
	{ id: string }
>("pq/getPurchaseEnquiryById", async (payload) => {
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

export const getPurchaseQuotationById = createAsyncThunk<
	{
		response: Quotation;
	},
	{ id: string }
>("pq/getPurchaseQuotationById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/quotation/quotation/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const getVendorByEnquiryId = createAsyncThunk<
	{
		response: Quotation;
	},
	{ id: string }
>("pq/getVendorByEnquiryId", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/quotation/vendorbype/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postPurchaseQuotation = createAsyncThunk<
	any,
	{
		data: any;
		params: PurchaseQuotationInitialState["pageParams"];
		navigate: any;
		PQReset: any;
		document: File[];
	}
>("pq/postPurchaseQuotation", async (payload, { dispatch }) => {
	const { data, params, navigate, PQReset, document } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const serialisedData = addParams(data);
		const response = await postAdd(
			`/quotation/quotation/create/`,
			serialisedData
		);
		document &&
			document.forEach(async (file: any) => {
				await postFormData(`/quotation/quotationattachments/create/`, {
					quotation_id: response.data.id,
					file: file,
				});
			});
		if (response.status >= 200 && response.status < 300) {
			PQReset();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Purchase Quotation Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				navigate(-1);
			});
			dispatch(getPurchaseQuotations(params));
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

export const editPurchaseQuotation = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: PurchaseQuotationInitialState["pageParams"];
		navigate: any;
		PQReset: any;
		document: File[];
	}
>("pq/editPurchaseQuotation", async (payload, { dispatch }) => {
	const { id, data, params, navigate, PQReset, document } = payload;
	try {
		const serialisedData = addParams(data);
		const response = await postEdit(
			`/quotation/quotation/${id}/`,
			serialisedData
		);
		document &&
			document.forEach(async (file: any) => {
				await postFormData(`/quotation/quotationattachments/create/`, {
					quotation_id: id,
					file: file,
				});
			});
		if (response.status >= 200 && response.status < 300) {
			PQReset();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Purchase Quotation Updated Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				navigate(-1);
			});
			dispatch(getPurchaseQuotations(params));
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

export const getVendorsByPE = createAsyncThunk(
	"pq/getVendorsByPE",
	async (payload) => {
		var params = addParams(payload);
		const { id } = params;
		try {
			const response = await getParamsList(
				`/purchaseenquiry/vendors/purchaseenquiry/${id}/`,
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

export const getPQAttachments = createAsyncThunk<
	{
		response: {
			results: PQ_attachment[];
			count: number;
		};
		params: PurchaseQuotationInitialState["Pq_attachments_params"];
	},
	PurchaseQuotationInitialState["Pq_attachments_params"]
>("pq/getPQAttachments", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList(
			"/quotation/quotationattachments/",
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

interface PostAttachmentPayload {
	data: {
		quotation_id: string;
		file: File;
	};
	params: PurchaseQuotationInitialState["Pq_attachments_params"];
}

export const postPQAttachment = createAsyncThunk<any, PostAttachmentPayload>(
	"pq/postPQAttachment",
	async (payload, { dispatch }) => {
		const { data, params } = payload;
		try {
			const response = await postFormData(
				`/quotation/quotationattachments/create/`,
				data
			);
			if (response.status >= 200 && response.status < 300) {
				dispatch(getPQAttachments(params));
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
	}
);

interface DeletePqAttachmentPayload {
	id: string;
	params: PurchaseQuotationInitialState["Pq_attachments_params"];
}

export const deletePQAttachment = createAsyncThunk<
	any,
	DeletePqAttachmentPayload
>("pq/deletePQAttachment", async (payload, { dispatch }) => {
	const { id, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postDelete(
			`/quotation/quotationattachments/${id}/`
		);
		if (response) {
			dispatch(getPQAttachments(params));
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "PQ Attachment Delete Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});

			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});
