import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

type MiniTypes = {
    id: string | number;
    name: string;
};
type miniTypes = {
    value: string | number;
    label: string;
};

export type Project = {
    id: string;
    name: string;
    code: string;
};

export interface ProjectActivityInitialState extends BaseInitialState {
    selectedData: Project;
    filterStatus: boolean;
    loading: boolean;
    drawer: false;
    activityList: Project[];
    activityCount: number;
    pageParams: PageParamsTypes;
    activityLoading: boolean;
    ActivityList: Array<any>;
    ActivityCount: number;
    projectActivityParams:PageParamsTypes;
}
