import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { Assignee, AssigneeInitialState } from "./assignee.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getAssignees = createAsyncThunk<
	{
		response: {
			results: Assignee[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getAssignees", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/permissions/assignees/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getAssigneeById = createAsyncThunk<
	{
		response: Assignee;
	},
	{ id: string }
>("/getUserById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/permissions/assignees/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postAssigneeData = createAsyncThunk<
	{ name: string },
	{
		obj: any;
		pageParams: AssigneeInitialState["pageParams"];
	}
>("postAssigneeData", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/permissions/assignees/`, payload?.obj);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Assignee Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getAssignees(payload?.pageParams));
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const editAssigneeDataById = createAsyncThunk<
	any,
	{
		obj: any;
		pageParams: AssigneeInitialState["pageParams"];
	}
>("/editAssigneeDataById", async (payload, { dispatch }) => {
	try {
		const response = await postEdit(
			`/permissions/assignees/${payload?.obj?.id}`,
			{
				...payload?.obj,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Assignee updated Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getAssignees(payload?.pageParams));
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const deleteAssignee = createAsyncThunk<
	void,
	{
		id: string;
		pageParams: AssigneeInitialState["pageParams"];
	}
>("/deleteAssignee", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(
			"/permissions/assignees/" + payload.id
		);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Assignee deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getAssignees(payload.pageParams));
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
