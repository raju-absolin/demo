import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import {
	ApiPayload,
	AccountTypes,
	AccountTypesInitialState,
	SubmitPayload,
} from "./accountType.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";
import { get } from "sortablejs";

export const getAccountTypes = createAsyncThunk<
	{
		response: {
			results: AccountTypes[];
			count: number;
		};
		params: AccountTypesInitialState["pageParams"];
	},
	AccountTypesInitialState["pageParams"]
>("/getAccountTypes", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList("/d/AccountType/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getAccountTypesById = createAsyncThunk<
	{
		response: AccountTypes;
	},
	{ id: string }
>("/getAccountTypesById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/d/AccountType/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addAccountTypes = createAsyncThunk<
	{ name: string },
	{
		obj: ApiPayload;
		pageParams: AccountTypesInitialState["pageParams"];
		clearDataFn: () => void;
	}
>("/addAccountTypes", async (payload, { dispatch }) => {
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/d/AccountType/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getAccountTypes({
					...payload.pageParams,
				})
			);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Account Type Added Successfully</p>`,
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
export const editAccountTypes = createAsyncThunk<
	void,
	{
		obj: ApiPayload;
		clearDataFn: () => void;
		pageParams: AccountTypesInitialState["pageParams"];
	}
>("/editAccountTypes", async (payload, { dispatch }) => {
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response2 = await postEdit(
			`/d/AccountType/${payload.obj.id}/`,
			payload.obj
		);
		// const response2 = await postEdit("/masters/accountTypes/" + payload.obj.id, payload.obj);
		if (response2.status == 200) {
			dispatch(
				getAccountTypes({
					...payload.pageParams,
				})
			);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Account Type Edited Successfully</p>`,
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

export const deleteAccountType = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: () => void;
		navigate: () => void;
		pageParams: AccountTypesInitialState["pageParams"];
	}
>("/deleteAccountType", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(`/d/AccountType/${payload.id}/`);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Account Type deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getAccountTypes(payload.pageParams));
			payload.clearDataFn();
			payload.navigate();
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
