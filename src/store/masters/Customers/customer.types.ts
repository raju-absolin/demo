import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { JSX } from "react/jsx-runtime";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type Customers = {
	id?: string;
	name?: string;
	departmentname?: string;
	concerned_officer_name?:string;
	vendor?: string;
	code?: string;
	city?: { label: string; value: string } & miniType;
	state?: { label: string; value: string } & miniType;
	country?: { label: string; value: string } & miniType;
	address?: string;
	email?: string;
	mobile?: string;
	bank_ifsc?: string;
	bank_acc_no?: string;
	gstno?: string;
	pan_no?: string;
	tan_no?: string;
	remarks?: string;
};

export interface CustomersInitialState extends BaseInitialState {
	selectedData?: Customers;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	customersList: Customers[];
	customersCount: number;
	pageParams: PageParamsTypes & {
		city?: any;
		state?: any;
		country?: any;
	};
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue: string;
	masterEditId: number | undefined;
	countryValue?: string | number;
	stateValue?: string | number;
	isFilterOpen: boolean;
}

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	mobile: string;
	email: string;
	address: string;
	country_id: string | number;
	state_id: string | number;
	city_id: string | number;
	gstno: string;
	bank_acc_no: string;
	bank_ifsc: string;
	pan_no: string;
	tan_no: string;
};
