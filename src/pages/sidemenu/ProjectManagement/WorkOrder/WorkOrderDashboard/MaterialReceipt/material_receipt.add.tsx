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
	clearMiniWarehouse,
	clearMiniTax,
	clearMiniBatch,
	clearMiniMaterialRequest,
	clearMiniMaterialIssue,
	clearMiniMaterialRequestApproval,
	clearMiniMaterialIssueApproval,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniEnquiry,
	getMiniMake,
	getPurchaseOrderMini,
	getMiniLocation,
	getMiniTax,
	getMiniWarehouse,
	getMiniBatch,
	getMiniMaterialRequest,
	getMiniMaterialIssue,
	getMiniMaterialRequestApproval,
	getMiniMaterialIssueApproval,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	setSelectedData,
	selectMaterialReceipt,
} from "@src/store/sidemenu/project_management/MaterialReceipt/material_receipt.slice";
import {
	editMaterialReceipt,
	getMIById,
	getMaterialReceiptById,
	postMaterialReceipt,
} from "@src/store/sidemenu/project_management/MaterialReceipt/material_receipt.action";
import TextArea from "@src/components/form/TextArea";
import { updateSidenav } from "@src/store/customise/customise";

const AddItemForm = ({ control, getValues, setValue, reset }: any) => {
	const { projectId, id } = useParams();
	const dispatch = useAppDispatch();
	const {
		materialReceipt: { selectedData },
		mini: {
			miniMaterialIssueApproval,
			miniMaterialRequestApproval,
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniWarehouse,
		},
	} = useAppSelector((state) => selectMaterialReceipt(state));

	const material_issue = getValues("material_issue");

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
							required
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
						onChange={(value) => {
							reset({
								materialrequest: value,
								material_issue: null,
								warehouse: null,
								to_warehouse: null,
								mreceipt_items: [],
							})
							dispatch(
								setSelectedData({
									...selectedData,
									materialrequest: value,
									mreceipt_items: [],
								})
							);
						}}
						disabled={id !== "0" ? true : false}
						loading={miniMaterialRequestApproval.loading}
						selectParams={{
							page: miniMaterialRequestApproval.miniParams.page,
							page_size: miniMaterialRequestApproval.miniParams.page_size,
							search: miniMaterialRequestApproval.miniParams.search,
							no_of_pages:
								miniMaterialRequestApproval.miniParams.no_of_pages,
							project: projectId ? projectId : "",
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
						name="material_issue"
						label="Material Issue"
						control={control}
						required
						options={miniMaterialIssueApproval?.list?.map(
							(e: { id: string | number; code: string }) => ({
								id: e.id,
								name: e.code,
							})
						)}
						helperText={
							id !== "0"
								? "Material Issue dropdown is disabled for selection"
								: ""
						}
						disabled={id !== "0" ? true : false}
						loading={miniMaterialIssueApproval.loading}
						selectParams={{
							page: miniMaterialIssueApproval.miniParams.page,
							page_size: miniMaterialIssueApproval.miniParams.page_size,
							search: miniMaterialIssueApproval.miniParams.search,
							no_of_pages:
								miniMaterialIssueApproval.miniParams.no_of_pages,
							project: projectId ? projectId : "",
							materialrequest: material_request?.value,
						}}
						hasMore={
							miniMaterialIssueApproval.miniParams.page <
							miniMaterialIssueApproval.miniParams.no_of_pages
						}
						fetchapi={getMiniMaterialIssueApproval}
						clearData={clearMiniMaterialIssueApproval}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }} mt={3.7}>
					<Button
						color="primary"
						variant="contained"
						size="large"
						disabled={
							!material_issue?.value || id !== "0" ? true : false
						}
						onClick={() =>
							dispatch(
								getMIById({
									id: material_issue
										? material_issue.value
										: "",
								})
							).then((res: any) => {
								setValue("warehouse", {
									value: res.payload?.response?.warehouse?.id,
									label: res.payload?.response?.warehouse
										?.name,
								});
								setValue("to_warehouse", {
									value: res.payload?.response?.to_warehouse
										?.id,
									label: res.payload?.response?.to_warehouse
										?.name,
								});
							})
						}>
						Load Items
					</Button>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="warehouse"
						label="From Warehouse"
						control={control}
						required
						options={miniWarehouse?.list?.map(
							(e: { id: string; name: string }) => ({
								id: e.id,
								name: e.name,
							})
						)}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="to_warehouse"
						label="To Warehouse"
						control={control}
						required
						options={miniWarehouse?.list?.map(
							(e: { id: string; name: string }) => ({
								id: e.id,
								name: e.name,
							})
						)}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

const AddMaterialReceipt = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		materialReceipt: { selectedData, pageParams },
		mini: { miniMake, miniTax, miniBatch, miniWarehouse },
	} = useAppSelector((state) => selectMaterialReceipt(state));

	const [mrquantity, setMRQuantity] = useState<any>(0);
	let enteredQty = 0;

	const [quantityExceeded, setQuantityExceeded] = useState(false);
	const [maxQty, setMaxQty] = useState<any>([]);

	const [rowQuantities, setRowQuantities] = useState(
		selectedData?.mreceipt_items?.map(() => 0) || [] // Initialize quantities as 0 or from initial data
	);
	const [rowErrors, setRowErrors] = useState(
		selectedData?.mreceipt_items?.map(() => "") || []
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
			dispatch(getMaterialReceiptById({ id: id || "" }));
			setQuantityExceeded(false);
		}
	}, [id]);

	useEffect(() => {
		if (selectedData) {
			const maxValues = selectedData?.miitem?.map(
				(item: any, index: number) => {
					if (item?.qty !== undefined) {
						setMRQuantity(Number(item?.qty));
						return parseInt(item?.qty || 0);
					}
				}
			);
			setMaxQty(maxValues);
		} else {
			setMaxQty([]); // Default to an empty array
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
			title: "MI Quantity",
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
			title: "Batch",
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
		miQuantity: JSX.Element,
		quantity: JSX.Element,
		unit: JSX.Element,
		batch: string,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			miQuantity,
			quantity,
			unit,
			batch,
			actions,
		};
	}

	const handleChangePage = (event: unknown, newPage: number) => {
		// dispatch(
		// 	getMaterialReceipt({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getMaterialReceipt({
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
		material_issue: yup
			.object({
				label: yup.string().required("Please select a material issue"),
				value: yup.string().required("Please select a material issue"),
			})
			.required("Please select a material issue"),
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
				// batch: yup
				//     .object({
				//         label: yup.string().required("Please select a batch"),
				//         value: yup.string().required("Please select a batch"),
				//     })
				//     .required("Please select a batch"),
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
			material_issue: selectedData?.material_issue?.id
				? {
					label: selectedData?.material_issue?.code,
					value: selectedData?.material_issue?.id,
				}
				: null,
			materialrequest: selectedData?.material_issue?.materialrequest?.id
				? {
					label: selectedData?.material_issue?.materialrequest?.code,
					value: selectedData?.material_issue?.materialrequest?.id,
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
				selectedData?.mreceipt_items &&
				selectedData.mreceipt_items.map((item) => ({
					quantity: item.qty ? item.qty : 0,
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
				material_issue: null,
				materialrequest: null,
				warehouse: null,
				to_warehouse: null,
				description: "",
				date: "",
			});
		}
	}, [id]);
	const rows = useMemo(() => {
		return selectedData?.mreceipt_items
			?.filter((e) => !e.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);
				const maxQtyValue = maxQty?.[key] || 0;
				const miQuantity = <Box>{mrquantity}</Box>;

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
										enteredQty > Number(maxQtyValue)
									) {
										updatedErrors[key] =
											`Quantity exceeds stock out quantity of ${maxQtyValue}.`;
										setQuantityExceeded(true);
									} else {
										updatedErrors[key] = "";
										setQuantityExceeded(false);
									}
									setRowErrors(updatedErrors);

									const updatedItems =
										selectedData?.mreceipt_items ?? [];

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
											mreceipt_items: newItems,
										})
									);
									if (!updatedErrors[key]) {
										setMRQuantity(event.target.value);
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
								const fiteredItems =
									selectedData.mreceipt_items?.map((e) => {
										if (e?.item?.id == row?.item?.id &&
											e?.unit?.id == row?.unit?.id) {
											return {
												...e,
												dodelete: true,
											};
										}
										return e;
									});
								dispatch(
									setSelectedData({
										...selectedData,
										mreceipt_items: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);
				return createData(
					index,
					row?.item?.name ? row?.item?.name : "",
					miQuantity,
					quantity,
					unit,
					row?.batch?.name ? row?.batch?.name : "",
					actions
				);
			});
	}, [selectedData, createData]);
	const onSave = (payload: any) => {
		const findItem: any = selectedData?.mreceipt_items?.filter(
			(item) => !item.dodelete
		);
		if (findItem?.length > 0) {
			if (!quantityExceeded) {
				setQuantityExceeded(false);
				const data = {
					date: moment(payload?.date).format("YYYY-MM-DD"),
					project_id: projectId,
					material_issue_id: payload?.material_issue?.value,
					material_request_id: payload?.material_request?.value,
					warehouse_id: payload.warehouse?.value,
					description: payload?.description,
					mreceipt_items:
						id == "0"
							? selectedData?.mreceipt_items
								?.filter((e) => !e.dodelete)
								?.map((item) => {
									return {
										id: item.id ? item.id : "",
										qty: item?.quantity,
										item_id: item?.item?.id,
										unit_id: item?.unit?.id,
										batch_id: item?.batch?.id,
										description: payload?.description,
										dodelete: item?.dodelete,
									};
								})
							: selectedData?.mreceipt_items?.map((item) => {
								return {
									id: item.id ? item.id : "",
									qty: item?.quantity
										? item?.quantity
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
						postMaterialReceipt({
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
						editMaterialReceipt({
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
				text: "Please add atleast one material receipt item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Material Receipt`}
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
								count={
									selectedData?.mreceipt_items?.length ?? 0
								}
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
												required
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
									onClick={handleSubmit(onSave)}
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

export default AddMaterialReceipt;
