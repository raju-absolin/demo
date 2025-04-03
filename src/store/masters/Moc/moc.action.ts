import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
} from "@src/helpers/Helper";
import { Moc, SubmitPayload } from "./moc.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getMoc = createAsyncThunk<
	{
		response: {
			results: Moc[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getMoc", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList("/masters/moc/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const getMocById = createAsyncThunk<
	{
		response: Moc;
	},
	{ id: string }
>("/getMocById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/masters/moc/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addMoc = createAsyncThunk<
	{ name: string },
	{
		obj: { name: string };
		pageParams: any;
		clearDataFn: Function;
		navigate: Function;
	}
>("/addMoc", async (payload, { dispatch }) => {
	try {
		const response = await postAdd(`/masters/moc/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(
				getMoc({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">Moc Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			payload.navigate("/pages/masters/moc", {
				replace: true,
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
export const editMoc = createAsyncThunk<
	void,
	{
		obj: { id: number; name: string };
		clearDataFn: Function;
		navigate: Function;
		pageParams: any;
	}
>("/editMoc", async (payload, { dispatch }) => {
	try {
		const response2 = await postEdit(
			"/masters/moc/" + payload.obj.id,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(
				getMoc({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			Swal.fire({
				title: `<p style="font-size:20px">Moc Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			payload.clearDataFn();
			payload.navigate("/pages/masters/moc", {
				replace: true,
			});
		} else {
			throw new Error(response2 as any);
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
export const getMocsMini = createAsyncThunk<
	{
		response: {
			results: Moc[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("/getMocsMini", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/masters/mocs/mini/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const deleteMOC = createAsyncThunk<
	void,
	{ id: string; clearDataFn: Function; navigate: Function }
>("/deleteMOC", async (payload, { dispatch }) => {
    try {
        const response2 = await postDelete("/masters/moc/" + payload.id);
        if (response2.status == 204) {
            Swal.fire({
                title: `<p style="font-size:20px">Moc Deleted Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            dispatch(
                getMoc({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            payload.clearDataFn();
            // payload.navigate("/pages/masters/moc");
        } else {
            throw new Error(response2 as any);
        }
    } catch (error: any) {
        const errResult = formatErrorMessage(error.response.data);
        const formattedErrResult = errResult.replace(/\n/g, '<br>');
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
