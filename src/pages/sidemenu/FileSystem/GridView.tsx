import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	ButtonGroup,
	Grid2 as Grid,
	IconButton,
	List,
	Menu,
	MenuItem,
	Popover,
	styled,
	Typography,
} from "@mui/material";
import { EmptyData, FormInput } from "@src/components";
import { config } from "@src/config";
import { downloadFileByUrl } from "@src/helpers";
import {
	downloadFile,
	editFiles,
	getFileById,
	getFiles,
	getFilesWithChildrenList,
	getFolderById,
	getStaticFiles,
} from "@src/store/sidemenu/file_system/fs.action";
import {
	openFolderModal,
	setCopyData,
	setFileShare,
	useFileSystemSelector,
} from "@src/store/sidemenu/file_system/fs.slice";
import {
	FileData,
	FolderTreeData,
} from "@src/store/sidemenu/file_system/fs.types";
import { useAppDispatch } from "@src/store/store";
import { enqueueSnackbar } from "notistack";
import { BaseSyntheticEvent, SyntheticEvent, useState } from "react";
import { Form, useForm } from "react-hook-form";
import {
	LuCheck,
	LuCopy,
	LuCross,
	LuDownload,
	LuFileEdit,
	LuMoreVertical,
	LuPencil,
	LuScissors,
	LuShare,
	LuTrash2,
	LuX,
} from "react-icons/lu";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import blue_folder_icon from "@src/assets/images/default_file_icons/285658_blue_folder_icon.png";
import empty_file_icon from "@src/assets/images/default_file_icons/285688_file_empty_icon.png";
import Loader from "@src/components/Loader";

type Props = {
	currentId: string;
	openModal: (value: boolean) => void;
	onFolderClick: (row: FileData) => void;
	handleClick: (
		event: React.MouseEvent<HTMLElement | SVGElement, MouseEvent>,
		id: string
	) => void;
	confirmDelete: (deleteId: string, type: number) => void;
	anchorEl:
		| React.MouseEvent<
				HTMLElement | SVGElement,
				MouseEvent
		  >["currentTarget"]
		| null;
	handleDeleteClose: () => void;
};

type GridViewFileTypes = {
	quickAccessFiles: {
		icon?: string;
		name: string;
		size: string;
	}[];
};
const ScrollableList = styled(List)(({ theme }) => ({
	height: "500px",
	// marginTop: "15px",
	overflowY: "auto",
	// padding: "0 8px",
	"&::-webkit-scrollbar": {
		width: "8px",
	},
	"&::-webkit-scrollbar-thumb": {
		backgroundColor: theme.palette.primary.main,
		borderRadius: "8px",
	},
}));

