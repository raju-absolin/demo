import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	patchImg,
	postAdd,
	postEdit,
	postFormData,
} from "@src/helpers/Helper";
import {
	MaterialReceiptInitialState,
	MaterialReceipt,
} from "./material_receipt.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getMaterialReceipt = createAsyncThunk<
	{
		response: {
			results: MaterialReceipt[];
			count: number;
		};
		params: MaterialReceiptInitialState["pageParams"];
	},
	MaterialReceiptInitialState["pageParams"]
>("project/mrn/getMaterialReceipt", async (payload) => {
	var params = addParams(payload);
	const { project_id } = payload;
	try {
		const response = await getParamsList(
			`/materialreceipt/list/${project_id}/`,
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

export const getMaterialReceiptById = createAsyncThunk<
	{
		response: MaterialReceipt;
	},
	{ id: string }
>("project/mrn/getMaterialReceiptById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/materialreceipt/${id}/`);
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

export const getMIById = createAsyncThunk<
	{
		response: MaterialReceipt;
	},
	{ id: string }
>("project/mi/getMIById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/materialissue/${id}/`);
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

export const postMaterialReceipt = createAsyncThunk<
	any,
	{
		data: any;
		params: MaterialReceiptInitialState["pageParams"];
		navigate: any;
		miReset: any;
	}
>("project/mr/postMaterialReceipt", async (payload, { dispatch }) => {
	const { data, params, navigate, miReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/materialreceipt/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			miReset();
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Material Receipt Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				navigate(-1);
			});
			dispatch(getMaterialReceipt(params));
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

export const editMaterialReceipt = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: MaterialReceiptInitialState["pageParams"];
		navigate: any;
		miReset: any;
	}
>("project/mr/editMaterialReceipt", async (payload, { dispatch }) => {
	const { id, data, params, navigate, miReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/materialreceipt/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			miReset();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Material Receipt Updated Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				navigate(-1);
			});
			dispatch(getMaterialReceipt(params));
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
