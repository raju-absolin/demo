import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export type FormValues = {
	instance: { label: string; value: number } | null;
	is_report: boolean;
	is_entry: boolean;
	is_view: boolean;
};

export interface apiPayload {
	id?: number;
	type: number;
	group_id: string; // Adjust based on actual data type
	instance_id?: number; // Optional if it can be undefined
	report: boolean;
	entry: boolean;
	view: boolean;
	model_path: string;
}

type Group = {
	id: number;
	name: string;
};

type Instance = {
	id: number;
	name: string;
};

export type ModelData = {
	id?: number;
	name?: string;
	contenttype?: {
		id: number;
		app_label: string;
		model: string;
	};
};

export type DataPermission = {
	id?: number;
	model_path?: string;
	type?: number;
	type_name?: string;
	user?: null; // Represents a nullable field
	group?: Group;
	instance?: Instance;
	instance_id?: number; // Even though it's a number, it's a string in the JSON
	report?: boolean;
	entry?: boolean;
	view?: boolean;
	is_deleted?: boolean;
};
export interface DataPermissionInitialState extends BaseInitialState {
	dataPermissionsList: DataPermission[]; // You can replace `any` with a more specific type if needed
	dataPermissionsLoading: boolean;
	dataPermissionsCount: number;
	dataPermissionsParams: PageParamsTypes & {
		model_path?: string;
		group?: string;
	};

	modelDataList: { id: number; name: string }[];
	modelDataLoading: boolean;
	modelDataCount: number;
	modelDataParams: PageParamsTypes;

	modelsList: ModelData[];
	modelsLoading: boolean;
	modelsCount: number;
	modelsParams: PageParamsTypes & {
		model?: string;
		app_label?: string;
	};

	is_exclusion: boolean;
	exclussionLoading: boolean;

	selectedData: DataPermission; // Assuming an object with dynamic keys
	selectedModelData: ModelData; // Same assumption as above
}
