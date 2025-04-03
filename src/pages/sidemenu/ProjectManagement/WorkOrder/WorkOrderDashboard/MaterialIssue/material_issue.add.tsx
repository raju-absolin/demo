import { yupResolver } from "@hookform/resolvers/yup";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	FormLabel,
	IconButton,
	List,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
	CustomDatepicker,
	FileType,
	FileUploader,
	FormInput,
} from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import Swal from "sweetalert2";
import {
	LuDelete,
	LuFile,
	LuLoader,
	LuPlus,
	LuSave,
	LuX,
} from "react-icons/lu";
import {
	clearMiniEnquiry,
	clearMiniMake,
	clearMiniPurchaseOrder,
	setMiniLocationParams,
	clearMiniLocation,
	clearWarehouseByProject,
	clearMiniTax,
	clearMiniBatch,
	clearMiniMaterialRequest,
	clearMiniMaterialRequestApproval,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniEnquiry,
	getMiniMake,
	getPurchaseOrderMini,
	getMiniLocation,
	getMiniTax,
	getWarehouseByProject,
	getMiniBatch,
	getMiniMaterialRequest,
	getMiniMaterialRequestApproval,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	setSelectedData,
	selectMaterialIssues,
	clearBatchQuantity,
	setStockAvailable,
	clearStockAvailable,
} from "@src/store/sidemenu/project_management/MaterialIssue/mr_issues.slice";
import {
	editMaterialIssues,
	getMRById,
	getMIById,
	postMaterialIssues,
	getStockDetails,
	getBatchQuantity,
} from "@src/store/sidemenu/project_management/MaterialIssue/mr_issues.action";
import TextArea from "@src/components/form/TextArea";
import { updateSidenav } from "@src/store/customise/customise";
import { getItemById } from "@src/store/sidemenu/tender_mangement/bidingitems/biding_items.action";
import { getItemsById } from "@src/store/masters/Item/item.action";
import { systemSelector } from "@src/store/system/system.slice";
import { itemsSelector } from "@src/store/masters/Item/item.slice";

