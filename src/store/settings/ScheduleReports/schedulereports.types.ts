import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

export type scheduleReports = [];
	

export interface ScheduleReportsInitialState extends BaseInitialState {
	loading: boolean;
	drawer: false;
	scheduleReports:Array<any>;
	listCount: number;
	pageParams: PageParamsTypes;	
}

