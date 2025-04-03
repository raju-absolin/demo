import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { VendorItem, SubmitPayload } from "./vendorItems.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getVendorItem = createAsyncThunk<
	{
		response: {
			results: VendorItem[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getVendorItem", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/vendoritems/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getVendorItemById = createAsyncThunk<
	{
		response: VendorItem;
	},
	{ id: string }
>("/getVendorItemById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/vendoritems/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addVendorItem = createAsyncThunk<
	VendorItem,
	{
		obj: { item_id: string; vendor_id: string };
		pageParams: any;
		clearDataFn: Function;
		navigate: Function;
	}
>("/addVendorItem", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/vendoritems/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getVendorItem({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">VendorItem Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			payload.navigate("/pages/masters/vendorItem", {
				replace: true,
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
export const editVendorItem = createAsyncThunk<
	VendorItem,
	{
		obj: { id: string; item_id: string; vendor_id: string };
		clearDataFn: Function;
		navigate: Function;
		pageParams: any;
	}
>("/editVendorItem", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			"/masters/vendoritems/" + payload.obj.id,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(
				getVendorItem({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">VendorItem Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			payload.navigate("/pages/masters/vendorItem", {
				replace: true,
			});
			return response2.data;
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
export const deleteVendorItem = createAsyncThunk<
	void,
	{ id: string; clearDataFn: Function; navigate: Function }
>("/deleteVendorItem", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(
			"/masters/vendoritems/" + payload.id
		);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">VendorItem deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getVendorItem({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			payload.clearDataFn();
			payload.navigate("/pages/masters/vendorItem");
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
