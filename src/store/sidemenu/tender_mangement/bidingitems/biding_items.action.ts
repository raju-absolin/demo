import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig, PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import { BidingItemsState, Item } from "./biding_items.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";

type GetItemsPayloadTypes = BidingItemsState["pageParams"] & {
	from_date?: string;
	to_date?: string;
};

export const getItems = createAsyncThunk<
	{
		response: {
			results: Item[];
			count: number;
		};
		params: PageParamsTypes;
	},
	GetItemsPayloadTypes
>("users/getItems", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList(
			"/tenders/tenderitemmaster/",
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getItemById = createAsyncThunk<
	{
		response: Item;
	},
	{ id: string }
>("users/getItemById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/tenders/tenderitemmaster/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postItemData = createAsyncThunk<
	any,
	{
		data: {
			name: string;
		};
		params: PageParamsTypes;
		hide: (value: boolean) => void;
	}
>("users/postItemData", async (payload, { dispatch }) => {
	const { data, params, hide } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/tenders/tenderitemmaster/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide(true);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Bid Item Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getItems(params));
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

export const editItemData = createAsyncThunk<
	any,
	{
		id: number | string;
		data: {
			name: string;
		};
		params: PageParamsTypes;
		hide: (value: boolean) => void;
	}
>("users/editItemData", async (payload, { dispatch }) => {
	const { id, data, params, hide } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/tenders/tenderitemmaster/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide(true);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Bid Item Edited Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getItems(params));
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
