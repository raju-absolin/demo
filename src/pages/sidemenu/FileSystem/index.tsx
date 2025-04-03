import React, { ChangeEvent, useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	deleteFile,
	editFiles,
	getFolders,
	getFiles,
	getFileById,
	getFilesByIdBreadcrumb,
	getFilesWithChildrenList,
	getFolderById,
	deleteFolder,
	copyFile,
	moveFile,
	getStaticFiles,
} from "@src/store/sidemenu/file_system/fs.action";
import {
	setSelectedData,
	useFileSystemSelector,
	setSearchValue,
	setIsModelVisible,
	setMasterEditId,
	setParentValue,
	setBreadCrumbs,
	setFilesList,
	openFolderModal,
	setCopyData,
	setParentId,
	setIsGridView,
	setPageParams,
	setSortDropDown,
	setFolderTree,
} from "@src/store/sidemenu/file_system/fs.slice";
import { systemSelector } from "@src/store/system/system.slice";
import TableComponent from "@src/components/TableComponenet";
import {
	Link,
	useOutletContext,
	useNavigate,
	useParams,
	useLocation,
} from "react-router-dom";
import {
	LuArrowUpNarrowWide,
	LuArrowUpWideNarrow,
	LuClipboardPaste,
	LuCopy,
	LuEye,
	LuFile,
	LuFileBadge,
	LuFilePlus2,
	LuFolder,
	LuFolderPlus,
	LuLayoutGrid,
	LuList,
	LuPencil,
	LuScissors,
	LuSearch,
	LuShare,
	LuTrash2,
} from "react-icons/lu";
import TopComponent from "@src/pages/settings/TopComponent";
import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	Paper,
	styled,
	tableCellClasses,
	Popover,
	Typography,
	Menu,
	MenuList,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Tooltip,
	Zoom,
	Stack,
	Fade,
	ButtonGroup,
} from "@mui/material";
import MasterPageTitle from "@src/components/MasterPageTitle";
import PageTitle from "@src/components/PageTitle";
import SearchIcon from "@mui/icons-material/Search";
import {
	selectLayoutTheme,
	updateSidenav,
} from "@src/store/customise/customise";
import { RiAddCircleFill, RiArrowLeftCircleFill } from "react-icons/ri";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem, useTreeViewApiRef } from "@mui/x-tree-view";
import {
	CardHeader,
	Grid2 as Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { PageBreadcrumb } from "@src/components";
import {
	Delete,
	ExpandLess,
	ExpandMore,
	MarginTwoTone,
} from "@mui/icons-material";
import BreadCrumbs from "./BreadCrumbs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import {
	FileData,
	FolderData,
	FolderTreeData,
} from "@src/store/sidemenu/file_system/fs.types";
import { useDropdownMenu } from "@src/hooks";
import AddFolder from "./Folder.add";
import UploadFile from "./File.add";
import { enqueueSnackbar } from "notistack";
import Loader from "@src/components/Loader";
import ListView from "./List.view";
import GridView from "./GridView";
import FileShare from "./FileShare";
import SortMenu from "@src/components/Sortingcomponent";
import { findItemInTree } from "@src/helpers";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.grey[100],
		color: theme.palette.primary,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

interface File {
	id: string;
	label: string;
	children?: File[];
}

interface SimpleTreeViewProps {
	files: File[];
}
const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.common.white,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 10,
	},
}));

