import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@src/store/store";
import { login, logout } from "./auth.action";
import { authState } from "./auth.types";

// Define the initial state using that type

const initialState: authState = {
	error: "",
	data: {},
	message: null,
	loading: false,
	status: "",
	OTPSend: false,
	resendOTP: false,
	showResentOTP: false,
	pwdData: {},
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		resetAuth: () => {
			return { ...initialState };
		},
	},

	extraReducers: (builder) => {
		builder.addCase(login.pending, (state, { payload }) => {
			state.status = "login pending";
			state.loading = true;
		});
		builder.addCase(login.fulfilled, (state, { payload }) => {
			state.status = "login fulfilled";
			state.loading = false;
			state.data = payload; // assuming payload has the correct type
		});
		builder.addCase(login.rejected, (state, action) => {
			state.status = "login rejected";
			state.loading = false;
			if (action.payload) {
				// Ensure that rejectValue is always a string, with a fallback value
				state.error =
					action.payload.rejectValue || "An unknown error occurred";
			} else {
				// Provide a fallback for action.error.message in case it's undefined
				state.error =
					action.error?.message || "An unknown error occurred";
			}
		});
		builder.addCase(logout.pending, (state, { payload }) => {
			state.status = "logout pending";
			state.loading = true;
		});
		builder.addCase(logout.fulfilled, (state, { payload }) => {
			state.status = "logout fulfilled";
			state.loading = false;
			state.data = payload; // assuming payload has the correct type
		});
		builder.addCase(logout.rejected, (state, action) => {
			state.status = "logout rejected";
			state.loading = false;
			if (action.payload) {
				// Ensure that rejectValue is always a string, with a fallback value
				state.error =
					action.payload.rejectValue || "An unknown error occurred";
			} else {
				// Provide a fallback for action.error.message in case it's undefined
				state.error =
					action.error?.message || "An unknown error occurred";
			}
		});
	},
});

export const { resetAuth } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
