import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addParams,
	getList,
	getParamsList,
	postAdd,
	postEdit,
} from "@src/helpers/Helper";
import {
	MileStonesState,
	MileStone,
	postMileStonePayload,
} from "./milestones.types";
import Swal from "sweetalert2";
import { useAppDispatch } from "@src/store/store";
import {
	isModalOpen,
	setIsFilterOpen,
	setPageParams,
	setSelectedData,
} from "./milestones.slice";
import { formatErrorMessage } from "../../errorMsgFormat";

export const getMileStones = createAsyncThunk<
	{
		response: {
			results: MileStone[];
			count: number;
		};
		params: MileStonesState["pageParams"];
	},
	MileStonesState["pageParams"]
>("mileStones/getMileStones", async (payload) => {
	var params = addParams(payload);

	try {
		const response = await getParamsList(
			"/taskmanagement/milestone/",
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

export const getMileStoneById = createAsyncThunk<
	{
		response: MileStone;
	},
	{ id: string }
>("mileStones/getMileStoneById", async (payload) => {
	const { id } = payload;
	try {
		const response = await getList(`/taskmanagement/milestone/${id}/`);
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
	data: postMileStonePayload;
	params: MileStonesState["pageParams"];
	hide: (value: boolean) => void;
}

export const postMileStoneData = createAsyncThunk<any, PostPayload>(
	"mileStones/postMileStoneData",
	async (payload, { dispatch }) => {
		const { data, params, hide } = payload;
		try {
			Swal.fire({
				text: "Loading, please wait...",
				didOpen: () => {
					Swal.showLoading();
				},
				allowOutsideClick: false,
			});
			const response = await postAdd(
				`/taskmanagement/milestone/create/`,
				{
					...data,
				}
			);
			if (response.status >= 200 && response.status < 300) {
				hide(true);
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "MileStone Added Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(getMileStones(params));
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
interface PutPayload extends PostPayload {
	id: number | string;
}

export const editMileStoneData = createAsyncThunk<any, PutPayload>(
	"mileStones/editMileStoneData",
	async (payload, { dispatch }) => {
		const { id, data, params, hide } = payload;
		try {
			Swal.fire({
				text: "Loading, please wait...",
				didOpen: () => {
					Swal.showLoading();
				},
				allowOutsideClick: false,
			});
			const response = await postEdit(
				`/taskmanagement/milestone/${id}/`,
				{
					...data,
				}
			);
			if (response.status >= 200 && response.status < 300) {
				hide(true);
				Swal.close();
				Swal.fire({
					title: `<p style="font-size:20px">Success</p>`,
					text: "MileStone Edited Successfully",
					icon: "success",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
				dispatch(getMileStones(params));
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

export const useMileStoneActions = () => {
	const dispatch = useAppDispatch();
	return {
		reducer: {
			isModalOpen: (payload: boolean) => dispatch(isModalOpen(payload)),
			setSelectedData: (payload: MileStone | null) =>
				dispatch(setSelectedData(payload)),
			setIsFilterOpen: (payload: boolean) =>
				dispatch(setIsFilterOpen(payload)),
			setPageParams: (payload: MileStonesState["pageParams"]) =>
				dispatch(setPageParams(payload)),
		},
		extraReducer: {
			getMileStones: (payload: MileStonesState["pageParams"]) =>
				dispatch(getMileStones(payload)),
			getMileStoneById: (payload: MileStone) =>
				dispatch(getMileStoneById(payload)),
			postMileStoneData: (payload: PostPayload) =>
				dispatch(postMileStoneData(payload)),
			editMileStoneData: (payload: PutPayload) =>
				dispatch(editMileStoneData(payload)),
		},
	};
};
