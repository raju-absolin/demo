import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
	id: string | number;
	name: string;
};
type miniTypes = {
	value: string | number;
	label: string;
};

export type User = {
	id?: string;
	username?: string;
	first_name?: string;
	last_name?: string;
	fullname?: string;
	full_name?: string;
	phone?: string;
	alternate_phone?: string;
	is_phone_verified?: boolean;
	email?: string;
	is_email_verified?: boolean;
	gender?: number;
	gender_name?: string;
	groups?: Array<any>;
	device_access_name?: string;
	device_access?: any;
	is_active?: boolean;
	latitude?: string;
	longitude?: string;

	state?: MiniTypes;
	zone?: MiniTypes;
	city?: MiniTypes;
	area?: MiniTypes;
	locations?: any;
	newPassword?: string;
	confirmPassword?: string;
};

export interface ManageUserInitialState extends BaseInitialState {
	selectedData: User;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	usersList: User[];
	usersCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	loginLoading: boolean;
	userLoginParams: {
		no_of_pages: number;
		page_size: number;
		ordering?: string;
		page: number;
		search?: string;
	};
	userLoginList: Array<any>;
	loginCount: number;
	deviceLoading: boolean;
	userDeviceParams: PageParamsTypes;
	userDeviceList: Array<any>;
	userDeviceCount: number;
	activityLoading: boolean;
	userActivityParams: PageParamsTypes;
	userActivityList: Array<any>;
	userAuditList: Array<any>;
	userAuditParams: PageParamsTypes;
	auditLoading: boolean;
	userAuditCount: number;
	useActivityCount: number;
}

export type UserFormData = {
	username: string;
	firstname: string;
	lastname: string;
	email: string;
	phone: string;
	groups: Array<any>;
	gender: miniTypes;
	device_access: miniTypes;

	// state: miniTypes;
	// zone: miniTypes;
	// city: miniTypes;
	// area: miniTypes;
	location?: Array<any>;
	// pincode: string;
};
