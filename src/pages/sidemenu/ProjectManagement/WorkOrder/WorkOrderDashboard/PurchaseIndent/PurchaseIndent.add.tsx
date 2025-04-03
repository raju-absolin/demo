import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card, CardContent, Divider, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CustomDatepicker, FormInput } from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { Control, useForm, WatchObserver } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import Swal from "sweetalert2";
import { LuDelete, LuSave } from "react-icons/lu";
import {
	clearMiniItems,
	clearMiniLocation,
	clearMiniMake,
	clearMiniUnits,
	clearWarehouseByProject,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniItems,
	getMiniLocation,
	getMiniMake,
	getMiniUnits,
	getWarehouseByProject,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	selectIndent,
	setSelectedData,
} from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.slice";
import ReadMore from "@src/components/ReadMoreText";
import TextArea from "@src/components/form/TextArea";
import {
	editPurchaseIndent,
	getPurchaseIndentById,
	postPurchaseIndent,
} from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.action";
import { v4 as uuidv4 } from "uuid";
import { updateSidenav } from "@src/store/customise/customise";
import { PiItem } from "@src/store/sidemenu/project_management/purchaseIndent/purchase_indent.types";

const AddItemForm = ({ control, handleSubmit, reset, getValues }: any) => {
	const dispatch = useAppDispatch();
	const {
		purchaseIndent: { selectedData },
		mini: { miniItemsList, miniMake, miniUnits },
	} = useAppSelector((state) => selectIndent(state));

	interface SelectTypes {
		label: string;
		value: string;
	}

	const handleAddItem = (payload: {
		item: SelectTypes;
		make: SelectTypes;
		date: string;
		qty: string;
		unit: SelectTypes;
	}) => {
		const findItem: PiItem | undefined = selectedData?.piitems?.find(
			(item: PiItem) =>
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
					piitems: [
						...(selectedData?.piitems || []), // Ensure pqitems is an array
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
					text: "Item with same Make & Unit already added.",
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
			qty: "",
			description: "",
			unit: null,
		});
	};

	const getValuesItem = getValues("item");

	const description = useMemo(
		() => (
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
		),
		[]
	);

	return (
		<Box mt={2}>
			<form action="" onSubmit={handleSubmit(handleAddItem)}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
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
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="make"
							label="Make"
							control={control}
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
							name="qty"
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

					<Grid size={{ xs: 12, md: 6, lg: 3 }}>{description}</Grid>

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

const PurchaseIndentForm = ({
	onSave,
	handleSubmit,
	control,
	getValues,
	setValue
}: {
	onSave: (value: any) => void;
	handleSubmit: any;
	control: Control<any>;
	getValues: any;
	setValue: any;
}) => {
	const dispatch = useAppDispatch();
	const {
		purchaseIndent: { selectedData, pageParams },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			warehouseByProject,
		},
	} = useAppSelector((state) => selectIndent(state));
	const navigate = useNavigate();
	const { id, projectId } = useParams();

	const getValuesLocation = getValues("location");

	const description = useMemo(
		() => (
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
		),
		[]
	);

	return (
		<Grid size={{ xs: 12 }}>
			<form style={{ width: "100%" }} onSubmit={handleSubmit(onSave)}>
				<Box p={1}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Stack width={"100%"}>
								<CustomDatepicker
									required
									control={control}
									name="date"
									hideAddon
									minDate={new Date()}
									dateFormat="DD-MM-YYYY"
									showTimeSelect={false}
									timeFormat="h:mm a"
									timeCaption="time"
									inputClass="form-input"
									label={"Date"}
									tI={1}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required
								name="location"
								label="Location"
								control={control}
								rules={{ required: true }}
								options={miniLocationList.map(
									(e: { id: string; name: string }) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={miniLocationLoading}
								selectParams={{
									page: miniLocationParams.page,
									page_size: miniLocationParams.page_size,
									search: miniLocationParams.search,
									no_of_pages: miniLocationParams.no_of_pages,
								}}
								onChange={(value) => {
									dispatch(setSelectedData({
										...selectedData,
										location: value
									}))
									setValue("warehouse", null);
								}}
								hasMore={
									miniLocationParams.page <
									miniLocationParams.no_of_pages
								}
								fetchapi={getMiniLocation}
								clearData={clearMiniLocation}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required
								name="warehouse"
								label="Warehouse"
								control={control}
								rules={{ required: true }}
								options={warehouseByProject?.list?.map(
									(e: { id: string; name: string }) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={warehouseByProject?.loading}
								selectParams={{
									page: warehouseByProject?.miniParams?.page,
									page_size:
										warehouseByProject?.miniParams
											?.page_size,
									search: warehouseByProject?.miniParams
										?.search,
									no_of_pages:
										warehouseByProject?.miniParams
											?.no_of_pages,
									project_id: projectId ? projectId : "",
									location: getValuesLocation?.value,
								}}
								disabled={!getValuesLocation?.value}
								helperText={
									!getValuesLocation?.value
										? "Select a location before selecting a warehouse"
										: ""
								}
								hasMore={
									warehouseByProject?.miniParams?.page <
									warehouseByProject?.miniParams?.no_of_pages
								}
								fetchapi={getWarehouseByProject}
								clearData={clearWarehouseByProject}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							{description}
						</Grid>
					</Grid>
				</Box>
			</form>
		</Grid>
	);
};

const AddPurchaseIndent = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		mini: { },
		purchaseIndent: { selectedData, pageParams },
	} = useAppSelector((state) => selectIndent(state));
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
		if (id !== "0") {
			dispatch(getPurchaseIndentById({ id: id ? id : "" }));
		}
	}, [id]);

	const enquirySchema = yup.object().shape({
		date: yup.string().required("Please select a date"),
		location: yup
			.object({
				label: yup.string().required("Please select a location"),
				value: yup.string().required("Please select a location"),
			})
			.required("Please select a location"),
		warehouse: yup
			.object({
				label: yup.string().required("Please select a warehouse"),
				value: yup.string().required("Please select a warehouse"),
			})
			.required("Please select a warehouse"),
		description: yup
			.string()
			.trim("Please enter Description")
			.required("Please enter Description"), // Limit the description length
	});
	const {
		control,
		handleSubmit,
		reset: indentReset,
		getValues,
		setValue: setIndentValue,
	} = useForm<any>({
		resolver: yupResolver(enquirySchema),
	});

	useEffect(() => {
		id != "0" &&
			indentReset({
				date: selectedData?.date
					? moment(selectedData.date, "YYYY-MM-DD").toISOString()
					: "",
				description: selectedData?.description
					? selectedData.description
					: "",
				location: selectedData?.location ? selectedData.location : null,
				warehouse: selectedData?.warehouse
					? selectedData?.warehouse
					: null,
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
			title: "Units",
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
		return selectedData?.piitems
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
								const fiteredItems = selectedData.piitems?.map(
									(e: any) => {
										if (e?.item?.id == row?.item?.id &&
											e?.unit?.id == row?.unit?.id) {
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
										piitems: fiteredItems,
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
					row.qty,
					row?.unit?.label,
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
		item: yup.object({
			label: yup.string().required("Please select a item"),
			value: yup.string().required("Please select a item"),
		}),
		make: yup.object({
			label: yup.string().required("Please select a  make"),
			value: yup.string().required("Please select a make"),
		}),
		// date: yup.string().required("Please enter Required date"),
		qty: yup
			.number()
			.max(999999, "Maximum quantity reached")
			.min(1, "Need atleast one quantity")
			.required("Please enter quantity")
			.typeError("Quantity is required"),
		description: yup
			.string()
			.trim("Please enter Description")
			.required("Please enter a description"),
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
		const findItem: any = selectedData?.piitems?.filter(
			(item) => !item.dodelete
		);

		if (findItem?.length != 0) {
			const data = {
				project_id: projectId,
				date: moment(payload.date).format("YYYY-MM-DD"),
				description: payload.description,
				location_id: payload.location?.value,
				warehouse_id: payload.warehouse?.value,
				pistatus: 1,
				piitems:
					id == "0"
						? selectedData?.piitems
							?.filter((item) => !item.dodelete)
							?.map((item) => {
								return {
									item_id: item?.item?.value,
									make_id: item.make.value,
									// date: moment(item.date).format(
									// 	"YYYY-MM-DD."
									// ),
									unit_id: item?.unit?.value
										? item.unit.value
										: "",
									qty: item.qty,
									description: item.description,
									dodelete: false,
								};
							})
						: selectedData?.piitems?.map((item) => {
							return {
								id: item?.id,
								item_id: item?.item?.value,
								make_id: item.make.value,
								// date: moment(item.date).format(
								// 	"YYYY-MM-DD."
								// ),
								unit_id: item?.unit?.value
									? item.unit.value
									: "",
								qty: item.qty,
								description: item.description,
								dodelete: item.dodelete,
							};
						}),
			};

			id == "0"
				? dispatch(
					postPurchaseIndent({
						data,
						params: {
							...pageParams,
						},
						indentReset,
						navigate,
					})
				)
				: dispatch(
					editPurchaseIndent({
						id: id ? id : "",
						data,
						params: {
							...pageParams,
						},
						indentReset,
						navigate,
					})
				);
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">No Purchase Quotation Item</p>`,
				text: "Please add atleast one Purchase Indent item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Indent`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card>
					<CardContent>
						<PurchaseIndentForm
							onSave={onSave}
							handleSubmit={handleSubmit}
							control={control}
							setValue={setIndentValue}
							getValues={getValues}
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
								count={selectedData?.piitems?.length ?? 0}
								columns={columns}
								rows={rows ? rows : []}
								loading={false}
								containerHeight={440}
								page={1}
								pageSize={10}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
								showPagination={false}
							/>

							{/* <Grid size={{ xs: 12 }}> */}
							<Box mt={2} flex={1} textAlign={"end"}>
								<Button
									color="success"
									type="submit"
									onClick={handleSubmit(onSave)}
									variant="contained"
									size="large">
									<LuSave
										size={18}
										style={{
											marginRight: "6px",
										}}
									/>{" "}
									Save Purchase Indent
								</Button>
							</Box>
							{/* </Grid> */}
						</Box>
					</CardContent>
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddPurchaseIndent;
