import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

export interface NotificationState extends BaseInitialState {
	notifications: {
		id: string;
		subject: string;
		body: string;
		type: string;
		ref: string;
		created_on: string;
	}[];
	openNotification: boolean;
	count: number;
	active: boolean;
	successMessage: string | null;
	pageParams: PageParamsTypes;
}
