import { yupResolver } from "@hookform/resolvers/yup";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Checkbox,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	ListItemAvatar,
	Stack,
	styled,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import { selectIndent } from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.slice";
import {
	PiItem,
	PurchaseIndent,
	PurchaseIndentState,
} from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.types";
import { TendersInitialState } from "@src/store/sidemenu/tender_mangement/tenders/tenders.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { SyntheticEvent, useEffect } from "react";
import { Control, useForm } from "react-hook-form";
import {
	LuCalendar,
	LuListChecks,
	LuMessageSquare,
	LuSearch,
	LuX,
} from "react-icons/lu";
import * as yup from "yup";
import {
	HourglassEmpty,
	Inventory2 as InventoryIcon,
} from "@mui/icons-material";
import ReadMore from "@src/components/ReadMoreText";
import { getPurchaseIndentItems } from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.action";
import TopComponent from "@src/pages/settings/TopComponent";
import {
	PEIPIIS,
	PurchaseEnquiryState,
} from "@src/store/sidemenu/project_management/purchaseEnquiry/purchase_enquiry.types";
import { id } from "date-fns/locale";
import Swal from "sweetalert2";

interface Props {
	open: boolean;
	hide: () => void;
	selectedPIitems: PurchaseEnquiryState["selectedPIitems"];
	updatePiItems: (payload: PurchaseEnquiryState["selectedPIitems"]) => void;
	handleAddItem: (payload: any) => void;
	setSelectedData: any;
	selectedData: any;
	usedItems?: PEIPIIS[];
}

const ItemDetails = styled(Box)({
	display: "flex",
	flexDirection: "column",
	gap: "8px",
});

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "500px",
	marginTop: "15px",
	overflowY: "auto",
	padding: "0 8px",
	"&::-webkit-scrollbar": {
		width: "8px",
	},
	"&::-webkit-scrollbar-thumb": {
		backgroundColor: theme.palette.primary.main,
		borderRadius: "8px",
	},
}));

const Indent = ({
	indent,
	selectIndentItem,
	classname,
	selectedPIitems,
}: {
	indent: PiItem;
	classname: string;
	selectIndentItem: (indent: PiItem) => void;
	selectedPIitems: PurchaseEnquiryState["selectedPIitems"];
}) => {
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
			<Checkbox
				id={`indent-${indent.id}`}
				checked={
					!!selectedPIitems?.find(
						(e) =>
							e?.pi_item?.id == indent.id &&
							// e?.pi_item?.make?.id == indent?.make?.id &&
							e?.pi_item?.unit?.id == indent?.unit?.id
					)
						? true
						: false
				}
				onChange={(event) => selectIndentItem(indent)}
			/>
			<Card
				variant="outlined"
				sx={{ mb: 1, borderRadius: 2, boxShadow: 1, width: "100%" }}>
				<CardHeader
					avatar={
						<Avatar
							src={indent?.item?.image || ""}
							alt={indent?.item?.name}>
							{indent?.item?.name.charAt(0)}
						</Avatar>
					}
					title={
						<Stack spacing={1}>
							<Typography variant="h6">
								<Tooltip title="Purchase Indent Item Code">
									<Chip
										label={indent?.code}
										color="primary"
										size="small"
									/>
								</Tooltip>
							</Typography>

							<Typography variant="h6">
								Item Name: {indent?.item?.name}
							</Typography>
						</Stack>
					}
					subheader={
						<Typography variant="body2" color="textSecondary">
							<ReadMore
								text={
									indent?.description
										? indent.description
										: ""
								}
								maxLength={30}
							/>
						</Typography>
					}
					action={
						<Tooltip title="Purchase Indent Code">
							<Chip
								label={indent?.purchaseindent_code}
								color="success"
								size="small"
							/>
						</Tooltip>
					}
				/>
				<CardContent>
					<ItemDetails>
						<Box display="flex" alignItems="center" gap={1}>
							<InventoryIcon color="action" />
							<Typography variant="body1" fontWeight="500">
								Quantity: {indent.qty} {indent?.unit?.name}
							</Typography>
							<Typography
								variant="body2"
								color="textSecondary"
								ml={2}>
								(Original: {indent.originalqty})
							</Typography>
						</Box>
						<Box>
							<Typography variant="body2" color="textSecondary">
								Make: <strong>{indent.make.name}</strong>
							</Typography>
						</Box>
						<Typography
							variant="caption"
							color="textSecondary"
							mt={1}>
							Created on: {indent.created_on}
						</Typography>
					</ItemDetails>
				</CardContent>
			</Card>
		</Box>
	);
};

