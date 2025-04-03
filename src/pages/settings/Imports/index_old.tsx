import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RootState, useAppDispatch, useAppSelector } from "@src/store/store";
import {
	clearData,
	submitImportData,
	nextStep,
	prevStep,
	finishStep,
	changeType,
	importExportSelector,
	InputChangeValue,
} from "@src/store/settings/ImportExport/importExportSlice";
import { getImportMenuItems } from "@src/store/system/system.slice";
import {
	getImportModelsList,
	ImportUploadStatus,
	uploadImportData,
} from "@src/store/settings/ImportExport/importExportAction";
import {
	Box,
	Grid,
	Divider,
	Card,
	Select,
	MenuItem,
	Button,
	Typography,
	CircularProgress,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Stepper,
	Step,
	StepLabel,
	ListItem,
	ListItemText,
	List,
} from "@mui/material";
import {
	CloudUpload,
	CloudUploadOutlined,
	FileUploadOutlined,
} from "@mui/icons-material";
import GoBack from "@src/components/GoBack";
import { SelectComponents } from "react-select/dist/declarations/src/components";
import { SmileOutlined, SolutionOutlined } from "@ant-design/icons";
import { systemSelector } from "@src/store/system/system.slice";
import { FileType, HorizontalFilePreview } from "@src/components";
import Dropzone from "react-dropzone";
import SelectComponent from "@src/components/form/SelectComponent";
import Control from "react-select/dist/declarations/src/components/Control";
import { useForm, Controller } from "react-hook-form";
import ValidRowsTable from "./uploadedData";
import DOMPurify from "dompurify";
import ErrorTable from "./Error";

interface MenuItemType {
	link: string;
	title: string;
}

interface TableColumn {
	key: string;
	label: string;
}

interface tableRow {
	dataIndex: string;
	title: string;
}

interface formData {
	file: string;
	model_name: string;
}

