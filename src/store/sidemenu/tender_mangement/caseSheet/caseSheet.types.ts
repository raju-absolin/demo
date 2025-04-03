import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export interface CaseSheet {
	tender?: {
		company?: miniType;
	};
	id?: string | number;
	tender_id?: string | number;
	pre_bid_date?: string;
	contact_person?: string;
	department_name?: string;
	phone?: string | number;
	email?: string;
	estimate_bid_price?: number | string;
	is_extension_request?: boolean;
	is_site_visit?: boolean;
	pre_bid_subject?: string;
	last_tender_date?: string;
	last_tender_rate?: string;
	oem_challenges?: string;
	department_challenges?: string;
	authorized_status?: number;
	authorized_status_name?: string;
	costing_remarks?: string;
	remarks?: string;
	documents_not_submitted_evaluation_matrix?: string;
	pendingdocumentsOEM?: string;
	is_reverse_auction?: boolean;
}

export interface CaseSheetInitialState extends BaseInitialState {
	caseSheetList: CaseSheet[];
	approve_loading: boolean;
	reject_loading: boolean;
	approve_or_reject_modal: boolean;
	dailouge_name: string;
	caseSheetCount: number;
	pageParams: PageParamsTypes & {
		to_date?: any;
		from_date?: any;
		tender?: string | number;
	};
	selectedData?: CaseSheet;
	isFilterOpen: boolean;
}
