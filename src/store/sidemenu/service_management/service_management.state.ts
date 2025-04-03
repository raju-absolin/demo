import { combineReducers } from "@reduxjs/toolkit";
import serviceRequestSlice from "./ServiceRequest/serviceRequest.slice";
import serviceRequestAttachmentSlice from "./ServiceRequestAttachments/serviceRequestAttachments.slice";
import serviceRequestApprovalSlice from "./ServiceRequestApprovals/serviceRequestApprovals.slice";
import serviceRequestAssignedSlice from "./ServiceRequestAssigned/serviceRequestAssigned.slice";
import sserviceRequestCommentSlice from "./ServiceRequestComments/serviceRequestComments.slice";

export const serviceManagement = combineReducers({
	serviceRequest: serviceRequestSlice,
	serviceRequestAttachment: serviceRequestAttachmentSlice,
	serviceRequestComment: sserviceRequestCommentSlice,
	serviceRequestApproval: serviceRequestApprovalSlice,
	serviceRequestAssigned: serviceRequestAssignedSlice,
});
