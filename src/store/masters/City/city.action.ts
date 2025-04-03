import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { City, SubmitPayload } from "./city.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getCities = createAsyncThunk<
	{
		response: {
			results: City[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getCities", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/d/City/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getCityById = createAsyncThunk<
	{
		response: City;
	},
	{ id: string }
>("/getCityById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/d/City/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addCity = createAsyncThunk<
	{ name: string },
	{
		obj: SubmitPayload;
		pageParams: any;
		clearDataFn: Function;
		navigate: Function;
	}
>("/addCity", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/d/City/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getCities({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">City Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			payload.navigate("/pages/masters/city", {
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
export const editCity = createAsyncThunk<
	void,
	{
		obj: SubmitPayload;
		clearDataFn: Function;
		navigate: Function;
		pageParams: any;
	}
>("/editCity", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			`/d/City/${payload.obj.id}/`,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(
				getCities({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">City Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			payload.navigate("/pages/masters/city", {
				replace: true,
			});
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

export const getCitiesMini = createAsyncThunk<
	{
		response: {
			results: City[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getCitiesMini", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/citys/mini/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const deleteCity = createAsyncThunk<
	void,
	{ id: string; clearDataFn: Function; navigate: Function }
>("/deleteCity", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(`/d/City/${payload.id}/`);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">City deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getCities({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			payload.clearDataFn();
			payload.navigate("/pages/masters/city");
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
