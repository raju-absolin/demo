import { BaseInitialState } from "../../common/common.types";

export type LoginData = {
	username: string;
	password: String;
	user_type: string;
	device_uuid: string;
	device_name: string;
	device_type: number;
	device_fcmtoken: string;
};

export interface authState extends BaseInitialState {
	data: {};
	message: string | null;
	loading: boolean;
	OTPSend: boolean;
	resendOTP: boolean;
	showResentOTP: boolean;
	pwdData: {};
}

export type LoginPayload = {
	data: LoginData;
	redirectUrl: string;
	navigate: Function;
	enqueueSnackbar: Function;
};
