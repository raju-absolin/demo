import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    addParams,
    getList,
    getParamsList,
    postAdd,
    postDelete,
    postEdit,
} from "@src/helpers/Helper";
import { Customers, CustomersInitialState, SubmitPayload } from "./customer.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";

export const getCustomers = createAsyncThunk<
    {
        response: {
            results: Customers[];
            count: number;
        };
        params: CustomersInitialState["pageParams"];
    },
    CustomersInitialState["pageParams"]
>("/getCustomers", async (payload) => {
    var params = addParams(payload);
    try {
        const response = await getParamsList("/masters/customers/", params);
        if (response) {
            return { response, params: payload };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
});

export const getCustomersById = createAsyncThunk<
    {
        response: Customers
    },
    { id?: string }
>("/getCustomersById", async (payload) => {
    const { id } = payload;
    try {
        const response = await getList(`/masters/customers/${id}`);
        if (response) {
            return { response: response.data };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw error.message;
    }
});

export const addCustomers = createAsyncThunk<

    { name: string; },
    { obj: SubmitPayload; }
>("/addCustomers", async (payload, { dispatch }) => {
    try {
        const response = await postAdd(`/masters/customers/`, payload.obj);
        if (response.status >= 200 && response.status < 300) {
            Swal.fire({
                title: `<p style="font-size:20px">Customers Added Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            // payload.clearDataFn();
            // payload.navigate("/pages/masters/customers", {
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
export const editCustomers = createAsyncThunk<
    void,
    { obj: SubmitPayload; }
>("/editCustomers", async (payload, { dispatch }) => {
    try {
        const response2 = await postEdit(
            "/masters/customers/" + payload.obj.id,
            payload.obj
        );
        if (response2.status == 200) {
            Swal.fire({
                title: `<p style="font-size:20px">Customers Edited Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            // payload.clearDataFn();
            // payload.navigate("/pages/masters/customers", {
            //     replace: true,
            // });
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
export const deleteCustomers = createAsyncThunk<
    void,
    { id: string; clearDataFn: Function; navigate: Function; params: PageParamsTypes; }
>("/deleteCustomers", async (payload, { dispatch }) => {
    try {
        const { params } = payload;
        const response2 = await postDelete("/masters/customers/" + payload.id);
        if (response2.status == 204) {
            Swal.fire({
                title: `<p style="font-size:20px">Customer Deleted Successfully</p>`,
                icon: "success",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });
            dispatch(getCustomers(params));
            payload.clearDataFn();
            // payload.navigate("/pages/masters/customers");
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