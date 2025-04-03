import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
    getExpenses,
    getExpensesById,
    addExpenses,
    deleteExpenses,
} from "./expenses.action";
import { RootState } from "@src/store/store";
import { Expenses, ExpensesInitialState } from "./expenses.types";
import { systemSelector } from "@src/store/system/system.slice";

const initialState: ExpensesInitialState = {
    error: "",
    status: "",
    loading: false,
    model: false,
    expensesList: [],
    expensesCount: 0,
    searchValue: "",
    drawer: false,
    masterValue: "",
    isModelVisible: false,
    selectedData: {},
    filterStatus: false,
    pageParams: {
        no_of_pages: 0,
        page_size: 10,
        page: 1,
        search: "",
    },
    masterEditId: 0,
};

const expensesSlice = createSlice({
    name: "expenses",
    initialState,
    reducers: {
        clearUserData: (state, action) => {
            return initialState;
        },
        setIsPasswordModel: (state, action) => {
            return {
                ...state,
                passwordModel: action.payload,
            };
        },
        setSelectedData: (state, action) => {
            return {
                ...state,
                selectedData: action.payload,
            };
        },
        setSearchValue: (state, action) => {
            return {
                ...state,
                searchValue: action.payload,
            };
        },
        isModelVisible: (state, action) => {
            return {
                ...state,
                isModelVisible: action.payload,
            };
        },
        setMasterValue: (state, action) => {
            return {
                ...state,
                masterValue: action.payload,
            };
        },
        setMasterEditId: (state, action) => {
            return {
                ...state,
                masterEditId: action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getExpenses.pending, (state, action) => {
                state.status = "getExpenses loading";
                state.loading = true;
            })
            .addCase(getExpenses.fulfilled, (state, action) => {
                const { response, params } = action.payload;
                state.status = "getExpenses succeeded";
                state.loading = false;
                state.expensesList = response.results;
                state.expensesCount = response.count;
                var noofpages = Math.ceil(response.count / params.page_size);
                state.pageParams = {
                    ...state.pageParams,
                    ...params,
                    no_of_pages: noofpages,
                };
            })
            .addCase(getExpenses.rejected, (state, action) => {
                state.status = "getExpenses failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            // getbyid
            .addCase(getExpensesById.pending, (state, action) => {
                state.status = "getExpensesById loading";
                state.loading = true;
            })
            .addCase(getExpensesById.fulfilled, (state, action) => {
                const { response } = action.payload;
                state.status = "succeeded";
                state.loading = false;
                state.masterValue = response.name;
                state.selectedData = response;
            })
            .addCase(getExpensesById.rejected, (state, action) => {
                state.status = "getExpensesById failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(addExpenses.pending, (state, action) => {
                state.status = "addExpenses loading";
                state.loading = true;
            })
            .addCase(addExpenses.fulfilled, (state, action) => {
                state.status = "addExpenses succeeded";
                // state.loading = false;
            })
            .addCase(addExpenses.rejected, (state, action) => {
                state.status = "addExpenses failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            })
            .addCase(deleteExpenses.pending, (state, action) => {
                state.status = "deleteExpenses loading";
                state.loading = true;
            })
            .addCase(deleteExpenses.fulfilled, (state, action) => {
                state.status = "deleteExpenses succeeded";
                state.loading = false;
            })
            .addCase(deleteExpenses.rejected, (state, action) => {
                state.status = "deleteExpenses failed";
                state.loading = false;
                state.error =
                    action.error?.message || "An unknown error occurred";
            });
    },
});

// Action creators are generated for each case reducer function
export const {
    clearUserData,
    setIsPasswordModel,
    setSelectedData,
    setSearchValue,
    isModelVisible,
    setMasterValue,
    setMasterEditId,
} = expensesSlice.actions;

export const expensesSelector = (state: RootState) => state.masters.expenses;

export const selectExpenses = createSelector(
    [expensesSelector, systemSelector],
    (expenses, system) => {
        return {
            expenses,
            system,
        };
    }
);

export default expensesSlice.reducer;
