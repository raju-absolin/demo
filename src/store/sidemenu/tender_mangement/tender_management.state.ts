import { combineReducers } from "@reduxjs/toolkit";
import bidingItemsSlice from "./bidingitems/biding_items.slice";
import tendersSlice from "./tenders/tenders.slice";
import commentsSlice from "./comments/commets.slice";
import purchaseQuotationSlice from "./PurchaseQuotation/pq.slice";
import compareQuotationSlice from "./CompareQuotation/cq.slice";
import caseSheetSlice from "./caseSheet/caseSheet.slice";
import purchaseEnquirySlice from "./purchaseEnquiry/purchase_enquiry.slice";
import tenderValueSlice from "./TenderValue/tender_value.slice";
import reverseAuctionSlice from "./ReverseAuction/reverseAuction.slice";
import documentSlice from "./document/document.slice";

export const tenderManagementReducer = combineReducers({
	bidingItems: bidingItemsSlice,
	tenders: tendersSlice,
	comments: commentsSlice,
	purchaseEnquiry: purchaseEnquirySlice,
	purchaseQuatation: purchaseQuotationSlice,
	compareQuotation: compareQuotationSlice,
	casesheet: caseSheetSlice,
	tenderValue: tenderValueSlice,
	reverseAuction: reverseAuctionSlice,
	document: documentSlice,
});
