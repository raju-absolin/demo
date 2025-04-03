import { Button } from "@mui/material";
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
import { FormInput } from "@src/components";
import { useAppDispatch } from "@src/store/store";
import SelectComponent from "@src/components/form/SelectComponent";
import { clearMiniFolders } from "@src/store/mini/mini.Slice";
import {
	addFolders,
	getFilesWithChildrenList,
	getFiles,
	editFolder,
} from "@src/store/sidemenu/file_system/fs.action";
import {
	useFileSystemSelector,
	setSelectedFolderData,
	openFolderModal,
} from "@src/store/sidemenu/file_system/fs.slice";
import { getMiniFolders } from "@src/store/mini/mini.Action";
import TextArea from "@src/components/form/TextArea";
import { LoadingButton } from "@mui/lab";
import { useParams } from "react-router-dom";

const UploadFolder = () => {
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const {
		mini: { miniFolders },
		fileSystem: {
			openFolderModal: modal,
			folderloading,
			selectedFolderData,
			folderpageParams,
			folderChildrenPageParams,
			pageParams,
			isGridView,
		},
	} = useFileSystemSelector();

	const editId = selectedFolderData?.id;

	const closeModal = () => {
		dispatch(setSelectedFolderData({}));
		dispatch(openFolderModal(false));
	};

	const groupSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter your folder name")
			.trim()
			// .matches(
			// 	/^[a-zA-Z0-9 ]*$/,
			// 	"folder name should not contain special characters"
			// )
			,
		remarks: yup.string().optional().trim("remarks cannot be empty spaces"),
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
	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(groupSchema),
		values: {
			name: selectedFolderData?.name ? selectedFolderData?.name : "",
			// parent: selectedFolderData?.parent
			// 	? {
			// 			label: selectedFolderData?.parent
			// 				? `${selectedFolderData?.parent.name}`
			// 				: "",
			// 			value: selectedFolderData?.parent
			// 				? `${selectedFolderData?.parent.id}`
			// 				: "",
			// 		}
			// 	: null,
			remarks: selectedFolderData?.remarks || "",
		},
	});

	const handleAddFolder = (data: any) => {
		if (!editId) {
			const obj = {
				name: data.name,
				parent_id: id,
				remarks: data.remarks || "",
			};

			dispatch(
				addFolders({
					obj,
					params: folderpageParams,
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
		} else {
			const obj = {
				name: data.name,
				parent_id: id,
				remarks: data.remarks || "",
			};

			dispatch(
				editFolder({
					id: editId,
					obj,
					params: folderpageParams,
					clearData: () => {
						dispatch(
							getFiles({
								...pageParams,
								parent: id,
								page: 1,
								page_size: isGridView ? 20 : 10,
							})
						);
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
						closeModal();
						reset();
					},
				})
			);
		}
	};

	return (
		<>
			<Dialog open={modal} onClose={closeModal} maxWidth="md" fullWidth>
				<DialogTitle>
					{!editId ? "Add " : "Update "}
					Folder
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
								<Grid container spacing={3}>
									<Grid
										size={
											!editId
												? { xs: 12, md: 6 }
												: { xs: 12 }
										}>
										<FormInput
											required
											name="name"
											label="Folder name"
											type="text"
											placeholder="Enter Folder here..."
											control={control}
										/>
									</Grid>

									{/* {!editId && (
										<Grid size={{ xs: 12, md: 6 }}>
											<SelectComponent
												name="parent"
												label="Parent Folder"
												control={control}
												rules={{ required: true }}
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
										</Grid>
									)} */}
									<Grid size={{ xs: 12 }}>
										<TextArea
											name="remarks"
											label="Description"
											type="text"
											placeholder="Write description here..."
											minRows={3}
											maxRows={5}
											containerSx={{
												display: "grid",
												gap: 1,
											}}
											control={control}
										/>
									</Grid>
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
								loading={folderloading}
								color="primary"
								type="submit"
								onClick={handleSubmit(handleAddFolder)}
								variant="contained"
								size="large">
								Submit
							</LoadingButton>
						</Box>
					) : (
						<Box textAlign={"right"}>
							<LoadingButton
								loading={folderloading}
								variant="contained"
								type="submit"
								onClick={handleSubmit(handleAddFolder)}
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
export default UploadFolder;
