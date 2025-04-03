import { BaseInitialState, PageParamsTypes } from "@src/common/common.types";

export type FileExtensions = "default_file" | "default_folder" | "pdf" | "zip";

export interface ApiFilePayload {
	parent_id?: string;
	file: File | null;
	id?: string;
}

export interface ApiFolderPayload {
	id?: string;
	name: string;
	parent_id?: string;
	remarks?: string;
}

export type EditFileApiPayload = {
	name: string;
	tag_name?: Array<string>;
	description: string;
};

export interface FileData {
	id: string;
	code: string;
	name: string | null;
	originalname: string;
	type: number;
	type_name: string;
	description: string | undefined;
	file: any;
	thumbnail: string | null;
	fileextension: string;
	mimetype: string;
	size: string;
	metadata: {
		originalname: string;
		fileextension: string;
		size: string;
		mimetype: string;
		metadata: {
			file_path: string;
			size_in_kb: number;
		};
	};
	owner: string;
	parent: {
		id: string;
		code: string;
		name: string;
	};
	external_tags: any[];
	is_archived: boolean | null;
	last_downloaded_by: string | null;
	last_downloaded_on: string | null;
	file_created_on: string | null;
	remarks: string;
	children?: FileData[];
	file_uploaded_on: string;
	file_uploaded_by: {
		id: string;
		username: string;
		fullname: string;
		email: string;
		first_name: string;
		last_name: string;
		phone: string;
	};
}
export interface FolderData {
	id: string;
	code: string;
	name: string;
	parent: {
		id: string;
		name: string;
	};
	remarks: string;
}

export interface FileWithChildren {
	parentIds?: Array<FolderData>;
	parent?: string;
	search?: string;
	page: number;
	page_size: number;
}

export type BreadCrumb = {
	id: string;
	name: string;
	type: number;
	type_name: string;
};
export interface BreadCrumbsData {
	breadcrumb: Array<BreadCrumb>;
}

export interface FolderTreeData extends FolderData {
	children?: Array<FolderData>;
}

interface ParentItem {
	id: string;
	name: string;
	file: null;
	type: number;
	type_name: string;
	thumbnail: null;
	fileextension: null;
}

export interface FolderTreeResponse {
	id: string;
	code: string;
	name: string;
	file: null;
	parent: ParentItem;
	remarks: string;
	created_on: string;
}

// file share

export type SharedFilePayload = {
	file_id: string;
	shared_to_id: string;
};

type FileInfo = {
	id: string;
	name: string;
	file: string;
};

type User = {
	id: string;
	username: string;
	fullname: string;
	email: string;
	first_name: string;
	last_name: string;
	phone: string;
};

export type SharedFile = {
	id?: string;
	code?: string;
	file?: FileData;
	shared_by?: User;
	shared_to?: User;
	shared_on?: string;
};
export interface FilesystemInitialState extends BaseInitialState {
	//file
	filesList: FileData[];
	filesCount: number;
	fileFolderData?: FolderData;
	sortDropDown: boolean;
	pageParams: PageParamsTypes & {
		parent?: string;
	};
	isModelVisible: boolean;
	selectedData?: FileData;

	//folder
	folderList: FolderData[];
	FoldersTree?: FolderData[];
	folderCount: number;
	folderpageParams: PageParamsTypes;
	selectedFolderData?: FolderData;
	folderloading: boolean;
	openFolderModal: boolean;
	masterEditId: string;

	folderChildrenPageParams: PageParamsTypes & {
		parent?: string;
	};

	//breadcrumbs
	breadCrumbsList: BreadCrumbsData["breadcrumb"];
	breadCrumbLoading: boolean;

	//misceillinous
	filterStatus: boolean;
	drawer: false;
	copiedData?: FileData & {
		mode: "cut" | "copy";
	};
	parentId: string;

	searchValue: string;
	parentValue: Array<string>;
	isGridView: boolean;

	staticFiles?: any;

	//sharedfile
	fileShareLoading: boolean;
	fileShareModal: boolean;
	fileShareData: SharedFile;
	fileShareList: SharedFile[];
	filesSharedCount: number;
	fileShareParams: PageParamsTypes & {
		file_id: string | undefined;
	};

	miniIncludedUserListByFileId: {
		count: number;
		loading: boolean;
		list: SharedFile[];
		miniParams: PageParamsTypes & {
			file_id: string | undefined;
		};
	};
	miniExcludedUserListByFileId: {
		count: number;
		loading: boolean;
		list: User[];
		miniParams: PageParamsTypes & {
			file_id: string | undefined;
		};
	};
	showUserAdd: boolean;
}
