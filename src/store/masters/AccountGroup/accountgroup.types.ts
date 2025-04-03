import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type Accountgroup = {
	id: string;
	name: string;
	code: string;
	parent?: any;
	parent_id: string | number;
	product_type: string;
};

export interface AccountgroupInitialState extends BaseInitialState {
	selectedData?: Accountgroup;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	accountgroupList: Accountgroup[];
	accountgroupCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue: string;
	masterEditId: number | undefined;
}

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	parent_id: string | number;
	product_type: number;
};
