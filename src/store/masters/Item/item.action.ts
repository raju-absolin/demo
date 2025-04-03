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
import { GroupSubmitPayload, Items, SubmitPayload } from "./item.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getItems = createAsyncThunk<
	{
		response: {
			results: Items[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ parent?: string; search?: string; page: number; page_size: number }
>("/getItems", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/items/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const getItemsList = createAsyncThunk<
	{
		response: {
			results: Items[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ parent?: string; search?: string; page: number; page_size: number }
>("/getItemsList", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/mini/items/", params);
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
			results: Items[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getGroups", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/itemgroup/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const getItemsById = createAsyncThunk<
	{
		response: Items;
	},
	{ id?: string | number }
>("/getItemsById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/item/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addItems = createAsyncThunk<
	{ name: string },
	{ obj: SubmitPayload; image: any }
>("/addItems", async (payload, { dispatch }) => {
	const { image } = payload;
	try {
		const response = await postAdd(`/masters/items/`, payload.obj);
		image &&
			(await patchImg(
				`/masters/item/${response?.data ? response?.data?.id : ""}`,
				{
					image: image,
				}
			));

		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Item Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getItems({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			// payload.clearDataFn();
			// payload.navigate("/pages/masters/item", {
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
export const editItems = createAsyncThunk<
	void,
	{ obj: SubmitPayload; id: string; image: any }
>("/editItems", async (payload, { dispatch }) => {
	const { image } = payload;
	try {
		const response2 = await postEdit(
			"/masters/item/" + payload.id,
			payload.obj
		);
		image &&
			(await patchImg(`/masters/item/${payload.id}`, {
				image: image,
			}));
		if (response2.status == 200) {
			dispatch(
				getItems({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">Item Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			// payload.clearDataFn();
			// payload.navigate("/pages/masters/item", {
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

export const addGroups = createAsyncThunk<
	{ name: string },
	{ obj: GroupSubmitPayload }
>("/addGroups", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/itemgroup/`, payload.obj);
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
			// payload.navigate("/pages/masters/items", {
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

export const getItemsByIdBreadcrumb = createAsyncThunk<
	{
		response: Items;
	},
	{ id?: string | number }
>("/getItemsByIdBreadcrumb", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/items/${id}/breadcrumb/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const getItemsWithChildrenList = createAsyncThunk<
	{
		response: {
			results: Items[];
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
>("/getItemsWithChildrenList", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			"/masters/itemgroupchildrenlist/",
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
export const deleteItem = createAsyncThunk<
	void,
	{ id: string; clearDataFn: Function; navigate: Function }
>("/deleteItem", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete("/masters/item/" + payload.id);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Item deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getItemsWithChildrenList({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			dispatch(
				getItems({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			payload.clearDataFn();
			// payload.navigate("/pages/masters/item");
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
