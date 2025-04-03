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
import { IssueToProductionInitialState, IssueToProduction } from "./ITP.types";
import Swal from "sweetalert2";
import { useAppDispatch } from "@src/store/store";
import { setSelectedData } from "./ITP.slice";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getIssueToProduction = createAsyncThunk<
	{
		response: {
			results: IssueToProduction[];
			count: number;
		};
		params: IssueToProductionInitialState["pageParams"];
	},
	IssueToProductionInitialState["pageParams"]
>("project/ITP/getIssueToProduction", async (payload) => {
	var params = addParams(payload);
	const { project } = payload;
	try {
		const response = await getParamsList(
			`/production/issuetoproduction/list/${project}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error?.message);
	}
});

export const getIssueToProductionById = createAsyncThunk<
	{
		response: IssueToProduction;
	},
	{ id: string }
>("project/ITP/getIssueToProductionById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/production/issuetoproduction/${id}/`);
		if (response) {
			Swal.close();
			return { response: response.data };
		} else {
			throw new Error(response);
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

export const postIssueToProduction = createAsyncThunk<
	any,
	{
		data: any;
		params: IssueToProductionInitialState["pageParams"];
		navigate: any;
		reset: () => void;
	}
>("project/ITP/postIssueToProduction", async (payload, { dispatch }) => {
	const { data, params, navigate, reset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(
			`/production/issuetoproduction/create/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			reset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Issue To Production Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getIssueToProduction(params));
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

export const editIssueToProduction = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: IssueToProductionInitialState["pageParams"];
		navigate: any;
		reset: () => void;
	}
>("project/ITP/editIssueToProduction", async (payload, { dispatch }) => {
	const { id, data, params, navigate, reset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(
			`/production/issuetoproduction/${id}/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			reset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Issue To Production Updated Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getIssueToProduction(params));
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

export const useIssueToProductionAction = () => {
	const dispatch = useAppDispatch();

	return {
		reducer: {
			setSelectedData(payload: IssueToProduction) {
				return dispatch(setSelectedData(payload));
			},
		},
		extraReducer: {},
	};
};
type PageParams = {
	item_id: string;
	warehouse_id: string;
	project_id: string;
};
export const getStockDetails = createAsyncThunk<
	{
		response: {
			warehouse: string;
			item: string;
			batch: string;
			quantity: string;
			project: string;
		};
	},
	PageParams
>("project/getStockDetails", async (payload) => {
	var params = addParams(payload);
	const { item_id, warehouse_id, project_id } = payload;
	try {
		const response: any = await getParamsList(
			`/projectmanagement/stockwithoutbatch/${project_id}/${warehouse_id}/${item_id}/`,
			{ project: project_id }
		);
		if (response) {
			return { response }; // Return in the expected format
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const issueToProductionCheckApproval = createAsyncThunk<
	any,
	{
		issue_toproduction_id: string | number;
	}
>("project/issueToProductionCheckApproval", async (payload, { dispatch }) => {
	const { issue_toproduction_id } = payload;
	try {
		const response = await postAdd(
			`/production/checkapprove/issuetoproduction/`,
			{
				issue_toproduction_id,
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

export const issueToProductionApproval = createAsyncThunk<
	any,
	{
		data: any;
	}
>("project/issueToProductionApproval", async (payload, { dispatch }) => {
	const { data } = payload;
	try {
		const response = await postAdd(
			`/production/approve/issuetoproduction/`,
			data
		);
		if (response.status >= 200 && response.status < 300) {
			if (response.data.approved_status == 2) {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Issue To ProductionApproved Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(
					getIssueToProductionById({ id: data.issue_toproduction_id })
				);
				return response.data;
			} else if (response.data.approved_status == 3) {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Issue To Production Rejected Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(
					getIssueToProductionById({ id: data.issue_toproduction_id })
				);
				return response.data;
			}
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
		params: IssueToProductionInitialState["batchPageParams"];
	},
	IssueToProductionInitialState["batchPageParams"]
>("project/ITP/getBatchQuantity", async (payload) => {
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
		throw new Error(error?.message);
	}
});
