import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "../../../helpers/Helper";
import { enqueueSnackbar } from "notistack";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";
import {
	apiPayload,
	DataPermission,
	DataPermissionInitialState,
	ModelData,
} from "./dataPermissionTypes";
import { AxiosResponse } from "axios";
import { miniType } from "@src/store/mini/mini.Types";

export const getModalsList = createAsyncThunk<
	{
		response: {
			results: ModelData[];
			count: number;
		};
		params: DataPermissionInitialState["modelsParams"];
	},
	DataPermissionInitialState["modelsParams"]
>("/getModalsList", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/users/allcontenttypes/", params);

		console.log(response);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(formattedErrResult || "Unexpected Error Occured", {
			variant: "error",
		});
		throw error.message;
	}
});

export const postDataPermission = createAsyncThunk<
	DataPermission,
	{
		data: apiPayload;
		params: DataPermissionInitialState["dataPermissionsParams"];
		clearData: () => void;
	}
>("/postDataPermission", async (payload, { dispatch }) => {
	try {
		var dataParams = addParams(payload?.data);
		// if (!payload.id) {
		const response = await postAdd(
			"/users/datapermissions/create/",
			dataParams
		);
		if (response) {
			enqueueSnackbar("Data Permission Saved Successfully.!", {
				variant: "success",
			});
			payload.clearData();
			dispatch(getDataPermissions(payload?.params));
			return response.data;
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");

		enqueueSnackbar(
			formattedErrResult ||
				"Sorry! Unable To Save Data Permission. Please try again!",
			{
				variant: "error",
			}
		);

		throw error.message;
	}
});
export const editDataPermission = createAsyncThunk<
	DataPermission,
	{
		id: number;
		data: apiPayload;
		params: DataPermissionInitialState["dataPermissionsParams"];
		clearData: () => void;
	}
>("/editDataPermission", async (payload, { dispatch }) => {
	try {
		var dataParams = addParams(payload?.data);
		// if (!payload.id) {
		const response = await postEdit(
			`/users/update/datapermissions/${payload?.id}`,
			dataParams
		);
		if (response) {
			enqueueSnackbar("Data Permission Saved Successfully.!", {
				variant: "success",
			});
			payload.clearData();
			dispatch(getDataPermissions(payload?.params));
			return response.data;
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(
			formattedErrResult ||
				"Sorry! Unable To Save Data Permission. Please try again!",
			{
				variant: "error",
			}
		);
		throw error.message;
	}
});

export const getModelData = createAsyncThunk<
	{
		response: {
			results: miniType[];
			count: number;
		};
		params: DataPermissionInitialState["modelsParams"];
	},
	DataPermissionInitialState["modelsParams"]
>("/getModelData", async (payload) => {
	const { app_label, model } = payload;
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/users/masterapis/${app_label}/${model}/`,
			params
		);

		console.log(response);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(formattedErrResult || "Unexpected Error Occured", {
			variant: "error",
		});
		throw error.message;
	}
});

export const getDataPermissions = createAsyncThunk<
	{
		response: {
			results: DataPermission[];
			count: number;
		};
		params: DataPermissionInitialState["dataPermissionsParams"];
	},
	DataPermissionInitialState["dataPermissionsParams"]
>("/getDataPermissions", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/users/datapermissions/list/${payload?.model_path}/`,
			params
		);

		console.log(response);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(formattedErrResult || "Unexpected Error Occured", {
			variant: "error",
		});
		throw error.message;
	}
});

export const getExcludePermission = createAsyncThunk<
	Array<{ exclusions: DataPermissionInitialState["is_exclusion"] }>,
	{ group_id: string; model_path: string }
>("/getExcludePermission", async (payload) => {
	const { group_id, model_path } = payload;
	try {
		const response = await getList(
			`/users/groups/permissions/exclusions/${group_id}/${model_path}/`
		);

		console.log(response);
		if (response) {
			return response?.data;
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(formattedErrResult || "Unexpected Error Occured", {
			variant: "error",
		});
		throw error.message;
	}
});
export const postExcludePermission = createAsyncThunk<
	any,
	{
		group_id: string;
		model_path: string;
		exclusions: boolean;
	}
>("/postExcludePermission", async (payload, { dispatch }) => {
	try {
		const response = await postEdit(
			`/users/group_permissions/exclusions/update/`,
			payload
		);
		if (response) {
			dispatch(
				getExcludePermission({
					model_path: payload?.model_path,
					group_id: payload?.group_id,
				})
			);
			return response;
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(formattedErrResult || "Unexpected Error Occured", {
			variant: "error",
		});
		throw error.message;
	}
});
export const deleteDataPermission = createAsyncThunk<
	any,
	{
		id: number;
		params: DataPermissionInitialState["dataPermissionsParams"];
	}
>("/deleteDataPermission", async ({ id, params }, { dispatch }) => {
	try {
		const response = await postDelete(`/users/datapermissions/${id}`);
		if (response) {
			dispatch(getDataPermissions(params));
			return { response };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(formattedErrResult || "Unexpected Error Occured", {
			variant: "error",
		});
		throw error.message;
	}
});
