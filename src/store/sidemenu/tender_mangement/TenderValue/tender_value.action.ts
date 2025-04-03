import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig, PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import { TenderValueState, TenderValue } from "./tender_value.types";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import { formatErrorMessage } from "../../errorMsgFormat";

type GetItemsPayloadTypes = TenderValueState["pageParams"] & {
	from_date?: string;
	to_date?: string;
};

export const getTenderValue = createAsyncThunk<
	{
		response: {
			results: TenderValue[];
			count: number;
		};
		params: TenderValueState["pageParams"];
	},
	GetItemsPayloadTypes
>("getTenderValue", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/tenders/bidamounts/list/${params.tender}/`,
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

// export const getItemById = createAsyncThunk<
// 	{
// 		response: TenderValue;
// 	},
// 	{ id: string }
// >("tenderValue/getItemById", async (payload) => {
// 	const { id } = payload;
// 	try {
// 		const response = await getList(
// 			`/tenders/tenderitemmaster/${id}/`
// 		);
// 		if (response) {
// 			return { response: response.data };
// 		} else {
// 			throw new Error(response);
// 		}
// 	} catch (error: any) {
// 		throw error.message;
// 	}
// });

// export const postItemData = createAsyncThunk<
// 	any,
// 	{
// 		data: {
// 			name: string;
// 		};
// 		params: PageParamsTypes;
// 		hide: (value: boolean) => void;
// 	}
// >("tenderValue/postItemData", async (payload, { dispatch }) => {
// 	const { data, params, hide } = payload;
// 	try {
// 		const response = await postAdd(
// 			`/tenders/tenderitemmaster/create/`,
// 			{ ...data }
// 		);
// 		if (response.status >= 200 && response.status < 300) {
// 			hide(true);
// 			dispatch(getTenderValue(params));
// 			return response.data;
// 		} else {
// 			throw new Error(response.data);
// 		}
// 	} catch (error: any) {
//
// 		const errormessage = error.response.data
// 			? JSON.stringify(error.response.data)
// 			: error.message;
// 		Swal.fire({
// 			title: `<p style="font-size:20px">Error</p>`,
// 			text: `${errormessage}`,
// 			icon: "error",
// 			confirmButtonText: `Close`,
// 			confirmButtonColor: "#3085d6",
// 		});
// 		throw error.message;
// 	}
// });

export const postTenderValue = createAsyncThunk<
	any,
	{
		data: {
			amount: string;
		};
		params: PageParamsTypes;
		hide: (value: boolean) => void;
	}
>("users/postItemData", async (payload, { dispatch }) => {
	const { data, params, hide } = payload;
	try {
		const response = await postAdd(`/tenders/bidamounts/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide(true);
			dispatch(getTenderValue(params));
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

export const getTenderValueById = createAsyncThunk<
	{
		response: TenderValue;
	},
	{ id: string }
>("tenderValue/getTenderValueById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/tenders/bidamounts/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const editTenderValue = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: TenderValueState["pageParams"];
		// navigate: any;
		hide: (value: boolean) => void;
	}
>("tenderValue/editTenderValue", async (payload, { dispatch }) => {
	const { id, data, params, hide } = payload;
	try {
		const response = await postEdit(`/tenders/bidamounts/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide(true);
			// navigate(-1);
			dispatch(getTenderValue(params));
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
