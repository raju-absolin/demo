import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { Approval, ApprovalInitialState } from "./approval.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getApprovals = createAsyncThunk<
	{
		response: {
			results: Approval[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getApprovals", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/permissions/approvals/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getApprovalById = createAsyncThunk<
	{
		response: Approval;
	},
	{ id: string }
>("/getUserById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/permissions/approvals/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postApprovalData = createAsyncThunk<
	{ name: string },
	{
		obj: any;
		hide:any;
		pageParams: ApprovalInitialState["pageParams"];
	}
>("postApprovalData", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/permissions/approvals/`, payload?.obj);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Approval Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getApprovals(payload?.pageParams));
			payload?.hide();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const editApprovalDataById = createAsyncThunk<
	any,
	{
		obj: any;
		hide:any;
		pageParams: ApprovalInitialState["pageParams"];
	}
>("/editApprovalDataById", async (payload, { dispatch }) => {
	try {
		const response = await postEdit(
			`/permissions/approvals/${payload?.obj?.id}`,
			{
				...payload?.obj,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Approval updated Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getApprovals(payload?.pageParams));
			payload?.hide();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const deleteApproval = createAsyncThunk<
	void,
	{
		id: string;
		pageParams: ApprovalInitialState["pageParams"];
	}
>("/deleteApproval", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(
			"/permissions/approvals/" + payload.id
		);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Approval deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getApprovals(payload.pageParams));
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
