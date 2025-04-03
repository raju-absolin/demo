import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { Make, SubmitPayload } from "./make.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getMake = createAsyncThunk<
	{
		response: {
			results: Make[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getMake", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList("/masters/make/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getMakeById = createAsyncThunk<
	{
		response: Make;
	},
	{ id: string }
>("/getMakeById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/make/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addMake = createAsyncThunk<
	{ name: string },
	{
		obj: { name: string };
		pageParams: any;
		clearDataFn: Function;
		navigate: Function;
	}
>("/addMake", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/make/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getMake({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">Make Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			payload.navigate("/pages/masters/make", {
				replace: true,
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
export const editMake = createAsyncThunk<
	void,
	{
		obj: { id: number; name: string };
		clearDataFn: Function;
		navigate: Function;
		pageParams: any;
	}
>("/editMake", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			"/masters/make/" + payload.obj.id,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(
				getMake({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">Make Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			payload.navigate("/pages/masters/make", {
				replace: true,
			});
		} else {
			throw new Error(response2 as any);
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
export const getMakesMini = createAsyncThunk<
	{
		response: {
			results: Make[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getMakesMini", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/makes/mini/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const deleteMake = createAsyncThunk<
	void,
	{ id: string; clearDataFn: Function; navigate: Function }
>("/deleteMake", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete("/masters/make/" + payload.id);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Make deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getMake({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			payload.clearDataFn();
			// payload.navigate("/pages/masters/make");
		} else {
			throw new Error(response2 as any);
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
