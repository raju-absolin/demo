import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	FormLabel,
	List,
	Popover,
	Stack,
	styled,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
	CustomDatepicker,
	FileType,
	FormInput,
	HorizontalFilePreview,
} from "@src/components";
import GoBack from "@src/components/GoBack";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import Swal from "sweetalert2";
import { LuDelete, LuSave, LuTrash2 } from "react-icons/lu";
import {
	clearMiniCurrencies,
	clearMiniEnquiry,
	clearMiniMake,
	clearMiniTax,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	getMiniCurrencies,
	getMiniEnquiry,
	getMiniMake,
	getMiniTax,
} from "@src/store/mini/mini.Action";
import moment from "moment";
import TableComponent from "@src/components/TableComponenet";
import {
	clearVendorsByPE,
	selectPurchaseQuotations,
	setSelectedData,
	setSelectedItems,
	setUploadDocument,
} from "@src/store/sidemenu/tender_mangement/PurchaseQuotation/pq.slice";
import {
	editPurchaseQuotation,
	getPurchaseEnquiryById,
	getPurchaseQuotationById,
	getVendorsByPE,
	postPurchaseQuotation,
} from "@src/store/sidemenu/tender_mangement/PurchaseQuotation/pq.action";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import TextArea from "@src/components/form/TextArea";
import { updateSidenav } from "@src/store/customise/customise";
import { QuotationItem } from "@src/store/sidemenu/tender_mangement/PurchaseQuotation/pq.types";
import { addParams } from "@src/helpers/Helper";
import { v4 as uuidv4 } from "uuid";
import Dropzone from "react-dropzone";
import { FileUploadOutlined } from "@mui/icons-material";
import Loader from "@src/components/Loader";

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "300px",
	marginTop: "15px",
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

