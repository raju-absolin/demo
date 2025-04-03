import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export interface MaterialReceipt {
    warehouse?: any;
    to_warehouse?: any;
    location?: Minirendertype;
    material_issue?: any;
    id?: string;
    code?: string;
    date?: string;
    project?: Project;
    description?: string;
    total?: string;
    mreceipt_items?: MReceiptItems[];
    created_on?: string;
    modified_on?: string;
    batch?: miniType;
    mreceipt_status?: any;
    mreceipt_status_name?: string;
    created_by?:{
        fullname:string;
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
interface MReceiptItems {
    mreceipt_status_name: any;
    mreceipt_status: any;
    description: any;
    remarks: any;
    warehouse: any;
    mi_status_name: string;
    mistatus: Minirendertype;
    batch: miniType;
    mrn_item: Minirendertype;
    batch_name: string;
    gross: number;
    id?: string;
    code?: string;
    mrn?: string;
    price?: string;
    total_price?: string;
    make?: Minirendertype;
    item?: Item;
    unit?: Unit;
    qty?: number;
    quantity?: number;
    originalqty?: string;
    created_on?: string;
    modified_on?: string;
    dodelete?: boolean;
}

export interface MaterialReceiptInitialState extends BaseInitialState {
    mtList: MaterialReceipt[];
    mtCount: number;
    pageParams: PageParamsTypes & {
        start_date?: string;
        end_date?: string;
        project_id?: string | number;
        warehouse?: miniType | null;
        to_warehouse?: miniType | null;
        material_issue?: miniType | null;
        materialrequest?: miniType | null;
    };
    selectedData?: MaterialReceipt & {
        material_issue?: miniType;
        materialrequest?: miniType & {
            code: string;
        };
        location?: Location;
        warehouse?: miniType;
        to_warehouse?: miniType;
        remarks?: string;
        deliver_terms?: string;
        miitem?: any;
        mreceipt_items?: MReceiptItems &
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
    mreceipt_status?: miniType;
}
