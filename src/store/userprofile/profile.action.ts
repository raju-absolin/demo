import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import {
	UserProfile,
	UserProfileFormData,
	UserProfileInitialState,
} from "./profile.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { User } from "../settings/manageUsers/manage_users.types";

export const getUserDetails = createAsyncThunk("/getUser", async (payload) => {
	try {
		const response = await getList(`/users/iamuser/`);
		return response.data;
	} catch (err) {
		return err;
	}
});

export const getUserLogList = createAsyncThunk<
	{
		response: {
			results: [];
			count: number;
		};
		params: UserProfileInitialState["profileActivityParams"];
	},
	UserProfileInitialState["profileActivityParams"]
>("profile/getUserLogList", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/users/devicelog/me/", params);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const getUserDeviceList = createAsyncThunk<
	{
		response: {
			results: [];
			count: number;
		};
		params: UserProfileInitialState["profileDeviceParams"];
	},
	UserProfileInitialState["profileDeviceParams"]
>("profile/getUserDeviceList", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/users/userdevices/me", params);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const ChangePasswordSubmit = createAsyncThunk<
	any,
	{
		data: any;
		reset: any;
	}
>("users/ChangePasswordSubmit", async (payload, { dispatch }) => {
	const { data, reset } = payload;
	try {
		const response = await postEdit(`/users/changepassword/`, { ...data });
		if (response.status >= 200 && response.status < 300) {
			reset();
			Swal.fire({
				title: `<p style="font-size:20px">Password changed Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});

			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		if (error.response.status === 400) {
			var msg = "";
			if (error.response.data.old_password) {
				// msg = "Your old password is incorrect"
				msg = error.response.data.old_password.join(", ");
			} else if (error.response.data.Message) {
				msg = error.response.data.Message[0];
			} else {
				msg = "Please check your input";
			}
			Swal.fire({
				title: `<p style="font-size:20px">${msg}</p>`,
				icon: "error",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">${error.response}</p>`,
				icon: "error",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}

		throw error.message;
	}
});
