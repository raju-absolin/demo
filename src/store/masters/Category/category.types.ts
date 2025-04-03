import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type Category = {
	id: string;
	name: string;
	code: string
};

export interface CategoryInitialState extends BaseInitialState {
	selectedData?: {
		id?: string;
		name?: string;
		code?: string
	};
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	categoryList: Category[];
	categoryCount: number;
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
	permission_ids?: string | number[];
};