import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export interface ReceiptFromProductionPayload {
	date: string; // ISO 8601 date format (e.g., "2024-12-03")
	project_id: string; // UUID for the project
	warehouse_id: string; // UUID for the warehouse
	description: string; // Description of the issue
	preceipt_status: number; // Status (e.g., active or inactive)
	preceipt_items: {
		id: string; // UUID for the item
		date: string; // ISO 8601 date format (e.g., "2024-12-03")
		batch_id: string; // UUID for the batch
		batch_name: string; // UUID for the batch
		item_id: string; // UUID for the specific item
		qty: string; // Quantity of the item issued
		unit_id: string; // UUID for the unit of measurement
		description: string; // Description of the item
		status: number; // Status (e.g., active or inactive)
		dodelete: boolean;
	}[]; // List of items issued to production
}

// Interface for each item in the issue to production
export interface ReceiptFromProductionItem {
	batch_name: string;
	id?: string; // UUID for the item
	date: string; // ISO 8601 date format (e.g., "2024-12-03")
	batch: miniType;
	item: miniType;
	qty: string; // Quantity of the item issued
	unit?: {
		label: string;
		value: string;
	};
	dodelete: boolean;
	originalqty?: string; // Original quantity before issuance
	description: string; // Description of the item
	preceipt_status?: number; // Status (e.g., active or inactive)
}
export interface ReceiptFromProduction {
	id?: string;
	date: string; // ISO 8601 date format (e.g., "2024-12-03")
	code: string;
	project: miniType;
	warehouse: miniType;
	description: string; // Description of the issue
	preceipt_status: number; // Status (e.g., active or inactive)
	preceipt_status_name: string; // Status (e.g., active or inactive)
	preceipt_items: ReceiptFromProductionItem[]; // List of items issued to production
	created_on?: string;
	created_by?: {
		fullname: string;
	}
}

export interface ReceiptFromProductionInitialState extends BaseInitialState {
	list: ReceiptFromProduction[];
	count: number;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		project?: string | number;
		warehouse?: miniType | null;
	};
	selectedData?: ReceiptFromProduction;
	isFilterOpen: boolean;
}
