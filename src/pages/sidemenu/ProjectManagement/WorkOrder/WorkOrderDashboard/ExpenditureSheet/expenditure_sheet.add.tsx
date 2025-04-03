import { yupResolver } from "@hookform/resolvers/yup";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
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
import { Control, useForm } from "react-hook-form";
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
import SelectComponent from "@src/components/form/SelectComponent";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	selectExpenditureSheet,
	setSelectedData,
	setUploadDocument,
} from "@src/store/sidemenu/project_management/ExpenditureSheet/expenditure_sheet.slice";
import ReadMore from "@src/components/ReadMoreText";
import TextArea from "@src/components/form/TextArea";
import {
	editExpenditureSheet,
	getExpenditureSheetById,
	postExpenditureSheet,
} from "@src/store/sidemenu/project_management/ExpenditureSheet/expenditure_sheet.action";
import { v4 as uuidv4 } from "uuid";
import { updateSidenav } from "@src/store/customise/customise";
import { getExpenditureType } from "@src/store/masters/ExpenditureType/expenditure.action";
import {
	clearMiniExpenditureType,
	clearMiniExpenses,
} from "@src/store/mini/mini.Slice";
import {
	getMiniExpenditureType,
	getMiniExpenses,
} from "@src/store/mini/mini.Action";
import { getWorkOrderById } from "@src/store/sidemenu/project_management/work_order/work_order.action";

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

const AddItemForm = ({ control, handleSubmit, reset, getValues }: any) => {
	const dispatch = useAppDispatch();
	const {
		expenditureSheet: { selectedData, document_loading, uploadDocuments },
		mini: { miniItemsList, miniExpenditureType, miniExpenses },
	} = useAppSelector((state) => selectExpenditureSheet(state));

	// const [attachments, setAttachments] = useState<any>([]);

	interface SelectTypes {
		label: string;
		value: string;
	}

	const TYPEOFEXPENDITURE_CHOICES = [
		{
			id: 1,
			name: "Expenses Claim",
		},
		{
			id: 2,
			name: "Payment Request",
		},
	];
	const handleAddItem = (payload: {
		expenditureType: SelectTypes;
		expenses: SelectTypes;
		place_of_visit: string;
		date: string;
		amount: string;
		description: string;
		remarks: SelectTypes;
		documents: [];
	}) => {
		// setAttachments(payload?.documents);

		console.log(payload);

		// setAttachments([]);
		const data = {
			...payload,
			uuid: uuidv4(),
			dodelete: false,
		};
		dispatch(
			setSelectedData({
				...selectedData,
				expendituresheetitems: [
					...(selectedData?.expendituresheetitems || []),
					{
						...data,
						documents: uploadDocuments,
					},
				],
			})
		);
		reset({
			amount: "",
			description: "",
			place_of_visit: "",
			documents: [],
			date: "",
			expenses: null,
			expendituretype: null,
			unit: null,
		});
		dispatch(setUploadDocument([]));
		// }
	};

	const getValuesItem = getValues("item");
	const handleAcceptedFiles = (
		files: FileType[],
		callback?: (files: FileType[]) => void
	) => {
		if (callback) callback(files);

		// setAttachments([]);
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
				uuid: uuidv4(),
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);

		const documents = [...(uploadDocuments || []), modifiedFiles[0]];
		// setAttachments(documents);

		dispatch(setUploadDocument(documents));
	};

	return (
		<Box mt={2}>
			<form action="" onSubmit={handleSubmit(handleAddItem)}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<Stack flex={1}>
							<CustomDatepicker
								control={control}
								required
								name="date"
								hideAddon
								dateFormat="DD-MM-YYYY"
								showTimeSelect={false}
								timeFormat="h:mm a"
								timeCaption="time"
								inputClass="form-input"
								// minDate={moment().add(1, "day").toDate()}
								label={"Date"}
								tI={1}
							/>
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="place_of_visit"
							required
							label="Place of visit/Purpose"
							type="text"
							placeholder="Enter Place of visit/Purpose here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="expendituretype"
							label="Expenditure Type"
							control={control}
							rules={{ required: true }}
							options={TYPEOFEXPENDITURE_CHOICES}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							name="expenses"
							label="Expenses"
							control={control}
							rules={{ required: true }}
							options={miniExpenses?.list}
							loading={miniExpenses?.loading}
							selectParams={{
								page: miniExpenses?.miniParams?.page,
								page_size: miniExpenses?.miniParams?.page_size,
								search: miniExpenses?.miniParams?.search,
								no_of_pages:
									miniExpenses?.miniParams?.no_of_pages,
							}}
							hasMore={
								miniExpenses?.miniParams?.page <
								miniExpenses?.miniParams?.no_of_pages
							}
							fetchapi={getMiniExpenses}
							clearData={clearMiniExpenses}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="amount"
							label="Amount"
							type="number"
							placeholder="Enter amount here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<TextArea
							name="description"
							label="Description"
							type="text"
							placeholder="Write Description here..."
							minRows={1}
							maxRows={5}
							containerSx={{
								display: "grid",
								gap: 1,
							}}
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<TextArea
							name="remarks"
							label="Remarks"
							type="text"
							placeholder="Write Remarks here..."
							minRows={1}
							maxRows={5}
							containerSx={{
								display: "grid",
								gap: 1,
							}}
							control={control}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2} mt={2}>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FileUploader
							label="Documents"
							name={"documents"}
							control={control}
							showPreview={false}
							text={
								!document_loading
									? "Select a file..."
									: "Loading Please Wait..."
							}
							icon={!document_loading ? LuPlus : LuLoader}
							iconSize={20}
							selectedFiles={
								uploadDocuments ? uploadDocuments : []
							}
							handleAcceptedFiles={handleAcceptedFiles}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={2}>
						<ScrollableList>
							{uploadDocuments?.length != 0 &&
								uploadDocuments?.map(
									(document: { path: any }) => {
										return (
											document?.path && (
												<HorizontalFilePreview
													file={document}
												/>
											)
										);
									}
								)}
						</ScrollableList>
					</Grid>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={3.7}>
					<Button
						color="primary"
						type="submit"
						variant="contained"
						size="large">
						Add Item
					</Button>
				</Grid>
			</form>
		</Box>
	);
};

