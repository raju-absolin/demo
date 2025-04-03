import {
	Avatar,
	Box,
	CircularProgress,
	Grid2 as Grid,
	IconButton,
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
} from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import {
	getMiniCompany,
	getMiniCustomers,
	getMiniTenderNature,
	getMiniTenders,
} from "@src/store/mini/mini.Action";
import {
	clearMiniCompany,
	clearMiniCustomers,
	clearMiniTenders,
	clearTenderNature,
} from "@src/store/mini/mini.Slice";
import {
	isTeamModalOpen,
	selectWorkOrders,
	setSelectedData,
	setUploadDocument,
} from "@src/store/sidemenu/project_management/work_order/work_order.slice";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { memo, useEffect, useMemo } from "react";
import {
	Control,
	RegisterOptions,
	UseFormSetValue,
	WatchObserver,
} from "react-hook-form";
import { LuBook, LuFile, LuPlus, LuX } from "react-icons/lu";
import { useParams } from "react-router-dom";
import AddTeamMembers from "./AddTeamModal";
import { Tender } from "@src/store/sidemenu/tender_mangement/tenders/tenders.types";

interface FormValues {
	tender?: { label?: string; value?: string };
	tender_no?: string;
	department_name?: string;
	company?: { label?: string; value?: string };
	sourceportal?: { label?: string; value?: string };
	tender_type?: { label?: string; value?: number };
	product_type?: { label?: string; value?: number };
	tender_open_datetime?: string;
	tender_due_datetime?: string;
	// Add other fields if necessary
}
interface Props<T extends FormValues> {
	onSave: (value: any) => void;
	handleSubmit: any;
	register: unknown;
	errors: unknown;
	control: Control<any>;
	getValues: any;
	reset: any;
	setValue: UseFormSetValue<T>;
	// withoutBidSelection: boolean;
}

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

const Loader = styled(CircularProgress)(({ theme }) => ({
	display: "block",
	margin: "20px auto",
}));

const HorizontalFilePreview = ({ file }: { file: any }) => {
	const dispatch = useAppDispatch();
	const {
		workOrder: { uploadDocuments },
	} = useAppSelector((state) => selectWorkOrders(state));
	function handleDismiss() {
		const filter = uploadDocuments?.filter((e: any) => e.id != file.id);
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
			id={file.name}
			sx={{
				border: "1px solid",
				borderColor: "divider",
				borderRadius: "6px",
				p: "12px",
				display: "flex",
			}}
			mt={1}>
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
			<IconButton sx={{ marginLeft: "auto", my: "auto" }}>
				<LuX size={18} onClick={() => handleDismiss()} />
			</IconButton>
		</Box>
	);
};

