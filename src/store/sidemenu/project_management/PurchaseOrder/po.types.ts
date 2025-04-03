import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { Quotation } from "../PurchaseQuotation/pq.types";
import { CompareQuotation } from "../CompareQuotation/cq.types";
import { User } from "@src/types";

export interface Order {
	approved_status_name?: string;
	approved_level?: string;
	approved_status?: any;
	client_status_name?: string;
	id?: string;
	code?: string;
	date?: string;
	project?: Project;
	purchaseenquiry?: PurchaseEnquiry;
	description?: string;
	total?: string;
	deliverydate?: string;
	vendor?: miniType & Vendor;
	poitems?: OrderItem[];
	created_on?: string;
	modified_on?: string;
	reject_description?: string;
	confirm_remarks?: string;
	client_status?: miniType;
	quotation?: Quotation;
	comparequotation?: CompareQuotation;
	currency?: miniType;
	exchange_rate?: string | number;
	terms?: string;
	delivery?: string;
	transport?: string;
	payment?: string;
	pnf?: string;
	gstdetails?: string;
	remarks?: string;
	location?: miniType;
	created_by?: User;

	purchase_enquiry?: miniType;

	deliver_terms?: string;
	financial_terms?: string;
	termsandconditions?: string;

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

export interface OrderItem {
	last_purchase_value?: string;
	id?: string;
	code?: string;
	order?: string;
	make?: Minirendertype;
	price?: string;
	total_price?: string;
	item?: miniType & Item;
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
	description?: string;
	qitem?: string;
	cqitem?: string;
	gross?: string;
}

export interface PurchaseOrderInitialState extends BaseInitialState {
	purchaseOrderList: Order[];
	purchaseOrderCount: number;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		purchase_enquiry?: Minirendertype | null;
		vendor?: Minirendertype | null;
		location?: Minirendertype | null;
		project_id?: string | number;
		approved_status?: Minirendertype | null;
	};
	purchasePrice: string | number;
	TaxPrice: string | number;
	TaxAmount: any;
	selectedData: Order;
	vendorsByPO: {
		id: string;
		name: string;
	}[];
	vendorsByPOLoading: boolean;
	isFilterOpen: boolean;
	approve_loading: boolean;
	checkApprove: boolean;
	approved_level: number;
	approved_status: number;
	approved_status_name: string;
	client_status_name: string;
	approved_data: any;
	model: boolean;
	rejectModel: boolean;
	reject_description: string;
	confirmModel: boolean;
	confirm_remarks?: string;
	uploadDocuments?: any[];
	document_loading: boolean;
	client_status?: number;

	generatePOModal: boolean;
}
