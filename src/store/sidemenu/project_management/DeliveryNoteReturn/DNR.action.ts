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
	DeliveryReturnNotesInitialState,
	DeliveryReturnNotes,
} from "./DNR.types";
import Swal from "sweetalert2";
import { useAppDispatch } from "@src/store/store";
import { setSelectedData } from "./DNR.slice";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getDeliveryReturnNotes = createAsyncThunk<
	{
		response: {
			results: DeliveryReturnNotes[];
			count: number;
		};
		params: DeliveryReturnNotesInitialState["pageParams"];
	},
	DeliveryReturnNotesInitialState["pageParams"]
>("project/getDeliveryReturnNotes", async (payload) => {
	var params = addParams(payload);
	const { project } = payload;
	try {
		const response = await getParamsList(
			`/delivery/deliveryreturn/list/${project}/`,
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

export const getDeliveryReturnNotesById = createAsyncThunk<
	{
		response: DeliveryReturnNotes;
	},
	{ id: string }
>("project/getDeliveryReturnNotesById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/delivery/deliveryreturn/${id}/`);
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

export const postDeliveryReturnNotes = createAsyncThunk<
	any,
	{
		data: any;
		params: DeliveryReturnNotesInitialState["pageParams"];
		navigate: any;
		reset: () => void;
	}
>("project/postDeliveryReturnNotes", async (payload, { dispatch }) => {
	const { data, params, navigate, reset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/delivery/deliveryreturn/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			reset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Delivery Return Note Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getDeliveryReturnNotes(params));
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

export const editDeliveryReturnNotes = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: DeliveryReturnNotesInitialState["pageParams"];
		navigate: any;
		reset: () => void;
	}
>("project/editDeliveryReturnNotes", async (payload, { dispatch }) => {
	const { id, data, params, navigate, reset } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/delivery/deliveryreturn/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			reset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Delivery Return Note Updated Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getDeliveryReturnNotes(params));
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

export const useDeliveryReturnNotesAction = () => {
	const dispatch = useAppDispatch();

	return {
		reducer: {
			setSelectedData(payload: DeliveryReturnNotes) {
				return dispatch(setSelectedData(payload));
			},
		},
		extraReducer: {},
	};
};
