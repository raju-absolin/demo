import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { JSX } from "react/jsx-runtime";

export interface ExpenditureSheet {
    received_amount?: string;
    mode_of_payment_name?: string;
    employee_name?: string;
    purchase_order?: any;
    remarks?: string;
    percentage?: string;
    approved_status_name?: string;
    approved_status?: any;
    client_status_name?: string;
    id?: string;
    code?: string;
    requested_date?: string;
    due_date?: string;
    expendituresheetitems?: ExpenditureSheetItems[];
    percentage_amount?: string;
    project?: Project;
    description?: string;
    total?: string;
    created_on?: string;
    modified_on?: string;
    reject_description?: string;
    confirm_remarks?: string;
    client_status?: miniType;
    created_by?: {
        fullname: string;
    }
    approved_by?: {
        username: string;
    }
}

interface Project {
    id: string;
    name: string;
    status: number;
    status_name: string;
    created_on: string;
}


interface ExpenditureSheetItems {
    expances: miniType;
    documents: any[];
    expendituretype_name: string;
    remarks: string;
    amount: string;
    date: string;
    expendituretype: miniType;
    place_of_visit: string;
    expenses: miniType;
    // mc_status_name: any;
    // mc_status: any;
    description: any;
    id?: string;
    code?: string;
    price?: string;
    created_on?: string;
    modified_on?: string;
    dodelete?: boolean;
}

interface Minirendertype {
    label?: string;
    value?: string;
    id?: string;
    name?: string;
}

interface ExpenditureSheetItem {
    id?: string;
    code?: string;
    order?: string;
    make?: Minirendertype;
    price?: string;
    total_price?: string;
    qty?: string;
    originalqty?: string;
    created_on?: string;
    modified_on?: string;
    dodelete?: boolean;
    tax?: any;
    taxtype?: any;
    taxtype_name?: string;
    discount?: string;
}

export interface ExpenditureSheetInitialState extends BaseInitialState {
    expenditureSheetList: ExpenditureSheet[];
    expenditureSheetCount: number;
    pageParams: PageParamsTypes & {
        start_date?: string;
        end_date?: string;
        project_id?: string | number;
        mode_of_payment?: Minirendertype | null;
        approved_status?: Minirendertype | null;
    };

    selectedData?: ExpenditureSheet & {
        mode_of_payment?: miniType;
        received_amount?: string;
        approved_amount?: string;
        expendituresheetitems?: [
            {
                description?: string;
                remarks?: string;
                date?: string;
                place_of_visit?: string;
                expendituretype?: string;
                expendituretype_name?: string;
                expances?: Minirendertype & {
                    label: string;
                    value: string;
                };
                documents?: any[];
                amount?: string;
            }
        ];
    };
    isFilterOpen: boolean;
    approve_loading: boolean;
    checkApprove: boolean;
    approved_level: number;
    approved_status: number;
    approved_status_name: string;
    client_status_name: string;
    approved_data: any;
    model: boolean;
    rejectModel: boolean;
    reject_description: string;
    confirmModel: boolean;
    confirm_remarks?: string;
    uploadDocuments?: any[];
    document_loading: boolean;
    client_status?: miniType;
}
