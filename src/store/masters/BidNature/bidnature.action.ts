import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    addParams,
    getList,
    getParamsList,
    postAdd,
    postDelete,
    postEdit,
} from "@src/helpers/Helper";
import { BidNature, SubmitPayload } from "./bidnature.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getBidNature = createAsyncThunk<
    {
        response: {
            results: BidNature[];
            count: number;
        };
        params: PageParamsTypes;
    },
    { search?: string; page: number; page_size: number }
>("/getBidNature", async (payload) => {
    var params = addParams(payload);
    try {
        const response = await getParamsList("/masters/sourceportal/", params);
        if (response) {
            return { response, params };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
});

export const getBidNatureById = createAsyncThunk<
    {
        response: BidNature
    },
    { id?: string | number }
>("/getBidNatureById", async (payload) => {
    const { id } = payload;
    try {
        const response = await getList(`/masters/sourceportal/${id}`);
        if (response) {
            return { response: response.data };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw error.message;
    }
});



export const addBidNature = createAsyncThunk<

    { name: string; },
    { obj: { name: string }; pageParams: any; clearDataFn: Function; navigate: Function }
>("/addBidNature", async (payload, { dispatch }) => {
    try {
        const response = await postAdd(`/masters/sourceportal/`, payload.obj);
        if (response.status >= 200 && response.status < 300) {
            dispatch(
                getBidNature({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            Swal.fire({
                title: `<p style="font-size:20px">Source Portal Added Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            payload.clearDataFn();
            payload.navigate("/pages/masters/sourceportal", {
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
export const editBidNature = createAsyncThunk<
    void,
    { obj: { id: string, name: string }; clearDataFn: Function; navigate: Function; pageParams: any; }
>("/editBidNature", async (payload, { dispatch }) => {
    try {
        const response2 = await postEdit(
            "/masters/sourceportal/" + payload.obj.id,
            payload.obj
        );
        if (response2.status == 200) {
            dispatch(
                getBidNature({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            Swal.fire({
                title: `<p style="font-size:20px">Source Portal Edited Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            payload.clearDataFn();
            payload.navigate("/pages/masters/sourceportal", {
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

export const deleteBidnature = createAsyncThunk<
    void,
    { id: string; clearDataFn: Function; navigate: Function; }
>("/deleteBidnature", async (payload, { dispatch }) => {
    try {
        const response2 = await postDelete("/masters/sourceportal/" + payload.id);
        if (response2.status == 204) {
            Swal.fire({
                title: `<p style="font-size:20px">Source Portal deleted Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            dispatch(
                getBidNature({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            payload.clearDataFn();
            payload.navigate("/pages/masters/sourceportal");
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
