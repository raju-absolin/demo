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
import { useAppDispatch, useAppSelector } from "@src/store/store";
import Swal from "sweetalert2";
import { LuDelete, LuSave } from "react-icons/lu";
import {
	clearWarehouseByProject,
	clearMiniBatch,
	clearMiniMaterialRequest,
	clearMiniLocation,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getWarehouseByProject,
	getMiniBatch,
	getMiniMaterialRequest,
	getMiniLocation,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import TextArea from "@src/components/form/TextArea";
import { updateSidenav } from "@src/store/customise/customise";
import { AddItemForm } from "./Components/AddItemForm";
import {
	useDeliveryReturnNotesSelector,
	setSelectedData,
} from "@src/store/sidemenu/project_management/DeliveryNoteReturn/DNR.slice";
import {
	editDeliveryReturnNotes,
	getDeliveryReturnNotesById,
	postDeliveryReturnNotes,
} from "@src/store/sidemenu/project_management/DeliveryNoteReturn/DNR.action";
import ReadMore from "@src/components/ReadMoreText";

const AddDeliveryReturnNotes = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		deliveryReturnNotes: { selectedData, pageParams },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			warehouseByProject,
		},
	} = useDeliveryReturnNotesSelector();

	function clearDataFn() {
		miReset({
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
			dispatch(getDeliveryReturnNotesById({ id: id ? id : "" }));
		}
	}, [id]);

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
		unit: JSX.Element,
		quantity: JSX.Element,
		description: JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			unit,
			quantity,
			description,
			actions,
		};
	}

	const handleChangePage = (event: unknown, newPage: number) => {
		// dispatch(
		// 	getDeliveryReturnNotes({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getDeliveryReturnNotes({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};

	// add item form
	const ITPSchema = yup.object().shape({
		warehouse: yup
			.object({
				label: yup.string().required("Please select a warehouse"),
				value: yup.string().required("Please select a warehouse"),
			})
			.required("Please select a warehouse"),
		location: yup
			.object({
				label: yup.string().required("Please select a location"),
				value: yup.string().required("Please select a location"),
			})
			.required("Please select a location"),
		description: yup.string().required("please enter a remarks"),
		deliveryreturnnotesitems: yup.array().of(
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

	const {
		control,
		handleSubmit,
		reset: miReset,
		getValues,
		setValue,
	} = useForm<any>({
		resolver: yupResolver(ITPSchema),
		[id == "0" ? "defaultValues" : "values"]: {
			warehouse: selectedData?.warehouse?.id
				? {
					label: selectedData?.warehouse?.name,
					value: selectedData?.warehouse?.id,
				}
				: null,
			location: selectedData?.location?.id
				? {
					label: selectedData?.location?.name,
					value: selectedData?.location?.id,
				}
				: null,
			description: selectedData?.description
				? selectedData.description
				: "",
			deliveryreturnnotesitems:
				selectedData?.deliveryreturnnotesitems &&
				selectedData.deliveryreturnnotesitems.map((item) => ({
					qty: item.qty ? item.qty : 0,
					description: item.description ? item.description : "",
					item: item?.item
						? {
							label: item?.item?.name,
							value: item?.item?.id,
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
			miReset({
				deliveryreturnnotesitems: [],
				warehouse: null,
				location: null,
				description: "",
				date: "",
			});
		}
	}, [id]);

	const rows = useMemo(() => {
		return selectedData?.deliveryreturnnotesitems
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
									selectedData.deliveryreturnnotesitems?.map(
										(e: any) => {
											if (e.item.value == row?.item?.value &&
												e?.unit?.value == row?.unit?.value) {
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
										deliveryreturnnotesitems: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);
				return createData(
					index,
					row?.item?.label ? row?.item?.label : "",
					quantity,
					unit,
					description,
					actions
				);
			});
	}, [selectedData, createData]);

	const onSave = (payload: any) => {
		const findItem: any = selectedData?.deliveryreturnnotesitems?.filter(
			(item) => !item.dodelete
		);
		if (findItem?.length != 0) {
			const data = {
				project_id: projectId,
				warehouse_id: payload.warehouse?.value,
				location_id: payload.location?.value,
				description: payload?.description,
				deliveryreturnnotesitems:
					id == "0"
						? selectedData?.deliveryreturnnotesitems
							?.filter((e) => !e.dodelete)
							?.map((item) => {
								return {
									qty: item?.qty,
									item_id: item?.item?.value,
									unit_id: item?.unit?.value,
									dodelete: item?.dodelete,
									description: item?.description,
								};
							})
						: selectedData?.deliveryreturnnotesitems?.map(
							(item) => {
								return {
									id: item.id ? item.id : "",
									qty: item?.qty,
									item_id: item?.item?.value,
									unit_id: item?.unit?.value,
									dodelete: item?.dodelete,
									description: item?.description,
								};
							}
						),
			};
			id == "0"
				? dispatch(
					postDeliveryReturnNotes({
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
					editDeliveryReturnNotes({
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

	const getValuesLocation = getValues("location");

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Delivery Return Note`}
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
									name="location"
									label="Location"
									control={control}
									rules={{ required: true }}
									options={miniLocationList?.map(
										(e: { id: string; name: string }) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniLocationLoading}
									selectParams={{
										page: miniLocationParams?.page,
										page_size:
											miniLocationParams?.page_size,
										search: miniLocationParams?.search,
										no_of_pages:
											miniLocationParams?.no_of_pages,
									}}
									onChange={(value) => {
										dispatch(
											setSelectedData({
												...selectedData,
												location: value,
											})
										);
									}}
									hasMore={
										miniLocationParams?.page <
										miniLocationParams?.no_of_pages
									}
									fetchapi={getMiniLocation}
									clearData={clearMiniLocation}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
								<SelectComponent
									required
									name="warehouse"
									label="Warehouse"
									control={control}
									rules={{ required: true }}
									disabled={!selectedData?.location?.value}
									options={warehouseByProject?.list?.map(
										(e: { id: string; name: string }) => ({
											id: e.id,
											name: e.name,
										})
									)}
									helperText={
										!getValuesLocation?.value
											? "Select a location before selecting warehouse"
											: ""
									}
									loading={warehouseByProject?.loading}
									selectParams={{
										page: warehouseByProject?.miniParams
											?.page,
										page_size:
											warehouseByProject?.miniParams
												?.page_size,
										search: warehouseByProject?.miniParams
											?.search,
										no_of_pages:
											warehouseByProject?.miniParams
												?.no_of_pages,
										project_id: projectId ? projectId : "",
										location: getValuesLocation?.value
											? getValuesLocation?.value
											: "",
									}}
									onChange={(value) => {
										dispatch(
											setSelectedData({
												...selectedData,
												warehouse: value,
											})
										);
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
									selectedData?.deliveryreturnnotesitems
										?.length ?? 0
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

export default AddDeliveryReturnNotes;
