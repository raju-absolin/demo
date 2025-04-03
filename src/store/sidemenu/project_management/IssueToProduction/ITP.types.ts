import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";

export interface IssueToProductionPayload {
	date: string; // ISO 8601 date format (e.g., "2024-12-03")
	project_id: string; // UUID for the project
	warehouse_id: string; // UUID for the warehouse
	description: string; // Description of the issue
	status: number; // Status (e.g., active or inactive)
	reject_description?: string;
	issuetoproductionitems: {
		id: string; // UUID for the item
		date: string; // ISO 8601 date format (e.g., "2024-12-03")
		batch_id: string; // UUID for the batch
		item_id: string; // UUID for the specific item
		qty: string; // Quantity of the item issued
		unit_id: string; // UUID for the unit of measurement
		description: string; // Description of the item
		status: number; // Status (e.g., active or inactive)
		dodelete: boolean;
	}[]; // List of items issued to production
}

// Interface for each item in the issue to production
export interface IssueToProductionItem {
	id?: string; // UUID for the item
	date: string; // ISO 8601 date format (e.g., "2024-12-03")
	issuetoproduction?: string; // UUID for the parent issue to production
	batch: miniType;
	item: any;
	qty: string; // Quantity of the item issued
	unit?: {
		label: string;
		value: string;
		id: string;
		name: string;
		units: string;
	};
	dodelete: boolean;
	originalqty?: string; // Original quantity before issuance
	description: string; // Description of the item
	status?: number; // Status (e.g., active or inactive)
}
export interface IssueToProduction {
	id?: string;
	date: string; // ISO 8601 date format (e.g., "2024-12-03")
	code: string;
	project: miniType;
	reject_description?: string;
	warehouse: miniType;
	description: string; // Description of the issue
	status: number; // Status (e.g., active or inactive)
	status_name: string; // Status (e.g., active or inactive)
	approved_level?: string;
	approved_status_name?: string;
	issuetoproductionitems: IssueToProductionItem[]; // List of items issued to production
	created_on?: string;
	created_by?: User
	issuetoproductionapprovals?: any[];
}
export interface BatchAgainstItems {
	item: string,
	itemname: string,
	batch: string,
	batchname: string,
	quantity: string
}
export interface IssueToProductionInitialState extends BaseInitialState {
	list: IssueToProduction[];
	count: number;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		project?: string | number;
		project_id?: string | number;
		warehouse_id?: string | number;
		item_id?: string | number;
		batch_id?: string | number;
		warehouse?: miniType | null;
	};
	batchloading: boolean;
	batchPageParams: PageParamsTypes & {
		project_id?: string | number;
		warehouse_id?: string | number;
		item_id?: string | number;
	};
	stock_available?: string;
	batchListCount: number;
	batchAgainstItemsList?: BatchAgainstItems[];
	selectedData?: IssueToProduction;
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
