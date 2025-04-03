import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import { CaseSheetInitialState, CaseSheet } from "./caseSheet.types";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getCaseSheets = createAsyncThunk<
	{
		response: {
			results: CaseSheet[];
			count: number;
		};
		params: PageParamsTypes;
	},
	CaseSheetInitialState["pageParams"]
>("caseSheet/getCaseSheets", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/tenders/casesheets/list/${params?.tender}/`,
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

export const getCaseSheetById = createAsyncThunk<
	{
		response: CaseSheet;
	},
	{ id: any }
>("caseSheet/getCaseSheetById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/tenders/casesheets/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postCaseSheet = createAsyncThunk<
	any,
	{
		data: any;
		params: PageParamsTypes;
		hide: () => void;
	}
>("caseSheet/postCaseSheet", async (payload, { dispatch }) => {
	const { data, params, hide } = payload;
	try {
		const response = await postAdd(`/tenders/casesheets/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Case Sheet Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			hide();
			dispatch(getCaseSheets(params));
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

export const editCaseSheet = createAsyncThunk<
	any,
	{
		id: any;
		data: any;
		params: PageParamsTypes;
		hide: () => void;
	}
>("caseSheet/editCaseSheet", async (payload, { dispatch }) => {
	const { id, data, params, hide } = payload;
	try {
		const response = await postEdit(`/tenders/casesheets/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Case Sheet Edited Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			hide();
			dispatch(getCaseSheets(params));
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

export const ApproveCaseSheet = createAsyncThunk<
	any,
	{
		id: string | number;
		data: {
			status: string | number;
			costing_remarks?: string;
			remarks?: string;
		};
		params: PageParamsTypes;
		closeModal: any;
	}
>("tenders/ApproveCaseSheet", async (payload, { dispatch }) => {
	const { id, data, params, closeModal } = payload;
	try {
		const response: any = await postEdit(
			`/tenders/casesheetsapprove/${id}/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			// if (params) {
			dispatch(getCaseSheets(params));
			// } else {
			// 	dispatch(getCaseSheetById({ id }));
			// }
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Case Sheet Approved",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			closeModal(false);
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
export const RejectCasesheet = createAsyncThunk<
	any,
	{
		id: string | number;
		data: {
			status: string | number;
			costing_remarks?: string;
			remarks?: string;
		};
		params: PageParamsTypes;
		closeModal: any;
	}
>("tenders/RejectCasesheet", async (payload, { dispatch }) => {
	const { id, data, params, closeModal } = payload;
	try {
		const response: any = await postEdit(
			`/tenders/casesheetsapprove/${id}/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			// if (params) {
			dispatch(getCaseSheets(params));
			// } else {
			// 	dispatch(getCaseSheetById({ id }));
			// }
			closeModal(false);
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Case Sheet Rejected",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			closeModal();
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
