import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export interface ApiPayload {
	service_request_id: string;
	file: File; // Description of the service request
}

export interface ServiceRequestAttachment {
	file: string;
	id: string;
	path?: string;
	preview?: string;
	formattedSize?: string;
}

export interface ServiceRequestAttachmentsState extends BaseInitialState {
	list: Array<ServiceRequestAttachment> & Array<File>;
	count: number;
	selectedData?: ServiceRequestAttachment;
	pageParams: PageParamsTypes & {
		start_date?: string;
		end_date?: string;
		service_request?: string;
	};
}
