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
	CompareQuotationInitialState,
	CompareQuotation,
	RequestPayload,
	GeneratePOPayload,
	VendorRelatedItem,
} from "./cq.types";
import Swal from "sweetalert2";
import { useAppDispatch } from "@src/store/store";
import {
	// setGeneratePOModalOpen,
	// setPOByPE,
	setSelectedData,
	setSelectedVendor,
	setVendorRelatedItems,
} from "./cq.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { Quotation } from "../PurchaseQuotation/pq.types";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getCompareQuotations = createAsyncThunk<
	{
		response: {
			results: CompareQuotation[];
			count: number;
		};
		params: CompareQuotationInitialState["pageParams"];
	},
	CompareQuotationInitialState["pageParams"]
>("project/cq/getCompareQuotations", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/comparequotation/comparequotation/list/${params?.project_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		console.log(error);
		throw new Error(error?.message);
	}
});

export const getPurchaseQuotations = createAsyncThunk<
	{
		response: {
			results: Quotation[];
			count: number;
		};
		params: CompareQuotationInitialState["PQpageParams"];
	},
	CompareQuotationInitialState["PQpageParams"]
>("project/cq/getPurchaseQuotations", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`quotation/quotation/list/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		console.log(error);
		throw new Error(error?.message);
	}
});

export const getPurchaseEnquiryById = createAsyncThunk<
	{
		response: Quotation;
	},
	{ id: string }
>("project/cq/getPurchaseEnquiryById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(
			`/purchaseenquiry/purchaseenquiries/${id}/`
		);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const getCompareQuotationById = createAsyncThunk<
	{
		response: CompareQuotation;
	},
	{ id: string }
>("project/cq/getCompareQuotationById", async (payload) => {
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
			`/comparequotation/comparequotation/${id}/`
		);
		if (response) {
			Swal.close();
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			text: `Error While Loading Compare Quotation Data`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});

interface PostPayload {
	data: RequestPayload;
	params: CompareQuotationInitialState["pageParams"];
	navigate: any;
	reset: any;
}

export const postCompareQuotation = createAsyncThunk<any, PostPayload>(
	"project/cq/postCompareQuotation",
	async (payload, { dispatch }) => {
		const { data, params, navigate, reset } = payload;
		try {
			Swal.fire({
				text: "Loading, please wait...",
				didOpen: () => {
					Swal.showLoading();
				},
				allowOutsideClick: false,
			});
			const response = await postAdd(
				`/comparequotation/comparequotation/create/`,
				{
					...data,
				}
			);
			if (response.status >= 200 && response.status < 300) {
				reset();
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Compare Quotation Added Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				}).then(() => {
					navigate(-1);
				});
				dispatch(getCompareQuotations(params));
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
	}
);

interface PutPayload extends PostPayload {
	id: number | string;
}

export const editCompareQuotation = createAsyncThunk<any, PutPayload>(
	"project/cq/editCompareQuotation",
	async (payload, { dispatch }) => {
		const { id, data, params, navigate, reset } = payload;
		try {
			Swal.fire({
				text: "Loading, please wait...",
				didOpen: () => {
					Swal.showLoading();
				},
				allowOutsideClick: false,
			});
			const response = await postEdit(
				`/comparequotation/comparequotation/${id}/`,
				{
					...data,
				}
			);
			if (response.status >= 200 && response.status < 300) {
				reset();
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Compare Quotation Edited Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				}).then(() => {
					navigate(-1);
				});
				dispatch(getCompareQuotations(params));
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
	}
);

// interface PostPO {
// 	data: GeneratePOPayload;
// 	reset: (response: any) => void;
// }
// export const postPO = createAsyncThunk<any, PostPO>(
// 	"project/cq/postPO",
// 	async (payload, { dispatch }) => {
// 		const { data, reset } = payload;
// 		try {
// 			Swal.fire({
// 				text: "Loading, please wait...",
// 				didOpen: () => {
// 					Swal.showLoading();
// 				},
// 				allowOutsideClick: false,
// 			});
// 			const response = await postAdd(`/purchaseorder/`, {
// 				...data,
// 			});

// 			if (response.status >= 200 && response.status < 300) {
// 				reset(response.data);
// 				Swal.close();
// 				Swal.fire({
// 					title: `<p style="font-size:20px">Success</p>`,
// 					text: "Purchase Order Created Successfully",
// 					icon: "success",
// 					confirmButtonText: `Close`,
// 					confirmButtonColor: "#3085d6",
// 				});
// 				dispatch(
// 					getPoByPe({
// 						id: data?.purchaseenquiry_id
// 							? data?.purchaseenquiry_id
// 							: "",
// 					})
// 				);
// 				return response.data;
// 			} else {
// 				throw new Error(response.data);
// 			}
// 		} catch (error: any) {
// 			const errResult = formatErrorMessage(error.response.data);
// 			const formattedErrResult = errResult.replace(/\n/g, "<br>");
// 			Swal.close();
// 			Swal.fire({
// 				title: `<p style="font-size:20px">Error</p>`,
// 				html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
// 				icon: "error",
// 				confirmButtonText: `Close`,
// 				confirmButtonColor: "#3085d6",
// 			});
// 			throw error.message;
// 		}
// 	}
// );
// export const getPoByPe = createAsyncThunk<
// 	{
// 		response: any;
// 	},
// 	{ id: string }
// >("project/cq/getPoByPe", async (payload, { dispatch }) => {
// 	const { id } = payload;
// 	try {
// 		Swal.fire({
// 			text: "Loading, please wait...",
// 			didOpen: () => {
// 				Swal.showLoading();
// 			},
// 			allowOutsideClick: false,
// 		});
// 		const response = await getList(`/purchaseorder/pobype/${id}`);
// 		if (response) {
// 			Swal.close();
// 			return { response: response.data };
// 		} else {
// 			throw new Error(response);
// 		}
// 	} catch (error: any) {
// 		Swal.close();
// 		Swal.fire({
// 			title: `<p style="font-size:20px">Error</p>`,
// 			text: `Error While Loading PO Data`,
// 			icon: "error",
// 			confirmButtonText: `Close`,
// 			confirmButtonColor: "#3085d6",
// 		});
// 		throw error.message;
// 	}
// });

export const getPeAgaintComparequotation = createAsyncThunk(
	"/getPeAgaintComparequotation",
	async (payload) => {
		var params = addParams(payload);
		const { id } = params;
		try {
			const response = await getParamsList(
				`purchaseenquiry/againtcomparequotation/`,
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

export const useCompareQuotationActions = () => {
	const dispatch = useAppDispatch();
	return {
		reducer: {
			// setGeneratePOModalOpen: (payload: boolean) =>
			// 	dispatch(setGeneratePOModalOpen(payload)),
			setSelectedVendor: (payload: Vendor | null) =>
				dispatch(setSelectedVendor(payload)),
			setVendorRelatedItems: (payload: VendorRelatedItem[]) =>
				dispatch(setVendorRelatedItems(payload)),
			// setPOByPE: (payload: Order[]) => dispatch(setPOByPE(payload)),
			setSelectedData: (payload: CompareQuotation) =>
				dispatch(setSelectedData(payload)),
		},
		extraReducer: {
			postCompareQuotation: (payload: PostPayload) =>
				dispatch(postCompareQuotation(payload)),
			editCompareQuotation: (payload: PutPayload) =>
				dispatch(editCompareQuotation(payload)),
			// postPO: (payload: PostPO) => dispatch(postPO(payload)),
			// getPoByPe: (payload: { id: string }) =>
			// 	dispatch(getPoByPe(payload)),
		},
	};
};
