import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import { PermissionListType, SubmitPayload } from "./manage_groups.types";
import Swal from "sweetalert2";

export const getProfileList = createAsyncThunk<
	{
		response: {
			count: number;
			results: {
				id: number | string;
				name: string;
				permissions: string[];
				groupdetails: {
					group: number | string;
					reporting_to?: string | null;
					reporting_to_name?: string;
				};
			}[];
		};
	},
	{ search?: string; page: number; page_size: number }
>("/getProfileList", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/users/groups/", params);
		if (response) {
			return { response };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getProfilebyID = createAsyncThunk<
	{
		response: {
			id: number;
			name: string;
			permissions: string[];
			groupdetails: {
				group: number;
				reporting_to: string;
				reporting_to_name: string;
			};
		};
	},
	{ id: string }
>("/getProfilebyID", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList("/users/groups/" + id);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const getPermissionsList = createAsyncThunk<
	{
		response: PermissionListType[];
		id: string;
	},
	{
		id: string;
	}
>("/getPermissionsList", async (payload, { dispatch }) => {
	const { id } = payload;
	try {
		const response = await getParamsList("/users/apps/permissions/", {});
		if (response) {
			if (id != "0") {
				dispatch(getProfilebyID({ id: id ? id : "" }));
			}
			return { response, id };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const submitProfile = createAsyncThunk<
	void,
	{ profileObj: SubmitPayload; clearDataFn: Function; navigate: Function }
>("/submitProfile", async (payload) => {
	try {
		if (payload.profileObj.id == 0) {
			const response = await postAdd(
				"/users/groups/",
				payload.profileObj
			);
			if (response) {
				Swal.fire({
					title: `<p style="font-size:20px">Group Added Successfully</p>`,
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				payload.clearDataFn();
				payload.navigate("/pages/settings/manage-profile", {
					replace: true,
				});
			} else {
				throw new Error(response);
			}
		} else {
			const response2 = await postEdit(
				"/users/groups/" + payload.profileObj.id,
				payload.profileObj
			);
			if (response2.status == 200) {
				Swal.fire({
					title: `<p style="font-size:20px">Group Edited Successfully</p>`,
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				payload.clearDataFn();
				payload.navigate("/pages/settings/manage-profile", {
					replace: true,
				});
				payload.navigate("/pages/settings/manage-profile", {
					replace: true,
				});
			} else {
				throw new Error(response2 as any);
			}
		}
	} catch (error: any) {
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			text: `${error.message}`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		payload.clearDataFn();
		payload.navigate("/pages/settings/manage-profile", {
			replace: true,
		});
		throw error.message;
	}
});
