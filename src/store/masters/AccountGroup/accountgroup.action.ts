import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import { Accountgroup, SubmitPayload } from "./accountgroup.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import {
	getAccounts,
	getAccountsWithChildrenList,
} from "../Account/accounts.action";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getAccountgroup = createAsyncThunk<
	{
		response: {
			results: Accountgroup[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getAccountgroup", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/accountgroup/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getAccountgroupById = createAsyncThunk<
	{
		response: Accountgroup;
	},
	{ id: string }
>("/getAccountgroupById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/accountgroup/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addAccountgroup = createAsyncThunk<
	{ name: string },
	{ obj: SubmitPayload }
>("/addAccountgroup", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/accountgroup/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getAccountsWithChildrenList({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			dispatch(
				getAccounts({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">Group Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			// payload.clearDataFn();
			// payload.navigate("/pages/masters/accountgroup", {
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
export const editAccountgroup = createAsyncThunk<
	void,
	{ obj: any; clearDataFn: Function; navigate: Function; pageParams: any }
>("/editAccountgroup", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			"/masters/accountgroup/" + payload.obj.id,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(
				getAccountgroup({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">Accountgroup Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			payload.navigate("/pages/masters/accountgroup", {
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
