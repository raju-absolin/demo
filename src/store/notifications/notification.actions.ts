import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postEdit,
} from "@src/helpers/Helper";
import { setNotificationActive, setSuccessMessage } from "./notification.slice";
import Swal from "sweetalert2";
import { NotificationState } from "./notification.types";

// Async Thunks
export const fetchNotificationList = createAsyncThunk<
	{
		response: {
			results: NotificationState["notifications"];
			count: number;
		};
		params: NotificationState["pageParams"];
	},
	NotificationState["pageParams"]
>(
	"notification/fetchNotificationList",
	async (payload, { rejectWithValue }) => {
		try {
			var params = addParams(payload);
			const response = await getParamsList(
				"/system/Notification/",
				params
			);
			return { response, params };
		} catch (error) {
			return rejectWithValue((error as Error).message);
		}
	}
);

export const markNotificationRead = createAsyncThunk<
	void,
	{
		notificationId: string | number;
		params: NotificationState["pageParams"];
	}
>(
	"notification/markNotificationRead",
	async ({ notificationId, params }, { dispatch, rejectWithValue }) => {
		try {
			const response = await postEdit(
				`/system/Notification/Clear/${notificationId}`,
				{}
			);
			if (response.status === 200) {
				dispatch(setNotificationActive(false));
				dispatch(fetchNotificationList(params));
				dispatch(setSuccessMessage("Notification read successfully!"));
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Sorry! Unable to update Notification. Please try again!",
				});
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Sorry! A server-side issue was encountered!",
			});
			return rejectWithValue((error as Error).message);
		}
	}
);
export const clearAllNotifications = createAsyncThunk<void>(
	"notification/clearAllNotifications",
	async (payload, { dispatch, rejectWithValue }) => {
		try {
			const response = await getList(`/system/Notification/AllClear/`);
			if (response.status === 200) {
				dispatch(
					fetchNotificationList({
						page: 1,
						page_size: 10,
						search: "",
						no_of_pages: 0,
					})
				);
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Sorry! Unable to update Notification. Please try again!",
				});
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Sorry! A server-side issue was encountered!",
			});
			return rejectWithValue((error as Error).message);
		}
	}
);
