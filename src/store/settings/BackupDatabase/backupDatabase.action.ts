import { createAsyncThunk } from "@reduxjs/toolkit";
// Login Redux States

// AUTH related methods
import {
    postAdd,
    getList,
    getParamsList,
    postEdit,
    patchEdit,
    postDelete,
    getDownloadFile,
    addParams,
} from "@src/helpers/Helper";
import { backUpDataBaselist,BackupDatabaseInitialState,backUpDataBaseParams } from "./backupDatabase.types";
import { PageParamsTypes } from "@src/common/common.types";

export const getBackUpDataBaseList = createAsyncThunk<
	{
		response: {
			results: backUpDataBaselist[];
			count: number;
		};
		params: PageParamsTypes;
	},
	{ search?: string; page: number; page_size: number }
>("getBackUpDataBaseList", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/system/Database/Backup", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});


export const getDataBaseBackUP = createAsyncThunk(
    "/getDataBaseBackUP",
    async (payload) => {
        try {
            const response = await getList("/system/Database/DoBackup");
            if (response) {
                return { response: response.data }
            } else {
                throw new Error(response);
            }
        } catch (error: any) {
            return error.message;
        }
    }
);

export const DataBaseVerifyPassword = createAsyncThunk<
    void,
    { obj: any; dataBaseId: string; }
>("/DataBaseVerifyPassword",
    async (payload) => {
        const { dataBaseId, onSuccess, onFailure } = addParams(payload);
        try {
            const response = await postAdd("/system/Database/downloadBackup/" + payload.dataBaseId, payload.obj);
            if (response) {
                onSuccess(response.data);
                window.location.href = response.data.file_url;
                return response.data;
            } else {
                throw new Error(response);
            }
        } catch (error: any) {
            if (error.response) {
                onFailure(error.response.data);
                throw error.response.data;
            } else {
                onFailure("Sorry! Getting from server side issue!");
                throw error.message;
            }
        }
    }
);




