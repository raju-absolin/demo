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
	ClientLocation,
	ClientLocationInitialState,
	SubmitPayload,
} from "./cliantlocation.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getClientLocation = createAsyncThunk<
	{
		response: {
			results: ClientLocation[];
			count: number;
		};
		params: ClientLocationInitialState["pageParams"];
	},
	ClientLocationInitialState["pageParams"]
>("/getClientLocation", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			"/masters/clientlocation/",
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

export const getClientLocationById = createAsyncThunk<
	{
		response: ClientLocation;
	},
	{ id: string }
>("/getClientLocationById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/clientlocation/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addClientLocation = createAsyncThunk<
	{ name: string },
	{ obj: SubmitPayload; pageParams: ClientLocationInitialState["pageParams"] }
>("/addClientLocation", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/clientlocation/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(getClientLocation(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">ClientLocation Added Successfully</p>`,
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
export const editClientLocation = createAsyncThunk<
	void,
	{ obj: SubmitPayload; pageParams: ClientLocationInitialState["pageParams"] }
>("/editClientLocation", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			`/masters/clientlocation/${payload.obj.id}`,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(getClientLocation(payload.pageParams));
			Swal.fire({
				title: `<p style="font-size:20px">ClientLocation Edited Successfully</p>`,
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

export const deleteClientLocation = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: Function;
		navigate: Function;
		pageParams: ClientLocationInitialState["pageParams"];
	}
>("/deleteClientLocation", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(
			`/masters/clientlocation/${payload.id}`
		);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">ClientLocation deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getClientLocation(payload.pageParams));
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
