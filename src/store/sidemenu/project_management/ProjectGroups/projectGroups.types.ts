import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import { WorkOrder } from "../work_order/work_order.types";

export interface GroupPayload {
	project_id: string;
	name: string;
}
export interface GroupUserPayload {
	group_id: string;
	user_id: string;
}
export interface Group {
	id?: string;
	name?: string;
	code?: string;
	project?: {
		id: string;
		name: string;
	};
}
export interface GroupUser {
	id?: string;
	code?: string;
	group?: {
		id: string;
		name: string;
	};
	user?: {
		id: string;
		fullname: string;
	};
}

export interface ProjectGroupsState extends BaseInitialState {
	list: Group[];
	count: number;
	selectedData: Group;
	modal: boolean;
	group_user_modal: boolean;
	group_user_loading: boolean;
	group_users_list: GroupUser[];
	group_users_count: number;
	group_users_params: PageParamsTypes & {
		end_date?: string;
		start_date?: string;
		user?: miniType | null;
		group: string;
	};
	showUserAdd: boolean;
	selectedGroupUser: GroupUser;
	isFilterOpen: boolean;
	pageParams: PageParamsTypes & {
		end_date?: string;
		start_date?: string;
		project?: string;
	};
}
