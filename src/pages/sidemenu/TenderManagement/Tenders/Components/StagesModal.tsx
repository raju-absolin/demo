import { yupResolver } from "@hookform/resolvers/yup";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
} from "@mui/material";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniStages, getMiniUsers } from "@src/store/mini/mini.Action";
import {
	clearMiniStages,
	clearMiniUsers,
	miniSelector,
} from "@src/store/mini/mini.Slice";
import {
	editAssignUser,
	editBidStages,
} from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import { TendersInitialState } from "@src/store/sidemenu/tender_mangement/tenders/tenders.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React from "react";
import { Control, useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import * as yup from "yup";

interface Props {
	open: boolean;
	hide: () => void;
	selectedData: any;
	params?: TendersInitialState["pageParams"];
}

const StagesModal = ({ open, hide, selectedData, params }: Props) => {
	const dispatch = useAppDispatch();
	const { miniStages } = useAppSelector((state) => miniSelector(state));

	const StagesSchema = yup.object().shape({
		tender_stage: yup
			.object({
				label: yup.string().required("Please select a tender stage"),
				value: yup.string().required("Please select a tender stage"),
			})
			.required("Please select a tender stage")
			.nullable(),
	});

	const { control, handleSubmit, reset, getValues } = useForm<
		{
			tender_stage: {
				label: string;
				value: string;
			} | null;
		},
		any,
		undefined
	>({
		resolver: yupResolver(StagesSchema),
		values: {
			tender_stage: selectedData?.tender_stage?.id
				? {
						label: selectedData?.tender_stage?.name
							? selectedData?.tender_stage?.name
							: "",
						value: selectedData?.tender_stage?.id
							? selectedData?.tender_stage?.id
							: "",
					}
				: null,
		},
	});

	const getValues_biding_stage = getValues("tender_stage");

	const handleAdd = (values: {
		tender_stage: {
			label: string;
			value: string;
		};
	}) => {
		const data = {
			tender_stage_id: values?.tender_stage?.value,
		};

		dispatch(
			editBidStages({
				id: selectedData?.id ? selectedData?.id : "",
				data,
				hide,
				params,
			})
		);

		reset();
	};
	return (
		<Dialog
			open={open}
			onClose={hide}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle
				sx={{
					bgcolor: "primary.main",
					color: "white",
					p: 1,
					px: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
				variant="h4"
				id="alert-dialog-title">
				{"Biding Stage"}
				<IconButton onClick={hide}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
				<DialogContentText
					id="alert-dialog-description"
					sx={{
						width: 500,
					}}>
					<form style={{ width: "100%" }}>
						<SelectComponent
							name="tender_stage"
							label="Bid Stage"
							control={control}
							rules={{ required: true }}
							options={miniStages?.list}
							loading={miniStages?.loading}
							selectParams={{
								page: miniStages?.miniParams?.page,
								page_size: miniStages?.miniParams?.page_size,
								search: miniStages?.miniParams?.search,
								no_of_pages:
									miniStages?.miniParams?.no_of_pages,
							}}
							hasMore={
								miniStages?.miniParams?.page <
								miniStages?.miniParams?.no_of_pages
							}
							fetchapi={getMiniStages}
							clearData={clearMiniStages}
						/>
					</form>
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button onClick={hide} variant="outlined" color="secondary">
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit(handleAdd as any)}
					type="submit"
					color="primary"
					disabled={!getValues_biding_stage?.value}
					autoFocus>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default StagesModal;
