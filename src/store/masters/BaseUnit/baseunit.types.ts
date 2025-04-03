import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type Baseunit = {
	id: string;
	name: string;
	code:string
};

export interface BaseunitInitialState extends BaseInitialState {
	selectedData?: Baseunit;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	baseunitList: Baseunit[];
	baseunitCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue:string;
    masterEditId:  number | undefined;
}

export type SubmitPayload = {
	id: string | number | undefined;
	name: string;
	permission_ids: string | number[];
};