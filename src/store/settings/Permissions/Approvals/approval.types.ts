import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

type MiniTypes = {
    id: string | number;
    name: string;
};

export type Approval = {
    id: string;
    name: string;
    code: string;
    screen_type: MiniTypes;
    screen_type_name: string;
    approve_type?: { id: string | number, name: string };
    user_type?: MiniTypes;
    levelno: string;
    approve_type_name: string;
    finalapproval:boolean;
};

export interface ApprovalInitialState extends BaseInitialState {
    selectedData: Approval;
    filterStatus: boolean;
    loading: boolean;
    drawer: false;
    approvalList: Approval[];
    approvalCount: number;
    pageParams: PageParamsTypes;
    model: false;
    finalapproval: boolean;
}
