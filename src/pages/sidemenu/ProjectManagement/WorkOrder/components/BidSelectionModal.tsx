import { yupResolver } from "@hookform/resolvers/yup";
import {
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Grid2 as Grid,
	DialogActions,
	Button,
	Divider,
	Box,
} from "@mui/material";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniTenders,
	getMiniUniqueTender,
} from "@src/store/mini/mini.Action";
import { clearMiniTenders } from "@src/store/mini/mini.Slice";
import {
	selectWorkOrders,
	setBidSelectionModal,
	setBidSelected,
} from "@src/store/sidemenu/project_management/work_order/work_order.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React from "react";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const BidSelectionModal = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const {
		workOrder: { selectedData, bidSelectionModal: open, bidSelected },
		mini: { miniTenders },
	} = useAppSelector((state) => selectWorkOrders(state));

	const schema = yup.object().shape({
		tender: yup
			.object()
			.shape({
				label: yup.string().required("Tender is required"),
				value: yup.string().required("Tender is required"),
			})
			.nullable(),
		// .when([], {
		// 	is: () => isTenderRequired,
		// 	then: (schema) => schema.required("Tender is required"),
		// 	otherwise: (schema) => schema.notRequired(),
		// }),
	});

	const {
		control,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const hide = () => {
		dispatch(setBidSelectionModal(false));
	};

	const handleSelection = (value: boolean, url: string) => {
		dispatch(setBidSelected(value));
		navigate(url);
		hide();
	};

	return (
		<Dialog
			open={open}
			onClose={() => {
				hide();
			}}
			sx={{
				"& .MuiDialog-paper": {
					width: "800px",
				},
			}}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle
				sx={{
					// bgcolor: "primary.main",
					// color: "white",
					p: 1,
					px: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
				variant="h4"
				id="alert-dialog-title">
				{"Select An Option"}
				<IconButton
					onClick={() => {
						hide();
					}}>
					<LuX color="black" />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: "0px", pt: "12px !important", pb: 2 }}>
				<DialogContentText id="alert-dialog-description">
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-around",
						}}>
						<Box>
							{/* <Button
								variant="contained"
								onClick={() => {
									handleSelection(true);
								}}>
								{" "}
								Create Work Order With Bid
							</Button> */}
							<SelectComponent
								name="tender"
								label="Create Work Order With Bid"
								placeholder="Select Bid"
								control={control}
								rules={{ required: true }}
								options={miniTenders.list.map(
									(e: {
										id: string | number;
										tender_no: string;
									}) => ({
										id: e.id,
										name: e.tender_no,
									})
								)}
								// disabled={tenderId !== "0" ? true : false}
								// helperText={
								// 	tenderId !== "0"
								// 		? "This field is disabled"
								// 		: ""
								// }
								onChange={(value) => {
									handleSelection(
										false,
										`/work_order/${value.value}/0`
									);
								}}
								loading={miniTenders.loading}
								selectParams={{
									page: miniTenders.miniParams.page,
									page_size: miniTenders.miniParams.page_size,
									search: miniTenders.miniParams.search,
									no_of_pages:
										miniTenders.miniParams.no_of_pages,
									status: 2,
								}}
								hasMore={
									miniTenders.miniParams.page <
									miniTenders.miniParams.no_of_pages
								}
								fetchapi={getMiniUniqueTender}
								clearData={clearMiniTenders}
							/>
						</Box>

						<Divider orientation="vertical" flexItem />
						<Box>
							<Button
								variant="contained"
								onClick={() => {
									handleSelection(false, "/work_order/0/0");
								}}
								sx={{
									mt: 3,
								}}>
								{" "}
								Create Work Order Without Bid
							</Button>
						</Box>
					</Box>
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};

export default BidSelectionModal;
