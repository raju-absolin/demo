import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { FileType } from "@src/components";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import { Tender } from "../../tender_mangement/tenders/tenders.types";
import { Tax } from "@src/store/masters/Tax/tax.types";
import { Customers } from "@src/store/masters/Customers/customer.types";
import { InspectionAgencies } from "@src/store/masters/InspectionAgencies/inspection_agencies.types";

export interface project_items {
	id?: string;
	tenderitemmaster_id: string;
	// tender_item_id: string;
	quantity: string | number;
	price: string | number;
	discount: string | number;
	taxtype?: {
		label?: string;
		value?: string;
		id?: string;
		name?: string;
	};
	taxable_amount?: string;
	tax?: {
		label?: string;
		value?: any;
		id?: string;
		name?: string;
		tax?: number;
	};
	dodelete?: boolean;
	tenderitemmaster?: {
		label?: string;
		value?: string;
		id?: string;
		name?: string;
	};
	tender_item?: {
		label: string;
		value: string;
	};
	taxtype_name?: string;
}
export interface payload_project_items {
	id?: string | number;
	tax_id?: string;
	taxtype?: string;
	tenderitemmaster_id?: string;
	quantity?: string | number;
	price?: string | number;
	discount?: string | number;
	dodelete?: boolean;
}
export interface postWorkOrderPayload {
	name: string;
	project_no: string;
	project_items?: payload_project_items[];
	amount: string | number;
	tender_id: string;
	tender_no: string | number;
	company_id: string;
	sourceportal_id: string;
	manager_id: string;
	tender_open_datetime?: Date | string;
	tender_datetime?: Date | string;
	tender_due_datetime: Date | string;
	deliver_terms: string;
	financial_terms: string;
	tender_type: number;
	product_type: number;

	// new feilds
	start_date: string; // ISO 8601 date string
	due_date: string; // ISO 8601 date string
	gst_percentage: number; // Maximum value: 2147483647 (int)
	total_value: string;
	tax_id: string; // UUID format
	taxtype: number; // Numeric value
	taxamount: string;
	warrenty_period: string; // ISO 8601 date string
	customer_id: string; // UUID format
	is_performace_bank_guarantee: boolean;
	is_pre_dispatch_inspection: boolean;
	performace_bank_guarantee_id: string; // UUID format
	is_inspection_agency: boolean;
	inspection_agency_id: string; // UUID format
	delivery_in_lots: number; // Maximum value: 2147483647 (int)
	is_stagewise_inspection: boolean;
}

export interface Team {
	id: string;
	project: miniType;
	users: miniType;
}

export interface WorkOrder {
	id?: string;
	code?: string;
	name?: string;
	project_no?: string;
	taxable_amount?: string;
	project_items?: project_items[]; // Assuming project items is an array of strings. Modify if needed.
	amount?: number;
	tender?: Tender & {
		id?: string;
		code?: string;
		tender_type?: {
			id: number;
			name: string;
		};
	}; // Modify based on the structure of 'tender'
	tender_documents?: any[];
	lead_documents?: any[];
	tender_no?: string;
	company?: miniType;
	department_name?: string;
	sourceportal?: miniType;
	manager?: User;
	tender_datetime?: string | Date; // Assuming it could be a string or a Date object
	tender_due_datetime?: string | Date; // Assuming it could be a string or a Date object
	tender_open_datetime?: string | Date;
	deliver_terms?: string;
	financial_terms?: string;
	remarks?: string;
	tender_type?: any;
	tender_type_name?: string;
	status?: string | number;
	status_name?: string;

	product_type?: string;
	product_type_name?: string;
	documents?: {
		file: string;
		tender: {
			id: string;
			tender_no: string;
		};
		id: string;
	}[];
	team?: Team[];
	created_on?: string | Date; // Assuming it could be a string or a Date object
	created_by?: {
		fullname: string;
	};
	//new fields
	start_date?: string; // ISO 8601 date string
	due_date?: string; // ISO 8601 date string
	gst_percentage?: number; // Maximum value: 2147483647 (int)
	total_value?: string;
	tax?: Tax; // UUID format
	taxtype?: number; // Numeric value
	taxtype_name?: string; // Numeric value
	taxamount?: string;
	warrenty_period?: string; // ISO 8601 date string
	customer?: Customers; // UUID format
	is_performace_bank_guarantee?: boolean;
	is_pre_dispatch_inspection?: boolean;
	performace_bank_guarantee?: miniType; // UUID format
	is_inspection_agency?: boolean;
	inspection_agency?: InspectionAgencies;
	delivery_in_lots?: number; // Maximum value: 2147483647 (int)
	is_stagewise_inspection?: boolean;

	authorized_status?: number;
	authorized_status_name?: string;
	current_authorized_level?: number;
}

export interface peformance_bank_guarantee {
	number: string;
	value: string;
	issuedate: string;
	expirydate: string;
	claimdate: string;
	remarks: string;
	dodelete?: string;
}

export interface WorkOrdersInitialState extends BaseInitialState {
	workOrdersList: WorkOrder[];
	workOrderCount: number;
	pageParams: PageParamsTypes & {
		start_date?: any;
		end_date?: any;
	};
	peformance_bank_guarantee_list?: peformance_bank_guarantee[];
	modal: boolean;
	team_modal: boolean;
	team_loading: boolean;
	uploadDocuments?: FileType[];
	selectedData: WorkOrder;
	isFilterOpen: boolean;
	tabs: number;
	projectTeams: {
		list: [];
		count: number;
		loading: boolean;
		miniParams: PageParamsTypes;
	};

	bidSelectionModal: boolean;
	bidSelected?: boolean;
}
