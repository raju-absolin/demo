import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type Location = {
	city?: { label: string; value: string } & miniType;
	state?: { label: string; value: string } & miniType;
	country?: { label: string; value: string } & miniType;
	companies?:Array<any>;
	id: string;
	name?: string;
	code: string
};

export interface LocationInitialState extends BaseInitialState {
	selectedData: Location;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	locationList: Location[];
	locationCount: number;
	// pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue?: string;
	masterEditId: number;
	isFilterOpen: boolean;
	pageParams: PageParamsTypes & {
		city?: any;
		state?: any;
		country?: any;
	};
}

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	city?: { label: string; value: string };
	state?: { label: string; value: string };
	country?: { label: string; value: string };
};