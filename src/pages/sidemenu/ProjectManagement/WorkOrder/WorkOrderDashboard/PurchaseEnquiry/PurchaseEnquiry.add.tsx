import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Dialog,
	Divider,
	FormControl,
	FormLabel,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Paper,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
	CheckboxInput,
	ComponentContainerCard,
	CustomDatepicker,
	FormInput,
	PasswordInput,
	SelectInput,
} from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import Swal from "sweetalert2";
import { LuBook, LuDelete, LuEye, LuPlus, LuSave } from "react-icons/lu";
import {
	clearMiniBaseUnits,
	clearMiniEnquiry,
	clearMiniItems,
	clearMiniMake,
	clearMiniPurchaseIndent,
	clearMiniUnits,
	clearMiniVendors,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniBaseUnits,
	getMiniEnquiry,
	getMiniItems,
	getMiniMake,
	getMiniPurchaseIndent,
	getMiniUnits,
	getMiniVendor,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	clearVendorsAganistItems,
	isVendorsModalOpen,
	selectEnquiry,
	setSelectedData,
	updatePIItems,
	updatePurchaseEnquiryState,
	usePurchaseEnquiryActions,
} from "@src/store/sidemenu/project_management/purchaseEnquiry/purchase_enquiry.slice";
import ReadMore from "@src/components/ReadMoreText";
import TextArea from "@src/components/form/TextArea";
import {
	editPurchaseEnquiry,
	getVendorsByItems,
	postPurchaseEnquiry,
	getPurchaseEnquiryById,
} from "@src/store/sidemenu/project_management/purchaseEnquiry/purchase_enquiry.action";
import VendorModal from "./vendorModal";
import { v4 as uuidv4 } from "uuid";
import { updateSidenav } from "@src/store/customise/customise";
import {
	getPurchaseIndentById,
	getPurchaseIndentItems,
} from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.action";
import { PurchaseIndent } from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.types";
import PIItemsModal from "./Components/PIItemsModal";
import { PurchaseEnquiryState } from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.types";
import { clearPurchaseIndentItems } from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.slice";
import {
	PEIPIIS,
	PQItem,
} from "@src/store/sidemenu/project_management/purchaseEnquiry/purchase_enquiry.types";
import { addParams } from "@src/helpers/Helper";

