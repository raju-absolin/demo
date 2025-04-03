import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export type postMileStonePayload = {
	id?: string;
	name: string;
	project_id: string; // Unique identifier for the project
	startdate: string; // Start date in ISO 8601 format
	duedate: string; // Due date in ISO 8601 format
	description: string; // Task description
	remarks: string; // Additional remarks
};

export type MileStone = {
	id: string; // Unique identifier for the task
	code: string; // Task code
	name: string | null; // Name of the task, can be null
	project: {
		id: string; // Unique identifier for the project
		name: string; // Project name
	};
	startdate: string; // Start date in ISO 8601 format
	duedate: string; // Due date in ISO 8601 format
	description: string; // Task description
	remarks: string; // Additional remarks
	created_on: string; // Date and time the task was created, in ISO 8601 format
};

export interface MileStonesState extends BaseInitialState {
	list: MileStone[];
	count: number;
	pageParams: PageParamsTypes & {
		start_date?: any;
		end_date?: any;
		project: string;
	};
	modal: boolean;
	selectedData: MileStone | null;
	isFilterOpen: boolean;
}
