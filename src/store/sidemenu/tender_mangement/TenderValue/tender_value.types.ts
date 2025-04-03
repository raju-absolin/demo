import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

export interface TenderValue {
	amount?: string | number;
	name?: string | number;
	created_on?: string;
	id?: string;
	l1_price?: string | number;
	tender?: any;
}

export interface TenderValueState extends BaseInitialState {
	itemsList: TenderValue[];
	itemsCount: number;
	pageParams: PageParamsTypes & {
		to_date?: any;
		from_date?: any;
		project_id?: string | number;
		tender?: string | number;
	};
	modal: boolean;
	selectedData?: TenderValue & {
		id?: string | number;
		amount?: number | string;
		name?: string | number;
	};

	isFilterOpen: boolean;
}
