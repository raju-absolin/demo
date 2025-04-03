import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
	Box,
	Button,
	Chip,
	Divider,
	Grid2 as Grid,
	IconButton,
	Stack,
	Tooltip,
	Typography,
	useTheme,
	Zoom,
} from "@mui/material";
import { left, right } from "@popperjs/core";
import { CustomDatepicker, FormInput } from "@src/components";
import TextArea from "@src/components/form/TextArea";
import {
	ApproveCaseSheet,
	editCaseSheet,
	getCaseSheetById,
	getCaseSheets,
	postCaseSheet,
	RejectCasesheet,
} from "@src/store/sidemenu/tender_mangement/caseSheet/caseSheet.action";
import {
	selectCaseSheets,
	setApprove_or_reject_modal,
	setSelectedData,
} from "@src/store/sidemenu/tender_mangement/caseSheet/caseSheet.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
	LuBook,
	LuCheck,
	LuCreditCard,
	LuPen,
	LuPersonStanding,
	LuToyBrick,
	LuUser,
	LuX,
} from "react-icons/lu";
import { useParams, useNavigate } from "react-router-dom";
import * as yup from "yup";
import ApproveRejectModal from "./ApproveRejectModal";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniTenderNature } from "@src/store/mini/mini.Action";
import { clearTenderNature } from "@src/store/mini/mini.Slice";
import { StyleSheet, Font } from "@react-pdf/renderer";
import { pdf, Document, Page, Image, View, Text } from "@react-pdf/renderer";
import { CaseSheetPrintContent } from "@src/pages/sidemenu/PrintPDF/casesheetDetails";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";
import ApprovalWorkflow from "@src/components/Approvals";

