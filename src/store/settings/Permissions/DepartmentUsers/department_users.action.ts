import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import {
	ApiPayload,
	DepartmentUser,
	DepartmentUsersInitialState,
} from "./department_users.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getDepartmentUsers = createAsyncThunk<
	{
		response: {
			results: DepartmentUser[];
			count: number;
		};
		params: DepartmentUsersInitialState["pageParams"];
	},
	DepartmentUsersInitialState["pageParams"]
>("/getDepartmentUsers", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/users/userdepartments/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getDepartmentUserById = createAsyncThunk<
	{
		response: DepartmentUser;
	},
	{ id: string }
>("/getDepartmentUserById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/users/userdepartments/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postMangeDepartmentUsersData = createAsyncThunk<
	DepartmentUser,
	{
		data: ApiPayload;
		params: DepartmentUsersInitialState["pageParams"];
		close: () => void;
	}
>("/postMangeDepartmentUsersData", async (payload, { dispatch }) => {
	const {
		data,
		params,
		close,
		//  handleAdd, userDetailsForm
	} = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/users/userdepartments/`, { ...data });
		if (response.status >= 200 && response.status < 300) {
			close();
			Swal.fire({
				title: `<p style="font-size:20px">DepartmentUser Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getDepartmentUsers(params));
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

export const editMangeDepartmentUsersDataById = createAsyncThunk<
	any,
	{
		id: number | string;
		data: ApiPayload;
		params: DepartmentUsersInitialState["pageParams"];
		close: () => void;
	}
>("/editMangeDepartmentUsersDataById", async (payload, { dispatch }) => {
	const {
		id,
		data,
		//  userDetailsForm, handleAdd
		params,
		close,
	} = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/users/userdepartments/${id}`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			close();
			Swal.fire({
				title: `<p style="font-size:20px">DepartmentUser updated Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getDepartmentUsers(params));
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

interface DeleteDepartmentUser {
	id: string;
	params: DepartmentUsersInitialState["pageParams"];
	clearDataFn: () => void;
}

export const deleteDepartmentUser = createAsyncThunk<
	{
		response: DepartmentUser;
	},
	DeleteDepartmentUser
>("/deleteDepartmentUser", async (payload, { dispatch }) => {
	const { id, params, clearDataFn } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postDelete(`/users/userdepartments/${id}`);
		if (response) {
			dispatch(getDepartmentUsers(params));
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Deleted Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			clearDataFn();
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});
