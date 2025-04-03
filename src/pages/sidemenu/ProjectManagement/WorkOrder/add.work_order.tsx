import { Box, Button, Card, CardContent } from "@mui/material";
import GoBack from "@src/components/GoBack";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectDetailsForm from "./components/BidDetailsForm";
import ProjectItems, { useProjectFormItem } from "./components/ProjectItems";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	isTeamModalOpen,
	selectWorkOrders,
	setSelectedData,
	setUploadDocument,
} from "@src/store/sidemenu/project_management/work_order/work_order.slice";
import { setSelectedData as setTenderSelectedData } from "@src/store/sidemenu/tender_mangement/tenders/tenders.slice";
import {
	editWorkOrder,
	getWorkOrderById,
	postWorkOrder,
} from "@src/store/sidemenu/project_management/work_order/work_order.action";
import moment from "moment";
import WorkOrderDetails from "./components/WorkOrderDetails";
import TermsAndConditions from "./components/TermsAndConditions";
import { LuSave } from "react-icons/lu";
import Swal from "sweetalert2";
import {
	project_items,
	WorkOrder,
} from "@src/store/sidemenu/project_management/work_order/work_order.types";
import { FileType } from "@src/components";
import { updateSidenav } from "@src/store/customise/customise";
import PerformanceBankGuarantee from "./components/PerformanceBankGuarantee";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import { Key } from "@mui/icons-material";

