import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { Lead } from "../leads/leads.types";

export type RequestDataPayload = {
	id?: string | number;
	date: string;
	bdm_name: string;
	organization_name: string;
	user_id: string | number;
	lead_id: string | number;
};

export type Comment = {
	id?: string;
	lead?: Lead;
	comment: string;
	created_on?: string;
	created_by?: {
		id?: string;
		fullname?: string;
		username?: string;
	};
};

export interface BudgetQuotationCommentState extends BaseInitialState {
	bq_commentList: Comment[];
	bq_commentCount: number;
	pageParams: PageParamsTypes & {
		start_date?: any;
		end_date?: any;
		lead?: any;
	};
	modal: boolean;
	selectedData: Comment;
	isFilterOpen: boolean;
}
