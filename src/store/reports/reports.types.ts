import { PageParamsTypes } from "@src/common/common.types";

// Define the types for the schedule reports
interface ScheduleReports {
	scheduleCount: number;
	getScheduleReportsData: Record<string, any>; // You can replace `any` with a more specific type if you have it
	getScheduleReportsSuccessData: any[]; // Adjust this type as necessary
}

// Define the types for the page parameters
interface PageParams {
	ParamsData: {
		start_date?: string;
		end_date?: string;
		no_of_pages?: number;
		page_size?: number;
		page?: number;
		search?: string;
	};
	objData: {
		file_format: number;
		model_name: string;
	};
}

// Define the main state type
export interface ReportsState {
	show: boolean;
	reportsItemsList: any[]; // Replace `any` with a more specific type if known
	reportDataList: any[];
	reportsDataCount: number;
	modelName: string;
	columnsList: {
		title: string;
		width: number | string;
	}[];
	reportView: boolean;
	error: string;
	status: string;
	loading: boolean;
	scheduleLoading: boolean;
	scheduleReports: ScheduleReports;
	pageParams: PageParams;
}