const AddWorkOrder = () => {
	const { id, tenderId } = useParams();
	const dispatch = useAppDispatch();
	const {
		workOrder: { selectedData, uploadDocuments, pageParams, bidSelected },
	} = useAppSelector((state) => selectWorkOrders(state));
	const navigate = useNavigate();

	const clearData = () => {
		workOrderReset({
			start_date: "",
			due_date: "",
			gst_percentage: "",
			total_value: "",
			taxable_amount: "",
			taxamount: "",
			warrenty_period: "",
			is_performace_bank_guarantee: false,
			is_pre_dispatch_inspection: false,
			is_inspection_agency: false,
			delivery_in_lots: "",
			performace_bank_guarantee: null,
			inspection_agency: null,
			tax: null,
			taxtype: null,
			customer: null,

			// old
			tender_no: "",
			tender: null,
			company: null,
			sourceportal: null,
			tender_type: null,
			product_type: null,
			manager: null,
			tender_open_datetime: "",
			department_name: "",
			tender_due_datetime: "",
			deliver_terms: "",
			financial_terms: "",
			remarks: "",
			gst: "",
			gst_no: "",
		});
		dispatch(setTenderSelectedData({}));
		dispatch(setSelectedData({}));
		dispatch(setUploadDocument([]));
	};

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		return () => clearData();
	}, []);

	const itemSchema = yup.object().shape({
		// new fields
		start_date: yup
			.date()
			.required("Start date is required")
			.typeError("Start date is required"),
		due_date: yup
			.date()
			.required("Due date is required")
			.typeError("Due date is required")
			.min(
				yup.ref("start_date"),
				"Due date must be after the start date"
			),
		// gst_percentage: yup
		// 	.number()
		// 	.required("GST percentage is required")
		// 	.typeError("GST percentage is required")
		// 	.min(0, "GST percentage must be at least 0")
		// 	.max(100, "GST percentage cannot exceed 100"), // Adjust as per business rules
		// total_value: yup
		// 	.string()
		// 	.required("Total value is required")
		// 	.matches(
		// 		/^\d+(\.\d{1,2})?$/,
		// 		"Total value must be a valid number with up to 2 decimal places"
		// 	),
		// tax: yup
		// 	.object()
		// 	.shape({
		// 		label: yup.string().required("Tax is required"),
		// 		value: yup.object().required("Tax is required"),
		// 	})
		// 	.required("Tax is required"),
		// taxtype: yup
		// 	.object()
		// 	.shape({
		// 		label: yup.string().required("Tax type must be an integer"),
		// 		value: yup.number().required("Tax type must be an integer"),
		// 	})
		// 	.required("Tax type must be an integer"),
		// taxamount: yup
		// 	.string()
		// 	.required("Tax amount is required")
		// 	.matches(
		// 		/^\d+(\.\d{1,2})?$/,
		// 		"Tax amount must be a valid number with up to 2 decimal places"
		// 	),
		warrenty_period: yup.string().required("Warranty period is required"),
		customer: yup
			.object()
			.shape({
				label: yup.string().required("Customer ID is required"),
				value: yup.string().required("Customer ID is required"),
			})

			.required("Customer ID is required"),
		// is_performace_bank_guarantee: yup
		// 	.boolean()
		// 	.typeError("This field is required")
		// 	.optional(),
		// is_pre_dispatch_inspection: yup
		// 	.boolean()
		// 	.typeError("This field is required")
		// 	.optional(),

		// is_inspection_agency: yup.boolean().required("This field is required"),

		is_stagewise_inspection: yup
			.boolean()
			.typeError("should be boolean")
			.notRequired(),

		inspection_agency: yup
			.object()
			.when("is_inspection_agency", (isInspectionAgency, schema) => {
				return isInspectionAgency[0]
					? schema.required("Inspection Agency ID is required")
					: schema.nullable();
			}),
		delivery_in_lots: yup
			.number()
			.typeError("Delivery in lots is required")
			.required("Delivery in lots is required")
			.integer("Delivery in lots must be an integer")
			.min(1, "Delivery in lots must be at least 1"),

		// performace_bank_guarantee: yup
		// 	.array()
		// 	.of(
		// 		yup.object().shape({
		// 			number: yup.number(),
		// 			value: yup.string(),
		// 			issuedate: yup.date(),
		// 			expirydate: yup.date(),
		// 			claimdate: yup.date(),
		// 		})
		// 	)
		// 	.when(
		// 		"is_performace_bank_guarantee",
		// 		(isPerformaceBankGuarantee, schema) => {
		// 			return isPerformaceBankGuarantee[0]
		// 				? schema.required(
		// 						"Performance Bank Guarantee ID is required"
		// 					)
		// 				: schema.nullable();
		// 		}
		// 	),

		// old fields
		name: yup
			.string()
			.trim("Project name is required")
			.required("Project name is required"),
		project_no: yup
			.string()
			.trim("Project Number is required")
			.required("Project Number is required"),
		// taxable_amount: yup
		// 	.number()
		// 	.required("Other Taxable Amount is required"),
		// amount: yup
		// 	.number()
		// 	.min(1, "Amount must be greater than zero")
		// 	.typeError("Project Value is required")
		// 	.required("Amount is required"),
		department_name: yup.string().required("Department name is required"),
		// tender: yup
		// 	.object()
		// 	.shape({
		// 		label: yup.string().when([], {
		// 			is: () => tenderId != "0",
		// 			then: (schema) => schema.required("Tender is required"),
		// 			otherwise: (schema) => schema.notRequired(),
		// 		}),
		// 		value: yup.string().when([], {
		// 			is: () => tenderId != "0",
		// 			then: (schema) => schema.required("Tender is required"),
		// 			otherwise: (schema) => schema.notRequired(),
		// 		}),
		// 	})
		// 	.when([], {
		// 		is: () => tenderId != "0",
		// 		then: (schema) => schema.required("Tender is required"),
		// 		otherwise: (schema) => schema.notRequired(),
		// 	}),
		// tender_no: yup.string().when([], {
		// 	is: () => tenderId != "0",
		// 	then: (schema) => schema.required("Tender No is required"),
		// 	otherwise: (schema) => schema.notRequired(),
		// }),
		company: yup
			.object()
			.shape({
				label: yup.string().required("Company is  required"),
				value: yup.string().required("Company is  required"),
			})
			.required("Company is required"),
		sourceportal: yup
			.object()
			.shape({
				label: yup.string().required("Source Portal is  required"),
				value: yup.string().required("Source Portal is  required"),
			})
			.required("Source Portal is required"),
		manager: yup
			.object()
			.shape({
				label: yup.string().required("Manager is  required"),
				value: yup.string().required("Manager is  required"),
			})
			.required("Manager is required"),
		tender_open_datetime: yup
			.string()
			.required("Tender Date and Time is required"),
		tender_due_datetime: yup
			.string()
			.required("Tender Due Date and Time is required"),
		deliver_terms: yup.string().required("Delivery terms is required"),
		financial_terms: yup.string().required("Financial terms is required"),
		remarks: yup.string().required("Remarks is required"),
		tender_type: yup
			.object()
			.shape({
				label: yup.string().required("Tender Type is  required"),
				value: yup.number().required("Tender Type is  required"),
			})
			.required("Tender Type is required"),
		product_type: yup
			.object()
			.shape({
				label: yup.string().required("Product type is  required"),
				value: yup.string().required("Product type is  required"),
			})
			.required("Product type is required"),

		items: yup.array().of(
			yup.object({
				price: yup
					.number()
					.transform((value, originalValue) =>
						originalValue ? Number(originalValue) : NaN
					) // Convert to number
					.typeError("Price must be a number")
					.moreThan(0, "Price must be more than 0")
					.required("Please enter a price"),
				discount: yup
					.string()
					.transform((value, originalValue) => {
						return originalValue.trim() === "" ? null : value;
					})
					.typeError("discount must be a number")
					.max(2, "Cannot enter more than 2 digits")
					.required("please enter a discount"),
				taxtype: yup
					.object({
						label: yup
							.string()
							.required("Please select a tax type"),
						value: yup
							.string()
							.required("Please select a tax type"),
					})
					.required("Please select a tax type"),
				tax: yup
					.object({
						label: yup.string().required("Please select a tax"),
						value: yup.object().required("Please select a tax"),
					})
					.required("Please select a tax"),
			})
		),
		// team: yup.array().required("Team cannot be empty"),
	});

	const {
		control,
		handleSubmit,
		register,
		reset: workOrderReset,
		getValues: getValuesForm1,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<any>({
		mode: "onSubmit",
		resolver: yupResolver(itemSchema),
	});

	useEffect(() => {
		if (
			id == "0" &&
			tenderId !== "0" &&
			tenderId !== "undefined" &&
			tenderId != undefined &&
			tenderId != null
		) {
			dispatch(
				getTenderById({
					id: tenderId || "",
				})
			)
				.then((res: any) => {
					const response = res.payload.response;
					dispatch(
						getWorkOrderById({
							id: response?.project?.id
								? response?.project?.id
								: "",
						})
					);
				})
				.catch((err) => console.log(err));
		}
	}, [id, tenderId]);

	useEffect(() => {
		if (id !== "0") {
			dispatch(
				getWorkOrderById({
					id: id ? id : "",
				})
			);
		}
	}, [id]);

	useEffect(() => {
		if (
			((tenderId !== "0" && tenderId !== "undefined") || id != "0") &&
			selectedData?.id
		) {
			const currentValues = getValues(); // Get existing form values

			const updatedFields = {
				// New fields
				start_date: selectedData?.start_date
					? moment(
							selectedData.start_date,
							"DD-MM-YYYY HH:mm"
						).toISOString()
					: currentValues.start_date || "",
				due_date: selectedData?.due_date
					? moment(
							selectedData.due_date,
							"DD-MM-YYYY HH:mm"
						).toISOString()
					: currentValues.due_date || "",
				gst_percentage:
					selectedData?.gst_percentage ||
					currentValues.gst_percentage,
				total_value: currentValues.total_value,
				taxamount: currentValues.taxamount,
				warrenty_period:
					selectedData?.warrenty_period ||
					currentValues.warrenty_period,

				is_pre_dispatch_inspection:
					selectedData?.is_pre_dispatch_inspection ||
					currentValues.is_pre_dispatch_inspection,
				is_inspection_agency:
					selectedData?.is_inspection_agency ||
					currentValues.is_inspection_agency,
				delivery_in_lots:
					selectedData?.delivery_in_lots ||
					currentValues.delivery_in_lots,

				inspection_agency: selectedData?.inspection_agency?.id
					? {
							label: selectedData.inspection_agency
								.concerned_officer,
							value: selectedData.inspection_agency.id,
						}
					: currentValues.inspection_agency || null,

				tax: selectedData?.tax?.id
					? {
							label: selectedData.tax.name,
							value: selectedData.tax,
						}
					: currentValues.tax || null,

				taxtype: selectedData?.taxtype
					? {
							label: selectedData.taxtype_name,
							value: selectedData.taxtype,
						}
					: currentValues.taxtype || null,

				customer: selectedData?.customer?.id
					? {
							label: selectedData.customer.name,
							value: selectedData.customer.id,
						}
					: currentValues.customer || null,

				is_performace_bank_guarantee:
					selectedData?.is_performace_bank_guarantee ||
					currentValues.is_performace_bank_guarantee,
				is_stagewise_inspection: selectedData?.is_stagewise_inspection
					? true
					: false,

				performace_bank_guarantee: selectedData
					?.performace_bank_guarantee?.id
					? {
							label: selectedData.performace_bank_guarantee.name,
							value: selectedData.performace_bank_guarantee.id,
						}
					: currentValues.performace_bank_guarantee || null,

				// Old fields
				name:
					selectedData?.status === 1
						? currentValues.name
							? currentValues.name
							: ""
						: selectedData?.name || currentValues.name,
				project_no:
					selectedData?.status === 1
						? currentValues.project_no
							? currentValues.project_no
							: ""
						: selectedData?.project_no || currentValues.project_no,
				taxable_amount:
					selectedData?.taxable_amount ||
					currentValues.taxable_amount,
				amount: selectedData?.amount || currentValues.amount,
				department_name:
					selectedData?.department_name ||
					currentValues.department_name,
				deliver_terms:
					selectedData?.deliver_terms || currentValues.deliver_terms,
				financial_terms:
					selectedData?.financial_terms ||
					currentValues.financial_terms,
				remarks: selectedData?.remarks || currentValues.remarks,

				tender: selectedData?.tender?.id
					? {
							label: selectedData.tender.code,
							value: selectedData.tender.id,
						}
					: currentValues.tender || null,

				tender_no: selectedData?.tender_no || currentValues.tender_no,

				company: selectedData?.company?.id
					? {
							label: selectedData.company.name,
							value: selectedData.company.id,
						}
					: currentValues.company || null,

				sourceportal: selectedData?.sourceportal?.id
					? {
							label: selectedData.sourceportal.name,
							value: selectedData.sourceportal.id,
						}
					: currentValues.sourceportal || null,

				tender_type: selectedData?.tender_type
					? {
							label: selectedData.tender_type_name,
							value: selectedData.tender_type,
						}
					: currentValues.tender_type || null,

				product_type: selectedData?.product_type
					? {
							label: selectedData.product_type_name,
							value: selectedData.product_type,
						}
					: currentValues.product_type_name || null,

				manager: selectedData?.manager?.id
					? {
							label: selectedData.manager.fullname,
							value: selectedData.manager.id,
						}
					: currentValues.manager || null,

				tender_open_datetime: selectedData?.tender_open_datetime
					? moment(
							selectedData?.tender_open_datetime,
							"DD-MM-YYYY HH:mm"
						).toISOString()
					: currentValues.tender_datetime || "",

				tender_due_datetime: selectedData?.tender_due_datetime
					? moment(
							selectedData.tender_due_datetime,
							"DD-MM-YYYY HH:mm"
						).toISOString()
					: currentValues.tender_due_datetime || "",

				team: selectedData?.team || currentValues.team,
				items: selectedData?.project_items
					?.filter((e) => !e.dodelete)
					.map((e) => {
						return {
							tax: {
								label: e?.tax?.label,
								value: e?.tax?.value,
							},
							taxtype: {
								label: e?.taxtype?.label,
								value: e?.taxtype?.value,
							},
							discount: e.discount,
							price: e.price,
							quantity: e?.quantity || "",
						};
					}),
			};

			Object.entries(updatedFields).forEach(([key, value]) => {
				setValue(key, value);
			});
		}
	}, [tenderId, id, selectedData]);

	const onSave = async (payload: any) => {
		const findItem: project_items[] | undefined =
			selectedData?.project_items?.filter(
				(item: project_items) => !item.dodelete
			);

		if (findItem?.length != 0) {
			const documents =
				uploadDocuments && uploadDocuments.length
					? uploadDocuments
							?.map((e: FileType) => e.originalObj)
							?.filter((item: any) => item?.path)
					: [];

			const data = {
				//new fields
				start_date: moment(payload?.start_date).format(
					"DD-MM-YYYY hh:mm a"
				),
				due_date: moment(payload?.due_date).format(
					"DD-MM-YYYY hh:mm a"
				),
				gst_percentage: payload?.gst_percentage,
				total_value: payload?.total_value,
				taxamount: parseFloat(`${payload?.taxamount}`)?.toFixed(2),
				warrenty_period: payload?.warrenty_period,

				is_pre_dispatch_inspection: payload?.is_pre_dispatch_inspection,
				is_stagewise_inspection: payload?.is_stagewise_inspection,
				is_inspection_agency: payload?.is_inspection_agency,
				delivery_in_lots: payload?.delivery_in_lots,

				inspection_agency_id: payload?.inspection_agency?.value,
				tax_id: payload?.tax?.value?.id,
				taxtype: payload?.taxtype?.value,
				customer_id: payload?.customer?.value,

				is_performace_bank_guarantee:
					payload?.is_performace_bank_guarantee,

				performace_bank_guarantee_id:
					payload?.performace_bank_guarantee?.value,

				// performace_bank_guarantee_id:

				// old fields
				name: payload?.name,
				project_no: payload?.project_no,
				taxable_amount: payload?.taxable_amount,
				amount: payload?.amount,
				tender_id: payload?.tender?.value,
				company_id: payload?.company?.value,
				sourceportal_id: payload?.sourceportal?.value,
				manager_id: payload?.manager?.value,
				tender_type: payload?.tender_type?.value,
				product_type: payload?.product_type?.value,
				tender_open_datetime: moment(
					payload?.tender?.tender_open_datetime
				).format("DD-MM-YYYY hh:mm a"),
				tender_due_datetime: moment(
					payload?.tender_due_datetime
				).format("DD-MM-YYYY hh:mm a"),
				tender_no: payload?.tender_no,
				deliver_terms: payload?.deliver_terms,
				financial_terms: payload?.financial_terms,
				department_name: payload?.department_name,
				remarks: payload?.remarks,

				project_items:
					id == "0"
						? findItem?.map((item) => {
								return {
									tenderitemmaster_id: item?.tenderitemmaster
										?.value
										? item?.tenderitemmaster?.value
										: "",
									quantity: item.quantity,
									price: item.price,
									discount: item.discount,
									taxtype: item?.taxtype?.value,
									tax_id: item?.tax?.value?.id,
									dodelete: false,
								};
							})
						: selectedData?.project_items?.map((item) => {
								return {
									id: item?.id,
									tenderitemmaster_id: item?.tenderitemmaster
										?.value
										? item?.tenderitemmaster?.value
										: "",
									quantity: item.quantity,
									price: item.price,
									discount: item.discount,
									taxtype: item?.taxtype?.value,
									tax_id: item?.tax?.value?.id,
									dodelete: item?.dodelete,
								};
							}),
			};

			id == "0"
				? dispatch(
						postWorkOrder({
							data,
							params: pageParams,
							workOrderReset,
							navigate,
							documents,
						})
					)
				: dispatch(
						editWorkOrder({
							id: id ? id : "",
							data,
							params: pageParams,
							workOrderReset,
							navigate,
							documents,
						})
					);
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">No Bid Items</p>`,
				text: "Please add atleast one tender item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	const terms_and_conditions = useMemo(() => {
		return (
			<TermsAndConditions
				onSave={onSave}
				register={register}
				handleSubmit={handleSubmit}
				control={control}
				errors={errors}
				getValues={getValuesForm1}
				reset={workOrderReset}
			/>
		);
	}, []);

	const bid_details = useMemo(() => {
		return (
			<ProjectDetailsForm
				// withoutBidSelection={true}
				onSave={onSave}
				register={register}
				handleSubmit={handleSubmit}
				control={control}
				errors={errors}
				getValues={getValuesForm1}
				reset={workOrderReset}
				setValue={setValue}
			/>
		);
	}, []);
	const project_items = useMemo(() => {
		return (
			<ProjectItems
				onSave={onSave}
				register={register}
				handleSubmit={handleSubmit}
				control={control}
				errors={errors}
				getValues={getValuesForm1}
				reset={workOrderReset}
				setValue={setValue}
			/>
		);
	}, []);
	return (
		<GoBack
			is_goback={true}
			go_back_url={"/work_order"}
			title={`${id && id != "0" ? "Update" : "Add"} Work Order`}
			showSaveButton={false}
			button_name="Add team"
			onSave={() => {
				dispatch(isTeamModalOpen(true));
			}}
			loading={false}>
			<Box
				sx={{
					my: 1,
					height: "100%",
				}}>
				<Card>
					<CardContent>
						<WorkOrderDetails
							onSave={onSave}
							register={register}
							handleSubmit={handleSubmit}
							control={control}
							errors={errors}
							getValues={getValuesForm1}
							reset={workOrderReset}
							setValue={setValue}
						/>
						{bid_details}
						{project_items}
						{terms_and_conditions}
						<Box textAlign={"right"} mt={2}>
							<Button
								color="success"
								type="submit"
								onClick={handleSubmit(onSave, (err) => {
									const errMessage = Object.entries(err).map(
										([key, value]: any) => {
											return `${key} : ${value.message}`;
										}
									)[0];

									Swal.fire({
										title: `<p style="font-size:20px">Error</p>`,
										text: errMessage,
										icon: "error",
										confirmButtonText: `Close`,
										confirmButtonColor: "#3085d6",
									});
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
					</CardContent>
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddWorkOrder;
