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
import TextArea from "@src/components/form/TextArea";
import {
	postItemData,
	editItemData,
} from "@src/store/sidemenu/tender_mangement/bidingitems/biding_items.action";
import { bidingItemSelector } from "@src/store/sidemenu/tender_mangement/bidingitems/biding_items.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import * as yup from "yup";

const AddBidItem = ({
	isOpen,
	hide,
}: {
	isOpen: boolean;
	hide: () => void;
}) => {
	const dispatch = useAppDispatch();
	const { selectedData, pageParams } = useAppSelector((state) =>
		bidingItemSelector(state)
	);

	const itemSchema = yup.object().shape({
		name: yup
			.string()
			.trim()
			.required("Please enter your name")
			.min(1, "Name cannot be just spaces"),
	});

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(itemSchema),
		values: {
			name: selectedData.name,
		},
	});

	const handleAdd = (values: { name: string }) => {
		const data = {
			name: values.name,
		};

		!selectedData.id
			? dispatch(
					postItemData({
						data,
						params: pageParams,
						hide,
					})
				)
			: dispatch(
					editItemData({
						id: selectedData.id,
						data,
						params: pageParams,
						hide,
					})
				);

		reset();
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
				{"Add Item"}
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
						<TextArea
							control={control}
							label={""}
							name={"name"}
							maxRows={0}
							placeholder={"Enter item description here..."}
							containerSx={{
								display: "grid",
								gap: 1,
							}}
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

export default AddBidItem;