const HorizontalFilePreview = ({ file }: { file: any }) => {
	const dispatch = useAppDispatch();
	const {
		expenditureSheet: { uploadDocuments },
	} = useAppSelector((state) => selectExpenditureSheet(state));
	function handleDismiss() {
		const filter = uploadDocuments?.filter((e) => e.id != file.id);
		dispatch(setUploadDocument(filter));
	}
	let fileName = "";
	if (!file?.path) return "";

	const dotIndex = file?.path.lastIndexOf(".");
	const baseName =
		dotIndex > 0 ? file?.path?.substring(0, dotIndex) : file?.path;

	fileName =
		baseName.length > 15 ? baseName.substring(0, 15) + "..." : baseName;

	return (
		<Box
			mt={2}
			id={file.name}
			sx={{
				border: "none",
				borderColor: "divider",
				borderRadius: "6px",
				p: "12px",
				display: "flex",
			}}>
			<Box
				sx={{ display: "flex", alignItems: "center", gap: "12px" }}
				onClick={() => {
					window.open(file.preview);
				}}>
				{file.preview ? (
					<Avatar
						variant="rounded"
						sx={{
							height: "48px",
							width: "48px",
							bgcolor: "grey",
							objectFit: "cover",
						}}
						alt={file.path}
						src={file.preview}
					/>
				) : (
					<Typography
						component={"span"}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "primary.main",
							fontWeight: 600,
							borderRadius: "6px",
							height: "48px",
							width: "48px",
							bgcolor: "#3e60d51a",
						}}>
						<LuFile />
					</Typography>
				)}
				<Box>
					<Typography sx={{ fontWeight: 600, color: "grey.700" }}>
						{fileName}
					</Typography>
					<Typography component={"p"} color={"grey.700"}>
						{file.formattedSize}
					</Typography>
				</Box>
			</Box>
			{/* <IconButton sx={{ marginLeft: "auto", my: "auto" }}>
				<LuX size={18} onClick={() => handleDismiss()} />
			</IconButton> */}
		</Box>
	);
};

