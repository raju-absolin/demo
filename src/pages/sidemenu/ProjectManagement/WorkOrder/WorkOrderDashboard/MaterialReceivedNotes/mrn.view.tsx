import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid2 as Grid,
	IconButton,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import GoBack from "@src/components/GoBack";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import { updateSidenav } from "@src/store/customise/customise";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	selectMaterialReceivedNotes,
	setSelectedData,
} from "@src/store/sidemenu/project_management/MaterialReceivedNotes/mrn.slice";
import { getMRNById } from "@src/store/sidemenu/project_management/MaterialReceivedNotes/mrn.action";
import { LuArrowLeftCircle, LuFile, LuX } from "react-icons/lu";
import { pdf } from "@react-pdf/renderer";
import { MRNPrintContent } from "@src/pages/sidemenu/PrintPDF/mrnDetails";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";

export const HorizontalFilePreview = ({
	file,
	attachments,
	setAttachments,
}: {
	file: any;
	attachments: { id: string }[];
	setAttachments: (params: any[]) => void;
}) => {
	function handleDismiss() {
		const filter = attachments?.filter((e) => e?.id != file?.id);
		setAttachments(filter);
	}

	return (
		<Box
			id={file.name}
			sx={{
				border: "1px solid",
				borderColor: "divider",
				borderRadius: "6px",
				p: "12px",
				display: "flex",
			}}>
			<Typography
				sx={{ display: "flex", alignItems: "center", gap: "12px" }}
				component={"a"}
				target="_blank"
				href={file?.preview}>
				{file.preview ? (
					<Avatar
						variant="rounded"
						sx={{
							height: "48px",
							width: "48px",
							bgcolor: "white",
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
						{file.path}
					</Typography>
					<Typography component={"p"} color={"grey.700"}>
						{file.formattedSize}
					</Typography>
				</Box>
			</Typography>
			<IconButton sx={{ marginLeft: "auto", my: "auto" }}>
				<LuX size={18} onClick={() => handleDismiss()} />
			</IconButton>
		</Box>
	);
};

const MRNView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const dispatch = useAppDispatch();

	const {
		materialReceivedNotes: { selectedData, pageParams, invoice_document },
		system: { userAccessList },
	} = useAppSelector((state) => selectMaterialReceivedNotes(state));
	const navigate = useNavigate();

	const {
		company: { companyData },
	} = useAppSelector((state) => {
		return {
			company: companySelector(state),
		};
	});

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		dispatch(
			getMRNById({
				id: id ? id : "",
			})
		);
		dispatch(setCompanyData({}));
	}, [id]);

	const renderData = [
		{
			label: "Code",
			value: selectedData?.code,
		},
		{
			label: "Created On",
			value: moment(selectedData?.created_on).format("DD-MM-YYYY"),
		},
		{
			label: "Purchase Order Code",
			value: selectedData?.purchaseorder?.code,
		},
		{
			label: "Vendor",
			value: selectedData?.vendor?.name,
		},
		{
			label: "Location",
			value: selectedData?.location?.name,
		},
		{
			label: "Warehouse",
			value: selectedData?.warehouse?.name,
		},
		{
			label: "Invoice Number",
			value: selectedData?.invoice_no,
		},
		{
			label: "Invoice Date",
			value: moment(selectedData?.invoice_date).format("DD-MM-YYYY"),
		},
		{
			label: "Invoice Amount",
			value: selectedData?.invoice_amount,
		},
		{
			label: "Currency",
			value: selectedData?.currency?.name,
		},
		{
			label: "Exchange Rate",
			value: selectedData?.exchange_rate,
		},
		{
			label: "Created By",
			value: selectedData?.created_by?.fullname,
		},
	];
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
		{
			title: "Balance Quantity",
			width: 100,
		},
		{
			title: "MRN Received Quantity",
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
			title: "Batch",
			width: 100,
		},
		{
			title: "Price",
			width: 100,
		},
		{
			title: "Last Purchase Price",
			width: 100,
		},
		{
			title: "Tax Type",
			width: 100,
		},
		{
			title: "Tax",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		make: string,
		balquantity: string | number,
		recquantity: string | number,
		quantity: string | number,
		unit: string,
		batch: string,
		price: string | number,
		purchasePrice: string | number,
		taxtype: string | number,
		tax: string | number,
	) {
		return {
			index,
			name,
			make,
			balquantity,
			recquantity,
			quantity,
			unit,
			batch,
			price,
			purchasePrice, 
			taxtype,
			tax,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.mrn_items
			?.filter((e) => !e?.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const qty = row?.qty;

				const taxType = row?.taxtype?.value;

				return createData(
					index,
					row?.item?.name ? row?.item?.name : "",
					row?.make?.name ? row?.make?.name : "",
					row?.balance_quantity ? row?.balance_quantity : 0,
					row?.received_quantity ? row?.received_quantity : 0,
					row?.qty ? row?.qty : 0,
					row?.unit?.name ? row?.unit?.name : "",
					row?.batch?.name ? row?.batch?.name : "",
					row?.price ? row?.price : 0,
					row?.last_purchase_value ? row?.last_purchase_value : 0,
					row?.taxtype_name ? row?.taxtype_name : "",
					row?.tax?.tax ? row?.tax?.tax : "",
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getMaterialReceivedNotes({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getMaterialReceivedNotes({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};
	const theme = useTheme();

	const setAttachments = (payload: Array<any>) => {
		dispatch(
			setSelectedData({
				...selectedData,
				file: payload[0],
			})
		);
	};

	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<MRNPrintContent mrnData={selectedData} companyData={companyData} />
		).toBlob();
		var blobURL = URL.createObjectURL(blob);

		var iframe = document.createElement("iframe"); //load content in an iframe to print later
		document.body.appendChild(iframe);

		iframe.style.display = "none";
		iframe.src = blobURL;
		iframe.onload = function () {
			setTimeout(function () {
				iframe.focus();
				iframe.contentWindow?.print();
			}, 1);
		};
	};
	const onHandleDownload = async (companyData: any) => {
		const blob = await pdf(
			<MRNPrintContent mrnData={selectedData} companyData={companyData} />
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "MaterialReceivedNotes.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} else {
			console.error("Failed to generate PDF");
		}
	};
	return (
		// <GoBack
		// 	is_goback={true}
		// 	go_back_url={`/work_order/view/${projectId}/${tab}/project/material_received_notes/`}
		// 	title={`Material Received Notes`}
		// 	showSaveButton={false}
		// 	loading={false}>
		<Box
			sx={{ display: "flex", flexDirection: "column", gap: "24px" }}
			mt={2}>
			<Card
				sx={{
					p: 2,
					display: "flex",
					alignItems: "center",
					gap: 2,
				}}>
				<Typography
					variant="h4"
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 2,
						cursor: "pointer",
					}}
					onClick={() => {
						navigate(
							`/work_order/view/${projectId}/${tab}/project/material_received_notes/`,
							{
								relative: "path",
							}
						);
					}}>
					<LuArrowLeftCircle color={theme.palette.primary.main} />
					Material Received Notes
				</Typography>
				<Box sx={{ flex: 1 }} />
				<Box sx={{ display: "flex", gap: 2 }}>
					{userAccessList?.indexOf("System.all_data") !== -1 && (
						<>
							<Button
								variant="contained"
								size="large"
								onClick={() => {
									if (
										!companyData ||
										Object.keys(companyData).length === 0
									) {
										dispatch(
											getCompanyById({
												id: selectedData?.project
													?.company,
											})
										).then(async (res: any) => {
											onHandlePrintPreview(
												res.payload?.response
											);
										});
									} else {
										onHandlePrintPreview(companyData);
									}
								}}>
								Print
							</Button>
							<Button
								variant="contained"
								size="large"
								onClick={() => {
									if (
										!companyData ||
										Object.keys(companyData).length === 0
									) {
										dispatch(
											getCompanyById({
												id: selectedData?.project
													?.company,
											})
										).then(async (res: any) => {
											onHandleDownload(
												res.payload?.response
											);
										});
									} else {
										onHandleDownload(companyData);
									}
								}}>
								Download PDF
							</Button>
						</>
					)}
				</Box>
			</Card>
			<Box
				sx={{
					my: 2,
				}}>
				<Card>
					<CardContent>
						<Box
							p={4}
							sx={{
								borderRadius: 2,
							}}>
							<Grid container spacing={3}>
								{renderData.map((item) => {
									return (
										<Grid size={{ xs: 12, md: 4 }}>
											<Typography variant="h6">
												{item.label}:{" "}
												{item?.value as any}
											</Typography>
										</Grid>
									);
								})}
							</Grid>
							<Grid size={{ xs: 12, md: 4 }} mt={2}>
								<Stack
									direction={"row"}
									spacing={1}
									alignItems="center">
									<Typography variant="h5">
										Description:
									</Typography>
									<Button
										onClick={() =>
											setShowDescription(true)
										}>
										Click to see description
									</Button>
									{showDescription && (
										<Dialog
											open={showDescription}
											onClose={() =>
												setShowDescription(false)
											}
											maxWidth="md"
											fullWidth>
											<DialogTitle>
												{"Description"}
											</DialogTitle>
											<DialogContent>
												<Typography>
													{selectedData?.description}
												</Typography>
											</DialogContent>
											<DialogActions>
												<Button
													onClick={() =>
														setShowDescription(
															false
														)
													}>
													Close
												</Button>
											</DialogActions>
										</Dialog>
									)}
								</Stack>
							</Grid>
							<Grid size={{ xs: 12, md: 6, lg: 3, xl: 3 }}>
								{invoice_document &&
									invoice_document?.map(
										(val: any, index: string) => (
											<HorizontalFilePreview
												key={index}
												file={val}
												attachments={invoice_document}
												setAttachments={setAttachments}
											/>
										)
									)}
							</Grid>
						</Box>
						<Divider
							sx={{
								my: 2,
							}}
						/>
						<Box>
							<TableComponent
								showPagination={false}
								containerHeight={440}
								count={
									selectedData?.mrn_items?.length
										? selectedData?.mrn_items?.length
										: 0
								}
								columns={columns}
								rows={rows ? rows : []}
								loading={false}
								page={pageParams.page}
								pageSize={pageParams.page_size}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
							/>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};

export default MRNView;
