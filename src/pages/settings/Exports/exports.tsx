import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Box,
	Grid2 as Grid,
	Divider,
	Card,
	Typography,
	Select,
	MenuItem,
	Button,
	List,
	ListItem,
	ListItemText,
	CircularProgress,
} from "@mui/material";
import { RiDownload2Fill } from "react-icons/ri";
import { RootState, useAppDispatch, useAppSelector } from "@src/store/store";
import {
	InputChangeValue,
	clearData,
	importExportSelector,
} from "@src/store/settings/ImportExport/importExportSlice";
import {
	downloadExportData,
	getExportModelsList,
} from "@src/store/settings/ImportExport/importExportAction";
import { Title } from "@mui/icons-material";
import { systemSelector } from "@src/store/system/system.slice";
import GoBack from "@src/components/GoBack";

// const { Title, Text } = Typography;

const ExportCSV = () => {
	const dispatch = useAppDispatch();

	const {
		importExport: { exportData, loading, exportModelList },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			importExport: importExportSelector(state),
		};
	});

	useEffect(() => {
		dispatch(clearData());
		dispatch(getExportModelsList());
	}, []);

	const data = [
		"Reaching the targets and goals set for my area.",
		"Servicing the needs of my existing customers.",
		"Maintaining the relationships with existing customers for repeat business.",
		"Reporting to top managers",
		"Keeping up to date with the products.",
	];

	const exportDataFn = () => {
		const objData = {
			model_name: exportData.model_name,
			file_format: 0,
		};
		dispatch(downloadExportData({ objData }));
	};

	return (
		<GoBack
			is_goback={true}
			title="Export CSV"
			showSaveButton={false}
			loading={false}>
			<Box
				sx={{
					my: 2,
				}}>
				<Card>
					<Grid container spacing={2}>
						{/* <Grid size={{ xs: 12 }}>
                            <Divider sx={{ mb: 2 }} />
                        </Grid> */}
						<Grid size={{ xs: 12 }}>
							<Card sx={{ p: 2 }}>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										exportDataFn();
									}}>
									<Grid container spacing={2}>
										<Grid size={{ xs: 12, md: 6 }}>
											<Typography variant="h6">
												Before Exporting Your File
											</Typography>
											<List dense>
												{data.map((item, index) => (
													<ListItem key={index}>
														<ListItemText
															primary={`${index + 1}. ${item}`}
														/>
													</ListItem>
												))}
											</List>
										</Grid>
										<Grid size={{ xs: 12, md: 6 }}>
											<Box component="div" sx={{ mb: 2 }}>
												<Typography variant="subtitle1">
													Select File Type
												</Typography>
												<Select
													fullWidth
													displayEmpty
													value={
														exportData.model_name ||
														""
													}
													onChange={(e) =>
														dispatch(
															InputChangeValue({
																key: "model_name",
																value: e.target
																	.value,
																type: "export",
															})
														)
													}
													required>
													<MenuItem value="" disabled>
														Choose file
													</MenuItem>
													{exportModelList.map(
														(
															menuItem: any,
															index: number
														) => (
															<MenuItem
																key={index}
																value={
																	menuItem
																}>
																{menuItem}
															</MenuItem>
														)
													)}
												</Select>
											</Box>

											<Button
												type="submit"
												variant="contained"
												color="primary"
												endIcon={<RiDownload2Fill />}
												disabled={loading}
												sx={{ mt: 2 }}>
												{loading ? (
													<CircularProgress
														size={24}
													/>
												) : (
													"Export .csv file"
												)}
											</Button>
										</Grid>
									</Grid>
								</form>
							</Card>
						</Grid>
					</Grid>
				</Card>
			</Box>
		</GoBack>
	);
};

export default ExportCSV;
