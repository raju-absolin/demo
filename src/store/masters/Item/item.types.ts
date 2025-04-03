import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { JSX } from "react/jsx-runtime";

type MiniTypes = {
	id: string | number;
	name: string;
};
type ProductType = {
	label?: string;
	value?: string;
};
export type Items = {
	breadcrumb?: any;
	id?: string;
	name?: string;
	modelnumber?: string;
	code?: string;
	description?: string;
	makes?: Array<any>;
	units?: Array<any>;
	parent?: { label: string; value: string } & miniType;
	moc?: { label: string; value: string } & miniType;
	category?: { label: string; value: string } & miniType;
	baseunit?: { label: string; value: string } & miniType;
	types?: { label?: string; value?: string };
	type_name?: string;
	product_types?: ProductType;
	product_type_name?: string;
	product_type?: string;
	type?: string;
	image?: any;
	created_on?: string;
};

export type Group = {
	id?: string;
	name?: string;
	code?: string;
	parent?: { label: string; value: string } & miniType;
};

export interface ItemsInitialState extends BaseInitialState {
	selectedData?: Items;
	itemGroupData?: Group;
	itemgroupList: Items[];
	breadCrumbsList: Items[];
	GroupsTree?: Items[];
	itemgroupCount: number;
	grouppageParams: PageParamsTypes;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	itemsList: Items[];
	itemsCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue: string;
	parentValue: Array<any>;
	masterEditId?: string | number | undefined;
	image?: any;
	units?: any;

	openView: boolean;

	addVendorModel: boolean;
}
export type GroupSubmitPayload = {
	id?: string | number | undefined;
	name: string;
	parent_id: string | number;
};

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	description: string;
	// category_id: string | number;
	// moc_id: string | number;
	baseunit_id: string | number;
	parent_id?: string | number;
	type: string;
	product_type: string;
	// image?: any;
	// make_ids: { label: string; value: string | number }[];
};
