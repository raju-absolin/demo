import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
    id: string | number;
    name: string;
};

export type Document = {
    id?: string;
    name?: string;
    code?: string
};

export interface DocumentInitialState extends BaseInitialState {
    selectedData?: Document;
    filterStatus: boolean;
    loading: boolean;
    drawer: false;
    documentList: Document[];
    documentCount: number;
    pageParams: PageParamsTypes;
    passwordModel: boolean;
    searchValue: string;
    isModelVisible: boolean;
    masterValue?: string;
    masterEditId: number;
}

export type SubmitPayload = {
    id?: string | number | undefined;
    name: string;
    permission_ids?: string | number[];
};