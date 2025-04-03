import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@src/store/store";
import { TasksState } from "./tasks.types";
import {
	deleteTaskAttachment,
	deleteTaskCheckList,
	editTaskData,
	getTaskAttachments,
	getTaskCheckList,
	getTaskComments,
	getTasks,
	postTaskAttachment,
	postTaskChecklist,
	postTaskCommentAttachment,
	postTaskComments,
	postTaskData,
} from "./tasks.action";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: TasksState = {
	loading: false,
	status: "",
	error: "",
	modal: false,
	list: [],
	count: 0,

	task_attachments: [],
	task_attachments_count: 0,
	task_attachments_loading: false,

	task_checklist: [],
	task_checklist_count: 0,
	task_checklist_loading: false,

	comments: [],
	commentsCount: 0,
	comments_loading: false,
	selectedData: null,
	isFilterOpen: false,
	viewModal: false,
	pageParams: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
		project: "",
	},
	comment_params: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
		task: "",
	},
	task_attachment_params: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
		task: "",
	},

	task_checklist_params: {
		page: 1,
		page_size: 10,
		search: "",
		no_of_pages: 0,
		task: "",
		project: "",
	},
};

const tasksSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		isModalOpen: (state, action) => {
			return {
				...state,
				modal: action.payload,
			};
		},
		setSelectedData: (state, action) => {
			const modified_attachments = action.payload?.attachments?.map(
				(document: any) => {
					const split: string[] | undefined =
						document?.file?.split("/");
					return {
						...document,
						path: split ? split[split.length - 1] : "",
						preview: document?.file,
						formattedSize: "",
					};
				}
			);
			return {
				...state,
				selectedData: action.payload,
				task_attachments: modified_attachments,
			};
		},
		setIsFilterOpen: (state, action) => {
			return {
				...state,
				isFilterOpen: action.payload,
			};
		},
		setPageParams: (state, action) => {
			return {
				...state,
				pageParams: action.payload,
			};
		},
		setViewModal: (state, action) => {
			return {
				...state,
				viewModal: action.payload,
			};
		},
		setTaskChecklist: (state, action) => {
			return {
				...state,
				task_checklist: action.payload,
			};
		},
		clear_task_attachment: (state) => {
			return {
				...state,
				task_attachments: [],
				task_attachments_count: 0,
				task_attachments_loading: false,
				task_attachment_params: initialState.task_attachment_params,
			};
		},
		clear_task_checklist: (state) => {
			return {
				...state,
				task_checklist: [],
				task_checklist_count: 0,
				task_checklist_loading: false,
				task_checklist_params: initialState.task_checklist_params,
			};
		},
		setUploadDocument: (state, action) => {
			return {
				...state,
				task_attachments: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getTasks.pending, (state, action) => {
				state.status = "getTasks pending";
				state.loading = true;
			})
			.addCase(getTasks.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getTasks succeeded";
				state.loading = false;
				state.list = response.results;
				state.count = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);

				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getTasks.rejected, (state, action) => {
				state.status = "getTasks failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// get task attachments
			.addCase(getTaskAttachments.pending, (state, action) => {
				state.status = "getTaskAttachments pending";
				state.task_attachments_loading = true;
			})
			.addCase(getTaskAttachments.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getTaskAttachments succeeded";
				state.task_attachments_loading = false;
				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.task_attachments, ...response.results];
				}

				list = list
					? list?.map((document) => {
							const split: string[] | undefined =
								document?.file?.split("/");
							return {
								...document,
								path: split ? split[split.length - 1] : "",
								preview: document?.file,
								formattedSize: "",
							};
						})
					: [];

				state.task_attachments = list;
				state.task_attachments_count = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);

				state.task_attachment_params = {
					...state.task_attachment_params,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getTaskAttachments.rejected, (state, action) => {
				state.status = "getTaskAttachments failed";
				state.task_attachments_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getTaskComments.pending, (state, action) => {
				state.status = "getTaskComments pending";
				state.comments_loading = true;
			})
			.addCase(getTaskComments.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getTaskComments succeeded";
				state.comments_loading = false;

				var list = [];
				const newresponse = response?.results?.map((item) => {
					return {
						...item,
						attachments: item?.attachments?.map((e) => {
							const split: string[] | undefined =
								e?.file?.split("/");
							return {
								...e,
								path: split ? split[split.length - 1] : "",
								preview: e?.file,
								formattedSize: "",
							};
						}),
					};
				});
				if (params?.page == 1) {
					list = newresponse;
				} else {
					list = [...state.comments, ...newresponse];
				}

				state.comments = list;
				state.commentsCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);

				state.comment_params = {
					...state.comment_params,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getTaskComments.rejected, (state, action) => {
				state.status = "getTaskComments failed";
				state.comments_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// get task checklist
			.addCase(getTaskCheckList.pending, (state, action) => {
				state.status = "getTaskCheckList pending";
				state.task_checklist_loading = true;
			})
			.addCase(getTaskCheckList.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getTaskCheckList succeeded";
				state.task_checklist_loading = false;

				var list = [];
				if (params?.page == 1) {
					list = response.results;
				} else {
					list = [...state.task_checklist, ...response.results];
				}

				state.task_checklist = list;
				state.task_checklist_count = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);

				state.task_checklist_params = {
					...state.task_checklist_params,
					...params,
					no_of_pages: noofpages,
				};
			})
			.addCase(getTaskCheckList.rejected, (state, action) => {
				state.status = "getTaskCheckList failed";
				state.task_checklist_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post Data
			.addCase(postTaskData.pending, (state, action) => {
				state.status = "postTaskData pending";
				state.loading = true;
			})
			.addCase(postTaskData.fulfilled, (state, action) => {
				state.status = "postTaskData succeeded";
				state.loading = false;
			})
			.addCase(postTaskData.rejected, (state, action) => {
				state.status = "postTaskData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post attachment Data
			.addCase(postTaskAttachment.pending, (state, action) => {
				state.status = "postTaskAttachment pending";
				state.task_attachments_loading = true;
			})
			.addCase(postTaskAttachment.fulfilled, (state, action) => {
				state.status = "postTaskAttachment succeeded";
				state.task_attachments_loading = false;
			})
			.addCase(postTaskAttachment.rejected, (state, action) => {
				state.status = "postTaskAttachment failed";
				state.task_attachments_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post checklist Data
			.addCase(postTaskChecklist.pending, (state, action) => {
				state.status = "postTaskChecklist pending";
				state.task_checklist_loading = true;
			})
			.addCase(postTaskChecklist.fulfilled, (state, action) => {
				state.status = "postTaskChecklist succeeded";
				state.task_checklist_loading = false;
			})
			.addCase(postTaskChecklist.rejected, (state, action) => {
				state.status = "postTaskChecklist failed";
				state.task_checklist_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//delete attachment Data
			.addCase(deleteTaskAttachment.pending, (state, action) => {
				state.status = "deleteTaskAttachment pending";
				state.task_attachments_loading = true;
			})
			.addCase(deleteTaskAttachment.fulfilled, (state, action) => {
				state.status = "deleteTaskAttachment succeeded";
				state.task_attachments_loading = false;
			})
			.addCase(deleteTaskAttachment.rejected, (state, action) => {
				state.status = "deleteTaskAttachment failed";
				state.task_attachments_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post comments Data
			.addCase(postTaskComments.pending, (state, action) => {
				state.status = "postTaskComments pending";
				state.comments_loading = true;
			})
			.addCase(postTaskComments.fulfilled, (state, action) => {
				state.status = "postTaskComments succeeded";
				state.comments_loading = false;
			})
			.addCase(postTaskComments.rejected, (state, action) => {
				state.status = "postTaskComments failed";
				state.comments_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//post comments attachment Data
			.addCase(postTaskCommentAttachment.pending, (state, action) => {
				state.status = "postTaskCommentAttachment pending";
				state.comments_loading = true;
			})
			.addCase(postTaskCommentAttachment.fulfilled, (state, action) => {
				state.status = "postTaskCommentAttachment succeeded";
				state.comments_loading = false;
			})
			.addCase(postTaskCommentAttachment.rejected, (state, action) => {
				state.status = "postTaskCommentAttachment failed";
				state.comments_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//edit Data
			.addCase(editTaskData.pending, (state, action) => {
				state.status = "editTaskData pending";
				state.loading = true;
			})
			.addCase(editTaskData.fulfilled, (state, action) => {
				state.status = "editTaskData succeeded";
				state.loading = false;
			})
			.addCase(editTaskData.rejected, (state, action) => {
				state.status = "editTaskData failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			//delete checklist Data
			.addCase(deleteTaskCheckList.pending, (state, action) => {
				state.status = "deleteTaskCheckList pending";
				state.task_checklist_loading = true;
			})
			.addCase(deleteTaskCheckList.fulfilled, (state, action) => {
				state.status = "deleteTaskCheckList succeeded";
				state.task_checklist_loading = false;
			})
			.addCase(deleteTaskCheckList.rejected, (state, action) => {
				state.status = "deleteTaskCheckList failed";
				state.task_checklist_loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	isModalOpen,
	setSelectedData,
	setIsFilterOpen,
	setPageParams,
	setViewModal,
	clear_task_checklist,
	clear_task_attachment,
	setTaskChecklist,
	setUploadDocument,
} = tasksSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const tasksSelector = (state: RootState) => state.taskManagement.tasks;

export const selectTasks = createSelector(
	[tasksSelector, systemSelector, miniSelector],
	(tasks, system, mini) => ({
		tasks,
		system,
		mini,
	})
);
export const useTaskSelector = () => {
	const selector = useAppSelector((state) => selectTasks(state));
	return selector;
};

export default tasksSlice.reducer;
