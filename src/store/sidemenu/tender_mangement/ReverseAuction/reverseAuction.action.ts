import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import {
	ReverseAuctionInitialState,
	ReverseAuction,
} from "./reverseAuction.types";
import Swal from "sweetalert2";
import { Tender } from "../tenders/tenders.types";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getReverseAuctions = createAsyncThunk<
	{
		response: {
			results: ReverseAuction[];
			count: number;
		};
		params: PageParamsTypes;
	},
	ReverseAuctionInitialState["pageParams"]
>("reversauction/getReverseAuctions", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/tenders/reverseauction/list/${params.tender_id}/`,
			params
		);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		console.log(error);
		throw new Error(error?.message);
	}
});

export const getReverseAuctionById = createAsyncThunk<
	{
		response: ReverseAuction;
	},
	{ id: string }
>("reversauction/getReverseAuctionById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/tenders/reverseauction/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postReverseAuction = createAsyncThunk<
	any,
	{
		data: any;
		params: ReverseAuctionInitialState["pageParams"];
		navigate: any;
		tenderRest: any;
	}
>("reversauction/postReverseAuction", async (payload, { dispatch }) => {
	const { data, params, navigate, tenderRest } = payload;
	try {
		const response = await postAdd(`/tenders/reverseauction/create/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			tenderRest();
			// navigate(-1);
			// dispatch(getReverseAuctions(params));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: `Reverse Auction created successfully`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
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

export const editReverseAuction = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: ReverseAuctionInitialState["pageParams"];
		auctionReset: any;
		hide: () => void;
	}
>("reversauction/editReverseAuction", async (payload, { dispatch }) => {
	const { id, data, params, auctionReset, hide } = payload;
	try {
		const response = await postEdit(`/tenders/reverseauction/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			auctionReset();
			hide();
			dispatch(getReverseAuctions(params));
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: `Reverse Auction edited successfully`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
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

export const getTenderById = createAsyncThunk<
	{
		response: Tender;
	},
	{ id: string }
>("reversauction/getTenderById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/tenders/tenders/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});
