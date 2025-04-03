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
import { useParams } from "react-router-dom";
import { selectStockIn } from "@src/store/sidemenu/project_management/StockTransferIn/stock_in.slice";
import { getStockInById } from "@src/store/sidemenu/project_management/StockTransferIn/stock_in.action";

const StockInView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const dispatch = useAppDispatch();

	const {
		stockIn: { selectedData, pageParams },
	} = useAppSelector((state) => selectStockIn(state));

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		dispatch(
			getStockInById({
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
			label: "Stock Transfer Out Code",
			value: selectedData?.stocktransferout?.code,
		},
		{
			label: "Created On",
			value: moment(selectedData?.date).format("DD-MM-YYYY"),
		},
		// {
		// 	label: "Stock Transfer In Status",
		// 	value: selectedData?.sistatus_name,
		// },
		{
			label: "From Warehouse",
			value: selectedData?.warehouse?.name,
		},
		{
			label: "To Warehouse",
			value: selectedData?.from_warehouse?.name,
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
		quantity: string | number,
		unit: string,
		description: string,
	) {
		return {
			index,
			name,
			quantity,
			unit,
			description,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.siitems
			?.filter((e) => !e?.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				return createData(
					index,
					row?.item?.name ? row?.item?.name : "",
					row?.qty ? row?.qty : 0,
					row?.unit?.name ? row?.unit.name : "",
					// row?.batch?.name ? row?.batch?.name : "",
					row?.description ? row?.description : "",
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getStockIn({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getStockIn({
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
			go_back_url={`/work_order/view/${projectId}/${tab}/project/stock_transfer_in/`}
			title={`Stock Transfer In`}
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
									selectedData?.siitems?.length
										? selectedData?.siitems?.length
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

export default StockInView;
