import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig, PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import { BudgetQuotationCommentState, Comment } from "./bq_comments.types";
import Swal from "sweetalert2";
import { Item } from "../../tender_mangement/bidingitems/biding_items.types";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getComments = createAsyncThunk<
	{
		response: {
			results: Comment[];
			count: number;
		};
		params: BudgetQuotationCommentState["pageParams"];
	},
	BudgetQuotationCommentState["pageParams"]
>("bq_comments/getComments", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList("/leads/comments/", params);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getCommentById = createAsyncThunk<
	{
		response: Comment;
	},
	{ id: string }
>("bq_comments/getCommentById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/leads/comments/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postCommentData = createAsyncThunk<
	any,
	{
		data: {
			lead_id: string;
			comment: string;
		};
		params: BudgetQuotationCommentState["pageParams"];
		hide: () => void;
	}
>("bq_comments/postCommentData", async (payload, { dispatch }) => {
	const { data, params, hide } = payload;
	try {
		const response = await postAdd(`/leads/comments/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getComments(params));
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

export const editCommentData = createAsyncThunk<
	any,
	{
		id: number | string;
		data: Item;
		params: BudgetQuotationCommentState["pageParams"];
		resetCommentForm: any;
		navigate: any;
	}
>("bq_comments/editCommentData", async (payload, { dispatch }) => {
	const { id, data, params, resetCommentForm, navigate } = payload;
	try {
		const response = await postEdit(`/leads/comments/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			resetCommentForm();
			navigate(-1);
			dispatch(getComments(params));
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
