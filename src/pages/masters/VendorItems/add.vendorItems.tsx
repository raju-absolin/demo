import react, { ChangeEvent, useEffect, useState } from "react";
import { Button, DialogContentText } from "@mui/material";
import { Control } from "react-hook-form";
import {
	Card,
	TextField,
	InputAdornment,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Grid2 as Grid,
	Paper,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	ListItemText,
	Modal,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	CheckboxInput,
	ComponentContainerCard,
	FormInput,
	PasswordInput,
} from "@src/components";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
	addVendorItem,
	editVendorItem,
} from "@src/store/masters/VendorItems/vendorItems.action";
import {
	vendorItemSelector,
	setMasterValue,
	setSelectedData,
	isModelVisible,
} from "@src/store/masters/VendorItems/vendorItems.slice";
import { systemSelector } from "@src/store/system/system.slice";
import {
	clearMiniItems,
	clearMiniVendors,
	miniSelector,
	setCountryValue,
	setStateValue,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";

import { LuX } from "react-icons/lu";
import {
	getMiniItems,
	getMiniVendor,
	getMiniVendors,
} from "@src/store/mini/mini.Action";

const AddVendorItemMasters = () => {
	const mastersName = "VendorItem";
	const dispatch = useAppDispatch();
	const {
		vendorItem: { selectedData, model: modal },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			vendorItem: vendorItemSelector(state),
		};
	});
	const { miniItemsList, miniVendors } = useAppSelector((state) =>
		miniSelector(state)
	);

	const closeModal = () => {
		dispatch(isModelVisible(false));
	};

	const vendorItemSchema = yup.object().shape({
		item: yup
			.object()
			.shape({
				label: yup.string().required("Please select item"),
				value: yup.string().required("Please select item"),
			})
			.required("Please select item"),
		vendor: yup
			.object()
			.shape({
				label: yup.string().required("Please select vendor"),
				value: yup.string().required("Please select vendor"),
			})
			.required("Please select vendor"),
	});

	// useEffect(() => {
	// 	if (modal) {
	// 		reset({
	// 			item: selectedData?.item
	// 				? {
	// 						label: selectedData?.item?.name,
	// 						value: selectedData?.item?.id,
	// 					}
	// 				: null,
	// 			vendor: selectedData?.vendor
	// 				? {
	// 						label: selectedData.vendor?.name,
	// 						value: selectedData.vendor?.id,
	// 					}
	// 				: null,
	// 		});
	// 	} else {
	// 		reset();
	// 	}
	// }, [modal, selectedData]);

	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(vendorItemSchema),
		values: {
			item: selectedData?.item
				? {
						label: selectedData?.item?.name,
						value: selectedData?.item?.id,
					}
				: null,
			vendor: selectedData?.vendor
				? {
						label: selectedData.vendor?.name,
						value: selectedData.vendor?.id,
					}
				: null,
		},
	});

	const onSubmit = (data: any) => {
		if (!selectedData?.id) {
			const obj = {
				item_id: data?.item?.value,
				vendor_id: data?.vendor?.value,
			};
			const payload = {
				obj,
				pageParams: {},
				clearDataFn: () => {},
				navigate: (path: string) => {},
			};
			dispatch(addVendorItem(payload));
			closeModal();
			dispatch(setSelectedData({}));
			reset();
		} else {
			const obj = {
				id: selectedData?.id,
				item_id: data?.item?.value,
				vendor_id: data?.vendor?.value,
			};
			const payload = {
				obj,
				pageParams: {},
				clearDataFn: () => {},
				navigate: (path: string) => {},
			};
			dispatch(editVendorItem(payload));
			closeModal();
			reset();
			dispatch(setSelectedData({}));
		}
	};

	return (
		<>
			<Dialog
				open={modal}
				onClose={closeModal}
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
					{!selectedData?.id ? "Add " : "Update "}
					{mastersName}
					<IconButton onClick={closeModal}>
						<LuX color="white" />
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
					<DialogContentText
						id="alert-dialog-description"
						sx={{
							width: 500,
						}}>
						<form
							style={{ width: "100%" }}
							onSubmit={handleSubmit(onSubmit)}>
							<Grid size={{ xs: 12, md: 4 }} mt={0}>
								<SelectComponent
									name="item"
									label="Item"
									control={control}
									options={miniItemsList.list?.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									required
									loading={miniItemsList.loading}
									selectParams={{
										page: miniItemsList?.miniParams?.page,
										page_size:
											miniItemsList?.miniParams
												?.page_size,
										search: miniItemsList?.miniParams
											?.search,
										no_of_pages:
											miniItemsList?.miniParams
												?.no_of_pages,
									}}
									hasMore={
										miniItemsList?.miniParams?.page <
										miniItemsList?.miniParams?.no_of_pages
									}
									fetchapi={getMiniItems}
									clearData={clearMiniItems}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }} mt={2}>
								<SelectComponent
									name="vendor"
									label="Vendor"
									control={control}
									required
									options={miniVendors?.list?.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniVendors?.loading}
									onChange={(val) => {
										dispatch(setStateValue(val?.value));
									}}
									selectParams={{
										page: miniVendors?.miniParams?.page,
										page_size:
											miniVendors?.miniParams?.page_size,
										search: miniVendors?.miniParams?.search,
										no_of_pages:
											miniVendors?.miniParams
												?.no_of_pages,
									}}
									hasMore={
										miniVendors?.miniParams?.page <
										miniVendors?.miniParams?.no_of_pages
									}
									fetchapi={getMiniVendors}
									clearData={clearMiniVendors}
								/>
							</Grid>
							<DialogActions sx={{ p: 2 }}>
								<Button
									onClick={closeModal}
									variant="outlined"
									color="secondary">
									Cancel
								</Button>
								{!selectedData?.id ? (
									<Button
										variant="contained"
										type="submit"
										color="primary"
										autoFocus>
										Submit
									</Button>
								) : (
									<Button
										variant="contained"
										type="submit"
										color="primary"
										autoFocus>
										Update
									</Button>
								)}
							</DialogActions>
						</form>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};
export default AddVendorItemMasters;
