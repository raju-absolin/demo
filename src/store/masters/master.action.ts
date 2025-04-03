import { createAsyncThunk } from "@reduxjs/toolkit";
import { getList } from "../../helpers/Helper";
import { MenuItemsPayload } from "./master.types";
import { AsyncThunkConfig } from "../../common/common.types";
import { enqueueSnackbar } from "notistack";
import { MenuItem, MenuItemTypes, SubMenuItem } from "@src/common/menu-items";

export const allMenus = createAsyncThunk<
	any, // Return type of the fulfilled action
	void, // Argument passed to the thunk function
	{ rejectValue: AsyncThunkConfig } // AsyncThunkConfig (with rejectValue for error handling)
>("/allMenus", async (payload, { rejectWithValue }) => {
	try {
		const response = await getList(`/master/usermenu/`);
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
		const response = await getList(`/master/user_menu/${code}`);
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
