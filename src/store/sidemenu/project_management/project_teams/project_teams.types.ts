import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import { WorkOrder } from "../work_order/work_order.types";

export interface TeamPayload {
	transaction_id: string;
	screen_type: number;
	user_id: string;
	user_type_id: string;
}
export interface Team {
	id?: string;
	code?: string;
	transaction_id?: string;
	screen_type?: number;
	screen_type_name?: string;
	user?: User;
	user_type?: miniType;
	created_on?: string;
	modified_on?: string;
}

export interface ProjectTeamsState extends BaseInitialState {
	list: Team[];
	count: number;
	selectedData: Team;
	modal: boolean;
	isFilterOpen: boolean;
	pageParams: PageParamsTypes & {
		end_date?: string;
		start_date?: string;
		user?: miniType | null;
		transaction_id?: string;
		user_type?: miniType | null;
		screen_type?: miniType | null;
	};
}
