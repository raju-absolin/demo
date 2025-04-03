import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

interface TenderItemMaster {
	id: string;
	name: string;
	tendermasteritems: any[]; // Update this if the items have a specific structure
}

interface TenderItem {
	id: string;
	tender: string;
	tenderitemmaster: TenderItemMaster;
	quantity: string;
	created_on: string; // ISO formatted date
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
	created_on: string; // Date in string format
}

interface Document {
	id: string;
	name: string;
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
	customer: any | null; // Replace `any` with the specific type if needed
	document: any | null; // Replace `any` with the specific type if needed
	tender_datetime: string; // Date in string format
	tender_items: TenderItem[];
	comments: Comment[];
	is_reverse_auction: boolean;
}

export interface Data {
	id?: string;
	tender?: Tender;
	document?: Document;
	document_name?: string;
	file?:string;
	is_submitted?: boolean;
	type: number;
	type_name: string;
}

export interface DocumentInitialState extends BaseInitialState {
	documentList: Data[];
	documentCount: number;
	pageParams: PageParamsTypes & {
		to_date?: any;
		from_date?: any;
		tender?: string | number;
	};
	selectedData: Data;
	isFilterOpen: boolean;
	checkedList: string[];
	attachments: any[];
	openAddDocumentModal: boolean;
	tenderDocuments: {
		document_name: string;
		type: number;
		is_submitted: boolean;
		document_id: string;
		tender_id: string;
	}[];
}
