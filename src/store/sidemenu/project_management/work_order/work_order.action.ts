import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
	postFormData,
} from "@src/helpers/Helper";
import {
	WorkOrdersInitialState,
	WorkOrder,
	postWorkOrderPayload,
} from "./work_order.types";
import Swal from "sweetalert2";
import { seralizeParams } from "@src/store/mini/mini.Action";
import { enqueueSnackbar } from "notistack";
import { formatErrorMessage } from "../../errorMsgFormat";
import { fetchNotificationList } from "@src/store/notifications/notification.actions";

export const getWorkOrders = createAsyncThunk<
	{
		response: {
			results: WorkOrder[];
			count: number;
		};
		params: WorkOrdersInitialState["pageParams"];
	},
	WorkOrdersInitialState["pageParams"]
>("workOrder/getWorkOrders", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			"/projectmanagement/projects/",
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getWorkOrderById = createAsyncThunk<
	{
		response: WorkOrder;
	},
	{ id: string }
>("workOrder/getWorkOrderById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/projectmanagement/projects/${id}/`);
		if (response) {
			setTimeout(() => {
				Swal.close();
				// enqueueSnackbar("Successfully loaded work order details", {
				// 	variant: "success",
				// });
			}, 1000);
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		Swal.close();
		throw error.message;
	}
});

export const postWorkOrder = createAsyncThunk<
	any,
	{
		data: postWorkOrderPayload;
		params: WorkOrdersInitialState["pageParams"];
		navigate: any;
		workOrderReset: any;
		documents?: any[];
	}
>("workOrder/postWorkOrder", async (payload, { dispatch }) => {
	const { data, params, navigate, workOrderReset, documents } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postAdd(
			`/projectmanagement/projects/create/`,
			{
				...data,
			}
		);
		if (documents) {
			for (const file of documents) {
				try {
					if (file?.id && file?.dodelete) {
						// add delete logic here
					} else if (file.originalObj) {
						await await postFormData(
							`/projectmanagement/projectdocuments/`,
							{
								project_id: response.data.id,
								file: file,
							}
						);
					}
				} catch (error) {
					console.error("Error processing file:", error);
					// Handle error if needed
				}
			}
		}

		if (response.status >= 200 && response.status < 300) {
			workOrderReset();
			navigate("/work_order");
			dispatch(getWorkOrders(params));
			setTimeout(() => {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Work order created successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}, 1000);
			dispatch(
				fetchNotificationList({
					...params,
					page: 1,
					page_size: 10,
				})
			);
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

export const editWorkOrder = createAsyncThunk<
	any,
	{
		id: string;
		data: postWorkOrderPayload;
		params: WorkOrdersInitialState["pageParams"];
		navigate: any;
		workOrderReset: any;
		documents?: any[];
		// hide: (value: boolean) => void;
	}
>("workOrder/editWorkOrder", async (payload, { dispatch }) => {
	const { id, data, params, navigate, workOrderReset, documents } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});

		const response = await postEdit(`/projectmanagement/projects/${id}/`, {
			...data,
		});
		if (documents) {
			for (const file of documents) {
				try {
					if (file?.id && file?.dodelete) {
						// add delete logic here
					} else if (file.originalObj) {
						await await postFormData(
							`/projectmanagement/projectdocuments/`,
							{
								project_id: response.data.id,
								file: file,
							}
						);
					}
				} catch (error) {
					console.error("Error processing file:", error);
					// Handle error if needed
				}
			}
		}
		if (response.status >= 200 && response.status < 300) {
			workOrderReset();
			navigate("/work_order");
			dispatch(getWorkOrders(params));
			setTimeout(() => {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Work order edited successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}, 1000);
			dispatch(
				fetchNotificationList({
					...params,
					page: 1,
					page_size: 10,
				})
			);
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

export const getProjectTeam = createAsyncThunk(
	"/getProjectTeam",
	async (payload) => {
		var params = seralizeParams(payload);
		try {
			const response = await getParamsList(
				"/projectmanagement/projectteamlist/",
				params
			);
			if (response) {
				return { response, params };
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			return error.message;
		}
	}
);

export const postTeamMembers = createAsyncThunk<
	any,
	{
		data: {
			project_id: string;
			user_ids: string[];
		};
		hide: () => void;
		ResetTeam: any;
	}
>("workOrder/postTeamMembers", async (payload, { dispatch }) => {
	const { data, ResetTeam, hide } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postAdd(`/projectmanagement/projectteam/`, {
			...data,
		});

		if (response.status >= 200 && response.status < 300) {
			ResetTeam();
			hide();
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
