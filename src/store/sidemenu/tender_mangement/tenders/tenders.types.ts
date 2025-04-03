import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/types";
import { Lead } from "../../strategic_management/leads/leads.types";
import { Accounts } from "@src/store/masters/Account/accounts.types";

interface Project {
	id: string;
	label?: string;
	value?: string;
	name: string;
	status: number;
	status_name: string;
	created_on: string; // You may want to consider a Date type if you plan to parse this date.
}

interface sourceportal {
	id: string;
	name: string;
}

interface Company {
	id: string;
	name: string;
}

interface TenderItemMaster {
	id: string;
	name: string;
	label: string;
	value: string;
	tendermasteritems: any[]; // Change 'any' to a more specific type if known
}

interface TenderItem {
	id: string;
	tender: string; // This can be related to Tender's id
	tenderitemmaster: TenderItemMaster;
	quantity: string; // Consider changing this to number if applicable
	created_on: string; // You may want to consider a Date type if you plan to parse this date.
	dodelete: boolean;
}
export interface TenderSummary {
	id: string;
	code: string;
	tender_no: string;
}
export interface TenderDocument {
	id: string;
	created_on: string;
	tender: TenderSummary;
	file: string;
}

export interface Tender {
	id?: string;
	code?: string;
	name?: string;
	assigned_on?: string | null;
	project?: Project;
	lead?: Lead;
	tender_no?: string;
	tender_type?: miniType;
	tender_type_name?: string;
	tender_stage?: miniType | null;
	authorized_status?: number;
	authorized_status_name?: string;
	product_type?: number;
	product_type_name?: string;
	department_name?: string;
	department?: string;
	company?: Company;
	customer?: Accounts;
	documents?: TenderDocument[];
	tender_datetime?: string;
	tender_items?: TenderItem[];
	comments?: any[];
	is_reverse_auction?: miniType;
	pre_bid_place?: string;
	pre_bid_meet_address?: string;
	tender_extension_datetime?: string;
	tender_open_datetime?: string;
	pre_bid_date?: string;
	ministry?: string;
	annual_turnover?: string;
	years_of_experiance?: string;
	is_mss_exemption?: boolean;
	is_start_exemption?: boolean;
	documents_required_seller?: string;
	time_allowed_clarification_days?: string;
	is_inspection?: boolean;
	evaluation_method?: string;
	description?: string;
	sourceportal?: miniType;
	created_by?: User;
	created_on?: string;

	budgetaryquotationdocuments?: any[];
	lead_documents?: any[];
	budget_documents?: any[];
}
interface SelectOption {
	label?: string;
	value?: string;
}

interface PageParams {
	assign_to?: SelectOption | null;
	tender_stage?: SelectOption | null;
	project?: SelectOption | null;
	tender_type?: SelectOption | null;
	company?: SelectOption | null;
	product_type?: SelectOption | null;
	sourceportal?: SelectOption | null;
	customer?: SelectOption | null;
	status?: SelectOption | null;
	start_date?: string;
	end_date?: string;
}

export interface TendersInitialState extends BaseInitialState {
	tendersList: Tender[];
	tenderCount: number;
	pageParams: PageParamsTypes & PageParams;
	pdfFile?: any;
	extractedData?: {
		outputs: {
			bid_number: string;
			bid_end_date: string;
			bid_opening_dateTime: string;
			documents_required: string[];
			time_allowed_clarification: string;
			Ministry: string;
			departmanet_name: string;
			is_inspection: boolean | string;
			years_of_past_experiance: number;
			annual_turnover: number;
			is_mss_exemption: boolean | string;
			evaluation_method: string;
			is_startup_exemption: boolean | string;
			bid_name: string;
		};
	};
	modal: boolean;
	uploadDocuments?: any[];
	tenderMasterItemModalOpen: boolean;
	assign_to_modal: boolean;
	approve_loading: boolean;
	reject_loading: boolean;
	document_loading: boolean;
	pdf_loading: boolean;
	bid_stage_loading: boolean;
	bid_stage_modal: boolean;

	selectedData: Tender;
	userAssigneModal: boolean;
	isFilterOpen: boolean;
	tabs: number;
}
