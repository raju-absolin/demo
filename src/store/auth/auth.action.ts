import { postLogin, postLogout } from "@src/helpers/Helper";
import { LoginData, LoginPayload } from "./auth.types";
import { AsyncThunkConfig } from "../../common/common.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { removeToken } from "@src/helpers/AxiosHelper";

// Define the thunk action with Axios request
export const login = createAsyncThunk<
	LoginData, // Return type of the fulfilled action
	LoginPayload, // Argument passed to the thunk function
	{ rejectValue: AsyncThunkConfig } // AsyncThunkConfig (with rejectValue for error handling)
>("auth/login", async (payload, { rejectWithValue }) => {
	const { data, redirectUrl, navigate, enqueueSnackbar } = payload;
	try {
		const response = await postLogin("/users/login/", data);

		// Check for error status and throw an error with a meaningful message
		if (response.status >= 300) {
			throw response;
		}

		// store tokens in local storage
		const tokens = response.data.tokens;
		localStorage.setItem("access_token", tokens.access);
		localStorage.setItem("currentToken", tokens.refresh);
		localStorage.setItem("User_full_name", response.data.full_name);
		localStorage.setItem("username", response.data.username);
		localStorage.setItem("user_type", response.data.user_type);

		// navigate to dashboard
		navigate(redirectUrl);

		// show error snackbar
		enqueueSnackbar("Welcome To Spruce Engineering", {
			variant: "success",
		});

		// Return the data you want to store in Redux, not the entire AxiosResponse
		return response.data;
	} catch (err: any) {
		// Handle known errors

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

// Define the thunk action with Axios request
export const logout = createAsyncThunk<
	string,
	{ refresh: string },
	{ rejectValue: AsyncThunkConfig }
>("auth/logout", async (payload, { rejectWithValue }) => {
	const { refresh } = payload;
	try {
		await postLogout("/users/logout/", {
			refresh,
		});
		removeToken();
		return "User Logged Out";
	} catch (err: any) {
		// Handle known errors
		if (err.response && err.response.data) {
			return rejectWithValue({
				rejectValue: err.response.data.detail, // Assuming error message is in response
			});
		}
		throw new Error(err.message || "An unexpected error occurred");
	}
});
