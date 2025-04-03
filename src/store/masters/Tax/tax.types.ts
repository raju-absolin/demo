import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type Tax = {
	id: string;
	name: string;
	tax: string;
	code: string
};

export interface TaxInitialState extends BaseInitialState {
	selectedData?: {
		id?: string;
		name?: string;
		tax?: string;
		code?: string
	};
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	taxList: Tax[];
	taxCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue: string;
	masterEditId: string;
}

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	tax: string;
	permission_ids?: string | number[];
};