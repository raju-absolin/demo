import { createSlice } from "@reduxjs/toolkit";
import { Approval, ApprovalInitialState } from "./approval.types";
import {
    getApprovals, getApprovalById, postApprovalData, editApprovalDataById, deleteApproval
} from "./approval.action";
import { RootState } from "@src/store/store";

const initialState: ApprovalInitialState = {
    error: "",
    status: "",
    loading: false,
    approvalList: [],
    approvalCount: 0,
    drawer: false,
    selectedData: {
        id: "",
        code: "",
        name: "",
        screen_type: {
            id: "",
            name: ""
        },
        approve_type: {
            id: "",
            name: ""
        },
        levelno: "",
        screen_type_name: "",
        approve_type_name:"",
        finalapproval: false
    },
    filterStatus: false,
    pageParams: {
        no_of_pages: 0,
        page_size: 0,
        page: 0,
        search: undefined,
        parent: undefined
    },
    finalapproval: false,
    model: false
};

const approvalSlice = createSlice({
    name: "approval",
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
        isModelVisible: (state, action) => {
            return {
                ...state,
                model: action.payload,
            };
        },
        SetSwitchApproval: (state, action) => {
            return {
                ...state,
                selectedData:{
                        ...state.selectedData,
                    finalapproval: action.payload
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getApprovals.pending, (state, action) => {
                state.status = "getApprovals loading";
                state.loading = true;
            })
            .addCase(getApprovals.fulfilled, (state, action) => {
                const { response, params } = action.payload;
                state.status = "getApprovals succeeded";
                state.loading = false;
                state.approvalList = response.results;
                state.approvalCount = response.count;
                var noofpages = Math.ceil(response.count / params.page_size);
                state.pageParams = {
                    ...state.pageParams,
                    ...params,
                    no_of_pages: noofpages,
                };
            })
            .addCase(getApprovals.rejected, (state, action) => {
                state.status = "getApprovals failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // getbyid
            .addCase(getApprovalById.pending, (state, action) => {
                state.status = "getApprovalById loading";
                state.loading = true;
            })
            .addCase(getApprovalById.fulfilled, (state, action) => {
                const { response } = action.payload;
                state.status = "getApprovalById succeeded";
                state.finalapproval = response?.finalapproval;
                state.selectedData = response;
            })
            .addCase(getApprovalById.rejected, (state, action) => {
                state.status = "getApprovalById failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // post user
            //post Data
            .addCase(postApprovalData.pending, (state, action) => {
                state.status = "postApprovalData loading";
                state.loading = true;
            })
            .addCase(postApprovalData.fulfilled, (state, action) => {
                state.status = "postApprovalData succeeded";
                state.loading = false;
                state.model = false;
            })
            .addCase(postApprovalData.rejected, (state, action) => {
                state.status = "postApprovalData failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // edit user
            .addCase(editApprovalDataById.pending, (state, action) => {
                state.status = "editApprovalDataById loading";
                state.loading = true;
            })
            .addCase(editApprovalDataById.fulfilled, (state, action) => {
                state.status = "editApprovalDataById succeeded";
                state.loading = false;
                state.model = false;
            })
            .addCase(editApprovalDataById.rejected, (state, action) => {
                state.status = "editApprovalDataById failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(deleteApproval.pending, (state, action) => {
                state.status = "deleteApproval loading";
                state.loading = true;
            })
            .addCase(deleteApproval.fulfilled, (state, action) => {
                state.status = "deleteApproval succeeded";
                state.loading = false;
            })
            .addCase(deleteApproval.rejected, (state, action) => {
                state.status = "deleteApproval failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            });
    },
});

// Action creators are generated for each case reducer function
export const { clearUserData, setSelectedData, isModelVisible, SetSwitchApproval } =
    approvalSlice.actions;

export const ApprovalSelector = (state: RootState) =>
    state.settings.approval;

export default approvalSlice.reducer;
