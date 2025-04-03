import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    addParams,
    getList,
    getParamsList,
    postAdd,
    postDelete,
    postEdit,
} from "@src/helpers/Helper";
import { Tax, SubmitPayload } from "./tax.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getTax = createAsyncThunk<
    {
        response: {
            results: Tax[];
            count: number;
        };
        params: PageParamsTypes;
    },
    { search?: string; page: number; page_size: number }
>("/getTax", async (payload) => {
    var params = addParams(payload);
    try {
        const response = await getParamsList("/masters/taxs/", params);
        if (response) {
            return { response, params };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
});

export const getTaxById = createAsyncThunk<
    {
        response: Tax
    },
    { id: string }
>("/getTaxById", async (payload) => {
    const { id } = payload;
    try {
        const response = await getList(`/masters/taxs/${id}`);
        if (response) {
            return { response: response.data };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw error.message;
    }
});



export const addTax = createAsyncThunk<

    { name: string; },
    { obj: { name: string }; pageParams: any; clearDataFn: Function; navigate: Function }
>("/addTax", async (payload, { dispatch }) => {
    try {
        const response = await postAdd(`/masters/taxs/`, payload.obj);
        if (response.status >= 200 && response.status < 300) {
            dispatch(
                getTax({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            Swal.fire({
                title: `<p style="font-size:20px">Tax Added Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            payload.clearDataFn();
            payload.navigate("/pages/masters/tax", {
                replace: true,
            });
            return response.data;
        } else {
            throw new Error(response.data);
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
export const editTax = createAsyncThunk<
    void,
    { obj: { id: string, name: string, tax: string }; clearDataFn: Function; navigate: Function; pageParams: any; }
>("/editTax", async (payload, { dispatch }) => {
    try {
        const response2 = await postEdit(
            "/masters/taxs/" + payload.obj.id,
            payload.obj
        );
        if (response2.status == 200) {
            dispatch(
                getTax({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            Swal.fire({
                title: `<p style="font-size:20px">Tax Edited Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            payload.clearDataFn();
            payload.navigate("/pages/masters/tax", {
                replace: true,
            });
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
export const deleteTax = createAsyncThunk<
    void,
    { id: string; clearDataFn: Function; navigate: Function; }
>("/deleteTax", async (payload, { dispatch }) => {
    try {
        const response2 = await postDelete("/masters/taxs/" + payload.id);
        if (response2.status == 204) {
            Swal.fire({
                title: `<p style="font-size:20px">Tax deleted Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            dispatch(
                getTax({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            payload.clearDataFn();
            // payload.navigate("/pages/masters/tax");
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