const BidDetailsForm = ({
	onSave,
	handleSubmit,
	register,
	control,
	errors,
	getValues,
	reset,
	setValue,
	// withoutBidSelection,
}: Props<FormValues>) => {
	const dispatch = useAppDispatch();
	const { tenderId, id } = useParams();
	const {
		workOrder: { selectedData, pageParams, uploadDocuments, team_modal },
		tender: { selectedData: tenderSelectedData },
		mini: { miniTenders, miniTenderNature, miniCustomers, miniCompany },
	} = useAppSelector((state) => selectWorkOrders(state));

	const tender_types: { id: string | number; name: string }[] = [
		{ id: 1, name: "Open Tender" },
		{ id: 2, name: "Limited Tender" },
		{ id: 3, name: "SBC" },
	];

	const project_types: { id: string | number; name: string }[] = [
		{
			id: 1,
			name: "Supply",
		},
		{
			id: 2,
			name: "Service",
		},
		{
			id: 3,
			name: "Both",
		},
	];

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

		const documents = [...(uploadDocuments || []), modifiedFiles[0]];

		dispatch(setUploadDocument(documents));
	};

	const getValuesTender = getValues("tender");

	// useMemo(() => {
	// 	if (
	// 		id == "0" &&
	// 		tenderId !== "0" &&
	// 		tenderId != undefined &&
	// 		tenderId != null
	// 	) {
	// 		dispatch(
	// 			getTenderById({
	// 				id: tenderId || "",
	// 			})
	// 		);
	// 	}
	// }, [selectedData?.tender?.id, getValuesTender?.value]);

	// useMemo(() => {
	// 	if (tenderSelectedData?.id) {
	// 		const tender_uploadDocuments = tenderSelectedData.documents?.map(
	// 			(document: {
	// 				file: string;
	// 				tender: {
	// 					id: string;
	// 					tender_no: string;
	// 				};
	// 			}) => {
	// 				const split: string[] | undefined =
	// 					document?.file?.split("/");
	// 				return {
	// 					...document,
	// 					path: split ? split[split.length - 1] : "",
	// 					preview: document?.file,
	// 					formattedSize: "",
	// 				};
	// 			}
	// 		);
	// 		dispatch(setUploadDocument(tender_uploadDocuments));
	// 		dispatch(
	// 			setSelectedData({
	// 				...selectedData,
	// 				tender: tenderSelectedData,
	// 				project_items: tenderSelectedData?.tender_items?.map(
	// 					(e) => {
	// 						return {
	// 							tenderitemmaster: {
	// 								value: e.tenderitemmaster.value,
	// 								label: e.tenderitemmaster.label,
	// 							},
	// 							quantity: e.quantity,
	// 							dodelete: e.dodelete,
	// 						};
	// 					}
	// 				),
	// 			})
	// 		);
	// 	}
	// }, [tenderSelectedData]);

	// const updateFields = (fields: Partial<FormValues>) => {
	// 	Object.entries(fields).forEach(([key, value]) => {
	// 		setValue(key as keyof FormValues, value);
	// 	});
	// };

	// useEffect(() => {
	// 	if (id == "0") {
	// 		updateFields({
	// 			tender: {
	// 				label: selectedData?.tender?.code,
	// 				value: selectedData?.tender?.id,
	// 			},
	// 			tender_no: selectedData?.tender?.tender_no,
	// 			department_name: selectedData?.tender?.department_name,
	// 			company: {
	// 				label: selectedData?.tender?.company?.name,
	// 				value: selectedData?.tender?.company?.id as string,
	// 			},
	// 			sourceportal: {
	// 				label: selectedData?.tender?.sourceportal?.name,
	// 				value: selectedData?.tender?.sourceportal?.id as string,
	// 			},
	// 			tender_type: {
	// 				label: selectedData?.tender?.tender_type_name,
	// 				value: selectedData?.tender?.tender_type?.id,
	// 			},
	// 			product_type: {
	// 				label: selectedData?.tender?.product_type_name,
	// 				value: selectedData?.tender?.product_type as number,
	// 			},
	// 			tender_open_datetime: moment(
	// 				selectedData?.tender?.tender_open_datetime,
	// 				"DD-MM-YYYY HH:mm"
	// 			).toISOString(),
	// 			tender_due_datetime: moment(
	// 				selectedData?.tender?.tender_due_datetime,
	// 				"DD-MM-YYYY HH:mm"
	// 			).toISOString(),
	// 		});
	// 	}
	// }, [selectedData?.tender]);

	return (
		<Grid size={{ xs: 12 }}>
			<form
				style={{ width: "100%" }}
				onSubmit={handleSubmit(onSave as any)}>
				<Box>
					<Grid container spacing={3}>
						<Grid size={{ xs: 12 }}>
							<Typography
								bgcolor={"grey.200"}
								component={"h5"}
								sx={{
									p: "8px",
									display: "flex",
									alignItems: "center",
									mt: 1,
									textTransform: "uppercase",
								}}>
								<LuBook
									size={20}
									style={{ marginRight: "6px" }}
								/>

								<Typography
									component={"span"}
									fontSize={"16px"}
									variant="body1">
									Bid Details
								</Typography>
							</Typography>
						</Grid>
						{tenderId &&
							tenderId !== "0" &&
							tenderId !== "undefined" && (
								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<SelectComponent
										required
										name="tender"
										label="Bid"
										control={control}
										rules={{ required: true }}
										options={miniTenders.list.map(
											(e: {
												id: string | number;
												code: string;
											}) => ({
												id: e.id,
												name: e.code,
											})
										)}
										disabled={
											tenderId !== "0" &&
											tenderId !== "undefined"
												? true
												: false
										}
										helperText={
											tenderId !== "0" &&
											tenderId !== "undefined"
												? "This field is disabled"
												: ""
										}
										// onChange={(e) => {
										// 	if (e) {
										// 		dispatch(
										// 			getTenderById({
										// 				id: e?.value,
										// 			})
										// 		)
										// 			.then((res: any) => {
										// 				console.log(res);
										// 				const response: Tender =
										// 					res.payload.response;
										// 				updateFields({
										// 					tender: {
										// 						label: response?.code,
										// 						value: response?.id,
										// 					},
										// 					tender_no:
										// 						response?.tender_no,
										// 					department_name:
										// 						response?.department_name,
										// 					company: {
										// 						label: response
										// 							?.company?.name,
										// 						value: response
										// 							?.company
										// 							?.id as string,
										// 					},
										// 					sourceportal: {
										// 						label: response
										// 							?.sourceportal
										// 							?.name,
										// 						value: response
										// 							?.sourceportal
										// 							?.id as string,
										// 					},
										// 					tender_type: {
										// 						label: response?.tender_type_name,
										// 						value: response?.tender_type as number,
										// 					},
										// 					product_type: {
										// 						label: response?.product_type_name,
										// 						value: response?.product_type as number,
										// 					},
										// 					tender_open_datetime:
										// 						moment(
										// 							response?.tender_open_datetime,
										// 							"DD-MM-YYYY HH:mm"
										// 						).toISOString(),
										// 					tender_due_datetime:
										// 						moment(
										// 							response?.tender_due_datetime,
										// 							"DD-MM-YYYY HH:mm"
										// 						).toISOString(),
										// 				});
										// 			})
										// 			.catch((err) =>
										// 				console.log(err)
										// 			);
										// 	} else {
										// 		updateFields({
										// 			tender: e,
										// 			tender_no: "",
										// 			department_name: "",
										// 			company: undefined,
										// 			sourceportal: undefined,
										// 			tender_type: undefined,
										// 			product_type: undefined,
										// 			tender_open_datetime: "",
										// 			tender_due_datetime: "",
										// 		});
										// 		dispatch(setUploadDocument([]));
										// 	}
										// }}
										loading={miniTenders.loading}
										selectParams={{
											page: miniTenders.miniParams.page,
											page_size:
												miniTenders.miniParams
													.page_size,
											search: miniTenders.miniParams
												.search,
											no_of_pages:
												miniTenders.miniParams
													.no_of_pages,
										}}
										hasMore={
											miniTenders.miniParams.page <
											miniTenders.miniParams.no_of_pages
										}
										fetchapi={getMiniTenders}
										clearData={clearMiniTenders}
									/>
								</Grid>
							)}
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required
								name="company"
								label="Company"
								control={control}
								rules={{ required: true }}
								disabled={
									tenderId !== "0" && tenderId !== "undefined"
										? true
										: false
								}
								options={miniCompany.list.map(
									(e: {
										id: string | number;
										name: string;
									}) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={miniCompany.loading}
								selectParams={{
									page: miniCompany.miniParams.page,
									page_size: miniCompany.miniParams.page_size,
									search: miniCompany.miniParams.search,
									no_of_pages:
										miniCompany.miniParams.no_of_pages,
								}}
								hasMore={
									miniCompany.miniParams.page <
									miniCompany.miniParams.no_of_pages
								}
								fetchapi={getMiniCompany}
								clearData={clearMiniCompany}
							/>
						</Grid>
						{tenderId &&
							tenderId !== "0" &&
							tenderId !== "undefined" && (
								<Grid size={{ xs: 12, md: 6, lg: 3 }}>
									<FormInput
										required
										name="tender_no"
										label="Bid No"
										disabled={
											tenderId !== "0" &&
											tenderId !== "undefined"
												? true
												: false
										}
										type="text"
										placeholder="Enter tender number here..."
										control={control}
									/>
								</Grid>
							)}
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<FormInput
								required
								name="department_name"
								label="Department Name"
								disabled={
									tenderId !== "0" && tenderId !== "undefined"
										? true
										: false
								}
								type="text"
								placeholder="Enter department name here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required={true}
								name="product_type"
								label="Product Type"
								control={control}
								rules={{ required: true }}
								options={project_types}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required
								name="tender_type"
								label="Bid Type"
								control={control}
								disabled={
									tenderId !== "0" && tenderId !== "undefined"
										? true
										: false
								}
								rules={{ required: true }}
								options={tender_types}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required
								name="sourceportal"
								label="Source Portal"
								control={control}
								disabled={
									tenderId !== "0" && tenderId !== "undefined"
										? true
										: false
								}
								rules={{ required: true }}
								options={miniTenderNature.list.map(
									(e: {
										id: string | number;
										name: string;
									}) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={miniTenderNature.loading}
								selectParams={{
									page: miniTenderNature.miniParams.page,
									page_size:
										miniTenderNature.miniParams.page_size,
									search: miniTenderNature.miniParams.search,
									no_of_pages:
										miniTenderNature.miniParams.no_of_pages,
								}}
								hasMore={
									miniTenderNature.miniParams.page <
									miniTenderNature.miniParams.no_of_pages
								}
								fetchapi={getMiniTenderNature}
								clearData={clearTenderNature}
							/>
						</Grid>

						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Stack flex={1}>
								<CustomDatepicker
									required
									control={control}
									name="tender_open_datetime"
									hideAddon
									dateFormat="DD-MM-YYYY hh:mm a"
									showTimeSelect
									timeFormat="h:mm a"
									disabled={
										tenderId !== "0" &&
										tenderId !== "undefined"
											? true
											: false
									}
									timeCaption="time"
									inputClass="form-input"
									// minDate={new Date()}
									label={"Bid Open Date & Time"}
									tI={1}
								/>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Stack flex={1}>
								<CustomDatepicker
									required
									control={control}
									name="tender_due_datetime"
									hideAddon
									dateFormat="DD-MM-YYYY hh:mm a"
									showTimeSelect
									timeFormat="h:mm a"
									disabled={
										tenderId !== "0" &&
										tenderId !== "undefined"
											? true
											: false
									}
									timeCaption="time"
									inputClass="form-input"
									// minDate={new Date()}
									label={"Bid Due Date & Time"}
									tI={1}
								/>
							</Stack>
						</Grid>
					</Grid>
					<Grid container spacing={2} mt={2}>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Box>
								<FileUploader
									name={"documents"}
									control={control}
									showPreview={false}
									text={"Select a file..."}
									icon={LuPlus}
									iconSize={20}
									selectedFiles={
										uploadDocuments ? uploadDocuments : []
									}
									label="Documents"
									handleAcceptedFiles={handleAcceptedFiles}
								/>
							</Box>
						</Grid>

						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<ScrollableList>
								{uploadDocuments?.length != 0 &&
									uploadDocuments?.map((document) => {
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
					</Grid>
				</Box>
			</form>
		</Grid>
	);
};

export default memo(BidDetailsForm);
