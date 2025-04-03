import { Button, FormHelperText, InputLabel, Stack } from "@mui/material";
import {
	Grid2 as Grid,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FileType, FormInput, HorizontalFilePreview } from "@src/components";
import { useAppDispatch } from "@src/store/store";
import SelectComponent from "@src/components/form/SelectComponent";
import { clearMiniFolders } from "@src/store/mini/mini.Slice";
import {
	getFilesWithChildrenList,
	getFiles,
	editFiles,
	addFiles,
} from "@src/store/sidemenu/file_system/fs.action";
import {
	useFileSystemSelector,
	setSelectedData,
	setIsModelVisible,
} from "@src/store/sidemenu/file_system/fs.slice";
import { getMiniFolders } from "@src/store/mini/mini.Action";
import TextArea from "@src/components/form/TextArea";
import { LoadingButton } from "@mui/lab";
import Dropzone from "react-dropzone";
import { FileUploadOutlined } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const UploadFile = () => {
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const {
		mini: { miniFolders },
		fileSystem: {
			isModelVisible: modal,
			loading,
			selectedData,
			folderChildrenPageParams,
			pageParams,
			isGridView,
		},
	} = useFileSystemSelector();

	const editId = selectedData?.id;

	const closeModal = () => {
		dispatch(setSelectedData({}));
		dispatch(setIsModelVisible(false));
	};

	const groupSchema = yup.object().shape({
		file: yup.string().required("Please select a file to upload"),
		// parent: yup
		// 	.object()
		// 	// 	.shape(
		// 	// 		{
		// 	// 		label: yup.string().optional(),
		// 	// 		value: yup.string().optional(),
		// 	// 	}
		// 	// )
		// 	.optional()
		// 	.nullable(),
	});
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(groupSchema),
		values: {
			file: selectedData?.file?.preview,
			// parent: selectedData?.parent
			// 	? {
			// 			label: selectedData?.parent
			// 				? `${selectedData?.parent.name}`
			// 				: "",
			// 			value: selectedData?.parent
			// 				? `${selectedData?.parent.id}`
			// 				: "",
			// 		}
			// 	: null,
		},
	});

	const handleUploadFile = (data: any) => {
		if (!editId) {
			const obj = {
				file:
					selectedData?.file?.originalObj instanceof File
						? selectedData?.file?.originalObj
						: null,
				parent_id: id,
			};

			dispatch(
				addFiles({
					obj,
					clearData: () => {
						dispatch(
							getFilesWithChildrenList({
								params: {
									...folderChildrenPageParams,
									parent: id,
									search: "",
									page: 1,
									page_size: 10,
								},
							})
						);
						dispatch(
							getFiles({
								...pageParams,
								parent: id,
								page: 1,
								page_size: isGridView ? 20 : 10,
							})
						);
						closeModal();
						reset();
					},
				})
			);
		}
	};

	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

		/**
		 * Formats the size
		 */
		const formatBytes = (bytes: number, decimals: number = 2) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1000;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		
			const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
		
			return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
		};		

		const modifiedFiles = files.map((file) => {
			console.log("File size before formatting:", file.size); // Debugging
			return Object.assign({}, file, {
				originalObj: file,
				uuid: uuidv4(),
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			});
		});

		dispatch(
			setSelectedData({
				...selectedData,
				file: modifiedFiles[0],
			})
		);
	};

	const setAttachments = (payload: Array<any>) => {
		dispatch(
			setSelectedData({
				...selectedData,
				file: payload[0],
			})
		);
	};

	return (
		<>
			<Dialog open={modal} onClose={closeModal} maxWidth="md" fullWidth>
				<DialogTitle>
					{!editId ? "Add " : "Update "}
					File
				</DialogTitle>
				<Box
					sx={{
						border: "1px solid #ccc",
						padding: 1,
						borderRadius: 1,
						bgcolor: "#f9f9f9", // Optional: background color
					}}>
					<DialogContent>
						<Box mt={1}>
							<form action="">
								<Grid
									container
									spacing={3}
									alignItems={"center"}>
									<Grid>
										{/* File Upload */}

										<Dropzone
											onDrop={(acceptedFiles) => {
												handleAcceptedFiles(
													acceptedFiles,
													() => { }
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
																bgcolor:
																	"purple",
																"&:hover": {
																	bgcolor:
																		"darkviolet",
																},
																fontWeight: 600,
																textTransform:
																	"none",
															}}>
															Select File
														</Button>
													</div>
												</Box>
											)}
										</Dropzone>
										{errors?.file?.message && (
											<FormHelperText
												error={
													errors?.file?.message !=
													null
												}>
												{
													errors?.file
														?.message as string
												}
											</FormHelperText>
										)}
									</Grid>

									{/* <Grid size={{ xs: 12, md: 6 }}>
										<Stack
											direction={"row"}
											gap={1}
											alignItems={"center"}>
											<InputLabel
												sx={{
													".MuiInputLabel-asterisk": {
														color: "red",
													},
												}}
												id={"parent"}
												required={false}
												style={{
													fontWeight: "medium",
													marginBottom: "7px",
												}}>
												{"Parent Folder : "}
											</InputLabel>
											<SelectComponent
												name="parent"
												label=""
												control={control}
												rules={{ required: true }}
												placeholder="Select Parent Folder..."
												options={miniFolders?.list?.map(
													(e: {
														id: string;
														name: string;
													}) => ({
														id: e.id,
														name: e.name,
													})
												)}
												loading={miniFolders?.loading}
												selectParams={{
													page: miniFolders
														?.miniParams?.page,
													page_size:
														miniFolders?.miniParams
															?.page_size,
													search: miniFolders
														?.miniParams?.search,
													no_of_pages:
														miniFolders?.miniParams
															?.no_of_pages,
												}}
												hasMore={
													miniFolders?.miniParams
														?.page <
													miniFolders?.miniParams
														?.no_of_pages
												}
												fetchapi={getMiniFolders}
												clearData={clearMiniFolders}
											/>
										</Stack>
									</Grid> */}
									{selectedData?.file && (
										<HorizontalFilePreview
											file={selectedData?.file}
											attachments={
												selectedData?.file
													? [selectedData?.file]
													: []
											}
											setAttachments={setAttachments}
										/>
									)}
								</Grid>
							</form>
						</Box>
					</DialogContent>
				</Box>
				<DialogActions>
					<Box textAlign={"center"}>
						<Button
							onClick={closeModal}
							variant="outlined"
							color="secondary">
							Cancel
						</Button>
					</Box>
					{!editId ? (
						<Box textAlign={"right"}>
							<LoadingButton
								loading={loading}
								color="primary"
								type="submit"
								onClick={handleSubmit(handleUploadFile)}
								variant="contained"
								size="large">
								Submit
							</LoadingButton>
						</Box>
					) : (
						<Box textAlign={"right"}>
							<LoadingButton
								loading={loading}
								variant="contained"
								type="submit"
								onClick={handleSubmit(handleUploadFile)}
								color="primary"
								autoFocus>
								Update
							</LoadingButton>
						</Box>
					)}
				</DialogActions>
			</Dialog>
		</>
	);
};
export default UploadFile;
