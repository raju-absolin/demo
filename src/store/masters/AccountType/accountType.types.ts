import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export interface ApiPayload {
	id?: string;
	name: string;
	// location_id: string;
	remarks: string;
}

export type AccountTypes = {
	id: string;
	name: string;
	location: miniType;
	code: string;
	remarks: string;
};

export interface AccountTypesInitialState extends BaseInitialState {
	selectedData?: AccountTypes;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	accountTypesList: AccountTypes[];
	accountTypesCount: number;
	pageParams: PageParamsTypes & {
		location?: miniType | null;
	};
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue: string;
}

export type SubmitPayload = {
	id: string | number | undefined;
	name: string;
	permission_ids: string | number[];
};
