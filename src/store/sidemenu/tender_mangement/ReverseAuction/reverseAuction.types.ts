import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

interface TenderItemMaster {
	id: string;
	name: string;
	tendermasteritems: any[]; // If this array has specific items, replace `any` with the correct type
}

interface TenderItem {
	id: string;
	tender: string;
	tenderitemmaster: TenderItemMaster;
	quantity: string;
	created_on: string;
	landing_cost?: string;
	discount_landing_cost?: string;
	landing_cost_margin?: string;
	landing_cost_margin_amount?: string;
	landing_cost_total?: string;
	landing_cost_gst?: string;
	landing_cost_gst_amount?: string;
	total?: string;
	l1_price?: string;
	diff_amount?: string;
	// Assuming this is a date in ISO format
}

interface Comment {
	id: string;
	comment: string;
	created_on: string; // Assuming this is a date
	created_by: {
		id: string;
		username: string;
		fullname: string;
		email: string | null;
		first_name: string;
		last_name: string;
		phone: string | null;
	};
}

interface TenderNature {
	id: string;
	name: string;
}

interface Company {
	id: string;
	name: string;
}

interface Project {
	id: string;
	name: string;
	status: number;
	status_name: string;
	created_on: string; // Assuming this is a date
}

interface Tender {
	id: string;
	assign_to: string | null;
	project: Project;
	tender_no: string;
	tender_type: number;
	tender_type_name: string;
	status: number;
	status_name: string;
	product_type: number;
	product_type_name: string;
	department_name: string;
	tendernature: TenderNature;
	company: Company;
	customer: any | null; // Replace `any` with the correct type if available
	document: any | null; // Replace `any` with the correct type if available
	tender_datetime: string; // Assuming this is a date
	tender_items: TenderItem[];
	comments: Comment[];
	is_reverse_auction: boolean;
}

interface TenderItemDetails {
	id?: string;
	tender?: Tender;
	tenderitemmaster?: TenderItemMaster;
	quantity?: string;
	created_on?: string; // Assuming this is a date in ISO format
}

export interface ReverseAuction extends TenderItemDetails {
	id?: string;
	tender?: Tender;
	tender_item_master?: TenderItemMaster;
	tender_item?: TenderItemDetails;
	landing_cost?: string;
	discount_landing_cost?: string;
	landing_cost_margin?: string;
	landing_cost_margin_amount?: string;
	landing_cost_total?: string;
	landing_cost_gst?: string;
	landing_cost_gst_amount?: string;
	total?: string;
	l1_price?: string;
	diff_amount?: string;
	created_on?: string; // Assuming this is a date
}

export interface ReverseAuctionInitialState extends BaseInitialState {
	reverseAuctionList: ReverseAuction[];
	reverseAuctionCount: number;
	pageParams: PageParamsTypes & {
		end_date?: string;
		start_date?: string;
		tender_id?: string | number;
	};
	selectedData?: ReverseAuction;
	tenderItems?: Tender["tender_items"];
	reverse_auctionItems?: Tender["tender_items"];
	isFilterOpen: boolean;
	openEditModal: boolean;
}
