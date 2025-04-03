import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { FileType } from "@src/components";
import { miniType } from "@src/store/mini/mini.Types";

export type postTaskPayload = {
	id?: string;
	subject?: string;
	project_id: string; // Unique identifier for the project
	users_ids: string[]; // Unique identifier for the users
	// group_id: string; // Identifier for the user type
	priority: number | undefined; // Priority level (e.g., 1 could mean high priority)
	startdate: string; // Start date in ISO 8601 format
	duedate: string; // Due date in ISO 8601 format
	milestone_id: string;
	description: string; // Description of the task
	remarks: string; // Additional remarks about the task
	status?: number; // Status of the task (e.g., 1 could mean "open"),
	type: number; // Type of the task ( "Project" or "Global"),
};

export type Task = {
	id: string; // Unique identifier for the task
	code: string; // Task code
	project: {
		id: string; // Unique identifier for the project
		name: string; // Project name
	};
	group: {
		id: string; // Identifier for the user type
		name: string; // User type name
	};
	users: User[];
	milestone: {
		id: string;
		code: string;
		name: string;
		startdate: string;
		duedate: string;
	};
	created_by: {
		id?: string;
		fullname?: string;
		username?: string;
		email?: string;
		phone?: string;
		first_name?: string;
		last_name?: string;
	};
	modified_by: {
		id?: string;
		fullname?: string;
		username?: string;
		email?: string;
		phone?: string;
		first_name?: string;
		last_name?: string;
	};
	attachments: FileType[];
	priority: number; // Priority level (e.g., 1 could mean high priority)
	priority_name: string; // Name of the priority (e.g., "Low")
	startdate: string; // Start date in ISO 8601 format
	duedate: string; // Due date in ISO 8601 format
	description: string; // Description of the task
	subject: string; // subject of the task
	remarks: string; // Additional remarks about the task
	status: number; // Status of the task (e.g., 1 could mean "Pending")
	status_name: string; // Name of the status (e.g., "Pending")
	created_on: string; // Date when the task was created, in ISO 8601 format
	modified_on: string; // Date when the task was created, in ISO 8601 format
};

export interface CommentPayload {
	task_id: string;
	comment: string;
}

interface User {
	id?: string;
	fullname?: string;
	username?: string;
	email?: string;
	phone?: string;
	first_name?: string;
	last_name?: string;
}

export interface Task_Comment {
	id?: string;
	code?: string;
	comment: string;
	created_on: string;
	task?: Task;
	user: User;
	attachments: {
		file: string;
		id: string;
		taskcomment: Task_Comment;
		path?: string;
		preview?: string;
		formattedSize?: string;
	}[];
}

export interface Task_CheckList_Payload {
	// user_id: string;
	task_id: string;
	project_id: string;
	description: string;
	is_completed: boolean;
}
export interface Task_CheckList_Params extends PageParamsTypes {
	start_date?: string;
	end_date?: string;
	user?: string;
	task: string;
	is_completed?: boolean;
	project: string;
}

export interface CheckListData {
	id: string;
	date: string;
	user: User;
	task: Task;
	description: string;
	is_completed: boolean;
	created_on: string;
}

export interface Task_attachment {
	id: string;
	task: Task;
	file: string;
}

export interface TasksState extends BaseInitialState {
	list: Task[];
	count: number;
	pageParams: PageParamsTypes & {
		start_date?: any;
		end_date?: any;
		project: string;
		priority?: miniType | null;
		milestone?: miniType | null;
		status?: miniType | null;
		group?: miniType | null;
	};
	task_attachments_loading: boolean;
	task_attachments: any[];
	task_attachments_count: number;
	task_attachment_params: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		task: string;
	};
	comments: Task_Comment[];
	commentsCount: number;
	comments_loading: boolean;
	comment_params: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		user?: miniType | null;
		task: string;
	};
	task_checklist_count: number;
	task_checklist_loading: boolean;
	task_checklist: CheckListData[];
	task_checklist_params: Task_CheckList_Params;

	viewModal: boolean;
	modal: boolean;
	selectedData: Task | null;
	isFilterOpen: boolean;
}
