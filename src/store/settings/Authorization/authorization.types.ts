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

export interface ScreenAuthorizationPayload {
	id?: string;
	type: number | string;
	user_id: string;
	group_id: number;
	screen_id: number;
	level: number;
}

export interface ScreenAuthorization {
	id?: string;
	title?: string;
	readOnly?: true;
	type_name?: string;
	user?: User;
	user_id?: string;
	group?: miniType;
	group_id?: number;
	screen?: AllContentType;
	screen_id?: number;
	level?: number | string;

	is_deleted?: boolean;

	user_or_group?: miniType | null;
	temp_id?: string;
	type?: miniType | null;
}

export type Authorization = {
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

export interface AuthorizationInitialState extends BaseInitialState {
	selectedData: Authorization;
	selectedFormData: ScreenAuthorization;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	authorizationList: Authorization[];
	authorizationCount: number;
	pageParams: PageParamsTypes & {
		screen?: string | number | null;
	};
	model: false;
	finalauthorization: boolean;
	formRows: ScreenAuthorization[];
	formRowsParams: PageParamsTypes & {
		screen: string | number | null;
		level: string | number;
	};
	formRowsCount: number;
	formRowsLoading: boolean;

	viewModal: boolean;

	authorizationHistory: any[];
	authorizationHistoryCount: number;
	authorizationHistoryLoading: boolean;
	authorizationHistoryParams: PageParamsTypes & {
		screen?: string | number | null;
		authorized_by?: string | number | null;
		authorized_status?: string | number | null;
		authorized_level?: string | number | null;
	};

	checkAuthorization: boolean;
	checkAuthorizationLoading: boolean;
	authorizationPostLoading: boolean;
	authorized_level: number;
}
