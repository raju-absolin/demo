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
import { selectEnquiry } from "@src/store/sidemenu/tender_mangement/purchaseEnquiry/purchase_enquiry.slice";
import { getPurchaseQuotationById } from "@src/store/sidemenu/tender_mangement/PurchaseQuotation/pq.action";
import { selectPurchaseQuotations } from "@src/store/sidemenu/tender_mangement/PurchaseQuotation/pq.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const PurchaseQuotationView = () => {
	const { id, tenderId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const dispatch = useAppDispatch();

	const {
		purchaseQuotation: { selectedData, pageParams },
	} = useAppSelector((state) => selectPurchaseQuotations(state));

	useEffect(() => {
		dispatch(
			getPurchaseQuotationById({
				id: id ? id : "",
			})
		);
	}, [id]);

	const renderData = [
		{
			label: "Code",
			value: selectedData?.code,
		},
		{
			label: "Created On",
			value: selectedData?.created_on,
		},
		{
			label: "Delivery Date",
			value: selectedData?.deliverydate,
		},
		{
			label: "Purchase Enquiry Code",
			value: selectedData?.purchase_enquiry?.name,
		},
		{
			label: "Vendor",
			value: selectedData?.vendor?.name,
		},
		{
			label: "Project",
			value: selectedData?.project?.name,
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
			title: "Available Qty",
			width: 100,
		},
		{
			title: "Item Price",
			width: 100,
		},
		{
			title: "Total Price (Qty * Price)",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		quantity: string,
		price: string,
		Total: string | number
	) {
		return {
			index,
			name,
			quantity,
			price,
			Total,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.quotationitems
			?.filter((e) => !e?.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				return createData(
					index,
					row?.item?.name ? row?.item?.name : "",
					row.qty ? row.qty : "",
					row.price ? row.price : "",
					row.total_price ? row.total_price : ""
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getPurchaseQuotation({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getPurchaseQuotation({
		// 		...pageParams,
		// 		search: "",
		// 		page: 1,
		// 		page_size: parseInt(event.target.value),
		// 	})
		// );
	};
	const theme = useTheme();

	return (
		<GoBack
			is_goback={true}
			go_back_url={`/tenders/view/${tenderId}/${tab}/purchase_quotation/`}
			title={`Purchase Quotation`}
			showSaveButton={false}
			loading={false}>
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
								<Grid size={{ xs: 12, md: 4 }}>
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
														{
															selectedData?.description
														}
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
								count={
									selectedData?.quotationitems?.length
										? selectedData?.quotationitems?.length
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
		</GoBack>
	);
};

export default PurchaseQuotationView;