const AddItemForm = ({ control, getValues, reset, setValue }: any) => {
	const { tenderId, id } = useParams();
	const dispatch = useAppDispatch();
	const {
		purchaseQuotation: {
			selectedData,
			vendorsByPE,
			pq_attachments,
			pq_attachment_loading,
			selectedItems,
		},
		tenders: { selectedData: tenderSelectedData },
		mini: { miniEnquiry, miniCurrencies },
	} = useAppSelector((state) => selectPurchaseQuotations(state));

	const purchase_enquiry = getValues("purchase_enquiry");

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
				id: uuidv4(),
				originalObj: file,
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);
		const documents = [...(pq_attachments || []), modifiedFiles[0]];

		dispatch(setUploadDocument(documents));
	};

	const setAttachments = (attachments: FileType[]) => {
		dispatch(setUploadDocument(attachments));
	};

	return (
		<Box mt={0}>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="purchase_enquiry"
						label="Purchase Enquiry"
						control={control}
						rules={{ required: true }}
						options={miniEnquiry.list.map(
							(e: { id: string | number; code: string }) => ({
								id: e.id,
								name: e.code,
							})
						)}
						helperText={
							id !== "0"
								? "PE dropdown is disabled for selection"
								: ""
						}
						disabled={id !== "0" ? true : false}
						loading={miniEnquiry.loading}
						selectParams={{
							page: miniEnquiry.miniParams.page,
							page_size: miniEnquiry.miniParams.page_size,
							search: miniEnquiry.miniParams.search,
							no_of_pages: miniEnquiry.miniParams.no_of_pages,
							project: tenderSelectedData?.project?.id
								? tenderSelectedData?.project?.id
								: "",
						}}
						hasMore={
							miniEnquiry.miniParams.page <
							miniEnquiry.miniParams.no_of_pages
						}
						fetchapi={getMiniEnquiry}
						clearData={clearMiniEnquiry}
						onChange={(value) => {
							dispatch(
								getPurchaseEnquiryById({
									id: value.value || "",
								})
							);
							reset({
								purchase_enquiry: value,
								vendor: null,
								deliverydate: "",
								description: "",
								deliver_terms: "",
								exchange_rate: "",
								currency: null,
								financial_terms: "",
								termsandconditions: "",
								item: null,
							});
							dispatch(setSelectedData({}));
							dispatch(setSelectedItems([]));
						}}
					/>
				</Grid>
				{/* <Grid mt={3.7}>
					<Button
						color="primary"
						variant="contained"
						size="large"
						disabled={
							!purchase_enquiry?.value || id !== "0"
								? true
								: false
						}
						onClick={() =>
							dispatch(
								getPurchaseEnquiryById({
									id: purchase_enquiry
										? purchase_enquiry.value
										: "",
								})
							)
						}>
						Load Items
					</Button>
				</Grid> */}
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="vendor"
						label="Vendor"
						control={control}
						rules={{ required: true }}
						options={
							vendorsByPE?.list
								? vendorsByPE?.list?.map(
										(e: { id: string; name: string }) => ({
											id: e.id,
											name: e.name,
										})
									)
								: []
						}
						disabled={
							!purchase_enquiry?.value || id !== "0"
								? true
								: false
						}
						helperText={
							!purchase_enquiry?.value
								? "Select a purchase enquiry to see vendors"
								: id !== "0"
									? "Vendor dropdown is disabled for selection"
									: ""
						}
						loading={vendorsByPE.loading}
						selectParams={{
							page: vendorsByPE.miniParams.page,
							page_size: vendorsByPE.miniParams.page_size,
							search: vendorsByPE.miniParams.search,
							no_of_pages: vendorsByPE.miniParams.no_of_pages,
							id: purchase_enquiry?.value,
						}}
						hasMore={
							vendorsByPE.miniParams.page <
							vendorsByPE.miniParams.no_of_pages
						}
						fetchapi={getVendorsByPE}
						clearData={clearVendorsByPE}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<Stack width={"100%"}>
						<CustomDatepicker
							control={control}
							name="deliverydate"
							hideAddon
							dateFormat="DD-MM-YYYY"
							showTimeSelect={false}
							timeFormat="h:mm a"
							timeCaption="time"
							inputClass="form-input"
							label={"Delivery Date"}
							tI={1}
						/>
					</Stack>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<SelectComponent
						name="currency"
						label="Currency"
						control={control}
						rules={{ required: true }}
						options={miniCurrencies.list.map(
							(e: { id: string | number; name: string }) => ({
								id: e.id,
								name: e.name,
							})
						)}
						loading={miniCurrencies.loading}
						selectParams={{
							page: miniCurrencies.miniParams.page,
							page_size: miniCurrencies.miniParams.page_size,
							search: miniCurrencies.miniParams.search,
							no_of_pages: miniCurrencies.miniParams.no_of_pages,
							project: tenderSelectedData?.project?.id
								? tenderSelectedData?.project?.id
								: "",
						}}
						hasMore={
							miniCurrencies.miniParams.page <
							miniCurrencies.miniParams.no_of_pages
						}
						fetchapi={getMiniCurrencies}
						clearData={clearMiniCurrencies}
						onChange={(value) => {}}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<FormInput
						name="exchange_rate"
						label="Exchange Rate"
						type="number"
						placeholder="Enter exchange rate here..."
						control={control}
						onChange={(event) => {
							dispatch(
								setSelectedData({
									...selectedData,
									exchange_rate: event.target.value,
								})
							);
						}}
					/>
				</Grid>
				<Grid>
					<FormLabel>Total</FormLabel>
					<Typography mt={1}>
						{selectedItems?.reduce((acc, item) => {
							const qty = item?.qty ? parseInt(item.qty) : 0;
							const tem_price = item?.price
								? parseFloat(item?.price)
								: 0;

							const discount_percentage = item?.discount
								? +item?.discount
								: 0;
							const discount_amount =
								(discount_percentage / 100) * tem_price;

							const price_after_discount = discount_percentage
								? parseFloat(
										`${tem_price - discount_amount}`
									).toFixed(2)
								: tem_price;

							const gross = parseFloat(
								`${qty * parseFloat(`${price_after_discount}`)}`
							).toFixed(2);

							let total: number = 0; // Ensure `total` is always a number
							const taxType = item?.taxtype?.value;

							const tax_amount = (() => {
								const taxRate = item?.tax?.tax || 0; // Get the tax rate (default to 0 if undefined)

								if (taxType == 2) {
									// Exclusive Tax
									if (item?.tax?.id) {
										const taxAmt = parseFloat(
											`${parseFloat(gross) * (taxRate / 100)}`
										);
										total = parseFloat(gross) + taxAmt; // Add tax to the gross for exclusive tax
										return taxAmt;
									}
									return 0; // No tax if tax ID is not provided
								} else if (taxType == 1) {
									// Inclusive Tax
									if (taxRate > 0) {
										const basicValue =
											parseFloat(gross) /
											(1 + taxRate / 100); // Calculate the net price excluding tax
										const taxAmt =
											basicValue * (taxRate / 100); // Tax amount for inclusive tax
										total = parseFloat(gross); // Total is the gross (inclusive of tax)
										return taxAmt;
									}
									return 0; // No tax if tax rate is 0
								}
								return 0; // Default to 0 if no valid tax type is provided
							})();

							// Add the total for the current item to the accumulator
							return (
								acc +
								total *
									parseFloat(
										selectedData?.exchange_rate?.toString() ??
											"1"
									) // Use a default exchange rate of 1
							);
						}, 0) ?? 0}{" "}
						{/* If no items exist, fallback to 0 */}
					</Typography>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }}>
					<Dropzone
						onDrop={(acceptedFiles) => {
							handleAcceptedFiles(acceptedFiles, () => {});
						}}>
						{({ getRootProps, getInputProps }) => (
							<Box>
								<Box className="fallback">
									<input
										{...getInputProps()}
										name="file"
										type="file"
										multiple
									/>
								</Box>
								<div
									className="dz-message needsclick"
									{...getRootProps()}>
									<Button
										variant="contained"
										startIcon={<FileUploadOutlined />}
										sx={{
											bgcolor: "purple",
											"&:hover": {
												bgcolor: "darkviolet",
											},
											fontWeight: 600,
											textTransform: "none",
										}}>
										Select File
									</Button>
								</div>
							</Box>
						)}
					</Dropzone>
				</Grid>

				<ScrollableList>
					{pq_attachment_loading && <Loader />}
					{pq_attachments?.length != 0 &&
						pq_attachments?.map((document) => {
							return (
								document?.path &&
								!document.dodelete && (
									<HorizontalFilePreview
										file={document}
										attachments={pq_attachments}
										setAttachments={setAttachments}
									/>
								)
							);
						})}
				</ScrollableList>

				{/* <Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }} mt={3.4}>
						<Button
							color="primary"
							type="submit"
							variant="contained"
							size="large">
							Add Item
						</Button>
					</Grid> */}
			</Grid>
		</Box>
	);
};

