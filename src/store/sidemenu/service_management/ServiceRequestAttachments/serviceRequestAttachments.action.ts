import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig, PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
	postFormData,
} from "@src/helpers/Helper";
import Swal from "sweetalert2";
import {
	ServiceRequestAttachment,
	ApiPayload,
	ServiceRequestAttachmentsState,
} from "./serviceRequestAttachments.types";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getServiceRequestAttachments = createAsyncThunk<
	{
		response: {
			results: ServiceRequestAttachment[];
			count: number;
		};
		params: PageParamsTypes;
	},
	ServiceRequestAttachmentsState["pageParams"]
>("serviceRequest/getServiceRequestAttachments", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList(
			"/servicerequest/servicerequestattachments/",
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

export const getServiceRequestAttachmentById = createAsyncThunk<
	{
		response: ServiceRequestAttachment;
	},
	{ id: string }
>("serviceRequest/getServiceRequestAttachmentById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(
			`/servicerequest/servicerequestattachments/${id}/`
		);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postServiceRequestAttachmentData = createAsyncThunk<
	any,
	{
		data: ApiPayload;
		params: PageParamsTypes;
	}
>(
	"serviceRequest/postServiceRequestAttachmentData",
	async (payload, { dispatch }) => {
		const { data, params } = payload;

		try {
			const response = await postFormData(
				`/servicerequest/servicerequestattachments/create/`,
				{
					...data,
				}
			);
			if (response.status >= 200 && response.status < 300) {
				dispatch(getServiceRequestAttachments(params));
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: `Attachment added successfully`,
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
	}
);

export const editServiceRequestAttachmentData = createAsyncThunk<
	any,
	{
		id: number | string;
		data: ApiPayload;
		params: PageParamsTypes;
		hide: () => void;
	}
>(
	"serviceRequest/editServiceRequestAttachmentData",
	async (payload, { dispatch }) => {
		const { id, data, params, hide } = payload;
		try {
			const response = await postEdit(
				`/servicerequest/servicerequestattachments/${id}/`,
				{
					...data,
				}
			);
			if (response.status >= 200 && response.status < 300) {
				hide();
				dispatch(getServiceRequestAttachments(params));
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: `Attachment edited successfully`,
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
	}
);

interface DeleteServiceRequestAttachmentPayload {
	id: string;
	params: ServiceRequestAttachmentsState["pageParams"];
}

export const deleteServiceRequestAttachment = createAsyncThunk<
	{
		response: ServiceRequestAttachment;
	},
	DeleteServiceRequestAttachmentPayload
>(
	"serviceRequest/deleteServiceRequestAttachment",
	async (payload, { dispatch }) => {
		const { id, params } = payload;
		try {
			Swal.fire({
				text: "Loading, please wait...",
				didOpen: () => {
					Swal.showLoading();
				},
				allowOutsideClick: false,
			});
			const response = await postDelete(
				`/servicerequest/servicerequestattachments/${id}/`
			);
			if (response) {
				dispatch(getServiceRequestAttachments(params));
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Deleted Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});

				return { response: response.data };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			throw error.message;
		}
	}
);
