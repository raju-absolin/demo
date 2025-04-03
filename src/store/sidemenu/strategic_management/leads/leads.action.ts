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
import { LeadsState, Lead, ApiLeadPayload } from "./leads.types";
import Swal from "sweetalert2";
import { Item } from "../../tender_mangement/bidingitems/biding_items.types";
import { FileType } from "@src/components";
import { formatErrorMessage } from "../../errorMsgFormat";

type GetLeadsPayloadTypes = LeadsState["pageParams"] & {
	from_date?: string;
	to_date?: string;
};

export const getLeads = createAsyncThunk<
	{
		response: {
			results: Lead[];
			count: number;
		};
		params: PageParamsTypes;
	},
	GetLeadsPayloadTypes
>("leads/getLeads", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList("/leads/leads/", params);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getLeadById = createAsyncThunk<
	{
		response: Lead;
	},
	{ id: string }
>("leads/getLeadById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/leads/lead/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postLeadData = createAsyncThunk<
	any,
	{
		data: ApiLeadPayload;
		params: PageParamsTypes;
		resetLeadForm: any;
		navigate: any;
		documents: FileType[];
	}
>("leads/postLeadData", async (payload, { dispatch }) => {
	const { data, params, resetLeadForm, navigate, documents } = payload;
	try {
		const response = await postAdd(`/leads/leadcreate/`, {
			...data,
		});
		documents &&
			documents.forEach(async (file: any) => {
				file?.id && file?.dodelete
					? dispatch(deleteLeadDocuments({ id: file.id }))
					: file.originalObj &&
						(await postFormData(`/leads/leaddocuments/create/`, {
							lead_id: response.data.id,
							file: file.originalObj,
						}));
			});
		if (response.status >= 200 && response.status < 300) {
			resetLeadForm();
			navigate(-1);
			dispatch(getLeads(params));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: `Lead created successfully`,
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

export const editLeadData = createAsyncThunk<
	any,
	{
		id: number | string;
		data: ApiLeadPayload;
		params: PageParamsTypes;
		resetLeadForm: any;
		navigate: any;
		documents: FileType[];
	}
>("leads/editLeadData", async (payload, { dispatch }) => {
	const { id, data, params, resetLeadForm, navigate, documents } = payload;
	try {
		const response = await postEdit(`/leads/lead/${id}/`, {
			...data,
		});
		documents &&
			documents.forEach(async (file: FileType) => {
				file?.id && file?.dodelete
					? dispatch(deleteLeadDocuments({ id: file.id }))
					: file.originalObj &&
						(await postFormData(`/leads/leaddocuments/create/`, {
							lead_id: response.data.id,
							file: file.originalObj,
						}));
			});
		if (response.status >= 200 && response.status < 300) {
			resetLeadForm();
			navigate(-1);
			dispatch(getLeads(params));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: `Lead edited successfully`,
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
export const postLeadDocuments = createAsyncThunk<
	any,
	{
		file: File;
	}
>("/postLeadDocuments", async (payload) => {
	const { file } = payload;
	try {
		const response = await postFormData(`/leads/leaddocuments/create/`, {
			file: file,
		});
		return { response: response.data };
	} catch (err) {
		throw err;
	}
});
export const deleteLeadDocuments = createAsyncThunk<
	any,
	{
		id: string;
	}
>("/deleteLeadDocuments", async (payload) => {
	const { id } = payload;
	try {
		const response = await postDelete(`/leads/leaddocuments/${id}/`);
		return { response: response.data };
	} catch (err) {
		throw err;
	}
});

export const getVendorsByItems = createAsyncThunk<
	any,
	{
		data: string[];
		params: any;
	}
>("lead/getVendorsByItems", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/vendorsbyproducts/`, {
			...payload,
		});
		if (response.status >= 200 && response.status < 300) {
			return { response: response.data, params: payload };
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
export const ApproveLead = createAsyncThunk<
	any,
	{
		id: any;
		data: {
			status: string | number;
		};
		params?: PageParamsTypes;
	}
>("lead/ApproveLead", async (payload, { dispatch }) => {
	const { id, data, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postEdit(`/leads/leadapprove/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			if (params) {
				dispatch(getLeads(params));
			} else {
				dispatch(getLeadById({ id }));
			}
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Lead Approved",
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
export const RejectLead = createAsyncThunk<
	any,
	{
		id: any;
		data: {
			status: string | number;
		};
		params?: PageParamsTypes;
	}
>("lead/RejectLead", async (payload, { dispatch }) => {
	const { id, data, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postEdit(`/leads/leadapprove/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			if (params) {
				dispatch(getLeads(params));
			} else {
				dispatch(getLeadById({ id }));
			}
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Lead Rejected",
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

export const ChangeLeadAssignees = createAsyncThunk<
	any,
	{
		id: string;
		data: {
			assignees_ids: string[];
		};
		params?: PageParamsTypes;
		closeModal: () => void;
	}
>("lead/ChangeLeadAssignees", async (payload, { dispatch }) => {
	const { id, data, params, closeModal } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postEdit(`/leads/leadassign/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			if (params) {
				dispatch(getLeads(params));
			} else {
				dispatch(getLeadById({ id }));
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
