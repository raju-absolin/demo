import {
	Box,
	Button,
	ButtonGroup,
	IconButton,
	Paper,
	Popover,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import { downloadFileByUrl } from "@src/helpers";
import {
	downloadFile,
	editFiles,
	getFileById,
	getFiles,
	getFilesWithChildrenList,
	getFolderById,
} from "@src/store/sidemenu/file_system/fs.action";
import {
	openFolderModal,
	setCopyData,
	setFileShare,
	useFileSystemSelector,
} from "@src/store/sidemenu/file_system/fs.slice";
import { FileData } from "@src/store/sidemenu/file_system/fs.types";
import { useAppDispatch } from "@src/store/store";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import React, { ChangeEvent, useState } from "react";
import {
	LuCopy,
	LuDownload,
	LuFileEdit,
	LuPencil,
	LuSave,
	LuScissors,
	LuShare,
	LuTrash2,
	LuX,
} from "react-icons/lu";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "@src/components";
import { config } from "@src/config";
import blue_folder_icon from "@src/assets/images/default_file_icons/285658_blue_folder_icon.png";
import empty_file_icon from "@src/assets/images/default_file_icons/285688_file_empty_icon.png";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.grey[100],
		color: theme.palette.primary,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

interface Props {
	currentId: string;
	onFolderClick: (
		row: FileData,
		event: React.MouseEvent<HTMLTableRowElement, MouseEvent>
	) => void;
	openModal: (value: boolean) => void;
	handleDeleteClose: () => void;
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
}

const ListView = ({
	currentId,
	anchorEl,
	onFolderClick,
	openModal,
	handleClick,
	handleDeleteClose,
	confirmDelete,
}: Props) => {
	const dispatch = useAppDispatch();
	const {
		fileSystem: {
			filesList,
			pageParams,
			filesCount,
			staticFiles,
			folderChildrenPageParams,
		},
		system: { userAccessList },
	} = useFileSystemSelector();
	const [rename, setRename] = useState<{
		file_id: string;
		isOpen: boolean;
		name: string;
	}>();
	const { id } = useParams();
	const [rowType, setRowType] = useState(1);
	const deleteOpen = Boolean(anchorEl);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getFiles({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getFiles({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
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
			return `${config.baseUrl}/static/iconpacks/default/${staticFiles[file_type == 1 ? "default_file" : "default_folder"]
				}`;
		};
		if (file.thumbnail) {
			return file.thumbnail;
		} else {
			if (file?.fileextension) {
				const extension = staticFiles[file?.fileextension];
				if (extension) {
					return `${config.baseUrl}/static/iconpacks/default/${extension
						}`;
				} else {
					return static_file(file.type);
				}
			} else {
				return static_file(file.type);
			}
		}
	};

	const columns = [
		{
			title: "File / Folder Name",
		},
		{
			title: "Code",
		},
		{
			title: "Uploaded On",
		},
		{
			title: "Uploaded By",
		},
		{
			title: "File Size",
		},
		{
			title: "Description",
		},
		{
			title: "Actions",
		},
	];

	type FileRenameTypes = {
		name: string;
	};
	const fileRenameSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter your file name")
			.trim()
		// .matches(
		// 	/^[a-zA-Z0-9 ]*$/,
		// 	"file name should not contain special characters"
		// )
		,
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
							page_size: 10,
						})
					);
					dispatch(
						getFilesWithChildrenList({
							params: {
								...folderChildrenPageParams,
								parent: id || "",
								search: "",
								page: 1,
								page_size: 10,
							},
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
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					<TableHead>
						<TableRow>
							{columns &&
								columns.map((e) => {
									return (
										<StyledTableCell>
											{e.title}
										</StyledTableCell>
									);
								})}
						</TableRow>
					</TableHead>
					<TableBody>
						{filesList?.length > 0 ? (
							<>
								{filesList?.map(
									(row: FileData, key: number) => (
										<TableRow
											key={row?.id}
											hover // Adds hover effect
											style={{
												cursor: "pointer",
											}} // Adds pointer cursor to show it's clickable
											onClick={(event) => {
												if (row?.type != 1) {
													onFolderClick(row, event);
												} else {
													if (!rename?.isOpen)
														typeof row.file ==
															"string" &&
															(() => {
																dispatch(
																	downloadFile(
																		{
																			id: row?.id,
																			action: "view",
																			file_name:
																				row?.name ||
																				"",
																		}
																	)
																);
																window.open(
																	row.file,
																	"_blank"
																);
															})();
												}
											}} // Handle row click
										>
											<StyledTableCell
												sx={{
													display: "flex",
													alignItems: "center",
													gap: 2,
													height:100,
													width: 400,
												}}>
												<img
													src={filethumbnailUrl(row)}
													style={{
														width: "25px",
														height: "25px",
														objectFit: "cover",
													}}
													onError={(e) => {
														(
															e.target as HTMLImageElement
														).src =
															row?.type == 1
																? empty_file_icon
																: blue_folder_icon;
													}}
												/>
												<Box>
													{rename?.isOpen &&
														row?.id ===
														rename?.file_id ? (
														<>
															<FormInput
																name="name"
																label=""
																type="text"
																placeholder="Enter File here..."
																control={
																	control
																}
															/>
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
																			changeFileName(
																				{
																					payload:
																						values,
																					file: row,
																				}
																			);
																		}
																	)}>
																	<LuSave />
																</IconButton>
															</ButtonGroup>
														</>
													) : (
														<Typography
															sx={{
																wordBreak:
																	"break-word",
															}}>
															{row?.name}
														</Typography>
													)}
												</Box>
											</StyledTableCell>
											<StyledTableCell>
												{row?.code}
											</StyledTableCell>
											<StyledTableCell>
												{moment(
													row?.file_uploaded_on
												).format("LLL")}
											</StyledTableCell>
											<StyledTableCell>
												{row?.file_uploaded_by
													?.fullname ||
													row?.file_uploaded_by
														?.username}
											</StyledTableCell>

											<StyledTableCell>
												{convertBytesToMB(+row.size)}
											</StyledTableCell>
											<StyledTableCell>
												{row?.remarks}
											</StyledTableCell>
											{/* <StyledTableCell>
												{row?.type_name}
											</StyledTableCell> */}
											<StyledTableCell>
												<Box
													sx={{
														display: "flex",
														gap: 1,
													}}
													onClick={(e) =>
														e.stopPropagation()
													}>
													{userAccessList?.indexOf(
														"FileSystem.change_file"
													) !== -1 &&
														row?.type == 2 && (
															<Tooltip
																TransitionComponent={
																	Zoom
																}
																title="Edit Folder">
																<IconButton
																	size="small"
																	onClick={() => {
																		if (
																			row?.type ==
																			2
																		) {
																			dispatch(
																				getFolderById(
																					{
																						id: row?.id,
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
																						id: row?.id,
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
																</IconButton>
															</Tooltip>
														)}
													{userAccessList?.indexOf(
														"FileSystem.delete_file"
													) !== -1 && (
															<>
																<Tooltip
																	TransitionComponent={
																		Zoom
																	}
																	title="Delete">
																	<IconButton
																		size="small"
																		onClick={(
																			e
																		) => {
																			setRowType(row?.type);
																			handleClick(
																				e,
																				row?.id
																			)
																		}
																		}>
																		<LuTrash2
																			style={{
																				cursor: "pointer",
																				color: "#fc6f03",
																			}}
																		/>
																	</IconButton>
																</Tooltip>
																<Popover
																	id={
																		currentId
																			? String(
																				currentId
																			)
																			: undefined
																	}
																	open={
																		deleteOpen
																	}
																	anchorEl={
																		anchorEl
																	}
																	onClose={
																		handleDeleteClose
																	}
																	anchorOrigin={{
																		vertical:
																			"top",
																		horizontal:
																			"right",
																	}}
																	transformOrigin={{
																		vertical:
																			"bottom",
																		horizontal:
																			"left",
																	}}>
																	<div
																		style={{
																			padding:
																				"15px",
																		}}>
																		<Typography
																			variant="subtitle1"
																			gutterBottom>
																			Are you
																			sure to
																			delete
																			this
																			Record?
																		</Typography>
																		<Button
																			variant="contained"
																			type="submit"
																			color="primary"
																			onClick={() =>
																				confirmDelete(
																					currentId,
																					rowType
																				)
																			}
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
															</>
														)}

													{userAccessList?.indexOf(
														"FileSystem.add_file"
													) !== -1 &&
														row?.type !== 2 && (
															<Tooltip
																TransitionComponent={
																	Zoom
																}
																title="Copy">
																<IconButton
																	size="small"
																	onClick={(
																		e
																	) => {
																		dispatch(
																			setCopyData(
																				{
																					...row,
																					mode: "copy",
																				}
																			)
																		);
																		enqueueSnackbar(
																			row?.type ===
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
																</IconButton>
															</Tooltip>
														)}
													{userAccessList?.indexOf(
														"FileSystem.add_file"
													) !== -1 &&
														row?.type !== 2 && (
															<>
																<Tooltip
																	TransitionComponent={
																		Zoom
																	}
																	title="Cut">
																	<IconButton
																		size="small"
																		onClick={(
																			e
																		) => {
																			dispatch(
																				setCopyData(
																					{
																						...row,
																						mode: "cut",
																					}
																				)
																			);
																			enqueueSnackbar(
																				`${row?.type === 1 ? "File" : "Folder"} is now ready to be moved to the desired destination.`,
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
																	</IconButton>
																</Tooltip>
															</>
														)}
													{row?.type !== 2 && (
														<Tooltip
															TransitionComponent={
																Zoom
															}
															title="Download">
															<IconButton
																size="small"
																onClick={(
																	e
																) => {
																	dispatch(
																		downloadFile(
																			{
																				id: row?.id,
																				action: "download",
																				file_name:
																					row?.name ||
																					"",
																			}
																		)
																	);
																}}>
																<LuDownload
																	style={{
																		cursor: "pointer",
																		color: "#fc6f03",
																	}}
																/>
															</IconButton>
														</Tooltip>
													)}
													{row?.type !== 2 && (
														<>
															<Tooltip
																TransitionComponent={
																	Zoom
																}
																title="Rename File">
																<IconButton
																	size="small"
																	onClick={(
																		e
																	) => {
																		setRename(
																			{
																				isOpen: true,
																				name:
																					row.name ||
																					row.originalname,
																				file_id:
																					row?.id,
																			}
																		);
																	}}>
																	<LuFileEdit
																		style={{
																			cursor: "pointer",
																			color: "#fc6f03",
																		}}
																	/>
																</IconButton>
															</Tooltip>
														</>
													)}
													{userAccessList?.indexOf(
														"FileSystem.add_sharedfile"
													) !== -1 &&
														row?.type !== 2 && (
															<Tooltip
																TransitionComponent={
																	Zoom
																}
																title="Share">
																<IconButton
																	size="small"
																	onClick={(
																		e
																	) => {
																		dispatch(
																			setFileShare(
																				{
																					fileShareLoading:
																						false,
																					fileShareModal:
																						true,
																					fileShareData:
																					{
																						file: row,
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
																</IconButton>
															</Tooltip>
														)}
												</Box>
											</StyledTableCell>
										</TableRow>
									)
								)}
							</>
						) : (
							<TableRow>
								<StyledTableCell
									colSpan={columns.length}
									align="center"
									sx={{
										padding: 5,
									}}>
									Empty Data
								</StyledTableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[
					10,
					20,
					50,
					100,
					{ label: "All", value: -1 },
				]}
				component="div"
				count={filesCount}
				rowsPerPage={pageParams.page_size}
				page={pageParams.page - 1}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Box >
	);
};

export default ListView;
