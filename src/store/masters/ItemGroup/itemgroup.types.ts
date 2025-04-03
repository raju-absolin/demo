import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type Itemgroup = {
	id: string;
	name: string;
	code:string;
	parent?: any;
	parent_id: string | number,
	product_type:  string;
};

export interface ItemgroupInitialState extends BaseInitialState {
	selectedData?: Itemgroup;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	itemgroupList: Itemgroup[];
	itemgroupCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue:string;
    masterEditId: number | undefined;
}

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	parent_id: string | number,
	product_type:  number;
};