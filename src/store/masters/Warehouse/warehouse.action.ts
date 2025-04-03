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
	Warehouse,
	WarehouseInitialState,
	SubmitPayload,
	apiPayload,
} from "./warehouse.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getWarehouses = createAsyncThunk<
	{
		response: {
			results: Warehouse[];
			count: number;
		};
		params: WarehouseInitialState["pageParams"];
	},
	WarehouseInitialState["pageParams"]
>("/getWarehouses", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/d/WareHouse/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getWarehousesById = createAsyncThunk<
	{
		response: Warehouse;
	},
	{ id: string }
>("/getWarehousesById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/d/WareHouse/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addWarehouses = createAsyncThunk<
	{ name: string },
	{
		obj: apiPayload;
		pageParams: WarehouseInitialState["pageParams"];
		clearDataFn: () => void;
	}
>("/addWarehouses", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/d/WareHouse/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(getWarehouses(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Warehouse Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
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
export const editWarehouses = createAsyncThunk<
	void,
	{
		obj: apiPayload;
		clearDataFn: () => void;
		pageParams: WarehouseInitialState["pageParams"];
	}
>("/editWarehouses", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			`/d/WareHouse/${payload.obj.id}/`,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(getWarehouses(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Warehouse Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
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

export const deleteWarehouses = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: () => void;
		pageParams: WarehouseInitialState["pageParams"];
	}
>("/deleteWarehouses", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(`/d/WareHouse/${payload.id}/`);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Warehouse Deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getWarehouses(payload.pageParams));
			payload.clearDataFn();
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
