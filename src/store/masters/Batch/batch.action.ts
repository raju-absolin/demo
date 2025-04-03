import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { Batch, BatchsInitialState, SubmitPayload } from "./batch.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getBatchs = createAsyncThunk<
	{
		response: {
			results: Batch[];
			count: number;
		};
		params: BatchsInitialState["pageParams"];
	},
	BatchsInitialState["pageParams"]
>("/getBatchs", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/batch/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getBatchsById = createAsyncThunk<
	{
		response: Batch;
	},
	{ id: string }
>("/getBatchsById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/batch/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addBatchs = createAsyncThunk<
	{ name: string },
	{
		obj: { name: string };
		pageParams: BatchsInitialState["pageParams"];
		clearDataFn: () => void;
	}
>("/addBatchs", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/batch/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(getBatchs(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Batch Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, '<br>');
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
export const editBatchs = createAsyncThunk<
	void,
	{
		obj: { id: string; name: string };
		clearDataFn: () => void;
		pageParams: BatchsInitialState["pageParams"];
	}
>("/editBatchs", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			"/masters/batch/" + payload.obj.id,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(getBatchs(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Batch Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
		} else {
			throw new Error(response2 as any);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, '<br>');
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

export const deleteBatchs = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: () => void;
		pageParams: BatchsInitialState["pageParams"];
	}
>("/deleteBatchs", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete("/masters/batch/" + payload.id);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Batch deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getBatchs(payload.pageParams));
			payload.clearDataFn();
		} else {
			throw new Error(response2 as any);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, '<br>');
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
