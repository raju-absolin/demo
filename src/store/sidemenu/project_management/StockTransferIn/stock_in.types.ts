import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export interface StockIn {
    stocktransferout?: any;
    sistatus?: any;
    sistatus_name?: string;
    warehouse?: Minirendertype;
    from_warehouse?: Minirendertype;
    location?: Minirendertype;
    material_issue?: any;
    id?: string;
    code?: string;
    date?: string;
    project?: Project;
    description?: string;
    total?: string;
    siitems?: StockInItems[];
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
interface StockInItems {
	quantity: any;
    sistatus_name: any;
    sistatus: any;
    description: any;
    warehouse: Minirendertype;
    from_warehouse: Minirendertype;
    batch: miniType;
    batch_name: string;
    id?: string;
    code?: string;
    price?: string;
    total_price?: string;
    item?: Item;
    unit?: Unit;
    qty?: number | string;
    originalqty?: string;
    created_on?: string;
    modified_on?: string;
    dodelete?: boolean;
}

export interface StockInInitialState extends BaseInitialState {
    stockInList: StockIn[];
    stockInCount: number;
    pageParams: PageParamsTypes & {
        start_date?: string;
        end_date?: string;
        stocktransferout?: any;
        warehouse?: miniType | null;
        from_warehouse?: miniType | null;
        project?: string | number;
    };
    selectedData?: StockIn & {
        material_issue?: miniType;
        location?: Location;
        warehouse?: miniType;
        from_warehouse?: miniType;
        remarks?: string;
        deliver_terms?: string;
        miitem?: any;
        soitemQty?: any;
        siitems?: StockInItems &
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
    sistatus?: miniType;
}
