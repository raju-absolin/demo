import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type Moc = {
	id: string;
	name: string;
	code:string
};

export interface MocInitialState extends BaseInitialState {
	selectedData?: Moc;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	mocList: Moc[];
	mocCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue:string;
    masterEditId: number | undefined;
}

export type SubmitPayload = {
	id: string | number | undefined;
	name: string;
	permission_ids: string | number[];
};