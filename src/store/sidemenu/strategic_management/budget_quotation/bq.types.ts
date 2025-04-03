import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { Lead, LeadItem } from "../leads/leads.types";
import { User } from "@src/types";

export type RequestDataPayload = {
	id?: string | number;
	date: string;
	bdm_id: string;
	scope_of_work: string;
	vendor_evaluation_criteria: string;
	organization_name: string;
	// user_id: string | number;
	lead_id: string;
	budgetaryquotationitems: any;

	pre_qualification_criteria: string;
	pre_qualification_requirement: string;
};

export type BudgetQuotation = {
	documents?: any[];
	vec_documents?: any[];
	id?: string;
	date?: string;
	bdm?: User;
	scope_of_work?: string;
	vendor_evaluation_criteria?: miniType & { value: boolean };
	budgetaryquotationitems?: LeadItem[];
	organization_name?: string;
	user?: miniType & {
		fullname?: string;
	};
	lead?: Lead;
	lead_items?: LeadItem[];
	comments?: Comment[];
	created_on?: string;

	pre_qualification_criteria?: string;
	pre_qualification_requirement?: string;
};

export type Comment = {
	id?: string;
	b_quotation: BudgetQuotation;
	comment: string;
	created_on?: string;
};

export interface BudgetQuotationsState extends BaseInitialState {
	budgetQuotationList: BudgetQuotation[];
	budgetQuotationCount: number;
	pageParams: PageParamsTypes & {
		start_date?: any;
		end_date?: any;
		lead?: any;
	};
	attachments?: any[];
	VECattachments?: any[];
	modal: boolean;
	selectedData: BudgetQuotation;
	isFilterOpen: boolean;
}
