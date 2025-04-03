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
	Location,
	LocationInitialState,
	SubmitPayload,
} from "./location.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getLocation = createAsyncThunk<
	{
		response: {
			results: Location[];
			count: number;
		};
		params: LocationInitialState["pageParams"];
	},
	LocationInitialState["pageParams"]
>("/getLocation", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/d/Location/", params);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getLocationById = createAsyncThunk<
	{
		response: Location;
	},
	{ id: string }
>("/getLocationById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/d/Location/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addLocation = createAsyncThunk<
	{ name: string },
	{ obj: SubmitPayload; pageParams: LocationInitialState["pageParams"] }
>("/addLocation", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/d/Location/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(getLocation(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Location Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			// payload.clearDataFn();
			// payload.navigate("/pages/masters/location", {
			//     replace: true,
			// });
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
export const editLocation = createAsyncThunk<
	void,
	{ obj: SubmitPayload; pageParams: LocationInitialState["pageParams"] }
>("/editLocation", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			`/d/Location/${payload.obj.id}/`,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(getLocation(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">Location Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
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
export const getLocationsMini = createAsyncThunk<
	{
		response: {
			results: Location[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getLocationsMini", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			"/masters/locations/mini/",
			params
		);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const deleteLocation = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: Function;
		navigate: Function;
		pageParams: LocationInitialState["pageParams"];
	}
>("/deleteLocation", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(`/d/Location/${payload.id}/`);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Location deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getLocation(payload.pageParams));
			payload.clearDataFn();
			// payload.navigate("/pages/masters/locations");
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
