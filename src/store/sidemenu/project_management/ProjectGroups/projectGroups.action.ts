import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig, PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import {
	ProjectGroupsState,
	Group,
	GroupPayload,
	GroupUser,
	GroupUserPayload,
} from "./projectGroups.types";
import Swal from "sweetalert2";
import { seralizeParams } from "@src/store/mini/mini.Action";
import { useAppDispatch } from "@src/store/store";
import {
	isModalOpen,
	setGroupUserModalOpen,
	setIsFilterOpen,
	setSelectedData,
	updateProjectGroupsState,
} from "./projectGroups.slice";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getProjectGroups = createAsyncThunk<
	{
		response: {
			results: Group[];
			count: number;
		};
		params: ProjectGroupsState["pageParams"];
	},
	ProjectGroupsState["pageParams"]
>("PGroups/getProjectGroup", async (payload) => {
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList(
			"/projectmanagement/projectgroup/list/",
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		return error.message;
	}
});

export const postProjectGroup = createAsyncThunk<
	Group,
	{
		data: GroupPayload;
		hide: () => void;
		params: ProjectGroupsState["pageParams"];
	}
>("PGroups/postProjectGroup", async (payload, { dispatch }) => {
	const { data, hide, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postAdd(
			`/projectmanagement/projectgroup/create/`,
			{
				...data,
			}
		);

		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getProjectGroups(params));
			setTimeout(() => {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Group Created successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}, 1000);
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

export const getProjectGroupsById = createAsyncThunk<
	{
		response: Group;
	},
	{ id: string }
>("PGroups/getProjectGroupsById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading Purchase Indent Data, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(
			`/projectmanagement/projectgroup/${id}/`
		);
		if (response) {
			Swal.close();
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		Swal.close();
		throw error.message;
	}
});

export const editProjectGroups = createAsyncThunk<
	Group,
	{
		id: string;
		data: GroupPayload;
		hide: () => void;
		params: ProjectGroupsState["pageParams"];
	}
>("PGroups/editProjectGroups", async (payload, { dispatch }) => {
	const { id, data, hide, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(
			`/projectmanagement/projectgroup/${id}/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			hide();
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Group Edited successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getProjectGroups(params));
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

export const getProjectGroupUsers = createAsyncThunk<
	{
		response: {
			results: Group[];
			count: number;
		};
		params: ProjectGroupsState["group_users_params"];
	},
	ProjectGroupsState["group_users_params"]
>("PGroups/getProjectGroupUsers", async (payload) => {
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList(
			"/projectmanagement/projectgroupuser/list/",
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		return error.message;
	}
});

export const postProjectGroupUser = createAsyncThunk<
	Group,
	{
		data: GroupUserPayload;
		hide: () => void;
		params: ProjectGroupsState["group_users_params"];
	}
>("PGroups/postProjectGroupUser", async (payload, { dispatch }) => {
	const { data, hide, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postAdd(
			`/projectmanagement/projectgroupuser/create/`,
			{
				...data,
			}
		);

		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getProjectGroupUsers(params));
			setTimeout(() => {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "User added successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}, 1000);
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

export const getProjectGroupUsersById = createAsyncThunk<
	{
		response: GroupUser;
	},
	{ id: string }
>("PGroups/getProjectGroupUsersById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(
			`/projectmanagement/projectgroupuser/${id}/`
		);
		if (response) {
			Swal.close();
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		Swal.close();
		throw error.message;
	}
});
export const deleteProjectGroupUsersById = createAsyncThunk<
	{
		response: GroupUser;
	},
	{ id: string; params: ProjectGroupsState["group_users_params"] }
>("PGroups/deleteProjectGroupUsersById", async (payload, { dispatch }) => {
	const { id, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postDelete(
			`/projectmanagement/projectgroupuser/${id}/`
		);
		if (response) {
			Swal.close();
			dispatch(getProjectGroupUsers(params));
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		Swal.close();
		throw error.message;
	}
});

export const useProjectGroupsActions = () => {
	const dispatch = useAppDispatch();
	return {
		reducers: {
			updateState: (payload: ProjectGroupsState) =>
				dispatch(updateProjectGroupsState(payload)),
			setSelectedData: (payload: Group) =>
				dispatch(setSelectedData(payload)),
			setIsFilterOpen: (payload: boolean) =>
				dispatch(setIsFilterOpen(payload)),
			isModalOpen: (payload: boolean) => dispatch(isModalOpen(payload)),
			setGroupUserModalOpen: (payload: boolean) =>
				dispatch(setGroupUserModalOpen(payload)),
		},
		extraReducers: {
			getProjectGroups: (payload: ProjectGroupsState["pageParams"]) =>
				dispatch(getProjectGroups(payload)),
		},
	};
};
