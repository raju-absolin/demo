import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import {
	PQItem,
	PurchaseEnquiry,
	Vendor,
} from "../purchaseEnquiry/purchase_enquiry.types";
import { Quotation, QuotationItem } from "../PurchaseQuotation/pq.types";
// import { Order } from "../PurchaseOrder/po.types";

type UUID = string;
type DateString = string;
type DateTimeString = string;

export interface RequestPayload {
	id?: string;
	project_id: string | number;
	purchase_enquiry_id: string;
	total: string | number;
	comparequotationitems: {
		id?: string;
		dodelete?: boolean;
		description?: string;
		deliverydate?: string;
		make_id?: string | number;
		price?: string | number;
		total_price?: string | number;
		item_id?: string;
		unit_id?: string;
		qty?: string | number;
		originalqty?: string | number;
		vendor_id?: string;
		quotation_id?: string;
		quotationitem_id?: string;
		purchase_enquiry_item_id?: string;
	}[];
}
export interface GeneratePOPayload {
	project_id: string;
	purchaseenquiry_id: string;
	location_id: string;
	quotation_id: string;
	comparequotation_id: string;
	vendor_id: string;
	description: string;
	terms: string;
	delivery: string;
	transport: string;
	payment: string;
	pnf: string;
	gstdetails: string;
	remarks: string;
	total: string;
	poitems?: {
		item_id: string;
		qty: string;
		unit_id: string;
		tax_id: string;
		taxtype: number;
		qitem_id: string;
		cqitem_id: string;
		price: string;
		gross: string;
		make_id: string;
		description: string;
		dodelete: boolean;
	}[];
}

interface Project {
	id: UUID;
	name: string | null;
	status: number;
	status_name: string;
	created_on: DateTimeString;
}

interface Item {
	name: string;
	id: string;
	value: string;
	label: string;
}

interface Unit {
	id: string;
	name: string;
	value: string;
	label: string;
}
interface Make {
	id: string;
	code: string;
	name: string;
	created_on: string;
	modified_on: string;
}

export interface CompareQuotationItem {
	id?: UUID;
	code: string;
	deliverydate: string;
	description: string;
	dodelete: boolean;
	comparequotation: CompareQuotation | string;
	make: Make;
	price: number | string | null;
	total_price: number | string | null;
	item: Item;
	unit: Unit;
	vendor: Vendor;
	qty: number | string;
	available_qty?: number;
	margin_value?: number;
	quotation?: Quotation;
	quotationitem?: QuotationItem;
	purchase_enquiry_item?: PQItem;
	originalqty: number | string;
	created_on?: DateTimeString;
	modified_on?: DateTimeString;
}

export interface CompareQuotation {
	id?: UUID;
	title?: string;
	code?: string;
	date?: DateString | null;
	project?: Project;
	currency?: Item;
	exchange_rate?: string;
	project_id?: UUID;
	purchase_enquiry?: PurchaseEnquiry;
	purchase_enquiry_id?: UUID;
	description?: string | null;
	total?: number | string | null;
	deliverydate?: DateString;
	vendor?: Vendor;
	vendor_id?: UUID;
	quotation?: Quotation;
	quotationitem?: PQItem;
	quotation_id?: UUID;
	comparequotationitems?: CompareQuotationItem[];
	cqstatus?: number;
	cqstatus_name?: string;
	qty?: string | number;
	created_on?: DateTimeString;
	created_by?: {
		fullname: string;
	};
	modified_on?: DateTimeString;
	purchase_enquiry_item?:
		| {
				id: string;
		  }
		| string;
	purchase_enquiry_item_id?: string;
}

interface Minirendertype {
	label: string;
	value: string;
}

export interface CheckedListItem {
	id?: string;
	temp_q: Quotation;
	quotationitem: CompareQuotationItem;
	vendor: Vendor;
	purchase_enquiry_item_id: string;
	dodelete: boolean;
}

export type VendorRelatedItem = Vendor & {
	vendorItems?: CompareQuotationItem[];
	deliverydate?: string;
	total?: number;
	quotation?: Quotation;
};

export interface CompareQuotationInitialState extends BaseInitialState {
	compareQuotationList: CompareQuotation[];
	compareQuotationCount: number;
	isGeneratePoModalOpen: boolean;
	selectedVendor?: VendorRelatedItem | null;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		vendor?: string;
		project_id: string | number;
		purchase_enquiry?: Minirendertype | null;
		quotation?: Minirendertype | null;
		cqstatus?: Minirendertype | null;
	};
	// POByPE: Order[];
	vendorRelatedItems?: VendorRelatedItem[];
	checkedList?: any;
	selectedData?: CompareQuotation & {
		purchase_enquiry?: miniType;
		vendor?: miniType;
		deliverydate?: string;
		description?: string;
		quotationitems?: CompareQuotation &
			{
				id?: string;
				dodelete?: boolean;
				price?: string;
				total_price?: string;
				item?: miniType;
				qty?: string;
			}[];
	};
	PEaganistCQ: {
		list: Array<any>;
		count: number;
		loading: boolean;
		miniParams: PageParamsTypes;
	};
	isFilterOpen: boolean;

	// PQ
	PQLoading: boolean;

	purchaseQuotationList: Quotation[];
	purchaseQuotationCount: number;
	PQpageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		purchase_enquiry?: string | null;
		vendor?: miniType | null;
		project_id?: string | number;
		qstatus?: miniType | null;
	};

	// PE

	peSelectedData: PurchaseEnquiry;
	peLoading: boolean;
}
