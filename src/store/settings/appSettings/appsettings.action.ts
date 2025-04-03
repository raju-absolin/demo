import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import { AppSettingsInitialState, SettingsData } from "./appSettings.types";
import Swal from "sweetalert2";

export const getAppSettings = createAsyncThunk<{
	response: SettingsData;
}>("/getAppSettings", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/system/dynamicsettings/", {});
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const appSettingsAdd = createAsyncThunk<
	any,
	{
		data: {};
	}
>("appSettingsAdd", async (payload, { dispatch }) => {
	const { data } = payload;
	try {
		const response = await postAdd(`/system/dynamicsettings/`, payload);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Data Updated Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});

			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});