const AddItemForm = ({ control, getValues, setValue, reset }: any) => {
	const { projectId, id } = useParams();
	const dispatch = useAppDispatch();
	const {
		materialIssues: { selectedData, stock_available },
		mini: {
			miniMaterialRequestApproval,
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			warehouseByProject,
		},
	} = useAppSelector((state) => selectMaterialIssues(state));

	const material_request = getValues("materialrequest");

	return (
		<Box mt={0}>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<Stack width={"100%"}>
						<CustomDatepicker
							control={control}
							name="date"
							hideAddon
							minDate={new Date()}
							dateFormat="DD-MM-YYYY"
							showTimeSelect={false}
							timeFormat="h:mm a"
							timeCaption="time"
							required
							inputClass="form-input"
							label={"Date"}
							tI={1}
						/>
					</Stack>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="materialrequest"
						label="Material Request"
						control={control}
						required
						options={miniMaterialRequestApproval?.list?.map(
							(e: { id: string | number; code: string }) => ({
								id: e.id,
								name: e.code,
							})
						)}
						helperText={
							id !== "0"
								? "Material Request dropdown is disabled for selection"
								: ""
						}
						disabled={id !== "0" ? true : false}
						loading={miniMaterialRequestApproval.loading}
						selectParams={{
							page: miniMaterialRequestApproval.miniParams.page,
							page_size:
								miniMaterialRequestApproval.miniParams
									.page_size,
							search: miniMaterialRequestApproval.miniParams
								.search,
							no_of_pages:
								miniMaterialRequestApproval.miniParams
									.no_of_pages,
							project: projectId ? projectId : "",
						}}
						onChange={(value) => {
							setValue("warehouse", null);
							dispatch(
								setSelectedData({
									...selectedData,
									materialrequest: value,
									warehouse: null,
									to_warehouse: null,
									miitems: [],
								})
							);
						}}
						hasMore={
							miniMaterialRequestApproval.miniParams.page <
							miniMaterialRequestApproval.miniParams.no_of_pages
						}
						fetchapi={getMiniMaterialRequestApproval}
						clearData={clearMiniMaterialRequestApproval}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="warehouse"
						label="From Warehouse"
						control={control}
						required
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
								warehouseByProject?.miniParams?.page_size,
							search: warehouseByProject?.miniParams?.search,
							no_of_pages:
								warehouseByProject?.miniParams?.no_of_pages,
							project_id: projectId ? projectId : "",
						}}
						onChange={(value) => {
							dispatch(
								setSelectedData({
									...selectedData,
									warehouse: value,
									to_warehouse: null,
									miitems: [],
								})
							);
							dispatch(clearStockAvailable());
						}}
						hasMore={
							warehouseByProject?.miniParams?.page <
							warehouseByProject?.miniParams?.no_of_pages
						}
						fetchapi={getWarehouseByProject}
						clearData={clearWarehouseByProject}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="to_warehouse"
						label="To Warehouse"
						control={control}
						required
						options={warehouseByProject?.list?.map(
							(e: { id: string; name: string }) => ({
								id: e.id,
								name: e.name,
							})
						)}
						disabled={!selectedData?.warehouse?.value}
						loading={warehouseByProject?.loading}
						selectParams={{
							page: warehouseByProject?.miniParams?.page,
							page_size:
								warehouseByProject?.miniParams?.page_size,
							search: warehouseByProject?.miniParams?.search,
							no_of_pages:
								warehouseByProject?.miniParams?.no_of_pages,
							project_id: projectId ? projectId : "",
						}}
						helperText={
							!selectedData?.warehouse?.value
								? "Select from warehouse before selecting \nto warehouse"
								: ""
						}
						onChange={(value) => {
							if (value?.id == selectedData?.warehouse?.value) {
								Swal.fire({
									title: `<p style="font-size:20px">Warning</p>`,
									text: "From warehouse and To warehouse should not be same",
									icon: "warning",
									confirmButtonText: `Close`,
									confirmButtonColor: "#3085d6",
								});
								setValue("to_warehouse", null);
							} else {
								dispatch(
									setSelectedData({
										...selectedData,
										to_warehouse: value,
									})
								);
							}
						}}
						hasMore={
							warehouseByProject?.miniParams?.page <
							warehouseByProject?.miniParams?.no_of_pages
						}
						fetchapi={getWarehouseByProject}
						clearData={clearWarehouseByProject}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }} mt={3.7}>
					<Button
						color="primary"
						variant="contained"
						size="large"
						disabled={
							!material_request?.value ||
							!selectedData?.warehouse?.value ||
							id != "0"
								? true
								: false
						}
						onClick={() => {
							dispatch(
								getMRById({
									id: material_request
										? material_request.value
										: "",
								})
							).then((res: any) => {
								res.payload?.response?.mr_items?.map(
									(val: any) => {
										if (val?.item?.id) {
											Promise.all([
												dispatch(
													getStockDetails({
														project_id: `${projectId}`,
														warehouse_id:
															selectedData
																?.warehouse
																?.value,
														item_id: `${val?.item?.id}`,
													})
												),
												dispatch(
													getItemsById({
														id: val?.item?.id,
													})
												),
											]).then(
												([stockRes, itemRes]: [
													any,
													any,
												]) => {
													// let stockQuantity = parseFloat(stockRes?.payload?.response?.quantity) ?? 0;
													let stockQuantity =
														stockRes?.payload
															?.response ?? {};
													let unitName =
														itemRes?.payload
															?.response?.baseunit
															?.name ?? "";
													let stockQuantityFormatted = `${stockQuantity} ${unitName}`;

													console.log(
														stockQuantity,
														unitName
													);
													dispatch(
														setStockAvailable({
															...stockQuantity,
															unit: unitName,
														})
													);
												}
											);
										}
									}
								);
							});
						}}>
						Load Items
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};

