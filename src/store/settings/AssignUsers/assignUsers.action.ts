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
	AssigneUser,
	AssigneUserInitialState,
	ScreenAssigneUser,
	ScreenAssigneUserPayload,
} from "./assignUsers.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";
import { IconButton } from "@mui/material";
import { LuX } from "react-icons/lu";
import { enqueueSnackbar, closeSnackbar } from "notistack";

export const getAssigneUsers = createAsyncThunk<
	{
		response: {
			results: AssigneUser[];
			count: number;
		};
		params: AssigneUserInitialState["pageParams"];
	},
	AssigneUserInitialState["pageParams"]
>("/getAssigneUsers", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			"/users/assignee_defnitions/",
			params
		);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const getScreenAssigneUsers = createAsyncThunk<
	{
		response: {
			results: ScreenAssigneUser[];
			count: number;
		};
		params: AssigneUserInitialState["formRowsParams"];
	},
	AssigneUserInitialState["formRowsParams"]
>("/getScreenAssigneUsers", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/users/assignees/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getScreenAssigneUserById = createAsyncThunk<
	{
		response: ScreenAssigneUser;
	},
	{ id: string }
>("/getScreenAssigneUserById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/users/assignees/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const getAssigneUserById = createAsyncThunk<
	{
		response: AssigneUser;
	},
	{ id: string }
>("/getAssigneUserById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/users/assignee_defnitions/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postAssigneUserData = createAsyncThunk<
	{ name: string },
	{
		obj: ApiPayload;
		hide: () => void;
		pageParams: AssigneUserInitialState["pageParams"];
	}
>("/postAssigneUserData", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(
			`/users/assignee_defnitions/create/`,
			payload?.obj
		);
		if (response.status >= 200 && response.status < 300) {
			// Swal.fire({
			// 	title: `<p style="font-size:20px">Assign User Added Successfully</p>`,
			// 	icon: "success",
			// 	confirmButtonText: `Close`,
			// 	confirmButtonColor: "#3085d6",
			// });
			dispatch(getAssigneUsers(payload?.pageParams));
			payload?.hide();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postScreenAssigneUserData = createAsyncThunk<
	ScreenAssigneUser,
	{
		obj: ScreenAssigneUserPayload;
		hide: () => void;
		pageParams: AssigneUserInitialState["formRowsParams"];
	}
>("/postScreenAssigneUserData", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(
			`/users/assignees/create/`,
			payload?.obj
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Assign User Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getScreenAssigneUsers(payload?.pageParams));
			payload?.hide();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			text: `${formattedErrResult || error.message}`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});

export const editAssigneUserDataById = createAsyncThunk<
	any,
	{
		obj: ApiPayload;
		hide: () => void;
		pageParams: AssigneUserInitialState["pageParams"];
	}
>("/editAssigneUserDataById", async (payload, { dispatch }) => {
	try {
		const response = await postEdit(
			`/users/assignee_defnitions/${payload?.obj?.id}`,
			{
				...payload?.obj,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Assign User updated Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getAssigneUsers(payload?.pageParams));
			payload?.hide();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const editScreenAssigneUserDataById = createAsyncThunk<
	ScreenAssigneUser,
	{
		obj: ScreenAssigneUserPayload;
		hide: () => void;
		pageParams: AssigneUserInitialState["formRowsParams"];
	}
>("/editScreenAssigneUserDataById", async (payload, { dispatch }) => {
	try {
		const response = await postEdit(
			`/users/assignees/${payload?.obj?.id}/`,
			{
				...payload?.obj,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Assign User updated Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getScreenAssigneUsers(payload?.pageParams));
			payload?.hide();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const deleteAssigneUser = createAsyncThunk<
	void,
	{
		id: string;
		pageParams: AssigneUserInitialState["pageParams"];
	}
>("/deleteAssigneUser", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(
			"/users/assignee_defnitions/" + payload.id
		);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Assign User deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getAssigneUsers(payload.pageParams));
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
export const deleteScreenAssigneUser = createAsyncThunk<
	void,
	{
		id: string | number;
		pageParams: AssigneUserInitialState["formRowsParams"];
	}
>("/deleteScreenAssigneUser", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(
			"/users/assignees/" + payload.id + "/"
		);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Assigned User deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getScreenAssigneUsers(payload.pageParams));
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

export const getAssigneUserHistory = createAsyncThunk<
	{
		response: {
			results: any;
			count: number;
		};
		params: AssigneUserInitialState["assigneUserHistoryParams"];
	},
	{
		model_path: string;
		instance_id: string | number;
		params: AssigneUserInitialState["assigneUserHistoryParams"];
	}
>("/getAssigneUserHistory", async (payload) => {
	var params = addParams(payload.params);
	const { model_path, instance_id } = payload;
	try {
		const response = await getParamsList(
			`/users/assigneUser_history/${model_path}/${instance_id}/`,
			params
		);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const postAssigneUserApprovals = createAsyncThunk<
	any,
	{
		app_label: string;
		model_name: string;
		obj: {
			instance_id: string;
			authorized_status: number;
			description?: string;
		};
		callback: () => void;
		pageParams: AssigneUserInitialState["assigneUserHistoryParams"];
	}
>("/postAssigneUserApprovals", async (payload, { dispatch }) => {
	const { app_label, model_name } = payload;
	try {
		const response = await postAdd(
			`/users/assigneUser/${app_label}/${model_name}/`,
			payload?.obj
		);
		if (response.status >= 200 && response.status < 300) {
			const status_name = response?.data?.authorized_status_name;
			enqueueSnackbar(`${status_name} Successfullly`, {
				variant: "success",
			});
			const modalPath = `${app_label}.${model_name}`;
			dispatch(
				getAssigneUserHistory({
					model_path: modalPath,
					instance_id: payload?.obj?.instance_id,
					params: payload?.pageParams,
				})
			);
			dispatch(
				postCheckAssigneUser({
					app_label: app_label,
					model_name: model_name,
					instance_id: payload?.obj?.instance_id,
					obj: payload?.obj,
					callback: payload?.callback,
				})
			);
			payload?.callback();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(`${formattedErrResult || error.message}`, {
			variant: "error",
		});
		throw error.message;
	}
});
export const postCheckAssigneUser = createAsyncThunk<
	any,
	{
		app_label: string;
		model_name: string;
		instance_id: string | number;
		obj: {
			instance_id: string | number;
		};
		callback: () => void;
	}
>("/postCheckAssigneUser", async (payload, { dispatch }) => {
	const { app_label, model_name, instance_id } = payload;
	try {
		const response = await postAdd(
			`/users/check_assigneUser/${app_label}/${model_name}/${instance_id}/`,
			payload?.obj
		);
		if (response.status >= 200 && response.status < 300) {
			if (response.data) {
				enqueueSnackbar("You Are Authorized To Approve Or Reject", {
					variant: "success",
				});
				payload?.callback();
				return response.data;
			} else {
				throw new Error("Not authorised");
			}
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(`${formattedErrResult || error.message}`, {
			variant: "error",
		});
		throw error.message;
	}
});
