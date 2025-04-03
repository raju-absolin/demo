import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";
import { MaterialRequestInitialState } from "./material_request.types";
import {
    MRCheckApproval,
    editMaterialRequest,
    getMRById,
    getMakeByitemId,
    getMaterialRequest,
    materialRequestApproval,
    postMaterialRequest,
    updateMaterialRequestStatus
} from "./material_request.action";
import { systemSelector } from "@src/store/system/system.slice";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { Vendor } from "../purchaseEnquiry/purchase_enquiry.types";
import { purchaseQuotationSelectors } from "../../tender_mangement/PurchaseQuotation/pq.slice";

const initialState: MaterialRequestInitialState = {
    loading: false,
    status: "",
    error: "",
    mrList: [],
    mrCount: 0,
    selectedData: {},
    pageParams: {
        page: 1,
        page_size: 10,
        search: "",
        no_of_pages: 0,
    },
    isFilterOpen: false,
    makeByItem: {
        list: [],
        loading: false,
        count: 0,
        miniParams: {
            no_of_pages: 0,
            page_size: 10,
            page: 1,
            search: "",
        },
    },
    approve_loading: false,
    checkApprove: false,
    approved_level: 0,
    approved_status: 0,
    approved_status_name: "",
    approved_data: {},
    model: false,
    rejectModel: false,
    reject_description: "",
    itemPageParams: {
        no_of_pages: 0,
        page_size: 10,
        ordering: undefined,
        page: 1,
        search: undefined,
        parent: undefined
    },
    itemModel: false,
    itemName: "",
    mr_itemData: {}
};

