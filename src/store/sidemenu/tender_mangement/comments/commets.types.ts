import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";
import { miniType } from "@src/store/mini/mini.Types";

export interface Comment {
	id?: string | number;
	tender_id?: string | number;
	comment?: string;
	created_on?: string;
	created_by?: {
		fullname: string;
		username?: string;
	};
}

export interface CommentsInitialState extends BaseInitialState {
	commentsList: Comment[];
	commentsCount: number;
	pageParams: PageParamsTypes & {
		start_date?: any;
		end_date?: any;
		tender?: string | number;
	};
	comment?: string;
	commentModal: boolean;
	selectedData?: Comment;
	isFilterOpen: boolean;
}
