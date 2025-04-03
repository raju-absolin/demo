// importExportSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	ImportUploadStatus,
	downloadExportData,
	exportdownloadfile,
	exportstatus,
	getExportModelsList,
	getImportModelsList,
	// submitImportType2Data,
	uploadImportData,
	// uploadImportType2Data,
} from "./importExportAction";
import {
	ExportModel,
	ImportExportState,
	ImportModel,
} from "./importExportTypes";
import { RootState } from "@src/store/store";

const initialState: ImportExportState = {
	loading: false,
	exportModelList: [],
	importModelList: [],
	importType: 0,
	exportData: {},
	importData: {},
	importTableColumns: [],
	importValidRowData: [],
	importTableRowData: [],
	submit_ImportData: {},
	currentStep: 0,
	model: false,
	importResponseData: {},
};

const importExportSlice = createSlice({
	name: "importExport",
	initialState,
	reducers: {
		clearData(state) {
			return {
				...state,
				loading: false,
				exportModelList: [],
				importModelList: [],
				importType: 0,
				exportData: {},
				importData: {},
			};
		},
		InputChangeValue: (
			state,
			action: PayloadAction<{
				key: string;
				value: any;
				type: "import" | "export";
			}>
		) => {
			console.log("hgfehfguc");
			if (action.payload.type === "import") {
				state.importData = {
					...state.importData,
					[action.payload.key]: action.payload.value,
				};
			} else {
				state.exportData[action.payload.key] = action.payload.value;
			}
		},
		nextStep(state) {
			state.currentStep += 1;
		},
		prevStep(state) {
			state.currentStep -= 1;
		},
		finishStep(state) {
			return {
				...state,
				exportData: {},
				importData: {},
				importTableColumns: [],
				importValidRowData: [],
				submit_ImportData: {},
				currentStep: 0,
			};
		},
		changeType(state, action: PayloadAction<number>) {
			state.importType = action.payload;
		},
		uploadImportType2Data: (state, action) => {
			return {
				...state,
				loading: true,
			};
		},
		submitImportType2Data: (state, action) => {
			return {
				...state,
				loading: true,
			};
		},
		submitImportData: (state, action) => {
			return {
				...state,
				loading: true,
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getImportModelsList.pending, (state) => {
				state.loading = true;
				state.status = "getImportModelsList pending";
			})
			.addCase(
				getImportModelsList.fulfilled,
				(state, action: PayloadAction<{ response: ImportModel[] }>) => {
					state.status = "getImportModelsList succeeded";
					state.loading = false;
					state.importModelList = action.payload.response;
				}
			)
			.addCase(getImportModelsList.rejected, (state, action) => {
				state.status = "getImportModelsList failed";
				state.loading = false;
				state.error = action.error.message || "";
			})
			.addCase(getExportModelsList.pending, (state) => {
				state.loading = true;
				state.status = "getExportModelsList pending";
			})
			.addCase(
				getExportModelsList.fulfilled,
				(state, action: PayloadAction<{ response: ExportModel[] }>) => {
					state.status = "getExportModelsList succeeded";
					state.loading = false;
					state.exportModelList = action.payload.response;
				}
			)
			.addCase(getExportModelsList.rejected, (state, action) => {
				state.status = "getExportModelsList failed";
				state.loading = false;
				state.error = action.error.message || "";
			})
			.addCase(downloadExportData.pending, (state) => {
				state.loading = true;
				state.status = "downloadExportData pending";
			})
			.addCase(downloadExportData.fulfilled, (state) => {
				state.status = "downloadExportData succeeded";
				state.loading = false;
			})
			.addCase(downloadExportData.rejected, (state, action) => {
				state.status = "downloadExportData failed";
				state.loading = false;
				state.error = action.error.message || "";
			})
			.addCase(exportdownloadfile.pending, (state) => {
				state.loading = true;
				state.status = "exportdownloadfile pending";
			})
			.addCase(exportdownloadfile.fulfilled, (state) => {
				state.status = "exportdownloadfile succeeded";
				state.loading = false;
			})
			.addCase(exportdownloadfile.rejected, (state, action) => {
				state.status = "exportdownloadfile failed";
				state.loading = false;
				state.error = action.error.message || "";
			})
			.addCase(exportstatus.pending, (state) => {
				state.loading = true;
				state.status = "exportstatus pending";
			})
			.addCase(exportstatus.fulfilled, (state) => {
				state.status = "exportstatus succeeded";
				state.loading = true;
			})
			.addCase(exportstatus.rejected, (state, action) => {
				state.status = "exportstatus failed";
				state.loading = false;
				state.error = action.error.message || "";
			})
			.addCase(uploadImportData.pending, (state) => {
				state.loading = true;
				state.status = "uploadImportData pending";
			})
			.addCase(
				uploadImportData.fulfilled,
				(state, action: PayloadAction<{ response: any }>) => {
					state.status = "uploadImportData succeeded";
					state.loading = false;
					state.request_id = action.payload.response; // Assuming response is a string or an object containing request_id
				}
			)
			.addCase(uploadImportData.rejected, (state, action) => {
				state.status = "uploadImportData failed";
				state.loading = false;
				state.error = action.error.message || "";
			})
			.addCase(ImportUploadStatus.pending, (state) => {
				state.loading = true;
				state.status = "ImportUploadStatus pending";
			})
			.addCase(
				ImportUploadStatus.fulfilled,
				(state, action: PayloadAction<{ response: any }>) => {
					if (action.payload) {
						const { response } = action.payload;
						let columns: Array<{ key: string; label: string }> = [];
						if (response !== "Import is still running") {
							// if (!response?.has_errors) {
							if (!response?.has_validation_errors) {
								if (response?.valid_rows?.length > 0) {
									columns = Object.keys(
										response.valid_rows[0]
									).map((key) => ({ key, label: key }));
								}
							} else {
								if (response?.invalid_rows?.length > 0) {
									columns = Object.keys(
										response.invalid_rows[0]
									).map((key) => ({ key, label: key }));
								}
							}
							// }
							state.status = "ImportUploadStatus succeeded";
							state.loading = false;
							state.importType = 1;
							state.importResponseData = response;
							state.importTableColumns = columns;
							state.importTableRowData =
								!response?.has_errors &&
								response?.has_validation_errors
									? response.invalid_rows
									: response.valid_rows;
						}
					}
				}
			)
			.addCase(ImportUploadStatus.rejected, (state, action) => {
				state.status = "ImportUploadStatus failed";
				state.loading = false;
				state.error = action.error.message || "";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	InputChangeValue,
	nextStep,
	prevStep,
	finishStep,
	changeType,
	clearData,
	uploadImportType2Data,
	submitImportData,
	submitImportType2Data,
} = importExportSlice.actions;

export const importExportSelector = (state: RootState) =>
	state.settings.importExport;

export default importExportSlice.reducer;
