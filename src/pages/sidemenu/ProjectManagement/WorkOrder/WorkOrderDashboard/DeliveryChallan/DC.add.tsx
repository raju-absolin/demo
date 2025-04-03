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
import { CustomDatepicker, FormInput } from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch } from "@src/store/store";
import Swal from "sweetalert2";
import { LuDelete, LuSave } from "react-icons/lu";
import {
	clearMiniCustomers,
	clearMiniVendors,
	clearWarehouseByProject,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniCustomers,
	getMiniVendors,
	getWarehouseByProject,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import TextArea from "@src/components/form/TextArea";
import { updateSidenav } from "@src/store/customise/customise";
import { AddItemForm } from "./Components/AddItemForm";
import {
	setSelectedData,
	useDeliveryChallanSelector,
} from "@src/store/sidemenu/project_management/DeliveryChallan/DC.slice";
import {
	editDeliveryChallan,
	getDeliveryChallanById,
	postDeliveryChallan,
	getStockDetails,
} from "@src/store/sidemenu/project_management/DeliveryChallan/DC.action";
import ReadMore from "@src/components/ReadMoreText";

const AddDeliveryChallan = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		deliveryChallan: { selectedData, pageParams, stock_available },
		mini: { warehouseByProject, miniCustomers },
	} = useDeliveryChallanSelector();

	const DC_TYPE_OPTIONS = [
		{
			id: 1,
			name: "Returnble",
		},
		{
			id: 1,
			name: "NonReturnble",
		},
	];

	function clearDataFn() {
		reset({
			warehouse: null,
			description: "",
			date: "",
		});
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
			dispatch(getDeliveryChallanById({ id: id ? id : "" }));
		}
	}, [id]);

	useEffect(() => {
		if (id != "0") {
			selectedData?.dchallan_items?.forEach((item) => {
				dispatch(
					getStockDetails({
						project_id: `${projectId}`,
						warehouse_id: `${selectedData?.warehouse?.id}`,
						item_id: `${item?.id}`,
					})
				).then((res: any) => {
					setValue(
						"available_stock",
						res.payload?.response?.quantity
					);
				});
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
		name: string,
		batch: JSX.Element,
		quantity: JSX.Element,
		unit: JSX.Element,
		description: JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			batch,
			quantity,
			unit,
			description,
			actions,
		};
	}

	const handleChangePage = (event: unknown, newPage: number) => {
		// dispatch(
		// 	getDeliveryChallan({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getDeliveryChallan({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};

	// add item form
	const ITPSchema = yup.object().shape({
		customer: yup
			.object({
				label: yup.string().required("Please select a customer"),
				value: yup.string().required("Please select a customer"),
			})
			.required("Please select a customer"),
		dc_type: yup
			.object({
				label: yup.string().required("Please select a dc_type"),
				value: yup.string().required("Please select a dc_type"),
			})
			.required("Please select a dc_type"),
		description: yup.string().required("please enter a remarks"),
		vehicle_no: yup.string().required("please enter a vehicle number"),
		mode_of_transport: yup
			.string()
			.required("please enter a mode of transport"),
		mobile: yup.string()
			.min(10, "Mobile number must be exactly 10 digits")
			.max(10, "Mobile number cannot exceed 10 digits")
			.required("please enter a mobile"),
		email: yup.string().required("please enter a email"),
		address: yup.string().required("please enter a address"),
		cust_dcvalue: yup.string().required("please enter a cust_dcvalue"),
		dchallan_items: yup.array().of(
			yup.object().shape({
				qty: yup
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
				item: yup
					.object({
						label: yup.string().required("Please select a item"),
						value: yup.string().required("Please select a item"),
					})
					.required("Please select a item"),
				unit: yup
					.object({
						label: yup.string().required("Please select a unit"),
						value: yup.string().required("Please select a unit"),
					})
					.required("Please select a unit"),
				description: yup
					.string()
					.required("Please select a description"),
			})
		),
	});

	const { control, handleSubmit, reset, getValues, setValue } = useForm<any>({
		resolver: yupResolver(ITPSchema),
		[id == "0" ? "defaultValues" : "values"]: {
			customer: selectedData?.customer?.id
				? {
					label: selectedData?.customer?.name,
					value: selectedData?.customer?.id,
				}
				: null,
			warehouse: selectedData?.warehouse?.id
				? {
					label: selectedData?.warehouse?.name,
					value: selectedData?.warehouse?.id,
				}
				: null,
			dc_type: selectedData?.dc_type
				? {
					label: selectedData?.dc_type_name,
					value: selectedData?.dc_type,
				}
				: null,
			description: selectedData?.description
				? selectedData.description
				: "",
			vehicle_no: selectedData?.vehicle_no ? selectedData.vehicle_no : "",
			mode_of_transport: selectedData?.mode_of_transport
				? selectedData.mode_of_transport
				: "",
			mobile: selectedData?.mobile ? selectedData.mobile : "",
			email: selectedData?.email ? selectedData.email : "",
			address: selectedData?.address ? selectedData.address : "",
			cust_dcvalue: selectedData?.cust_dcvalue
				? selectedData.cust_dcvalue
				: "",
			items:
				selectedData?.dchallan_items &&
				selectedData.dchallan_items.map((item) => ({
					qty: item.qty ? item.qty : 0,
					description: item.description ? item.description : "",
					item: item?.item
						? {
							label: item?.item?.label,
							value: item?.item?.value,
						}
						: null,
					unit: item?.unit
						? {
							label: item?.unit?.label,
							value: item?.unit?.value,
						}
						: null,
				})),
		},
	});

	useEffect(() => {
		if (id == "0") {
			reset({
				dchallan_items: [],
				customer: null,
				dc_type: null,
				description: "",
				cust_dcvalue: "",
				address: "",
				email: "",
				mobile: "",
				mode_of_transport: "",
				warehouse: null,
				vehicle_no: "",
			});
		}
	}, [id]);

	const rows = useMemo(() => {
		return selectedData?.dchallan_items
			?.filter((e) => !e.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const quantity = <Typography>{row?.qty}</Typography>;
				const unit = <Box>{row?.unit?.label}</Box>;
				const description = (
					<ReadMore
						text={row.description ? row.description : ""}
						maxLength={30}
					/>
				);
				const actions = (
					<Box
						sx={{
							display: "flex",
							gap: 2,
						}}>
						<LuDelete
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={() => {
								const fiteredItems =
									selectedData.dchallan_items?.map((e) => {
										if (e.item.value == row?.item?.value &&
											e?.unit?.value ==
											row?.unit?.value &&
											e?.batch?.value == row?.batch?.value) {
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
										dchallan_items: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);
				return createData(
					index,
					row?.item?.label ? row?.item?.label : "",
					<Typography>{row?.batch?.label}</Typography>,
					quantity,
					unit,
					description,
					actions
				);
			});
	}, [selectedData, createData]);

	const onSave = (payload: any) => {
		const findItem: any = selectedData?.dchallan_items?.filter(
			(item) => !item.dodelete
		);
		if (findItem?.length != 0) {
			const data = {
				date: moment(payload?.date).format("YYYY-MM-DD"),
				project_id: projectId,
				customer_id: payload.customer?.value,
				warehouse_id: payload.warehouse?.value,
				vehicle_no: payload.vehicle_no,
				mode_of_transport: payload.mode_of_transport,
				mobile: payload.mobile,
				email: payload.email,
				address: payload.address,
				cust_dcvalue: payload.cust_dcvalue,
				dc_type: payload.dc_type?.value,
				description: payload?.description,
				dchallan_items:
					id == "0"
						? selectedData?.dchallan_items
							?.filter((e) => !e.dodelete)
							?.map((item) => {
								return {
									qty: item?.qty,
									item_id: item?.item?.value,
									unit_id: item?.unit?.value,
									batch_id: item?.batch?.value,
									dodelete: item?.dodelete,
									description: item?.description,
								};
							})
						: selectedData?.dchallan_items?.map((item) => {
							return {
								id: item.id ? item.id : "",
								qty: item?.qty,
								item_id: item?.item?.value,
								unit_id: item?.unit?.value,
								batch_id: item?.batch?.value,
								dodelete: item?.dodelete,
								description: item?.description,
							};
						}),
			};
			id == "0"
				? dispatch(
					postDeliveryChallan({
						data,
						params: {
							...pageParams,
							project: projectId,
						},
						reset: () => {
							clearDataFn();
						},
						navigate,
					})
				)
				: dispatch(
					editDeliveryChallan({
						id: id ? id : "",
						data,
						params: {
							...pageParams,
							project: projectId,
						},
						reset: () => {
							clearDataFn();
						},
						navigate,
					})
				);
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
			title={`${id && id != "0" ? "Update" : "Add"} Challan`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card>
					<CardContent>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
								<SelectComponent
									required
									name="customer"
									label="Customer"
									control={control}
									rules={{ required: true }}
									options={miniCustomers?.list?.map(
										(e: { id: string; name: string }) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniCustomers?.loading}
									selectParams={{
										page: miniCustomers?.miniParams?.page,
										page_size:
											miniCustomers?.miniParams
												?.page_size,
										search: miniCustomers?.miniParams
											?.search,
										no_of_pages:
											miniCustomers?.miniParams
												?.no_of_pages,
									}}
									hasMore={
										miniCustomers?.miniParams?.page <
										miniCustomers?.miniParams?.no_of_pages
									}
									fetchapi={getMiniCustomers}
									clearData={clearMiniCustomers}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
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
										page: warehouseByProject?.miniParams
											?.page,
										page_size:
											warehouseByProject?.miniParams
												?.page_size,
										search: warehouseByProject?.miniParams
											?.search,
										project_id: projectId ? projectId : "",
										no_of_pages:
											warehouseByProject?.miniParams
												?.no_of_pages,
									}}
									onChange={(value) => {
										dispatch(
											setSelectedData({
												...selectedData,
												warehouse: value,
											})
										);
										reset({
											warehouse: value,
											item: null,
											make: null,
											batch: null,
											qty: "",
											description: "",
											unit: null,
										});
									}}
									hasMore={
										warehouseByProject?.miniParams?.page <
										warehouseByProject?.miniParams
											?.no_of_pages
									}
									fetchapi={getWarehouseByProject}
									clearData={clearWarehouseByProject}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
								<FormInput
									name="vehicle_no"
									required
									label="Vehicle Number"
									type="text"
									placeholder="Enter Vehicle Number here..."
									control={control}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
								<FormInput
									name="mode_of_transport"
									required
									label="Mode Of Transport"
									type="text"
									placeholder="Enter Mode Of Transport here..."
									control={control}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
								<FormInput
									name="mobile"
									required
									label="Mobile Number"
									type="number"
									placeholder="Enter mobile here..."
									control={control}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
								<FormInput
									name="email"
									required
									label="Email"
									type="text"
									placeholder="Enter email here..."
									control={control}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
								<FormInput
									name="address"
									required
									label="Address"
									type="text"
									placeholder="Enter address here..."
									control={control}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
								<FormInput
									name="cust_dcvalue"
									required
									label="Customized DC Value"
									type="number"
									placeholder="Enter Customized DC Valu here..."
									control={control}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
								<SelectComponent
									name="dc_type"
									label="Delivery Challan Type"
									control={control}
									rules={{ required: true }}
									options={DC_TYPE_OPTIONS}
								/>
							</Grid>
						</Grid>
						<Divider
							sx={{
								my: 2,
							}}
						/>
						<AddItemForm />
						<Divider
							sx={{
								mt: 2,
							}}
						/>
						<Box mt={2}>
							<TableComponent
								count={
									selectedData?.dchallan_items?.length ?? 0
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
												required
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

export default AddDeliveryChallan;