const PIItemsModal = ({
	open,
	hide,
	selectedPIitems,
	updatePiItems,
	handleAddItem,
	setSelectedData,
	usedItems,
	selectedData,
}: Props) => {
	const dispatch = useAppDispatch();

	const {
		purchaseIndent: { purchase_indent_items },
	} = useAppSelector((state) => selectIndent(state));

	const handleAdd = (values: {
		assign_to: {
			label: string;
			value: string;
		};
	}) => {
		const data = {
			assign_to_id: values?.assign_to?.value,
		};
	};

	const selectIndentItem = (pii: PiItem) => {
		const addNewItem = () => {
			updatePiItems([
				...(selectedPIitems || []), // Ensure the array is defined
				{
					id: "",
					pi_item: pii,
					quantity: pii?.qty,
					originalqty: pii?.originalqty,
					unit: pii?.unit,
					p_indent: pii?.purchaseindent || "",
					dodelete: false,
				},
			]);
		};

		// Check if the item already exists with the same id, make, and unit
		const findpii = selectedPIitems?.find(
			(spii) => spii?.pi_item?.id === pii?.id
		);

		if (findpii) {
			// Remove the existing item

			const updatedItems = selectedPIitems?.filter(
				(spii) => !(spii?.pi_item?.id === pii?.id)
			);
			updatePiItems(updatedItems || []);
			return; // Exit after removing
		}

		// Check for conflicting units for the same item ID
		const conflictingUnits = selectedPIitems?.some(
			(spii) =>
				spii?.pi_item?.item?.id === pii?.item?.id && // Same item ID
				// spii?.pi_item?.make?.id === pii?.make?.id && // Same item ID
				spii?.pi_item?.unit?.id === pii?.unit?.id // Different units
		);

		if (conflictingUnits) {
			// Show warning for conflicting units

			Swal.fire({
				target: document.getElementById("item_modal"),
				title: `<p style="font-size:20px">Inconsistent Unit</p>`,
				text: "You cannot select items with different units for the same item.",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			return; // Exit after showing warning
		}

		// Add the new item if no conflicts are found

		addNewItem();
	};

	let searchSchema = yup.object({
		search: yup.string(),
	});

	const { control, handleSubmit, register, getValues, setValue } = useForm({
		resolver: yupResolver(searchSchema),
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getPurchaseIndentItems({
				...purchase_indent_items.miniParams,
				page: 1,
				page_size: 10,
				search: search ? search : "",
			})
		);
	};

	const un_used_pitems = purchase_indent_items?.list?.filter(
		(e) => !usedItems?.some((item) => item?.pi_item?.id == e.id)
	);

	useEffect(() => {
		return () => setValue("search", "");
	}, []);
	return (
		<Dialog
			open={open}
			onClose={hide}
			sx={{
				"& .MuiDialog-paper": {
					width: "800px",
					zIndex: "0",
				},
			}}
			id={"item_modal"}
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
				{"Link Purchase Indent Items"}
				<IconButton onClick={hide}>
					<LuX />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: "24px", pt: "12px !important", pb: 2 }}>
				<DialogContentText
					id="alert-dialog-description"
					sx={{
						width: "100%",
					}}>
					<Stack flex={1}>
						<form onSubmit={handleSubmit(handleSearch)}>
							<Stack direction="row" spacing={1} flex={1}>
								<TextField
									type="text"
									sx={{
										width: "100%",
									}}
									{...register("search")}
									id="input-with-icon-textfield"
									size="small"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<LuSearch size={20} />
											</InputAdornment>
										),
									}}
									variant="outlined"
									placeholder="Search"
								/>
								<Button
									variant="contained"
									type="submit"
									// disabled={searchValue ? false : true}
								>
									Search
								</Button>
							</Stack>
						</form>
					</Stack>
					<Card>
						<ScrollableList
							onScroll={(e: SyntheticEvent) => {
								const { target } = e as any;

								if (
									Math.ceil(
										target?.scrollTop + target?.offsetHeight
									) == target?.scrollHeight
								) {
									if (
										purchase_indent_items?.miniParams
											?.page <
										purchase_indent_items?.miniParams
											?.no_of_pages
									) {
										dispatch(
											getPurchaseIndentItems({
												...purchase_indent_items.miniParams,
												page:
													purchase_indent_items
														?.miniParams?.page + 1,
												page_size: 10,
												search: "",
											})
										);
									}
								}
							}}>
							{un_used_pitems?.map((indent, idx) => (
								<Indent
									selectIndentItem={selectIndentItem}
									indent={indent}
									key={idx}
									selectedPIitems={selectedPIitems}
									classname={
										idx ===
										purchase_indent_items.list.length - 1
											? ""
											: 'mb:"12px"'
									}
								/>
							))}
							{purchase_indent_items?.loading && (
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: "#f5f5f5",
										textAlign: "center",
									}}>
									<CircularProgress
										color="primary"
										size={30}
										thickness={4}
									/>
									<Typography
										variant="h6"
										color="textSecondary"
										sx={{ mt: 2 }}>
										Loading, please wait...
									</Typography>
								</Box>
							)}
							{un_used_pitems?.length === 0 && (
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										textAlign: "center",
										height: 200,
									}}>
									<HourglassEmpty
										sx={{
											fontSize: 30,
											color: "gray",
											mb: 2,
										}}
									/>
									<Typography
										variant="h6"
										color="textSecondary"
										sx={{ mb: 2 }}>
										No data available.
									</Typography>
								</Box>
							)}
						</ScrollableList>
					</Card>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					onClick={() => {
						hide();
					}}>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={() => {
						handleAddItem(selectedPIitems);
						hide();
					}}>
					Add Items
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PIItemsModal;
