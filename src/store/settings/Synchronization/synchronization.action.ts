import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	getList,
	getParamsList,
	addParams,
	postEdit,
} from "@src/helpers/Helper";
import Swal from "sweetalert2";
import { syncList, syncLogList } from "./synchronization.types";

const delay = (ms: number | undefined) =>
	new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

async function checkStatus(payload: any) {
	const { dispatch } = payload;
	let timeout;
	timeout = await delay(3000);
	dispatch(syncStatus(payload));
}
export const startSync = createAsyncThunk<
	any,
	{
		id: number;
		label: string;
		name: string;
		requestUrl: string;
		statusUrl: string;
	}
>("/startSync", async (payload, { dispatch }) => {
	const { label, name, requestUrl, statusUrl } = payload;
	try {
		const response = await getList(requestUrl);
		if (response) {
			dispatch(syncStatus(payload));
			return response.data;
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		Swal.fire({
			title: `<p style="font-size:20px">Sorry! Getting from server side issue!</p>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		return error.message;
	}
});

export const syncStatus = createAsyncThunk<
	any,
	{
		label: string;
		name: string;
		requestUrl: string;
		statusUrl: string;
	}
>("/syncStatus", async (payload, { dispatch }) => {
	const { label, name, requestUrl, statusUrl } = payload;
	try {
		const response = await getList(statusUrl);
		if (!response.data.status) {
			Swal.fire({
				title: "Success",
				text: `${label} Synchronization Completed`,
				icon: "success",
				confirmButtonColor: "#3085d6",
				// confirmButtonText: "Cool",
			});
			return { loading: false };
		} else {
			checkStatus({ ...payload, dispatch });
			return { loading: true };
		}
	} catch (error: any) {
		Swal.fire({
			title: "Error",
			text: "Error while synchronizing data",
			icon: "error",
			confirmButtonColor: "#3085d6",
			// confirmButtonText: "Cool",
		});
		return error.message;
	}
});

export const getSyncList = createAsyncThunk<
	{
		response: {
			results: syncList[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number; sync_from: number }
>("getSyncList", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			"/thirdparty/sync_trigger/list/",
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

export const getSyncLogList = createAsyncThunk<
	{
		response: {
			results: syncLogList[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ sync_trigger?: string }
>("getSyncLogList", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			"/thirdparty/sync_log/list/",
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

export const getSyncSettings = createAsyncThunk(
	"/getSyncSettings",
	async (payload) => {
		try {
			const response = await getList(
				"/system/globalvariables/sync/jsondata/"
			);
			if (response?.data) {
				return response?.data;
			} else {
				throw new Error(response as any);
			}
		} catch (error: any) {
			Swal.fire({
				title: `<p style="font-size:20px">Sorry! Getting from server side issue!</p>`,
				icon: "error",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			return error.message;
		}
	}
);

export const syncSettingsAdd = createAsyncThunk<any, {}>(
	"/syncSettingsAdd",
	async (payload) => {
		try {
			const response = await postEdit(
				"/system/globalvariables/sync/jsondata/",
				payload
			);
			if (response?.status === 200) {
				Swal.fire({
					title: `<p style="font-size:20px">Your Sync Settings Updated Successfully.!</p>`,
					icon: "error",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			} else {
				Swal.fire({
					title: `<p style="font-size:20px">Sorry! Unable to Updated Focus Settings. Please try again!</p>`,
					icon: "error",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				throw new Error(response as any);
			}
		} catch (error: any) {
			Swal.fire({
				title: `<p style="font-size:20px">Sorry! Getting from server side issue!</p>`,
				icon: "error",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			return error.message;
		}
	}
);
