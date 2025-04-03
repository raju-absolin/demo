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
import {
	StockOutInitialState,
	StockOut,
	ItemAgainistBatch,
	StockOutApiPayload,
} from "./stock_out.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getStockOut = createAsyncThunk<
	{
		response: {
			results: StockOut[];
			count: number;
		};
		params: StockOutInitialState["pageParams"];
	},
	StockOutInitialState["pageParams"]
>("project/sto/getStockOut", async (payload) => {
	var params = addParams(payload);
	const { project } = payload;
	try {
		const response = await getParamsList(
			`/stocktransfer/stockout/list/`,
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

export const getStockOutById = createAsyncThunk<
	{
		response: StockOut;
	},
	{ id: string }
>("project/sto/getStockOutById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/stocktransfer/stockout/${id}/`);
		if (response) {
			Swal.close();
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		Swal.close();
		throw error.message;
	}
});

export const postStockOut = createAsyncThunk<
	any,
	{
		data: StockOutApiPayload;
		params: StockOutInitialState["pageParams"];
		callback: (response: StockOutInitialState["selectedData"]) => void;
	}
>("project/sto/postStockOut", async (payload, { dispatch }) => {
	const { data, params, callback } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/stocktransfer/stockout/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			callback(response.data);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Stock Transfer Out Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getStockOut(params));
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

export const editStockOut = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: StockOutInitialState["pageParams"];
		navigate: any;
		stReset: any;
	}
>("project/sto/editStockOut", async (payload, { dispatch }) => {
	const { id, data, params, navigate, stReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/stocktransfer/stockout/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			stReset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Stock Transfer Out Updated Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getStockOut(params));
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

export const getStockDetails = createAsyncThunk<
	{
		response: {
			quantity: string;
			warehouse: string;
			item: string;
			batch: string;
			project: string;
		};
	},
	{
		warehouse_id: string;
		item_id: string;
		project_id: string;
	}
>("project/sto/getStockDetails", async (payload) => {
	const { item_id, warehouse_id, project_id } = payload;
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/projectmanagement/stockwithoutbatch/${project_id}/${warehouse_id}/${item_id}/`,
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
export const getStockBatchDetails = createAsyncThunk<
	{
		response: {
			results: ItemAgainistBatch[];
			count: number;
		};
		params: StockOutInitialState["batchesAganistItem"]["miniParams"];
	},
	StockOutInitialState["batchesAganistItem"]["miniParams"]
>("project/sto/getStockBatchDetails", async (payload, { rejectWithValue }) => {
	const { item_id } = payload;
	const params = addParams(payload);
	try {
		const response = await getParamsList(
			`/projectmanagement/stockagainstbatch/${payload?.project_id}/${payload?.warehouse_id}/${payload?.item_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error("Unexpected response structure");
		}
	} catch (error: any) {
		return rejectWithValue(error?.message || "Failed to fetch data");
	}
});

export const stockOutCheckApproval = createAsyncThunk<
	any,
	{
		stocktransferout_id: string | number;
	}
>("project/stockOutCheckApproval", async (payload, { dispatch }) => {
	const { stocktransferout_id } = payload;
	try {
		const response = await postAdd(
			`/stocktransfer/checkapprove/stockout/`,
			{
				stocktransferout_id,
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

export const stockOutApproval = createAsyncThunk<
	any,
	{
		data: any;
	}
>("project/stockOutApproval", async (payload, { dispatch }) => {
	const { data } = payload;
	try {
		const response = await postAdd(
			`/stocktransfer/approve/stockout/`,
			data
		);
		if (response.status >= 200 && response.status < 300) {
			if (response.data.approved_status == 2) {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Stock Transfer Out Approved Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(getStockOutById({ id: data.stocktransferout_id }));
				return response.data;
			} else if (response.data.approved_status == 3) {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Stock Transfer Out Rejected Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(getStockOutById({ id: data.stocktransferout_id }));
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