const AddMaterialIssues = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		materialIssues: {
			selectedData,
			pageParams,
			stock_available,
			batchAgainstItemsList,
			batchPageParams,
			batchloading,
		},
		mini: { miniMake, miniTax, miniBatch, warehouseByProject },
	} = useAppSelector((state) => selectMaterialIssues(state));
	const {
		items: { selectedData: itemSelectedData },
	} = useAppSelector((state) => {
		return {
			items: itemsSelector(state),
		};
	});

	const [quantityExceeded, setQuantityExceeded] = useState(false);
	const [miquantity, setMIQuantity] = useState<any>(0);
	const [maxQty, setMaxQty] = useState<any>([]);

	const [rowQuantities, setRowQuantities] = useState(
		selectedData?.miitems?.map(() => 0) || [] // Initialize quantities as 0 or from initial data
	);
	const [rowErrors, setRowErrors] = useState(
		selectedData?.miitems?.map(() => "") || []
	);

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
			dispatch(getMIById({ id: id ? id : "" }));
			setQuantityExceeded(false);
		}
	}, [id]);
	useEffect(() => {
		if (selectedData) {
			const maxValues = selectedData?.mritem?.map(
				(item: any, index: number) => {
					if (item?.qty !== undefined) {
						return parseInt(item?.qty || 0);
					} else {
						console.warn(
							`Missing qty for item at index ${index}:`,
							item
						);
						return 0;
					}
				}
			);
			setMaxQty(maxValues);
		} else {
			setMaxQty([]); // Default to an empty array
		}
		if (id !== "0") {
			selectedData?.miitems?.forEach((item) => {
				setMIQuantity(item?.qty);
				dispatch(
					getStockDetails({
						project_id: `${projectId}`,
						warehouse_id: selectedData?.warehouse?.id,
						item_id: `${item?.item?.id}`,
					})
				)
					.unwrap()
					.then((res) => {
						dispatch(setStockAvailable(res?.response));
					});
				dispatch(
					getBatchQuantity({
						item_id: item?.item?.id,
						project_id: projectId,
						warehouse_id: selectedData?.warehouse?.id,
						no_of_pages: 0,
						page_size: 10,
						page: 1,
					})
				);
				dispatch(getItemsById({ id: item?.item?.id }));
			});
		}
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
		{
			title: "MR Quantity",
			width: 100,
		},
		{
			title: "Available Stock",
			width: 100,
		},
		{
			title: "Batch",
			width: 100,
		},
		{
			title: "Quantity",
			width: 100,
		},
		{
			title: "Units",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		mrQuantity: number | string,
		stockAvailable: number | string,
		batch: JSX.Element,
		quantity: JSX.Element,
		unit: JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			mrQuantity,
			stockAvailable,
			batch,
			quantity,
			unit,
			actions,
		};
	}

	const handleChangePage = (event: unknown, newPage: number) => {
		// dispatch(
		// 	getMaterialIssues({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getMaterialIssues({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};

	// add item form
	const miSchema = yup.object().shape({
		date: yup.string().required("Please select date"),
		materialrequest: yup
			.object({
				label: yup
					.string()
					.required("Please select a material request"),
				value: yup
					.string()
					.required("Please select a material request"),
			})
			.required("Please select a material request"),
		warehouse: yup
			.object({
				label: yup.string().required("Please select from warehouse"),
				value: yup.string().required("Please select from warehouse"),
			})
			.required("Please select from warehouse"),
		to_warehouse: yup
			.object({
				label: yup.string().required("Please select to warehouse"),
				value: yup.string().required("Please select to warehouse"),
			})
			.required("Please select to warehouse"),
		description: yup.string().required("please enter a remarks"),
		items: yup.array().of(
			yup.object().shape({
				quantity: yup
					.number()
					.typeError("Quantity must be a number")
					.required("Quantity is required")
					.positive("Quantity must be greater than zero")
					.test(
						"max-quantity",
						"Quantity cannot be greater than the original quantity",
						function (value) {
							const { originalqty } = this.parent;
							return (
								originalqty === undefined ||
								value <= originalqty
							);
						}
					),
				batch: yup
					.object({
						label: yup.string().required("Please select a batch"),
						value: yup.string().required("Please select a batch"),
					})
					.required("Please select a batch"),
			})
		),
	});
	const {
		control,
		handleSubmit,
		reset: miReset,
		getValues,
		setValue,
	} = useForm<any>({
		resolver: yupResolver(miSchema),
		[id == "0" ? "defaultValues" : "values"]: {
			materialrequest: selectedData?.materialrequest?.id
				? {
						label: selectedData?.materialrequest?.code,
						value: selectedData?.materialrequest?.id,
					}
				: null,
			warehouse: selectedData?.warehouse?.id
				? {
						label: selectedData?.warehouse?.name,
						value: selectedData?.warehouse?.id,
					}
				: null,
			to_warehouse: selectedData?.to_warehouse?.id
				? {
						label: selectedData?.to_warehouse?.name,
						value: selectedData?.to_warehouse?.id,
					}
				: null,
			date: selectedData?.date
				? moment(selectedData?.date, "YYYY-MM-DD").format("YYYY-MM-DD")
				: "",
			description: selectedData?.description
				? selectedData.description
				: "",
			items:
				selectedData?.miitems &&
				selectedData.miitems.map((item) => ({
					// quantity: item.qty ? item.qty : 0,
					price: item.price ? item.price : "",
					batch: item?.batch
						? {
								label: item?.batch?.name,
								value: item?.batch?.id,
							}
						: null,
				})),
		},
	});
	useEffect(() => {
		if (id == "0") {
			miReset({
				items: [],
				materialrequest: null,
				warehouse: null,
				to_warehouse: null,
				description: "",
				date: "",
			});
		}
	}, [id]);
	const rows = useMemo(() => {
		return selectedData?.miitems
			?.filter((e) => !e.dodelete)
			?.map((row, key) => {
				const stockMapping = stock_available?.find(
					(e) => e.item == row?.item?.id
				);
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);
				const maxQtyValue = maxQty?.[key] || 0;
				const mrItem = selectedData?.mritem?.[key];
				const stockQty = stockMapping
					? `${stockMapping?.quantity} ${stockMapping?.unit}`
					: "";
				const mrQuantity = mrItem ? parseFloat(mrItem.qty) : 0;
				const unitName = row?.item?.baseunit?.name
					? row?.item.baseunit.name
					: itemSelectedData?.baseunit?.name;

				const mrQunatityWithUnits = `${mrQuantity} ${unitName}`;
				const quantity = (
					<Box
						sx={
							{
								// width: 200,
							}
						}>
						<form action="">
							<FormInput
								control={control}
								name={`items.${key}.quantity`}
								helperText="Quantity"
								label=""
								type="number"
								placeholder="Enter quantity here..."
								onChange={(event) => {
									const enteredQty =
										parseFloat(event.target.value) || 0;
									const updatedQuantities = [
										...rowQuantities,
									];
									updatedQuantities[key] = enteredQty;
									setRowQuantities(updatedQuantities);
									const updatedErrors = [...rowErrors];
									if (enteredQty > maxQtyValue) {
										updatedErrors[key] =
											`Quantity exceeds maximum limit of ${maxQtyValue}.`;
										setQuantityExceeded(true);
									} else if (
										enteredQty > Number(stock_available)
									) {
										updatedErrors[key] =
											`Quantity exceeds available stock of ${stock_available}.`;
										setQuantityExceeded(true);
									} else if (
										enteredQty > Number(maxQtyValue)
									) {
										updatedErrors[key] =
											`Quantity exceeds mr quantity of ${maxQtyValue}.`;
										setQuantityExceeded(true);
									} else {
										updatedErrors[key] = "";
										setQuantityExceeded(false);
									}
									setRowErrors(updatedErrors);

									const updatedItems =
										selectedData?.miitems ?? [];

									const newItems = updatedItems.map(
										(item, idx) => {
											if (idx === key) {
												return {
													...item,
													quantity: enteredQty,
												};
											}
											return item;
										}
									);

									dispatch(
										setSelectedData({
											...selectedData,
											miitems: newItems,
										})
									);
									if (!updatedErrors[key]) {
										setMIQuantity(event.target.value);
									}
								}}
							/>
							{rowErrors[key] && (
								<Typography
									color="error"
									variant="body2"
									sx={{ mt: 1 }}>
									{rowErrors[key]}
								</Typography>
							)}
						</form>
					</Box>
				);
				const unit = (
					<>
						<form action="">
							<Box>{row?.unit?.name}</Box>
						</form>
					</>
				);
				const batch = (
					<Box
						sx={
							{
								// width: 200,
							}
						}>
						<form action="">
							<SelectComponent
								name={`items.${key}.batch`}
								label=""
								control={control}
								disabled={false}
								rules={{ required: true }}
								options={
									batchAgainstItemsList?.map((e) => ({
										id: e?.batch || "",
										name:
											`${e?.batchname} (${parseFloat(e?.quantity)} ${unitName})` ||
											"",
									})) ?? []
								}
								onChange={(value) => {
									dispatch(
										setSelectedData({
											...selectedData,
											miitems: selectedData.miitems?.map(
												(e) => {
													if (
														e?.item?.id ===
														row?.item?.id
													) {
														return {
															...e,
															batch: value,
														};
													}
													return e;
												}
											),
										})
									);
								}}
								loading={batchloading}
								helperText={"Batch"}
								placeholder="Select Batch"
								selectParams={{
									page: batchPageParams.page,
									page_size: batchPageParams.page_size,
									search: batchPageParams.search,
									no_of_pages: batchPageParams.no_of_pages,
									project_id: projectId,
									warehouse_id: selectedData?.warehouse?.id,
									item_id: row?.item?.id,
								}}
								hasMore={
									batchPageParams.page <
									batchPageParams.no_of_pages
								}
								fetchapi={getBatchQuantity}
								clearData={clearBatchQuantity}
							/>
						</form>
					</Box>
				);
				const actions = (
					<Box
						sx={{
							justifyContent: "center",
							display: "flex",
							gap: 2,
						}}>
						<LuDelete
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={() => {
								const fiteredItems = selectedData.miitems?.map(
									(e) => {
										if (
											e?.item?.id == row?.item?.id &&
											e?.unit?.id == row?.unit?.id
										) {
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
										miitems: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);
				return createData(
					index,
					row?.item?.name ? row?.item?.name : "",
					mrQunatityWithUnits ?? 0,
					stockQty,
					batch,
					quantity,
					unit,
					actions
				);
			});
	}, [selectedData, rowErrors, createData, maxQty]);

	const onSave = (payload: any) => {
		const findItem: any = selectedData?.miitems?.filter(
			(item) => !item.dodelete
		);
		if (findItem?.length != 0) {
			if (!quantityExceeded) {
				setQuantityExceeded(false);
				const data = {
					date: moment(payload?.date).format("YYYY-MM-DD"),
					project_id: projectId,
					materialrequest_id: payload?.materialrequest?.value,
					warehouse_id: payload.warehouse?.value,
					to_warehouse_id: payload.to_warehouse?.value,
					description: payload?.description,
					miitems:
						id == "0"
							? selectedData?.miitems
									?.filter((e) => !e.dodelete)
									?.map((item) => {
										return {
											id: item.id ? item.id : "",
											date: moment(payload?.date).format(
												"YYYY-MM-DD"
											),
											qty: item?.quantity,
											item_id: item?.item?.id,
											unit_id: item?.unit?.id,
											batch_id: item?.batch?.id,
											description: payload?.description,
											dodelete: item?.dodelete,
										};
									})
							: selectedData?.miitems?.map((item) => {
									return {
										id: item.id ? item.id : "",
										date: moment(payload?.date).format(
											"YYYY-MM-DD"
										),
										qty: item?.quantity
											? item.quantity
											: item?.qty,
										item_id: item?.item?.id,
										unit_id: item?.unit?.id,
										batch_id: item?.batch?.id,
										description: payload?.description,
										dodelete: item?.dodelete,
									};
								}),
				};
				id == "0"
					? dispatch(
							postMaterialIssues({
								data,
								params: {
									...pageParams,
									project_id: projectId,
								},
								miReset,
								navigate,
							})
						)
					: dispatch(
							editMaterialIssues({
								id: id ? id : "",
								data,
								params: {
									...pageParams,
									project_id: projectId,
								},
								miReset,
								navigate,
							})
						);
			} else {
				setQuantityExceeded(true);
			}
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">No Bid Items</p>`,
				text: "Please add atleast one material issue item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Material Issue`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card>
					<CardContent>
						<AddItemForm
							control={control}
							getValues={getValues}
							setValue={setValue}
							reset={miReset}
						/>
						<Divider
							sx={{
								mt: 2,
							}}
						/>
						<Box mt={2}>
							<TableComponent
								count={selectedData?.miitems?.length ?? 0}
								columns={columns}
								rows={rows ? rows : []}
								loading={false}
								page={1}
								pageSize={10}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
								containerHeight={440}
								showPagination={false}
							/>
							<Box mt={2}>
								<form action="">
									<Grid container spacing={2}>
										<Grid size={{ xs: 12, md: 6, lg: 3 }}>
											<TextArea
												name="description"
												label="Remarks"
												type="text"
												placeholder="Write Remarks here..."
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
								</form>
							</Box>

							<Box textAlign={"right"} mt={2}>
								<Button
									color="success"
									onClick={handleSubmit(onSave, (errors) => {
										console.log("errors", errors);
									})}
									variant="contained"
									size="large">
									<LuSave
										size={18}
										style={{ marginRight: "6px" }}
									/>{" "}
									Save
								</Button>
							</Box>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddMaterialIssues;
