import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { DepartmentUser } from "@src/store/settings/Permissions/DepartmentUsers/department_users.types";

export interface ApiPayload {
	due_date: string; // ISO 8601 formatted date string
	department_id: string; // UUID of the department
	location_id: string; // UUID of the location
	description: string; // Description of the service request
}

export interface ServiceRequestsAssigned {
	id: string;
	code: string;
	requested_date: string;
	due_date: string;
	department: Department;
	location: Location;
	priority: number;
	priority_name: string;
	description: string;
	overdue_days: number;
	status: number;
	status_name: string;
	documents: any[]; // Define specific type for documents if available
	assignees: any[]; // Define specific type for assignees if available
	created_on: string;
	created_by: User;
	approved_by: User | null;
	remarks: string;
}

type Location = {
	id: string;
	code: string;
	name: string;
};

type Department = {
	id: string;
	code: string;
	name: string;
	location: Location;
	remarks: string;
	created_on: string;
};

type User = {
	id: string;
	username: string;
	fullname: string;
	email: string | null;
	first_name: string;
	last_name: string;
	phone: string | null;
};

export interface ServiceRequestsAssignedState extends BaseInitialState {
	list: Array<ServiceRequestsAssigned>;
	count: number;
	selectedData?: ServiceRequestsAssigned;
	uploadDocuments: any[];
	loading_documents: boolean;
	isModalVisible: boolean;
	openViewModal: boolean;
	isFilterOpen: boolean;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		department?: miniType | null;
		location?: miniType | null;
		priority?: miniType | null;
		approved_by?: miniType | null;
		approved_status?: miniType | null;
	};

	//aprovestatus
	status_loading: boolean;
	status_modal_open: boolean;

	// assign users
	department_user_loading: boolean;
	department_user_modal_open: boolean;
	selected_department_users: DepartmentUser[];
}
