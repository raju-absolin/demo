import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig, PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import { ProjectTeamsState, Team, TeamPayload } from "./project_teams.types";
import Swal from "sweetalert2";
import { seralizeParams } from "@src/store/mini/mini.Action";
import { useAppDispatch } from "@src/store/store";
import {
	isModalOpen,
	setIsFilterOpen,
	setSelectedData,
	updateProjectTeamsState,
} from "./project_teams.slice";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getProjectTeams = createAsyncThunk<
	{
		response: {
			results: Team[];
			count: number;
		};
		params: ProjectTeamsState["pageParams"];
	},
	ProjectTeamsState["pageParams"]
>("PT/getProjectTeam", async (payload) => {
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList("/permissions/assignees/", params);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		return error.message;
	}
});

export const postTeamMembers = createAsyncThunk<
	Team,
	{
		data: TeamPayload;
		hide: () => void;
		params: ProjectTeamsState["pageParams"];
	}
>("PT/postTeamMembers", async (payload, { dispatch }) => {
	const { data, hide, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postAdd(`/permissions/assignees/`, {
			...data,
		});

		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getProjectTeams(params));
			setTimeout(() => {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Team Created successfully",
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

export const getProjectTeamsById = createAsyncThunk<
	{
		response: Team;
	},
	{ id: string }
>("PT/getProjectTeamsById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading Purchase Indent Data, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/permissions/assignees/${id}`);
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

export const editProjectTeams = createAsyncThunk<
	Team,
	{
		id: string;
		data: TeamPayload;
		hide: () => void;
		params: ProjectTeamsState["pageParams"];
	}
>("PT/editProjectTeams", async (payload, { dispatch }) => {
	const { id, data, hide, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/permissions/assignees/${id}`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide();
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Team Edited successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getProjectTeams(params));
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

export const useProjectTeamsActions = () => {
	const dispatch = useAppDispatch();
	return {
		reducers: {
			updateState: (payload: ProjectTeamsState) =>
				dispatch(updateProjectTeamsState(payload)),
			setSelectedData: (payload: Team) =>
				dispatch(setSelectedData(payload)),
			setIsFilterOpen: (payload: boolean) =>
				dispatch(setIsFilterOpen(payload)),
			isModalOpen: (payload: boolean) => dispatch(isModalOpen(payload)),
		},
		extraReducers: {
			getProjectTeams: (payload: ProjectTeamsState["pageParams"]) =>
				dispatch(getProjectTeams(payload)),
		},
	};
};
