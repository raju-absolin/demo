import { BaseInitialState } from "@src/common/common.types";
import { CustomModalProps } from "@src/components/Modal";

export type globalVariablesData = {
	cutofftime: string;
	helplineemail: string;
	helplinephone: string;
	maxdeliverydays:  string;
	recentorderdeactivatecount: string;
}

export interface GlobalVariableInitialState extends BaseInitialState {
	listCount: number;
	globalData: globalVariablesData;
	manualRegCount: number;
	checkedPermissions: {}[];
	model: boolean;
	loading: boolean;
	status: string;
	error: string;
	modalProps: CustomModalProps;
	permissionsLoading: boolean;
}