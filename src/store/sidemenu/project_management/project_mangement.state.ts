import { combineReducers } from "@reduxjs/toolkit";
import workOrdersSlice from "./work_order/work_order.slice";
import purchaseIndentSlice from "./purchaseIndent/purchase_indent.slice";
import purchaseEnquirySlice from "./purchaseEnquiry/purchase_enquiry.slice";
import projectTeamsSlice from "./project_teams/project_teams.slice";
import purchaseQuatationSlice from "./PurchaseQuotation/pq.slice";
import materialReceivedNotesSlice from "./MaterialReceivedNotes/mrn.slice";
import mrnReturnSlice from "./MRNReturn/mrn_return.slice";
import compareQuotationSlice from "./CompareQuotation/cq.slice";
import purchaseOrderSlice from "./PurchaseOrder/po.slice";
import materialRequestSlice from "./MaterialRequest/material_request.slice";
import projectGroupSlice from "./ProjectGroups/projectGroups.slice";
import materialIssuesSlice from "./MaterialIssue/mr_issues.slice";
import materialReceiptSlice from "./MaterialReceipt/material_receipt.slice";
import materialConsumptionSlice from "./MaterialConsumption/material_consumption.slice";
import performanceBankGuaranteeSlice from "./PerformanceBankGuarantee/PBG.slice";
import extendedEndDateSlice from "./ExtendedEndDate/EED.slice";
import stockOutSlice from "./StockTransferOut/stock_out.slice";
import issueToProductionSlice from "./IssueToProduction/ITP.slice";
import stockInSlice from "./StockTransferIn/stock_in.slice";
import receiptFromProductionSlice from "./ReceiptFromProduction/RFP.slice";
import deliveryChallanSlice from "./DeliveryChallan/DC.slice";
import paymentRequestSlice from "./PaymentRequest/payment_request.slice";
import deliveryReturnNotesSlice from "./DeliveryNoteReturn/DNR.slice";
import expenditureSheetSlice from "./ExpenditureSheet/expenditure_sheet.slice";
import projectActivitySlice from "./ProjectActivity/project_activity.slice";

export const projectManagement = combineReducers({
	workOrder: workOrdersSlice,
	purchaseIndent: purchaseIndentSlice,
	purchaseEnquiry: purchaseEnquirySlice,
	projectTeams: projectTeamsSlice,
	purchaseQuatation: purchaseQuatationSlice,
	materialReceivedNotes: materialReceivedNotesSlice,
	compareQuotation: compareQuotationSlice,
	purchaseOrder: purchaseOrderSlice,
	mrnReturn: mrnReturnSlice,
	materialRequest: materialRequestSlice,
	projectGroups: projectGroupSlice,
	materialIssues: materialIssuesSlice,
	materialReceipt: materialReceiptSlice,
	materialConsumption: materialConsumptionSlice,
	performanceBankGuarantee: performanceBankGuaranteeSlice,
	extendedEndDate: extendedEndDateSlice,
	stockOut: stockOutSlice,
	stockIn: stockInSlice,
	issueToProduction: issueToProductionSlice,
	receiptFromProduction: receiptFromProductionSlice,
	deliveryChallan: deliveryChallanSlice,
	paymentRequest: paymentRequestSlice,
	deliveryReturnNotes: deliveryReturnNotesSlice,
	expenditureSheet: expenditureSheetSlice,
	projectActivity: projectActivitySlice
});
