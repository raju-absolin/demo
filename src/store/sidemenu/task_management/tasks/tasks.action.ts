import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postDelete,
	postEdit,
	postFormData,
} from "@src/helpers/Helper";
import {
	TasksState,
	Task,
	postTaskPayload,
	Task_Comment,
	CommentPayload,
	Task_attachment,
	Task_CheckList_Payload,
	CheckListData,
} from "./tasks.types";
import Swal from "sweetalert2";
import { useAppDispatch } from "@src/store/store";
import {
	clear_task_attachment,
	clear_task_checklist,
	isModalOpen,
	setIsFilterOpen,
	setPageParams,
	setSelectedData,
	setTaskChecklist,
	setUploadDocument,
	setViewModal,
} from "./tasks.slice";
import { FileType } from "@src/components";
import { AxiosResponse } from "axios";
import { formatErrorMessage } from "../../errorMsgFormat";
import { postScreenAssigneUserData } from "@src/store/settings/AssignUsers/assignUsers.action";

export const getTasks = createAsyncThunk<
	{
		response: {
			results: Task[];
			count: number;
		};
		params: TasksState["pageParams"];
	},
	TasksState["pageParams"]
>("tasks/getTasks", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList(
			params?.project
				? "/taskmanagement/task/"
				: "/taskmanagement/common/task/",
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

export const getTaskAttachments = createAsyncThunk<
	{
		response: {
			results: Task_attachment[];
			count: number;
		};
		params: TasksState["task_attachment_params"];
	},
	TasksState["task_attachment_params"]
>("tasks/getTaskAttachments", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList(
			"/taskmanagement/taskattachment/",
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

export const getTaskComments = createAsyncThunk<
	{
		response: {
			results: Task_Comment[];
			count: number;
		};
		params: TasksState["comment_params"];
	},
	TasksState["comment_params"]
>("tasks/getTaskComments", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList(
			"/taskmanagement/taskcomment/",
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

export const getTaskById = createAsyncThunk<
	{
		response: Task;
	},
	{ id: string }
>("tasks/getTaskById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/taskmanagement/task/${id}/`);
		if (response) {
			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

interface PostPayload {
	data: postTaskPayload;
	params: TasksState["pageParams"];
	hide: (value: boolean) => void;
	documents?: FileType[];
	model_path?: string;
}

export const postTaskData = createAsyncThunk<any, PostPayload>(
	"tasks/postTaskData",
	async (payload, { dispatch }) => {
		const { data, params, hide, documents, model_path } = payload;
		const newData = {
			...data,
			users_ids: null,
		};
		const payloadData = addParams(newData);

		try {
			Swal.fire({
				text: "Loading, please wait...",
				didOpen: () => {
					Swal.showLoading();
				},
				allowOutsideClick: false,
			});
			const response = await postAdd(
				data.project_id
					? `/taskmanagement/task/create/`
					: `/taskmanagement/common/task/`,
				payloadData
			);

			for (let user of data?.users_ids) {
				await dispatch(
					postScreenAssigneUserData({
						obj: {
							user_id: user,
							instance_id: response?.data?.id,
							model_path: model_path || "",
							description: "",
						},
						hide: () => {},
						pageParams: {
							no_of_pages: 0,
							page_size: 10,
							page: 1,
							screen: "",
							instance_id: response?.data?.id,
							model_path: model_path || "",
						},
					})
				);
			}

			if (documents) {
				for (const file of documents) {
					try {
						if (file?.id && file?.dodelete) {
							await dispatch(
								deleteTaskAttachment({ id: file.id })
							).unwrap();
						} else if (file.originalObj) {
							await dispatch(
								postTaskAttachment({
									data: {
										task_id: response.data.id,
										file: file.originalObj,
									},
								})
							).unwrap();
						}
					} catch (error) {
						console.error("Error processing file:", error);
						// Handle error if needed
					}
				}
			}
			if (response.status >= 200 && response.status < 300) {
				hide(true);
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Task Added Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(getTasks(params));
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
	}
);

interface PostAttachmentPayload {
	data: {
		task_id: string;
		file: File;
	};
	params?: TasksState["task_attachment_params"];
}

export const postTaskAttachment = createAsyncThunk<any, PostAttachmentPayload>(
	"tasks/postTaskAttachment",
	async (payload, { dispatch }) => {
		const { data, params } = payload;
		try {
			const response = await postFormData(
				`/taskmanagement/taskattachment/create/`,
				data
			);
			if (response.status >= 200 && response.status < 300) {
				params && dispatch(getTaskAttachments(params));
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
	}
);

interface PostTaskCommentPayload {
	data: CommentPayload;
	params: TasksState["comment_params"];
	files?: File[];
	hide: () => void;
}

export const postTaskComments = createAsyncThunk<
	Task_Comment,
	PostTaskCommentPayload
>("tasks/postTaskComments", async (payload, { dispatch }) => {
	const { data, params, hide, files } = payload;
	try {
		const response = await postAdd(`/taskmanagement/taskcomment/create/`, {
			...data,
		});

		if (response.status >= 200 && response.status < 300) {
			if (files && files?.length != 0 && response.data.id) {
				for (const file of files) {
					try {
						await dispatch(
							postTaskCommentAttachment({
								taskcomment_id: response.data.id,
								file: file,
							})
						).unwrap();
					} catch (error) {
						console.error("Error uploading file:", error);
						// If any file upload fails, stop the sequence
						break;
					}
				}
			}
			dispatch(getTaskComments(params));
			hide();
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

export const postTaskCommentAttachment = createAsyncThunk<
	any,
	{
		taskcomment_id: string;
		file: File;
	}
>("tasks/postTaskCommentAttachment", async (payload, { dispatch }) => {
	try {
		const response = await postFormData(
			`/taskmanagement/taskcommentattachment/create/`,
			payload
		);
		if (response.status >= 200 && response.status < 300) {
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

interface PutPayload extends PostPayload {
	id: string;
}

export const editTaskData = createAsyncThunk<any, PutPayload>(
	"tasks/editTaskData",
	async (payload, { dispatch }) => {
		const { id, data, params, hide, documents } = payload;
		const payloadData = addParams(data);
		try {
			Swal.fire({
				text: "Loading, please wait...",
				didOpen: () => {
					Swal.showLoading();
				},
				allowOutsideClick: false,
			});
			const response = await postEdit(
				data.project_id
					? `/taskmanagement/task/${id}/`
					: `/taskmanagement/common/task/${id}`,
				{
					...payloadData,
				}
			);
			if (documents) {
				for (const file of documents) {
					try {
						if (file?.id && file?.dodelete) {
							await dispatch(
								deleteTaskAttachment({ id: file.id })
							).unwrap();
						} else if (file.originalObj) {
							await dispatch(
								postTaskAttachment({
									data: {
										task_id: response.data.id,
										file: file.originalObj,
									},
								})
							).unwrap();
						}
					} catch (error) {
						console.error("Error processing file:", error);
						// Handle error if needed
					}
				}
			}
			if (response.status >= 200 && response.status < 300) {
				hide(true);
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "Task Edited Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(getTasks(params));
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
	}
);

interface DeleteTaskAttachmentPayload {
	id: string;
	params?: TasksState["task_attachment_params"];
}

export const deleteTaskAttachment = createAsyncThunk<
	{
		response: Task;
	},
	DeleteTaskAttachmentPayload
>("tasks/deleteTaskAttachment", async (payload, { dispatch }) => {
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
			`/taskmanagement/taskattachment/${id}/`
		);
		if (response) {
			params && dispatch(getTaskAttachments(params));
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Task Attachment Delete Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});

			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const getTaskCheckList = createAsyncThunk<
	{
		response: {
			results: CheckListData[];
			count: number;
		};
		params: TasksState["task_checklist_params"];
	},
	TasksState["task_checklist_params"]
>("tasks/getTaskCheckList", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList(
			payload.project
				? "/taskmanagement/checklist/"
				: "/taskmanagement/commonchecklist/",
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

interface postChecklistPayload {
	data: Task_CheckList_Payload;
	params: TasksState["task_checklist_params"];
	hide: () => void;
}

export const postTaskChecklist = createAsyncThunk<any, postChecklistPayload>(
	"tasks/postTaskChecklist",
	async (payload, { dispatch }) => {
		const { data, params, hide } = payload;
		try {
			const response = await postAdd(
				data.project_id
					? `/taskmanagement/checklist/create/`
					: `/taskmanagement/commonchecklist/`,
				data
			);
			if (response.status >= 200 && response.status < 300) {
				dispatch(getTaskCheckList(params));
				hide();
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
	}
);

interface EditChecklistPayload extends postChecklistPayload {
	id: string;
}
export const editTaskChecklist = createAsyncThunk<any, EditChecklistPayload>(
	"tasks/editTaskChecklist",
	async (payload, { dispatch }) => {
		const { id, data, params, hide } = payload;
		try {
			const response = await postEdit(
				params?.project
					? `/taskmanagement/checklist/${id}/`
					: `/taskmanagement/commonchecklist/${id}/`,
				data
			);
			if (response.status >= 200 && response.status < 300) {
				dispatch(getTaskCheckList(params));
				hide();
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
	}
);

interface DeleteTaskChecklistPayload {
	id: string;
	params: TasksState["task_checklist_params"];
}

export const deleteTaskCheckList = createAsyncThunk<
	{
		response: Task;
	},
	DeleteTaskChecklistPayload
>("tasks/deleteTaskCheckList", async (payload, { dispatch }) => {
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
			params?.project
				? `/taskmanagement/checklist/${id}/`
				: `/taskmanagement/commonchecklist/${id}/`
		);
		if (response) {
			dispatch(getTaskCheckList(params));
			Swal.close();
			Swal.fire({
				title: `<p style="font-size:20px">Success</p>`,
				text: "Delete Successfully",
				icon: "success",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});

			return { response: response.data };
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		throw error.message;
	}
});

export const useTaskActions = () => {
	const dispatch = useAppDispatch();
	return {
		reducer: {
			isModalOpen: (payload: boolean) => dispatch(isModalOpen(payload)),
			setSelectedData: (payload: Task | null) =>
				dispatch(setSelectedData(payload)),
			setIsFilterOpen: (payload: boolean) =>
				dispatch(setIsFilterOpen(payload)),
			setPageParams: (payload: TasksState["pageParams"]) =>
				dispatch(setPageParams(payload)),
			setViewModal: (payload: boolean) => dispatch(setViewModal(payload)),
			clear_task_attachment: () => dispatch(clear_task_attachment()),
			setTaskChecklist: (payload: CheckListData[]) =>
				dispatch(setTaskChecklist(payload)),
			clear_task_checklist: () => dispatch(clear_task_checklist()),
			setUploadDocument: (payload: FileType[]) =>
				dispatch(setUploadDocument(payload)),
		},
		extraReducer: {
			// task
			getTasks: (payload: TasksState["pageParams"]) =>
				dispatch(getTasks(payload)),
			getTaskById: (payload: Task) => dispatch(getTaskById(payload)),
			postTaskData: (payload: PostPayload) =>
				dispatch(postTaskData(payload)),
			editTaskData: (payload: PutPayload) =>
				dispatch(editTaskData(payload)),
			// task comments
			getTaskComments: (payload: TasksState["comment_params"]) =>
				dispatch(getTaskComments(payload)),
			postTaskComments: (payload: PostTaskCommentPayload) =>
				dispatch(postTaskComments(payload)),
			// task attachments
			getTaskAttachments: (
				payload: TasksState["task_attachment_params"]
			) => dispatch(getTaskAttachments(payload)),
			postTaskAttachment: (payload: PostAttachmentPayload) =>
				dispatch(postTaskAttachment(payload)),
			deleteTaskAttachment: (payload: DeleteTaskAttachmentPayload) =>
				dispatch(deleteTaskAttachment(payload)),
			// task checklist
			getTaskCheckList: (payload: TasksState["task_checklist_params"]) =>
				dispatch(getTaskCheckList(payload)),
			postTaskChecklist: (payload: postChecklistPayload) =>
				dispatch(postTaskChecklist(payload)),
			editTaskChecklist: (payload: EditChecklistPayload) =>
				dispatch(editTaskChecklist(payload)),
			deleteTaskCheckList: (payload: DeleteTaskChecklistPayload) =>
				dispatch(deleteTaskCheckList(payload)),
		},
	};
};
