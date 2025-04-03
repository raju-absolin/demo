import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export interface TenderItem {
	tenderitemmaster?: {
		label: string;
		value: string | number;
	};
	quantity?: string;
	dodelete?: boolean;
}

export interface TenderItemMasterInitialState extends BaseInitialState {
	tenderItemsList: TenderItem[];
	tenderItemsCount: number;
	pageParams: PageParamsTypes & {
		to_date?: any;
		from_date?: any;
		tender?: string | number;
	};
	selectedData?: TenderItem;
	isFilterOpen: boolean;
}
