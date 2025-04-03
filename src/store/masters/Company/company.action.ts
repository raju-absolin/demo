import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { Company, SubmitPayload } from "./company.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getCompany = createAsyncThunk<
	{
		response: {
			results: Company[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getCompany", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/d/Company/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getCompanyById = createAsyncThunk<
	{
		response: Company;
	},
	{ id?: string | number }
>("/getCompanyById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/d/Company/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addCompany = createAsyncThunk<
	{ name: string },
	{ formData: FormData }
>("/addCompany", async (payload: { formData: FormData }, { dispatch }) => {
	try {
		const response = await postAdd(`/d/Company/`, payload.formData);
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getCompany({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">Company Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
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
export const editCompany = createAsyncThunk<
	void,
	{ formData: FormData; id: string | undefined }
>(
	"/editCompany",
	async (
		payload: { formData: FormData; id: string | undefined },
		{ dispatch }
	) => {
		try {
			const response2 = await postEdit(
				`/d/Company/${payload.id}/`,
				payload.formData
			);
			if (response2.status == 200) {
				Swal.fire({
					title: `<p style="font-size:20px">Company Edited Successfully</p>`,
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(
					getCompany({
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
	}
);
export const deleteCompany = createAsyncThunk<
	void,
	{ id: string; clearDataFn: Function; navigate: Function }
>("/deleteCompany", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(`/d/Company/${payload.id}/`);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Company deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getCompany({
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