const materialRequestSlice = createSlice({
    name: "materialRequest",
    initialState,
    reducers: {
        setSelectedData: (state, action) => {
            return {
                ...state,
                selectedData: action.payload,
            };
        },
        setIsFilterOpen: (state, action) => {
            return {
                ...state,
                isFilterOpen: action.payload,
            };
        },
        setPageParams: (state, action) => {
            return {
                ...state,
                pageParams: action.payload,
            };
        },
        clearMakeByItem: (state, action) => {
            return {
                ...state,
                makeByItem: initialState.makeByItem,
            };
        },
        getMRCheckApprove: (state) => {
            return {
                ...state,
                approve_loading: true,
                checkApprove: false,
            };
        },
        mrCheckApproveSuccessful: (state, action) => {
            return {
                ...state,
                approve_loading: false,
                checkApprove: action.payload,
            };
        },
        setIsModalOpen: (state, action) => {
            return {
                ...state,
                model: action.payload
            }
        },
        setIsRejectModalOpen: (state, action) => {
            return {
                ...state,
                rejectModel: action.payload
            }
        },
        setIsItemModalOpen: (state, action) => {
            return {
                ...state,
                itemModel: action.payload
            }
        },
        setItemName: (state, action) => {
            return {
                ...state,
                itemName: action.payload
            }
        },
        setMRItemData: (state, action) => {
            return {
                ...state,
                mr_itemData: action.payload
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getMaterialRequest.pending, (state, action) => {
                state.status = "getMaterialRequest pending";
                state.loading = true;
            })
            .addCase(getMaterialRequest.fulfilled, (state, action) => {
                const { response, params } = action.payload;
                state.status = "getMaterialRequest succeeded";
                state.loading = false;
                state.mrList = response.results;
                state.mrCount = response.count;
                var noofpages = Math.ceil(response.count / params.page_size);
                state.pageParams = {
                    ...state.pageParams,
                    ...params,
                    no_of_pages: noofpages,
                };
            })
            .addCase(getMaterialRequest.rejected, (state, action) => {
                state.status = "getMaterialRequest failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(getMRById.pending, (state, action) => {
                state.status = "getMRById pending";
                state.loading = true;
            })
            .addCase(getMRById.fulfilled, (state, action) => {
                const { response }: any = action.payload;
                state.status = "getMRById succeeded";
                state.loading = false;
                state.approved_data = response;
                state.approved_level = response?.approved_level;
                state.approved_status = response?.approved_status;
                state.approved_status_name = response?.approved_status_name;
                state.selectedData = {
                    ...response,
                    mr_items: response?.mr_items?.map((item: any) => {
                        return {
                            ...item,
                            item: {
                                ...item.item,
                                label: item?.item?.name,
                                value: item?.item?.id,
                            },
                            item_name: item?.item_name,
                            unit_name: item?.unit_name,
                            batch: {
                                ...item.batch,
                                label: item?.batch?.name,
                                value: item?.batch?.id,
                            },
                            unit: {
                                ...item.unit,
                                label: item?.unit?.name,
                                value: item?.unit?.id,
                            },
                            make: {
                                ...item.make,
                                label: item.make?.name,
                                value: item.make?.id,
                            },
                        };
                    }),
                };
            })
            .addCase(getMRById.rejected, (state, action) => {
                state.status = "getMRById failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            //post Data
            .addCase(postMaterialRequest.pending, (state, action) => {
                state.status = "postMaterialRequest pending";
                state.loading = true;
            })
            .addCase(postMaterialRequest.fulfilled, (state, action) => {
                state.status = "postMaterialRequest succeeded";
                state.loading = false;
            })
            .addCase(postMaterialRequest.rejected, (state, action) => {
                state.status = "postMaterialRequest failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            //edit Data
            .addCase(editMaterialRequest.pending, (state, action) => {
                state.status = "editMaterialRequest pending";
                state.loading = true;
            })
            .addCase(editMaterialRequest.fulfilled, (state, action) => {
                state.status = "editMaterialRequest succeeded";
                state.loading = false;
            })
            .addCase(editMaterialRequest.rejected, (state, action) => {
                state.status = "editMaterialRequest failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(getMakeByitemId.pending, (state, action) => {
                state.status = "getMakeByitemId loading";
                state.makeByItem.loading = true;
            })
            .addCase(getMakeByitemId.fulfilled, (state, action) => {
                state.status = "getMakeByitemId succeeded";
                var response = action.payload.response;
                var params = action.payload.params;
                var list = [];
                if (params?.page == 1) {
                    list = response.results;
                } else {
                    list = [...state.makeByItem.list, ...response.results];
                }
                var noofpages = Math.ceil(
                    response.count / state.makeByItem.miniParams?.page_size
                );
                state.makeByItem = {
                    list: list,
                    count: response.count,
                    loading: false,
                    miniParams: {
                        ...state.makeByItem.miniParams,
                        ...params,
                        no_of_pages: noofpages,
                    },
                };
            })
            .addCase(getMakeByitemId.rejected, (state, action) => {
                state.status = "getMakeByitemId failed";
                state.makeByItem.loading = false;
                state.error = action.error.message ?? "Some Error occurred";
            })
            .addCase(materialRequestApproval.pending, (state, action) => {
                state.status = "materialRequestApproval pending";
                state.approve_loading = true;
            })
            .addCase(materialRequestApproval.fulfilled, (state, action) => {
                state.status = "materialRequestApproval succeeded";
                state.approve_loading = false;
            })
            .addCase(materialRequestApproval.rejected, (state, action) => {
                state.status = "materialRequestApproval failed";
                state.approve_loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(MRCheckApproval.pending, (state, action) => {
                state.status = "MRCheckApproval pending";
                state.approve_loading = true;
            })
            .addCase(MRCheckApproval.fulfilled, (state, action) => {
                state.status = "MRCheckApproval succeeded";
                const { response }: any = action.payload;
                state.checkApprove = true;
                state.approve_loading = false;
            })
            .addCase(MRCheckApproval.rejected, (state, action) => {
                state.status = "MRCheckApproval failed";
                state.approve_loading = false;
                state.checkApprove = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(updateMaterialRequestStatus.pending, (state, action) => {
                state.status = "updateMaterialRequestStatus pending";
                state.loading = true;
            })
            .addCase(updateMaterialRequestStatus.fulfilled, (state, action) => {
                state.status = "updateMaterialRequestStatus succeeded";
                state.loading = false;
            })
            .addCase(updateMaterialRequestStatus.rejected, (state, action) => {
                state.status = "updateMaterialRequestStatus failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })

    },
});

// Action creators are generated for each case reducer function
export const {
    setSelectedData,
    setIsFilterOpen,
    setPageParams,
    clearMakeByItem,
    getMRCheckApprove,
    mrCheckApproveSuccessful,
    setIsModalOpen,
    setIsRejectModalOpen,
    setIsItemModalOpen,
    setItemName,
    setMRItemData
} = materialRequestSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const materialRequestSelectors = (state: RootState) =>
    state.projectManagement.materialRequest;

// Memoized selector
export const selectMaterialRequest = createSelector(
    [
        materialRequestSelectors,
        purchaseQuotationSelectors,
        purchaseEnquirySelector,
        workOrdersSelectors,
        systemSelector,
        miniSelector,
        selectLayoutTheme,
    ],
    (
        materialRequest,
        purchaseQuotation,
        purchaseEnquiry,
        workOrder,
        system,
        mini,
        customise
    ) => ({
        materialRequest,
        purchaseQuotation,
        purchaseEnquiry,
        workOrder,
        system,
        mini,
        customise,
    })
);

export default materialRequestSlice.reducer;
