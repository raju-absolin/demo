import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Card,
	CardContent,
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
import { LuBook, LuDelete, LuEye, LuSave } from "react-icons/lu";
import {
	clearMiniBaseUnits,
	clearMiniItems,
	clearMiniMake,
	clearMiniUnits,
	clearMiniVendors,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniBaseUnits,
	getMiniItems,
	getMiniMake,
	getMiniUnits,
	getMiniVendor,
} from "@src/store/mini/mini.Action";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	clearVendorsAganistItems,
	isVendorsModalOpen,
	selectEnquiry,
	setSelectedData,
} from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.slice";
import ReadMore from "@src/components/ReadMoreText";
import TextArea from "@src/components/form/TextArea";
import {
	editPurchaseEnquiry,
	getVendorsByItems,
	postPurchaseEnquiry,
} from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.action";
import { getPurchaseEnquiryById } from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.action";
import VendorModal from "./vendorModal";
import { v4 as uuidv4 } from "uuid";
import { updateSidenav } from "@src/store/customise/customise";

const AddItemForm = ({ control, handleSubmit, reset, getValues }: any) => {
	const dispatch = useAppDispatch();
	const {
		purchaseEnquiry: { selectedData },
		mini: { miniItemsList, miniMake, miniVendors, miniBaseUnit, miniUnits },
	} = useAppSelector((state) => selectEnquiry(state));

	const handleAddItem = (payload: any) => {
		const findItem: any = selectedData?.pqitems?.find(
			(item: any) =>
				item?.item?.value == payload?.item?.value &&
				item?.make?.value == payload?.make?.value &&
				item?.unit?.value == payload?.unit?.value
		);

		const addData = () => {
			const data = {
				...payload,
				uuid: uuidv4(),
				dodelete: false,
			};
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
			if (findItem?.dodelete) {
				addData();
			} else {
				Swal.fire({
					title: `<p style="font-size:20px">Item Exist</p>`,
					text: "Item with same Make and Unit already added.",
					icon: "warning",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}
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
	};

	const getValuesItem = getValues("item");

	return (
		<Box mt={2}>
			<form action="" onSubmit={handleSubmit(handleAddItem)}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
							name="item"
							label="Item"
							control={control}
							rules={{ required: true }}
							options={miniItemsList.list.map(
								(e: { id: string | number; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							loading={miniItemsList.loading}
							selectParams={{
								page: miniItemsList.miniParams.page,
								page_size: miniItemsList.miniParams.page_size,
								search: miniItemsList.miniParams.search,
								no_of_pages:
									miniItemsList.miniParams.no_of_pages,
							}}
							hasMore={
								miniItemsList.miniParams.page <
								miniItemsList.miniParams.no_of_pages
							}
							fetchapi={getMiniItems}
							clearData={clearMiniItems}
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
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="make"
							label="Make"
							control={control}
							required
							disabled={getValuesItem ? false : true}
							rules={{ required: true }}
							options={miniMake.list.map(
								(e: { id: string | number; name: string }) => ({
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
								page_size: miniMake.miniParams.page_size,
								search: miniMake.miniParams.search,
								no_of_pages: miniMake.miniParams.no_of_pages,
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
							required
							name="quantity"
							label="Quantity"
							type="number"
							placeholder="Enter quantity here..."
							control={control}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
							name="unit"
							label="Unit"
							control={control}
							disabled={getValuesItem ? false : true}
							rules={{ required: true }}
							options={miniUnits.list.map(
								(e: { id: string | number; name: string }) => ({
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
								page_size: miniUnits.miniParams.page_size,
								search: miniUnits.miniParams.search,
								no_of_pages: miniUnits.miniParams.no_of_pages,
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
							required
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
	const { id, tenderId } = useParams();

	return (
		<Grid size={{ xs: 12 }}>
			<form style={{ width: "100%" }} onSubmit={handleSubmit(onSave)}>
				<Box p={1}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 12, md: 6, xl: 3 }}>
							<Stack width={"100%"}>
								<CustomDatepicker
									required
									control={control}
									name="required_date"
									hideAddon
									dateFormat="DD-MM-YYYY"
									showTimeSelect={false}
									minDate={moment().toDate()}
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
								required
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
	const { id, tenderId } = useParams();
	const [vendorDailouge, setVendorDailouge] = useState("");
	const {
		tenders: { selectedData: tenderSelectedData },
		mini: { miniVendors },
		purchaseEnquiry: { selectedData, pageParams, vendorsAganistItems },
	} = useAppSelector((state) => selectEnquiry(state));
	function clearDataFn() {
		dispatch(setSelectedData({}));
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
		if (tenderId) {
			dispatch(getTenderById({ id: tenderId ? tenderId : "" }));
		}
	}, [tenderId]);

	useEffect(() => {
		if (id !== "0") {
			dispatch(getPurchaseEnquiryById({ id: id ? id : "" }));
		}
	}, [id]);

	const enquirySchema = yup.object().shape({
		required_date: yup.string().required("Please enter Required date"),
		description1: yup
			.string()
			.trim("Please enter Description")
			.required("Please enter Description"), // Limit the description length
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
		unit: string,
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
			?.filter((e) => !e.dodelete)
			?.map((row: any, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const description = (
					<ReadMore
						text={row.description ? row.description : ""}
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
						}}>
						<LuDelete
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={() => {
								const fiteredItems = selectedData.pqitems?.map(
									(e: any) => {
										if (e.item.value == row?.item?.value) {
											return {
												...e,
												dodelete: true,
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
				return createData(
					index,
					row?.item?.label,
					// vendors,
					row.make?.label,
					// moment(row.date).format("LLL"),
					row.quantity,
					row?.unit?.name,
					description,
					actions
				);
			});
	}, [selectedData, createData]);

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
		make: yup.object().optional().nullable(),
		// date: yup.string().required("Please enter Required date"),
		quantity: yup
			.number()
			.max(99999, "Quantity cannot exceed 5 digits") // Ensure only up to 5 digits
			.required("Please enter quantity")
			.typeError("Please enter a valid quantity"),
		description: yup
			.string()
			.trim("Please enter Description")
			.required("Please enter Description"),
		unit: yup.object({
			label: yup.string().required("Please select a  unit"),
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
			const data = {
				project_id: tenderSelectedData.project?.id,
				vendor_ids: payload?.vendor?.map(
					(vendor: { value: string; label: string }) => vendor.value
				),
				required_date: moment(payload.required_date).format(
					"YYYY-MM-DD"
				),
				description: payload.description1,
				rfqstatus: 1,
				pqitems:
					id == "0"
						? selectedData?.pqitems
								?.filter((item) => !item.dodelete)
								?.map((item) => {
									return {
										item_id: item.item.value,
										make_id: item?.make?.value,
										// date: moment(item.date).format(
										// 	"YYYY-MM-DD."
										// ),
										unit_id: item?.unit?.value
											? item.unit.value
											: "",
										quantity: item.quantity,
										description: item.description,
										dodelete: false,
									};
								})
						: selectedData?.pqitems?.map((item: any) => {
								return {
									id: item?.id,
									item_id: item.item.value,
									make_id: item.make.value,
									// date: moment(item.date).format(
									// 	"YYYY-MM-DD."
									// ),
									unit_id: item?.unit?.value
										? item.unit.value
										: "",
									quantity: item.quantity,
									description: item.description,
									dodelete: item.dodelete,
								};
							}),
			};

			id == "0"
				? dispatch(
						postPurchaseEnquiry({
							data,
							params: {
								...pageParams,
								project_id: tenderSelectedData.project?.id,
							},
							enquriyReset,
							navigate,
						})
					)
				: dispatch(
						editPurchaseEnquiry({
							id: id ? id : "",
							data,
							params: {
								...pageParams,
								project_id: tenderSelectedData.project?.id,
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

	const activePqItems = selectedData?.pqitems?.filter((e) => !e.dodelete);

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
						<Box mt={2}>
							<TableComponent
								count={selectedData?.pqitems?.length ?? 0}
								columns={columns}
								rows={rows ? rows : []}
								loading={false}
								containerHeight={440}
								page={
									// selectedData?.pqitems_pageParams?.page
									// 	? selectedData?.pqitems_pageParams?.page
									// 	:
									1
								}
								pageSize={
									// selectedData?.pqitems_pageParams?.page_size
									// 	? selectedData?.pqitems_pageParams
									// 		?.page_size
									// 	:
									10
								}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
								showPagination={false}
							/>

							{/* <Grid size={{ xs: 12 }}> */}
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
												required
												style={{
													fontWeight: "medium",
												}}>
												Vendors
											</InputLabel>
											:
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
													rules={{ required: true }}
													multiple={true}
													options={vendorsAganistItems?.list?.map(
														(e: {
															id: string | number;
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
															.miniParams.page,
														page_size:
															vendorsAganistItems
																.miniParams
																.page_size,
														search: vendorsAganistItems
															.miniParams.search,
														no_of_pages:
															vendorsAganistItems
																.miniParams
																.no_of_pages,
														item_ids:
															activePqItems?.map(
																(e) =>
																	e.item.value
															),
													}}
													hasMore={
														vendorsAganistItems
															.miniParams.page <
														vendorsAganistItems
															.miniParams
															.no_of_pages
													}
													fetchapi={getVendorsByItems}
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
															marginRight: "6px",
														}}
													/>{" "}
													Save Purchase Enquiry
												</Button>
											</Box>
										</Stack>
									</Box>
								</Stack>
							</Box>
							{/* </Grid> */}
						</Box>
					</CardContent>
					<VendorModal />
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddPurchaseEnquiry;