const ExpenditureSheetForm = ({
	onSave,
	handleSubmit,
	control,
	setValue,
}: {
	onSave: (value: any) => void;
	handleSubmit: any;
	setValue: any;
	control: Control<any>;
}) => {
	const dispatch = useAppDispatch();
	const {
		expenditureSheet: {
			selectedData,
			pageParams,
			uploadDocuments,
			document_loading,
		},
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniExpenditureType,
		},
	} = useAppSelector((state) => selectExpenditureSheet(state));
	const navigate = useNavigate();
	const { id, projectId } = useParams();

	const MODEOFPAYMENT_CHOICES = [
		{
			id: 1,
			name: "Online",
		},
		{
			id: 2,
			name: "Cash",
		},
		{
			id: 3,
			name: "Other",
		},
	];

	useEffect(() => {
		dispatch(
			getWorkOrderById({
				id: projectId ? projectId : "",
			})
		).then((res: any) => {
			setValue("project", res?.payload?.response?.code);
		});
	}, []);

	return (
		<Grid size={{ xs: 12 }}>
			<form style={{ width: "100%" }} onSubmit={handleSubmit(onSave)}>
				<Box p={1}>
					<Grid container spacing={3}>
						{/* <Grid size={{ xs: 12, md: 4, xl: 2 }}>
                            <Stack width={"100%"}>
                                <CustomDatepicker
                                    control={control}
                                    name="date"
                                    hideAddon
                                    minDate={new Date()}
                                    dateFormat="DD-MM-YYYYY"
                                    showTimeSelect={false}
                                    timeFormat="h:mm a"
                                    timeCaption="time"
                                    inputClass="form-input"
                                    label={"Date"}
                                    tI={1}
                                />
                            </Stack>
                        </Grid> */}
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								name="project"
								required
								label="Name of the Case/Project"
								type="text"
								disabled
								placeholder="Enter Name of the Case/Project here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								name="mode_of_payment"
								label="Mode Of Payment"
								control={control}
								rules={{ required: true }}
								options={MODEOFPAYMENT_CHOICES}
							/>
						</Grid>
						{/* <Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								name="received_amount"
								label="Received Amount"
								type="number"
								placeholder="Enter amount here..."
								control={control}
							/>
						</Grid> */}
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
					</Grid>
				</Box>
			</form>
		</Grid>
	);
};

