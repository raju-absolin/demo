import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { InspectionAgencies, SubmitPayload } from "./inspection_agencies.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getInspectionAgencies = createAsyncThunk<
	{
		response: {
			results: InspectionAgencies[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getInspectionAgencies", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			"/masters/inspectionagencies/",
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

export const getInspectionAgenciesById = createAsyncThunk<
	{
		response: InspectionAgencies;
	},
	{ id?: string }
>("/getInspectionAgenciesById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/inspectionagencies/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addInspectionAgencies = createAsyncThunk<
	any,
	{ obj: SubmitPayload }
>("/addInspectionAgencies", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(
			`/masters/inspectionagencies/`,
			payload.obj
		);
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getInspectionAgencies({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">Inspection Agency Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			// payload.clearDataFn();
			// payload.navigate("/pages/masters/company", {
			//     replace: true,
			// });
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, '<br>');
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

export const editInspectionAgencies = createAsyncThunk<
	void,
	{ obj: SubmitPayload }
>("/editInspectionAgencies", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			`/masters/inspectionagencies/${payload.obj.id}/`,
			payload.obj
		);
		if (response2.status == 200) {
			Swal.fire({
				title: `<p style="font-size:20px">Inspection Agency Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getInspectionAgencies({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			// payload.clearDataFn();
			// payload.navigate("/pages/masters/company", {
			//     replace: true,
			// });
		} else {
			throw new Error(response2 as any);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, '<br>');
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
export const deleteInspectionAgencies = createAsyncThunk<
	void,
	{ id: string; clearDataFn: Function; navigate: Function }
>("/deleteInspectionAgencies", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(
			`/masters/inspectionagencies/${payload.id}/`
		);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Inspection Agency deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getInspectionAgencies({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			payload.clearDataFn();
			// payload.navigate("/pages/masters/company");
		} else {
			throw new Error(response2 as any);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, '<br>');
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
