import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { Accounts } from "../Account/accounts.types";
import { miniType } from "@src/store/mini/mini.Types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type VendorItem = {
	id?: string;
	code?: string;
	vendor?: Accounts;
	item?: miniType;
};

export interface VendorItemInitialState extends BaseInitialState {
	selectedData?: VendorItem;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	model: false;
	vendorItemList: VendorItem[];
	vendorItemCount: number;
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
