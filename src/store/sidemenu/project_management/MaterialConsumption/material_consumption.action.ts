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
	MaterialConsumptionInitialState,
	MaterialConsumption,
} from "./material_consumption.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getMaterialConsumption = createAsyncThunk<
	{
		response: {
			results: MaterialConsumption[];
			count: number;
		};
		params: MaterialConsumptionInitialState["pageParams"];
	},
	MaterialConsumptionInitialState["pageParams"]
>("project/mc/getMaterialConsumption", async (payload) => {
	var params = addParams(payload);
	const { project_id } = payload;
	try {
		const response = await getParamsList(
			`/materialconsumption/list/${project_id}/`,
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

export const getMaterialConsumptionById = createAsyncThunk<
	{
		response: MaterialConsumption;
	},
	{ id: string }
>("project/mc/getMaterialConsumptionById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/materialconsumption/${id}/`);
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

export const postMaterialConsumption = createAsyncThunk<
	any,
	{
		data: any;
		params: MaterialConsumptionInitialState["pageParams"];
		navigate: any;
		mcReset: any;
	}
>("project/mc/postMaterialConsumption", async (payload, { dispatch }) => {
	const { data, params, navigate, mcReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/materialconsumption/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			mcReset();
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Material Consumption Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				navigate(-1);
			});
			dispatch(getMaterialConsumption(params));
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

export const editMaterialConsumption = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: MaterialConsumptionInitialState["pageParams"];
		navigate: any;
		mcReset: any;
	}
>("project/mc/editMaterialConsumption", async (payload, { dispatch }) => {
	const { id, data, params, navigate, mcReset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/materialconsumption/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			mcReset();
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Material Consumption Updated Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				navigate(-1);
			});
			dispatch(getMaterialConsumption(params));
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
>("project/mr_consumption/getStockDetails", async (payload) => {
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
		params: MaterialConsumptionInitialState["batchPageParams"];
	},
	MaterialConsumptionInitialState["batchPageParams"]
>("project/mr_consumption/getBatchQuantity", async (payload) => {
	var params = addParams(payload);
	const { item_id } = payload;
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