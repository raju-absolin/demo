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
	Authorization,
	AuthorizationInitialState,
	ScreenAuthorization,
	ScreenAuthorizationPayload,
} from "./authorization.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";
import { IconButton } from "@mui/material";
import { LuX } from "react-icons/lu";
import { enqueueSnackbar, closeSnackbar } from "notistack";

export const getAuthorizations = createAsyncThunk<
	{
		response: {
			results: Authorization[];
			count: number;
		};
		params: AuthorizationInitialState["pageParams"];
	},
	AuthorizationInitialState["pageParams"]
>("/getAuthorizations", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			"/users/authorization_defnitions/",
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
export const getScreenAuthorizations = createAsyncThunk<
	{
		response: {
			results: ScreenAuthorization[];
			count: number;
		};
		params: AuthorizationInitialState["formRowsParams"];
	},
	AuthorizationInitialState["formRowsParams"]
>("/getScreenAuthorizations", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/users/authorizations/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getScreenAuthorizationById = createAsyncThunk<
	{
		response: ScreenAuthorization;
	},
	{ id: string }
>("/getScreenAuthorizationById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/users/authorizations/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const getAuthorizationById = createAsyncThunk<
	{
		response: Authorization;
	},
	{ id: string }
>("/getAuthorizationById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/users/authorization_defnitions/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postAuthorizationData = createAsyncThunk<
	{ name: string },
	{
		obj: ApiPayload;
		hide: () => void;
		pageParams: AuthorizationInitialState["pageParams"];
	}
>("/postAuthorizationData", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(
			`/users/authorization_defnitions/create/`,
			payload?.obj
		);
		if (response.status >= 200 && response.status < 300) {
			// Swal.fire({
			// 	title: `<p style="font-size:20px">Authorization Added Successfully</p>`,
			// 	icon: "success",
			// 	confirmButtonText: `Close`,
			// 	confirmButtonColor: "#3085d6",
			// });
			dispatch(getAuthorizations(payload?.pageParams));
			payload?.hide();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postScreenAuthorizationData = createAsyncThunk<
	ScreenAuthorization,
	{
		obj: ScreenAuthorizationPayload;
		hide: () => void;
		pageParams: AuthorizationInitialState["formRowsParams"];
	}
>("/postScreenAuthorizationData", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(
			`/users/authorizations/create/`,
			payload?.obj
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Authorization Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getScreenAuthorizations(payload?.pageParams));
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

export const editAuthorizationDataById = createAsyncThunk<
	any,
	{
		obj: ApiPayload;
		hide: () => void;
		pageParams: AuthorizationInitialState["pageParams"];
	}
>("/editAuthorizationDataById", async (payload, { dispatch }) => {
	try {
		const response = await postEdit(
			`/users/authorization_defnitions/${payload?.obj?.id}`,
			{
				...payload?.obj,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Authorization updated Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getAuthorizations(payload?.pageParams));
			payload?.hide();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const editScreenAuthorizationDataById = createAsyncThunk<
	ScreenAuthorization,
	{
		obj: ScreenAuthorizationPayload;
		hide: () => void;
		pageParams: AuthorizationInitialState["formRowsParams"];
	}
>("/editScreenAuthorizationDataById", async (payload, { dispatch }) => {
	try {
		const response = await postEdit(
			`/users/authorizations/${payload?.obj?.id}/`,
			{
				...payload?.obj,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Authorization updated Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getScreenAuthorizations(payload?.pageParams));
			payload?.hide();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const deleteAuthorization = createAsyncThunk<
	void,
	{
		id: string;
		pageParams: AuthorizationInitialState["pageParams"];
	}
>("/deleteAuthorization", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(
			"/users/authorization_defnitions/" + payload.id
		);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Authorization deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getAuthorizations(payload.pageParams));
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
export const deleteScreenAuthorization = createAsyncThunk<
	void,
	{
		id: string;
		pageParams: AuthorizationInitialState["formRowsParams"];
	}
>("/deleteScreenAuthorization", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(
			"/users/authorizations/" + payload.id + "/"
		);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Authorization deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getScreenAuthorizations(payload.pageParams));
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

export const getAuthorizationHistory = createAsyncThunk<
	{
		response: {
			results: any;
			count: number;
		};
		params: AuthorizationInitialState["authorizationHistoryParams"];
	},
	{
		model_path: string;
		instance_id: string | number;
		params: AuthorizationInitialState["authorizationHistoryParams"];
	}
>("/getAuthorizationHistory", async (payload) => {
	var params = addParams(payload.params);
	const { model_path, instance_id } = payload;
	try {
		const response = await getParamsList(
			`/users/authorization_history/${model_path}/${instance_id}/`,
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

export const postAuthorizationApprovals = createAsyncThunk<
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
		pageParams: AuthorizationInitialState["authorizationHistoryParams"];
	}
>("/postAuthorizationApprovals", async (payload, { dispatch }) => {
	const { app_label, model_name } = payload;
	try {
		const response = await postAdd(
			`/users/authorization/${app_label}/${model_name}/`,
			payload?.obj
		);
		if (response.status >= 200 && response.status < 300) {
			const status_name = response?.data?.authorized_status_name;
			enqueueSnackbar(`${status_name} Successfullly`, {
				variant: "success",
			});
			const modalPath = `${app_label}.${model_name}`;
			dispatch(
				getAuthorizationHistory({
					model_path: modalPath,
					instance_id: payload?.obj?.instance_id,
					params: payload?.pageParams,
				})
			);
			dispatch(
				postCheckAuthorization({
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
export const postCheckAuthorization = createAsyncThunk<
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
>("/postCheckAuthorization", async (payload, { dispatch }) => {
	const { app_label, model_name, instance_id } = payload;
	try {
		const response = await postAdd(
			`/users/check_authorization/${app_label}/${model_name}/${instance_id}/`,
			payload?.obj
		);
		if (response.status >= 200 && response.status < 300) {
			if (response.data) {
				// enqueueSnackbar("You Are Authorized To Approve Or Reject", {
				// 	variant: "success",
				// });
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
		// enqueueSnackbar(`${formattedErrResult || error.message}`, {
		// 	variant: "error",
		// });
		throw error.message;
	}
});
