import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    addParams,
    getList,
    getParamsList,
    postAdd,
    postEdit,
} from "@src/helpers/Helper";
import { scheduleReports } from "./schedulereports.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";

export const getScheduleReports = createAsyncThunk<
    {
        response: {
            results: scheduleReports[];
            count: number;
        };
        params: PageParamsTypes;
    },
    { search?: string; page: number; page_size: number }
>("getScheduleReports", async (payload) => {
    var params = addParams(payload);
    try {
        const response = await getParamsList("/reports/scheduledemail/", params);
        if (response) {
            return { response, params };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
});

export const startDeleteScheduleReportById = createAsyncThunk<
    {
        response: scheduleReports;
    },
    { id: string }
>("startDeleteScheduleReportById", async (payload) => {
    const { id } = payload;
    try {
        const response = await getList(`/reports/ScheduledEmail/${id}`);
        if (response) {
            return { response: response.data };
        } else {
            throw new Error(response);
        }
    } catch (error: any) {
        throw error.message;
    }
});