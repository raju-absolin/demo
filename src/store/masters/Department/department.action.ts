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
	ApiPayload,
	Departments,
	DepartmentsInitialState,
	SubmitPayload,
} from "./departments.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";
import { get } from "sortablejs";

export const getDepartments = createAsyncThunk<
	{
		response: {
			results: Departments[];
			count: number;
		};
		params: DepartmentsInitialState["pageParams"];
	},
	DepartmentsInitialState["pageParams"]
>("/getDepartments", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList("/d/Department/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getDepartmentsById = createAsyncThunk<
	{
		response: Departments;
	},
	{ id: string }
>("/getDepartmentsById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/d/Department/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addDepartments = createAsyncThunk<
	{ name: string },
	{
		obj: ApiPayload;
		pageParams: DepartmentsInitialState["pageParams"];
		clearDataFn: () => void;
	}
>("/addDepartments", async (payload, { dispatch }) => {
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/d/Department/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getDepartments({
					...payload.pageParams,
				})
			);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Department Added Successfully</p>`,
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
export const editDepartments = createAsyncThunk<
	void,
	{
		obj: ApiPayload;
		clearDataFn: () => void;
		pageParams: DepartmentsInitialState["pageParams"];
	}
>("/editDepartments", async (payload, { dispatch }) => {
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response2 = await postEdit(
			`/d/Department/${payload.obj.id}/`,
			payload.obj
		);
		// const response2 = await postEdit("/masters/departments/" + payload.obj.id, payload.obj);
		if (response2.status == 200) {
			dispatch(
				getDepartments({
					...payload.pageParams,
				})
			);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Department Edited Successfully</p>`,
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

export const deleteDepartment = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: () => void;
		navigate: () => void;
		pageParams: DepartmentsInitialState["pageParams"];
	}
>("/deleteDepartment", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(`/d/Department/${payload.id}/`);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Department deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getDepartments(payload.pageParams));
			payload.clearDataFn();
			payload.navigate();
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
