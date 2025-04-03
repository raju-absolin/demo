import { yupResolver } from "@hookform/resolvers/yup";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import {
	isVendorsModalOpen,
	selectEnquiry,
	setSelectedData,
} from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React from "react";
import { useForm } from "react-hook-form";
import { LuTrash2, LuX } from "react-icons/lu";
import * as yup from "yup";

type Props = {};

const VendorModal = () => {
	const dispatch = useAppDispatch();
	const {
		purchaseEnquiry: { selectedData, vendorsModal, item, selectedVendors },
	} = useAppSelector((state) => selectEnquiry(state));

	const itemSchema = yup.object().shape({});

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(itemSchema),
	});

	const hide = () => {
		dispatch(
			isVendorsModalOpen({
				open: false,
				item_name: "",
				seletedVendors: [],
			})
		);
	};

	const handleAdd = () => {
		dispatch(
			setSelectedData({
				...selectedData,
				pqitems: selectedData?.pqitems?.map((e) => {
					if (e.item.value == item?.value) {
						return {
							...e,
							vendor: selectedVendors,
						};
					}
					return e;
				}),
			})
		);
		hide();
	};

	return (
		<Dialog open={vendorsModal} onClose={hide} maxWidth={"md"} fullWidth>
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
				Venders for {item?.label}
				<IconButton onClick={hide}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent dividers>
				<List dense={true}>
					{selectedVendors ? (
						selectedVendors.map((vendor) => {
							return (
								<>
									<ListItem
										secondaryAction={
											<IconButton
												edge="end"
												aria-label="delete"
												onClick={() => {
													const filteredVendors =
														selectedVendors.filter(
															(e) =>
																e?.value !=
																vendor?.value
														);

													dispatch(
														isVendorsModalOpen({
															open: true,
															item,
															seletedVendors:
																filteredVendors,
														})
													);
												}}>
												<LuTrash2 />
											</IconButton>
										}>
										{vendor.label}
									</ListItem>
									<Divider
										sx={{
											mt: 2,
										}}
									/>
								</>
							);
						})
					) : (
						<ListItem
							sx={{
								display: "flex",
								justifyContent: "center",
							}}>
							Empty Data
						</ListItem>
					)}
				</List>
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

export default VendorModal;
