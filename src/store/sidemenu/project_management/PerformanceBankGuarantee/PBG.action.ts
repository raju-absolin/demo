import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig, PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
	postFormData,
	putImg,
} from "@src/helpers/Helper";
import {
	PerformanceBankGuaranteeState,
	PerformanceBankGuarantee,
	PerformanceBankGuaranteePayload,
} from "./PBG.types";
import Swal from "sweetalert2";
import { seralizeParams } from "@src/store/mini/mini.Action";
import { useAppDispatch } from "@src/store/store";
import {
	isModalOpen,
	setIsFilterOpen,
	setSelectedData,
	updateProjectPerformanceBankGuaranteesState,
} from "./PBG.slice";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getProjectPerformanceBankGuarantees = createAsyncThunk<
	{
		response: {
			results: PerformanceBankGuarantee[];
			count: number;
		};
		params: PerformanceBankGuaranteeState["pageParams"];
	},
	PerformanceBankGuaranteeState["pageParams"]
>("PT/getProjectPerformanceBankGuarantee", async (payload) => {
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList(
			"/projectmanagement/performancebankguarantees/",
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
export const getProjectPerformanceBankGuaranteesById = createAsyncThunk<
	{
		response: PerformanceBankGuarantee;
	},
	{ id: string }
>("PT/getProjectPerformanceBankGuaranteesById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading PBG Data, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(
			`/projectmanagement/performancebankguarantees/${id}/`
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

export const postPerformanceBankGuaranteeMembers = createAsyncThunk<
	PerformanceBankGuarantee,
	{
		data: PerformanceBankGuaranteePayload;
		hide: () => void;
		params: PerformanceBankGuaranteeState["pageParams"];
	}
>("PT/postPerformanceBankGuaranteeMembers", async (payload, { dispatch }) => {
	const { data, hide, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postFormData(
			`/projectmanagement/performancebankguarantees/`,
			{
				...data,
			}
		);

		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getProjectPerformanceBankGuarantees(params));
			setTimeout(() => {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Performance Bank Guarantee Created successfully",
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

export const editProjectPerformanceBankGuarantees = createAsyncThunk<
	PerformanceBankGuarantee,
	{
		id: string;
		data: PerformanceBankGuaranteePayload;
		hide: () => void;
		params: PerformanceBankGuaranteeState["pageParams"];
	}
>("PT/editProjectPerformanceBankGuarantees", async (payload, { dispatch }) => {
	const { id, data, hide, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await putImg(
			`/projectmanagement/performancebankguarantees/${id}/`,
			{
				...data,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			hide();
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Performance Bank Guarantee Edited successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getProjectPerformanceBankGuarantees(params));
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
export const deletePerformanceBankGuaranteesById = createAsyncThunk<
	{
		response: PerformanceBankGuarantee;
	},
	{ id: string; params: PerformanceBankGuaranteeState["pageParams"] }
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
			`/projectmanagement/performancebankguarantees/${id}/`
		);
		if (response) {
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Record deleted successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getProjectPerformanceBankGuarantees(params));
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		Swal.close();
		throw error.message;
	}
});

export const usePerformanceBankGuaranteesActions = () => {
	const dispatch = useAppDispatch();
	return {
		reducers: {
			updateState: (payload: PerformanceBankGuaranteeState) =>
				dispatch(updateProjectPerformanceBankGuaranteesState(payload)),
			setSelectedData: (payload: PerformanceBankGuarantee) =>
				dispatch(setSelectedData(payload)),
			setIsFilterOpen: (payload: boolean) =>
				dispatch(setIsFilterOpen(payload)),
			isModalOpen: (payload: boolean) => dispatch(isModalOpen(payload)),
		},
		extraReducers: {
			getProjectPerformanceBankGuarantees: (
				payload: PerformanceBankGuaranteeState["pageParams"]
			) => dispatch(getProjectPerformanceBankGuarantees(payload)),
			deletePerformanceBankGuaranteesById: (payload: {
				id: string;
				params: PerformanceBankGuaranteeState["pageParams"];
			}) => dispatch(deletePerformanceBankGuaranteesById(payload)),
		},
	};
};
