import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/types";

export interface Mr {
	// approved_status_name?: string;
	// approved_status?: string;
	mr_status_name?: String;
	// approved_level?: string;
	mr_status?: any;
	id?: string;
	code?: string;
	date?: string;
	project?: Project;
	description?: string;
	total?: string;
	mr_items?: MrItem[];
	created_on?: string;
	modified_on?: string;
	reject_description?: string;
	created_by?: User;

	deliver_terms?: string;
	materialrequestapprovals?: any[];

	authorized_status_name?: string;
	authorized_status?: number;
	current_authorized_level?: number;
}

interface Project {
	id: string;
	name: string;
	status: number;
	status_name: string;
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
	code: string;
	name: string;
	description: string;
	image: string | null;
	make: { value?: string; label?: string; id?: string; name?: string };
	unit?: Unit & {
		label?: string;
		value?: string;
	};
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
interface MrItem {
	description: any;
	mr_status_name: string;
	mr_status: Minirendertype;
	batch: Minirendertype;
	poitem: Minirendertype;
	batch_name: string;
	gross: number;
	id?: string;
	code?: string;
	mrn?: string;
	price?: string;
	total_price?: string;
	item?: {
		id: string;
		name: string;
		value?: string;
		label?: string;
		image?: string;
		description?: string;
		code?: string;
	};
	item_name?: string;
	make_name?: string;
	unit_name?: string;
	make: miniType;
	unit?: Unit & miniType;
	qty?: number | string;
	originalqty?: string;
	created_on?: string;
	modified_on?: string;
	dodelete?: boolean;
	tax?: any;
	taxtype?: any;
	taxtype_name?: string;

	required_date?: string;
}

export interface MaterialRequestInitialState extends BaseInitialState {
	mrList: Mr[];
	mrCount: number;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		project_id?: string | number;
		mr_status?: miniType | null;
	};
	itemPageParams: PageParamsTypes;
	selectedData: Mr;
	isFilterOpen: boolean;
	makeByItem: any;
	approve_loading: boolean;
	checkApprove: boolean;
	approved_level: number;
	approved_status: number;
	approved_status_name: string;
	approved_data: any;
	model: boolean;
	itemName: string;
	mr_itemData: any;
	itemModel: boolean;
	rejectModel: boolean;
	reject_description: string;
	approvedLevel?: string;
}
