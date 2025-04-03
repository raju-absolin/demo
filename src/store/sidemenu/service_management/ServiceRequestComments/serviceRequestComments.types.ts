import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import { ServiceRequest } from "../ServiceRequest/serviceRequest.types";

export interface CommentPayload {
	service_request_id: string;
	comment: string;
}

export interface ServiceRequest_Comment {
	id?: string;
	code?: string;
	comment: string;
	created_on: string;
	service_request?: ServiceRequest;
	created_by: User;
}

export interface ServiceRequestCommentsState extends BaseInitialState {
	comments: ServiceRequest_Comment[];
	commentsCount: number;
	comments_loading: boolean;
	comment_params: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		user?: miniType | null;
		service_request: string;
	};
}
