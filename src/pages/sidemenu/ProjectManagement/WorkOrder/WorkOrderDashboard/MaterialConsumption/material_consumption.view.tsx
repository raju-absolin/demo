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
import { selectMaterialConsumption } from "@src/store/sidemenu/project_management/MaterialConsumption/material_consumption.slice";
import { getMaterialConsumptionById } from "@src/store/sidemenu/project_management/MaterialConsumption/material_consumption.action";

const MaterialConsumptionView = () => {
	const { id, projectId, tab } = useParams();
	const [showDescription, setShowDescription] = useState(false);
	const dispatch = useAppDispatch();

	const {
		materialConsumption: { selectedData, pageParams },
	} = useAppSelector((state) => selectMaterialConsumption(state));

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		dispatch(
			getMaterialConsumptionById({
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
			value: moment(selectedData?.date).format("DD-MM-YYYY"),
		},
		{
			label: "Material Consumption Status",
			value: selectedData?.mc_status_name,
		},
		{
			label: "Warehouse",
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
			title: "Batch",
			width: 100,
		},
		{
			title: "Description",
			width: 100,
		},
		{
			title: "Status",
			width: 100,
		},
	];

	function createData(
		index: number,
		name: string,
		quantity: string | number,
		unit: string,
		batch: string,
		description: string,
		status: string
	) {
		return {
			index,
			name,
			quantity,
			unit,
			batch,
			description,
			status,
		};
	}

	const rows = useMemo(() => {
		return selectedData?.mc_items
			?.filter((e) => !e?.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				return createData(
					index,
					row?.item?.name ? row?.item?.name : "",
					row?.qty ? row?.qty : 0,
					row?.unit?.name ? row?.unit.name : "",
					row?.batch?.name ? row?.batch?.name : "",
					row?.description,
					row?.mc_status_name ? row?.mc_status_name : ""
				);
			});
	}, [selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		//
		// dispatch(
		// 	getMaterialConsumption({
		// 		...pageParams,
		// 		search: "",
		// 		page: newPage + 1,
		// 	})
		// );
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		// dispatch(
		// 	getMaterialConsumption({
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
			go_back_url={`/work_order/view/${projectId}/${tab}/project/material_consumption/`}
			title={`Material Consumption`}
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
										Remarks:
									</Typography>
									<Button
										onClick={() =>
											setShowDescription(true)
										}>
										Click to see remarks
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
												{"Remarks"}
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
									selectedData?.mc_items?.length
										? selectedData?.mc_items?.length
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

export default MaterialConsumptionView;
