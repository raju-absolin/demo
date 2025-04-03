import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { Customers } from "@src/store/masters/Customers/customer.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";

export interface DeliveryChallanPayload {
	project_id: string;
	vendor_id: string;
	vehicle_no: string;
	mode_of_transport: string;
	mobile: string;
	email: string;
	address: string;
	cust_dcvalue: string;
	description: string;
	dc_type: number;
	dchallan_items: Array<{
		id: string;
		item_id: string;
		qty: string;
		unit_id: string;
		originalqty: string;
		description: string;
		dodelete: boolean;
	}>;
}

// Interface for each item in the issue to production
export interface DeliveryChallanItem {
	id: string;
	item: miniType;
	batch: miniType;
	qty: string;
	unit: miniType & {
		units: string;
	};
	originalqty: string;
	description: string;
	dodelete: boolean;
}
export interface DeliveryChallan {
	warehouse: miniType;
	id: string;
	code: string;
	project: {
		name: string;
		company: string;
	};
	approved_level?: any;
	approved_status_name?: string;
	customer: Customers;
	vehicle_no: string;
	mode_of_transport: string;
	mobile: string;
	email: string;
	address: string;
	cust_dcvalue: string;
	description: string;
	dc_type: number;
	dc_type_name: string;
	reject_description?: string;
	deliverychallanapprovals?: any[]
	dchallan_items: Array<DeliveryChallanItem>;
	created_on?: string;
	created_by?: User
}
export interface BatchAgainstItems {
	item: string,
	itemname: string,
	batch: string,
	batchname: string,
	quantity: string
}
export interface DeliveryChallanInitialState extends BaseInitialState {
	list: DeliveryChallan[];
	count: number;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		project?: string | number;
		dc_type?: miniType | null;
		project_id?: string | number;
		// location_id?: string | number;
		warehouse_id?: string | number;
		item_id?: string | number;
		batch_id?: string | number;
		customer?: miniType | null;
	};
	batchPageParams: PageParamsTypes & {
		project_id?: string | number;
		warehouse_id?: string | number;
		item_id?: string | number;
	};
	batchloading: boolean;
	stock_available?: string;
	batchListCount: number;
	batchAgainstItemsList?: BatchAgainstItems[];
	selectedData?: DeliveryChallan;
	isFilterOpen: boolean;
	approve_loading: boolean;
	checkApprove: boolean;
	approved_level: number;
	approved_status: number;
	approved_status_name: string;
	approved_data: any;
	model: boolean;
	rejectModel: boolean;
	reject_description: string;
	approvedLevel?: string;
}
