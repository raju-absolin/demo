import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig, PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
	postFormData,
} from "@src/helpers/Helper";
import Swal from "sweetalert2";
import {
	ServiceRequest_Comment,
	CommentPayload,
	ServiceRequestCommentsState,
} from "./serviceRequestComments.types";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getServiceRequestComments = createAsyncThunk<
	{
		response: {
			results: ServiceRequest_Comment[];
			count: number;
		};
		params: ServiceRequestCommentsState["comment_params"];
	},
	ServiceRequestCommentsState["comment_params"]
>("serviceRequest/getServiceRequestComments", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList(
			"/servicerequest/comments/",
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

interface PostServiceRequestCommentPayload {
	data: CommentPayload;
	params: ServiceRequestCommentsState["comment_params"];
	hide: () => void;
}

export const postServiceRequestComments = createAsyncThunk<
	ServiceRequest_Comment,
	PostServiceRequestCommentPayload
>(
	"serviceRequest/postServiceRequestComments",
	async (payload, { dispatch }) => {
		const { data, params, hide } = payload;
		try {
			const response = await postAdd(`/servicerequest/comments/create/`, {
				...data,
			});

			if (response.status >= 200 && response.status < 300) {
				dispatch(getServiceRequestComments(params));
				hide();
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
	}
);