const AddExpenditureSheet = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, projectId } = useParams();
	const {
		mini: {},
		expenditureSheet: { selectedData, pageParams, uploadDocuments },
	} = useAppSelector((state) => selectExpenditureSheet(state));
	function clearDataFn() {
		dispatch(setSelectedData({}));
		dispatch(setUploadDocument([]));
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
			dispatch(getExpenditureSheetById({ id: id ? id : "" }));
		}
	}, [id]);

	const esSchema = yup.object().shape({
		// date: yup.string().required("Please select a date"),
		description: yup.string().trim().required("Please enter description"),
		// received_amount: yup.string().required("Please enter received amount"),
		mode_of_payment: yup
			.object({
				label: yup.string().required("Please select mode of payment"),
				value: yup.string().required("Please select mode of payment"),
			})
			.required("Please select mode of payment"),
	});

	const {
		control,
		handleSubmit,
		reset: esReset,
		setValue,
	} = useForm<any>({
		resolver: yupResolver(esSchema),
	});

	useEffect(() => {
		id != "0" &&
			esReset({
				// received_amount: selectedData?.received_amount
				// 	? selectedData.received_amount
				// 	: "",
				mode_of_payment: selectedData?.mode_of_payment
					? {
							label: selectedData?.mode_of_payment_name,
							value: selectedData?.mode_of_payment,
						}
					: null,
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
			title: "Place Of Visit",
			width: 100,
		},
		{
			title: "Expenditure Type",
			width: 100,
		},
		{
			title: "Expenses",
			width: 100,
		},
		{
			title: "Amount",
			width: 100,
		},
		{
			title: "Description",
			width: 100,
		},
		{
			title: "Remarks",
			width: 100,
		},
		{
			title: "Attachments",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		place_of_visit: string,
		expendituretype: string,
		expenses: string,
		amount: string | number,
		description: React.JSX.Element,
		remarks: React.JSX.Element,
		attachments: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			place_of_visit,
			expendituretype,
			expenses,
			amount,
			description,
			remarks,
			attachments,
			actions,
		};
	}
	console.log("uploadDocuments", uploadDocuments);
	const rows = useMemo(() => {
		return selectedData?.expendituresheetitems
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
				const remarks = (
					<ReadMore
						text={row.remarks ? row.remarks : ""}
						maxLength={30}
					/>
				);
				const attachments = (
					<Grid
						size={{ xs: 12, md: 6, lg: 3 }}
						sx={{ cursor: "pointer" }}>
						<ScrollableList>
							{row?.documents?.length != 0 &&
								row?.documents?.map((document: any) => {
									return (
										document?.path && (
											<HorizontalFilePreview
												file={document}
											/>
										)
									);
								})}
						</ScrollableList>
					</Grid>
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
									selectedData.expendituresheetitems?.map(
										(e: any) => {
											if (e?.id == row?.id) {
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
										expendituresheetitems: fiteredItems,
									})
								);
							}}
						/>
					</Box>
				);
				return createData(
					index,
					row?.place_of_visit,
					row?.expendituretype?.label,
					row?.expenses?.label,
					row?.amount,
					description,
					remarks,
					attachments,
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
		expendituretype: yup.object({
			label: yup.string().required("Please select type of expenditure"),
			value: yup.string().required("Please select type of expenditure"),
		}),
		expenses: yup.object({
			label: yup.string().required("Please select expenses"),
			value: yup.string().required("Please select expenses"),
		}),
		// date: yup.string().required("Please enter Required date"),
		place_of_visit: yup.string().required("Please enter place of visit"),
		date: yup.string().required("Please enter date"),
		amount: yup.string().required("Please enter amount"),
		description: yup.string().trim().required("Please enter a description"),
		remarks: yup.string().trim().required("Please enter a remarks"),
	});

	const {
		control: addItemController,
		handleSubmit: handleItemSubmit,
		getValues: getValuesItem,
		reset,
	} = useForm<any>({
		resolver: yupResolver(itemSchema),
		[id == "0" ? "defaultValues" : "values"]: {
			items:
				selectedData?.expendituresheetitems &&
				selectedData.expendituresheetitems.map((item) => ({
					expendituretype: item?.expendituretype
						? {
								label: item?.expendituretype_name
									? item?.expendituretype_name
									: "",
								value: item?.expendituretype
									? item?.expendituretype
									: "",
							}
						: null,
					place_of_visit: item?.place_of_visit,
					date: item?.date,
					expenses: item?.expances
						? {
								label: item?.expances?.name
									? item?.expances?.name
									: "",
								value: item?.expances?.id
									? item?.expances?.id
									: "",
							}
						: null,
					document: item?.documents ? item?.documents : null,
				})),
		},
	});

	const onSave = (payload: any) => {
		const findItem: any = selectedData?.expendituresheetitems?.filter(
			(item) => !item.dodelete
		);
		if (findItem?.length != 0) {
			// const documents = uploadDocuments?.length
			// 	? uploadDocuments.map((e) => e)
			// 	: [];

			const data = {
				project_id: projectId,
				description: payload?.description,
				// received_amount: payload?.received_amount,
				mode_of_payment: payload?.mode_of_payment?.value,
				expendituresheetitems:
					id == "0"
						? selectedData?.expendituresheetitems
								?.filter((item) => !item.dodelete)
								?.map((item) => {
									const formData = new FormData();

									item?.documents?.map(
										(e: any, index: number) => {
											formData.append(
												`items[${index}][documents][]`,
												e.originalObj
											);
										}
									);

									return {
										expendituretype:
											item?.expendituretype?.value,
										date: moment(item?.date).format(
											"YYYY-MM-DD"
										),
										documents: formData,
										place_of_visit: item?.place_of_visit,
										expances_id: item?.expenses?.value,
										amount: item.amount,
										description: item?.description,
										remarks: item?.remarks,
										dodelete: item.dodelete,
									};
								})
						: selectedData?.expendituresheetitems?.map((item) => {
								const formData = new FormData();

								item?.documents?.map(
									(e: any, index: number) => {
										formData.append(
											`items[${index}][documents][]`,
											e.originalObj
										);
									}
								);
								return {
									id: item?.id,
									expendituretype:
										item?.expendituretype?.value,
									date: moment(item?.date).format(
										"YYYY-MM-DD"
									),
									documents: formData,
									place_of_visit: item?.place_of_visit,
									expances_id: item?.expenses?.value,
									amount: item.amount,
									description: item?.description,
									remarks: item?.remarks,
									dodelete: item.dodelete,
								};
							}),
			};
			id == "0"
				? dispatch(
						postExpenditureSheet({
							data,
							params: {
								...pageParams,
							},
							esReset,
							navigate,
							// documents,
						})
					)
				: dispatch(
						editExpenditureSheet({
							id: id ? id : "",
							data,
							params: {
								...pageParams,
							},
							esReset,
							navigate,
							// documents,
						})
					);
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">Info</p>`,
				text: "Please add atleast one Expenditure Sheet item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Expenditure Sheet`}
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 1,
				}}>
				<Card>
					<CardContent>
						<ExpenditureSheetForm
							onSave={onSave}
							handleSubmit={handleSubmit}
							control={control}
							setValue={setValue}
						/>
						<Divider sx={{ mt: 2, mb: 2 }} />
						<AddItemForm
							control={addItemController}
							handleSubmit={handleItemSubmit}
							reset={reset}
							getValues={getValuesItem}
						/>
						<Box mt={2}>
							<TableComponent
								count={
									selectedData?.expendituresheetitems
										?.length ?? 0
								}
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
									Save Expenditure Sheet
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

export default AddExpenditureSheet;