const Files = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const apiRef = useTreeViewApiRef();
	const [anchorEl, setAnchorEl] = useState<
		| React.MouseEvent<
				HTMLElement | SVGElement,
				MouseEvent
		  >["currentTarget"]
		| null
	>(null);
	const deleteOpen = Boolean(anchorEl);
	const [currentId, setCurrentId] = useState("");
	const location = useLocation(); // Get the current URL
	const currentPathId = location.pathname.split("/").pop(); // Extract the ID from the URL
	const [selectedItem, setSelectedItem] = React.useState<string>("");

	const {
		fileSystem: {
			filesList,
			FoldersTree,
			pageParams,
			sortDropDown,
			filesCount,
			parentValue,
			folderChildrenPageParams,
			folderpageParams,
			copiedData,
			isGridView,
			breadCrumbsList,
			folderloading,
		},
		system: { userAccessList },
	} = useFileSystemSelector();

	const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		dispatch(
			getFilesWithChildrenList({
				params: {
					...folderChildrenPageParams,
					// parent: id,
					search: "",
					page: 1,
					page_size: 10,
				},
			})
		);
	}, []);

	let searchSchema = object({
		search: string(),
	});
	const { control, handleSubmit, register, reset } = useForm({
		resolver: yupResolver(searchSchema),
		values: {
			search: pageParams.search,
		},
	});

	const handleClick = <T extends HTMLElement | SVGElement>(
		event: React.MouseEvent<T, MouseEvent>,
		id: string
	) => {
		setCurrentId(id);
		setAnchorEl(event.currentTarget);
	};
	const handleDeleteClose = () => {
		setAnchorEl(null);
	};
	const confirmDelete = (deleteId: string, type: number) => {
		type == 1
			? dispatch(
					deleteFile({
						id: deleteId,
						clearDataFn: () => {},
						navigate,
						folderChildrenPageParams,
						parentIds: parentValue,
						pageParams,
					})
				)
			: dispatch(
					deleteFolder({
						id: deleteId,
						clearDataFn: () => {},
						navigate,
						folderChildrenPageParams,
						parentIds: parentValue,
						folderpageParams,
					})
				);
		handleDeleteClose();
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getFiles({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: isGridView ? 20 : 10,
			})
		);
	};

	useEffect(() => {
		if (id) {
			dispatch(
				getFiles({
					...pageParams,
					parent: id,
					page: 1,
					page_size: isGridView ? 20 : 10,
				})
			);
			dispatch(setBreadCrumbs([]));
			dispatch(
				getFilesByIdBreadcrumb({
					id: id,
					folderChildrenPageParams,
				})
			);
		} else {
			dispatch(
				getFiles({
					...pageParams,
					parent: "",
					search: "",
					page: 1,
					page_size: isGridView ? 20 : 10,
				})
			);
			dispatch(setBreadCrumbs([]));
		}

		reset({ search: "" });
	}, [id]);

	useMemo(() => {
		if (id && breadCrumbsList?.length > 0) {
			const openedFoldersIds = breadCrumbsList?.map((e) => e.id);
			setExpandedNodes(openedFoldersIds);
			const a = breadCrumbsList?.map(async (e) => {
				return await dispatch(
					getFilesWithChildrenList({
						params: {
							...folderChildrenPageParams,
							parent: e.id,
							search: "",
							page: 1,
							page_size: 10,
						},
					})
				);
			});
			if (FoldersTree && FoldersTree?.length > 0) {
				Promise.allSettled(a).then((results) => {
					const map = results.flatMap(
						(result: any) =>
							result?.value?.payload?.response?.results
					);
					function mergeAndBuildTree(
						rootItems: FolderTreeData[],
						childItems: FolderTreeData[]
					): FolderTreeData[] {
						const itemMap: { [key: string]: FolderTreeData } = {};

						// Step 1: Add all root items to the map
						rootItems.forEach((item) => {
							itemMap[item.id] = { ...item, children: [] };
						});

						// Step 2: Add all child items to the map
						childItems.forEach((item) => {
							itemMap[item.id] = { ...item, children: [] };
						});

						// Step 3: Link children to parents
						childItems.forEach((item) => {
							if (item.parent && itemMap[item.parent.id]) {
								// Attach to parent's children array
								itemMap[item.parent.id].children!.push(
									itemMap[item.id]
								);
							}
						});

						// Step 4: Return only top-level root items
						return Object.values(itemMap).filter(
							(item) => !item.parent || !itemMap[item.parent.id]
						);
					}

					// Example Usage:
					const mergedTree = mergeAndBuildTree(
						FoldersTree || [],
						map
					);
					dispatch(setFolderTree(mergedTree));
				});
			}
		} else {
			setExpandedNodes([]);
		}
	}, [id, breadCrumbsList]);

	const openModal = (value: boolean) => {
		dispatch(setSelectedData({}));
		dispatch(setIsModelVisible(value));
	};

	function onFolderClick(folder: { id: string }) {
		// Toggle expansion state for the clicked node
		setExpandedNodes(
			(prev) =>
				prev.includes(folder.id)
					? prev.filter((id) => id !== folder.id) // Collapse if already expanded
					: [...prev, folder.id] // Expand if collapsed
		);

		dispatch(
			getFilesByIdBreadcrumb({
				id: folder?.id,
				folderChildrenPageParams,
			})
		);
		navigate(`/file_system/${folder?.id}`);
		dispatch(
			getFiles({
				...pageParams,
				parent: folder?.id,
				page: 1,
				page_size: isGridView ? 20 : 10,
			})
		);
	}

	function displayChildrenFolders(folderList: any) {
		return folderList?.map((folder: any, index: number) => {
			const isSelected = currentPathId === folder?.id; // Check if the current item is selected
			return (
				<TreeItem
					key={folder?.id}
					itemId={folder?.id || `${index}`}
					sx={{
						marginTop: "10px",
						"&.Mui-selected": {
							backgroundColor: isSelected
								? "rgba(62, 96, 213, 0.08)" // Highlight when selected
								: "transparent",
						},
					}}
					label={
						<span style={{ fontWeight: "400", fontSize: "15px" }}>
							{isSelected && folderloading ? (
								<Loader />
							) : (
								folder.name
							)}
						</span>
					}
					onClick={() => {
						onFolderClick(folder);
					}}>
					{displayChildrenFolders(folder.children)}
				</TreeItem>
			);
		});
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getFiles({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: isGridView ? 20 : 10,
			})
		);
	};

	const handlePaste = () => {
		const obj = {
			parent_id: id || "",
			file_id: copiedData?.id || "",
		};
		const folderData = findItemInTree(FoldersTree || [], id || "");

		copiedData?.mode == "copy"
			? dispatch(
					copyFile({
						obj,
						clearData: () => {
							folderData && onFolderClick(folderData);
							dispatch(setCopyData({}));
						},
					})
				)
			: dispatch(
					moveFile({
						id: obj?.file_id,
						obj,
						clearData: () => {
							folderData && onFolderClick(folderData);
							dispatch(setCopyData({}));
						},
					})
				);
	};

	const {
		anchorEl: menuAnchorEl,
		open: openMenu,
		handleClick: handleMenuClick,
		handleClose: handleMenuClose,
	} = useDropdownMenu();

	useEffect(() => {
		dispatch(getStaticFiles());
	}, []);

	return (
		<>
			<MasterPageTitle
				prefix={"FileSystem"}
				postfix={"file"}
				pageTitle="File System"
				goBack={true}
				modalVisible={true}
				pageText={""}
				navigationToAdd={"/file_system/add"}
			/>

			<Grid container spacing={2}>
				<Grid
					sx={{
						minWidth: "250px",
					}}>
					<Card sx={{ marginTop: 2 }}>
						<CardContent>
							{/* <Card>
						<CardContent> */}
							{/* <CardContent> */}
							{/* <Box sx={{ position: "relative" }}>
									<Button
										aria-expanded={
											openMenu ? "true" : undefined
										}
										onClick={handleMenuClick}
										variant="contained"
										color="success"
										fullWidth>
										<LuFilePlus2
											style={{ marginRight: "6px" }}
										/>{" "}
										Create New
									</Button>
								</Box> */}
							{/* <Menu
									anchorEl={menuAnchorEl}
									open={openMenu}
									onClose={handleMenuClose}>
									<MenuList sx={{ py: 0 }}>
										<MenuItem
											onClick={() => {
												dispatch(openFolderModal(true));
												handleMenuClose();
											}}>
											<ListItemIcon>
												<LuFolder />
											</ListItemIcon>
											<ListItemText>Folder</ListItemText>
										</MenuItem>
										<MenuItem
											onClick={() => {
												openModal(true);
												handleMenuClose();
											}}>
											<ListItemIcon>
												<LuFile />
											</ListItemIcon>
											<ListItemText>File</ListItemText>
										</MenuItem>
									</MenuList>
								</Menu> */}
							{/* </CardContent> */}
							<CardHeader
								title={
									<Typography
										variant="h5"
										color="text.primary"
										sx={{
											cursor: "pointer",
										}}
										onClick={() => {
											dispatch(setParentId(""));
											dispatch(
												getFiles({
													...pageParams,
													parent: "",
													page: 1,
													page_size: isGridView
														? 20
														: 10,
												})
											);
											navigate(`/file_system`);
											dispatch(setBreadCrumbs([]));
										}}>
										Folders
									</Typography>
								}
								className="bg-transparent border-bottom"
							/>
							<SimpleTreeView
								apiRef={apiRef}
								selectedItems={currentPathId}
								// expandedItems={breadCrumbsList?.map(
								// 	(e) => e.id
								// )}
								expandedItems={expandedNodes}>
								{displayChildrenFolders(FoldersTree)}
							</SimpleTreeView>
						</CardContent>
					</Card>
				</Grid>
				<Grid
					sx={{
						flex: 1,
					}}>
					<Card sx={{ marginBottom: "0px", marginTop: "20px" }}>
						<CardContent>
							<BreadCrumbs />
							<Grid container spacing={2}>
								<Grid size={{ md: 4 }}>
									<form
										action=""
										onSubmit={handleSubmit(handleSearch)}>
										<Grid container mb={2}>
											<TextField
												type="text"
												sx={{
													width: "500px",
												}}
												{...register("search")}
												id="input-with-icon-textfield"
												size="small"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<LuSearch
																size={20}
															/>
														</InputAdornment>
													),
												}}
												fullWidth
												variant="outlined"
												placeholder="Search"
												onChange={handleInputChange}
											/>
										</Grid>
									</form>
								</Grid>

								<Grid size={{ xs: 8 }} justifyContent={"end"}>
									<Stack
										flex={1}
										direction={"row"}
										justifyContent={"flex-end"}>
										<Box display={"flex"} gap={0.5}>
											{id && (
												<>
													<Button
														variant={"contained"}
														startIcon={
															<LuFilePlus2 />
														}
														onClick={() => {
															openModal(true);
															handleMenuClose();
														}}>
														File
													</Button>
													<Button
														variant={"contained"}
														startIcon={
															<LuFolderPlus />
														}
														onClick={() => {
															dispatch(
																openFolderModal(
																	true
																)
															);
															handleMenuClose();
														}}>
														Folder
													</Button>
												</>
											)}
											{copiedData &&
												!breadCrumbsList?.find(
													(e) =>
														e.id === copiedData?.id
												) &&
												copiedData?.parent?.id !=
													id && (
													<Tooltip
														TransitionComponent={
															Zoom
														}
														title="Paste">
														<IconButton
															sx={(theme) => {
																return {
																	bgcolor:
																		theme
																			.palette
																			.primary
																			.main,
																	color: theme
																		.palette
																		.common
																		.white,
																	"&:hover": {
																		color: theme
																			.palette
																			.common
																			.black,
																	},
																};
															}}
															onClick={
																handlePaste
															}>
															<LuClipboardPaste />
														</IconButton>
													</Tooltip>
												)}

											<SortMenu
												SORT_OPTIONS={[
													{
														label: "Code",
														value: "code",
													},
													{
														label: "Created On",
														value: "created_on",
													},
												]}
												onSortChange={(option: {
													label: string;
													value: string;
												}) => {
													dispatch(
														getFiles({
															...pageParams,
															parent: id,
															page: 1,
															page_size:
																isGridView
																	? 20
																	: 10,
															ordering:
																option?.value,
														})
													);
												}}
												onTypeChange={(
													type: boolean
												) => {
													dispatch(
														getFiles({
															...pageParams,
															parent: id,
															page: 1,
															page_size:
																isGridView
																	? 20
																	: 10,
															ordering: type
																? pageParams?.ordering?.substring(
																		pageParams?.ordering?.indexOf(
																			"-"
																		) + 1
																	)
																: `-${pageParams?.ordering}`,
														})
													);
												}}
											/>
											<Tooltip
												TransitionComponent={Zoom}
												title="List View">
												<IconButton
													sx={(theme) => {
														return {
															bgcolor: !isGridView
																? theme.palette
																		.primary
																		.main
																: theme.palette
																		.background
																		.default,
															color: !isGridView
																? theme.palette
																		.common
																		.white
																: theme.palette
																		.secondary
																		.main,
															"&:hover": {
																color: theme
																	.palette
																	.common
																	.black,
															},
														};
													}}
													onClick={() => {
														dispatch(
															getFiles({
																...pageParams,
																parent: id,
																search: "",
																page: 1,
																page_size:
																	isGridView
																		? 20
																		: 10,
															})
														);
														dispatch(
															setIsGridView(false)
														);
													}}>
													<LuList />
												</IconButton>
											</Tooltip>
											<Tooltip
												TransitionComponent={Zoom}
												title="Grid View">
												<IconButton
													sx={(theme) => {
														return {
															bgcolor: isGridView
																? theme.palette
																		.primary
																		.main
																: theme.palette
																		.background
																		.default,
															color: isGridView
																? theme.palette
																		.common
																		.white
																: theme.palette
																		.secondary
																		.main,

															"&:hover": {
																color: theme
																	.palette
																	.common
																	.black,
															},
														};
													}}
													onClick={() => {
														dispatch(
															getFiles({
																...pageParams,
																parent: id,
																search: "",
																page: 1,
																page_size:
																	isGridView
																		? 20
																		: 10,
															})
														);
														dispatch(
															setIsGridView(true)
														);
													}}>
													<LuLayoutGrid />
												</IconButton>
											</Tooltip>
										</Box>
									</Stack>
								</Grid>
							</Grid>
							{isGridView ? (
								<GridView
									currentId={currentId}
									anchorEl={anchorEl}
									onFolderClick={onFolderClick}
									openModal={openModal}
									handleClick={handleClick}
									handleDeleteClose={handleDeleteClose}
									confirmDelete={confirmDelete}
								/>
							) : (
								<ListView
									currentId={currentId}
									anchorEl={anchorEl}
									onFolderClick={onFolderClick}
									openModal={openModal}
									handleClick={handleClick}
									handleDeleteClose={handleDeleteClose}
									confirmDelete={confirmDelete}
								/>
							)}
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<AddFolder />
			<UploadFile />
			<FileShare />
		</>
	);
};

export default Files;
