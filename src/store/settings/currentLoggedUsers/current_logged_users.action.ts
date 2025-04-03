import { addParams, getParamsList } from "@src/helpers/Helper";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { formatErrorMessage } from "@src/store/sidemenu/errorMsgFormat";
import { enqueueSnackbar } from "notistack";
import { CurrentLoggedUsersInitialState } from "./current_logged_users.types";
import { User } from "../manageUsers/manage_users.types";

export const getLoggedInUsers = createAsyncThunk<
	{
		response: {
			results: User[];
			count: number;
		};
		params: CurrentLoggedUsersInitialState["pageParams"];
	},
	CurrentLoggedUsersInitialState["pageParams"]
>("/getLoggedInUsers", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/users/logged_in_users/", params);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(formattedErrResult || "Unexpected Error Occured", {
			variant: "error",
		});
		throw new Error(error.message);
	}
});
