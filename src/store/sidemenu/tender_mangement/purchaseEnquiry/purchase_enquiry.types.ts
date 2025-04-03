import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import ItemModal from "@src/pages/sidemenu/ProjectManagement/WorkOrder/WorkOrderDashboard/MaterialRequest/itemModal";
import { miniType } from "@src/store/mini/mini.Types";

interface Project {
	id: string;
	name: string;
	status: number;
	status_name: string;
	created_on: string; // Format: "DD-MM-YYYY hh:mm A"
}

interface City {
	id: string;
	name: string;
}

interface State {
	id: string;
	name: string;
}

interface Country {
	id: string;
	name: string;
}

export interface Vendor {
	id: string;
	code: string;
	name: string;
	mobile: string;
	email: string;
	address: string;
	city: City;
	state: State;
	country: Country;
	gstno: string;
	bank_acc_no: string;
	bank_ifsc: string;
	pan_no: string;
	tan_no: string;
	label?: string;
	value?: string;
}

interface Unit {
	id: string;
	code: string;
	name: string;
	units: string; // Representing quantity units
}

interface Parent {
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

interface Item {
	id: string;
	code?: string;
	value: string;
	label: string;
	name: string;
	description: string;
	units: Unit[];
	image: string | null;
	product_type: number;
	product_type_name: string;
	parent: Parent;
	makes: { value: string; label: string }[]; // Simplified make object
	category: Category;
	moc: Moc;
	baseunit: BaseUnit;
	type: number;
	type_name: string;
	created_on: string; // Format: "YYYY-MM-DDTHH:MM:SS.ssssss+ZZ:ZZ"
}

export interface PQItem {
	id: string;
	purchase_enquiry: string; // Referring to the main enquiry ID
	item: miniType & Item;
	make?: miniType;
	purchase_indent: miniType;
	unit: miniType;
	taxtype: number;
	taxtype_name: string;
	date: string; // Format: "YYYY-MM-DD"
	quantity: string; // Representing quantity as a string
	temp_qty?: string; // Representing quantity as a string,
	original_quantity: string; // Representing original quantity as a string
	description: string; // Inner description
	created_on: string; // Format: "DD-MM-YYYY hh:mm A"
	dodelete: boolean;
}

export interface PurchaseEnquiry {
	id?: string;
	value?: string;
	code?: string;
	project?: any;
	vendors?: Vendor[];
	required_date?: string; // Format: "YYYY-MM-DD"
	description?: string;
	rfqstatus_name?: string;
	rfqstatus?: number;
	pqitems?: PQItem[];
	current_authorized_level?: number;
	authorized_status?: number;
	authorized_status_name?: string;
}

interface Minirendertype {
	label: string;
	value: string;
}

export interface PurchaseEnquiryState extends BaseInitialState {
	itemsList: PurchaseEnquiry[];
	itemsCount: number;
	pageParams: PageParamsTypes & {
		start_date?: any;
		end_date?: any;
		project_id?: string | number;
		rfqstatus?: Minirendertype | null;
	};
	item?: { label?: string; value?: string };
	vendorsModal: boolean;
	selectedVendors?: { label: string; value: string }[];
	modal: boolean;
	selectedData: PurchaseEnquiry;
	vendorsAganistItems: {
		list: {
			label: string;
			value: string | number;
			id: string;
			name: string;
		}[];
		loading: boolean;
		count: number;
		miniParams: {
			no_of_pages: number;
			page_size: number;
			page: number;
			search: string;
		};
	};
	isFilterOpen: boolean;
}
