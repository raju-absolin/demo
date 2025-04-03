import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Divider,
	Grid2 as Grid,
	List,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import {
	CustomDatepicker,
	FileType,
	FileUploader,
	FormInput,
	HorizontalFilePreview,
} from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import {
	getMiniItems,
	getMiniLeads,
	getMiniUnits,
	getMiniUsers,
} from "@src/store/mini/mini.Action";
import {
	clearMiniItems,
	clearMiniLeads,
	clearMiniUnits,
	clearMiniUsers,
} from "@src/store/mini/mini.Slice";
import {
	editBudgetQuotationData,
	postBudgetQuotationData,
} from "@src/store/sidemenu/strategic_management/budget_quotation/bq.action";
import {
	selectBudgetQuotations,
	setAttachments,
	setLeadItems,
	setSelectedData,
	setVendorEvaluationCriteriaAttachments,
} from "@src/store/sidemenu/strategic_management/budget_quotation/bq.slice";
import {
	BudgetQuotation,
	RequestDataPayload,
} from "@src/store/sidemenu/strategic_management/budget_quotation/bq.types";
import {
	getLeadById,
	getVendorsByItems,
} from "@src/store/sidemenu/strategic_management/leads/leads.action";
import {
	clearVendorsAganistItems,
	selectLeads,
} from "@src/store/sidemenu/strategic_management/leads/leads.slice";
import { LeadItem } from "@src/store/sidemenu/strategic_management/leads/leads.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { Dispatch, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { LuDelete, LuPlus } from "react-icons/lu";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import { v4 as uuidV4 } from "uuid";

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "200px",
	marginTop: "0px",
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