const AddCaseSheet = () => {
	// add item form
	const { id, tab } = useParams();
	const navigate = useNavigate();

	const dispatch = useAppDispatch();
	const {
		caseSheet: {
			selectedData,
			pageParams,
			approve_loading,
			reject_loading,
			approve_or_reject_modal,
			dailouge_name,
		},
		tenders: { selectedData: tenderSelectedData },
		system: { userAccessList },
	} = useAppSelector((state) => selectCaseSheets(state));

	const {
		company: { companyData },
	} = useAppSelector((state) => {
		return {
			company: companySelector(state),
		};
	});

	const CaseSheetSchema = yup.object().shape({
		pre_bid_date: yup.string().required("Please enter pre bid date"),
		contact_person: yup
			.string()
			.required("Contact person is required")
			.min(2, "Contact person must be at least 2 characters")
			.test(
				"no-empty-spaces",
				"Contact person cannot be empty spaces",
				(value) => !!value && value.trim().length > 0
			),
		department_name: yup
			.string()
			.required("Department name is required")
			.min(2, "Department name must be at least 2 characters")
			.test(
				"no-empty-spaces",
				"Department name cannot be empty spaces",
				(value) => !!value && value.trim().length > 0
			),
		phone: yup
			.string()
			// .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
			.min(10, "Phone number must be exactly 10 digits")
			.max(10, "Phone number must be exactly 10 digits")
			.required("Phone number is required"),
		email: yup
			.string()
			.email("Email is not valid")
			.required("Email is required"),
		estimate_bid_price: yup
			.number()
			.nullable() // Allow null
			.transform((value, originalValue) =>
				originalValue === "" ? null : value
			) // Transform empty strings to null
			.required("Estimated bid price is required")
			.min(0, "Estimated bid price must be a positive number"),
		is_extension_request: yup
			.object({
				label: yup.string().required("extension request is required"),
				value: yup.string().required("extension request is required"),
			})
			.required("extension request is required"),
		is_site_visit: yup
			.object({
				label: yup.string().required("site visit is required"),
				value: yup.string().required("site visit is required"),
			})
			.required("site visit is required"),

		// is_reverse_auction: yup
		// 	.object({
		// 		label: yup.string().required("reverse auction is required"),
		// 		value: yup.string().required("reverse auction is required"),
		// 	})
		// 	.required("reverse auction is required"),

		pre_bid_subject: yup.string().required("Pre bid subject is required"),
		last_tender_rate: yup.string().required("Pre bid subject is required"),
		last_tender_date: yup.string().required("Last tender date is required"),
		oem_challenges: yup
			.string()
			.required("OEM challenge is required")
			.min(2, "OEM challenge must be at least 2 characters"),
		documents_not_submitted_evaluation_matrix: yup
			.string()
			.required("Evaluation Matrix is required")
			.min(2, "Evaluation Matrix must be at least 2 characters"),
		pendingdocumentsOEM: yup
			.string()
			.required("Pending documents OEM is required")
			.min(2, "Pending documents OEM must be at least 2 characters"),
		department_challenges: yup
			.string()
			.required("Department challenge is required")
			.min(2, "Department challenge must be at least 2 characters"),
	});

	const {
		control,
		handleSubmit,
		reset: caseSheetReset,
		getValues,
		setValue,
	} = useForm({
		resolver: yupResolver(CaseSheetSchema),
		[id == "0" ? "defaultValues" : "values"]: {
			pre_bid_date: selectedData?.pre_bid_date
				? moment(
						selectedData.pre_bid_date,
						"DD-MM-YYYY hh:mm a"
					).toISOString()
				: "",
			contact_person: selectedData?.contact_person
				? selectedData?.contact_person
				: "",
			department_name: selectedData?.department_name
				? selectedData?.department_name
				: "",
			phone: selectedData?.phone ? selectedData?.phone : "",
			email: selectedData?.email ? selectedData?.email : "",
			estimate_bid_price: selectedData?.estimate_bid_price
				? selectedData?.estimate_bid_price
				: "",
			is_extension_request: selectedData?.is_extension_request
				? {
						label: selectedData?.is_extension_request
							? "Yes"
							: "No",
						value: selectedData?.is_extension_request,
					}
				: null,
			is_site_visit: selectedData?.is_site_visit
				? {
						label: selectedData?.is_site_visit ? "Yes" : "No",
						value: selectedData?.is_site_visit,
					}
				: null,
			is_reverse_auction: tenderSelectedData?.is_reverse_auction
				? {
						label: tenderSelectedData?.is_reverse_auction
							? "Yes"
							: "No",
						value: tenderSelectedData?.is_reverse_auction,
					}
				: null,
			pre_bid_subject: selectedData?.pre_bid_subject
				? selectedData?.pre_bid_subject
				: "",
			last_tender_date: selectedData?.last_tender_date
				? selectedData?.last_tender_date
				: "",
			last_tender_rate: selectedData?.last_tender_rate
				? selectedData?.last_tender_rate
				: "",
			documents_not_submitted_evaluation_matrix:
				selectedData?.oem_challenges
					? selectedData?.oem_challenges
					: "",
			department_challenges: selectedData?.department_challenges
				? selectedData?.department_challenges
				: "",
		},
	});

	const hide = () => {
		// reset();
	};
	const {
		caseSheet: { caseSheetList },
	} = useAppSelector((state) => selectCaseSheets(state));

	const handleAdd = (values: any) => {
		const data = {
			tender_id: id,
			pre_bid_date: values?.pre_bid_date
				? moment(values.pre_bid_date).format("DD-MM-YYYY hh:mm a")
				: "",
			contact_person: values?.contact_person
				? values?.contact_person
				: "",
			department_name: values?.department_name
				? values?.department_name
				: "",
			oem_challenges: values?.oem_challenges,
			phone: values?.phone ? values?.phone : "",
			email: values?.email ? values?.email : "",
			estimate_bid_price: values?.estimate_bid_price
				? values?.estimate_bid_price
				: "",
			is_extension_request: values?.is_extension_request?.value
				? values?.is_extension_request?.value
				: false,
			is_site_visit: values?.is_site_visit?.value
				? values?.is_site_visit?.value
				: false,
			is_reverse_auction: values?.is_reverse_auction?.value
				? values?.is_reverse_auction?.value
				: "",
			pre_bid_subject: values?.pre_bid_subject
				? values?.pre_bid_subject
				: "",
			last_tender_date: values?.last_tender_date
				? moment(values.last_tender_date).format("YYYY-MM-DD")
				: "",
			last_tender_rate: values?.last_tender_rate
				? values?.last_tender_rate
				: "",
			documents_not_submitted_evaluation_matrix:
				values?.documents_not_submitted_evaluation_matrix
					? values?.documents_not_submitted_evaluation_matrix
					: "",
			department_challenges: values?.department_challenges
				? values?.department_challenges
				: "",
			pendingdocumentsOEM: values?.pendingdocumentsOEM
				? values?.pendingdocumentsOEM
				: "",
		};

		!selectedData?.id
			? dispatch(
					postCaseSheet({
						data,
						params: pageParams,
						hide,
					})
				)
			: dispatch(
					editCaseSheet({
						id: selectedData.id,
						data,
						params: pageParams,
						hide,
					})
				);

		//
	};

	useEffect(() => {
		dispatch(
			getCaseSheets({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
				tender: id,
			})
		);
		dispatch(setSelectedData({}));
		dispatch(setCompanyData({}));
	}, []);

	const theme = useTheme();

	const ApproveRejectSchema = yup.object().shape({
		status: yup.string().required("Status is Required"),
		costing_remarks: yup.string().optional(),
		remarks: yup.string().optional(),
	});

	const {
		control: ApproveRejectControl,
		handleSubmit: handleApproveRejectSubmit,
		reset: ApproveRejectReset,
	} = useForm<any>({
		resolver: yupResolver(ApproveRejectSchema),
		// [id == "0" ? "defaultValues" : "values"]: {},
	});

	useEffect(() => {
		if (selectedData && selectedData?.id != "0") {
			ApproveRejectReset({
				status: selectedData?.authorized_status,
				costing_remarks: selectedData?.costing_remarks,
				remarks: selectedData?.remarks,
			});
		}
	}, [selectedData]);

	const closeModal = (isOpen: boolean) => {
		dispatch(
			setApprove_or_reject_modal({
				isOpen: isOpen,
				dailouge_name: "Change Status",
				caseSheet: {},
			})
		);
		ApproveRejectReset();
	};

	// const handleModalSubmit = handleApproveRejectSubmit(
	// 	(payload: {
	// 		status: string | number;
	// 		costing_remarks: string;
	// 		remarks: string;
	// 	}) => {
	// 		const data = {
	// 			...payload,
	// 		};

	// 		if (payload?.status == 2) {
	// 			dispatch(
	// 				ApproveCaseSheet({
	// 					id: selectedData?.id ? selectedData?.id : "",
	// 					data,
	// 					params: pageParams,
	// 					closeModal,
	// 				})
	// 			);
	// 		} else {
	// 			dispatch(
	// 				RejectCasesheet({
	// 					id: selectedData?.id ? selectedData?.id : "",
	// 					data,
	// 					params: pageParams,
	// 					closeModal,
	// 				})
	// 			);
	// 		}
	// 	}
	// );
	const sitevisitOption: { id: boolean; name: string }[] = [
		{ id: true, name: "Yes" },
		{ id: false, name: "No" },
	];

	async function handlePrintDoc(companyData: any) {
		const blob = await pdf(
			<CaseSheetPrintContent
				caseSheetList={caseSheetList[0]}
				companyData={companyData}
			/>
		).toBlob();
		var blobURL = URL.createObjectURL(blob);

		var iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		iframe.style.display = "none";
		iframe.src = blobURL;
		iframe.onload = function () {
			setTimeout(function () {
				iframe.focus();
				iframe.contentWindow?.print();
			}, 1);
		};
	}
	async function handleDownload(companyData: any) {
		const blob = await pdf(
			<CaseSheetPrintContent
				caseSheetList={caseSheetList[0]}
				companyData={companyData}
			/>
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "Tender_CaseSheet.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} else {
			console.error("Failed to generate PDF");
		}
	}

	return (
		<Box>
			{/* <ApproveRejectModal
				modal={approve_or_reject_modal}
				closeModal={closeModal}
				dailouge_name={dailouge_name}
				control={ApproveRejectControl}
				handleSubmit={handleModalSubmit}
			/> */}

			{caseSheetList && caseSheetList.length > 0 ? (
				// View screen with data from caseSheetList
				caseSheetList.map((each) => {
					return (
						<Box
							p={4}
							sx={{
								backgroundColor:
									theme.palette.background.default,
								borderRadius: 2,
							}}>
							{/* Centered Title */}
							<Stack
								direction={"row"}
								alignItems="center"
								justifyContent={"center"}
								spacing={1}>
								<Typography
									variant="h4"
									align="center"
									gutterBottom
									sx={{
										fontWeight: "bold",
										color: "#3f51b5",
									}}>
									Case Sheet Details
								</Typography>
							</Stack>

							<Grid container justifyContent="flex-end">
								{userAccessList?.indexOf(
									"TenderManagement.change_casesheet"
								) !== -1 && (
									<Button
										onClick={() => {
											const caseSheetId = each?.id;
											if (caseSheetId) {
												navigate(
													`/tenders/view/${id}/${tab}/case_sheet/${caseSheetId}`
												);
											}
										}}>
										Edit
									</Button>
								)}
								{userAccessList?.indexOf(
									"TenderManagement.view_casesheet"
								) !== -1 && (
									<Button
										onClick={() => {
											if (
												!companyData ||
												Object.keys(companyData)
													.length === 0
											) {
												dispatch(
													getCompanyById({
														id: caseSheetList[0]
															?.tender?.company
															?.id,
													})
												).then(async (res: any) => {
													handlePrintDoc(
														res.payload?.response
													);
												});
											} else {
												handlePrintDoc(companyData);
											}
										}}>
										Print
									</Button>
								)}
								{userAccessList?.indexOf(
									"TenderManagement.view_casesheet"
								) !== -1 && (
									<Button
										onClick={() => {
											if (
												!companyData ||
												Object.keys(companyData)
													.length === 0
											) {
												dispatch(
													getCompanyById({
														id: caseSheetList[0]
															?.tender?.company
															?.id,
													})
												).then(async (res: any) => {
													handleDownload(
														res.payload?.response
													);
												});
											} else {
												handleDownload(companyData);
											}
										}}>
										Download
									</Button>
								)}
							</Grid>

							{/* Divider for separation */}
							<Divider sx={{ my: 2 }} />

							{/* Case Sheet Information in Grid */}
							<Grid container spacing={3}>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Contact Person:</strong>{" "}
										{each.contact_person}
									</Typography>
								</Grid>

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Phone:</strong> {each.phone}
									</Typography>
								</Grid>

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Email:</strong> {each.email}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Department Name:</strong>{" "}
										{each.department_name}
									</Typography>
								</Grid>

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Estimated Bid Price:</strong>{" "}
										{each.estimate_bid_price}
									</Typography>
								</Grid>

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Pre Bid Subject:</strong>{" "}
										{each.pre_bid_subject}
									</Typography>
								</Grid>

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Pre Bid Date:</strong>{" "}
										{each.pre_bid_date}
									</Typography>
								</Grid>

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Last Bid Date:</strong>{" "}
										{moment(each.last_tender_date).format(
											"DD-MM-YYYY"
										)}
									</Typography>
								</Grid>

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>OEM Challenges:</strong>{" "}
										{each.oem_challenges}
									</Typography>
								</Grid>

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Department Challenges:</strong>{" "}
										{each.department_challenges}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>
											Documents Not Submitted Per Bid
											Evaluation Matrix:
										</strong>{" "}
										{
											each.documents_not_submitted_evaluation_matrix
										}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>
											Pending Documents from OEM:
										</strong>{" "}
										{each.pendingdocumentsOEM}
									</Typography>
								</Grid>

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Is Extension Request:</strong>{" "}
										{each.is_extension_request
											? "Yes"
											: "No"}
									</Typography>
								</Grid>

								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Is Site Visit:</strong>{" "}
										{each.is_site_visit ? "Yes" : "No"}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<strong>Is Reserve Auction:</strong>{" "}
										{each.is_reverse_auction ? "Yes" : "No"}
									</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Typography variant="body1">
										<Stack
											direction={"row"}
											spacing={1}
											alignItems={"center"}>
											<strong>Status:</strong>{" "}
											<span>
												{!each.authorized_status ? (
													"None"
												) : (
													<Chip
														label={
															<Typography>
																{
																	each.authorized_status_name
																}
															</Typography>
														}
														color={(() => {
															let tagColor:
																| "default"
																| "primary"
																| "secondary"
																| "success"
																| "error"
																| "info"
																| "warning" =
																"default";
															switch (
																each.authorized_status
															) {
																case 1:
																	tagColor =
																		"warning";
																	break;
																case 2:
																	tagColor =
																		"success"; // MUI does not have 'blue', using 'info' instead
																	break;
																case 3:
																	tagColor =
																		"error";
																	break;
																case 4:
																	tagColor =
																		"error";
																	break;
																default:
																	tagColor =
																		"default"; // Fallback color
															}
															return tagColor;
														})()}
													/>
												)}
											</span>
										</Stack>
									</Typography>
								</Grid>
							</Grid>
							<Grid container spacing={3}>
								<Grid size={{ xs: 12, md: 4 }}>
									<ApprovalWorkflow
										data={each}
										app_label={"TenderManagement"}
										model_name={"casesheet"}
										instance_id={id || ""}
										callback={() => {
											dispatch(
												getCaseSheets({
													...pageParams,
													search: "",
													page: 1,
													page_size: 10,
													tender: id,
												})
											);
										}}
									/>
								</Grid>
							</Grid>
						</Box>
					);
				})
			) : (
				<form action="">
					<Grid container spacing={2}>
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
								<LuUser
									size={20}
									style={{ marginRight: "6px" }}
								/>
								<Typography
									component={"span"}
									fontSize={"16px"}
									variant="body1">
									Contact Details
								</Typography>
							</Typography>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
							<FormInput
								name="contact_person"
								label="Contact Person Name"
								required
								type="text"
								placeholder="Enter contact person name here..."
								control={control}
							/>
						</Grid>

						<Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
							<FormInput
								name="phone"
								label="Phone Number"
								required
								type="number"
								placeholder="Enter phone number here..."
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
							<FormInput
								name="email"
								label="Email"
								required
								type="email"
								placeholder="Email"
								control={control}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
							<FormInput
								name="department_name"
								required
								label="Department Name"
								type="text"
								placeholder="Enter contact person name here..."
								control={control}
							/>
						</Grid>

						{/* <Grid size={{ xl: 12 }} /> */}

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
									Pre Bid Details
								</Typography>
							</Typography>
						</Grid>

						<Grid size={{ xs: 12 }}>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, md: 6, lg: 3, xl: 3 }}>
									<FormInput
										name="estimate_bid_price"
										label="Estimated Bid Price"
										required
										type="number"
										placeholder="Estimated Bid Price..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 3, xl: 3 }}>
									<Stack width={"100%"}>
										<CustomDatepicker
											control={control}
											name="pre_bid_date"
											required
											hideAddon
											dateFormat="DD-MM-YYYY hh:mm a"
											showTimeSelect={true}
											timeFormat="h:mm a"
											timeCaption="time"
											inputClass="form-input"
											// minDate={new Date()}
											label={"Pre Bid Date & Time"}
											tI={1}
										/>
									</Stack>
								</Grid>
								<Grid size={{ xs: 12 }}>
									<TextArea
										control={control}
										required
										label={"Pre Bid Subject"}
										name={"pre_bid_subject"}
										placeholder={
											"Enter Pre Bid Subject here..."
										}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										minRows={5}
									/>
								</Grid>
							</Grid>
						</Grid>

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
								<LuCreditCard
									size={20}
									style={{ marginRight: "6px" }}
								/>
								<Typography
									component={"span"}
									fontSize={"16px"}
									variant="body1">
									Last Purchase Details
								</Typography>
							</Typography>
						</Grid>

						<Grid size={{ xs: 12 }}>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, md: 6, lg: 3, xl: 3 }}>
									<Stack width={"100%"}>
										<CustomDatepicker
											control={control}
											name="last_tender_date"
											hideAddon
											required
											dateFormat="DD-MM-YYYY"
											showTimeSelect={false}
											timeFormat="h:mm a"
											timeCaption="time"
											inputClass="form-input"
											label={"Last Purchase Date"}
											tI={1}
										/>
									</Stack>
								</Grid>
								<Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
									<FormInput
										name="last_tender_rate"
										label="Last Purchase Price"
										required
										type="number"
										placeholder="Enter last purchase price here..."
										control={control}
									/>
								</Grid>
							</Grid>
						</Grid>

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
								<LuToyBrick
									size={20}
									style={{ marginRight: "6px" }}
								/>
								<Typography
									component={"span"}
									fontSize={"16px"}
									variant="body1">
									Miscillenous
								</Typography>
							</Typography>
						</Grid>

						<Grid
							size={{ xs: 12, md: 6, lg: 3, xl: 6 }}
							sx={{ maxWidth: "50%" }}>
							<TextArea
								control={control}
								label={"OEM Challenge"}
								required
								name={"oem_challenges"}
								placeholder={"Enter OEM Challenge here..."}
								containerSx={{
									display: "grid",
									gap: 1,
								}}
							/>
						</Grid>

						<Grid
							size={{ xs: 12, md: 6, lg: 3, xl: 6 }}
							sx={{ maxWidth: "50%" }}>
							<TextArea
								control={control}
								required
								label={"Department Challenge"}
								name={"department_challenges"}
								placeholder={
									"Enter user Department Challenge here..."
								}
								containerSx={{
									display: "grid",
									gap: 1,
								}}
							/>
						</Grid>
						<Grid
							size={{ xs: 12, md: 6, lg: 3, xl: 6 }}
							sx={{ maxWidth: "50%" }}>
							<TextArea
								control={control}
								required
								label={
									"Documents Not Submitted Per Bid Evaluation Matrix"
								}
								name={
									"documents_not_submitted_evaluation_matrix"
								}
								placeholder={
									"List documents that have not been submitted as per the bid evaluation matrix"
								}
								containerSx={{
									display: "grid",
									gap: 1,
								}}
							/>
						</Grid>
						<Grid
							size={{ xs: 12, md: 6, lg: 3, xl: 6 }}
							sx={{ maxWidth: "50%" }}>
							<TextArea
								control={control}
								required
								label={"Pending Documents from OEM"}
								name={"pendingdocumentsOEM"}
								placeholder={
									"Specify documents that are pending from the OEM."
								}
								containerSx={{
									display: "grid",
									gap: 1,
								}}
							/>
						</Grid>
						<Grid size={{ xl: 12 }} />

						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required
								name="is_extension_request"
								label="Bid Extension Request Sent"
								control={control}
								options={sitevisitOption}
							/>
						</Grid>
						{/* <Grid size={{ xl: 12 }} /> */}
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								name="is_site_visit"
								label="Site Visit"
								control={control}
								required
								options={sitevisitOption}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								name="is_reverse_auction"
								label="Reverse Auction"
								control={control}
								options={[
									{
										id: true,
										name: "Yes",
									},
									{
										id: false,
										name: "No",
									},
								].map((e: { id: boolean; name: string }) => ({
									id: e.id,
									name: e.name,
								}))}
							/>
						</Grid>
					</Grid>

					<Grid container justifyContent="flex-end" mt={3.4}>
						<Button
							variant="contained"
							onClick={handleSubmit(handleAdd as any)}
							type="submit"
							color="primary"
							autoFocus>
							Save Case Sheet
						</Button>
					</Grid>
				</form>
			)}
		</Box>
	);
};

export default AddCaseSheet;
