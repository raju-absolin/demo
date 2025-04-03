import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
    id: string | number;
    name: string;
};

export type Expenses = {
    id: string;
    name: string;
    code: string;
    created_on: string;
};

export interface ExpensesInitialState extends BaseInitialState {
    selectedData?: {
        id?: string;
        name?: string;
        code?: string;
    };
    filterStatus: boolean;
    loading: boolean;
    drawer: false;
    expensesList: Expenses[];
    expensesCount: number;
    pageParams: PageParamsTypes;
    searchValue: string;
    isModelVisible: boolean;
    masterValue: string;
    masterEditId: number;
    model: boolean;
}

export type SubmitPayload = {
    id?: string | number | undefined;
    name: string;
    permission_ids: string | number[];
};
