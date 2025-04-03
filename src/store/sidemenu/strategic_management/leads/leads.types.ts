import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { Accounts } from "@src/store/masters/Account/accounts.types";
import { Company } from "@src/store/masters/Company/company.types";
import { Customers } from "@src/store/masters/Customers/customer.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/types";

type Unit = {
	id: string;
	code: string;
	name: string;
	units: string;
	label: string;
	value: string;
};

type Parent = {
	id: string;
	name: string;
};

type Make = {
	id: string;
	name: string;
};

type Category = {
	id: string;
	name: string;
};

type Moc = {
	id: string;
	name: string;
};

type BaseUnit = {
	id: string;
	name: string;
};

export interface ApiLeadPayload {
	id?: string;
	date: string;
	enquiry_date: string;
	due_date: string;
	bdm_id: string;
	name: string;
	priority: number;
	customer_id: string;
	mobile: string;
	email: string;
	location_id: string;
	company_id: string;
	remarks: string;
	lead_items: {
		id?: string;
		item_id: string;
		vendor_ids: any[];
		unit_id: string;
		quantity: string;
		item_specifications: string;
		dodelete: boolean;
	}[];
	client_location_id: string;
}

export type LeadItem = {
	id: string;
	vendors: any[];
	unit?: Unit;
	item: {
		id: string;
		code: string;
		name: string;
		description: string;
		units: Unit[];
		image: string | null;
		product_type: number;
		product_type_name: string;
		parent: Parent;
		makes: Make[];
		category: Category;
		moc: Moc;
		baseunit: BaseUnit;
		type: number;
		type_name: string;
	} & {
		label: string;
		value: string;
	};
	dodelete?: boolean;
	quantity: string; // assuming quantity is a string as given
	created_on?: string; // or Date if you want to convert it to a Date object
	item_specifications: string;
};

export interface Lead {
	id?: string;
	code?: string;
	date?: string;
	enquiry_date?: string;
	due_date?: string;
	bdm?: User;
	name?: string;
	priority?: number;
	priority_name?: string;
	customer?: Accounts;
	mobile?: string;
	email?: string;
	location?: miniType;
	company?: Company;
	documents?: { file: string; id: string }[];
	remarks?: string;
	authorized_status?: number;
	authorized_status_name?: string;
	current_authorized_level?: number;
	current_authorized_by?: User;
	current_authorized_on?: string;
	current_authorized_status?: number;
	current_authorized_status_name?: string;
	lead_items?: LeadItem[];

	created_on?: string;
	created_by?: User;

	client_location?: miniType;
}

export interface LeadsState extends BaseInitialState {
	leadsList: Lead[];
	leadsCount: number;
	pageParams: PageParamsTypes & {
		start_date?: any;
		end_date?: any;
		items?: any;
		customer?: any;
		company?: any;
		location?: any;
		lead_item__vendors?: any;
		vendor?: any;
		assignees?: any;
		assigned_by?: any;
		status?: any;
	};
	showPreview: boolean;
	approve_loading: boolean;
	reject_loading: boolean;
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
	loading_documents: boolean;
	modal: boolean;
	selectedData: Lead;
	isFilterOpen: boolean;
	uploadDocuments: any[];

	isUsersModalOpen: boolean;
	selected_users: Array<any>;
	user_loading: boolean;
}
