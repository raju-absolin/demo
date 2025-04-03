import { createAsyncThunk } from "@reduxjs/toolkit";
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
	BudgetQuotationsState,
	BudgetQuotation,
	RequestDataPayload,
} from "./bq.types";
import Swal from "sweetalert2";
import { formatErrorMessage } from "../../errorMsgFormat";
import { FileType } from "@src/components";

export const getBudgetQuotations = createAsyncThunk<
	{
		response: {
			results: BudgetQuotation[];
			count: number;
		};
		params: BudgetQuotationsState["pageParams"];
	},
	BudgetQuotationsState["pageParams"]
>("budgetQuotation/getBudgetQuotations", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList(
			"/leads/budgetquotations/",
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

export const getBudgetQuotationById = createAsyncThunk<
	{
		response: BudgetQuotation;
	},
	{ id: string }
>("budgetQuotation/getBudgetQuotationById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/leads/budgetquotations/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postBudgetQuotationData = createAsyncThunk<
	any,
	{
		data: RequestDataPayload;
		params: BudgetQuotationsState["pageParams"];
		resetBudgetQuotationForm: any;
		documents: FileType[];
		VECattachments: FileType[];
	}
>("budgetQuotation/postBudgetQuotationData", async (payload, { dispatch }) => {
	const {
		data,
		params,
		resetBudgetQuotationForm,
		documents,
		VECattachments,
	} = payload;
	try {
		const response = await postAdd(`/leads/budgetquotations/create/`, {
			...data,
		});
		if (documents) {
			for (let document of documents) {
				try {
					if (document?.originalObj && !document?.dodelete) {
						await postFormData(
							`/leads/budgetaryquotationdocuments/create/`,
							{
								budgetary_quotation_id: response.data.id,
								file: document?.originalObj,
							}
						);
					}
					if (!document?.originalObj && document?.dodelete) {
						await postDelete(
							`/leads/budgetaryquotationdocuments/${document?.id}/`
						);
					}
				} catch (error) {
					throw new Error(
						"Error While Uploading Vendor Evaluation Criteria Document"
					);
				}
			}
		}

		if (VECattachments.length > 0) {
			for (let file of VECattachments) {
				try {
					if (file?.originalObj && !file?.dodelete) {
						await postFormData(
							`/leads/vendorevaluationcriteriadocuments/create/`,
							{
								budgetary_quotation_id: response.data.id,
								file: file?.originalObj,
							}
						);
					}
					if (!file?.originalObj && file?.dodelete) {
						await postDelete(
							`/leads/vendorevaluationcriteriadocuments/${file?.id}/`
						);
					}
					// if (!file?.file) {
					// 	await postDelete(
					// 		`/leads/vendorevaluationcriteriadocuments/${file?.id}/`
					// 	);
					// }
				} catch (error) {
					throw new Error(
						"Error While Uploading Vendor Evaluation Criteria Document"
					);
				}
			}
		}
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: `Budget Quotation created successfully`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			resetBudgetQuotationForm();
			dispatch(getBudgetQuotations(params));
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

export const editBudgetQuotationData = createAsyncThunk<
	any,
	{
		id: number | string;
		data: RequestDataPayload;
		params: BudgetQuotationsState["pageParams"];
		resetBudgetQuotationForm: any;
		documents: FileType[];
		VECattachments: FileType[];
	}
>("budgetQuotation/editBudgetQuotationData", async (payload, { dispatch }) => {
	const {
		id,
		data,
		params,
		resetBudgetQuotationForm,
		documents,
		VECattachments,
	} = payload;
	try {
		const response = await postEdit(`/leads/budgetquotations/${id}/`, {
			...data,
		});

		console.log(documents);
		if (documents) {
			for (let document of documents) {
				try {
					if (document?.originalObj && !document?.dodelete) {
						await postFormData(
							`/leads/budgetaryquotationdocuments/create/`,
							{
								budgetary_quotation_id: response.data.id,
								file: document?.originalObj,
							}
						);
					}
					if (!document?.originalObj && document?.dodelete) {
						await postDelete(
							`/leads/budgetaryquotationdocuments/${document?.id}/`
						);
					}
				} catch (error) {
					throw new Error(
						"Error While Uploading Vendor Evaluation Criteria Document"
					);
				}
			}
		}

		if (VECattachments.length > 0) {
			for (let file of VECattachments) {
				try {
					if (file?.originalObj && !file?.dodelete) {
						await postFormData(
							`/leads/vendorevaluationcriteriadocuments/create/`,
							{
								budgetary_quotation_id: response.data.id,
								file: file?.originalObj,
							}
						);
					}
					if (!file?.originalObj && file?.dodelete) {
						await postDelete(
							`/leads/vendorevaluationcriteriadocuments/${file?.id}/`
						);
					}
					// if (!file?.file) {
					// 	await postDelete(
					// 		`/leads/vendorevaluationcriteriadocuments/${file?.id}/`
					// 	);
					// }
				} catch (error) {
					throw new Error(
						"Error While Uploading Vendor Evaluation Criteria Document"
					);
				}
			}
		}
		if (response.status >= 200 && response.status < 300) {
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: `Budget Quotation Updated successfully`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			resetBudgetQuotationForm();
			dispatch(getBudgetQuotations(params));
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
