import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	getFiles,
	getFileById,
	getFolderById,
	addFiles,
	editFiles,
	getFolders,
	addFolders,
	getFilesByIdBreadcrumb,
	getFilesWithChildrenList,
	deleteFile,
	editFolder,
	getStaticFiles,
	postSharedFile,
	getSharedFiles,
	deleteSharedFileById,
	getExcludedUsersListByFileId,
	getIncludedUsersListByFileId,
} from "./fs.action";
import { RootState, useAppSelector } from "@src/store/store";
import {
	FileData,
	FilesystemInitialState,
	FolderData,
	FolderTreeData,
	FolderTreeResponse,
} from "./fs.types";
import { string } from "yup";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: FilesystemInitialState = {
	error: "",
	status: "",
	loading: false,
	filesList: [],
	breadCrumbsList: [],
	filesCount: 0,
	searchValue: "",
	drawer: false,
	isModelVisible: false,
	filterStatus: false,
	parentValue: [],
	sortDropDown: false,
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
		ordering: "",
	},
	folderList: [],
	folderCount: 0,
	masterEditId: "",
	folderloading: false,
	openFolderModal: false,
	folderpageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	folderChildrenPageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},

	breadCrumbLoading: false,

	parentId: "",
	isGridView: true,

	FoldersTree: [],

	//sharedfile
	fileShareLoading: false,
	fileShareModal: false,
	fileShareData: {},
	fileShareList: [],
	filesSharedCount: 0,
	fileShareParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
		file_id: "",
	},

	miniExcludedUserListByFileId: {
		count: 0,
		loading: false,
		list: [],
		miniParams: {
			no_of_pages: 0,
			page_size: 10,
			page: 1,
			search: "",
			file_id: "",
		},
	},
	miniIncludedUserListByFileId: {
		count: 0,
		loading: false,
		list: [],
		miniParams: {
			no_of_pages: 0,
			page_size: 10,
			page: 1,
			search: "",
			file_id: "",
		},
	},
	showUserAdd: false,
};

