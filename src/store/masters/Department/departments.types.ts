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

export type Departments = {
	id: string;
	name: string;
	location: miniType;
	code: string;
	remarks: string;
};

export interface DepartmentsInitialState extends BaseInitialState {
	selectedData?: Departments;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	departmentsList: Departments[];
	departmentsCount: number;
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
