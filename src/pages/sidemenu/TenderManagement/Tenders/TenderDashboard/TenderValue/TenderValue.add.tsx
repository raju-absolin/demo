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
import { Selector } from "@reduxjs/toolkit";
import { FormInput } from "@src/components";
import {
	postItemData,
	editItemData,
} from "@src/store/sidemenu/tender_mangement/bidingitems/biding_items.action";
import { bidingItemSelector } from "@src/store/sidemenu/tender_mangement/bidingitems/biding_items.slice";
import {
	editTenderValue,
	postTenderValue,
} from "@src/store/sidemenu/tender_mangement/TenderValue/tender_value.action";
import {
	selectTenderValue,
	tenderValueSelector,
} from "@src/store/sidemenu/tender_mangement/TenderValue/tender_value.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import * as yup from "yup";

const AddTenderValue = ({
	isOpen,
	hide,
}: {
	isOpen: boolean;
	hide: () => void;
}) => {
	const dispatch = useAppDispatch();
	const { id, tab } = useParams();
	const {
		tenderValue: {
			itemsList,
			loading,
			pageParams,
			itemsCount,
			modal,
			selectedData,
			isFilterOpen,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectTenderValue(state));

	const itemSchema = yup.object().shape({
		name: yup.string().required("Please enter your name"),
	});

	const {
		control,
		handleSubmit,
		reset: tenderRest,
		getValues,
		setValue,
	} = useForm<any>({
		resolver: yupResolver(itemSchema),
		[id == "0" ? "defaultValues" : "values"]: {
			name: selectedData?.name,
		},
	});

	const handleAdd = (values: { name: string }) => {
		const data = {
			amount: values.name,
			tender_id: id,
		};

		!selectedData?.id
			? dispatch(
					postTenderValue({
						data,
						params: pageParams,
						hide,
					})
				)
			: dispatch(
					editTenderValue({
						data,
						params: pageParams,
						id: selectedData?.id,
						// navigate="/"
						hide,
					})
				);
	};
	return (
		<Dialog
			open={isOpen}
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
				{selectedData?.id ? "Update Bid Value " : "Add Bid Value"}
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
						<FormInput
							name="name"
							label="Bid Value "
							type="number"
							placeholder="Enter Amount here..."
							control={control}
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
					autoFocus>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddTenderValue;
