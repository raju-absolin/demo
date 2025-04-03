import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Grid2 as Grid,
	Paper,
	Stack,
	Tabs,
	Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	selectCaseSheets,
	setSelectedData,
} from "@src/store/sidemenu/tender_mangement/caseSheet/caseSheet.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import TextArea from "@src/components/form/TextArea";
import GoBack from "@src/components/GoBack";
import { CustomDatepicker, FormInput } from "@src/components";
import {
	editCaseSheet,
	getCaseSheetById,
	postCaseSheet,
} from "@src/store/sidemenu/tender_mangement/caseSheet/caseSheet.action";
import SelectComponent from "@src/components/form/SelectComponent";
import { LuBook, LuCreditCard, LuToyBrick, LuUser } from "react-icons/lu";

const CaseSheetEdit = () => {
	const { tenderId, caseSheetId, tab } = useParams();
	const navigate = useNavigate();

	const dispatch = useAppDispatch();

	const {
		caseSheet: { selectedData, pageParams },
	} = useAppSelector((state) => selectCaseSheets(state));

	const cleardata = () => {
		dispatch(setSelectedData({}));
	};

	useEffect(() => {
		cleardata();
	}, []);

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

		is_reverse_auction: yup
			.object({
				label: yup.string().required("reverse auction is required"),
				value: yup.string().required("reverse auction is required"),
			})
			.required("reverse auction is required"),

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

	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(CaseSheetSchema),
		values: {
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
			is_reverse_auction: selectedData?.is_reverse_auction
				? {
						label: selectedData?.is_reverse_auction ? "Yes" : "No",
						value: selectedData?.is_reverse_auction,
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
			oem_challenges: selectedData?.oem_challenges
				? selectedData?.oem_challenges
				: "",
			pendingdocumentsOEM: selectedData?.pendingdocumentsOEM
				? selectedData?.pendingdocumentsOEM
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
		navigate(-1);
	};

	useEffect(() => {
		if (caseSheetId) {
			dispatch(getCaseSheetById({ id: caseSheetId }));
		}
	}, [caseSheetId]);

	const handleAdd = (values: any) => {
		const data = {
			tender_id: tenderId,
			pre_bid_date: values?.pre_bid_date
				? moment(values.pre_bid_date).format("DD-MM-YYYY hh:mm a")
				: "",
			contact_person: values?.contact_person
				? values?.contact_person
				: "",
			department_name: values?.department_name
				? values?.department_name
				: "",

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
			oem_challenges: values?.oem_challenges
				? values?.oem_challenges
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
						id: caseSheetId,
						data,
						params: pageParams,
						hide,
					})
				);

		//
	};

	const sitevisitOption: { id: boolean; name: string }[] = [
		{ id: true, name: "Yes" },
		{ id: false, name: "No" },
	];

	return (
		<div>
			<Box>
				<GoBack
					is_goback={true}
					title={`Case Sheet Update`}
					go_back_url={`/tenders/view/${tenderId}/${tab}/case_sheet/`}
					showSaveButton={false}
					loading={false}>
					<Card
						sx={{
							mt: 2,
						}}>
						<CardContent>
							<form action="">
								<Grid container spacing={2}>
									<Grid size={{ xs: 12 }}>
										<Typography
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
									<Grid
										size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
										<FormInput
											name="contact_person"
											label="Contact Person Name"
											type="text"
											required
											placeholder="Enter contact person name here..."
											control={control}
										/>
									</Grid>

									<Grid
										size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
										<FormInput
											name="phone"
											label="Phone Number"
											type="number"
											required
											placeholder="Enter phone number here..."
											control={control}
										/>
									</Grid>
									<Grid
										size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
										<FormInput
											name="email"
											label="Email"
											type="email"
											required
											placeholder="Email"
											control={control}
										/>
									</Grid>
									<Grid
										size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
										<FormInput
											name="department_name"
											label="Department Name"
											type="text"
											required
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
											<Grid
												size={{
													xs: 12,
													md: 6,
													lg: 3,
													xl: 3,
												}}>
												<Stack width={"100%"}>
													<CustomDatepicker
														control={control}
														name="pre_bid_date"
														hideAddon
														dateFormat="DD-MM-YYYY hh:mm a"
														showTimeSelect={true}
														timeFormat="h:mm a"
														timeCaption="time"
														inputClass="form-input"
														required
														minDate={new Date()}
														label={
															"Pre Bid Date & Time"
														}
														tI={1}
													/>
												</Stack>
											</Grid>
											<Grid
												size={{
													xs: 12,
													md: 6,
													lg: 3,
													xl: 3,
												}}>
												<FormInput
													name="estimate_bid_price"
													label="Estimated Bid Price"
													type="number"
													required
													placeholder="Estimated Bid Price..."
													control={control}
												/>
											</Grid>
											<Grid
												size={{ xs: 12, md: 6, lg: 6 }}>
												<TextArea
													control={control}
													label={"Pre Bid Subject"}
													name={"pre_bid_subject"}
													placeholder={
														"Enter Pre Bid Subject here..."
													}
													required
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
											<Grid
												size={{
													xs: 12,
													md: 6,
													lg: 3,
													xl: 3,
												}}>
												<Stack width={"100%"}>
													<CustomDatepicker
														control={control}
														name="last_tender_date"
														hideAddon
														dateFormat="DD-MM-YYYY"
														showTimeSelect={false}
														timeFormat="h:mm a"
														timeCaption="time"
														inputClass="form-input"
														label={
															"Last Purchase Date"
														}
														required
														tI={1}
													/>
												</Stack>
											</Grid>
											<Grid
												size={{
													xs: 12,
													md: 6,
													lg: 4,
													xl: 3,
												}}>
												<FormInput
												required
													name="last_tender_rate"
													label="Last Purchase Price"
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
											required
											label={"OEM Challenge"}
											name={"oem_challenges"}
											placeholder={
												"Enter OEM Challenge here..."
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
											name="is_extension_request"
											label="Bid Extension Request Sent"
											control={control}
											required
											options={sitevisitOption}
										/>
									</Grid>
									{/* <Grid size={{ xl: 12 }} /> */}
									<Grid size={{ xs: 12, md: 6, lg: 3 }}>
										<SelectComponent
											name="is_site_visit"
											label="Site Visit"
											required
											control={control}
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
											].map(
												(e: {
													id: boolean;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
										/>
									</Grid>
								</Grid>

								<Grid
									container
									justifyContent="flex-end"
									mt={3.4}>
									<Button
										variant="contained"
										onClick={handleSubmit(handleAdd as any)}
										type="submit"
										color="primary"
										autoFocus>
										Save
									</Button>
								</Grid>
							</form>
						</CardContent>
					</Card>
				</GoBack>
			</Box>
		</div>
	);
};

export default CaseSheetEdit;
