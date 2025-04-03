import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getDownloadFile,
	getDownloadFileWithoutAxiosInstance,
	getList,
	getParamsList,
	patchImg,
	postAdd,
	postDelete,
	postEdit,
	postFormData,
	putImg,
} from "@src/helpers/Helper";
import {
	ApiFolderPayload,
	FileData,
	ApiFilePayload,
	FolderData,
	FilesystemInitialState,
	FileWithChildren,
	BreadCrumbsData,
	FolderTreeData,
	FileExtensions,
	EditFileApiPayload,
	SharedFilePayload,
	SharedFile,
	BreadCrumb,
} from "./fs.types";
import Swal from "sweetalert2";
import { PageParamsTypes } from "@src/common/common.types";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import { formatErrorMessage } from "../errorMsgFormat";
import { AxiosResponse } from "axios";

export const getFiles = createAsyncThunk<
	{
		response: {
			results: FileData[];
			count: number;
		};
		params: FilesystemInitialState["pageParams"];
	},
	FilesystemInitialState["pageParams"]
>("/getFiles", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/filesystem/files/list/", params);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const getFolders = createAsyncThunk<
	{
		response: {
			results: FolderData[];
			count: number;
		};
		params: FilesystemInitialState["folderpageParams"];
	},
	FilesystemInitialState["folderpageParams"]
>("/getFolders", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList("/filesystem/folder/", params);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const getFolderById = createAsyncThunk<
	{
		response: FolderData;
	},
	{ id?: string | number }
>("/getFolderById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/filesystem/folder/${id}`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});
export const getFileById = createAsyncThunk<
	{
		response: FileData;
	},
	{ id?: string | number }
>("/getFilesById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/filesystem/files/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const addFiles = createAsyncThunk<
	FileData,
	{
		obj: ApiFilePayload;
		clearData: () => void;
	}
>("/addFiles", async (payload, { dispatch }) => {
	const { clearData } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postFormData(
			`/filesystem/files/create/`,
			payload.obj
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">File Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			clearData();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});

export const editFiles = createAsyncThunk<
	FileData,
	{
		id: string;
		obj: EditFileApiPayload;
		clearData: () => void;
	}
>("/editFiles", async (payload, { dispatch }) => {
	const { id, clearData } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await putImg(`/filesystem/file/${id}/`, payload.obj);
		if (response.status == 200) {
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">File Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			clearData();
			return response.data;
		} else {
			throw new Error(response as any);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});

export const addFolders = createAsyncThunk<
	FolderData,
	{
		obj: ApiFolderPayload;
		params: FilesystemInitialState["folderpageParams"];
		clearData: () => void;
	}
>("/addFolders", async (payload, { dispatch }) => {
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const { params, clearData } = payload;
		const response = await postAdd(`/filesystem/folder/`, payload.obj);
		if (response.status >= 200 && response.status < 300) {
			dispatch(getFolders(params));
			clearData();
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Folder Added Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});

export const editFolder = createAsyncThunk<
	void,
	{
		obj: ApiFolderPayload;
		id: string;
		params: FilesystemInitialState["folderpageParams"];
		clearData: () => void;
	}
>("/editFolder", async (payload, { dispatch }) => {
	const { id, params, clearData } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response2 = await postEdit(
			`/filesystem/folder/${id}`,
			payload.obj
		);
		if (response2.status == 200) {
			dispatch(getFolders(params));
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Folder Edited Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			clearData();
		} else {
			throw new Error(response2 as any);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});

export const getFilesByIdBreadcrumb = createAsyncThunk<
	{
		response: BreadCrumbsData;
	},
	{
		id?: string | number;
		folderChildrenPageParams: FilesystemInitialState["folderChildrenPageParams"];
		// parentIds: string[];
	}
>("/getFilesByIdBreadcrumb", async (payload, { dispatch }) => {
	const { id, folderChildrenPageParams } = payload;
	try {
		const response: AxiosResponse<BreadCrumbsData> = await getList(
			`/filesystem/files/${id}/breadcrumb/`
		);
		if (response.data) {
			const parentIds = response.data?.breadcrumb?.map(
				(e: BreadCrumb) => e.id
			);
			// parentIds?.forEach(async (parentID) => {
			// 	await dispatch(
			// 		getFilesWithChildrenList({
			// 			params: {
			// 				...folderChildrenPageParams,
			// 				parent: parentID,
			// 			},
			// 			// parentIds: [parentID],
			// 		})
			// 	);
			// });
			return { response: response.data };
		} else {
			throw new Error("Invalid response data");
		}
	} catch (error: any) {
		throw new Error(error.message || "An error occurred");
	}
});
export const getFilesWithChildrenList = createAsyncThunk<
	{
		response: {
			results: FolderTreeData[];
			count: number;
		};
		params: FilesystemInitialState["folderChildrenPageParams"];
		// parentIds?: string[];
	},
	{
		params: FilesystemInitialState["folderChildrenPageParams"];
		// parentIds: string[];
	}
>("/getFilesWithChildrenList", async (payload) => {
	var params = addParams(payload?.params);
	try {
		const response = await getParamsList(
			"/filesystem/folderchildrenlist/",
			params
		);
		if (response) {
			return { response, params };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const deleteFile = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: Function;
		navigate: Function;
		folderChildrenPageParams: FilesystemInitialState["folderChildrenPageParams"];
		parentIds: string[];
		pageParams: FilesystemInitialState["pageParams"];
	}
>("/deleteFile", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete(
			`/filesystem/file/delete/${payload.id}/`
		);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">File deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getFilesWithChildrenList({
					params: payload.folderChildrenPageParams,
					// parentIds: payload?.parentIds,
				})
			);
			dispatch(getFiles(payload.pageParams));
			payload.clearDataFn();
		} else {
			throw new Error(response2 as any);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});
export const deleteFolder = createAsyncThunk<
	void,
	{
		id: string;
		clearDataFn: Function;
		navigate: Function;
		folderChildrenPageParams: FilesystemInitialState["folderChildrenPageParams"];
		parentIds: string[];
		folderpageParams: FilesystemInitialState["folderpageParams"];
	}
>("/deleteFolder", async (payload, { dispatch }) => {
	try {
		const response2 = await postDelete("/filesystem/folder/" + payload.id);
		if (response2.status == 204) {
			Swal.fire({
				title: `<p style="font-size:20px">Folder deleted Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			dispatch(
				getFilesWithChildrenList({
					params: payload.folderChildrenPageParams,
					// parentIds: payload?.parentIds,
				})
			);
			dispatch(getFolders(payload.folderpageParams));
			payload.clearDataFn();
		} else {
			throw new Error(response2 as any);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});

export const copyFile = createAsyncThunk<
	FileData,
	{
		obj: {
			parent_id: string;
			file_id: string;
		};
		clearData: () => void;
	}
>("/copyFile", async (payload, { dispatch }) => {
	const { clearData } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const payloadObj = addParams(payload.obj);
		const response = await postAdd(
			`/filesystem/files/copy/create/`,
			payloadObj
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.close();
			clearData();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});
export const moveFile = createAsyncThunk<
	FileData,
	{
		id: string;
		obj: {
			parent_id: string;
		};
		clearData: () => void;
	}
>("/moveFile", async (payload, { dispatch }) => {
	const { clearData, id } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postEdit(
			`/filesystem/parentchange/files/${id}/`,
			payload.obj
		);
		if (response.status >= 200 && response.status < 300) {
			Swal.close();
			clearData();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});

export const getStaticFiles = createAsyncThunk("/getStaticFiles", async () => {
	try {
		const response = await getList(
			"/static/iconpacks/default/manifest.json"
		);

		if (response) {
			return response.data;
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const downloadFile = createAsyncThunk<
	{
		file: string;
		last_downloaded_by: string;
		last_downloaded_on: string;
	},
	{ id?: string | number; action: string; file_name: string }
>("/downloadFile", async (payload) => {
	const { id, action, file_name } = payload;
	try {
		const response = await getList(`/filesystem/file/${action}/${id}/`);
		if (response) {
			action !== "view" &&
				(await getDownloadFileWithoutAxiosInstance(
					response?.data?.file,
					{
						file_name,
					}
				));
			return response.data;
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const postSharedFile = createAsyncThunk<
	FileData,
	{
		obj: SharedFilePayload;
		clearData: () => void;
		params: FilesystemInitialState["fileShareParams"];
	}
>("/postSharedFile", async (payload, { dispatch }) => {
	const { clearData, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postFormData(
			`/filesystem/sharedfile/list/`,
			payload.obj
		);
		if (response.status >= 200 && response.status < 300) {
			dispatch(getIncludedUsersListByFileId(params));
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">File Shared Successfully</p>`,
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			clearData();
			return response.data;
		} else {
			throw new Error(response.data);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		Swal.close();
		Swal.fire({
			title: `<p style="font-size:20px">Error</p>`,
			html: `<div style="white-space: pre-line; text-align: left;">${formattedErrResult}</div>`,
			icon: "error",
			confirmButtonText: `Close`,
			confirmButtonColor: "#3085d6",
		});
		throw error.message;
	}
});

export const getSharedFiles = createAsyncThunk<
	{
		response: {
			results: SharedFile[];
			count: number;
		};
		params: FilesystemInitialState["fileShareParams"];
	},
	FilesystemInitialState["fileShareParams"]
>("/getSharedFiles", async (payload) => {
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/filesystem/sharedfile/list/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const getSharedFilesById = createAsyncThunk<
	{
		response: {
			results: SharedFile[];
			count: number;
		};
		params: FilesystemInitialState["fileShareParams"];
	},
	FilesystemInitialState["fileShareParams"]
>("/getSharedFilesById", async (payload) => {
	const { file_id }: any = payload;
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/filesystem/sharedfile/${file_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const getExcludedUsersListByFileId = createAsyncThunk<
	{
		response: {
			results: User[];
			count: number;
		};
		params: FilesystemInitialState["miniExcludedUserListByFileId"]["miniParams"];
	},
	FilesystemInitialState["miniExcludedUserListByFileId"]["miniParams"]
>("/getExcludedUsersListByFileId", async (payload) => {
	const { file_id }: any = payload;
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/filesystem/excludeduserslist/sharedfile/${file_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});
export const getIncludedUsersListByFileId = createAsyncThunk<
	{
		response: {
			results: User[];
			count: number;
		};
		params: FilesystemInitialState["miniIncludedUserListByFileId"]["miniParams"];
	},
	FilesystemInitialState["miniIncludedUserListByFileId"]["miniParams"]
>("/getIncludedUsersListByFileId", async (payload) => {
	const { file_id }: any = payload;
	var params = addParams(payload);
	try {
		const response = await getParamsList(
			`/filesystem/includeduserslist/sharedfile/${file_id}/`,
			params
		);
		if (response) {
			return { response, params: payload };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
});

export const deleteSharedFileById = createAsyncThunk<
	{
		response: SharedFile;
	},
	{ id: string; params: FilesystemInitialState["fileShareParams"] }
>("PGroups/deleteSharedFileById", async (payload, { dispatch }) => {
	const { id, params } = payload;
	try {
		Swal.fire({
			text: "Loading, please wait...",
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
		});
		const response = await postDelete(
			`/filesystem/sharedfile/delete/${id}/`
		);
		if (response) {
			Swal.close();
			dispatch(getIncludedUsersListByFileId(params));
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		Swal.close();
		throw error.message;
	}
});
