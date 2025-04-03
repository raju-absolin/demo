import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { JSX } from "react/jsx-runtime";
import { Mrn, MrnItem } from "../MaterialReceivedNotes/mrn.types";

export interface MrnReturn {
	warehouse?: any;
	location?: Minirendertype;
	mrn?: any;
	id?: string;
	code?: string;
	date?: string;
	project?: Project;
	description?: string;
	total?: string;
	invoice_date?: string;
	vendor?: Vendor;
	mrn_items?: MrnReturnItem[];
	created_on?: string;
	modified_on?: string;
	invoice_no?: string | number | undefined;
	invoice_amount?: string | number | undefined;
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
	city: Location;
	state: Location;
	country: Location;
	gstno: string;
	bank_acc_no: string;
	bank_ifsc: string;
	pan_no: string;
	tan_no: string;
}

interface Location {
	id: string;
	name: string;
}

interface Unit {
	id: string;
	code: string;
	name: string;
	units: string;
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

export interface BatchAgainstItems {
	item: string,
	itemname: string,
	batch: string,
	batchname: string,
	quantity: string
}
export interface MrnReturnItem {
	mrn_status_name: string;
	mrn_status: Minirendertype;
	batch: Minirendertype;
	poitem: Minirendertype;
	gross: number;
	id?: string;
	code?: string;
	mrn?: string;
	price?: string;
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
	taxtype?: Minirendertype;
	taxtype_name?: string;
	mrn_item: MrnItem;

	quantity: any;
	balance_quantity: string;
	rejected_quantity: string;
	mrnreturnitem: string;
	stockavailable: string;
	batchQuantity?: string;
}

export interface MRNReturnReturnInitialState extends BaseInitialState {
	mrnReturnList: MrnReturn[];
	mrnReturnCount: number;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		vendor?: Minirendertype | null;
		project_id?: string | number;
		batch_id?: string | number;
		item_id?: string | number;
		warehouse_id?: string | number;
		location?: miniType | null;
		warehouse?: miniType | null;
		purchaseorder?: miniType | null;
	};
	batchloading:boolean;
    batchPageParams: PageParamsTypes & {
        project_id?: string | number;
        warehouse_id?: string | number;
        item_id?: string | number;
    };
	stock_available?: number;
	batchListCount: number;
	batchAgainstItemsList?: BatchAgainstItems[];
	document_loading?: boolean;
	selectedData?: MrnReturn & {
		purchase_order?: miniType;
		vendor?: miniType;
		location?: Location;
		warehouse?: miniType;
		invoicedate?: string;
		description?: string;
		deliver_terms?: string;
		invoice_no?: string | number | undefined;
		invoice_amount?: string | number | undefined;
		mrnreturnitem?: any;
		file?: any;
		mrnreturn_items?: MrnReturnItem[];
		documents?: any;
	};
	vendorsByMRN: {
		id: string;
		name: string;
	}[];
	vendorsByMRNLoading: boolean;
	isFilterOpen: boolean;
	loading_documents: boolean;
	documents: any;

	mrndata: Mrn;

	selectedItems: MrnReturnItem[];
}
