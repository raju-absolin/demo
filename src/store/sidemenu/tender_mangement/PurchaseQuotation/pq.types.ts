import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import {
	PQItem,
	PurchaseEnquiry,
} from "../purchaseEnquiry/purchase_enquiry.types";
import { Vendors } from "@src/store/masters/Vendors/vendors.types";

export interface Quotation {
	id?: string;
	code?: string;
	date?: string;
	project?: miniType & {
		company: string;
	};
	purchase_enquiry?: miniType & PurchaseEnquiry;
	description?: string;
	total?: string;
	deliverydate?: string;
	vendor?: miniType & Vendors;
	currency?: miniType;
	exchange_rate?: string;
	quotationitems?: QuotationItem[];
	created_on?: string;
	modified_on?: string;
	inr_value?: string;
	created_by?: {
		fullname: string;
	};

	deliver_terms?: string;
	financial_terms?: string;
	termsandconditions?: string;
	uploadDocuments?: any;

	authorized_status_name?: string;
	authorized_status?: number;
	current_authorized_level?: number;
}

interface Project {
	id: string;
	name: string;
	company: string;
	status: number;
	status_name: string;
	created_on: string;
}

interface Location {
	id: string;
	name: string;
}

interface PurchaseEnquiryItem {
	id: string;
	purchase_enquiry: string;
	item: Item;
	make: Make;
	date: string;
	quantity: string;
	unit: Unit;
	original_quantity: string;
	description: string;
	created_on: string;
}

interface Item {
	id: string;
	code: string;
	name: string;
	description: string;
	units: Unit[];
	image: string | null;
	product_type: number;
	product_type_name: string;
	parent: ParentItem;
	makes: Make[];
	category: Category;
	moc: Moc;
	baseunit: BaseUnit;
	type: number;
	type_name: string;
	created_on: string;
}

interface Unit {
	id: string;
	code: string;
	name: string;
	units: string;
	label?: string;
	value?: string;
}

interface ParentItem {
	id: string;
	name: string;
}

interface Make {
	id: string;
	name: string;
}

interface Category {
	id: string;
	name: string;
}

interface Moc {
	id: string;
	name: string;
}

interface BaseUnit {
	id: string;
	name: string;
}
interface Make {
	id: string;
	name: string;
}

interface Minirendertype {
	label?: string;
	value?: string;
	id?: string;
	name?: string;
}

export interface QuotationItem {
	id?: string;
	code?: string;
	quotation?: string;
	make?: Minirendertype;
	price?: string;
	total_price?: string;
	item?: Item;
	unit?: Unit;
	qty?: string;
	originalqty?: string;
	original_quantity?: string;
	created_on?: string;
	modified_on?: string;
	dodelete?: boolean;
	tax?: any;
	taxtype?: any;
	taxtype_name?: string;
	discount?: string;
	peItem: PQItem;
}

export interface PQ_attachment {
	id: string;
	quotation: Quotation;
	file: string;
}

export interface PurchaseQuotationInitialState extends BaseInitialState {
	purchaseQuotationList: Quotation[];
	purchaseQuotationCount: number;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		purchase_enquiry?: Minirendertype | null;
		vendor?: Minirendertype | null;
		project_id?: string | number;
		qstatus?: Minirendertype | null;
	};
	selectedData: Quotation;
	vendorsByPE: {
		list: Array<any>;
		count: number;
		loading: boolean;
		miniParams: PageParamsTypes;
	};
	pq_attachment_loading: boolean;
	pq_attachments: any[];
	pq_attachments_count: number;
	Pq_attachments_params: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		quotation?: string;
	};
	isFilterOpen: boolean;
	uploadDocuments: any;

	selectedItems: QuotationItem[];
	pe_loading: boolean;
}
