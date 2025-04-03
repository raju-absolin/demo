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
import { MaterialIssuesInitialState, MI } from "./mr_issues.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getMaterialIssues = createAsyncThunk<
	{
		response: {
			results: MI[];
			count: number;
		};
		params: MaterialIssuesInitialState["pageParams"];
	},
	MaterialIssuesInitialState["pageParams"]
>("project/mi/getMaterialIssues", async (payload) => {
	var params = addParams(payload);
	const { project_id } = payload;
	try {
		const response = await getParamsList(
			`/materialissue/list/${project_id}/`,
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

export const getMIById = createAsyncThunk<
	{
		response: MI;
	},
	{ id: string }
>("project/mi/getMIById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/materialissue/${id}/`);
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

export const getMRById = createAsyncThunk<
	{
		response: MI;
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

export const postMaterialIssues = createAsyncThunk<
	any,
	{
		data: any;
		params: MaterialIssuesInitialState["pageParams"];
		navigate: any;
		miReset: any;
	}
>("project/mi/postMaterialIssues", async (payload, { dispatch }) => {
	const { data, params, navigate, miReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/materialissue/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			miReset();
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Material Issue Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				navigate(-1);
			});
			dispatch(getMaterialIssues(params));
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

export const editMaterialIssues = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: MaterialIssuesInitialState["pageParams"];
		navigate: any;
		miReset: any;
	}
>("project/mi/editMaterialIssues", async (payload, { dispatch }) => {
	const { id, data, params, navigate, miReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/materialissue/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Material Issue Updated Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				navigate(-1);
			});
			miReset();
			Swal.close();
			dispatch(getMaterialIssues(params));
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
type StockDetailsResponse = {
	warehouse: string;
	item: string;
	batch: string;
	quantity: string;
	project: string;
};

type PageParams = {
	item_id: string;
	warehouse_id: string;
	project_id: string;
};

export const getStockDetails = createAsyncThunk<
	{ response: StockDetailsResponse },
	PageParams
>("project/mr_issue/getStockDetails", async (payload) => {
	const { item_id, warehouse_id, project_id } = payload;
	try {
		const response: any = await getParamsList(
			`/projectmanagement/stockwithoutbatch/${project_id}/${warehouse_id}/${item_id}/`,
			payload
		);
		if (response) {
			return { response };
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const MICheckApproval = createAsyncThunk<
	any,
	{
		material_issue_id: string | number;
	}
>("project/MICheckApproval", async (payload, { dispatch }) => {
	const { material_issue_id } = payload;
	try {
		const response = await postAdd(
			`/materialissue/materialissue/checkapprove/`,
			{
				material_issue_id,
			}
		);
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

export const materialIssueApproval = createAsyncThunk<
	any,
	{
		data: any; navigate: any
	}
>("project/materialIssueApproval", async (payload, { dispatch }) => {
	const { data, navigate } = payload;
	try {
		const response = await postAdd(
			`/materialissue/materialissue/approve/`,
			data
		);
		if (response.status >= 200 && response.status < 300) {
			dispatch(getMIById({ id: data.material_issue_id }));
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
export interface BatchAgainstItems {
	item: string;
	itemname: string;
	batch: string;
	batchname: string;
	quantity: string;
}
export const getBatchQuantity = createAsyncThunk<
	{
		response: {
			results: BatchAgainstItems[];
			count: number;
		};
		params: MaterialIssuesInitialState["batchPageParams"];
	},
	MaterialIssuesInitialState["batchPageParams"]
>("project/mr_issues/getBatchQuantity", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/projectmanagement/stockagainstbatch/${payload?.project_id}/${payload?.warehouse_id}/${payload?.item_id}/`,
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
