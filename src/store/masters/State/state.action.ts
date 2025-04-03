import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { States, StatesInitialState, SubmitPayload } from "./state.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getStates = createAsyncThunk<
	{
		response: {
			results: States[];
			count: number;
		};
		params: StatesInitialState["pageParams"];
	},
	StatesInitialState["pageParams"]
>("/getStates", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/d/State/", params);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getStatesById = createAsyncThunk<
	{
		response: States;
	},
	{ id: string }
>("/getStatesById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/d/State/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addStates = createAsyncThunk<
	{ name: string },
	{
		obj: SubmitPayload;
		pageParams: any;
		clearDataFn: Function;
		navigate: Function;
	}
>("/addStates", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/d/State/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getStates({
					...payload.pageParams,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">State Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			payload.navigate("/pages/masters/states", {
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
export const editStates = createAsyncThunk<
	void,
	{
		obj: SubmitPayload;
		clearDataFn: Function;
		navigate: Function;
		pageParams: any;
	}
>("/editStates", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			`/d/State/${payload.obj.id}/`,
			payload.obj
		);
		// const response2 = await postEdit("/masters/states/" + payload.obj.id, payload.obj);
		if (response2.status == 200) {
			dispatch(
				getStates({
					...payload.pageParams,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">State Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			payload.navigate("/pages/masters/states", {
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
export const getStatesMini = createAsyncThunk<
	{
		response: {
			results: States[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getStatesMini", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/states/mini/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const deleteState = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: Function;
		navigate: Function;
		params: StatesInitialState["pageParams"];
	}
>("/deleteState", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(`/d/State/${payload.id}/`);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">State Deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getStates(payload?.params));
			payload.clearDataFn();
			// payload.navigate("/pages/masters/states");
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
