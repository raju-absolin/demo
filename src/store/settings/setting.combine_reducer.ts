import { combineReducers } from "@reduxjs/toolkit";
import manageProfileSlice from "./manageGroups/manage_groups.slice";
import manageUserSlice from "./manageUsers/manage_users.slice";
import appsettingsSlice from "./appSettings/appsettings.slice";
import globalVariableSlice from "./globalVariables/global_variables.slice";

import importExportSlice from "./ImportExport/importExportSlice";
import backupDatabaseSelector from "./BackupDatabase/backupDatabase.slice";
import synchronizationSelector from "./Synchronization/synchronization.slice";
import schedlueReportsSelector from "./ScheduleReports/schedulereports.slice";
import UserTypeSelector from "./Permissions/UserType/usertype.slice";
import AssigneeSelector from "./Permissions/Assignees/assignee.slice";
import ApprovalSelector from "./Permissions/Approvals/approval.slice";
import departmentUsersSlice from "./Permissions/DepartmentUsers/department_users.slice";
import dataPermissionsSlice from "./DataPermissions/dataPermissionSlice";
import authorizationSlice from "./Authorization/authorization.slice";
import loggedUserSlice from "./currentLoggedUsers/current_logged_users.slice";
import assigneUserSlice from "./AssignUsers/assignUsers.slice";

export const settingsReducer = combineReducers({
	manageProfile: manageProfileSlice,
	manageUser: manageUserSlice,
	departmentUsers: departmentUsersSlice,
	appSettings: appsettingsSlice,
	globalVariables: globalVariableSlice,
	importExport: importExportSlice,
	backupDatabase: backupDatabaseSelector,
	synchronization: synchronizationSelector,
	schedlueReport: schedlueReportsSelector,
	usertype: UserTypeSelector,
	assignee: AssigneeSelector,
	approval: ApprovalSelector,
	dataPermissions: dataPermissionsSlice,
	authorization: authorizationSlice,
	loggedUsers: loggedUserSlice,
	assigneUser: assigneUserSlice,
});
