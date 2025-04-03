// importExportTypes.ts

export interface ImportModel {
	// Define properties specific to ImportModel
}

export interface ExportModel {
	// Define properties specific to ExportModel
}

export interface ImportExportState {
	loading: boolean;
	exportModelList: ExportModel[];
	importModelList: ImportModel[];
	importType: number;
	exportData: Record<string, any>;
	importData: Record<string, any>;
	importResponseData: any;
	importTableColumns: Array<{ key: string; label: string }>;
	importValidRowData: any[]; // Define if you have a specific structure
	importTableRowData: any[]; // Define if you have a specific structure
	submit_ImportData: Record<string, any>;
	currentStep: number;
	model: boolean;
	request_id?: unknown;
	status?: string; // Optional status field
	error?: string; // Optional error field
}
