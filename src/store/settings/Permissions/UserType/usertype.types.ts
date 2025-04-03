import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

export type User = {
	id: string;
    code:string;
	name: string;
	
};

export interface UserTypeInitialState extends BaseInitialState {
	selectedData: User;
	filterStatus: boolean;
	loading: boolean;
	drawer: false;
	userTypeList: User[];
	usersCount: number;
	pageParams: PageParamsTypes;
    model: false;	
}
