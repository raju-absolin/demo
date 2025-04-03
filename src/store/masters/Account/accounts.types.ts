import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { JSX } from "react/jsx-runtime";
import { ClientLocation } from "../ClientLocations/cliantlocation.types";

type MiniTypes = {
	id: string | number;
	name: string;
};
type ProductType = {
	label?: string;
	value?: string;
};
export type Accounts = {
	breadcrumb?: any;
	id?: string | number | undefined;
	code?: string | number | undefined;
	name?: string;
	parent?: miniType; // UUID format
	type?: number;
	type_name?: string;
	mobile?: string;
	email?: string;
	address?: string;
	pincode?: string;
	pan_no?: string;
	gst_no?: string;
	remarks?: string;
	account_type?: miniType;
	account_type_name?: string;
	country?: miniType;
	state?: miniType;
	city?: miniType;
	created_on?: string;
	client_locations?: ClientLocation[];
};

export type Group = {
	id?: string;
	name?: string;
	code?: string;
	parent?: { label: string; value: string } & miniType;
};

export interface AccountsInitialState extends BaseInitialState {
	selectedData?: Accounts;
	accountGroupData?: Group;
	accountgroupList: Accounts[];
	breadCrumbsList: Accounts[];
	GroupsTree?: Accounts[];
	accountgroupCount: number;
	grouppageParams: PageParamsTypes;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	accountsList: Accounts[];
	accountsCount: number;
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
}
export type GroupSubmitPayload = {
	id?: string | number | undefined;
	name: string;
	parent_id: string | number;
};

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	parent_id: string; // UUID format
	type: number;
	mobile: string;
	email: string;
	address: string;
	pincode: string;
	pan_no: string;
	gst_no: string;
	remarks: string;
	account_type: number;
	country_id: number;
	state_id: number;
	city_id: number;
	client_location_ids?: string[];
};
