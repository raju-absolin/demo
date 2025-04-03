import { BaseInitialState } from "@src/common/common.types";
import { CustomModalProps } from "@src/components/Modal";

export type SettingsData ={
    SMS__MSG_VAR: string;
    SMS__NUMBER_VAR: string;
    SMS__URL: string;
    SMTP__BACKEND: string;
    SMTP__HOST: string;
    SMTP__PASSWORD: string;
    SMTP__PORT: string;
    SMTP__USER: string;
    SMTP__USE_TLS: boolean;
    THIRDPARTY__URL: string;
    THIRDPARTY__TOKEN: string;
}

export interface AppSettingsInitialState extends BaseInitialState {
	listCount: number;
	adminProfileList: [];
	adminListCount: number;
	appSettingsData: SettingsData;
	manualRegCount: number;
	checkedPermissions: {}[];
	model: boolean;
	loading: boolean;
	status: string;
	error: string;
	permissionsLoading: boolean;
	profileParams: {
		no_of_pages: number;
		page_size: number;
		page: number;
		search: string;
		currentSort: string;
		sortOrder: string;
	};
	expanded: string | false[];
	modalProps: CustomModalProps;
}