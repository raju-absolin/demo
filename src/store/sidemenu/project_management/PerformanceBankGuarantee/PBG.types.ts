import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import { WorkOrder } from "../work_order/work_order.types";

export interface PerformanceBankGuaranteePayload {
	id?: string;
	number: string;
	value: string;
	issuedate: string;
	expirydate: string;
	claimdate: string;
	remarks: string;
	dodelete?: string;
}
export interface PerformanceBankGuarantee {
	id?: string;
	code?: string;
	number?: string;
	value?: string;
	issuedate?: string;
	expirydate?: string;
	claimdate?: string;
	remarks?: string;
	file?: string;
	dodelete?: string;
	created_on?: string;
	modified_on?: string;
}

export interface PerformanceBankGuaranteeState extends BaseInitialState {
	list: PerformanceBankGuarantee[];
	count: number;
	selectedData: PerformanceBankGuarantee;
	attachments: any;
	modal: boolean;
	view_modal: boolean;
	isFilterOpen: boolean;
	pageParams: PageParamsTypes & {
		end_date?: string;
		start_date?: string;
		project: string;
	};
}
