import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type Country = {
	id: string;
	name: string;
	code: string;
	createdon: string;
	createdby: {
		id: string;
		username: string;
	};
};

export interface CountryInitialState extends BaseInitialState {
	selectedData?: {
		id?: string;
		name?: string;
		code?: string;
	};
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	countryList: Country[];
	countryCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue: string;
	masterEditId: number;
}

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	permission_ids: string | number[];
};
