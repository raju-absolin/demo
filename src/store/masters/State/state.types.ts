import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type States = {
	country: any;
	id: string;
	name: string;
	code: string;
	createdon: string;
	createdby: {
		id: string;
		username: string;
	};
};

export interface StatesInitialState extends BaseInitialState {
	selectedData?: {
		id?: string;
		name?: string;
		code?: string;
		country?: any;
	};
	filterStatus: boolean;
	isFilterOpen: boolean;
	loading: boolean;
	drawer: false;
	statesList: States[];
	statesCount: number;
	pageParams: PageParamsTypes & {
		created_on_start?: string;
		created_on_end?: string;
		country?: miniType | null;
	};
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue: string;
	masterEditId: number;
}

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	country?: { label: string; value: string };
};
