import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    addParams,
    getList,
    getParamsList,
    postAdd,
    postEdit,
} from "@src/helpers/Helper";
import { Itemgroup, SubmitPayload } from "./itemgroup.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { getItems, getItemsWithChildrenList } from "../Item/item.action";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getItemgroup = createAsyncThunk<
    {
        response: {
            results: Itemgroup[];
            count: number;
        };
        params: PageParamsTypes;
    },
    { search?: string; page: number; page_size: number }
>("/getItemgroup", async (payload) => {
    var params = addParams(payload);
    try {
        const response = await getParamsList("/masters/itemgroup/", params);
        if (response) {
            return { response, params };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
});

export const getItemgroupById = createAsyncThunk<
    {
        response: Itemgroup
    },
    { id: string }
>("/getItemgroupById", async (payload) => {
    const { id } = payload;
    try {
        const response = await getList(`/masters/itemgroup/${id}`);
        if (response) {
            return { response: response.data };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw error.message;
    }
});



export const addItemgroup = createAsyncThunk<

    { name: string; },
    { obj: SubmitPayload; }
>("/addItemgroup", async (payload, { dispatch }) => {
    try {
        const response = await postAdd(`/masters/itemgroup/`, payload.obj);
        if (response.status >= 200 && response.status < 300) {
            dispatch(
                getItemsWithChildrenList({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            dispatch(
                getItems({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            Swal.fire({
                title: `<p style="font-size:20px">Group Added Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            // payload.clearDataFn();
            // payload.navigate("/pages/masters/itemgroup", {
            //     replace: true,
            // });
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
export const editItemgroup = createAsyncThunk<
    void,
    { obj: any; clearDataFn: Function; navigate: Function; pageParams: any; }
>("/editItemgroup", async (payload, { dispatch }) => {
    try {
        const response2 = await postEdit(
            "/masters/itemgroup/" + payload.obj.id,
            payload.obj
        );
        if (response2.status == 200) {
            dispatch(
                getItemgroup({
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            Swal.fire({
                title: `<p style="font-size:20px">Itemgroup Edited Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            payload.clearDataFn();
            payload.navigate("/pages/masters/itemgroup", {
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
