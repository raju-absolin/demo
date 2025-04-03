import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "../manageUsers/manage_users.types";

interface AllContentType {
	id: number;
	name: string;
	contenttype: string;
}

export type ApiPayload = {
	id?: string;
	screen_id: number;
	level: number;
};

export interface ScreenAssigneUserPayload {
	id?: string;
	user_id: string | number;
	instance_id: string | number;
	description?: string;
	model_path: string;
}

export interface ScreenAssigneUser {
	id?: string;
	screen?: {
		id: number;
		app_label: string;
		model: string;
	};
	screen_id?: number;
	user?: User;
	instance_id?: string;
	description?: string;
}

export type AssigneUser = {
	id?: string;
	screen?: {
		id: number;
		app_label: string;
		model: string;
		label: string;
		value: number;
	} | null;
	level?: number;
	levelno?: number | string;
	user_or_group?: miniType;
	type?: miniType;
};

export interface AssigneUserInitialState extends BaseInitialState {
	selectedData: AssigneUser;
	selectedFormData: ScreenAssigneUser;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	assigneUserList: AssigneUser[];
	assigneUserCount: number;
	pageParams: PageParamsTypes & {
		screen?: string | number | null;
	};
	model: false;
	finalassigneUser: boolean;
	formRows: ScreenAssigneUser[];
	formRowsParams: PageParamsTypes & {
		model_path: string;
		screen: string | number;
		instance_id: string;
	};
	formRowsCount: number;
	formRowsLoading: boolean;

	viewModal: boolean;

	assigneUserHistory: any[];
	assigneUserHistoryCount: number;
	assigneUserHistoryLoading: boolean;
	assigneUserHistoryParams: PageParamsTypes & {
		screen?: string | number | null;
		authorized_by?: string | number | null;
		authorized_status?: string | number | null;
		authorized_level?: string | number | null;
	};

	checkAssigneUser: boolean;
	checkAssigneUserLoading: boolean;
	assigneUserPostLoading: boolean;
	authorized_level: number;
}
