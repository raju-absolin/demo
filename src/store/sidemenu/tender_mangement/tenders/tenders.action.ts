import { AnyAction, createAsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	patchEdit,
	patchImg,
	postAdd,
	postDelete,
	postEdit,
	postFormData,
	putImg,
} from "@src/helpers/Helper";
import { TendersInitialState, Tender } from "./tenders.types";
import Swal from "sweetalert2";
import { FileType } from "@src/components";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getTenders = createAsyncThunk<
	{
		response: {
			results: Tender[];
			count: number;
		};
		params: TendersInitialState["pageParams"];
	},
	TendersInitialState["pageParams"]
>("tenders/getTenders", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/tenders/tenders/", params);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getTenderById = createAsyncThunk<
	{
		response: Tender;
	},
	{ id: number | string }
>("tenders/getTenderById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/tenders/tenders/${id}/`);
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

export const postTender = createAsyncThunk<
	any,
	{
		data: any;
		params: TendersInitialState["pageParams"];
		navigate: any;
		tenderRest: any;
		documents: FileType[];
	}
>("tenders/postTender", async (payload, { dispatch }) => {
	const { data, params, navigate, tenderRest, documents } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postAdd(`/tenders/tenders/create/`, {
			...data,
		});
		documents &&
			documents.forEach(async (file: FileType) => {
				file?.id && file?.dodelete
					? dispatch(deleteTenderDocuments({ id: file.id }))
					: file.originalObj &&
						(await postFormData(
							`/tenders/tenderattachments/create/`,
							{
								tender_id: response.data.id,
								file: file.originalObj,
							}
						));
			});

		if (response.status >= 200 && response.status < 300) {
			tenderRest();
			navigate("/tenders");
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Bid Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getTenders(params));
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

export const editTender = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: PageParamsTypes;
		navigate: any;
		tenderRest: any;
		documents: FileType[];
		// hide: (value: boolean) => void;
	}
>("tenders/editTender", async (payload, { dispatch }) => {
	const { id, data, params, navigate, tenderRest, documents } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/tenders/tenders/${id}/`, {
			...data,
		});
		documents &&
			documents.forEach(async (file: FileType) => {
				file?.id && file?.dodelete
					? dispatch(deleteTenderDocuments({ id: file.id }))
					: file.originalObj &&
						(await postFormData(
							`/tenders/tenderattachments/create/`,
							{
								tender_id: response.data.id,
								file: file.originalObj,
							}
						));
			});
		if (response.status >= 200 && response.status < 300) {
			tenderRest();
			navigate("/tenders");
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Bid Edited Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getTenders(params));
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
export const deleteTenderDocuments = createAsyncThunk<
	any,
	{
		id: string;
	}
>("/deleteTenderDocuments", async (payload) => {
	const { id } = payload;
	try {
		const response = await postDelete(`/tenders/tenderattachments/${id}/`);
		return { response: response.data };
	} catch (err) {
		throw err;
	}
});
export const editAssignUser = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		hide: any;
		params?: TendersInitialState["pageParams"];
	}
>("tenders/editAssignUser", async (payload, { dispatch }) => {
	const { id, data, hide, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/tenders/tenderassign/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide();

			if (params?.page) {
				dispatch(getTenders(params));
			} else {
				dispatch(
					getTenderById({
						id: id ? id : "",
					})
				);
			}
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "User Asssigned Successfully",
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
export const editBidStages = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		hide: any;
		params?: TendersInitialState["pageParams"];
	}
>("tenders/editBidStages", async (payload, { dispatch }) => {
	const { id, data, hide, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/tenders/tenderstage/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			hide();

			if (params?.page) {
				dispatch(getTenders(params));
			} else {
				dispatch(
					getTenderById({
						id: id ? id : "",
					})
				);
			}
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Bid Stage Updated Successfully",
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

export const ApproveTender = createAsyncThunk<
	any,
	{
		id: string | number;
		data: {
			status: string | number;
		};
		params?: PageParamsTypes;
	}
>("tenders/ApproveTender", async (payload, { dispatch }) => {
	const { id, data, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postEdit(`/tenders/tenderapprove/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			if (params) {
				dispatch(getTenders(params));
			} else {
				dispatch(getTenderById({ id }));
			}
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Bid Approved",
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
export const RejectTender = createAsyncThunk<
	any,
	{
		id: string | number;
		data: {
			status: string | number;
		};
		params?: PageParamsTypes;
	}
>("tenders/RejectTender", async (payload, { dispatch }) => {
	const { id, data, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response: any = await postEdit(`/tenders/tenderapprove/${id}/`, {
			...data,
		});
		if (response.status >= 200 && response.status < 300) {
			if (params) {
				dispatch(getTenders(params));
			} else {
				dispatch(getTenderById({ id }));
			}
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Bid Rejected",
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

export const postTenderDocuments = createAsyncThunk<
	any,
	{
		file: File;
	}
>("/postTenderDocuments", async (payload) => {
	const { file } = payload;
	try {
		const response = await postFormData(
			`/tenders/tenderattachments/create/`,
			{
				file: file,
			}
		);
		return { response: response.data };
	} catch (err) {
		throw err;
	}
});

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => resolve(), ms);
	});

const ImportDelay = async (payload: { id: string; dispatch: AppDispatch }) => {
	await delay(10000);
	await payload.dispatch(postTenderJsonData({ id: payload.id }));
};

type AppDispatch = ThunkDispatch<any, any, AnyAction>;

export const postPdfUpload = createAsyncThunk<
	any,
	{
		file: File;
	}
>("/postPdfUpload", async (payload, { dispatch }) => {
	const { file } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postFormData(`/tenders/file-workflow/`, {
			file: file,
		});
		if (response.status === 201) {
			await ImportDelay({
				id: response.data.id,
				dispatch,
			});
			Swal.close();
		} else {
			throw new Error("Failed to upload data.");
		}
		return { response: response };
	} catch (err) {
		throw err;
	}
});

export const postTenderJsonData = createAsyncThunk<any, any>(
	"postTenderJsonData",
	async (payload: { id: string }, { dispatch, rejectWithValue }) => {
		const { id } = payload;
		try {
			const response = await postAdd(
				`/tenders/file-workflow/status/${id}/`,
				{}
			);
			if (response.status === 201) {
				Swal.close();
				return { response: response.data };
			} else if (response.status === 202) {
				return await ImportDelay({
					id: payload.id,
					dispatch,
				});
			}
			Swal.close();
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
);
