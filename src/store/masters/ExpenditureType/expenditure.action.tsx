import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { ExpenditureType, ExpenditureTypeInitialState, SubmitPayload } from "./expenditure.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getExpenditureType = createAsyncThunk<
	{
		response: {
			results: ExpenditureType[];
			count: number;
		};
		params: ExpenditureTypeInitialState["pageParams"];
	},
	ExpenditureTypeInitialState["pageParams"]
>("/getExpenditureType", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/expendituretype/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getExpenditureTypeById = createAsyncThunk<
	{
		response: ExpenditureType;
	},
	{ id: string }
>("/getExpenditureTypeById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/expendituretype/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addExpenditureType = createAsyncThunk<
	{ name: string },
	{
		obj: { name: string };
		pageParams: ExpenditureTypeInitialState["pageParams"];
		clearDataFn: () => void;
	}
>("/addExpenditureType", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/expendituretype/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(getExpenditureType(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Expenditure Type Added Successfully</p>`,
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
export const editExpenditureType = createAsyncThunk<
	void,
	{
		obj: { id: string; name: string };
		clearDataFn: () => void;
		pageParams: ExpenditureTypeInitialState["pageParams"];
	}
>("/editExpenditureType", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			"/masters/expendituretype/" + payload.obj.id,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(getExpenditureType(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Expenditure Type Edited Successfully</p>`,
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

export const deleteExpenditureType = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: () => void;
		pageParams: ExpenditureTypeInitialState["pageParams"];
	}
>("/deleteExpenditureType", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete("/masters/expendituretype/" + payload.id);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Expenditure Type deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getExpenditureType(payload.pageParams));
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
