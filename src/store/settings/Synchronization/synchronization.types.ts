import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
    id: string | number;
    name: string;
};
type miniTypes = {
    value: string | number;
    label: string;
};

export type syncList = [

]
export type syncLogList = [];
export interface SynchronizationInitialState extends BaseInitialState {
    status: string,
    error: string,
    syncList: Array<any>,
    syncValue: number,
    syncParams: {
        no_of_pages: number,
        page_size: number,
        page: number,
        search: string,
    },
    syncLogList: Array<any>,
    syncLogId: string,
    syncLogParams: {
        no_of_pages: number,
        page_size: number,
        page: number,
        search: string,
    },
    synLogCount: number,
    syncTypeName: string,
    syncLogLoading: boolean,
    syncLoading: boolean,
    synCount: number,
    syncSettingsData: any,
    openModal: boolean,
    selectedData: {
        focus_username: string,
        focus_password: string,
        focus_base_url: string
    }
}

