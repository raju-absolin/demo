import { createAsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import {
	postAdd,
	getList,
	postDownloadFile,
	postFormData,
	getParamsList,
	addParams,
} from "../../../helpers/Helper";
import Swal from "sweetalert2";
import { AnyAction, Dispatch } from "redux";
import { RootState } from "@src/store/store";

// Helper function for showing success messages
const showSuccess = (message: string) => {
	Swal.fire({
		icon: "success",
		title: "Success",
		text: message,
		timer: 3000,
		showConfirmButton: false,
	});
};

// Helper function for showing error messages
const showError = (message: string) => {
	Swal.fire({
		icon: "error",
		title: "Error",
		text: message,
	});
};

// Delay function to mimic async timeouts
const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => resolve(), ms);
	});

// Fetching Import Models List
export const getImportModelsList = createAsyncThunk(
	"getImportModelsList",
	async (_, { rejectWithValue }) => {
		try {
			const response = await getList("/reports/generic_import_models/");
			if (response.data) {
				return { response: response.data };
			} else {
				throw new Error("Failed to fetch import models.");
			}
		} catch (error: any) {
			showError("Sorry! There was a server-side issue.");
			return rejectWithValue(error.message);
		}
	}
);

// Fetching Export Models List
export const getExportModelsList = createAsyncThunk<any>(
	"/getExportModelsList",
	async (payload) => {
		var params = addParams(payload);
		try {
			const response = await getList("/reports/generic_export_models/");
			if (response.data) {
				return { response: response.data };
			} else {
				throw new Error("Failed to fetch export models.");
			}
		} catch (error: any) {
			showError("Sorry! There was a server-side issue.");
			return error.message;
		}
	}
);

// Checking Export Status
export const exportstatus = createAsyncThunk(
	"exportstatus",
	async (
		payload: {
			objData: {
				file_format: number;
				model_name: string;
			};
			request_id: string;
			ParamsData?: any;
			dispatch: AppDispatch;
		},
		{ dispatch, rejectWithValue }
	) => {
		try {
			const response = await postAdd(
				`/reports/generic_export/status/${payload.request_id}/`,
				payload,
				{}
			);
			if (response.data.status) {
				const objData = {
					request_id: payload.request_id,
					model_name: payload.objData.model_name,
					file_format: 0,
				};

				Swal.close();
				return dispatch(exportdownloadfile(objData)); // Properly return the dispatch
			} else {
				await ExportDelay({
					objData: {
						file_format: payload.objData.file_format,
						model_name: payload.objData.model_name,
					},
					ParamsData: payload?.ParamsData,
					request_id: payload?.request_id,
					dispatch,
				});
			}
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
);

// Export Download File
export const exportdownloadfile = createAsyncThunk<any, any>(
	"exportdownloadfile",
	async (
		payload: {
			request_id: string;
			model_name: string;
			file_format: number;
		},
		{ rejectWithValue }
	) => {
		try {
			const response: any = await postDownloadFile(
				`/reports/generic_export/download/${payload.request_id}/`,
				payload,
				{}
			);
			if (response.data) {
				Swal.fire({
					icon: "success",
					title: "Success",
					text: "Report downloaded successfully!",
				});
				return response.data;
			}
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
);

type AppDispatch = ThunkDispatch<any, any, AnyAction>;

// Export Delay with Timeout
const ExportDelay = async (payload: {
	objData: {
		file_format: number;
		model_name: string;
	};
	ParamsData?: any;
	request_id: string;
	dispatch: AppDispatch;
}) => {
	await delay(10000);
	await payload.dispatch(
		exportstatus({
			...payload,
			request_id: payload.request_id,
		})
	);
};

// Download Export Data
export const downloadExportData = createAsyncThunk(
	"downloadExportData",
	async (
		payload: {
			objData: {
				file_format: number;
				model_name: string;
			};
			ParamsData?: any;
		},
		{ dispatch, rejectWithValue }
	) => {
		try {
			Swal.fire({
				text: "Generating Report, please wait...",
				didOpen: () => {
					Swal.showLoading();
				},
				allowOutsideClick: false,
			});

			const response = await postAdd(
				"/reports/generic_export/",
				payload.objData,
				payload.ParamsData
			);
			if (response.status === 201) {
				await ExportDelay({
					...payload,
					request_id: response.data.request_id,
					dispatch,
				});
			} else {
				throw new Error("Failed to generate export data.");
			}
		} catch (error: any) {
			showError(error.message);
			return rejectWithValue(error.message);
		}
	}
);

const ImportDelay = async (payload: {
	request_id: string;
	dispatch: AppDispatch;
}) => {
	await delay(10000);
	await payload.dispatch(
		ImportUploadStatus({ request_id: payload.request_id })
	);
};

// Import Upload Status
export const ImportUploadStatus = createAsyncThunk<any, any>(
	"ImportUploadStatus",
	async (payload: { request_id: string }, { dispatch, rejectWithValue }) => {
		try {
			const response = await postAdd(
				`/reports/generic_import/status/${payload.request_id}/`,
				{}
			);
			if (response.status === 201) {
				Swal.close();
				return { response: response.data.message };
			} else if (response.status === 202) {
				return await ImportDelay({
					request_id: payload.request_id,
					dispatch,
				});
			} else {
				throw new Error("Failed to check import status.");
			}
		} catch (error: any) {
			showError("Sorry! There was a server-side issue.");
			return rejectWithValue(error.message);
		}
	}
);

export const uploadImportData = createAsyncThunk(
	"uploadImportData",
	async (
		payload: {
			obj: {
				model_name: string;
				import_file: File;
				input_format: number;
			};
			onSuccess: (res: any) => void;
			onFailure: () => void;
		},
		{ rejectWithValue }
	) => {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		try {
			const response = await postFormData(
				"/reports/generic_import/dryrun",
				payload.obj
			);

			if (response.status === 200) {
				payload.onSuccess({ request_id: response.data.request_id });
				return { response: response.data.request_id };
			} else {
				throw new Error("Failed to upload import data.");
			}
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
);

export const uploadTabelPreviewData = createAsyncThunk(
	"uploadTabelPreviewData",
	async (
		payload: {
			obj: any;
			onSuccess: (res: any) => void;
			onFailure: () => void;
		},
		{ dispatch, rejectWithValue }
	) => {
		try {
			Swal.fire({
				text: "Loading, please wait...",
				didOpen: () => {
					Swal.showLoading();
				},
				allowOutsideClick: false,
			});
			const response: any = await postAdd(
				"/reports/generic_import/process",
				payload.obj
			);

			if (response.status === 200) {
				payload.onSuccess({ request_id: response.data.request_id });
				return await ImportDelay({
					request_id: response.data.request_id,
					dispatch,
				});
				return { response: response.data.request_id };
			} else {
				throw new Error("Failed to upload import data.");
			}
		} catch (error: any) {
			showError("Sorry! There was a server-side issue.");
			return rejectWithValue(error.message);
		}
	}
);
