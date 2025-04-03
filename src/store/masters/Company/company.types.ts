import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { JSX } from "react/jsx-runtime";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type Company = {
	id?: string;
	name?: string;
	code?: string;
	remarks?: string;
	// address?: string;
	// email?: string;
	// mobile?: string;
	// gstno?: string;
	// pincode?: string;
	// logo?: any;
};

export interface CompanyInitialState extends BaseInitialState {
	selectedData?: Company;
	companyData?: Company;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	companyList: Company[];
	companyCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue: string;
	masterEditId: number | undefined;
	companylogo?: { preview: string; originalObj: File };
}

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	mobile: string;
	email: string;
	address: string;
	logo?: File | undefined;
	gstno?: string;
	pincode?: string;
};
