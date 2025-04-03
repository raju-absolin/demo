import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";

export type ItemAgainistBatch = {
	item: string;
	itemname: string;
	batch: string;
	batchname: string;
	quantity: number;
};

export interface StockOut {
	sostatus?: any;
	sostatus_name?: string;
	approved_level?: string;
	approved_status_name?: string;
	warehouse?: any;
	to_warehouse?: any;
	location?: Minirendertype;
	material_issue?: any;
	id?: string;
	code?: string;
	date?: string;
	project?: Project;
	description?: string;
	total?: string;
	soitems?: StockOutItems[];
	created_on?: string;
	modified_on?: string;
	batch?: miniType;
	mreceipt_status?: any;
	mreceipt_status_name?: string;
	reject_description?: string;
	created_by?: User
}

interface Project {
	id: string;
	name: string;
	status: number;
	status_name: string;
	created_on: string;
}

interface Location {
	id: string;
	name: string;
}

interface Unit {
	uom: any;
	value: any;
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
	value: string;
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

interface SoItem {
	id?: string;
	date?: string;
	item_id: string;
	qty: number;
	batch_id: string;
	unit_id: string;
	description: string;
	dodelete: boolean;
}

export interface StockOutApiPayload {
	date: string;
	project_id: string;
	warehouse_id: string;
	to_warehouse_id: string;
	description: string;
	soitems: SoItem[];
}

interface StockOutItems {
	sostatus_name: any;
	sostatus: any;
	description: any;
	batch: ItemAgainistBatch;
	batch_name: string;
	id?: string;
	code?: string;
	price?: string;
	total_price?: string;
	item?: Item;
	unit?: Unit;
	qty?: number;
	originalqty?: string;
	created_on?: string;
	modified_on?: string;
	dodelete?: boolean;
}

export interface StockOutInitialState extends BaseInitialState {
	stockoutList: StockOut[];
	stockoutCount: number;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		project?: string | number;
		warehouse_id?: string | number;
		from_warehouse_id?: string | number;
		to_warehouse_id?: string | number;
		item_id?: string | number;
		batch_id?: string | number;
		warehouse?: miniType | null;
		to_warehouse?: miniType | null;
	};
	stock_available?: string;
	batchesAganistItem: {
		loading: boolean;
		list: ItemAgainistBatch[];
		count: number;
		miniParams: PageParamsTypes & {
			item_id: string;
			project_id?: string | number;
			warehouse_id?: string | number;
		};
	};
	selectedData?: StockOut & {
		material_issue?: miniType;
		location?: Location;
		warehouse?: miniType;
		to_warehouse?: miniType;
		remarks?: string;
		deliver_terms?: string;
		miitem?: any;
		soitems?: StockOutItems[];
		stocktransferoutapprovals?:any[];
	};
	isFilterOpen: boolean;
	sostatus?: miniType;
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

	stock_loading: boolean;
}
