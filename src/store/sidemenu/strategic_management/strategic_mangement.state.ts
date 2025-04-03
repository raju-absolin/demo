import { combineReducers } from "@reduxjs/toolkit";
import leadsSlice from "./leads/leads.slice";
import budgetQuotationSlice from "./budget_quotation/bq.slice";
import leadsCommentsSlice from "./leads_comments/bq_comments.slice";

export const strategicManagement = combineReducers({
	leads: leadsSlice,
	budgetQuotation: budgetQuotationSlice,
	bq_comments: leadsCommentsSlice,
});
