import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import { TenderItemMasterInitialState, TenderItem } from "./tenderItems.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getTenderItems = createAsyncThunk<
	{
		response: {
			results: TenderItem[];
			count: number;
		};
		params: PageParamsTypes;
	},
	TenderItemMasterInitialState["pageParams"]
>("tenderItem/getTenderItems", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/tenders/comments/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getTenderItemById = createAsyncThunk<
	{
		response: TenderItem;
	},
	{ id: string }
>("tenderItem/getTenderItemById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/tenders/comments/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postTenderItem = createAsyncThunk<
	any,
	{
		data: any;
		params: PageParamsTypes;
		hide: () => void;
	}
>("tenderItem/postTenderItem", async (payload, { dispatch }) => {
	const { data, params, hide } = payload;
	try {
		const response = await postAdd(`/tenders/comments/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getTenderItems(params));
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

export const editTenderItem = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: PageParamsTypes;
		hide: () => void;
	}
>("tenderItem/editTenderItem", async (payload, { dispatch }) => {
	const { id, data, params, hide } = payload;
	try {
		const response = await postEdit(`/tenders/comments/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getTenderItems(params));
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
