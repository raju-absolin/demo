import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	CircularProgress,
	IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import Swal from "sweetalert2";

import { getList, postAdd, postDownloadFile } from "../../helpers/Helper";
import { downloadExportData } from "../settings/ImportExport/importExportAction";

// Helper function to show a success dialog
const showSuccessDialog = (title: string, message: string) => {
	return new Promise((resolve) => {
		const handleClose = () => resolve(true);

		// const SuccessDialog = (
		//     <Dialog open onClose={handleClose}>
		//         <DialogTitle>
		//             <IconButton color="success" size="large">
		//                 <CheckCircleIcon />
		//             </IconButton>
		//             {title}
		//         </DialogTitle>
		//         <DialogContent>
		//             <Typography variant="body2" color="textSecondary">
		//                 {message}
		//             </Typography>
		//         </DialogContent>
		//         <DialogActions>
		//             <Button onClick={handleClose} color="primary">
		//                 OK
		//             </Button>
		//         </DialogActions>
		//     </Dialog>
		// );
	});
};

// Helper function to show an error dialog
const showErrorDialog = (title: string, message: string) => {
	return new Promise((resolve) => {
		const handleClose = () => resolve(true);

		// const ErrorDialog = (
		//     <Dialog open onClose={handleClose}>
		//         <DialogTitle>
		//             <IconButton color="error" size="large">
		//                 <ErrorIcon />
		//             </IconButton>
		//             {title}
		//         </DialogTitle>
		//         <DialogContent>
		//             <Typography variant="body2" color="textSecondary">
		//                 {message}
		//             </Typography>
		//         </DialogContent>
		//         <DialogActions>
		//             <Button onClick={handleClose} color="primary">
		//                 OK
		//             </Button>
		//         </DialogActions>
		//     </Dialog>
		// );
	});
};

// getReportList action
export const getReportList = createAsyncThunk<any, any>(
	"/getReportList",
	async (payload: any, { dispatch }) => {
		const params = payload.ParamsData;
		Swal.fire({
			text: "Loading please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});

		try {
			if (payload.objData.file_format === 5) {
				const response = await postAdd(
					`/reports/generic_export/`,
					payload.objData,
					params
				);
				Swal.close();
				if (response) {
					return {
						response: response.data,
						params: payload,
					};
				} else {
					throw new Error("Failed to get response");
				}
			} else {
				dispatch(downloadExportData(payload.objData));
				await showSuccessDialog(
					"Success",
					"Your report generated successfully!"
				);
			}
		} catch (error: any) {
			console.log(error);
			if (error?.name !== "CanceledError") {
				await showErrorDialog(
					"Error",
					"Sorry! There was an issue on the server side."
				);
			}
			return error.message;
		}
	}
);

// startPostScheduleReport action
export const startPostScheduleReport = createAsyncThunk<any, any>(
	"/startPostScheduleReport",
	async (payload) => {
		const params = payload.ParamsData;
		try {
			const response = await postAdd(
				`/reports/scheduledemail/`,
				payload.obj,
				params
			);
			if (response) {
				await showSuccessDialog(
					"Success",
					"Schedule added successfully"
				);

				setTimeout(() => {
					// Reset form fields after success
					payload.schedule_form.setFieldsValue({
						email: "",
						startdate: "",
						time: "",
						frequency: null,
						repeatdays: null,
						reportname: "",
					});
					payload.setState({
						email: "",
						startdate: "",
						time: "",
						frequency: null,
						repeatdays: null,
						reportname: "",
					});
				}, 2000);

				return { response: response.data };
			} else {
				throw new Error("Failed to get response");
			}
		} catch (error: any) {
			Swal.close();
			await showErrorDialog(
				"Error",
				"Sorry! There was an issue on the server side."
			);
			return error.message;
		}
	}
);
