import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import customiseSlice from "./customise/customise";
import authSlice from "./auth/auth.slice";
import { AsyncThunkConfig, MyKnownError } from "../common/common.types";
import systemSlice from "./system/system.slice";
import miniSlice from "./mini/mini.Slice";
import { settingsReducer } from "./settings/setting.combine_reducer";
import { tenderManagementReducer } from "./sidemenu/tender_mangement/tender_management.state";
import mastersReducer from "./masters/masters.reducer";
import { strategicManagement } from "./sidemenu/strategic_management/strategic_mangement.state";
import reportsSlice from "./reports/reports.slice";
import notificationSlice from "./notifications/notification.slice";
import { projectManagement } from "./sidemenu/project_management/project_mangement.state";
import userProfileSlice from "./userprofile/profile.slice";
import fileSystemSlice from "./sidemenu/file_system/fs.slice";
import { taskManagement } from "./sidemenu/task_management";
import { serviceManagement } from "./sidemenu/service_management/service_management.state";

export const store = configureStore({
	reducer: {
		customise: customiseSlice,
		auth: authSlice,
		system: systemSlice,
		settings: settingsReducer,
		mini: miniSlice,
		tenderManagement: tenderManagementReducer,
		masters: mastersReducer,
		strategicManagement: strategicManagement,
		reports: reportsSlice,
		notification: notificationSlice,
		projectManagement: projectManagement,
		userProfile: userProfileSlice,
		taskManagement: taskManagement,
		serviceManagement: serviceManagement,
		fileSystem: fileSystemSlice,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
	state: RootState;
	dispatch: AppDispatch;
	rejectValue: AsyncThunkConfig;
	extra: { s: string; n: number };
}>();
