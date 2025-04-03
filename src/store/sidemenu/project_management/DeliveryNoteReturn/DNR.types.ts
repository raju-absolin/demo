import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export interface DeliveryReturnNotesPayload {
	project_id: string; // UUID for the project
	warehouse_id: string; // UUID for the warehouse
	location_id: string; // UUID for the location
	description: string; // Description of the issue
	status: number; // Status (e.g., active or inactive)
	deliveryreturnnotesitems: {
		id: string; // UUID for the item
		item_id: string; // UUID for the specific item
		qty: string; // Quantity of the item issued
		unit_id: string; // UUID for the unit of measurement
		description: string; // Description of the item
		status: number; // Status (e.g., active or inactive)
		dodelete: boolean;
	}[]; // List of items issued to production
}

// Interface for each item in the issue to production
export interface DeliveryReturnNotesItem {
	id?: string; // UUID for the itemproduction
	item: miniType;
	qty: string; // Quantity of the item issued
	unit?: {
		label: string;
		value: string;
	};
	dodelete: boolean;
	originalqty?: string; // Original quantity before issuance
	description: string; // Description of the item
	status?: number; // Status (e.g., active or inactive)
}
export interface DeliveryReturnNotes {
	id?: string;
	code: string;
	project: miniType & {
		company: string;
	};
	warehouse: miniType;
	location: miniType;
	description: string; // Description of the issue
	status: number; // Status (e.g., active or inactive)
	status_name: string; // Status (e.g., active or inactive)
	deliveryreturnnotesitems: DeliveryReturnNotesItem[]; // List of items issued to production
	created_on?: string;
	created_by?: {
		fullname: string;
	}
}

export interface DeliveryReturnNotesInitialState extends BaseInitialState {
	list: DeliveryReturnNotes[];
	count: number;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		project?: string | number;
		warehouse?: miniType | null;
		location?: miniType | null;
	};
	selectedData?: DeliveryReturnNotes;
	isFilterOpen: boolean;
}
