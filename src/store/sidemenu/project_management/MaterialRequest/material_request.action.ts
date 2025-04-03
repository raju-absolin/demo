import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	patchImg,
	postAdd,
	postEdit,
	postFormData,
} from "@src/helpers/Helper";
import { MaterialRequestInitialState, Mr } from "./material_request.types";
import Swal from "sweetalert2";
import { seralizeParams } from "@src/store/mini/mini.Action";
import { formatErrorMessage } from "../../errorMsgFormat";
import { fetchNotificationList } from "@src/store/notifications/notification.actions";

export const getMaterialRequest = createAsyncThunk<
	{
		response: {
			results: Mr[];
			count: number;
		};
		params: MaterialRequestInitialState["pageParams"];
	},
	MaterialRequestInitialState["pageParams"]
>("project/mr/getMaterialRequest", async (payload) => {
	var params = addParams(payload);
	const { project_id } = payload;
	try {
		const response = await getParamsList(
			`/materialrequest/materialrequests/list/${project_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		console.error(error);
		throw new Error(error?.message);
	}
});

export const getMRById = createAsyncThunk<
	{
		response: Mr;
	},
	{ id: string }
>("project/mr/getMRById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(
			`/materialrequest/materialrequests/${id}/`
		);
		if (response) {
			Swal.close();
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postMaterialRequest = createAsyncThunk<
	any,
	{
		data: any;
		params: MaterialRequestInitialState["pageParams"];
		navigate: any;
		mrReset: any;
	}
>("project/mr/postMaterialRequest", async (payload, { dispatch }) => {
	const { data, params, navigate, mrReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(
			`/materialrequest/materialrequests/create/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			mrReset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Material Request Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getMaterialRequest(params));
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

export const editMaterialRequest = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: MaterialRequestInitialState["pageParams"];
		navigate?: any;
		mrReset: any;
		clearDataFun: () => void;
	}
>("project/mr/editMaterialRequest", async (payload, { dispatch }) => {
	const { id, data, params, navigate, mrReset, clearDataFun } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(
			`/materialrequest/materialrequests/update/${id}/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			mrReset();
			Swal.close();
			clearDataFun();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Material Request Edited Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			navigate(-1);
			// dispatch(getMaterialRequest(params));
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
export const getMakeByitemId = createAsyncThunk(
	"/getMakeByitemId",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				`/masters/makes/list/${params.product__id}/`,
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);
export const MRCheckApproval = createAsyncThunk<
	any,
	{
		material_request_id: string | number;
	}
>("project/mr/MRCheckApproval", async (payload, { dispatch }) => {
	const { material_request_id } = payload;
	try {
		const response = await postAdd(`/materialrequest/checkapprove/`, {
			material_request_id,
		});
		if (response.status >= 200 && response.status < 300) {
			Swal.close();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const materialRequestApproval = createAsyncThunk<
	any,
	{
		data: any;
		callback: () => void;
	}
>("project/mr/materialRequestApproval", async (payload, { dispatch }) => {
	const { data, callback } = payload;
	try {
		const response = await postAdd(`/materialrequest/approve/`, data);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Material Request Approved Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			callback();
			dispatch(getMRById({ id: data.material_request_id }));
			dispatch(
				fetchNotificationList({
					page: 1,
					page_size: 10,
					search: "",
					no_of_pages: 0,
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

export const updateMaterialRequestStatus = createAsyncThunk<
	any,
	{
		id: string;
		data: any;
		params: MaterialRequestInitialState["pageParams"];
	}
>("project/mr/updateMaterialRequestStatus", async (payload, { dispatch }) => {
	const { id, data, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(
			`/materialrequest/statuschange/materialrequest/${id}/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Material Request Closed Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getMRById({ id: id }));
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
