import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export type DepartmentUser = {
	id: string;
	code: string;
	user: User;
	department: Department;
	location: Location;
	is_hod: boolean;
	created_on: string;
	created_by: string;
};

interface User {
	id: string;
	username: string;
	fullname: string;
	email: string;
	first_name: string;
	last_name: string;
	phone: string;
}

interface Department {
	id: string;
	name: string;
}

interface Location {
	id: string;
	code: string;
	name: string;
}

export interface DepartmentUsersInitialState extends BaseInitialState {
	list: DepartmentUser[];
	count: number;
	isModalOpen: boolean;
	isFilterOpen: boolean;
	selectedData?: DepartmentUser;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		location?: miniType | null;
		department?: miniType | null;
	};
}

export interface ApiPayload {
	user_id: string;
	department_id: string;
	location_id: string;
	is_hod: boolean;
}
