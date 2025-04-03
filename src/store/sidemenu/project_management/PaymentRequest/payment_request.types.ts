import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";

export interface PaymentRequest {
    purchase_order?: any;
    remarks?: string;
    percentage?: string;
    tax_percentage?: string;
    approved_status_name?: string;
    approved_status?: any;
    base_price?: string;
    client_status_name?: string;
    id?: string;
    code?: string;
    requested_date?: string;
    due_date?: string;
	payment_type?:miniType;
    percentage_amount?: string;
    tax_percentage_amount?: number;
    project?: Project;
    gross?: number | undefined;
    purchaseenquiry?: PurchaseEnquiry;
    description?: string;
    total?: string;
    vendor?: Vendor;
    created_on?: string;
    modified_on?: string;
    reject_description?: string;
    confirm_remarks?: string;
    client_status?: miniType;
    created_by?:User
}

interface Project {
	id: string;
	name: string;
	company: string;
	status: number;
	status_name: string;
	created_on: string;
}

interface PurchaseEnquiry {
	id: string;
	code: string;
	project: Project;
	vendors: Vendor[];
	required_date: string;
	description: string;
	rfqstatus: number;
	rfqstatus_name: string;
	pqitems: PurchaseEnquiryItem[];
	value?: string;
}

interface Vendor {
	id: string;
	value: string;
	code: string;
	name: string;
	label: string;
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

interface PaymentRequestItem {
	id?: string;
	code?: string;
	order?: string;
	make?: Minirendertype;
	price?: string;
	total_price?: string;
	item?: Item;
	unit?: Unit;
	qty?: string;
	originalqty?: string;
	created_on?: string;
	modified_on?: string;
	dodelete?: boolean;
	tax?: any;
	taxtype?: any;
	taxtype_name?: string;
	discount?: string;
}

export interface PaymentRequestInitialState extends BaseInitialState {
	paymentRequestList: PaymentRequest[];
	paymentRequestCount: number;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		purchase_order?: Minirendertype | null;
		vendor?: Minirendertype | null;
		location?: Minirendertype | null;
		project_id?: string | number;
		po_id?: string | number;
		approved_status?: Minirendertype | null;
	};
	selectedData?: PaymentRequest & {
		purchase_enquiry?: miniType;
		vendor?: miniType;
		description?: string;
		remarks?: string;
		poitems?: any[];
	};
	vendorsByPO: {
		id: string;
		name: string;
	}[];
	vendorsByPOLoading: boolean;
	isFilterOpen: boolean;
	isPRViewOpen: boolean;
	approve_loading: boolean;
	checkApprove: boolean;
	approved_level: number;
	approved_status: number;
	approved_status_name: string;
	base_price: string;
	client_status_name: string;
	approved_data: any;
	model: boolean;
	rejectModel: boolean;
	reject_description: string;
	confirmModel: boolean;
	confirm_remarks?: string;
	uploadDocuments?: any[];
	document_loading: boolean;
	client_status?: miniType;
}
