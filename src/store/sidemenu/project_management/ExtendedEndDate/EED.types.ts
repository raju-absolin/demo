import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import { WorkOrder } from "../work_order/work_order.types";

export interface ExtendedEndDatePayload {
	id?: string;
	extended_due_date?: string;
	file?: File;
}
export interface ExtendedEndDate {
	id?: string;
	code?: string;
	extended_due_date?: string;
	file?: string;
	dodelete?: string;
	created_on?: string;
	modified_on?: string;
}

export interface ExtendedEndDateState extends BaseInitialState {
	list: ExtendedEndDate[];
	count: number;
	selectedData: ExtendedEndDate;
	attachments: any;
	modal: boolean;
	isFilterOpen: boolean;
	pageParams: PageParamsTypes & {
		end_date?: string;
		start_date?: string;
		project: string;
	};
}
