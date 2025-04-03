import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

export type Item = {
	id?: string;
	name: string;
	tendermasteritems?: [];
};

export type postItemPayload = {};

export interface BidingItemsState extends BaseInitialState {
	itemsList: Item[];
	itemsCount: number;
	pageParams: PageParamsTypes & {
		start_date?: any;
		end_date?: any;
	};
	modal: boolean;
	selectedData: {
		id?: string | number;
		name: string;
	};
	isFilterOpen: boolean;
}
