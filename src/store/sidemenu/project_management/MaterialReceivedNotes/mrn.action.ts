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
import { MaterialReceivedNotesInitialState, Mrn, MrnItem } from "./mrn.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";
import { FileType } from "@src/components";

export const getMaterialReceivedNotes = createAsyncThunk<
	{
		response: {
			results: Mrn[];
			count: number;
		};
		params: MaterialReceivedNotesInitialState["pageParams"];
	},
	MaterialReceivedNotesInitialState["pageParams"]
>("project/mrn/getMaterialReceivedNotes", async (payload) => {
	var params = addParams(payload);
	const { project_id } = payload;
	try {
		const response = await getParamsList(
			`/materialreceivednote/mrn/list/${project_id}/`,
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

export const getMRNById = createAsyncThunk<
	{
		response: Mrn;
	},
	{ id: string }
>("project/mrn/getMRnById", async (payload, { dispatch }) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/materialreceivednote/mrn/${id}/`);
		if (response) {
			dispatch(
				getPurchaseOrderById({
					id: response?.data?.purchaseorder?.id,
				})
			);
			Swal.close();
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const getPurchaseOrderById = createAsyncThunk<
	{
		response: Mrn;
	},
	{ id: string }
>("project/mrn/getPurchaseOrderById", async (payload) => {
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
		Swal.close();
		throw error.message;
	}
});

export const postMaterialReceivedNotes = createAsyncThunk<
	any,
	{
		data: any;
		params: MaterialReceivedNotesInitialState["pageParams"];
		navigate: any;
		mrnReset: any;
		invoice_document: any;
	}
>("project/mr/postMaterialReceivedNotes", async (payload, { dispatch }) => {
	const { data, params, navigate, mrnReset, invoice_document } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/materialreceivednote/create/`, {
			...data,
		});
		invoice_document &&
			invoice_document.forEach(async (file: FileType) => {
				file.originalObj &&
					(await postFormData(
						`/materialreceivednote/mrn/${response.data.id}/`,
						{
							invoice_document: file.originalObj,
						}
					));
			});
		// invoice_document &&
		// 	invoice_document.forEach(async (file: any) => {
		// 		await postFormData(
		// 			`/materialreceivednote/mrn/${response.data.id}/`,
		// 			{
		// 				invoice_document: file,
		// 			}
		// 		);
		// 	});
		if (response.status >= 200 && response.status < 300) {
			mrnReset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Mrn Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getMaterialReceivedNotes(params));
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

export const editMaterialReceivedNotes = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: MaterialReceivedNotesInitialState["pageParams"];
		navigate: any;
		mrnReset: any;
		invoice_document: any;
	}
>("project/mr/editMaterialReceivedNotes", async (payload, { dispatch }) => {
	const { id, data, params, navigate, mrnReset, invoice_document } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/materialreceivednote/mrn/${id}/`, {
			...data,
		});
		invoice_document &&
			invoice_document.forEach(async (file: FileType) => {
				file.originalObj &&
					(await postFormData(
						`/materialreceivednote/mrn/${id}/`,
						{
							invoice_document: file.originalObj,
						}
					));
			});
		if (response.status >= 200 && response.status < 300) {
			mrnReset();
			navigate(-1);
			// Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Mrn Edited Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getMaterialReceivedNotes(params));
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

export const getPOItems = createAsyncThunk<
	{
		response: {
			results: MrnItem[];
			count: number;
		};
		params: MaterialReceivedNotesInitialState["pageParams"];
	},
	MaterialReceivedNotesInitialState["pageParams"]
>("project/mrn/getPOItems", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/purchaseorder/purchaseorderitems/mrnlist/`,
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
