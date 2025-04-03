import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
	id: string;
	name: string;
};

export type apiPayload = {
	id?: string;
	name: string;
	location_id: string;
	remarks: string;
};

export type Warehouse = {
	id?: string;
	name?: string;
	code?: string;
	location?: MiniTypes;
	projects?: MiniTypes[];
	remarks?: string;
};

export interface WarehouseInitialState extends BaseInitialState {
	selectedData: Warehouse;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	warehousesList: Warehouse[];
	warehousesCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue: string;
	masterEditId: number;
	model: boolean;
}

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	permission_ids: string | number[];
};