const AddPurchaseQuotation = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, tenderId } = useParams();
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedItem, setSelectedItem] = useState<
		QuotationItem | undefined
	>();
	const deleteOpen = Boolean(anchorEl);
	const {
		purchaseQuotation: {
			selectedData,
			pageParams,
			pq_attachments,
			selectedItems,
			pe_loading,
			loading,
		},
		tenders: { selectedData: tenderSelectedData },
		mini: { miniMake, miniTax },
	} = useAppSelector((state) => selectPurchaseQuotations(state));

	let non_deleted_selectedItems = useMemo(
		() => selectedItems?.filter((e) => !e.dodelete),
		[selectedItems]
	);

	const updateItems = (items: QuotationItem[]) => {
		return dispatch(setSelectedItems(items));
	};
	const updateSelectedItems = (
		pqItem: QuotationItem | undefined,
		data: Record<string, any>
	) => {
		const updatedItems = selectedItems?.map((item) => {
			if (
				item?.item?.id === pqItem?.item?.id &&
				item?.make?.id === pqItem?.make?.id &&
				item?.unit?.id === pqItem?.unit?.id
			) {
				return {
					...item,
					...data,
				};
			}
			return item;
		});
		return dispatch(setSelectedItems(updatedItems));
	};

	function clearDataFn() {
		updateItems([]);
		dispatch(setSelectedData({}));
		dispatch(setUploadDocument([]));
		PQReset({
			items: [],
			purchase_enquiry: null,
			vendor: null,
			deliverydate: "",
			description: "",
			deliver_terms: "",
			financial_terms: "",
			termsandconditions: "",
		});
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
			dispatch(getPurchaseQuotationById({ id: id ? id : "" }));
		}
	}, [id]);

	useEffect(() => {
		if (tenderId) {
			dispatch(getTenderById({ id: tenderId || "" }));
		}
	}, [tenderId]);

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
			title: "Make",
			width: 100,
		},
		{
			title: "Item Base Price",
			width: 100,
		},
		{
			title: "Item Discount(%)",
			width: 100,
		},
		{
			title: "Price After Discount",
			width: 100,
		},
		{
			title: "Gross Price (Qty * Price After Discount)",
			width: 200,
		},
		{
			title: "Tax Type",
			width: 100,
		},
		{
			title: "Tax %",
			width: 100,
		},
		{
			title: "Tax Amount",
			width: 100,
		},
		{
			title: "Total",
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
		quantity: JSX.Element,
		unit: JSX.Element,
		make: JSX.Element,
		price: JSX.Element,
		discount: JSX.Element,
		price_after_discount: JSX.Element,
		gross: JSX.Element,
		taxtype: JSX.Element,
		tax: JSX.Element,
		tax_amount: JSX.Element,
		total: string | number,
		actions: React.JSX.Element
	) {
		return {
			index,
			name,
			quantity,
			unit,
			make,
			price,
			discount,
			price_after_discount,
			gross,
			taxtype,
			tax,
			tax_amount,
			total,
			actions,
		};
	}

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
	const PQSchema = yup.object().shape({
		purchase_enquiry: yup
			.object({
				label: yup
					.string()
					.required("Please select a purchase enquiry"),
				value: yup
					.string()
					.required("Please select a purchase enquiry"),
			})
			.required("Please select a purchase enquiry"),
		vendor: yup
			.object({
				label: yup.string().required("Please select a vendor"),
				value: yup.string().required("Please select a vendor"),
			})
			.required("Please select a vendor"),
		currency: yup
			.object({
				label: yup.string().required("Please select a currency"),
				value: yup.string().required("Please select a currency"),
			})
			.required("Please select a currency"),

		// total: yup.string().required("please enter a total"),
		deliverydate: yup.string().required("Please enter delivery date"),
		exchange_rate: yup
			.number()
			.typeError("Exchange rate must be a number")
			.required("Exchange rate is required"),

		// Adding validation for the array of items
		items: yup.array().of(
			yup.object().shape({
				originalqty: yup.number().optional(),
				quantity: yup
					.number()
					.typeError("Quantity must be a number")
					.required("Quantity is required")
					.positive("Quantity must be greater than zero")
					// .max(99999, "Quantity cannot exceed 5 digits") // Ensure only up to 5 digits
					.test("max-quantity", function (value) {
						const { originalqty } = this.parent; // Access `originalqty` from the current context
						return originalqty === undefined || value <= originalqty
							? true
							: this.createError({
									message: `Quantity cannot exceed the original quantity of ${originalqty}`,
								});
					}),
				price: yup
					.number()
					.typeError("Price must be a number")
					.required("Price is required")
					.positive("Price must be greater than zero"),
				discount: yup
					.number()
					.typeError("discount must be a number")
					.required("discount is required")
					.max(99, "discount must be less than 100%"), // Ensure only up to 2 digits
				make: yup
					.object({
						label: yup.string().required("Please select a make"),
						value: yup.string().required("Please select a make"),
					})
					.required("Please select a make"),
				tax: yup
					.object({
						label: yup.string().required("Please select a tax"),
						value: yup
							.object({
								id: yup
									.string()
									.required("Please select a tax"),
								code: yup
									.string()
									.required("Please select a tax"),
								tax: yup
									.string()
									.required("Please select a tax"),
								name: yup
									.string()
									.required("Please select a tax"),
								created_on: yup
									.string()
									.required("Please select a tax"),
							})
							.required("Please select a tax"),
					})
					.required("Please select a tax"),
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
			})
		),
		description: yup.string().required("please enter a description"),
		deliver_terms: yup.string().required("please enter a deliver terms"),
		financial_terms: yup
			.string()
			.required("please enter a financial terms"),
		termsandconditions: yup
			.string()
			.required("please enter a terms and conditions"),
	});

	const {
		control,
		handleSubmit,
		reset: PQReset,
		setValue,
		getValues,
		// formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(PQSchema),
		mode: "all",
		[id == "0" ? "defaultValues" : "values"]: {
			purchase_enquiry: selectedData?.purchase_enquiry?.id
				? {
						label: selectedData?.purchase_enquiry?.name,
						value: selectedData?.purchase_enquiry?.id,
					}
				: null,
			vendor: selectedData?.vendor?.id
				? {
						label: selectedData?.vendor?.name,
						value: selectedData?.vendor?.id,
					}
				: null,
			currency: selectedData?.currency?.id
				? {
						label: selectedData?.currency?.name,
						value: selectedData?.currency?.id,
					}
				: null,
			exchange_rate: selectedData?.exchange_rate,
			deliverydate: selectedData?.deliverydate
				? moment(selectedData?.deliverydate, "YYYY-MM-DD").format(
						"YYYY-MM-DD"
					)
				: "",
			description: selectedData?.description
				? selectedData.description
				: "",
			deliver_terms: selectedData?.deliver_terms
				? selectedData.deliver_terms
				: "",
			financial_terms: selectedData?.financial_terms
				? selectedData.financial_terms
				: "",
			termsandconditions: selectedData?.termsandconditions
				? selectedData.termsandconditions
				: "",
		},
	});

	const addItem = (item: QuotationItem) => {
		const findItem = selectedItems?.find(
			(f) =>
				f?.item?.id === item?.item?.id &&
				f?.make?.id === item?.make?.id &&
				f?.unit?.id === item?.unit?.id
		);

		if (!findItem) {
			// const peItem = createPQItem(item);
			updateItems([...selectedItems, item]);
		} else {
			if (findItem?.dodelete) {
				const a = selectedItems?.map((e) => {
					if (e?.item?.id === item?.item?.id) {
						return {
							...e,
							dodelete: false,
						};
					}
					return e;
				});
				updateItems(a);
			} else {
				Swal.fire({
					title: `<p style="font-size:20px">Item Exists</p>`,
					text: "Item with same Make & Unit already added.",
					icon: "warning",
					confirmButtonText: `Close`,
					confirmButtonColor: "#3085d6",
				});
			}
		}
	};

	const handleClick = (
		event: React.MouseEvent<any, MouseEvent>,
		data: QuotationItem
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedItem(data);
	};
	const handleDeleteClose = () => {
		setAnchorEl(null);
	};
	const confirmDelete = () => {
		updateSelectedItems(selectedItem, {
			dodelete: true,
		});
		handleDeleteClose();
	};

	useMemo(() => {
		return setValue(
			"items",
			non_deleted_selectedItems?.length != 0 &&
				non_deleted_selectedItems?.map((item) => ({
					originalqty: item.originalqty ? item.originalqty : "",
					quantity: item.qty ? item.qty : 0,
					price: item.price ? item.price : "",
					discount: item.discount ? item.discount : "",
					make: item?.make?.value
						? {
								label: item?.make?.label,
								value: item?.make?.value,
							}
						: null,
					tax: item?.tax?.id
						? {
								label: item?.tax?.name,
								value: item?.tax,
							}
						: null,
					taxtype: item?.taxtype?.value ? item?.taxtype : null,
				}))
		);
	}, [non_deleted_selectedItems]);

	const rows = useMemo(() => {
		return (
			non_deleted_selectedItems?.length != 0 &&
			non_deleted_selectedItems?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);
				const row_oq = row?.original_quantity
					? parseInt(row?.original_quantity)
					: 0;
				const units = row?.unit?.units ? parseInt(row?.unit?.units) : 0;

				setValue(`items.${key}.originalqty`, row_oq / units);

				setValue(`items.${key}.make`, {
					label: row?.make?.label,
					value: row?.make?.value,
				});
				setValue(`items.${key}.quantity`, row?.qty);
				// setValue(`items.${key}.taxtype`, row?.taxtype);
				// setValue(`items.${key}.tax`, row?.tax);

				const quantity = (
					<Box
						sx={{
							width: 200,
						}}>
						<form action="">
							<FormInput
								control={control}
								name={`items.${key}.quantity`}
								helperText="Quantity"
								label=""
								type="number"
								placeholder="Enter quantity here..."
								onChange={(event) => {
									updateSelectedItems(row, {
										qty: event.target.value,
									});
								}}
							/>
						</form>
					</Box>
				);
				const discount = (
					<Box
						sx={{
							width: 200,
						}}>
						<form action="">
							<FormInput
								control={control}
								name={`items.${key}.discount`}
								helperText="Discount %"
								label=""
								type="number"
								placeholder="Enter discount here..."
								onChange={(event) => {
									updateSelectedItems(row, {
										discount: event.target.value,
									});
								}}
							/>
						</form>
					</Box>
				);
				const unit = (
					<>
						<form action="">
							<Box>{row?.unit?.name}</Box>
							{/* <SelectComponent
								name="unit"
								label="Unit"
								control={control}
								disabled={true}
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
								helperText={""}
								selectParams={{
									page: miniUnits.miniParams.page,
									page_size: miniUnits.miniParams.page_size,
									search: miniUnits.miniParams.search,
									no_of_pages:
										miniUnits.miniParams.no_of_pages,
									item: row?.item?.id ? row?.item?.id : "",
								}}
								hasMore={
									miniUnits.miniParams.page <
									miniUnits.miniParams.no_of_pages
								}
								fetchapi={getMiniUnits}
								clearData={clearMiniUnits}
							/> */}
						</form>
					</>
				);
				const make = (
					<Box width={200}>
						<form action="">
							{/* <Box>{row?.make?.name}</Box> */}
							<SelectComponent
								name={`items.${key}.make`}
								label=""
								control={control}
								disabled={false}
								rules={{ required: true }}
								options={miniMake.list.map(
									(e: {
										id: string | number;
										name: string;
									}) => ({
										id: e.id,
										name: e.name,
									})
								)}
								onChange={(value) => {
									updateSelectedItems(row, {
										make: value,
									});
								}}
								loading={miniMake.loading}
								helperText={"Make"}
								placeholder="Select make"
								selectParams={{
									page: miniMake.miniParams.page,
									page_size: miniMake.miniParams.page_size,
									search: miniMake.miniParams.search,
									no_of_pages:
										miniMake.miniParams.no_of_pages,
									products__id: row?.item?.id,
								}}
								hasMore={
									miniMake.miniParams.page <
									miniMake.miniParams.no_of_pages
								}
								fetchapi={getMiniMake}
								clearData={clearMiniMake}
							/>
						</form>
					</Box>
				);
				const taxtype = (
					<Box
						sx={{
							width: 200,
						}}>
						<form action="">
							<SelectComponent
								// name={`tax_${key}`}
								name={`items.${key}.taxtype`}
								placeholder="Select a tax type..."
								label=""
								control={control}
								disabled={false}
								rules={{ required: true }}
								helperText="Tax Type"
								options={[
									{
										id: 1,
										name: "Inclusive",
									},
									{
										id: 2,
										name: "Exclusive",
									},
								]}
								onChange={(value) => {
									updateSelectedItems(row, {
										taxtype: value,
									});
								}}
							/>
						</form>
					</Box>
				);
				const tax = (
					<Box
						sx={{
							width: 200,
						}}>
						<form action="">
							<SelectComponent
								// name={`tax_${key}`}
								name={`items.${key}.tax`}
								label=""
								control={control}
								disabled={false}
								rules={{ required: true }}
								options={miniTax.list.map(
									(e: { id: any; name: string }) => ({
										id: {
											...e,
											label: e.name,
											value: e.id,
										},
										name: e.name,
									})
								)}
								onChange={(value) => {
									updateSelectedItems(row, {
										tax: value?.value,
									});
								}}
								loading={miniTax.loading}
								helperText={"Tax"}
								selectParams={{
									page: miniTax.miniParams.page,
									page_size: miniTax.miniParams.page_size,
									search: miniTax.miniParams.search,
									no_of_pages: miniTax.miniParams.no_of_pages,
								}}
								hasMore={
									miniTax.miniParams.page <
									miniTax.miniParams.no_of_pages
								}
								fetchapi={getMiniTax}
								clearData={clearMiniTax}
							/>
						</form>
					</Box>
				);

				// Price field with validation and error handling
				const price = (
					<Box
						sx={{
							width: 200,
						}}>
						<form action="">
							<FormInput
								name={`items.${key}.price`}
								control={control}
								label=""
								type="number"
								placeholder="Enter price here..."
								helperText="Price"
								onChange={(event) => {
									updateSelectedItems(row, {
										price: event.target.value,
									});
								}}
							/>
						</form>
					</Box>
				);

				const qty = row?.qty ? +row?.qty : 0;
				const tem_price = row?.price ? parseFloat(row?.price) : 0;

				const discount_percentage = row?.discount ? +row?.discount : 0;
				const discount_amount = (discount_percentage / 100) * tem_price;

				const price_after_discount = discount_percentage
					? parseFloat(`${tem_price - discount_amount}`).toFixed(2)
					: tem_price;

				let gross = parseFloat(
					`${qty * parseFloat(`${price_after_discount}`)}`
				).toFixed(2);

				let totall: number = 0; // Ensure `total` is always a number
				const taxType = row?.taxtype?.value;

				const tax_amount = (() => {
					const taxRate = row?.tax?.tax || 0; // Get the tax rate (default to 0 if undefined)

					if (taxType == 2) {
						// Exclusive Tax
						if (row?.tax?.id) {
							const taxAmt = parseFloat(
								`${parseFloat(gross) * (taxRate / 100)}`
							);
							totall = parseFloat(gross) + taxAmt; // Add tax to the gross for exclusive tax
							return taxAmt;
						}
						return 0; // No tax if tax ID is not provided
					} else if (taxType == 1) {
						// Inclusive Tax
						if (taxRate > 0) {
							const basicValue =
								parseFloat(gross) / (1 + taxRate / 100); // Calculate the net price excluding tax
							const taxAmt = basicValue * (taxRate / 100); // Tax amount for inclusive tax
							totall = parseFloat(gross); // Total is the gross (inclusive of tax)
							return taxAmt;
						}
						return 0; // No tax if tax rate is 0
					}
					return 0; // Default to 0 if no valid tax type is provided
				})();

				const total = parseFloat(`${totall}`).toFixed(2);

				const actions = (
					<Box
						sx={{
							display: "flex",
							gap: 2,
						}}>
						<Tooltip
							TransitionComponent={Zoom}
							title="Delete Batch">
							<LuTrash2
								style={{
									cursor: "pointer",
									color: "#fc6f03",
								}}
								onClick={(e) => {
									handleClick(e, row);
								}}
							/>
						</Tooltip>
						<Popover
							id={
								selectedItem?.id
									? String(selectedItem?.id)
									: undefined
							}
							open={deleteOpen}
							anchorEl={anchorEl}
							onClose={handleDeleteClose}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							transformOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}>
							<div style={{ padding: "15px" }}>
								<Typography variant="subtitle1" gutterBottom>
									Are you sure to delete this Record?
								</Typography>
								<Button
									variant="contained"
									type="submit"
									color="primary"
									onClick={() => {
										confirmDelete();
									}}
									autoFocus>
									Yes
								</Button>
								<Button
									variant="outlined"
									size="small"
									onClick={handleDeleteClose}
									style={{ marginLeft: "20px" }}>
									No
								</Button>
							</div>
						</Popover>
					</Box>
				);
				return createData(
					index,
					row?.item?.name ? row?.item?.name : "",
					quantity,
					unit,
					make,
					price,
					discount,
					<Typography width={200}>{price_after_discount}</Typography>,
					<Typography width={200}>{gross}</Typography>,
					taxtype,
					tax,
					<Typography width={200}>
						{tax_amount.toFixed(2)}
					</Typography>,
					total,
					actions
				);
			})
		);
	}, [selectedData, createData]);

	const onSave = (payload: any) => {
		const document = pq_attachments?.length
			? pq_attachments
					.filter((e: any) => e.originalObj)
					.map((e) => e.originalObj)
			: [];
		if (selectedItems?.length != 0) {
			const selectedItemsMap = selectedItems?.map((item) => {
				const obj = {
					id: item.id ? item.id : "",
					qty: item.qty,
					item_id: item?.item?.id,
					unit_id: item?.unit?.id,
					make_id: item?.make?.value,
					total_price: item.total_price,
					taxtype: item?.taxtype?.value,
					tax_id: item?.tax?.id,
					price: item.price,
					dodelete: item?.dodelete,
					discount: item?.discount,
				};
				const quotationitems = addParams(obj);
				return quotationitems;
			});

			const data = {
				project_id: tenderSelectedData?.project?.id,
				vendor_id: payload?.vendor?.value,
				purchase_enquiry_id: payload.purchase_enquiry.value,
				description: payload?.description,
				total: payload?.total,
				currency_id: payload?.currency?.value,
				exchange_rate: payload?.exchange_rate,
				deliverydate: moment(payload?.deliverydate).format(
					"YYYY-MM-DD"
				),
				deliver_terms: payload?.deliver_terms,
				financial_terms: payload?.financial_terms,
				termsandconditions: payload?.termsandconditions,
				quotationitems:
					id == "0"
						? selectedItemsMap?.filter((e) => !e.dodelete)
						: selectedItemsMap,
			};
			id == "0"
				? dispatch(
						postPurchaseQuotation({
							data,
							params: {
								...pageParams,
								project_id: tenderSelectedData?.project?.id,
							},
							PQReset,
							navigate,
							document: document?.filter((e) => !e.dodelete),
						})
					)
				: dispatch(
						editPurchaseQuotation({
							id: id ? id : "",
							data,
							params: {
								...pageParams,
								project_id: tenderSelectedData?.project?.id,
							},

							PQReset,
							navigate,
							document,
						})
					);
		} else {
			Swal.fire({
				title: `<p style="font-size:20px">No Bid Items</p>`,
				text: "Please add atleast one item",
				icon: "warning",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		}
	};

	// 	const purchase_enquiry = getValues("purchase_enquiry")

	// 	useEffect(()=>{
	// if()
	// 	}, [purchase_enquiry])

	return (
		<GoBack
			is_goback={true}
			title={`${id && id != "0" ? "Update" : "Add"} Purchase Quotation`}
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
							reset={PQReset}
							setValue={setValue}
						/>
						<Divider
							sx={{
								mt: 2,
							}}
						/>
						<Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }} mt={2}>
							<SelectComponent
								name="item"
								label="Select an Item"
								loading={pe_loading || loading}
								control={control}
								rules={{ required: true }}
								options={
									selectedData?.quotationitems?.map(
										(e: QuotationItem) => ({
											id: e || "",
											name: `${e?.item?.name} ` || "",
										})
									) || []
								}
								extraProps={{
									onMenuOpen: () => {
										const enquiryId =
											getValues(
												"purchase_enquiry"
											)?.value;
										if (enquiryId) {
											dispatch(
												getPurchaseEnquiryById({
													id: enquiryId || "",
												})
											);
										} else {
											Swal.fire({
												title: `<p style="font-size:20px">Warning</p>`,
												text: "Please select a material received note",
												icon: "warning",
												confirmButtonText: `Close`,
												confirmButtonColor: "#3085d6",
											});
										}
									},
								}}
								onChange={(value) => {
									addItem(value.value);
									setValue("item", null);
								}}
							/>
						</Grid>
						<Box mt={2}>
							<TableComponent
								count={selectedItems?.length || 0}
								columns={columns}
								rows={
									rows
										? rows.filter(
												(row) => row !== undefined
											)
										: []
								}
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
										<Grid size={{ xs: 12, md: 6, lg: 3 }}>
											<TextArea
												name="deliver_terms"
												label="Delivery Terms"
												type="text"
												placeholder="Write delivery terms here..."
												minRows={3}
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
												name="financial_terms"
												label="Financial Terms"
												type="text"
												placeholder="Write financial terms here..."
												minRows={3}
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
												name="termsandconditions"
												label="Terms and Conditions"
												type="text"
												placeholder="Write terms and conditions here..."
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

							{/* <Grid size={{ xs: 12 }}> */}
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
							{/* </Grid> */}
						</Box>
					</CardContent>
				</Card>
			</Box>
		</GoBack>
	);
};

export default AddPurchaseQuotation;