const GridView = ({
	currentId,
	onFolderClick,
	handleClick,
	confirmDelete,
	anchorEl,
	handleDeleteClose,
	openModal,
}: Props) => {
	const {
		fileSystem: {
			filesList,
			pageParams,
			filesCount,
			staticFiles,
			folderChildrenPageParams,
			loading,
			parentValue,
			isGridView,
		},
		system: { userAccessList },
	} = useFileSystemSelector();

	const deleteOpen = anchorEl ? true : false;
	const dispatch = useAppDispatch();
	const [rename, setRename] = useState<{
		file_id: string;
		isOpen: boolean;
		name: string;
	}>();
	const { id } = useParams();

	// const quickAccessFiles = filesList?.map((e) => {
	// 	return {
	// 		icon: e?.thumbnail || "",
	// 		name: e.originalname || e.name,
	// 		size: `${e.size} KB`,
	// 		extension : e.
	// 	};
	// });

	const [anchorEls, setAnchorEls] = useState<{
		[key: string]: HTMLElement | null;
	}>({});

	const handleMenuClick = (
		event: React.MouseEvent<HTMLElement>,
		rowId: string
	) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: event.currentTarget }));
	};

	const handleMenuClose = (rowId: string) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: null }));
	};

	function convertBytesToMB(fileSizeBytes: number) {
		if (fileSizeBytes < 1024) {
			return `${Math.round(fileSizeBytes)} bytes`;
		} else if (fileSizeBytes < 1048576) {
			return `${Math.round(fileSizeBytes / 1024)} KB`;
		} else if (fileSizeBytes < 1073741824) {
			return `${Math.round(fileSizeBytes / 1024 / 1024)} MB`;
		} else {
			return `${Math.round(fileSizeBytes / 1024 / 1024 / 1024)} GB`;
		}
	}

	const filethumbnailUrl = (file: FileData) => {
		const static_file = (file_type: number) => {
			return `${config.baseUrl}/static/iconpacks/default/${
				staticFiles[file_type == 1 ? "default_file" : "default_folder"]
			}`;
		};
		if (file.thumbnail) {
			return file.thumbnail;
		} else {
			if (file?.fileextension) {
				const extension = staticFiles[file?.fileextension];
				if (extension) {
					return `${config.baseUrl}/static/iconpacks/default/${
						extension
					}`;
				} else {
					return static_file(file.type);
				}
			} else {
				return static_file(file.type);
			}
		}
	};

	type FileRenameTypes = {
		name: string;
	};
	const fileRenameSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter your file name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"file name should not contain special characters"
			),
	});
	const { control, handleSubmit, reset, setValue } = useForm<FileRenameTypes>(
		{
			resolver: yupResolver(fileRenameSchema),
			values: {
				name: rename?.name ? rename?.name : "",
			},
		}
	);

	const changeFileName = ({
		payload,
		file,
	}: {
		payload: FileRenameTypes;
		file: FileData;
	}) => {
		const obj = {
			name: payload?.name,
			description: file?.description || "",
		};
		dispatch(
			editFiles({
				id: rename?.file_id || "",
				obj,
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
							// parentIds: parentValue,
						})
					);
					reset();
					closeFileRename();
				},
			})
		);
	};

	const closeFileRename = () => {
		setRename({
			isOpen: false,
			name: "",
			file_id: "",
		});
	};

	return (
		<Box>
			<ScrollableList
				onScroll={(e: SyntheticEvent) => {
					const { target } = e as any;
					if (
						Math.ceil(target?.scrollTop + target?.offsetHeight) ==
						target?.scrollHeight
					) {
						if (pageParams.page < pageParams.no_of_pages) {
							dispatch(
								getFiles({
									...pageParams,
									page: pageParams?.page + 1,
									page_size: isGridView ? 20 : 10,
								})
							);
						}
					}
				}}>
				<Grid container spacing={1}>
					{filesList.length != 0 ? (
						filesList?.map((file, idx) => {
							// const Icon = file.icon;
							return (
								<Grid
									size={{
										xs: 12,
										md: 6,
										xl: 4,
									}}
									key={idx}>
									<Box
										sx={{
											border: "1px solid",
											borderColor: "divider",
											borderRadius: "4px",
											cursor: "pointer",
											m: "6px",
											display: "flex",
											justifyContent: "space-between",
										}}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: "12px",
												overflow: "hidden",
												p: "12px",
												width: "100%",
												height: "100%",
											}}
											onClick={(event) => {
												if (file?.type != 1) {
													onFolderClick(file);
												} else {
													if (!rename?.isOpen)
														typeof file.file ==
															"string" &&
															(() => {
																dispatch(
																	downloadFile(
																		{
																			id: file?.id,
																			action: "view",
																			file_name:
																				file?.name ||
																				"",
																		}
																	)
																);
																window.open(
																	file.file,
																	"_blank"
																);
															})();
												}
											}}>
											<Box
												sx={{
													width: "48px",
													height: "48px",
													display: "inline-flex",
													alignItems: "center",
													justifyContent: "center",
												}}>
												{/* <Typography
													component={"span"}
													variant="subtitle1"
													sx={{
														color: "secondary.main",
														display: "inline-flex",
														alignItems: "center",
														justifyContent:
															"center",
														height: "100%",
														width: "100%",
														borderRadius: "4px",
														bgcolor: "grey.200",
													}}> */}
												<img
													src={filethumbnailUrl(file)}
													style={{
														width: "35px",
														height: "35px",
														objectFit: "cover",
													}}
													onError={(e) => {
														(
															e.target as HTMLImageElement
														).src =
															file?.type == 1
																? empty_file_icon
																: blue_folder_icon;
													}}
												/>
												{/* </Typography> */}
											</Box>
											<Box>
												{rename?.isOpen &&
												file?.id === rename?.file_id ? (
													<Box
														display={"flex"}
														alignItems={"center"}>
														<FormInput
															name="name"
															label=""
															type="text"
															placeholder="Enter File here..."
															control={control}
														/>
													</Box>
												) : (
													<Typography
														sx={{
															color: "grey.600",
															fontWeight: 700,
															wordBreak:
																"break-all",
														}}>
														{file.name ||
															file.originalname}
													</Typography>
												)}
												<Typography
													component={"p"}
													sx={{
														color: "grey.600",
													}}>
													{convertBytesToMB(
														+file.size
													)}
												</Typography>
											</Box>
										</Box>
										<Box
											display={"flex"}
											flex={1}
											justifyContent={"flex-end"}>
											{rename?.isOpen &&
											file?.id === rename?.file_id ? (
												<ButtonGroup>
													<IconButton
														onClick={() =>
															closeFileRename()
														}>
														<LuX />
													</IconButton>
													<IconButton
														type="submit"
														onClick={handleSubmit(
															(
																values: FileRenameTypes
															) => {
																changeFileName({
																	payload:
																		values,
																	file,
																});
															}
														)}>
														<LuCheck />
													</IconButton>
												</ButtonGroup>
											) : (
												<IconButton
													sx={{ px: "6px" }}
													tabIndex={idx}
													onClick={(e) =>
														handleMenuClick(
															e,
															file.id
																? file.id
																: ""
														)
													}
													aria-controls={
														anchorEls[
															file?.id
																? file.id
																: ""
														]
															? "account-menu"
															: undefined
													}
													aria-haspopup="true"
													aria-expanded={
														anchorEls[
															file?.id
																? file.id
																: ""
														]
															? "true"
															: undefined
													}>
													<LuMoreVertical size={16} />
												</IconButton>
											)}
											<Menu
												anchorEl={
													anchorEls[
														file?.id ? file.id : ""
													]
												}
												id="account-menu"
												open={Boolean(
													anchorEls[
														file?.id ? file.id : ""
													]
												)}
												onClose={() =>
													handleMenuClose(
														file?.id ? file.id : ""
													)
												}
												PaperProps={{
													elevation: 0,
													sx: {
														overflow: "visible",
														filter: "drop-shadow(0px 1px 2px rgba(185, 185, 185, 0.32))",
														mt: 1.5,
														"& .MuiAvatar-root": {
															width: 32,
															height: 32,
															ml: -0.5,
															mr: 1,
														},
														"&:before": {
															content: '""',
															display: "block",
															position:
																"absolute",
															top: 0,
															right: 14,
															width: 10,
															height: 10,
															bgcolor:
																"background.paper",
															transform:
																"translateY(-50%) rotate(45deg)",
															zIndex: 0,
														},
													},
												}}
												transformOrigin={{
													horizontal: "right",
													vertical: "top",
												}}
												anchorOrigin={{
													horizontal: "right",
													vertical: "bottom",
												}}>
												{userAccessList?.indexOf(
													"FileSystem.change_file"
												) !== -1 &&
													file?.type == 2 && (
														<MenuItem
															sx={{ gap: 2 }}
															onClick={() => {
																if (
																	file?.type ==
																	2
																) {
																	dispatch(
																		getFolderById(
																			{
																				id: file?.id,
																			}
																		)
																	);
																	dispatch(
																		openFolderModal(
																			true
																		)
																	);
																} else {
																	dispatch(
																		getFileById(
																			{
																				id: file?.id,
																			}
																		)
																	);
																	openModal(
																		true
																	);
																}
															}}>
															<LuPencil
																style={{
																	cursor: "pointer",
																	color: "#fc6f03",
																}}
															/>
															Edit
														</MenuItem>
													)}
												{userAccessList?.indexOf(
													"FileSystem.delete_file"
												) !== -1 && (
													<MenuItem
														sx={{ gap: 2 }}
														onClick={(e) =>
															handleClick(
																e,
																file?.id
															)
														}>
														<LuTrash2
															style={{
																cursor: "pointer",
																color: "#fc6f03",
															}}
														/>
														Delete
													</MenuItem>
												)}
												<Popover
													id={
														currentId
															? String(currentId)
															: undefined
													}
													open={deleteOpen}
													anchorEl={anchorEl}
													onClose={handleDeleteClose}
													anchorOrigin={{
														vertical: "top",
														horizontal: "right",
													}}
													transformOrigin={{
														vertical: "bottom",
														horizontal: "left",
													}}>
													<div
														style={{
															padding: "15px",
														}}>
														<Typography
															variant="subtitle1"
															gutterBottom>
															Are you sure to
															delete this Record?
														</Typography>
														<Button
															variant="contained"
															type="submit"
															color="primary"
															onClick={() => {
																confirmDelete(
																	currentId,
																	file?.type
																);
															}}
															autoFocus>
															Yes
														</Button>
														<Button
															variant="outlined"
															size="small"
															onClick={
																handleDeleteClose
															}
															style={{
																marginLeft:
																	"20px",
															}}>
															No
														</Button>
													</div>
												</Popover>

												{userAccessList?.indexOf(
													"FileSystem.add_file"
												) !== -1 &&
													file?.type !== 2 && (
														<MenuItem
															sx={{ gap: 2 }}
															onClick={(e) => {
																dispatch(
																	setCopyData(
																		{
																			...file,
																			mode: "copy",
																		}
																	)
																);
																enqueueSnackbar(
																	file?.type ===
																		1
																		? "File Copied"
																		: "Folder Copied",
																	{
																		variant:
																			"success",
																		TransitionProps:
																			{
																				direction:
																					"left",
																			},
																		anchorOrigin:
																			{
																				horizontal:
																					"right",
																				vertical:
																					"bottom",
																			},
																	}
																);
															}}>
															<LuCopy
																style={{
																	cursor: "pointer",
																	color: "#fc6f03",
																}}
															/>
															Copy
														</MenuItem>
													)}
												{userAccessList?.indexOf(
													"FileSystem.add_file"
												) !== -1 && (
													<MenuItem
														sx={{ gap: 2 }}
														onClick={(e) => {
															dispatch(
																setCopyData({
																	...file,
																	mode: "cut",
																})
															);
															enqueueSnackbar(
																`${file?.type === 1 ? "File" : "Folder"} is now ready to be moved to the desired destination.`,
																{
																	variant:
																		"success",
																	TransitionProps:
																		{
																			direction:
																				"left",
																		},
																	anchorOrigin:
																		{
																			horizontal:
																				"right",
																			vertical:
																				"bottom",
																		},
																}
															);
														}}>
														<LuScissors
															style={{
																cursor: "pointer",
																color: "#fc6f03",
															}}
														/>
														Cut
													</MenuItem>
												)}
												{file?.type !== 2 && (
													<MenuItem
														sx={{ gap: 2 }}
														onClick={(e) => {
															setRename({
																isOpen: true,
																name:
																	file.name ||
																	file.originalname,
																file_id:
																	file?.id,
															});
															handleMenuClose(
																file?.id
																	? file.id
																	: ""
															);
														}}>
														<>
															<LuFileEdit
																style={{
																	cursor: "pointer",
																	color: "#fc6f03",
																}}
															/>
														</>
														Rename
													</MenuItem>
												)}
												{file?.type !== 2 && (
													<MenuItem
														sx={{ gap: 2 }}
														onClick={(e) => {
															dispatch(
																downloadFile({
																	id: file?.id,
																	action: "download",
																	file_name:
																		file?.name ||
																		"",
																})
															);
															// .then(
															// 	(res: any) => {
															// 		downloadFileByUrl(
															// 			res
															// 				?.payload
															// 				?.file
															// 		);
															// 	}
															// );
														}}>
														<>
															<LuDownload
																style={{
																	cursor: "pointer",
																	color: "#fc6f03",
																}}
															/>
														</>
														Download
													</MenuItem>
												)}
												{userAccessList?.indexOf(
													"FileSystem.add_sharedfile"
												) !== -1 &&
													file?.type !== 2 && (
														<MenuItem
															sx={{ gap: 2 }}
															onClick={(e) => {
																dispatch(
																	setFileShare(
																		{
																			fileShareLoading:
																				false,
																			fileShareModal:
																				true,
																			fileShareData:
																				{
																					file: file,
																				},
																		}
																	)
																);
															}}>
															<LuShare
																style={{
																	cursor: "pointer",
																	color: "#fc6f03",
																}}
															/>
															Share
														</MenuItem>
													)}
											</Menu>
										</Box>
									</Box>
								</Grid>
							);
						})
					) : (
						<Grid size={{ xs: 12 }}>
							<EmptyData />
						</Grid>
					)}
					{loading && "Loading..."}
				</Grid>
			</ScrollableList>
		</Box>
	);
};

export default GridView;
