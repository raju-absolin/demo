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
	MRNReturnReturnInitialState,
	MrnReturn,
	BatchAgainstItems,
	MrnReturnItem,
} from "./mrn_return.types";
import Swal from "sweetalert2";
import { AxiosResponse } from "axios";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getMRNReturn = createAsyncThunk<
	{
		response: {
			results: MrnReturn[];
			count: number;
		};
		params: MRNReturnReturnInitialState["pageParams"];
	},
	MRNReturnReturnInitialState["pageParams"]
>("project/mrn_return/getMRNReturn", async (payload) => {
	var params = addParams(payload);
	const { project_id } = payload;
	try {
		const response = await getParamsList(
			`/mrnreturns/mrn_returns/list/${project_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		console.error(error);
		throw new Error(error?.message);
	}
});

export const getMRNReturnById = createAsyncThunk<
	{
		response: MrnReturn;
		mrn_return_items: MrnReturnItem[];
	},
	{ id: string }
>("project/mrn_return/getMRnReturnById", async (payload, { dispatch }) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});

		const response = await getList(`/mrnreturns/mrn_returns/${id}/`);

		if (!response?.data) {
			throw new Error("Invalid response from server");
		}

		console.log(response.data);

		const items = await Promise.all(
			response.data.mrnreturn_items.map(async (e: MrnReturnItem) => {
				try {
					const [stockRes, batchRes]: any = await Promise.allSettled([
						dispatch(
							getStockDetails({
								project_id: `${response.data?.project?.id}`,
								warehouse_id: response.data?.warehouse?.id,
								item_id: `${e?.item?.id}`,
							})
						),
						dispatch(
							getBatchQuantity({
								item_id: e?.item?.id,
								project_id: response.data?.project?.id,
								warehouse_id: response?.data?.warehouse?.id,
								no_of_pages: 0,
								page_size: 0,
								page: 1,
							})
						),
					]);

					const stockAvailable = parseFloat(
						stockRes?.value?.payload?.response?.quantity || "0"
					);

					const batchQuantity =
						batchRes?.value?.payload?.response?.results?.reduce(
							(
								acc: number,
								val: { batch: string; quantity: string }
							) => acc + parseFloat(val?.quantity),
							0
						) || 0;

					return {
						...e,
						batch_name: e.batch?.name || "",
						stockavailable: stockAvailable,
						batchQuantity,
					};
				} catch (error) {
					console.error("Error processing item:", error);
					return {
						...e,
						batch_name: e.batch?.name || "",
						stockavailable: 0,
						batchQuantity: 0,
					};
				}
			})
		);

		Swal.close();

		return {
			response: response.data,
			mrn_return_items: items,
		};
	} catch (error: any) {
		Swal.close();
		console.error("Error fetching MRN Return:", error);
		throw new Error(
			error.message || "Something went wrong while fetching MRN Return"
		);
	}
});

export const getMRNById = createAsyncThunk<
	{
		response: MrnReturn;
	},
	{ id: string }
>("project/mrn_return/getMRnById", async (payload) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/materialreceivednote/mrn/${id}/`);
		if (response) {
			Swal.close();
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postMRNReturn = createAsyncThunk<
	any,
	{
		data: any;
		params: MRNReturnReturnInitialState["pageParams"];
		navigate: any;
		reset: any;
		document: File[];
	}
>("project/mrn/postMRNReturn", async (payload, { dispatch }) => {
	const { data, params, navigate, reset, document } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/mrnreturns/mrn_returns/create/`, {
			...data,
		});
		document &&
			document.forEach(async (file) => {
				await postFormData(`/mrnreturns/mrnreturnattachments/create/`, {
					mrn_return_id: response.data.id,
					file: file,
				});
			});
		if (response.status >= 200 && response.status < 300) {
			reset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Mrn Retutn Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getMRNReturn(params));
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

export const editMRNReturn = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: MRNReturnReturnInitialState["pageParams"];
		navigate: any;
		reset: any;
		document: File[];
	}
>("project/mrn/editMRNReturn", async (payload, { dispatch }) => {
	const { id, data, params, navigate, reset, document } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/mrnreturns/mrn_returns/${id}/`, {
			...data,
		});
		document &&
			document.forEach(async (file) => {
				await postFormData(`/mrnreturns/mrnreturnattachments/create/`, {
					mrn_return_id: id,
					file: file,
				});
			});
		if (response.status >= 200 && response.status < 300) {
			reset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Mrn Return Edited Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getMRNReturn(params));
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
>("project/mrn_return/getStockDetails", async (payload) => {
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

export const postMRNReturnDocuments = createAsyncThunk<
	any,
	{
		file: File;
	}
>("/postMRNReturnDocuments", async (payload) => {
	const { file } = payload;
	try {
		const response = await postFormData(
			`/mrnreturns/mrnreturnattachments/create/`,
			{
				file: file,
			}
		);
		return { response: response.data };
	} catch (err) {
		throw err;
	}
});

export const getBatchQuantity = createAsyncThunk<
	{
		response: {
			results: BatchAgainstItems[];
			count: number;
		};
		params: MRNReturnReturnInitialState["batchPageParams"];
	},
	MRNReturnReturnInitialState["batchPageParams"]
>("project/mrn_return/getBatchQuantity", async (payload) => {
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
		console.error(error);
		throw new Error(error?.message);
	}
});