const ImportCSV = () => {
	const dispatch = useAppDispatch();

	const { control } = useForm();

	const {
		importTableColumns,
		importTableRowData,
		currentStep,
		loading,
		importData,
		request_id,
		importResponseData,
	} = useAppSelector((state) => {
		return importExportSelector(state);
	});

	const {
		importExport: { exportData, exportModelList, importModelList },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			importExport: importExportSelector(state),
		};
	});

	useEffect(() => {
		dispatch(clearData());
		dispatch(getImportModelsList());
	}, [dispatch]);

	// useEffect(()=>{
	//   if(currentStep===1)
	//   {

	//     dispatch(ImportUploadStatus(request_id))
	//     console.log("request_id is :",request_id);
	//     console.log("import table data:", importTableRowData);
	//   }
	// },[currentStep, request_id, dispatch]);
	const steps = [
		{ title: "Upload file", icon: <CloudUploadOutlined /> },
		{ title: "Preview", icon: <SolutionOutlined /> },
		{ title: "Finish", icon: <SmileOutlined /> },
	];

	const data = [
		"Reaching the targets and goals set for my area.",
		"Servicing the needs of my existing customers.",
		"Maintaining the relationships with existing customers for repeat business.",
		"Reporting to top managers",
		"Keeping up to date with the products.",
	];

	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

		const formatBytes = (bytes: number, decimals: number = 2) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = [
				"Bytes",
				"KB",
				"MB",
				"GB",
				"TB",
				"PB",
				"EB",
				"ZB",
				"YB",
			];

			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return (
				parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
				" " +
				sizes[i]
			);
		};

		// Creating a new array with the modified files
		const modifiedFiles = files.map((file) =>
			Object.assign({}, file, {
				originalObj: file,
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);
		// const documents = [...(uploadDocuments || []), modifiedFiles[0]];

		dispatch(
			InputChangeValue({
				key: "import_file",
				value: modifiedFiles[0],
				type: "import",
			})
		);
	};

	const setAttachments = (payload: Array<any>) => {
		dispatch(
			InputChangeValue({
				key: "import_file",
				value: payload[0],
				type: "import",
			})
		);
	};

	const handleSubmit = (event: React.FormEvent) => {
		const obj = {
			model_name: importData.model_name,
			import_file: importData?.import_file?.originalObj,
			input_format: 0,
		};
		event.preventDefault();

		dispatch(
			uploadImportData({
				obj,
				onSuccess: (res) => {
					console.log("Upload Successful:", res);

					if (res?.request_id) {
						dispatch(
							InputChangeValue({
								key: "request_id",
								value: res.request_id,
								type: "import",
							})
						);
						dispatch(
							ImportUploadStatus({
								...res,
							})
						);
					}
				},
				onFailure: () => console.error("Upload Failed"),
			})
		);
	};

	// const handleNextStep = () => {
	// 	if (currentStep === 0) {
	// 		handleSubmit(new Event("submit") as unknown as React.FormEvent);
	// 	} else if (currentStep === 1) {
	// 		const responseData = importData.import_status?.response;
	// 		const payload = {
	// 			...responseData,
	// 			import_file_name:
	// 				importData.import_status?.response?.initial
	// 					?.import_file_name,
	// 			original_file_name:
	// 				importData.import_status?.response?.initial
	// 					?.original_file_name,
	// 			input_format:
	// 				importData.import_status?.initial?.input_format || 0,
	// 			model_name: importData.model_name, //here we are supposed to send model_name in camel case format
	// 		};

	// 		dispatch(
	// 			uploadTabelPreviewData({
	// 				obj: payload,
	// 				onSuccess: (res) => {
	// 					console.log("Table Preview Upload Successful:", res);
	// 					dispatch(nextStep());
	// 				},
	// 				onFailure: () =>
	// 					console.error("Table Preview Upload Failed"),
	// 			})
	// 		);
	// 	} else {
	// 		dispatch(nextStep());
	// 	}
	// };

	const columns = importTableColumns.map((column: TableColumn) => ({
		title: column.label,
		dataIndex: column.key,
	}));

	return (
		<GoBack
			is_goback={true}
			title="Import CSV"
			showSaveButton={false}
			loading={false}>
			<Box sx={{ my: 2 }}>
				<Card>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Stepper activeStep={currentStep}>
								{steps.map((label, index) => (
									<Step key={index}>
										<StepLabel
											StepIconComponent={() =>
												label.icon
											}>
											{label.title}
										</StepLabel>
									</Step>
								))}
							</Stepper>
						</Grid>

						{/* Step 1: File Upload */}
						{currentStep === 0 && (
							<Grid item xs={12}>
								<Card sx={{ p: 2 }}>
									<form
										onSubmit={(e) => {
											e.preventDefault();
										}}>
										<Grid container spacing={2}>
											<Grid item xs={12} md={6}>
												<Typography variant="h6">
													Before Uploading Your File
												</Typography>
												<Typography variant="body2">
													Ensure the correct file
													format and required fields.
												</Typography>
												<List dense>
													{data.map((item, index) => (
														<ListItem key={index}>
															<ListItemText
																primary={`${index + 1}. ${item}`}
															/>
														</ListItem>
													))}
												</List>
											</Grid>

											<Grid item xs={12} md={6}>
												<Box
													component="div"
													sx={{ mb: 2 }}>
													<SelectComponent
														name="model_name"
														label="Select File Type"
														control={control}
														rules={{
															required: true,
														}}
														options={importModelList.map(
															(
																menuItem: any,
																index: number
															) => ({
																id: index,
																name: menuItem,
															})
														)}
														loading={false}
														onChange={(e) => {
															console.log(e);

															dispatch(
																InputChangeValue(
																	{
																		key: "model_name",
																		value: e.label,
																		type: "import",
																	}
																)
															);
														}}
														selectParams={{
															page: 1,
															page_size: 10,
															search: "",
															no_of_pages: 1,
														}}
														hasMore={false}
													/>
												</Box>

												<Box
													component="div"
													sx={{ mb: 2 }}>
													<Dropzone
														onDrop={(
															acceptedFiles
														) => {
															handleAcceptedFiles(
																acceptedFiles,
																() => {}
															);
														}}>
														{({
															getRootProps,
															getInputProps,
														}) => (
															<Box>
																<Box className="fallback">
																	<input
																		{...getInputProps()}
																		name="file"
																		type="file"
																		multiple
																	/>
																</Box>
																<div
																	className="dz-message needsclick"
																	{...getRootProps()}>
																	<Button
																		variant="contained"
																		startIcon={
																			<FileUploadOutlined />
																		}
																		sx={{
																			fontWeight: 600,
																			textTransform:
																				"none",
																		}}>
																		Upload
																	</Button>
																</div>
															</Box>
														)}
													</Dropzone>
													<Box mt={2}>
														{importData?.import_file && (
															<HorizontalFilePreview
																file={
																	importData?.import_file
																}
																attachments={
																	importData?.import_file
																		? [
																				importData?.import_file,
																			]
																		: []
																}
																setAttachments={
																	setAttachments
																}
															/>
														)}
													</Box>
												</Box>
											</Grid>
										</Grid>
									</form>
								</Card>
							</Grid>
						)}

						{/* Step 2: Data Preview */}
						{/* {currentStep === 1 && (
              <Grid item xs={12}>
                <Card sx={{ p: 2 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {columns.map((col: tableRow) => (
                            <TableCell key={col.dataIndex}>{col.title}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {importTableRowData.map((row: string, index: number) => (
                          <TableRow key={index}>
                            {columns.map((col: any) => (
                              <TableCell key={col.dataIndex}>{row[col.dataIndex]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>
            )} */}

						{currentStep === 1 && (
							<>
								{importResponseData?.has_errors ? (
									<ErrorTable
										errorData={importResponseData}
									/>
								) : (
									<Grid item xs={12}>
										<Card sx={{ p: 2 }}>
											<TableContainer>
												<Table>
													<TableHead>
														<TableRow>
															{columns.map(
																(
																	col: tableRow
																) => (
																	<TableCell
																		key={
																			col.dataIndex
																		}>
																		{
																			col.title
																		}
																	</TableCell>
																)
															)}
														</TableRow>
													</TableHead>
													<TableBody>
														{importTableRowData?.map(
															(
																row: any,
																index: number
															) => (
																<TableRow
																	key={index}>
																	{columns.map(
																		(
																			col: any
																		) => (
																			<TableCell
																				key={
																					col.dataIndex
																				}>
																				<span
																					dangerouslySetInnerHTML={{
																						__html: DOMPurify.sanitize(
																							row[
																								col
																									.dataIndex
																							] ||
																								""
																						),
																					}}
																				/>
																			</TableCell>
																		)
																	)}
																</TableRow>
															)
														)}
													</TableBody>
												</Table>
											</TableContainer>
										</Card>
									</Grid>
								)}
							</>
						)}

						{/* Step 3: Success/Error Message */}
						{currentStep === 2 && (
							<Grid item xs={12}>
								<Card sx={{ p: 2, textAlign: "center" }}>
									<Typography variant="h6">
										{submitImportData?.name
											? "Import Failed"
											: "Import Successful"}
									</Typography>
									<Typography variant="body2">
										{submitImportData?.name ||
											"Your data has been imported successfully!"}
									</Typography>
								</Card>
							</Grid>
						)}

						{/* Action Buttons */}
						<Grid item xs={12}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									m: 2,
								}}>
								{currentStep > 0 && (
									<Button
										variant="outlined"
										onClick={() => dispatch(prevStep())}>
										Previous
									</Button>
								)}

								{currentStep < steps.length - 1 ? (
									<Button
										variant="contained"
										color="primary"
										onClick={() => {
											if (currentStep === 0) {
												handleSubmit(
													new Event(
														"submit"
													) as unknown as React.FormEvent
												);
											} else if (currentStep == 1) {
												dispatch(nextStep());
											}
										}}
										disabled={loading}>
										{loading ? (
											<CircularProgress size={24} />
										) : (
											"Next"
										)}
									</Button>
								) : (
									<Button
										variant="contained"
										color="primary"
										onClick={() => dispatch(finishStep())}>
										Done
									</Button>
								)}
							</Box>
						</Grid>
					</Grid>
				</Card>
			</Box>
		</GoBack>
	);
};

export default ImportCSV;
