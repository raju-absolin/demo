import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { JSX } from "react/jsx-runtime";
import { Order } from "../PurchaseOrder/po.types";

export interface Mrn {
	purchaseorder?: Order & miniType;
	id?: string;
	code?: string;
	date?: string;
	project?: Project;
	description?: string;
	total?: string;
	invoice_date?: string;
	vendor?: Vendor;
	mrn_items?: MrnItem[];
	created_on?: string;
	modified_on?: string;
	invoice_no?: string | number | undefined;
	invoice_amount?: string | number | undefined;
	invoice_document?: any[];
	label?: string;
	value?: string;

	location?: miniType;
	warehouse?: miniType;
	invoicedate?: string;
	deliver_terms?: string;
	mrnitem?: any;
	purchase_price?: any;
	currency?: miniType;
	exchange_rate?: string | number;
	created_by?: {
		fullname: string;
	}
}

interface Project {
	id: string;
	name: string;
	company: string;
	status: number;
	status_name: string;
	created_on: string;
}

interface Vendor {
	id: string;
	code: string;
	name: string;
	mobile: string;
	email: string;
	address: string;
	city: miniType;
	state: miniType;
	country: miniType;
	gstno: string;
	bank_acc_no: string;
	bank_ifsc: string;
	pan_no: string;
	tan_no: string;
}

interface Unit {
	id: string;
	code: string;
	name: string;
	uom: miniType;
	units: string;
	value?: string;
}

interface ParentItem {
	id: string;
	name: string;
}

interface BaseUnit {
	id: string;
	name: string;
}

interface Minirendertype {
	label?: string;
	value?: string;
	id?: string;
	name?: string;
}

interface Item {
	id: string;
	code: string;
	name: string;
	description: string;
	units: Unit[];
	image: string | null;
	makes: Make[];
	product_type: number;
	product_type_name: string;
	parent: ParentItem;
	baseunit: BaseUnit;
	type: number;
	type_name: string;
	created_on: string;
}

interface Make {
	id: string;
	name: string;
}
export interface MrnItem {
	purchase_price: any;
	quantity: any;
	balance_quantity: string;
	received_quantity: string;
	mrn_status_name: string;
	mrn_status: Minirendertype;
	batch: Minirendertype;
	poitem: Minirendertype;
	gross: number;
	id?: string;
	code?: string;
	mrn?: string;
	price?: string;
	last_purchase_value?: string;
	total_price?: string;
	make?: Minirendertype;
	item?: Item;
	unit?: Unit;
	qty?: number;
	originalqty?: string;
	created_on?: string;
	modified_on?: string;
	dodelete?: boolean;
	tax?: any;
	taxtype?: any;
	taxtype_name?: string;
	batch_name?: string;
}

export interface MaterialReceivedNotesInitialState extends BaseInitialState {
	mrnList: Mrn[];
	mrnCount: number;
	poCount: number;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		vendor?: Minirendertype | null;
		project_id?: string | number;
		location?: miniType | null;
		warehouse?: miniType | null;
		purchaseorder?: miniType | null;
	};
	popageParams: PageParamsTypes
	selectedData?: Mrn;
	vendorsByPE: {
		id: string;
		name: string;
	}[];
	vendorsByPELoading: boolean;
	isFilterOpen: boolean;
	loading_documents: boolean;
	invoice_document: any;
	selectedItems: MrnItem[];
	POItems:MrnItem[];
	purchaseorder?: Order;
	purchaseorderLoading: boolean;
}