const AddBudgetQuotation = ({ setEdit }: { setEdit: any }) => {
	const {
		budgetQuotation: {
			selectedData,
			pageParams,
			attachments,
			VECattachments,
		},
		leads: { selectedData: leadSelectedData, vendorsAganistItems },
		mini: {
			miniUserList,
			miniUserLoading,
			miniUserParams,
			miniLeads,
			miniItemsList,
			miniUnits,
		},
	} = useAppSelector((state) => selectBudgetQuotations(state));

	const { id } = useParams();

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (id !== "0") {
			dispatch(getLeadById({ id: id ? id : "" }));
		}
	}, [id]);

	const headerSchema = yup.object().shape({
		date: yup.string().required("Date is required"),
		project_title: yup
			.string()
			.trim()
			.required("Project Title is required"),
		vendor_evaluation_criteria: yup
			.object({
				label: yup
					.string()
					.required("Vendor Evaluation Criteria is required"),
				value: yup
					.boolean()
					.typeError("Validation Criteria is required")
					.required("Vendor Evaluation Criteria is required"),
			})
			.required("Vendor Evaluation Criteria is required"),
		organization_name: yup.string().required("company is required"),

		// new changes
		pre_qualification_criteria: yup
			.string()
			.required("Pre-Qualification Criteria is required"),
		pre_qualification_requirement: yup
			.string()
			.required("Pre-Qualification Requirement is required"),
	});

	const {
		control,
		handleSubmit,
		reset,
		setValue: headerSetValue,
		watch: watchHeaderValues,
	} = useForm<any>({
		resolver: yupResolver(headerSchema),
	});

	const vendorEvaluationCriteria = watchHeaderValues(
		"vendor_evaluation_criteria"
	);

	useEffect(() => {
		headerSetValue("bdm_name", leadSelectedData?.bdm?.fullname);
		dispatch(setLeadItems(leadSelectedData?.lead_items));
	}, [leadSelectedData]);

	useEffect(() => {
		if (selectedData?.id) {
			reset({
				date: selectedData?.date,
				bdm_name: selectedData?.bdm?.fullname,
				project_title: selectedData?.scope_of_work,
				vendor_evaluation_criteria:
					selectedData?.vendor_evaluation_criteria,
				organization_name: selectedData?.organization_name,
				pre_qualification_criteria:
					selectedData?.pre_qualification_criteria || "",
				pre_qualification_requirement:
					selectedData?.pre_qualification_requirement || "",
			});
		}
	}, [selectedData]);

	const handleAdd = (values: any) => {
		const documents = attachments;

		const data: RequestDataPayload = {
			id: selectedData?.id,
			date: moment(values?.date).format("YYYY-MM-DD"),
			bdm_id: leadSelectedData?.bdm?.id?.toString() || "",
			scope_of_work: values?.project_title,
			vendor_evaluation_criteria:
				values?.vendor_evaluation_criteria?.value,
			organization_name: values?.organization_name,

			pre_qualification_criteria: values.pre_qualification_criteria ?? "",
			pre_qualification_requirement:
				values.pre_qualification_requirement ?? "",
			// user_id: values?.user?.value,
			lead_id: id ? id : "",
			budgetaryquotationitems: selectedData?.budgetaryquotationitems?.map(
				(item) => {
					return {
						id: item?.id,
						item_id: item.item.value ? item.item.value : "",
						quantity: item.quantity ? item.quantity : "",
						item_specifications: item.item_specifications
							? item.item_specifications
							: "",
						dodelete: item.dodelete ? item.dodelete : false,
						vendor_ids: item.vendors?.map((item) => item.value),
						unit_id: item.unit?.value ? item.unit?.value : "",
					};
				}
			),
		};
		!selectedData?.id
			? dispatch(
					postBudgetQuotationData({
						data,
						params: pageParams,
						resetBudgetQuotationForm: () => {
							reset();
							setEdit(false);
							dispatch(
								setVendorEvaluationCriteriaAttachments([])
							);
							dispatch(setAttachments([]));
						},
						documents: documents || [],
						VECattachments: VECattachments || [],
					})
				)
			: dispatch(
					editBudgetQuotationData({
						id: selectedData.id,
						data,
						params: pageParams,
						resetBudgetQuotationForm: () => {
							reset();
							setEdit(false);
							dispatch(
								setVendorEvaluationCriteriaAttachments([])
							);
							dispatch(setAttachments([]));
						},
						documents: documents || [],
						VECattachments: VECattachments || [],
					})
				);

		//
	};
	const bodySchema = yup.object().shape({
		item: yup
			.object({
				label: yup.string().required("Please select a item"),
				value: yup.string().required("Please select a item"),
			})
			.required("Please select a item"),
		vendors: yup
			.array()
			.of(
				yup.object().shape({
					label: yup.string().required("Each make must have a label"),
					value: yup.string().required("Each make must have a value"),
				})
			)
			.min(1, "Select at least one vendor")
			.required("Please select a vendor"),
		unit: yup
			.object({
				label: yup.string().required("Please select a unit"),
				value: yup.string().required("Please select a unit"),
			})
			.required("Please select a unit"),
		quantity: yup
			.number()
			.required("Quantity is required")
			.typeError("Quantity must be a number")
			.min(1, "Quantity must be greater than 0"), // Enforcing greater than 0
		item_specifications: yup
			.string()
			.required("Item specifications are required"),
	});

	const {
		control: bodyContoller,
		handleSubmit: handleBodySubmit,
		reset: resetBody,
		getValues,
		setValue,
	} = useForm<any>({
		resolver: yupResolver(bodySchema),
	});

	const getValuesItem = getValues("item");
	const handleAddItem = (payload: any) => {
		const findItem: any = selectedData?.budgetaryquotationitems?.find(
			(item: LeadItem) =>
				item?.item?.value == payload?.item?.value &&
				item?.unit?.value == payload?.unit?.value
		);
		const addData = () => {
			const data = {
				...payload,
				dodelete: false,
			};
			dispatch(
				setSelectedData({
					...selectedData,
					budgetaryquotationitems: [
						...(selectedData?.budgetaryquotationitems || []), // Ensure pqitems is an array
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
				resetBody({
					item: null,
					quantity: "",
					unit: null,
					vendors: [],
					item_specifications: "",
				});
			} else {
				Swal.fire({
					title: `<p style="font-size:20px">Item Already Exist</p>`,
					text: "To change the quantity of an item, please delete it first and then add it again with the updated quantity.",
					icon: "warning",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}
		} else {
			addData();
			resetBody({
				item: null,
				quantity: "",
				unit: null,
				vendors: [],
				item_specifications: "",
			});
		}
	};
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
			title: "Unit",
			width: 100,
		},
		{
			title: "Vendor",
			width: 100,
		},
		{
			title: "Specifications",
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
		quantity: string | number, //React.JSX.Element,
		unit: React.JSX.Element,
		vendor: string,
		specifications: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			quantity,
			unit,
			vendor,
			specifications,
			actions,
		};
	}
	const rows = useMemo(() => {
		return selectedData?.budgetaryquotationitems
			?.filter((e) => !e?.dodelete)
			?.map((row, key) => {
				setValue(`items.${key}.quantity` as any, row.quantity);
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);
				const specifications = (
					<ReadMore
						text={
							row.item_specifications
								? row.item_specifications
								: ""
						}
						maxLength={30}
					/>
				);
				const quantity = (
					<Box>
						<form>
							<FormInput
								name={`items.${key}.quantity`}
								label=""
								disabled={row?.item ? false : true}
								helperText={"Quantity"}
								type="number"
								placeholder="Enter quantity here..."
								control={control}
								onInput={(e: any) => {
									// Enforce maximum of 5 digits
									if (e.target.value.length > 5) {
										e.target.value = e.target.value.slice(
											0,
											5
										);
									}
								}}
								onChange={(event) => {
									dispatch(
										setSelectedData({
											...selectedData,
											budgetaryquotationitems:
												selectedData?.budgetaryquotationitems?.map(
													(e) => {
														if (
															e?.item?.value ===
																row?.item
																	?.value &&
															e?.unit?.value ===
																row?.unit?.value
														) {
															return {
																...e,
																quantity:
																	event.target
																		.value,
															};
														}
														return e;
													}
												),
										})
									);
								}}
							/>
						</form>
					</Box>
				);

				const unit = <Box>{row?.unit?.label}</Box>;
				const vendor = row?.vendors
					?.map((item: { name: string; id: string }) => {
						return item?.name;
					})
					.join(", ");
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
									selectedData?.budgetaryquotationitems?.map(
										(e) => {
											if (
												e.item.value ==
													row?.item.value &&
												e.unit?.value ==
													row?.unit?.value
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
										budgetaryquotationitems: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);

				return createData(
					index,
					row?.item?.label,
					Number(row?.quantity),
					unit,
					vendor,
					specifications,
					actions
				);
			});
	}, [selectedData, createData]);

	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

		/**
		 * Formats the size
		 */
		const formatBytes = (bytes: number, decimals: number = 2) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = [
				"Bytes",
				"KB",
				"MB",
				"GB",
				"TB",
				"PB",
				"EB",
				"ZB",
				"YB",
			];

			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return (
				parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
				" " +
				sizes[i]
			);
		};

		// Creating a new array with the modified files
		const modifiedFiles = files.map((file) =>
			Object.assign({}, file, {
				originalObj: file,
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);

		dispatch(setAttachments(modifiedFiles));
	};

	const handleVendorEvaluationCriteriaAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

		/**
		 * Formats the size
		 */
		const formatBytes = (bytes: number, decimals: number = 2) => {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = [
				"Bytes",
				"KB",
				"MB",
				"GB",
				"TB",
				"PB",
				"EB",
				"ZB",
				"YB",
			];

			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return (
				parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
				" " +
				sizes[i]
			);
		};

		// Creating a new array with the modified files
		const modifiedFiles = files.map((file) =>
			Object.assign({}, file, {
				id: uuidV4(),
				originalObj: file,
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);

		const documents = VECattachments?.concat(modifiedFiles);

		dispatch(setVendorEvaluationCriteriaAttachments(documents));
	};

	const setBQVendorEvaluationCriteriaAttachments = (params: any[]) => {
		dispatch(setVendorEvaluationCriteriaAttachments(params));
	};
	const setBQAttachments = (params: any[]) => {
		dispatch(setAttachments(params));
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			gap={2}>
			<Typography
				variant="h4"
				align="center"
				gutterBottom
				sx={{ fontWeight: "bold", color: "#3f51b5" }}>
				{/* {selectedData?.id ? "Update" : "Add"} */}
				Budget Quotation
			</Typography>
			<Box width={"100%"}>
				<form action="">
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Stack>
								<CustomDatepicker
									control={control}
									name="date"
									hideAddon
									required
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
							<FormInput
								name="bdm_name"
								label="BD Name"
								type="text"
								disabled
								placeholder="Enter name here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								name="organization_name"
								label="Company Name"
								type="text"
								required
								placeholder="Enter company name here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								required
								name="project_title"
								label="Project Title"
								type="text"
								placeholder="Enter Project Title here..."
								control={control}
							/>
						</Grid>

						<Grid size={{ xs: 12 }} container>
							<Grid size={{ xs: 12, md: 6, lg: 3 }} mb={1}>
								<SelectComponent
									required
									name="vendor_evaluation_criteria"
									label="Vendor Evaluation Criteria"
									control={control}
									rules={{ required: true }}
									options={[
										{
											id: true,
											name: "Yes",
										},
										{
											id: false,
											name: "No",
										},
									]}
									onChange={(data) => {
										if (!data?.value) {
											dispatch(
												setVendorEvaluationCriteriaAttachments(
													[]
												)
											);
										}
									}}
								/>
							</Grid>

							{vendorEvaluationCriteria?.value && (
								<>
									<Grid
										size={{ xs: 12, md: 6, lg: 3 }}
										mb={1}>
										<FileUploader
											label="Vendor Evaluation Criteria Documents"
											name={""}
											control={control}
											showPreview={false}
											text={"Select a file..."}
											icon={LuPlus}
											iconSize={20}
											selectedFiles={
												VECattachments
													? VECattachments
													: []
											}
											handleAcceptedFiles={
												handleVendorEvaluationCriteriaAcceptedFiles
											}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 6 }} mb={1}>
										<ScrollableList>
											<Grid container spacing={2}>
												{VECattachments &&
													VECattachments?.length >
														0 &&
													VECattachments?.filter(
														(attachment) =>
															!attachment?.dodelete
													)?.map((attachment) => {
														return (
															<Grid
																size={{
																	xs: 12,
																	lg: 6,
																}}>
																{attachment?.path && (
																	<HorizontalFilePreview
																		file={
																			attachment
																		}
																		attachments={
																			VECattachments
																		}
																		setAttachments={
																			setBQVendorEvaluationCriteriaAttachments
																		}
																	/>
																)}
															</Grid>
														);
													})}
											</Grid>
										</ScrollableList>
									</Grid>
								</>
							)}
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								name="pre_qualification_criteria"
								label="Pre-Qualification Criteria"
								type="text"
								required
								placeholder="Enter Pre-Qualification Criteria here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								name="pre_qualification_requirement"
								label="Pre-Qualification Requirement"
								type="text"
								required
								placeholder="Enter Pre-Qualification Requirement here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							{attachments?.filter(
								(e) => !e.dodelete && e.preview
							)?.length == 0 && (
								<FileUploader
									label="Documents"
									name={"documents"}
									control={control}
									showPreview={false}
									text={"Select a file..."}
									icon={LuPlus}
									iconSize={20}
									selectedFiles={
										attachments ? attachments : []
									}
									handleAcceptedFiles={handleAcceptedFiles}
								/>
							)}
							<ScrollableList>
								{attachments &&
									attachments?.length > 0 &&
									attachments
										?.filter(
											(e) => !e.dodelete && e.preview
										)
										.map((attachment) => {
											return (
												attachment?.path && (
													<HorizontalFilePreview
														file={attachment}
														attachments={
															attachments
														}
														setAttachments={
															setBQAttachments
														}
													/>
												)
											);
										})}
							</ScrollableList>
						</Grid>
					</Grid>
				</form>
			</Box>
			<Divider sx={{ width: "100%", mt: 2 }} />
			<Box mt={2}>
				<form action="" onSubmit={handleBodySubmit(handleAddItem)}>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required
								name="item"
								label="Item"
								control={bodyContoller}
								rules={{ required: true }}
								options={miniItemsList?.list?.map(
									(e: { id: boolean; name: string }) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={miniItemsList.loading}
								selectParams={{
									page: miniItemsList.miniParams.page,
									page_size:
										miniItemsList.miniParams.page_size,
									search: miniItemsList.miniParams.search,
									no_of_pages:
										miniItemsList.miniParams.no_of_pages,
								}}
								onChange={(value) => {
									resetBody({
										item: value,
										quantity: "",
										unit: null,
										vendor: null,
										item_specifications: "",
									});
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
							<FormInput
								required
								name="quantity"
								label="Quantity"
								disabled={getValuesItem ? false : true}
								helperText={
									getValuesItem
										? ""
										: "Select an item to enter quantity"
								}
								type="number"
								placeholder="Enter quantity here..."
								control={bodyContoller}
								onInput={(e: any) => {
									// Enforce maximum of 5 digits
									if (e.target.value.length > 5) {
										e.target.value = e.target.value.slice(
											0,
											5
										);
									}
								}}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required
								name="unit"
								label="Unit"
								control={bodyContoller}
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
									page_size: miniUnits.miniParams.page_size,
									search: miniUnits.miniParams.search,
									no_of_pages:
										miniUnits.miniParams.no_of_pages,
									item: getValuesItem?.value
										? getValuesItem?.value
										: "",
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
							<SelectComponent
								required
								name="vendors"
								disabled={getValuesItem ? false : true}
								helperText={
									// selectedData &&
									!getValuesItem?.value
										? "Select an item to see vendors"
										: ""
								}
								label="Vendor"
								control={bodyContoller}
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
								loading={vendorsAganistItems?.loading}
								selectParams={{
									page: vendorsAganistItems.miniParams.page,
									page_size:
										vendorsAganistItems.miniParams
											.page_size,
									search: vendorsAganistItems.miniParams
										.search,
									no_of_pages:
										vendorsAganistItems.miniParams
											.no_of_pages,
									item_ids: getValuesItem?.value
										? [getValuesItem?.value]
										: [],
								}}
								hasMore={
									vendorsAganistItems.miniParams.page <
									vendorsAganistItems.miniParams.no_of_pages
								}
								fetchapi={getVendorsByItems}
								clearData={clearVendorsAganistItems}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<TextArea
								required
								name="item_specifications"
								label="Item Specifications"
								type="text"
								placeholder="Write Item Specifications here..."
								minRows={3}
								maxRows={5}
								containerSx={{
									display: "grid",
									gap: 1,
								}}
								control={bodyContoller}
							/>
						</Grid>

						<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={5}>
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
			<TableComponent
				count={selectedData?.budgetaryquotationitems?.length ?? 0}
				columns={columns}
				rows={rows ? rows : []}
				loading={false}
				page={1}
				pageSize={10}
				handleChangePage={() => {}}
				handleChangeRowsPerPage={() => {}}
				showPagination={false}
			/>
			<Grid size={{ xs: 12 }}>
				<Stack justifyContent="flex-end">
					<Box display={"flex"} justifyContent={"flex-end"}>
						<Button
							variant="contained"
							onClick={handleSubmit(handleAdd as any)}
							type="submit"
							color="primary"
							autoFocus>
							Save
						</Button>
					</Box>
				</Stack>
			</Grid>
		</Box>
	);
};

export default AddBudgetQuotation;
