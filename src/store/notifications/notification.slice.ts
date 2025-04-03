import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	clearAllNotifications,
	fetchNotificationList,
	markNotificationRead,
} from "./notification.actions";
import { NotificationState } from "./notification.types";
import { RootState } from "../store";

const initialState: NotificationState = {
	notifications: [],
	count: 0,
	loading: false,
	openNotification: false,
	error: "",
	status: "",
	active: false,
	successMessage: null,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
	},
};

// Create a slice for notifications
const notificationSlice = createSlice({
	name: "notification",
	initialState,
	reducers: {
		setNotificationActive: (state, action: PayloadAction<boolean>) => {
			state.active = action.payload;
		},
		setSuccessMessage: (state, action: PayloadAction<string | null>) => {
			state.successMessage = action.payload;
		},
		setOpenNotification: (state, action) => {
			state.openNotification = action.payload;
		},
		clearNotification: () => {
			return initialState;
		},
	},
	extraReducers: (builder) => {
		builder
			// Handle fetchNotificationList states
			.addCase(fetchNotificationList.pending, (state) => {
				state.status = "fetchNotificationList pending";
				state.loading = true;
				state.error = "";
			})
			.addCase(fetchNotificationList.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "fetchNotificationList fulfilled";
				state.loading = false;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.notifications, ...response.results];
				}
				state.notifications = list;
				state.count = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(fetchNotificationList.rejected, (state, action) => {
				state.status = "fetchNotificationList rejected";
				state.loading = false;
				state.error = action.payload as string;
			})
			// Handle markNotificationRead states
			.addCase(markNotificationRead.pending, (state) => {
				state.status = "markNotificationRead pending";
				state.loading = true;
			})
			.addCase(markNotificationRead.fulfilled, (state) => {
				state.status = "markNotificationRead fulfilled";
				state.loading = false;
			})
			.addCase(markNotificationRead.rejected, (state, action) => {
				state.status = "markNotificationRead rejected";
				state.loading = false;
				state.error = action.payload as string;
			})
			// Handle markNotificationRead states
			.addCase(clearAllNotifications.pending, (state) => {
				state.status = "clearAllNotifications pending";
				state.loading = true;
			})
			.addCase(clearAllNotifications.fulfilled, (state) => {
				state.status = "clearAllNotifications fulfilled";
				state.loading = false;
			})
			.addCase(clearAllNotifications.rejected, (state, action) => {
				state.status = "clearAllNotifications rejected";
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

// Export actions and reducer
export const {
	setNotificationActive,
	setSuccessMessage,
	setOpenNotification,
	clearNotification,
} = notificationSlice.actions;

export const NotificationSelector = (state: RootState) => state.notification;

export default notificationSlice.reducer;
