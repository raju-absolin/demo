import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	patchImg,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { GroupSubmitPayload, Accounts, SubmitPayload } from "./accounts.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getAccounts = createAsyncThunk<
	{
		response: {
			results: Accounts[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ parent?: string; search?: string; page: number; page_size: number }
>("/getAccounts", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/accounts/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const getAccountsList = createAsyncThunk<
	{
		response: {
			results: Accounts[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ parent?: string; search?: string; page: number; page_size: number }
>("/getAccountsList", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/mini/accounts/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const getGroups = createAsyncThunk<
	{
		response: {
			results: Accounts[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getGroups", async (payload) => {
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
export const getAccountsById = createAsyncThunk<
	{
		response: Accounts;
	},
	{ id?: string | number }
>("/getAccountsById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/accounts/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addAccounts = createAsyncThunk<
	{ name: string },
	{ obj: SubmitPayload; image: any; clearData: () => void }
>("/addAccounts", async (payload, { dispatch }) => {
	const { image } = payload;
	try {
		const response = await postAdd(`/masters/accounts/`, payload.obj);
		image &&
			(await patchImg(
				`/masters/accounts/${response?.data ? response?.data?.id : ""}`,
				{
					image: image,
				}
			));

		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Account Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getAccounts({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			payload.clearData();
			// payload.navigate("/pages/masters/account", {
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
export const editAccounts = createAsyncThunk<
	void,
	{ obj: SubmitPayload; id: string; image: any; clearData: () => void }
>("/editAccounts", async (payload, { dispatch }) => {
	const { image } = payload;
	try {
		const response2 = await postEdit(
			"/masters/accounts/" + payload.id,
			payload.obj
		);
		image &&
			(await patchImg(`/masters/accounts/${payload.id}`, {
				image: image,
			}));
		if (response2.status == 200) {
			dispatch(
				getAccounts({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">Account Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearData();
			// payload.navigate("/pages/masters/account", {
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
});

export const addGroups = createAsyncThunk<
	{ name: string },
	{ obj: GroupSubmitPayload }
>("/addGroups", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/accountgroup/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getGroups({
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
			// payload.navigate("/pages/masters/accounts", {
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

export const getAccountsByIdBreadcrumb = createAsyncThunk<
	{
		response: Accounts;
	},
	{ id?: string | number }
>("/getAccountsByIdBreadcrumb", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/accounts/${id}/breadcrumb/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const getAccountsWithChildrenList = createAsyncThunk<
	{
		response: {
			results: Accounts[];
			count: number;
		};
		params: PageParamsTypes;
		parentIds?: Array<any>;
	},
	{
		parentIds?: Array<any>;
		parent?: string;
		search?: string;
		page: number;
		page_size: number;
	}
>("/getAccountsWithChildrenList", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			"/masters/accountgroupchildrenlist/",
			params
		);
		if (response) {
			return { response, params, parentIds: payload.parentIds };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const deleteAccount = createAsyncThunk<
	void,
	{ id: string; clearDataFn: Function; navigate: Function }
>("/deleteAccount", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete("/masters/accounts/" + payload.id);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Account deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
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
			payload.clearDataFn();
			// payload.navigate("/pages/masters/account");
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
