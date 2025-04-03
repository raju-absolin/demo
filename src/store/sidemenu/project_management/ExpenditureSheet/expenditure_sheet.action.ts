import { createAsyncThunk } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import {
	addParams,
	getList,
	getParamsList,
	patchImg,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import {
	ExpenditureSheetInitialState,
	ExpenditureSheet,
} from "./expenditure_sheet.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";
import { serialize } from "object-to-formdata";
import axiosInstance from "@src/helpers/AxiosHelper";

export const getExpenditureSheet = createAsyncThunk<
	{
		response: {
			results: ExpenditureSheet[];
			count: number;
		};
		params: ExpenditureSheetInitialState["pageParams"];
	},
	ExpenditureSheetInitialState["pageParams"]
>("project/getExpenditureSheet", async (payload) => {
	var params = addParams(payload);
	const { project_id } = payload;
	try {
		const response = await getParamsList(
			`/payments/expendituresheet/list/${project_id}/`,
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

export const getExpenditureSheetById = createAsyncThunk<
	{
		response: ExpenditureSheet;
	},
	{ id: string }
>("project/getExpenditureSheetById", async (payload, { dispatch }) => {
	const { id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await getList(`/payments/expendituresheet/${id}/`);
		if (response) {
			// Process each item and add approval status
			const itemsWithApproval = await Promise.all(
				response.data.expendituresheetitems?.map(
					async (item: any, index: number) => {
						try {
							const checkApprove = await dispatch(
								ExpenditureSheetCheckApproval({
									expendituresheetitem_id: item?.id,
								})
							).unwrap();
							console.log(index, checkApprove);
							return {
								...item,
								checkApprove: checkApprove?.expendituresheetitem
									? true
									: false,
							};
						} catch (error) {
							console.log(index, error);
							return {
								...item,
								checkApprove: false,
							};
						}
					}
				) || []
			);

			// Update the response with new items
			const updatedResponse = {
				...response.data,
				expendituresheetitems: itemsWithApproval,
			};

			console.log(updatedResponse);

			Swal.close();
			return { response: updatedResponse };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		Swal.close();
		throw error.message;
	}
});

export const postExpenditureSheet = createAsyncThunk<
	any,
	{
		data: any;
		params: ExpenditureSheetInitialState["pageParams"];
		navigate: any;
		esReset: any;
		// documents: File[];
	}
>("project/postExpenditureSheet", async (payload, { dispatch }) => {
	const {
		data,
		params,
		navigate,
		esReset,
		// documents
	} = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postAdd(`/payments/expendituresheet/create/`, {
			...data,
		});
		// documents &&
		// 	documents.forEach(async (file) => {
		// 		response.data.expendituresheetitems?.map(async (item: any) => {
		// 			await postFormData(
		// 				`/payments/expendituresheetattachments/create/`,
		// 				{
		// 					expendituresheetitem_id: item?.id,
		// 					file: file,
		// 				}
		// 			);
		// 		});
		// 	});
		if (response.status >= 200 && response.status < 300) {
			esReset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "ExpenditureSheet Added Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getExpenditureSheet(params));
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

export const editExpenditureSheet = createAsyncThunk<
	any,
	{
		id: number | string;
		data: any;
		params: ExpenditureSheetInitialState["pageParams"];
		navigate: any;
		esReset: any;
		// documents: File[];
	}
>("project/editExpenditureSheet", async (payload, { dispatch }) => {
	const {
		id,
		data,
		params,
		navigate,
		esReset,
		//  documents
	} = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(`/payments/expendituresheet/${id}/`, {
			...data,
		});
		// documents &&
		// 	documents.forEach(async (file) => {
		// 		response.data.expendituresheetitems?.map(async (item: any) => {
		// 			await postFormData(
		// 				`/payments/expendituresheetattachments/create/`,
		// 				{
		// 					expendituresheetitem_id: item?.id,
		// 					file: file,
		// 				}
		// 			);
		// 		});
		// 	});
		if (response.status >= 200 && response.status < 300) {
			esReset();
			navigate(-1);
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "ExpenditureSheet Edited Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(getExpenditureSheet(params));
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

export const ExpenditureSheetCheckApproval = createAsyncThunk<
	any,
	{
		expendituresheetitem_id: string | number;
	}
>("project/ExpenditureSheetCheckApproval", async (payload, { dispatch }) => {
	const { expendituresheetitem_id } = payload;
	try {
		const response = await postAdd(
			`/payments/checkapprove/expendituresheet/`,
			{
				expendituresheetitem_id,
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

export const ExpenditureSheetApproval = createAsyncThunk<
	any,
	{
		data: any;
		id: string;
	}
>("project/ExpenditureSheetApproval", async (payload, { dispatch }) => {
	const { data, id } = payload;
	try {
		Swal.showLoading();
		const response = await postAdd(
			`/payments/approve/expendituresheet/`,
			data
		);
		if (response.status >= 200 && response.status < 300) {
			if (response.data.approved_status == 2) {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Expenditure Sheet Approved Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			} else if (response.data.approved_status == 3) {
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Expenditure Sheet Rejected Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}
			dispatch(getExpenditureSheetById({ id: id }));
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
