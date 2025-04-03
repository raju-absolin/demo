import {
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
import { selectMaterialIssues } from "@src/store/sidemenu/project_management/MaterialIssue/mr_issues.slice";
import { getMIById } from "@src/store/sidemenu/project_management/MaterialIssue/mr_issues.action";
import { getDeliveryReturnNotesById } from "@src/store/sidemenu/project_management/DeliveryNoteReturn/DNR.action";
import { useDeliveryReturnNotesSelector } from "@src/store/sidemenu/project_management/DeliveryNoteReturn/DNR.slice";
import { LuArrowLeftCircle } from "react-icons/lu";
import { pdf } from "@react-pdf/renderer";
import { DRNPrintContent } from "@src/pages/sidemenu/PrintPDF/deliveryReturnNote";
import {
	companySelector,
	setCompanyData,
} from "@src/store/masters/Company/company.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";

const MIView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const dispatch = useAppDispatch();

	const {
		deliveryReturnNotes: { selectedData, pageParams },
		system: { userAccessList },
	} = useDeliveryReturnNotesSelector();
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
			getDeliveryReturnNotesById({
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
			label: "Location",
			value: selectedData?.location?.name,
		},
		{
			label: "Warehouse",
			value: selectedData?.warehouse?.name,
		},
		{
			label: "Description",
			value: selectedData?.warehouse?.name,
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
	];

	function createData(
		index: number,
		name: string,
		unit: JSX.Element,
		quantity: JSX.Element,
		description: JSX.Element
	) {
		return {
			index,
			name,
			unit,
			quantity,
			description,
		};
	}
	const rows = useMemo(() => {
		return selectedData?.deliveryreturnnotesitems
			?.filter((e: any) => !e.dodelete)
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

				return createData(
					index,
					row?.item?.label ? row?.item?.label : "",
					quantity,
					unit,
					description
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getMaterialIssues({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getMaterialIssues({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};
	const theme = useTheme();

	const onHandlePrintPreview = async (companyData: any) => {
		const blob = await pdf(
			<DRNPrintContent drnData={selectedData} companyData={companyData} />
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
			<DRNPrintContent drnData={selectedData} companyData={companyData} />
		).toBlob();
		if (blob) {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "DRN.pdf";
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
		// 	go_back_url={`/work_order/view/${projectId}/${tab}/project/delivery_note_return/`}
		// 	title={`Delivery Note Return`}
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
							`/work_order/view/${projectId}/${tab}/project/delivery_note_return/`,
							{
								relative: "path",
							}
						);
					}}>
					<LuArrowLeftCircle color={theme.palette.primary.main} />
					Delivery Note Return
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
									selectedData?.deliveryreturnnotesitems
										?.length
										? selectedData?.deliveryreturnnotesitems
												?.length
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

export default MIView;
