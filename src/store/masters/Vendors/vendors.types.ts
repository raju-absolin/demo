import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { JSX } from "react/jsx-runtime";

type MiniTypes = {
    id: string | number;
    name: string;
};
type ObjTypes = {
    id: string;
    name: string;
};

type ItemGroupType<T> = T extends null ? { label: string; value: string; }[] : { label: string; value: string | number; }[];

export type Vendors = {
    id?: string;
    name?: string;
    vendor?: string;
    code?: string
    city?: ObjTypes;
    state?: ObjTypes;
    country?: ObjTypes;
    address?: string;
    email?: string;
    mobile?: string;
    item_groups?: Array<any>;
    bank_ifsc?: string,
    bank_acc_no?: string,
    gstno?: string,
    pan_no?: string,
    tan_no?: string,
};

export interface VendorsInitialState extends BaseInitialState {
    selectedData?: Vendors;
    filterStatus: boolean;
    loading: boolean;
    drawer: false;
    vendorsList: Vendors[];
    vendorsCount: number;
    pageParams: PageParamsTypes & {
        city?: any;
        state?: any;
        country?: any;
        item_groups?: any;
    };
    passwordModel: boolean;
    searchValue: string;
    isModelVisible: boolean;
    masterValue: string;
    masterEditId: number | undefined;
    countryValue?: string | number;
    stateValue?: string | number;
    isFilterOpen: boolean;
    // item_groups:any  & miniType;
}

export type SubmitPayload = {
    id?: string | number | undefined;
    name: string;
    mobile: string,
    email: string,
    address: string,
    country_id: string | number,
    state_id: string | number,
    city_id: string | number,
    item_group_ids: { label: string; value: string | number }[],
    gstno: string,
    bank_acc_no: string,
    bank_ifsc: string,
    pan_no: string,
    tan_no: string
};