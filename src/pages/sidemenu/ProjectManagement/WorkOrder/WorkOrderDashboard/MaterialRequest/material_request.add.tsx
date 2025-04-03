import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CustomDatepicker, FormInput } from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import Swal from "sweetalert2";
import { LuDelete, LuPlus, LuSave } from "react-icons/lu";
import {
	clearMiniBatch,
	clearMiniItems,
	clearMiniLocation,
	clearMiniMake,
	clearMiniUnits,
	clearMiniWarehouse,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniBatch,
	getMiniItems,
	getMiniLocation,
	getMiniMake,
	getMiniUnits,
	getMiniWarehouse,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	clearMakeByItem,
	selectMaterialRequest,
	setSelectedData,
} from "@src/store/sidemenu/project_management/MaterialRequest/material_request.slice";
import ReadMore from "@src/components/ReadMoreText";
import TextArea from "@src/components/form/TextArea";
import {
	editMaterialRequest,
	getMakeByitemId,
	getMRById,
	postMaterialRequest,
} from "@src/store/sidemenu/project_management/MaterialRequest/material_request.action";
import { v4 as uuidv4 } from "uuid";
import { updateSidenav } from "@src/store/customise/customise";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const AddItemForm = ({
	control,
	handleSubmit,
	reset,
	getValues,
	errors,
}: any) => {
	const dispatch = useAppDispatch();
	const {
		materialRequest: { selectedData, makeByItem },
		mini: { miniItemsList, miniUnits, miniMake },
	} = useAppSelector((state) => selectMaterialRequest(state));

	const [isInputField, setIsInputField] = useState(false);
	interface SelectTypes {
		label: string;
		value: string;
	}

	const handleAddItem = (payload: {
		item?: SelectTypes;
		make?: SelectTypes;
		item_name?: string;
		make_name?: string;
		unit_name?: string;
		// batch: SelectTypes;
		date: string;
		qty: string;
		unit?: SelectTypes;
	}) => {
		const findItem: any = selectedData?.mr_items?.find((item: any) => {
			return (
				(item?.item_name === payload?.item_name &&
					item?.make?.value === payload?.make?.value &&
					item?.unit?.value === payload?.unit?.value) ||
				(payload?.item != null &&
					item?.item?.value === payload?.item?.value &&
					item?.make?.value === payload?.make?.value &&
					item?.unit?.value === payload?.unit?.value)
			);
		});

		const addData = () => {
			const data = {
				...payload,
				uuid: uuidv4(),
				dodelete: false,
			};
			dispatch(
				setSelectedData({
					...selectedData,
					mr_items: [
						...(selectedData?.mr_items || []),
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
		// setIsInputField(false);
		reset({
			item: null,
			item_name: "",
			make_name: "",
			make: null,
			qty: "",
			description: "",
			unit: null,
			unit_name: "",
		});
	};

	const getValuesItem = getValues("item");
	const getValuesUnit = getValues("unit");

	const handleToggle = () => {
		setIsInputField((prev) => !prev);
		reset({
			item: null,
			item_name: "",
			make: null,
			make_name: "",
			qty: "",
			description: "",
			unit: null,
			unit_name: "",
		});
	};
	return (
		<Box mt={2}>
			<form
				action=""
				onSubmit={handleSubmit(handleAddItem, (err: any) => {
					console.log("errors", err);
				})}>
				<Box
					display="flex"
					// justifyContent="space-between"
					alignItems={"center"}
					gap={1}
					p={0}
					sx={{ marginBottom: 2 }}>
					<Button
						variant="contained"
						size="large"
						onClick={handleToggle}>
						<Stack
							spacing={1}
							direction={"row"}
							alignItems={"center"}>
							<LuPlus />{" "}
							<Typography>
								{isInputField
									? "Hide New Item"
									: "Create New Item"}
							</Typography>
						</Stack>
					</Button>
				</Box>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						{!isInputField ? (
							<SelectComponent
								name="item"
								label="Item"
								control={control}
								required
								options={miniItemsList.list.map(
									(e: {
										id: string | number;
										name: string;
									}) => ({
										id: e.id,
										name: e.name,
									})
								)}
								onChange={(value) => {
									reset({
										item: value,
										make: null,
										quantity: "",
										unit: null,
										description: ""
									})
								}}
								loading={miniItemsList.loading}
								selectParams={{
									page: miniItemsList.miniParams.page,
									page_size:
										miniItemsList.miniParams.page_size,
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
						) : (
							<FormInput
								name="item_name"
								label="Item"
								required
								type="text"
								placeholder="Enter item here..."
								control={control}
							/>
						)}
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						{!isInputField ? (
							<SelectComponent
								name="make"
								label="Make"
								control={control}
								required
								options={miniMake?.list.map(
									(e: { id: string | number; name: string }) => ({
										id: e.id,
										name: e.name,
									})
								)}
								disabled={!getValuesItem?.value}
								helperText={
									getValuesItem
										? ""
										: "Select an item to see make"
								}
								loading={miniMake.loading}
								selectParams={{
									page: miniMake.miniParams.page,
									page_size: miniMake.miniParams.page_size,
									search: miniMake.miniParams.search,
									no_of_pages: miniMake.miniParams.no_of_pages,
									products__id: getValuesItem?.value
										? getValuesItem?.value
										: null,
								}}
								hasMore={
									makeByItem.miniParams.page <
									makeByItem.miniParams.no_of_pages
								}
								fetchapi={getMiniMake}
								clearData={clearMiniMake}
							/>)
							: (
								<FormInput
									name="make_name"
									label="Make"
									required
									type="text"
									placeholder="Enter make here..."
									control={control}
								/>
							)}
					</Grid>
					{/* <Grid size={{ xs: 12, md: 4, lg: 2 }}>
						<SelectComponent
							name="batch"
							label="Batch"
							control={control}
							rules={{ required: true }}
							options={miniBatch.list.map(
								(e: { id: string | number; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							loading={miniBatch.loading}
							selectParams={{
								page: miniBatch.miniParams.page,
								page_size: miniBatch.miniParams.page_size,
								search: miniBatch.miniParams.search,
								no_of_pages: miniBatch.miniParams.no_of_pages,
							}}
							hasMore={
								miniBatch.miniParams.page <
								miniBatch.miniParams.no_of_pages
							}
							fetchapi={getMiniBatch}
							clearData={clearMiniBatch}
						/>
					</Grid> */}

					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="qty"
							label="Quantity"
							required
							type="number"
							placeholder="Enter quantity here..."
							control={control}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						{!isInputField ? (
							<SelectComponent
								name="unit"
								label="Unit"
								control={control}
								required
								disabled={getValuesItem ? false : true}
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
									page_size: miniUnits.miniParams.page_size,
									search: miniUnits.miniParams.search,
									no_of_pages:
										miniUnits.miniParams.no_of_pages,
									item: getValuesItem?.value,
								}}
								hasMore={
									miniUnits.miniParams.page <
									miniUnits.miniParams.no_of_pages
								}
								fetchapi={getMiniUnits}
								clearData={clearMiniUnits}
							/>
						) : (
							<FormInput
								name="unit_name"
								label="Unit"
								required
								type="text"
								placeholder="Enter unit here..."
								control={control}
							/>
						)}
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<TextArea
							name="description"
							label="Description"
							required
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

const MaterialRequestForm = ({
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
		materialRequest: { selectedData, pageParams },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniWarehouse,
		},
	} = useAppSelector((state) => selectMaterialRequest(state));
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
									name="date"
									hideAddon
									minDate={new Date()}
									dateFormat="DD-MM-YYYY"
									showTimeSelect={false}
									timeFormat="h:mm a"
									timeCaption="time"
									inputClass="form-input"
									label={"Required Date"}
									tI={1}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6, xl: 3 }}>
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
					</Grid>
				</Box>
			</form>
		</Grid>
	);
};

const AddMaterialRequest = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		mini: { },
		materialRequest: { selectedData, pageParams, itemPageParams },
	} = useAppSelector((state) => selectMaterialRequest(state));
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
			dispatch(getMRById({ id: id ? id : "" }));
		}
	}, [id]);

	const mrSchema = yup.object().shape({
		date: yup.string().required("Please select a date"),
		description: yup.string().trim().required("Please enter Description"),
	});

	const {
		control,
		handleSubmit,
		reset: mrReset,
	} = useForm<any>({
		resolver: yupResolver(mrSchema),
	});

	useEffect(() => {
		id != "0" &&
			mrReset({
				date: selectedData?.date
					? moment(selectedData.date, "YYYY-MM-DD").toISOString()
					: "",
				description: selectedData?.description
					? selectedData.description
					: "",
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
		{
			title: "Make",
			width: 100,
		},
		// {
		// 	title: "Batch",
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
		item_name: React.JSX.Element,
		make: React.JSX.Element,
		// batch: string,
		quantity: string | number,
		unit: React.JSX.Element,
		description: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			item_name,
			make,
			// batch,
			quantity,
			unit,
			description,
			actions,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.mr_items
			?.filter((e) => !e.dodelete)
			?.map((row: any, key) => {
				const index =
					(itemPageParams.page - 1) * itemPageParams.page_size + (key + 1);

				const description = (
					<ReadMore
						text={row.description ? row.description : ""}
						maxLength={30}
					/>
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
								const fiteredItems = selectedData.mr_items?.map(
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
										mr_items: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);

				const Item = <>{row?.item_name !== "" && row?.item_name !== null && (!row?.item || (row?.item?.label === undefined && row?.item?.value === undefined))
					? row?.item_name
					: row?.item?.name
				}
				</>
				const Make = <>{row?.make_name !== "" && row?.make_name !== null && (!row?.make || (row?.make?.label === undefined && row?.make?.value === undefined))
					?
					<>{row?.make_name}</>
					: row?.make?.name
				}</>
				const Unit = <>{row?.unit_name !== "" && row?.unit_name !== null && (!row?.unit || (row?.unit?.label === undefined && row?.unit?.value === undefined))
					?
					<>{row?.unit_name}</>
					: row?.unit?.name
				}
				</>

				return createData(
					index,
					Item,
					Make,
					parseInt(row.qty),
					Unit,
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

	const itemSchema = yup.object().shape({
		qty: yup
			.number()
			.required("Please enter quantity")
			.typeError("Quantity is required"),
		description: yup.string().trim().required("Please enter a description"),

		item: yup
			.object({
				label: yup.string().required("Please select an item"),
				value: yup.string().required("Please select an item"),
			})
			.nullable()
			.test("item", "Please select an item", function (values) {
				const { item, item_name } = this.parent;
				return Boolean(item || item_name);
			}),
		item_name: yup.string()
			.trim()
			.nullable()
			.test("item_name", "Please enter an item name", function (values) {
				const { item, item_name } = this.parent;
				return Boolean(item || item_name);
			}),
		make: yup
			.object({
				label: yup.string().required("Please select a make"),
				value: yup.string().required("Please select a make"),
			})
			.nullable()
			.test("make", "Please select an make", function (values) {
				const { make, make_name } = this.parent;
				return Boolean(make || make_name);
			}),
		make_name: yup.string()
			.trim()
			.nullable()
			.test("make_name", "Please enter a make name", function (values) {
				const { make, make_name } = this.parent;
				return Boolean(make || make_name);
			}),
		unit: yup
			.object({
				label: yup.string().required("Please select a unit"),
				value: yup.string().required("Please select a unit"),
			})
			.nullable()
			.test("unit", "Please select a unit", function (values) {
				const { unit, unit_name } = this.parent;
				return Boolean(unit || unit_name);
			}),

		unit_name: yup.string()
			.trim()
			.nullable().test("unit_name", "Please enter a unit name", function (values) {
				const { unit, unit_name } = this.parent;
				return Boolean(unit || unit_name);
			}),
	});

	const {
		control: addItemController,
		handleSubmit: handleItemSubmit,
		getValues: getValuesItem,
		reset,
	} = useForm<any>({
		resolver: yupResolver(itemSchema),
		defaultValues: {
			item: null,
		},
	});

	function clearDataFun() {
		navigate(-1);
	}

	const onSave = (payload: any) => {
		const findItem: any = selectedData?.mr_items?.filter(
			(item) => !item.dodelete
		);

		if (findItem?.length != 0) {
			const data = {
				project_id: projectId,
				date: moment(payload.date).format("YYYY-MM-DD"),
				description: payload?.description,
				mr_items:
					id == "0"
						? selectedData?.mr_items
							?.filter((item) => !item.dodelete)
							?.map((item) => {
								return {
									item_id: item?.item?.value,
									make_id: item?.make?.value,
									item_name: item?.item_name,
									make_name: item?.make_name,
									unit_name: item?.unit_name,
									unit_id: item?.unit?.value,
									qty: item.qty,
									description: item?.description,
									required_date: moment(
										payload.date
									).format("YYYY-MM-DD"),
									dodelete: item.dodelete,
								};
							})
						: selectedData?.mr_items?.map((item) => {
							return {
								id: item?.id,
								item_id: item?.item?.value,
								make_id: item?.make?.value,
								item_name: item?.item_name,
								make_name: item?.make_name,
								unit_name: item?.unit_name,
								unit_id: item?.unit?.value,
								qty: item.qty,
								description: item?.description,
								required_date: moment(payload.date).format(
									"YYYY-MM-DD"
								),
								dodelete: item.dodelete,
							};
						}),
			};

			id == "0"
				? dispatch(
					postMaterialRequest({
						data,
						params: {
							...pageParams,
							project_id: projectId,
						},
						mrReset,
						navigate,
					})
				)
				: dispatch(
					editMaterialRequest({
						id: id ? id : "",
						data,
						params: {
							...pageParams,
							project_id: projectId,
						},
						mrReset,
						clearDataFun,
					})
				);
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">Info</p>`,
				text: "Please add atleast one Material Request item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Material Request`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card>
					<CardContent>
						<MaterialRequestForm
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
								count={selectedData?.mr_items?.length ?? 0}
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
									Save Material Request
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

export default AddMaterialRequest;
