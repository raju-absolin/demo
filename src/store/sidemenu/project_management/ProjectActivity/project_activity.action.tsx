import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    addParams,
    getList,
    getParamsList,
    postAdd,
    postEdit,
} from "@src/helpers/Helper";
import { Project } from "./project_activity.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";


export const getProjectActivityList = createAsyncThunk<
    {
        response: {
            results: Project[];
            count: number;
        };
        params: PageParamsTypes;
    },
    { project ?:string; search?: string; page: number; page_size: number; id?: string }
>("users/getProjectActivityList", async (payload) => {
    var params = addParams(payload);
    try {
        const response = await getParamsList(
            "/system/activitylog/" ,
            params
        );
        if (response) {
            return { response, params };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
});
