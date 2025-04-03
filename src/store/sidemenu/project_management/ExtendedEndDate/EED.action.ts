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
} from "@src/helpers/Helper";
import {
	ExtendedEndDateState,
	ExtendedEndDate,
	ExtendedEndDatePayload,
} from "./EED.types";
import Swal from "sweetalert2";
import { seralizeParams } from "@src/store/mini/mini.Action";
import { useAppDispatch } from "@src/store/store";
import {
	isModalOpen,
	setIsFilterOpen,
	setSelectedData,
	updateProjectExtendedEndDatesState,
} from "./EED.slice";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getProjectExtendedEndDates = createAsyncThunk<
	{
		response: {
			results: ExtendedEndDate[];
			count: number;
		};
		params: ExtendedEndDateState["pageParams"];
	},
	ExtendedEndDateState["pageParams"]
>("PT/getProjectExtendedEndDate", async (payload) => {
	var params = seralizeParams(payload);
	try {
		const response = await getParamsList(
			"/projectmanagement/projectduedatedocument/list/",
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

export const postExtendedEndDateMembers = createAsyncThunk<
	ExtendedEndDate,
	{
		data: ExtendedEndDatePayload;
		hide: () => void;
		params: ExtendedEndDateState["pageParams"];
	}
>("PT/postExtendedEndDateMembers", async (payload, { dispatch }) => {
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
			`/projectmanagement/projectduedatedocument/create/`,
			{
				...data,
			}
		);

		if (response.status >= 200 && response.status < 300) {
			hide();
			dispatch(getProjectExtendedEndDates(params));
			setTimeout(() => {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Extended Due Date Created successfully",
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

// export const getProjectExtendedEndDatesById = createAsyncThunk<
// 	{
// 		response: ExtendedEndDate;
// 	},
// 	{ id: string }
// >("PT/getProjectExtendedEndDatesById", async (payload) => {
// 	const { id } = payload;
// 	try {
// 		Swal.fire({
// 			text: "Loading Purchase Indent Data, please wait...",
// 			didOpen: () => {
// 				Swal.showLoading();
// 			},
// 			allowOutsideClick: false,
// 		});
// 		const response = await getList(
// 			`/projectmanagement/performancebankguarantees/${id}/`
// 		);
// 		if (response) {
// 			Swal.close();
// 			return { response: response.data };
// 		} else {
// 			throw new Error(response);
// 		}
// 	} catch (error: any) {
// 		Swal.close();
// 		throw error.message;
// 	}
// });

// export const editProjectExtendedEndDates = createAsyncThunk<
// 	ExtendedEndDate,
// 	{
// 		id: string;
// 		data: ExtendedEndDatePayload;
// 		hide: () => void;
// 		params: ExtendedEndDateState["pageParams"];
// 	}
// >("PT/editProjectExtendedEndDates", async (payload, { dispatch }) => {
// 	const { id, data, hide, params } = payload;
// 	try {
// 		Swal.fire({
// 			text: "Loading, please wait...",
// 			didOpen: () => {
// 				Swal.showLoading();
// 			},
// 			allowOutsideClick: false,
// 		});
// 		const response = await postEdit(
// 			`/projectmanagement/performancebankguarantees/${id}/`,
// 			{
// 				...data,
// 			}
// 		);
// 		if (response.status >= 200 && response.status < 300) {
// 			hide();
// 			Swal.close();
// 			Swal.fire({
// 				title: `<p style="font-size:20px">Success</p>`,
// 				text: "Performance Bank Guarantee Edited successfully",
// 				icon: "success",
// 				confirmButtonText: `Close`,
// 				confirmButtonColor: "#3085d6",
// 			});
// 			dispatch(getProjectExtendedEndDates(params));
// 			return response.data;
// 		} else {
// 			throw new Error(response.data);
// 		}
// 	} catch (error: any) {
// 		const errormessage = error.response.data
// 			? JSON.stringify(error.response.data)
// 			: error.message;
// 		Swal.close();
// 		Swal.fire({
// 			title: `<p style="font-size:20px">Error</p>`,
// 			text: `${errormessage}`,
// 			icon: "error",
// 			confirmButtonText: `Close`,
// 			confirmButtonColor: "#3085d6",
// 		});
// 		throw error.message;
// 	}
// });
// export const deleteExtendedEndDatesById = createAsyncThunk<
// 	{
// 		response: ExtendedEndDate;
// 	},
// 	{ id: string; params: ExtendedEndDateState["pageParams"] }
// >("PGroups/deleteProjectGroupUsersById", async (payload, { dispatch }) => {
// 	const { id, params } = payload;
// 	try {
// 		Swal.fire({
// 			text: "Loading, please wait...",
// 			didOpen: () => {
// 				Swal.showLoading();
// 			},
// 			allowOutsideClick: false,
// 		});
// 		const response = await postDelete(
// 			`/projectmanagement/performancebankguarantees/${id}/`
// 		);
// 		if (response) {
// 			Swal.close();
// 			Swal.fire({
// 				title: `<p style="font-size:20px">Success</p>`,
// 				text: "Record deleted successfully",
// 				icon: "success",
// 				confirmButtonText: `Close`,
// 				confirmButtonColor: "#3085d6",
// 			});
// 			dispatch(getProjectExtendedEndDates(params));
// 			return { response: response.data };
// 		} else {
// 			throw new Error(response);
// 		}
// 	} catch (error: any) {
// 		Swal.close();
// 		throw error.message;
// 	}
// });

export const useExtendedEndDatesActions = () => {
	const dispatch = useAppDispatch();
	return {
		reducers: {
			updateState: (payload: ExtendedEndDateState) =>
				dispatch(updateProjectExtendedEndDatesState(payload)),
			setSelectedData: (payload: ExtendedEndDate) =>
				dispatch(setSelectedData(payload)),
			setIsFilterOpen: (payload: boolean) =>
				dispatch(setIsFilterOpen(payload)),
			isModalOpen: (payload: boolean) => dispatch(isModalOpen(payload)),
		},
		extraReducers: {
			getProjectExtendedEndDates: (
				payload: ExtendedEndDateState["pageParams"]
			) => dispatch(getProjectExtendedEndDates(payload)),
			// deleteExtendedEndDatesById: (payload: {
			// 	id: string;
			// 	params: ExtendedEndDateState["pageParams"];
			// }) => dispatch(deleteExtendedEndDatesById(payload)),
		},
	};
};
