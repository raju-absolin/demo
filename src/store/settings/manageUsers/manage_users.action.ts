import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import {
	ManageUserInitialState,
	User,
	UserFormData,
} from "./manage_users.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getUsers = createAsyncThunk<
	{
		response: {
			results: User[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("users/getUsers", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/users/list/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getUserById = createAsyncThunk<
	{
		response: User;
	},
	{ id: string }
>("users/getUserById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/users/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postMangeUsersData = createAsyncThunk<
	any,
	{
		data: {
			username: string;
			email: string;
			phone: string;
			first_name: string;
			last_name: string;
			// location_ids: any;
			group_ids: (string | number)[];
			gender: number | string;
			device_access: number | string;
		};
	}
>("users/postMangeUsersData", async (payload, { dispatch }) => {
	const {
		data,
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
		const response = await postAdd(`/users/create/`, { ...data });
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">User Added Successfully</p>`,
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

export const editMangeUsersDataById = createAsyncThunk<
	any,
	{
		id: number | string;
		data: {
			username: string;
			email: string;
			phone: string;
			first_name: string;
			last_name: string;
			// location_ids: any;
			group_ids: (string | number)[];
			gender: number | string;
			device_access: number | string;
		};
	}
>("users/editMangeUsersDataById", async (payload) => {
	const {
		id,
		data,
		//  userDetailsForm, handleAdd
	} = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/users/${id}`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">User updated Successfully</p>`,
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

export const userActive = createAsyncThunk<
	any,
	{ id: string; pageParams: any }
>("/userActive", async (payload, { dispatch }) => {
	const { id, pageParams } = payload;
	try {
		const response = await postAdd(`/users/useractive/${id}`, {});
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getUsers({
					...pageParams,
				})
			);
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
export const userInActive = createAsyncThunk<
	any,
	{ id: string; pageParams: any }
>("users/userInActive", async (payload, { dispatch }) => {
	const { id, pageParams } = payload;
	try {
		const response = await postAdd(`/users/userinactive/${id}`, {});
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getUsers({
					...pageParams,
				})
			);
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
export const updatePassword = createAsyncThunk<
	any,
	{ id: string; pageParams: any; obj: any }
>("users/updatePassword", async (payload, { dispatch }) => {
	const { id, pageParams } = payload;
	try {
		const response = await postEdit(
			`/users/updatepassword/${id}`,
			payload.obj
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Password updated Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getUsers({
					...pageParams,
				})
			);
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
export const getUserLoginList = createAsyncThunk<
	{
		response: {
			results: User[];
			count: number;
		};
		params: ManageUserInitialState["userLoginParams"];
	},
	{
		username: string;
		user_type: string;
		params: ManageUserInitialState["userLoginParams"];
	}
>("users/getUserLoginList", async (payload, { rejectWithValue }) => {
	const { username, user_type, params } = payload;
	try {
		const response = await getParamsList(
			`/users/devicelog/user/${username}/${user_type}`,
			params
		);

		if (
			response &&
			response.results &&
			typeof response.count === "number"
		) {
			return { response, params };
		} else {
			throw new Error("Invalid response structure");
		}
	} catch (error: any) {
		const errorMessage = error.response?.data
			? JSON.stringify(error.response.data)
			: error.message;
		return rejectWithValue(errorMessage);
	}
});

export const getUserDeviceList = createAsyncThunk<
	{
		response: {
			results: User[];
			count: number;
		};
		params: ManageUserInitialState["userLoginParams"];
	},
	{
		username?: string | null;
		user_type?: string | null;
		params: ManageUserInitialState["userLoginParams"];
	}
>("users/getUserDeviceList", async (payload, { rejectWithValue }) => {
	const { username, user_type, params } = payload;
	try {
		const response = await getParamsList(
			`/users/userdevices/user/${username}/${user_type}`,
			params
		);

		if (
			response &&
			response.results &&
			typeof response.count === "number"
		) {
			return { response, params };
		} else {
			throw new Error("Invalid response structure");
		}
	} catch (error: any) {
		const errorMessage = error.response?.data
			? JSON.stringify(error.response.data)
			: error.message;
		return rejectWithValue(errorMessage);
	}
});

export const getUserActivityList = createAsyncThunk<
	{
		response: {
			results: User[];
			count: number;
		};
		params: ManageUserInitialState["userLoginParams"];
	},
	{ id?: string; params: ManageUserInitialState["userLoginParams"] }
>("users/getUserActivityList", async (payload, { rejectWithValue }) => {
	const { id, params } = payload;
	try {
		const response = await getParamsList(
			`/system/activitylog/user/${payload.id}`,
			params
		);

		if (
			response &&
			response.results &&
			typeof response.count === "number"
		) {
			return { response, params };
		} else {
			throw new Error("Invalid response structure");
		}
	} catch (error: any) {
		const errorMessage = error.response?.data
			? JSON.stringify(error.response.data)
			: error.message;
		return rejectWithValue(errorMessage);
	}
});
export const getUserAuditList = createAsyncThunk<
	{
		response: {
			results: User[];
			count: number;
		};
		params: ManageUserInitialState["userAuditParams"];
	},
	ManageUserInitialState["userAuditParams"]
>("users/getUserAuditList", async (payload, { rejectWithValue }) => {
	try {
		const response = await getParamsList(`/system/auditlog/`, payload);

		if (
			response &&
			response.results &&
			typeof response.count === "number"
		) {
			return { response, params: payload };
		} else {
			throw new Error("Invalid response structure");
		}
	} catch (error: any) {
		const errorMessage = error.response?.data
			? JSON.stringify(error.response.data)
			: error.message;
		return rejectWithValue(errorMessage);
	}
});
