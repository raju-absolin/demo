import { createAsyncThunk } from "@reduxjs/toolkit";
import { getList, postAdd } from "../../helpers/Helper";
import { MenuItemsPayload } from "./system.types";
import { AsyncThunkConfig } from "../../common/common.types";
import { enqueueSnackbar } from "notistack";
import { MenuItem, MenuItemTypes, SubMenuItem } from "@src/common/menu-items";
import { formatErrorMessage } from "../sidemenu/errorMsgFormat";

export const allMenus = createAsyncThunk<
	any, // Return type of the fulfilled action
	void, // Argument passed to the thunk function
	{ rejectValue: AsyncThunkConfig } // AsyncThunkConfig (with rejectValue for error handling)
>("/allMenus", async (payload, { rejectWithValue }) => {
	try {
		const response = await getList(`/system/usermenu/`);
		return response;
	} catch (err: any) {
		console.log(err);
		if (err && err.data) {
			// show error snackbar
			enqueueSnackbar(err.data.detail || "An unexpected error occurred", {
				variant: "error",
			});
			return rejectWithValue({
				rejectValue: err.data.detail, // Assuming error message is in response
			});
		}
		// If no response or specific error, throw a general error
		throw new Error(err.message || "An unexpected error occurred");
	}
});
export const getMenuItems = createAsyncThunk<
	{
		from: string;
		response: {
			id?: string;
			code?: string;
			name?: string;
			submenus?: SubMenuItem[];
			menuitems?: MenuItem[];
			erp_id?: string | null;
			erp_code?: string | null;
			created_on?: string;
			modified_on?: string;
			is_deleted?: boolean;
			created_by?: string | null;
			modified_by?: string | null;
		};
	},
	MenuItemsPayload,
	{
		rejectValue: AsyncThunkConfig;
	}
>("/getMenuItems", async (payload, { rejectWithValue }) => {
	const { code, from } = payload;
	try {
		const response = await getList(`/system/user_menu/${code}`);
		return { from, response: response.data };
	} catch (err: any) {
		console.log(err);
		if (err && err.data) {
			// show error snackbar
			enqueueSnackbar(err.data.detail || "An unexpected error occurred", {
				variant: "error",
			});
			return rejectWithValue({
				rejectValue: err.data.detail, // Assuming error message is in response
			});
		}
		// If no response or specific error, throw a general error
		throw new Error(err.message || "An unexpected error occurred");
	}
});

export const getUserPermissions = createAsyncThunk<
	string[],
	void,
	{
		rejectValue: AsyncThunkConfig;
	}
>("/getUserPermissions", async (payload, { rejectWithValue }) => {
	try {
		const response = await getList(`/users/userpermissions/`);
		if (response) {
			return response.data;
		} else {
			throw new Error(response);
		}
	} catch (err: any) {
		console.error(err);
		if (err && err.data) {
			// show error snackbar
			enqueueSnackbar(err.data.detail || "An unexpected error occurred", {
				variant: "error",
			});
			return rejectWithValue({
				rejectValue: err.data.detail, // Assuming error message is in response
			});
		}
		// If no response or specific error, throw a general error
		throw new Error(err.message || "An unexpected error occurred");
	}
});
export const postRecentActivity = createAsyncThunk<
	string[],
	{
		menuitem_id: string;
	},
	{
		rejectValue: AsyncThunkConfig;
	}
>("/postRecentActivity", async (payload, { rejectWithValue }) => {
	try {
		const response = await postAdd(`/system/recentactivity/`, payload);
		if (response) {
			return response.data;
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(formattedErrResult || "Unexpected Error Occured", {
			variant: "error",
		});
		// If no response or specific error, throw a general error
		throw new Error(error.message || "An unexpected error occurred");
	}
});
