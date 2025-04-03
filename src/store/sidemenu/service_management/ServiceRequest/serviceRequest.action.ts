import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig, PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
	postFormData,
} from "@src/helpers/Helper";
import { ServiceRequestState, ServiceRequest } from "./serviceRequest.types";
import Swal from "sweetalert2";
import { ApiPayload } from "./serviceRequest.types";
import { formatErrorMessage } from "../../errorMsgFormat";

type GetServiceRequestsPayloadTypes = ServiceRequestState["pageParams"] & {
	from_date?: string;
	to_date?: string;
};

export const getServiceRequests = createAsyncThunk<
	{
		response: {
			results: ServiceRequest[];
			count: number;
		};
		params: PageParamsTypes;
	},
	GetServiceRequestsPayloadTypes
>("serviceRequest/getServiceRequests", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			"/servicerequest/servicerequest/list/",
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

export const getServiceRequestById = createAsyncThunk<
	{
		response: ServiceRequest;
	},
	{ id: string }
>("serviceRequest/getServiceRequestById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/servicerequest/servicerequest/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postServiceRequestData = createAsyncThunk<
	any,
	{
		data: ApiPayload;
		params: PageParamsTypes;
		hide: () => void;
		document?: File[];
	}
>("serviceRequest/postServiceRequestData", async (payload, { dispatch }) => {
	const { data, params, hide, document } = payload;
	try {
		const response = await postAdd(
			`/servicerequest/servicerequest/create/`,
			{
				...data,
			}
		);
		document &&
			document.forEach(async (file) => {
				await postFormData(
					`servicerequest/servicerequestattachments/create/`,
					{
						service_request_id: response.data.id,
						file: file,
					}
				);
			});
		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getServiceRequests(params));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: `Service Request created successfully`,
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
		const formattedErrResult = errResult.replace(/\n/g, '<br>');
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

export const editServiceRequestData = createAsyncThunk<
	any,
	{
		id: number | string;
		data: ApiPayload;
		params: PageParamsTypes;
		hide: () => void;
		document?: File[];
	}
>("serviceRequest/editServiceRequestData", async (payload, { dispatch }) => {
	const { id, data, params, hide, document } = payload;
	try {
		const response = await postEdit(
			`/servicerequest/servicerequest/${id}/`,
			{
				...data,
			}
		);
		document &&
			document.forEach(async (file) => {
				await postFormData(
					`/servicerequest/servicerequestattachments/create/`,
					{
						service_request_id: id,
						file: file,
					}
				);
			});
		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getServiceRequests(params));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: `Service Request edited successfully`,
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
		const formattedErrResult = errResult.replace(/\n/g, '<br>');
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

export const ChangeServiceRequestStatus = createAsyncThunk<
	any,
	{
		id: any;
		data: {
			status: number;
			remarks: string;
		};
		params?: PageParamsTypes;
		closeModal: () => void;
	}
>(
	"serviceRequest/ChangeServiceRequestStatus",
	async (payload, { dispatch }) => {
		const { id, data, params, closeModal } = payload;
		try {
			Swal.fire({
				text: "Loading, please wait...",
				didOpen: () => {
					Swal.showLoading();
				},
				allowOutsideClick: false,
			});
			const response: any = await postEdit(
				`/servicerequest/servicerequest/approve/${id}/`,
				{
					...data,
				}
			);
			if (response.status >= 200 && response.status < 300) {
				if (params) {
					dispatch(getServiceRequests(params));
				} else {
					dispatch(getServiceRequestById({ id }));
				}
				closeModal();
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Service Request Status Changed Successfully",
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
			const formattedErrResult = errResult.replace(/\n/g, '<br>');
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
export const ChangeServiceRequestAssignee = createAsyncThunk<
	any,
	{
		id: any;
		data: {
			user_ids: string[];
		};
		params?: PageParamsTypes;
		closeModal: () => void;
	}
>(
	"serviceRequest/ChangeServiceRequestAssignee",
	async (payload, { dispatch }) => {
		const { id, data, params, closeModal } = payload;
		try {
			Swal.fire({
				text: "Loading, please wait...",
				didOpen: () => {
					Swal.showLoading();
				},
				allowOutsideClick: false,
			});
			const response: any = await postEdit(
				`/servicerequest/servicerequest/assign/${id}/`,
				{
					...data,
				}
			);
			if (response.status >= 200 && response.status < 300) {
				if (params) {
					dispatch(getServiceRequests(params));
				} else {
					dispatch(getServiceRequestById({ id }));
				}
				closeModal();
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Users Assigned Successfully",
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
			const formattedErrResult = errResult.replace(/\n/g, '<br>');
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
