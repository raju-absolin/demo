import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

type MiniTypes = {
    id: string | number;
    name: string;
};

export type Assignee = {
    id: string;
    name: string;
    code: string;
    screen_type: MiniTypes;
    screen_type_name: string;
    user?: { id: string | number, username: string };
    user_type?: MiniTypes;
    transaction_id: string
};

export interface AssigneeInitialState extends BaseInitialState {
    selectedData: Assignee;
    filterStatus: boolean;
    loading: boolean;
    drawer: false;
    assigneeList: Assignee[];
    assigneeCount: number;
    pageParams: PageParamsTypes;
    model: false;
}
