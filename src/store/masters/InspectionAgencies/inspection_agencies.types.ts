import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import InspectionAgencies from "@src/pages/masters/InspectionAgencies";
import { miniType } from "@src/store/mini/mini.Types";
import { JSX } from "react/jsx-runtime";

type MiniTypes = {
	id: string | number;
	name: string;
};

export type InspectionAgencies = {
	id?: string;
	code?: string;
	location?: miniType;
	concerned_officer?: string;
	concerned_officer_mobile?: string;
	concerned_officer_email?: string;
};

export interface InspectionAgenciesInitialState extends BaseInitialState {
	selectedData?: InspectionAgencies;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	inspectionAgenciesList: InspectionAgencies[];
	inspectionAgenciesCount: number;
	pageParams: PageParamsTypes;
	passwordModel: boolean;
	searchValue: string;
	isModelVisible: boolean;
	masterValue: string;
	masterEditId: number | undefined;
}

export type SubmitPayload = {
	id?: string | number | undefined;
	location_id: string;
	concerned_officer: string;
	concerned_officer_mobile: string;
	concerned_officer_email: string;
};
