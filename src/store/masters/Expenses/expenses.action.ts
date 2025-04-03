import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { Expenses, ExpensesInitialState, SubmitPayload } from "./expenses.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getExpenses = createAsyncThunk<
	{
		response: {
			results: Expenses[];
			count: number;
		};
		params: ExpensesInitialState["pageParams"];
	},
	ExpensesInitialState["pageParams"]
>("/getExpenses", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/expances/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getExpensesById = createAsyncThunk<
	{
		response: Expenses;
	},
	{ id: string }
>("/getExpensesById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/expances/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addExpenses = createAsyncThunk<
	{ name: string },
	{
		obj: { name: string };
		pageParams: ExpensesInitialState["pageParams"];
		clearDataFn: () => void;
	}
>("/addExpenses", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/expances/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(getExpenses(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Expenses Added Successfully</p>`,
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
export const editExpenses = createAsyncThunk<
	void,
	{
		obj: { id: string; name: string };
		clearDataFn: () => void;
		pageParams: ExpensesInitialState["pageParams"];
	}
>("/editExpenses", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			"/masters/expances/" + payload.obj.id,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(getExpenses(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Expenses Edited Successfully</p>`,
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

export const deleteExpenses = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: () => void;
		pageParams: ExpensesInitialState["pageParams"];
	}
>("/deleteExpenses", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete("/masters/expances/" + payload.id);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Expenses deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getExpenses(payload.pageParams));
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
