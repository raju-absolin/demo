import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { Vendors, SubmitPayload, VendorsInitialState } from "./vendors.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getVendors = createAsyncThunk<
	{
		response: {
			results: Vendors[];
			count: number;
		};
		params: VendorsInitialState["pageParams"];
	},
	VendorsInitialState["pageParams"]
>("/getVendors", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList("/masters/vendors/", params);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getVendorsById = createAsyncThunk<
	{
		response: Vendors;
	},
	{ id?: string }
>("/getVendorsById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/vendors/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addVendors = createAsyncThunk<
	{ name: string },
	{ obj: SubmitPayload }
>("/addVendors", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/vendors/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Vendors Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			// payload.clearDataFn();
			// payload.navigate("/pages/masters/vendors", {
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
export const editVendors = createAsyncThunk<void, { obj: SubmitPayload }>(
	"/editVendors",
	async (payload, { dispatch }) => {
		try {
			const response2 = await postEdit(
				"/masters/vendors/" + payload.obj.id,
				payload.obj
			);
			if (response2.status == 200) {
				Swal.fire({
					title: `<p style="font-size:20px">Vendors Edited Successfully</p>`,
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				// payload.clearDataFn();
				// payload.navigate("/pages/masters/vendors", {
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
export const deleteVendor = createAsyncThunk<
	void,
	{ id: string; clearDataFn: Function; navigate: Function, params: PageParamsTypes; }
>("/deleteVendor", async (payload, { dispatch }) => {
	try {
		const { params } = payload;
		const response2 = await postDelete("/masters/vendors/" + payload.id);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Vendor deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getVendors(params));
			payload.clearDataFn();
			// payload.navigate("/pages/masters/vendors");
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
