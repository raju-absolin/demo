import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	patchImg,
	postAdd,
	postEdit,
	postFormData,
} from "@src/helpers/Helper";
import {
	DeliveryChallanInitialState,
	DeliveryChallan,
	BatchAgainstItems,
} from "./DC.types";
import Swal from "sweetalert2";
import { useAppDispatch } from "@src/store/store";
import { setSelectedData } from "./DC.slice";
import { formatErrorMessage } from "../../errorMsgFormat";
import { fetchNotificationList } from "@src/store/notifications/notification.actions";

export const getDeliveryChallan = createAsyncThunk<
	{
		response: {
			results: DeliveryChallan[];
			count: number;
		};
		params: DeliveryChallanInitialState["pageParams"];
	},
	DeliveryChallanInitialState["pageParams"]
>("project/getDeliveryChallan", async (payload) => {
	var params = addParams(payload);
	const { project } = payload;
	try {
		const response = await getParamsList(
			`/delivery/deliverychallan/list/${project}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error?.message);
	}
});

export const getDeliveryChallanById = createAsyncThunk<
	{
		response: DeliveryChallan;
	},
	{ id: string }
>("project/getDeliveryChallanById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/delivery/deliverychallan/${id}/`);
		if (response) {
			Swal.close();
			return { response: response.data };
		} else {
			throw new Error(response);
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

export const postDeliveryChallan = createAsyncThunk<
	any,
	{
		data: any;
		params: DeliveryChallanInitialState["pageParams"];
		navigate: any;
		reset: () => void;
	}
>("project/postDeliveryChallan", async (payload, { dispatch }) => {
	const { data, params, navigate, reset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/delivery/deliverychallan/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			reset();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Delivery Challan Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			}).then(() => {
				navigate(-1);
			})
			dispatch(getDeliveryChallan(params));
			dispatch(fetchNotificationList(params))
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

export const editDeliveryChallan = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: DeliveryChallanInitialState["pageParams"];
		navigate: any;
		reset: () => void;
	}
>("project/editDeliveryChallan", async (payload, { dispatch }) => {
	const { id, data, params, navigate, reset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/delivery/deliverychallan/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			reset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Receipt From Production Updated Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getDeliveryChallan(params));
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

export const useDeliveryChallanAction = () => {
	const dispatch = useAppDispatch();

	return {
		reducer: {
			setSelectedData(payload: DeliveryChallan) {
				return dispatch(setSelectedData(payload));
			},
		},
		extraReducer: {},
	};
};
type StockDetailsResponse = {
	warehouse: string;
	item: string;
	batch: string;
	quantity: string;
	project: string;
};

type PageParams = {
	item_id: string;
	warehouse_id: string;
	project_id: string;
};

export const getStockDetails = createAsyncThunk<
	{ response: StockDetailsResponse },
	PageParams
>("project/dc/getStockDetails", async (payload) => {
	const { item_id, warehouse_id, project_id } = payload;
	try {
		const response: any = await getParamsList(
			`/projectmanagement/stockwithoutbatch/${project_id}/${warehouse_id}/${item_id}/`,
			{ project: project_id }
		);
		if (response) {
			return { response }; // Return in the expected format
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const deliveryChallanCheckApproval = createAsyncThunk<
	any,
	{
		delivery_challan_id: string | number;
	}
>("project/deliveryChallanCheckApproval", async (payload, { dispatch }) => {
	const { delivery_challan_id } = payload;
	try {
		const response = await postAdd(
			`/delivery/checkapprove/deliverychallan/`,
			{
				delivery_challan_id,
			}
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.close();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const deliveryChallanApproval = createAsyncThunk<
	any,
	{
		data: any;
	}
>("project/deliveryChallanApproval", async (payload, { dispatch }) => {
	const { data } = payload;
	try {
		const response = await postAdd(
			`/delivery/approve/deliverychallan/`,
			data
		);
		if (response.status >= 200 && response.status < 300) {
			if (response.data.approved_status == 2) {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Delivery Challan Approved Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(
					getDeliveryChallanById({ id: data.delivery_challan_id })
				);
				return response.data;
			} else if (response.data.approved_status == 3) {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Delivery Challan Rejected Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(
					getDeliveryChallanById({ id: data.delivery_challan_id })
				);
				return response.data;
			}
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
export const getBatchQuantity = createAsyncThunk<
	{
		response: {
			results: BatchAgainstItems[];
			count: number;
		};
		params: DeliveryChallanInitialState["batchPageParams"];
	},
	DeliveryChallanInitialState["batchPageParams"]
>("project/dc/getBatchQuantity", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/projectmanagement/stockagainstbatch/${payload?.project_id}/${payload?.warehouse_id}/${payload?.item_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error?.message);
	}
});
