import { combineReducers } from "@reduxjs/toolkit";
import tasksSlice from "./tasks/tasks.slice";
import mileStonesSlice from "./milestones/milestones.slice";

export const taskManagement = combineReducers({
	tasks: tasksSlice,
	mileStones: mileStonesSlice,
});
