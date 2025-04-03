import { BaseInitialState } from "@src/common/common.types";
import { CustomModalProps } from "@src/components/Modal";

export type ProfileList = {
	id: string | number;
	name: string;
	permissions: string[];
	groupdetails: {
		group: number | string;
		reporting_to?: string | null;
		reporting_to_name?: string;
	};
};

export type ProfileData = {
	id?: number | string;
	name?: string;
	permissions?: number | string[];
	groupdetails?: {
		group: number | string;
		reporting_to?: string;
		reporting_to_name?: string;
	};
};

export interface ManageGroupInitialState extends BaseInitialState {
	listCount: number;
	profileList: ProfileList[];
	adminProfileList: [];
	adminListCount: number;
	manualRegProfileList: [];
	manualRegCount: number;
	appPermissionsList: PermissionListType[];
	checkedPermissions: {}[];
	profileData: ProfileData;
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
	// modalProps: CustomModalProps;
}

export type ContentType = {
	app_label: string;
	id: number;
	model: string;
	permissions: {
		codename: string;
		content_type: number;
		id: number;
		name: string;
	}[];
};

export type Permissions = {
	codename: string;
	content_type: number;
	id: string;
	name: string;
	permissiondetails: {
		id: number;
		name: string;
	};
	permissionChecked?: boolean;
};

export type ContentTypeDetails = {
	id: number | string;
	name: string;
	contenttype: ContentType;
	permissions: Permissions[];
	contentTypeChecked?: boolean;
};

export type PermissionListType = {
	app_label: string;
	contenttypedetails: ContentTypeDetails[];
	id: number;
	name: string;
	appPermissionsChecked?: boolean;
};

export type SubmitPayload = {
	id: string | number | undefined;
	name: string;
	permission_ids: string | number[];
};
