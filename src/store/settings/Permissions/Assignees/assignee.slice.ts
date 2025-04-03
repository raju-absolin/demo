import { createSlice } from "@reduxjs/toolkit";
import { Assignee, AssigneeInitialState } from "./assignee.types";
import {
    getAssignees, getAssigneeById, postAssigneeData, editAssigneeDataById, deleteAssignee
} from "./assignee.action";
import { RootState } from "@src/store/store";

const initialState: AssigneeInitialState = {
    error: "",
    status: "",
    loading: false,
    assigneeList: [],
    assigneeCount: 0,
    drawer: false,
    selectedData: {
        id: "",
        code: "",
        name:"",
        screen_type:{
            id: "",
            name: ""
        },
        transaction_id:"",
        screen_type_name: "",
    },
    filterStatus: false,
    pageParams: {
        no_of_pages: 0,
        page_size: 0,
        page: 0,
        search: undefined,
        parent: undefined
    },
    model: false
};

const assigneeSlice = createSlice({
    name: "assignee",
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAssignees.pending, (state, action) => {
                state.status = "getAssignees loading";
                state.loading = true;
            })
            .addCase(getAssignees.fulfilled, (state, action) => {
                const { response, params } = action.payload;
                state.status = "getAssignees succeeded";
                state.loading = false;
                state.assigneeList = response.results;
                state.assigneeCount = response.count;
                var noofpages = Math.ceil(response.count / params.page_size);
                state.pageParams = {
                    ...state.pageParams,
                    ...params,
                    no_of_pages: noofpages,
                };
            })
            .addCase(getAssignees.rejected, (state, action) => {
                state.status = "getAssignees failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // getbyid
            .addCase(getAssigneeById.pending, (state, action) => {
                state.status = "getAssigneeById loading";
                state.loading = true;
            })
            .addCase(getAssigneeById.fulfilled, (state, action) => {
                const { response } = action.payload;
                state.status = "getAssigneeById succeeded";
                state.selectedData = response;
            })
            .addCase(getAssigneeById.rejected, (state, action) => {
                state.status = "getAssigneeById failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // post user
            //post Data
            .addCase(postAssigneeData.pending, (state, action) => {
                state.status = "postAssigneeData loading";
                state.loading = true;
            })
            .addCase(postAssigneeData.fulfilled, (state, action) => {
                state.status = "postAssigneeData succeeded";
                state.loading = false;
                state.model = false;
            })
            .addCase(postAssigneeData.rejected, (state, action) => {
                state.status = "postAssigneeData failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // edit user
            .addCase(editAssigneeDataById.pending, (state, action) => {
                state.status = "editAssigneeDataById loading";
                state.loading = true;
            })
            .addCase(editAssigneeDataById.fulfilled, (state, action) => {
                state.status = "editAssigneeDataById succeeded";
                state.loading = false;
                state.model = false;
            })
            .addCase(editAssigneeDataById.rejected, (state, action) => {
                state.status = "editAssigneeDataById failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(deleteAssignee.pending, (state, action) => {
                state.status = "deleteAssignee loading";
                state.loading = true;
            })
            .addCase(deleteAssignee.fulfilled, (state, action) => {
                state.status = "deleteAssignee succeeded";
                state.loading = false;
            })
            .addCase(deleteAssignee.rejected, (state, action) => {
                state.status = "deleteAssignee failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            });
    },
});

// Action creators are generated for each case reducer function
export const { clearUserData, setSelectedData, isModelVisible } =
    assigneeSlice.actions;

export const AssigneeSelector = (state: RootState) =>
    state.settings.assignee;

export default assigneeSlice.reducer;
