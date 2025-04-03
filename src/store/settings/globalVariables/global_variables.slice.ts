import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { getGlobalVariables, editGlobalVariables } from "./global_variables.action";
import { RootState } from "@src/store/store";

const globalVariableSlice = createSlice({
    name: "globalVariables",
    initialState: {
        listCount: 0,
        globalVariablesData: {
            cutofftime: "",
            helplineemail: "",
            helplinephone: "",
            maxdeliverydays: "",
            recentorderdeactivatecount: ""
        },
        model: false,
        loading: false,
        error: "",
        status: "",

    },
    reducers: {
        updateGlobalVariable:(state,action)=>{
            return{
                ...state,
                cutofftime: action.payload
            }
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getGlobalVariables.pending, (state, action) => {
                state.loading = true;
                state.status = "getGlobalVariables pending";
            })
            .addCase(getGlobalVariables.fulfilled, (state, action) => {
                state.status = "getGlobalVariables succeeded";
                const { response } = action.payload;
                state.loading = false;
                state.globalVariablesData = response;
            })
            .addCase(getGlobalVariables.rejected, (state, action) => {
                state.status = "getGlobalVariables failed";
                state.loading = false;
                state.error = action.error.message || "An unknown error occurred";;
            })
            .addCase(editGlobalVariables.pending, (state, action) => {
                state.loading = true;
                state.status = "editGlobalVariables pending";
            })
            .addCase(editGlobalVariables.fulfilled, (state, action) => {
                state.status = "editGlobalVariables succeeded";
                state.loading = false;
            })
            .addCase(editGlobalVariables.rejected, (state, action) => {
                state.status = "editGlobalVariables failed";
                state.loading = false;
                state.error = action.error.message || "An unknown error occurred";;
            })
    }
});

// Action creators are generated for each case reducer function
export const {
    updateGlobalVariable
} = globalVariableSlice.actions;

export const globalVariableSelector = (state: RootState) =>
    state.settings.globalVariables;

export default globalVariableSlice.reducer;
