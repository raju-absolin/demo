import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import { CommentsInitialState, Comment } from "./commets.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getComments = createAsyncThunk<
	{
		response: {
			results: Comment[];
			count: number;
		};
		params: PageParamsTypes;
	},
	CommentsInitialState["pageParams"]
>("tenders/getComments", async (payload) => {
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

export const getCommentById = createAsyncThunk<
	{
		response: Comment;
	},
	{ id: string }
>("tenders/getCommentById", async (payload) => {
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

export const postComment = createAsyncThunk<
	any,
	{
		data: any;
		params: PageParamsTypes;
		hide: () => void;
	}
>("tenders/postComment", async (payload, { dispatch }) => {
	const { data, params, hide } = payload;
	try {
		const response = await postAdd(`/tenders/comments/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getComments(params));
			// Swal.fire({
			// 	title: `<p style="font-size:20px">Success</p>`,
			// 	text: `Comment added successfully`,
			// 	icon: "success",
			// 	confirmButtonText: `Close`,
			// 	confirmButtonColor: "#3085d6",
			// });
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

export const editComment = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: PageParamsTypes;
		hide: () => void;
	}
>("tenders/editComment", async (payload, { dispatch }) => {
	const { id, data, params, hide } = payload;
	try {
		const response = await postEdit(`/tenders/comments/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getComments(params));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: `Comment edited successfully`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
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
