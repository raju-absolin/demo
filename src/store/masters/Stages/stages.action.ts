import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { Stage, StagesInitialState, SubmitPayload } from "./stages.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getStages = createAsyncThunk<
	{
		response: {
			results: Stage[];
			count: number;
		};
		params: StagesInitialState["pageParams"];
	},
	StagesInitialState["pageParams"]
>("/getStages", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/stage/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getStagesById = createAsyncThunk<
	{
		response: Stage;
	},
	{ id: string }
>("/getStagesById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/stage/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addStages = createAsyncThunk<
	{ name: string },
	{
		obj: { name: string };
		pageParams: StagesInitialState["pageParams"];
		clearDataFn: () => void;
	}
>("/addStages", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/stage/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(getStages(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Stage Added Successfully</p>`,
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
export const editStages = createAsyncThunk<
	void,
	{
		obj: { id: string; name: string };
		clearDataFn: () => void;
		pageParams: StagesInitialState["pageParams"];
	}
>("/editStages", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			"/masters/stage/" + payload.obj.id,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(getStages(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Stage Edited Successfully</p>`,
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

export const deleteStages = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: () => void;
		pageParams: StagesInitialState["pageParams"];
	}
>("/deleteStages", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete("/masters/stage/" + payload.id);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Stage deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getStages(payload.pageParams));
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
