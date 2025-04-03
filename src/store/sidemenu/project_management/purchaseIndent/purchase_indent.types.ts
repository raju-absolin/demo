import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

interface UOM {
	id: string;
	name: string;
}
interface Unit {
	id: string;
	code?: string; // Optional because `unit` lacks `code` in the example data
	name: string;
	uom?: UOM;
	units: string;
}

export interface PiItem {
	id?: string;
	date: string;
	code: string;
	item?: {
		id: string;
		name: string;
		value?: string;
		label?: string;
		image?: string;
		description?: string;
		code?: string;
	};
	qty: string;
	unit?: Unit & {
		label?: string;
		value?: string;
	};
	originalqty: string;
	make: { value?: string; label?: string; id?: string; name?: string };
	description: string;
	pistatus: number;
	dodelete: boolean;
	created_on?: string;
	purchaseindent?: string;
	purchaseindent_code?: string;
}

export interface PurchaseIndentPayload {
	date: string;
	location_id: string;
	warehouse_id: string;
	description: string;
	pistatus: number;
	piitems: {
		id?: string;
		date: string;
		item_id: string;
		qty: string;
		unit_id: string;
		originalqty: string;
		make_id: string;
		description: string;
		pistatus: number;
		dodelete: boolean;
	}[];
}

// Type for the main data structure
export interface PurchaseIndent {
	company?: string;
	id?: string;
	date?: string;
	code?: string;
	location?: miniType;
	warehouse?: miniType;
	description?: string;
	project?: miniType & {
		company: string;
	};
	pistatus?: number;
	pistatus_name?: string;
	piitems?: PiItem[];
	created_on?: string;
	created_by?: {
		fullname: string;
	};
	authorized_status_name?: string;
	authorized_status?: number;
	current_authorized_level?: number;
}

export interface Purchase_Indent_Items_State {
	list: PiItem[];
	loading: boolean;
	count: number;
	miniParams: {
		no_of_pages: number;
		page_size: number;
		page: number;
		search: string;
		purchaseindent__project: string;
		item?: string;
	};
}

export interface PurchaseIndentState extends BaseInitialState {
	list: PurchaseIndent[];
	count: number;
	selectedData: PurchaseIndent;
	isFilterOpen: boolean;
	purchase_indent_items: Purchase_Indent_Items_State;
	pageParams: PageParamsTypes & {
		end_date?: string;
		start_date?: string;
		project?: string;
		pistatus?: miniType | null;
		location?: miniType | null;
		warehouse?: miniType | null;
	};
}