const filesSlice = createSlice({
	name: "files",
	initialState,
	reducers: {
		clearUserData: (state, action) => {
			return initialState;
		},
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
			};
		},
		setSelectedFolderData: (state, action) => {
			return {
				...state,
				selectedFolderData: action.payload,
			};
		},
		setSearchValue: (state, action) => {
			return {
				...state,
				searchValue: action.payload,
			};
		},
		setParentValue: (state, action: PayloadAction<string[]>) => {
			return {
				...state,
				parentValue: action.payload,
			};
		},
		setIsModelVisible: (state, action) => {
			return {
				...state,
				isModelVisible: action.payload,
			};
		},
		setMasterValue: (state, action) => {
			return {
				...state,
				masterValue: action.payload,
			};
		},
		setMasterEditId: (state, action) => {
			return {
				...state,
				masterEditId: action.payload,
			};
		},
		setUploadImages: (state, action) => {
			return {
				...state,
				image: action.payload,
			};
		},
		setBreadCrumbs: (state, action) => {
			return {
				...state,
				breadCrumbsList: action.payload,
			};
		},
		setFilesList: (state, action) => {
			return {
				...state,
				filesList: action.payload,
			};
		},
		openFolderModal: (state, action) => {
			return {
				...state,
				openFolderModal: action.payload,
			};
		},
		setCopyData: (state, action) => {
			return {
				...state,
				copiedData: action.payload,
				parentId: action.payload.parent.id,
			};
		},
		setParentId: (state, action) => {
			return {
				...state,
				parentId: action.payload,
			};
		},
		setIsGridView: (state, action) => {
			return {
				...state,
				isGridView: action.payload,
			};
		},
		setFileShare: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
		setPageParams: (state, action) => {
			return {
				...state,
				pageParams: action.payload,
			};
		},
		setSortDropDown: (state, action) => {
			return {
				...state,
				sortDropDown: action.payload,
			};
		},
		clearExcludedUserListByFileId: (state, action) => {
			return {
				...state,
				miniExcludedUserListByFileId:
					initialState.miniExcludedUserListByFileId,
			};
		},
		clearIncludedUserListByFileId: (state, action) => {
			return {
				...state,
				miniIncludedUserListByFileId:
					initialState.miniIncludedUserListByFileId,
			};
		},
		setFolderTree: (state, action) => {
			return {
				...state,
				FoldersTree: action.payload,
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getFiles.pending, (state, action) => {
				state.status = "getFiles loading";
				state.loading = true;
			})
			.addCase(getFiles.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getFiles succeeded";
				state.loading = false;

				var list = [];
				if (params.page == 1) {
					list = response.results;
				} else {
					list = [...state.filesList, ...response.results];
				}

				state.filesList = state.isGridView ? list : response.results;
				state.filesCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getFiles.rejected, (state, action) => {
				state.status = "getFiles failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})

			.addCase(getFolders.pending, (state, action) => {
				state.status = "getFolders loading";
				state.folderloading = true;
			})
			.addCase(getFolders.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getFolders succeeded";
				state.folderloading = false;
				state.folderList = response.results;
				state.folderCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.folderpageParams = {
					...state.folderpageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getFolders.rejected, (state, action) => {
				state.status = "getFolders failed";
				state.folderloading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getFileById.pending, (state, action) => {
				state.status = "getFileById loading";
				state.loading = true;
			})
			.addCase(getFileById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getFileById succeeded";
				state.loading = false;
				const split: string[] | undefined = response?.file?.split("/");
				state.selectedData = {
					...response,
					file: {
						path: split ? split[split.length - 1] : "",
						preview: response?.file,
						formattedSize: "",
					},
				};
			})
			.addCase(getFileById.rejected, (state, action) => {
				state.status = "getFileById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getFolderById.pending, (state, action) => {
				state.status = "getFolderById loading";
				state.folderloading = true;
			})
			.addCase(getFolderById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getFolderById succeeded";
				state.folderloading = false;
				state.selectedFolderData = response;
			})
			.addCase(getFolderById.rejected, (state, action) => {
				state.status = "getFolderById failed";
				state.folderloading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addFiles.pending, (state, action) => {
				state.status = "addFiles loading";
				state.loading = true;
			})
			.addCase(addFiles.fulfilled, (state, action) => {
				state.status = "addFiles succeeded";
				state.loading = false;
			})
			.addCase(addFiles.rejected, (state, action) => {
				state.status = "addFiles failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addFolders.pending, (state, action) => {
				state.status = "addFolders loading";
				state.folderloading = true;
			})
			.addCase(addFolders.fulfilled, (state, action) => {
				state.status = "addFolders succeeded";
				state.folderloading = false;
			})
			.addCase(addFolders.rejected, (state, action) => {
				state.status = "addFolders failed";
				state.folderloading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(editFiles.pending, (state, action) => {
				state.status = "editFiles loading";
				state.loading = true;
			})
			.addCase(editFiles.fulfilled, (state, action) => {
				state.status = "editFiles succeeded";
				state.loading = false;
			})
			.addCase(editFiles.rejected, (state, action) => {
				state.status = "editFiles failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(editFolder.pending, (state, action) => {
				state.status = "editFolder loading";
				state.folderloading = true;
			})
			.addCase(editFolder.fulfilled, (state, action) => {
				state.status = "editFolder succeeded";
				state.folderloading = false;
			})
			.addCase(editFolder.rejected, (state, action) => {
				state.status = "editFolder failed";
				state.folderloading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getFilesByIdBreadcrumb.pending, (state, action) => {
				state.status = "getFilesByIdBreadcrumb loading";
				state.breadCrumbLoading = true;
			})
			.addCase(getFilesByIdBreadcrumb.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getFilesByIdBreadcrumb succeeded";
				state.breadCrumbLoading = false;
				state.breadCrumbsList = response?.breadcrumb;
			})
			.addCase(getFilesByIdBreadcrumb.rejected, (state, action) => {
				state.status = "getFilesByIdBreadcrumb failed";
				state.breadCrumbLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getFilesWithChildrenList.pending, (state, action) => {
				state.status = "getFilesWithChildrenList loading";
				state.folderloading = true;
			})
			.addCase(getFilesWithChildrenList.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				const parent = params.parent;
				state.folderloading = false;
				state.status = "getFilesWithChildrenList succeeded";

				if (state.FoldersTree?.length === 0) {
					function addChildToParent(
						items: FolderTreeData[],
						parentId: string,
						newChildren: FolderTreeData[]
					): FolderTreeData[] {
						if (newChildren?.length > 0) {
							return items?.length > 0
								? items.map((item) => {
										if (item.id === parentId) {
											// Append new children instead of replacing
											return {
												...item,
												children: newChildren,
											};
										} else if (item.children) {
											// Recursively update children
											return {
												...item,
												children: addChildToParent(
													item.children,
													parentId,
													newChildren
												),
											};
										}
										return item;
									})
								: newChildren;
						} else {
							return items;
						}
					}
					const folderTrees = addChildToParent(
						state?.FoldersTree || [],
						parent || "",
						response.results
					);

					state.FoldersTree = folderTrees;
				}
			})
			.addCase(getFilesWithChildrenList.rejected, (state, action) => {
				state.status = "getFilesWithChildrenList failed";
				state.folderloading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteFile.pending, (state, action) => {
				state.status = "deleteFile loading";
				state.loading = true;
			})
			.addCase(deleteFile.fulfilled, (state, action) => {
				state.status = "deleteFile succeeded";
				state.loading = false;
			})
			.addCase(deleteFile.rejected, (state, action) => {
				state.status = "deleteFile failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getStaticFiles.pending, (state, action) => {
				state.status = "getStaticFiles loading";
				state.loading = true;
			})
			.addCase(getStaticFiles.fulfilled, (state, action) => {
				state.status = "getStaticFiles succeeded";
				state.loading = false;
				state.staticFiles = action.payload;
			})
			.addCase(getStaticFiles.rejected, (state, action) => {
				state.status = "getStaticFiles failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(postSharedFile.pending, (state, action) => {
				state.status = "postSharedFile loading";
				state.fileShareLoading = true;
			})
			.addCase(postSharedFile.fulfilled, (state, action) => {
				state.status = "postSharedFile succeeded";
				state.fileShareLoading = false;
			})
			.addCase(postSharedFile.rejected, (state, action) => {
				state.status = "postSharedFile failed";
				state.fileShareLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteSharedFileById.pending, (state, action) => {
				state.status = "deleteSharedFileById loading";
				state.fileShareLoading = true;
			})
			.addCase(deleteSharedFileById.fulfilled, (state, action) => {
				state.status = "deleteSharedFileById succeeded";
				state.fileShareLoading = false;
			})
			.addCase(deleteSharedFileById.rejected, (state, action) => {
				state.status = "deleteSharedFileById failed";
				state.fileShareLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getSharedFiles.pending, (state, action) => {
				state.status = "getSharedFiles loading";
				state.fileShareLoading = true;
			})
			.addCase(getSharedFiles.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getSharedFiles succeeded";
				state.fileShareLoading = false;

				var list = [];
				if (params.page == 1) {
					list = response.results;
				} else {
					list = [...state.fileShareList, ...response.results];
				}

				state.fileShareList = list;
				state.filesSharedCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.fileShareParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getSharedFiles.rejected, (state, action) => {
				state.status = "getSharedFiles failed";
				state.fileShareLoading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getExcludedUsersListByFileId.pending, (state, action) => {
				state.status = "getExcludedUsersListByFileId loading";
				state.miniExcludedUserListByFileId.loading = true;
			})
			.addCase(
				getExcludedUsersListByFileId.fulfilled,
				(state, action) => {
					const { response, params } = action.payload;
					state.status = "getExcludedUsersListByFileId succeeded";
					state.miniExcludedUserListByFileId.loading = false;

					var list = [];
					if (params.page == 1) {
						list = response.results;
					} else {
						list = [
							...state.miniExcludedUserListByFileId.list,
							...response.results,
						];
					}

					state.miniExcludedUserListByFileId.list = list as any;
					state.filesSharedCount = response.count;
					var noofpages = Math.ceil(
						response.count / params.page_size
					);
					state.fileShareParams = {
						...state.pageParams,
						...params,
						no_of_pages: noofpages,
					};
				}
			)
			.addCase(getExcludedUsersListByFileId.rejected, (state, action) => {
				state.status = "getExcludedUsersListByFileId failed";
				state.miniExcludedUserListByFileId.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getIncludedUsersListByFileId.pending, (state, action) => {
				state.status = "getIncludedUsersListByFileId loading";
				state.miniIncludedUserListByFileId.loading = true;
			})
			.addCase(
				getIncludedUsersListByFileId.fulfilled,
				(state, action) => {
					const { response, params } = action.payload;
					state.status = "getIncludedUsersListByFileId succeeded";
					state.miniIncludedUserListByFileId.loading = false;

					var list = [];
					if (params.page == 1) {
						list = response.results;
					} else {
						list = [
							...state.miniIncludedUserListByFileId.list,
							...response.results,
						];
					}

					state.miniIncludedUserListByFileId.list = list;
					state.filesSharedCount = response.count;
					var noofpages = Math.ceil(
						response.count / params.page_size
					);
					state.fileShareParams = {
						...state.pageParams,
						...params,
						no_of_pages: noofpages,
					};
				}
			)
			.addCase(getIncludedUsersListByFileId.rejected, (state, action) => {
				state.status = "getIncludedUsersListByFileId failed";
				state.miniIncludedUserListByFileId.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	clearUserData,
	setSelectedData,
	setSelectedFolderData,
	setSearchValue,
	setIsModelVisible,
	setMasterValue,
	setMasterEditId,
	setUploadImages,
	setParentValue,
	setBreadCrumbs,
	setFilesList,
	openFolderModal,
	setCopyData,
	setParentId,
	setIsGridView,
	setFileShare,
	clearExcludedUserListByFileId,
	clearIncludedUserListByFileId,
	setPageParams,
	setSortDropDown,
	setFolderTree,
} = filesSlice.actions;

export const fileSystemSelector = (state: RootState) => state.fileSystem;

// Memoized selector
export const selectFileSystem = createSelector(
	[fileSystemSelector, systemSelector, miniSelector],
	(fileSystem, system, mini) => ({
		fileSystem,
		system,
		mini,
	})
);

export const useFileSystemSelector = () => {
	const selectors = useAppSelector((state) => selectFileSystem(state));
	return selectors;
};

export default filesSlice.reducer;
