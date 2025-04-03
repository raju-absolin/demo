import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { User } from "../manageUsers/manage_users.types";

export interface CurrentLoggedUsersInitialState extends BaseInitialState {
	selectedData?: User;
	filterStatus: boolean;
	loading: boolean;
	drawer: boolean;
	list: User[];
	count: number;
	pageParams: PageParamsTypes;
}
