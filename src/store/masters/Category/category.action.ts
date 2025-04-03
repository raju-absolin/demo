import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    addParams,
    getList,
    getParamsList,
    postAdd,
    postDelete,
    postEdit,
} from "@src/helpers/Helper";
import { Category, SubmitPayload } from "./category.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getCategory = createAsyncThunk<
    {
        response: {
            results: Category[];
            count: number;
        };
        params: PageParamsTypes;
    },
    { search?: string; page: number; page_size: number }
>("/getCategory", async (payload) => {
    var params = addParams(payload);
    try {
        const response = await getParamsList("/masters/categorys/", params);
        if (response) {
            return { response, params };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
});

export const getCategoryById = createAsyncThunk<
    {
        response: Category
    },
    { id: string }
>("/getCategoryById", async (payload) => {
    const { id } = payload;
    try {
        const response = await getList(`/masters/categorys/${id}`);
        if (response) {
            return { response: response.data };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw error.message;
    }
});



export const addCategory = createAsyncThunk<

    { name: string; },
    { obj: { name: string }; pageParams: any; clearDataFn: Function; navigate: Function }
>("/addCategory", async (payload, { dispatch }) => {
    try {
        const response = await postAdd(`/masters/categorys/`, payload.obj);
        if (response.status >= 200 && response.status < 300) {
            dispatch(
                getCategory({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            Swal.fire({
                title: `<p style="font-size:20px">Category Added Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            payload.clearDataFn();
            payload.navigate("/pages/masters/category", {
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
export const editCategory = createAsyncThunk<
    void,
    { obj: { id: string, name: string }; clearDataFn: Function; navigate: Function; pageParams: any; }
>("/editCategory", async (payload, { dispatch }) => {
    try {
        const response2 = await postEdit(
            "/masters/categorys/" + payload.obj.id,
            payload.obj
        );
        if (response2.status == 200) {
            dispatch(
                getCategory({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            Swal.fire({
                title: `<p style="font-size:20px">Category Edited Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            payload.clearDataFn();
            payload.navigate("/pages/masters/category", {
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
export const deleteCategory = createAsyncThunk<
    void,
    { id: string; clearDataFn: Function; navigate: Function; }
>("/deleteCategory", async (payload, { dispatch }) => {
    try {
        const response2 = await postDelete("/masters/categorys/" + payload.id);
        if (response2.status == 204) {
            Swal.fire({
                title: `<p style="font-size:20px">Category deleted Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            dispatch(
                getCategory({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            payload.clearDataFn();
            payload.navigate("/pages/masters/category");
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