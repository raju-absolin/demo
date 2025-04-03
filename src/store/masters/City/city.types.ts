import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type City = {
	id: string;
	name: string;
	code: string;
	state?: { label: string; value: string } & miniType;
	country?: { label: string; value: string } & miniType;
};

export interface CityInitialState extends BaseInitialState {
	selectedData?: {
		id?: string;
		name?: string;
		code?: string;
		state?: { label: string; value: string } & miniType;
		country?: { label: string; value: string } & miniType;
	};
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	cityList: City[];
	cityCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue: string;
	masterEditId:number
}

export type SubmitPayload = {
	id?: string | number | undefined;
	name: string;
	state?: { label: string; value: string };
	country?: { label: string; value: string };
};