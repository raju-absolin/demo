import { createSelector, createSlice } from "@reduxjs/toolkit";
import { Project, ProjectActivityInitialState } from "./project_activity.types";
import {
    getProjectActivityList,
} from "./project_activity.action";
import { RootState } from "@src/store/store";
import { purchaseQuotationSelectors } from "../PurchaseQuotation/pq.slice";
import { purchaseEnquirySelector } from "../purchaseEnquiry/purchase_enquiry.slice";
import { workOrdersSelectors } from "../work_order/work_order.slice";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import { selectLayoutTheme } from "@src/store/customise/customise";

const initialState: ProjectActivityInitialState = {
    error: "",
    status: "",
    loading: false,
    activityList: [],
    activityCount: 0,
    drawer: false,
    selectedData: {
        id: "",
        name: "",
        code: "",
    },
    activityLoading: false,
    projectActivityParams: {
        no_of_pages: 0,
        page_size: 10,
        page: 1,
        search: "",
    },
    filterStatus: false,
    pageParams: {
        no_of_pages: 0,
        page_size: 10,
        page: 1,
        search: "",
    },
    ActivityList: [],
    ActivityCount: 0,
};

const projectActivitySlice = createSlice({
    name: "projectActivity",
    initialState,
    reducers: {
        clearUserData: () => {
            return initialState;
        },
        setSelectedData: (state, action) => {
            return {
                ...state,
                selectedData: action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjectActivityList.pending, (state, action) => {
                state.status = "getProjectActivityList pending"
                state.activityLoading = true
            })
            .addCase(getProjectActivityList.fulfilled, (state, action) => {
                const { response, params } = action.payload;
                state.status = "getProjectActivityList succeeded";
                state.activityLoading = false;
                var noofpages = Math.ceil(
                    response.count / state.projectActivityParams?.page_size
                );

                state.activityList = response.results;
                state.activityCount = response.count;
                state.projectActivityParams = {
                    ...state.projectActivityParams,
                    no_of_pages: noofpages,
                };
            })
            .addCase(getProjectActivityList.rejected, (state, action) => {
                state.status = "getProjectActivityList failed";
                state.activityLoading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
    },
});

export const {
    setSelectedData,
} = projectActivitySlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const projectActivitySelectors = (state: RootState) =>
    state.projectManagement.projectActivity;

// Memoized selector
export const selectMRNReturn = createSelector(
    [
        projectActivitySelectors,
        purchaseQuotationSelectors,
        purchaseEnquirySelector,
        workOrdersSelectors,
        systemSelector,
        miniSelector,
        selectLayoutTheme,
    ],
    (
        projectActivity,
        purchaseQuotation,
        purchaseEnquiry,
        workOrder,
        system,
        mini,
        customise
    ) => ({
        projectActivity,
        purchaseQuotation,
        purchaseEnquiry,
        workOrder,
        system,
        mini,
        customise,
    })
);

export default projectActivitySlice.reducer;