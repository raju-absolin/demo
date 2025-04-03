import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
    id: string | number;
    name: string;
};

export type BidNature = {
    id?: string;
    name?: string;
    code?: string
};

export interface BidNatureInitialState extends BaseInitialState {
    selectedData?: BidNature;
    filterStatus: boolean;
    loading: boolean;
    drawer: false;
    bidnatureList: BidNature[];
    bidnatureCount: number;
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