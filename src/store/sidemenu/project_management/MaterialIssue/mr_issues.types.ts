import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";

export interface MI {
    warehouse?: any;
    to_warehouse?: any;
    location?: Minirendertype;
    materialrequest?: any;
    id?: string;
    code?: string;
    approved_level?: string;
    approved_status_name?: string;
    date?: string;
    project?: Project;
    description?: string;
    total?: string;
    miitems?: MiItem[];
    created_on?: string;
    modified_on?: string;
    mistatus?: any;
    batch?: miniType;
    reject_description?: string;
    created_by?: User
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
    uom: miniType;
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
interface MiItem {
    quantity: any;
    mistatus_name: string;
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

// miniFolders: {
//     list: [],
//     loading: false,
//     count: 0,
//     miniParams: {
//         no_of_pages: 0,
//         page_size: 10,
//         page: 1,
//         search: "",
//     },
// },
export interface MaterialIssuesInitialState extends BaseInitialState {
    miList: MI[];
    miCount: number;
    pageParams: PageParamsTypes & {
        start_date?: string;
        end_date?: string;
        project_id?: string | number;
        warehouse_id?: string | number;
        item_id?: string | number;
        batch_id?: string | number;
        warehouse?: miniType | null;
        to_warehouse?: miniType | null;
        materialrequest?: miniType | null;
    };
    batchloading:boolean;
    batchPageParams: PageParamsTypes & {
        project_id?: string | number;
        warehouse_id?: string | number;
        item_id?: string | number;
    };
    stock_available?: any[];
    batchListCount: number;
    batchAgainstItemsList?: BatchAgainstItems[];
    selectedData?: MI & {
        materialrequest?: miniType;
        location?: Location;
        warehouse?: miniType;
        to_warehouse?: miniType;
        remarks?: string;
        deliver_terms?: string;
        mritem?: any;
        materialissueapprovals?:any;
        miitems?: MiItem &
        {
            id?: string;
            dodelete?: boolean;
            price?: string;
            total_price?: string;
            item?: miniType;
            qty?: string;
            stock_available?: string;
        }[];
        invoice_document?: any;

    };
    isFilterOpen: boolean;
    approve_loading: boolean;
    checkApprove: boolean;
    approved_level: number;
    approved_status: number;
    approved_status_name: string;
    approved_data: any;
    model: boolean;
    rejectModel: boolean;
    reject_description: string;
    approvedLevel?: string;
}
