import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
	postFormData,
	putImg,
} from "@src/helpers/Helper";
import { DocumentInitialState, Data } from "./document.types";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { setCheckedList } from "./document.slice";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getDocuments = createAsyncThunk<
	{
		response: {
			results: Data[];
			count: number;
		};
		params: DocumentInitialState["pageParams"];
	},
	DocumentInitialState["pageParams"]
>("documents/getDocuments", async (payload, { dispatch }) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/tenders/tenderdocuments/list/${params.tender}/`,
			params
		);
		if (response) {
			dispatch(setCheckedList([]));
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getDocumentById = createAsyncThunk<
	{
		response: Data;
	},
	{ id: any }
>("documents/getDocumentById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/tenders/tenderdocuments/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postDocuments = createAsyncThunk<
	any,
	{
		data: any;
		params: DocumentInitialState["pageParams"];
		clearData: () => void;
	}
>("documents/postDocuments", async (payload, { dispatch }) => {
	const { data, params, clearData } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postFormData(
			`/tenders/tenderdocuments/create/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			clearData();
			Swal.close();
			dispatch(getDocuments(params));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Document Saved Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
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

export const editDocument = createAsyncThunk<
	any,
	{
		id: string;
		data: any;
		params: DocumentInitialState["pageParams"];
		clearData: () => void;
	}
>("documents/editDocument", async (payload, { dispatch }) => {
	const { id, data, params, clearData } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await putImg(`/tenders/tenderdocuments/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			clearData();
			Swal.close();
			dispatch(getDocuments(params));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Document Edited Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
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
