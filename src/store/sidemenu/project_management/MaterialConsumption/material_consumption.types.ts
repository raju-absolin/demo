import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export interface MaterialConsumption {
    mc_status?: any;
    mc_status_name?: string;
    warehouse?: any;
    location?: Minirendertype;
    material_issue?: any;
    id?: string;
    code?: string;
    date?: string;
    project?: Project;
    description?: string;
    total?: string;
    mc_items?: MConsumptionItems[];
    created_on?: string;
    modified_on?: string;
    batch?: miniType;
    mreceipt_status?: any;
    mreceipt_status_name?: string;
    created_by?: {
        fullname: string;
    }
}

interface Project {
    id: string;
    name: string;
    status: number;
    status_name: string;
    created_on: string;
}

interface Location {
    id: string;
    name: string;
}

interface Unit {
    uom: any;
    value: any;
    id: string;
    code: string;
    name: string;
    units: string;
}

interface ParentItem {
    id: string;
    name: string;
}

interface BaseUnit {
    id: string;
    name: string;
}

interface Minirendertype {
    label?: string;
    value?: string;
    id?: string;
    name?: string;
}

interface Item {
    id: string;
    value: string;
    code: string;
    name: string;
    description: string;
    units: Unit[];
    image: string | null;
    makes: Make[];
    product_type: number;
    product_type_name: string;
    parent: ParentItem;
    baseunit: BaseUnit;
    type: number;
    type_name: string;
    created_on: string;
}

interface Make {
    id: string;
    name: string;
}
interface MConsumptionItems {
    mc_status_name: any;
    mc_status: any;
    description: any;
    warehouse: any;
    batch: miniType & {
        batch?: string;
    };
    batch_name: string;
    id?: string;
    code?: string;
    price?: string;
    total_price?: string;
    item?: Item;
    unit?: Unit;
    qty?: number;
    originalqty?: string;
    created_on?: string;
    modified_on?: string;
    dodelete?: boolean;
}
export interface BatchAgainstItems {
    item: string,
    itemname: string,
    batch: string,
    batchname: string,
    quantity: string
}
export interface MaterialConsumptionInitialState extends BaseInitialState {
    mcList: MaterialConsumption[];
    mcCount: number;
    pageParams: PageParamsTypes & {
        start_date?: string;
        end_date?: string;
        project_id?: string | number;
        warehouse_id?: string | number;
        item_id?: string | number;
        batch_id?: string | number;
        warehouse?: miniType | null;
    };
    batchPageParams: PageParamsTypes & {
        project_id?: string | number;
        warehouse_id?: string | number;
        item_id?: string | number;
    };
    batchloading:boolean;
    stock_available: string | number;
    batchListCount: number;
    batchAgainstItemsList?: BatchAgainstItems[];
    selectedData?: MaterialConsumption & {
        material_issue?: miniType;
        location?: Location;
        warehouse?: miniType;
        remarks?: string;
        deliver_terms?: string;
        miitem?: any;
        mc_items?: MConsumptionItems &
        {
            id?: string;
            dodelete?: boolean;
            price?: string;
            total_price?: string;
            item?: miniType;
            qty?: string;
        }[];
    };
    isFilterOpen: boolean;
    mc_status?: miniType;
}
