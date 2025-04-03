import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
	id: string | number;
	name: string;
};
type miniTypes = {
	value: string | number;
	label: string;
};

export type UserProfile = {
	id: string;
	username: string;
	first_name: string;
	last_name: string;
	fullname: string;
	phone: string;
	alternate_phone?: string;
	is_phone_verified?: boolean;
	email: string;
	is_email_verified?: boolean;
	gender?: number;
	gender_name?: string;
	groups: Array<any>;
	device_access_name?: string;
	device_access: any;
	is_active: boolean;
	latitude?: string;
	longitude?: string;
	address?: string;
	state?: MiniTypes;
	zone?: MiniTypes;
	city?: MiniTypes;
	area?: MiniTypes;
	location?: any;
	newPassword: string;
	old_password: string;
	password: string;
	confirmPassword: string;

};
export interface UserProfileInitialState extends BaseInitialState {
	selectedData: UserProfile;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	profilesList: UserProfile;
	profilesCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	loginLoading: boolean;
	profileLoginParams: PageParamsTypes;
	userActivityList: Array<any>;
	loginCount: number;
	deviceLoading: boolean;
	profileDeviceParams: PageParamsTypes;
	profileDeviceList: Array<any>;
	profileDeviceCount: number;
	activityLoading: boolean;
	profileActivityParams: PageParamsTypes;
	userActivityCount: number;

}

export type UserProfileFormData = {
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