const AddItemForm = ({ control, handleSubmit, reset, getValues }: any) => {
	const dispatch = useAppDispatch();
	const { updateState, updatePiItems, setShowAddItem } =
		usePurchaseEnquiryActions();
	const {
		purchaseEnquiry,
		purchaseEnquiry: {
			selectedData,
			piItemModalOpen,
			selectedPIitems,
			pageParams,
			showAddItem,
		},
		purchaseIndent: { purchase_indent_items },
		mini: { miniItemsList, miniMake, miniVendors, miniBaseUnit, miniUnits },
	} = useAppSelector((state) => selectEnquiry(state));

	const { id, projectId } = useParams();

	const addItem = (payload: PEIPIIS[]) => {
		const addNewItem = (e: PEIPIIS) => ({
			...e,
			unit: {
				...e.pi_item?.unit,
				label: e.pi_item?.unit?.name || "",
				value: e.pi_item?.unit?.id || "",
			},
			description: e.pi_item?.description || "",
			quantity: e.pi_item?.qty || 0,
			make: {
				...e.pi_item?.make,
				label: e.pi_item?.make?.name || "",
				value: e.pi_item?.make?.id || "",
			},
			item: {
				...e.pi_item?.item,
				label: e.pi_item?.item?.name || "",
				value: e.pi_item?.item?.id || "",
			},
			date: e.pi_item?.date || "",
			vendor: [],
			dodelete: false,
			peipiis:
				selectedPIitems?.filter(
					(f) => f.pi_item?.item?.id === e.pi_item?.item?.id
				) || [],
		});

		const updatedItems: any = [...(selectedData?.pqitems || [])]; // Preserve previous data

		payload.forEach((item) => {
			const existingIndex = updatedItems.findIndex(
				(e: any) =>
					e?.item?.value === item.pi_item?.item?.id &&
					// e?.make?.value === item.pi_item?.make?.id &&
					e?.unit?.value === item.pi_item?.unit?.id
			);
			if (existingIndex !== -1) {
				// Update the existing item
				// updatedItems[existingIndex] = {
				// 	...updatedItems[existingIndex],
				// 	...addNewItem(item),
				// 	quantity: item.pi_item?.qty,
				// 	peipiis: [
				// 		...updatedItems[existingIndex].peipiis, // Preserve existing peipiis
				// 		{
				// 			...item,
				// 		},
				// ...payload.filter(
				// 	(f) =>
				// 		f.pi_item?.item?.id ===
				// 			item.pi_item?.item?.id &&
				// 		f.pi_item?.make?.id ===
				// 			item.pi_item?.make?.id &&
				// 		f.pi_item?.unit?.id === item.pi_item?.unit?.id
				// ),
				// 	],
				// };
				Swal.fire({
					title: `<p style="font-size:20px">Inconsistent Unit</p>`,
					text: "You cannot select items with different units for the same item.",
					icon: "warning",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			} else {
				// Add a new item
				updatedItems.push(addNewItem(item));
			}
		});

		dispatch(
			setSelectedData({
				...selectedData,
				pqitems: updatedItems,
			})
		);
		dispatch(updatePiItems([]));
	};

	const handleAddItem = (payload: any) => {
		const findItem: any = selectedData?.pqitems
			?.filter((e) => !e?.dodelete)
			?.find(
				(item: any) =>
					item?.item?.value == payload?.item?.value &&
					// item?.make?.value == payload?.make?.value &&
					item?.unit?.value == payload?.unit?.value
			);

		const data = {
			...payload,
			uuid: uuidv4(),
			dodelete: false,
			peipiis: [
				{
					...payload,
					pi_item: {
						item: {
							...payload?.item,
							id: payload?.item?.value,
							name: payload?.item?.label,
						},
						make: {
							...payload?.make,
							id: payload?.make?.value,
							name: payload?.make?.label,
						},
					},
					quantity: payload?.quantity,
					dodelete: false,
				},
			],
		};

		const addData = () => {
			dispatch(
				setSelectedData({
					...selectedData,
					pqitems: [
						...(selectedData?.pqitems || []), // Ensure pqitems is an array
						{
							...data,
						},
					],
				})
			);
		};

		if (findItem) {
			// Check for conflicting units for the same item ID
			const selectedPIitems = selectedData?.pqitems;
			// const conflictingUnits = selectedPIitems
			// 	?.filter((e) => !e.dodelete)
			// 	.some(
			// 		(spii) =>
			// 			spii?.item?.id === payload?.item?.value && // Same item ID
			// 			spii?.make?.id === payload?.make?.value && // Same item ID
			// 			spii?.unit?.id === payload?.unit?.value // Different units
			// 	);
			// if (conflictingUnits) {
			// 	// Show warning for conflicting units
			// 	console.log("Conflicting units detected.");
			Swal.fire({
				title: `<p style="font-size:20px">Inconsistent Unit</p>`,
				text: "You cannot select items with different units for the same item.",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
			// 	return; // Exit after showing warning
			// }

			// const map = selectedPIitems?.map((e) => {
			// 	if (
			// 		e.item?.value === payload.item?.value &&
			// 		// e.make?.value === payload.make?.value &&
			// 		e.unit?.value === payload.unit?.value
			// 	) {
			// 		return {
			// 			...e,
			// 			...data,
			// 			peipiis: [
			// 				...e.peipiis,
			// 				{
			// 					...payload,
			// 					pi_item: {
			// 						item: {
			// 							...payload?.item,
			// 							id: payload?.item?.value,
			// 							name: payload?.item?.label,
			// 						},
			// 						make: {
			// 							...payload?.make,
			// 							id: payload?.make?.value,
			// 							name: payload?.make?.label,
			// 						},
			// 					},
			// 					quantity: payload?.quantity,
			// 					dodelete: false,
			// 				},
			// 			],
			// 		};
			// 	}
			// 	return e;
			// });
			// dispatch(
			// 	setSelectedData({
			// 		...selectedData,
			// 		pqitems: map,
			// 	})
			// );
			console.log("findItem", findItem);
		} else {
			addData();
		}
		reset({
			item: null,
			make: null,
			date: null,
			quantity: "",
			description: "",
			vendor: [],
			unit: null,
		});
		setShowAddItem(false);
	};

	const getValuesItem = getValues("item");

	const hide = () => {
		dispatch(
			updatePurchaseEnquiryState({
				piItemModalOpen: false,
			})
		);
		dispatch(
			clearPurchaseIndentItems({
				piItemModalOpen: false,
			})
		);
		// dispatch(setPiItemModalOpen(false));
		// dispatchTenderState("selectedData", {});
	};

	const piItemModal = (
		<PIItemsModal
			open={piItemModalOpen}
			hide={hide}
			selectedPIitems={selectedPIitems}
			setSelectedData={setSelectedData}
			selectedData={selectedData}
			updatePiItems={updatePiItems}
			handleAddItem={addItem}
			usedItems={selectedData?.pqitems
				?.filter((e) => !e?.dodelete)
				?.flatMap((e) => e?.peipiis)}
		/>
	);

	// const itemList = miniItemsList.list?.filter((val: { id: string; name: string }) =>
	// 	!selectedData?.pqitems?.some((e) => {
	// 		if (e.item?.id == val?.id) {
	// 			return val;
	// 		}
	// 	})
	// )

	return (
		<Box mt={2}>
			{piItemModal}
			<Card>
				<CardHeader
					sx={{
						p: 0,
						px: 2,
					}}
					title={
						<Box
							display="flex"
							// justifyContent="space-between"
							alignItems={"center"}
							gap={1}
							p={0}>
							{/* <Typography>Purchase Enquiry Items</Typography> */}
							<Button
								// disabled={!getValuesItem?.value}
								variant="contained"
								size="large"
								onClick={() => {
									updateState({
										...purchaseEnquiry,
										showAddItem: !showAddItem,
									});
									if (!showAddItem) {
										reset({
											item: null,
											make: null,
											date: null,
											quantity: "",
											description: "",
											vendor: [],
											unit: null,
										});
									}
									// dispatch(
									// 	updatePurchaseEnquiryState({
									// 		piItemModalOpen: true,
									// 	})
									// );
									// dispatch(
									// 	getPurchaseIndentItems({
									// 		...purchase_indent_items.miniParams,
									// 		page: 1,
									// 		page_size: 10,
									// 		search: "",
									// 		purchaseindent__project: projectId
									// 			? projectId
									// 			: "",
									// 		// item: getValuesItem?.value,
									// 	})
									// );
								}}>
								<Stack
									spacing={1}
									direction={"row"}
									alignItems={"center"}>
									<LuPlus />{" "}
									<Typography>
										{showAddItem
											? "Hide Add Item"
											: "Show Add Item"}
									</Typography>
								</Stack>
							</Button>
							<Button
								// disabled={!getValuesItem?.value}
								variant="contained"
								startIcon={<LuPlus />}
								size="large"
								onClick={() => {
									dispatch(
										getPurchaseIndentItems({
											...purchase_indent_items.miniParams,
											page: 1,
											page_size: 10,
											search: "",
											purchaseindent__project: projectId
												? projectId
												: "",
											// item: getValuesItem?.value,
										})
									);
									dispatch(
										updatePurchaseEnquiryState({
											piItemModalOpen: true,
										})
									);
								}}>
								Link PI Items
							</Button>
						</Box>
					}></CardHeader>
				<Divider
					sx={{
						mt: 1,
						borderColor: "#f3f3f3",
					}}
				/>
				{showAddItem && (
					<CardContent>
						<form action="" onSubmit={handleSubmit(handleAddItem)}>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<SelectComponent
										name="item"
										label="Item"
										control={control}
										rules={{ required: true }}
										options={miniItemsList.list}
										onChange={(value) => {
											reset({
												item: value,
												make: null,
												date: null,
												quantity: "",
												description: "",
												vendor: [],
												unit: null,
											});
										}}
										loading={miniItemsList.loading}
										selectParams={{
											page: miniItemsList.miniParams.page,
											page_size:
												miniItemsList.miniParams
													.page_size,
											search: miniItemsList.miniParams
												.search,
											no_of_pages:
												miniItemsList.miniParams
													.no_of_pages,
										}}
										hasMore={
											miniItemsList.miniParams.page <
											miniItemsList.miniParams.no_of_pages
										}
										fetchapi={getMiniItems}
										clearData={clearMiniItems}
									/>
								</Grid>
								{/* <Grid mt={3.3}>
								<Button size="large">
									<Stack
										spacing={1}
										direction={"row"}
										alignItems={"center"}>
										<LuPlus />{" "}
										<Typography>
											Link PI Items To This Item
										</Typography>
									</Stack>
								</Button>
							</Grid> */}
								{/* <Grid size={{ xs: 12 }}>
								<Grid container spacing={2}> */}
								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<SelectComponent
										name="make"
										label="Make"
										control={control}
										disabled={getValuesItem ? false : true}
										rules={{ required: true }}
										options={miniMake.list.map(
											(e: {
												id: string | number;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										loading={miniMake.loading}
										helperText={
											getValuesItem
												? ""
												: "Select an item to see make"
										}
										selectParams={{
											page: miniMake.miniParams.page,
											page_size:
												miniMake.miniParams.page_size,
											search: miniMake.miniParams.search,
											no_of_pages:
												miniMake.miniParams.no_of_pages,
											products__id: getValuesItem?.value,
										}}
										hasMore={
											miniMake.miniParams.page <
											miniMake.miniParams.no_of_pages
										}
										fetchapi={getMiniMake}
										clearData={clearMiniMake}
									/>
								</Grid>

								{/* <Grid size={{ xs: 12, md: 6, lg: 2 }}>
						<Stack width={"100%"}>
							<CustomDatepicker
								control={control}
								name="date"
								hideAddon
								dateFormat="DD-MM-YYYY"
								showTimeSelect={false}
								timeFormat="h:mm a"
								timeCaption="time"
								inputClass="form-input"
								label={"Date & Time"}
								tI={1}
							/>
						</Stack>
					</Grid> */}

								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<FormInput
										name="quantity"
										label="Quantity"
										type="number"
										placeholder="Enter quantity here..."
										control={control}
									/>
								</Grid>

								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<SelectComponent
										name="unit"
										label="Unit"
										control={control}
										disabled={getValuesItem ? false : true}
										rules={{ required: true }}
										options={miniUnits.list.map(
											(e: {
												id: string | number;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										loading={miniUnits.loading}
										helperText={
											getValuesItem
												? ""
												: "Select an item to see unit"
										}
										selectParams={{
											page: miniUnits.miniParams.page,
											page_size:
												miniUnits.miniParams.page_size,
											search: miniUnits.miniParams.search,
											no_of_pages:
												miniUnits.miniParams
													.no_of_pages,
											item: getValuesItem?.value,
										}}
										hasMore={
											miniUnits.miniParams.page <
											miniUnits.miniParams.no_of_pages
										}
										fetchapi={getMiniUnits}
										clearData={clearMiniUnits}
									/>
								</Grid>

								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<TextArea
										name="description"
										label="Description"
										type="text"
										placeholder="Write Description here..."
										minRows={3}
										maxRows={5}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
									/>
								</Grid>
								{/* </Grid>
							</Grid> */}

								<Grid mt={3.3}>
									{/* <Button
									disabled={!getValuesItem?.value}
									variant="contained"
									size="large"
									onClick={() => {
										dispatch(
											updatePurchaseEnquiryState({
												piItemModalOpen: true,
											})
										);
										dispatch(
											getPurchaseIndentItems({
												...purchase_indent_items.miniParams,
												page: 1,
												page_size: 10,
												search: "",
												purchaseindent__project:
													projectId ? projectId : "",
												item: getValuesItem?.value,
											})
										);
									}}>
									<Stack
										spacing={1}
										direction={"row"}
										alignItems={"center"}>
										<LuPlus />{" "}
										<Typography>Link PI Items</Typography>
									</Stack>
								</Button> */}
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={5.5}>
									<Button
										color="primary"
										type="submit"
										variant="contained"
										size="large">
										Add Item
									</Button>
								</Grid>
							</Grid>
						</form>
					</CardContent>
				)}
			</Card>
		</Box>
	);
};

const PurchaseEnquiryForm = ({
	onSave,
	handleSubmit,
	control,
}: {
	onSave: (value: any) => void;
	handleSubmit: any;
	control: Control<any>;
}) => {
	const dispatch = useAppDispatch();
	const {
		purchaseEnquiry: { selectedData, pageParams },
	} = useAppSelector((state) => selectEnquiry(state));
	const navigate = useNavigate();
	const { id, projectId } = useParams();
	return (
		<Grid size={{ xs: 12 }}>
			<form style={{ width: "100%" }} onSubmit={handleSubmit(onSave)}>
				<Box p={1}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 12, md: 6, xl: 3 }}>
							<Stack width={"100%"}>
								<CustomDatepicker
									control={control}
									name="required_date"
									hideAddon
									dateFormat="DD-MM-YYYY"
									showTimeSelect={false}
									minDate={new Date()}
									timeFormat="h:mm a"
									timeCaption="time"
									inputClass="form-input"
									label={"Date"}
									tI={1}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<TextArea
								name="description1"
								label="Description"
								type="text"
								placeholder="Write Description here..."
								minRows={3}
								maxRows={5}
								containerSx={{
									display: "grid",
									gap: 1,
								}}
								control={control}
							/>
						</Grid>
					</Grid>
				</Box>
			</form>
		</Grid>
	);
};

const AddPurchaseEnquiry = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const [vendorDailouge, setVendorDailouge] = useState("");
	const {
		mini: { miniVendors },
		purchaseEnquiry: {
			selectedData,
			pageParams,
			vendorsAganistItems,
			selectedPIitems,
		},
	} = useAppSelector((state) => selectEnquiry(state));
	function clearDataFn() {
		dispatch(setSelectedData({}));
		dispatch(updatePIItems([]));
	}

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		clearDataFn();
	}, []);

	useEffect(() => {
		if (id !== "0") {
			dispatch(getPurchaseEnquiryById({ id: id ? id : "" }));
		}
	}, [id]);

	const enquirySchema = yup.object().shape({
		required_date: yup.string().required("Please enter Required date"),
		description1: yup.string().required("Please enter Description"), // Limit the description length
	});

	const {
		control,
		handleSubmit,
		reset: enquriyReset,
		setValue: setEnquiryValue,
	} = useForm<any>({
		resolver: yupResolver(enquirySchema),
	});

	useEffect(() => {
		id != "0" &&
			enquriyReset({
				required_date: selectedData?.required_date
					? moment(
							selectedData.required_date,
							"YYYY-MM-DD"
						).toISOString()
					: "",
				description1: selectedData?.description
					? selectedData.description
					: "",
				vendor: selectedData?.vendors
					? selectedData?.vendors?.map((e) => {
							return {
								label: e.label,
								value: e.value,
							};
						})
					: [],
			});
	}, [selectedData]);

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Item",
			width: 100,
		},
		// {
		// 	title: "Vendors",
		// 	width: 100,
		// },
		{
			title: "Make",
			width: 100,
		},
		// {
		// 	title: "Date & Time",
		// 	width: 100,
		// },
		{
			title: "Quantity",
			width: 100,
		},
		{
			title: "Unit",
			width: 100,
		},
		{
			title: "Description",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		item_name: string,
		// vendors: React.JSX.Element,
		make: string,
		// date: string,
		quantity: string | number,
		unit: string | number,
		description: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			item_name,
			// vendors,
			make,
			// date,
			quantity,
			unit,
			description,
			actions,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.pqitems
			?.filter((e) => !e?.dodelete)
			?.map((row: any, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const description = (
					<ReadMore
						text={row?.description ? row?.description : ""}
						maxLength={30}
					/>
				);

				// const vendors = (
				// 	<IconButton
				// 		color="primary"
				// 		onClick={() =>
				// 			dispatch(
				// 				isVendorsModalOpen({
				// 					open: true,
				// 					item: row?.item,
				// 					vendors: row?.vendor,
				// 				})
				// 			)
				// 		}>
				// 		<LuEye />
				// 	</IconButton>
				// );

				const actions = (
					<Box
						sx={{
							display: "flex",
							gap: 2,
							justifyContent: "center",
						}}>
						<LuDelete
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={() => {
								const fiteredItems = selectedData?.pqitems?.map(
									(e: PQItem) => {
										if (
											e.item.value == row?.item?.value &&
											e?.unit?.value ==
												row?.unit?.value &&
											e?.make?.value == row?.make?.value
										) {
											return {
												...e,
												dodelete: true,
												peipiis: e.peipiis.map(
													(f: PEIPIIS) => {
														return {
															...f,
															dodelete: true,
														};
													}
												),
											};
										}
										return e;
									}
								);
								dispatch(
									setSelectedData({
										...selectedData,
										pqitems: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);
				const sum_qty_peipiis = row?.peipiis
					?.filter((peipii: PEIPIIS) => !peipii.dodelete)
					?.reduce(
						(acc: number, value: PEIPIIS) => acc + +value.quantity,
						0
					);
				return createData(
					index,
					row?.item?.label,
					// vendors,
					row?.make?.label,
					// moment(row.date).format("LLL"),
					sum_qty_peipiis ? sum_qty_peipiis : row?.quantity,
					row?.unit?.label,
					description,
					actions
				);
			});
	}, [selectedData?.pqitems, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		// dispatch(
		// 	getTenders({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getTenders({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};

	// add item form
	const itemSchema = yup.object().shape({
		item: yup
			.object({
				label: yup.string().required("Please select a item"),
				value: yup.string().required("Please select a item"),
			})
			.required("Please select a item"),
		make: yup
			.object({
				label: yup.string().required("Please select a make"),
				value: yup.string().required("Please select a make"),
			})
			.required("Please select a make")
			.nullable(),
		// date: yup.string().required("Please enter Required date"),
		quantity: yup
			.number()
			.required("Please enter quantity")
			.positive("Quantity must be greater than zero")
			.typeError("Quantity is required"),
		description: yup.string().required("Please enter a description"),
		unit: yup.object({
			label: yup.string().required("Please select a unit"),
			value: yup.string().required("Please select a unit"),
		}),
	});

	const {
		control: addItemController,
		handleSubmit: handleItemSubmit,
		getValues: getValuesItem,
		reset,
	} = useForm<any>({
		resolver: yupResolver(itemSchema),
	});

	const onSave = (payload: any) => {
		const findItem: any = selectedData?.pqitems?.filter(
			(item) => !item.dodelete
		);

		if (findItem?.length != 0) {
			const pqitems = selectedData?.pqitems?.map((item) => {
				const peipiis = item?.peipiis
					?.filter((item) => item.p_indent)
					.map((e) => {
						const a = {
							id: e?.id,
							quantity: e?.quantity,
							unit_id: e?.unit?.id,
							p_indent_id: e.p_indent,
							pi_item_id: e.pi_item?.id,
							dodelete: e.dodelete,
						};
						const seriliesd = addParams(a);

						console.log(seriliesd);
						return seriliesd;
					});
				const alpha = {
					id: item?.id,
					item_id: item.item.value,
					make_id: item?.make?.value,
					// date: moment(item.date).format(
					// 	"YYYY-MM-DD."
					// ),
					unit_id: item?.unit?.value ? item.unit.value : "",
					quantity: item?.peipiis?.reduce(
						(acc: number, value: PEIPIIS) =>
							parseInt(`${acc}`) + parseInt(`${value.quantity}`),
						0
					),
					description: item.description,
					peipiis: peipiis,
					dodelete: item?.dodelete,
				};
				const alphaSeriliesd = addParams(alpha);
				return alphaSeriliesd;
			});
			const data = {
				...selectedData,
				project_id: projectId ? projectId : "",
				vendor_ids: payload?.vendor?.map(
					(vendor: { value: string; label: string }) => vendor.value
				),
				required_date: moment(payload.required_date).format(
					"YYYY-MM-DD"
				),
				description: payload.description1,
				rfqstatus: 1,
				pqitems: pqitems,
			};
			const serilizedData = addParams(data);

			id == "0"
				? dispatch(
						postPurchaseEnquiry({
							data: serilizedData,
							params: {
								...pageParams,
								project_id: projectId ? projectId : "",
							},
							enquriyReset,
							navigate,
						})
					)
				: dispatch(
						editPurchaseEnquiry({
							id: id ? id : "",
							data: serilizedData,
							params: {
								...pageParams,
								project_id: projectId ? projectId : "",
							},
							enquriyReset,
							navigate,
						})
					);
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">No Purchase Quotation Item</p>`,
				text: "Please add atleast one Purchase Quotation item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	const activePqItems = selectedData?.pqitems?.filter((e) => !e?.dodelete);

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Enquiry`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card>
					<CardContent>
						<PurchaseEnquiryForm
							onSave={onSave}
							handleSubmit={handleSubmit}
							control={control}
						/>
						<Divider />
						<AddItemForm
							control={addItemController}
							handleSubmit={handleItemSubmit}
							reset={reset}
							getValues={getValuesItem}
						/>
						{/* <AddIndentForm
							control={addItemController}
							handleSubmit={handleItemSubmit}
							reset={reset}
							getValues={getValuesItem}
						/> */}
						<Box mt={2}>
							<TableComponent
								count={selectedData?.pqitems?.length ?? 0}
								columns={columns}
								rows={rows ? rows : []}
								loading={false}
								containerHeight={440}
								page={
									selectedData?.pqitems_pageParams?.page
										? selectedData?.pqitems_pageParams?.page
										: 1
								}
								pageSize={
									selectedData?.pqitems_pageParams?.page_size
										? selectedData?.pqitems_pageParams
												?.page_size
										: 10
								}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
								showPagination={false}
							/>

							<Grid size={{ xs: 12 }}>
								<Box mt={2}>
									<Stack
										direction="row"
										alignItems="center"
										justifyItems="flex-end"
										spacing={2}>
										<Box flex={1}>
											<Stack
												direction={"row"}
												spacing={1}
												alignItems="baseline">
												<InputLabel
													style={{
														fontWeight: "medium",
													}}>
													Vendors :
												</InputLabel>
												<Box flex={1}>
													<SelectComponent
														name="vendor"
														disabled={
															// selectedData &&
															!activePqItems
																? true
																: false
														}
														helperText={
															// selectedData &&
															!activePqItems
																? "Add atleast one item to select vendors.."
																: ""
														}
														label=""
														dropDownPositoning="relative"
														control={control}
														rules={{
															required: true,
														}}
														multiple={true}
														options={vendorsAganistItems?.list?.map(
															(e: {
																id:
																	| string
																	| number;
																name: string;
															}) => ({
																id: e.id,
																name: e.name,
															})
														)}
														loading={
															vendorsAganistItems?.loading
														}
														selectParams={{
															page: vendorsAganistItems
																.miniParams
																.page,
															page_size:
																vendorsAganistItems
																	.miniParams
																	.page_size,
															search: vendorsAganistItems
																.miniParams
																.search,
															no_of_pages:
																vendorsAganistItems
																	.miniParams
																	.no_of_pages,
															item_ids:
																activePqItems?.map(
																	(e) =>
																		e?.item
																			?.value
																),
														}}
														hasMore={
															vendorsAganistItems
																.miniParams
																.page <
															vendorsAganistItems
																.miniParams
																.no_of_pages
														}
														fetchapi={
															getVendorsByItems
														}
														clearData={
															clearVendorsAganistItems
														}
													/>
												</Box>
												<Box>
													<Button
														color="success"
														type="submit"
														onClick={handleSubmit(
															onSave
														)}
														variant="contained"
														size="large">
														<LuSave
															size={18}
															style={{
																marginRight:
																	"6px",
															}}
														/>{" "}
														Save Purchase Enquiry
													</Button>
												</Box>
											</Stack>
										</Box>
									</Stack>
								</Box>
							</Grid>
						</Box>
					</CardContent>
					<VendorModal />
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddPurchaseEnquiry;
