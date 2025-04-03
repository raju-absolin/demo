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
	ReceiptFromProductionInitialState,
	ReceiptFromProduction,
} from "./RFP.types";
import Swal from "sweetalert2";
import { useAppDispatch } from "@src/store/store";
import { setSelectedData } from "./RFP.slice";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getReceiptFromProduction = createAsyncThunk<
	{
		response: {
			results: ReceiptFromProduction[];
			count: number;
		};
		params: ReceiptFromProductionInitialState["pageParams"];
	},
	ReceiptFromProductionInitialState["pageParams"]
>("project/getReceiptFromProduction", async (payload) => {
	var params = addParams(payload);
	const { project } = payload;
	try {
		const response = await getParamsList(
			`/production/list/${project}/`,
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

export const getReceiptFromProductionById = createAsyncThunk<
	{
		response: ReceiptFromProduction;
	},
	{ id: string }
>("project/getReceiptFromProductionById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/production/${id}/`);
		if (response) {
			Swal.close();
			return { response: response.data };
		} else {
			throw new Error(response);
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

export const postReceiptFromProduction = createAsyncThunk<
	any,
	{
		data: any;
		params: ReceiptFromProductionInitialState["pageParams"];
		navigate: any;
		reset: () => void;
	}
>("project/postReceiptFromProduction", async (payload, { dispatch }) => {
	const { data, params, navigate, reset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/production/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			reset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Receipt From Production Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getReceiptFromProduction(params));
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

export const editReceiptFromProduction = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: ReceiptFromProductionInitialState["pageParams"];
		navigate: any;
		reset: () => void;
	}
>("project/editReceiptFromProduction", async (payload, { dispatch }) => {
	const { id, data, params, navigate, reset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/production/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			reset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Receipt From Production Updated Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getReceiptFromProduction(params));
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

export const useReceiptFromProductionAction = () => {
	const dispatch = useAppDispatch();

	return {
		reducer: {
			setSelectedData(payload: ReceiptFromProduction) {
				return dispatch(setSelectedData(payload));
			},
		},
		extraReducer: {},
	};
};
