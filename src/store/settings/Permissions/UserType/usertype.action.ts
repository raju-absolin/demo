import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { User, UserTypeInitialState } from "./usertype.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getUserTypes = createAsyncThunk<
	{
		response: {
			results: User[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getUserTypes", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/permissions/usertypes/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getUserTypeById = createAsyncThunk<
	{
		response: User;
	},
	{ id: string }
>("/getUserById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/permissions/usertypes/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postUserTypeData = createAsyncThunk<
	{ name: string },
	{
		obj: { name: string };
		pageParams: UserTypeInitialState["pageParams"];
	}
>("postUserTypeData", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/permissions/usertypes/`, payload?.obj);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">User Type Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getUserTypes(payload?.pageParams));
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const editUserTypeDataById = createAsyncThunk<
	any,
	{
		obj: {
			id: string;
			name: string;
		};
		pageParams: UserTypeInitialState["pageParams"];
	}
>("/editUserTypeDataById", async (payload, { dispatch }) => {
	try {
		const response = await postEdit(
			`/permissions/usertypes/${payload?.obj?.id}`,
			{
				...payload?.obj,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">User Type updated Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getUserTypes(payload?.pageParams));
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const deleteUserType = createAsyncThunk<
	void,
	{
		id: string;
		pageParams: UserTypeInitialState["pageParams"];
	}
>("/deleteUserType", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(
			"/permissions/usertypes/" + payload.id
		);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">User Type deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getUserTypes(payload.pageParams));
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
