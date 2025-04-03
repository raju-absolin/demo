import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardContent, Grid2 as Grid, Stack } from "@mui/material";
import { CustomDatepicker, RadioGroup } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import GoBack from "@src/components/GoBack";
import TableComponent from "@src/components/TableComponenet";
import {
	getMiniIssuetoproduction,
	getMiniBatch,
	getMiniItems,
	getMiniUnits,
	getMiniDeliveryChallan,
} from "@src/store/mini/mini.Action";
import {
	clearMiniIssueToProduction,
	clearMiniBatch,
	clearMiniItems,
	clearMiniUnits,
	clearMiniDeliveryChallan,
} from "@src/store/mini/mini.Slice";
import { getReportList } from "@src/store/reports/reports.actions";
import { clearData, selectReports } from "@src/store/reports/reports.slice";
import { downloadExportData } from "@src/store/settings/ImportExport/importExportAction";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import { ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface miniTypes {
	label: string;
	value: string | number;
}

interface SavePayload {
	file_format: number;
	start_date: string;
	end_date: string;

	deliverychallan: miniTypes;
	item: miniTypes;
	unit: miniTypes;
}

const DeliveryChallanItemReport = () => {
	const dispatch = useAppDispatch();
	const {
		mini: { miniDeliveryChallan, miniItemsList, miniUnits },
		reports: { reportsDataCount, reportDataList, pageParams, columnsList },
	} = useAppSelector((state) => selectReports(state));

	const tenderReportSchema = yup.object({
		file_format: yup.number().required("file format is required"),
		start_date: yup.string().required("Start Date is required"),
		end_date: yup.string().required("End Date is required"),
	});

	const { register, handleSubmit, control, getValues, reset, watch } =
		useForm<any>({
			resolver: yupResolver(tenderReportSchema),
		});

	const handleClearData = () => {
		reset({
			file_format: 5,
			start_date: "",
			end_date: "",
			deliverychallan: null,
			item: null,
			unit: null,
		});
		dispatch(clearData());
	};

	useEffect(() => {
		handleClearData();
	}, []);

	const getValuesStartDate = watch("start_date");

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getReportList({
				...pageParams,
				ParamsData: {
					...pageParams.ParamsData,
					page: newPage + 1,
				},
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getReportList({
				...pageParams,
				ParamsData: {
					...pageParams.ParamsData,
					page: 1,
					page_size: parseInt(event.target.value),
				},
			})
		);
	};

	const onFinish = ({
		file_format,
		start_date,
		end_date,
		deliverychallan,
		item,
		unit,
	}: SavePayload) => {
		// var { file_format, ...params } = props.reportParamsData;
		var objData = {
			file_format: file_format,
			model_name: "DeliveryChallanItem",
		};

		if (file_format != 5) {
			dispatch(
				downloadExportData({
					objData,
					ParamsData: {
						start_date: start_date
							? moment(start_date).format("YYYY-MM-DD")
							: "",
						end_date: end_date
							? moment(end_date).format("YYYY-MM-DD")
							: "",
						deliverychallan: deliverychallan?.value,
						item: item?.value,
						unit: unit?.value,
					},
				})
			);
		} else {
			dispatch(
				getReportList({
					objData,
					ParamsData: {
						start_date: start_date
							? moment(start_date).format("YYYY-MM-DD")
							: "",
						end_date: end_date
							? moment(end_date).format("YYYY-MM-DD")
							: "",
						page: pageParams?.ParamsData?.page,
						page_size: pageParams?.ParamsData?.page_size,
						deliverychallan: deliverychallan?.value,
						item: item?.value,
						unit: unit?.value,
						// ...pageParams,
					},
				})
			);
		}
	};

	return (
		<GoBack
			is_goback={true}
			go_back_url={"/reports"}
			title={`Delivery Challan Report`}
			showSaveButton={false}
			loading={false}>
			<Card
				sx={{
					mt: 1,
				}}>
				<CardContent>
					<form action="" onSubmit={handleSubmit(onFinish as any)}>
						<Grid container spacing={2}>
							<Grid
								size={{
									xs: 12,
								}}>
								<RadioGroup
									control={control}
									name="file_format"
									label="File Format"
									row // Use the row prop to place radios horizontally
									options={[
										{ label: "CSV", value: 0 },
										{
											label: "XLSX",
											value: 2,
										},
										{
											label: "VIEW",
											value: 5,
										},
									]}
									defaultValue={5}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									lg: 4,
									xl: 2,
								}}>
								<Stack flex={1}>
									<CustomDatepicker
										control={control}
										name="start_date"
										hideAddon
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										inputClass="form-input"
										maxDate={new Date()}
										label={"Start Date"}
										tI={1}
									/>
								</Stack>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<Stack flex={1}>
									<CustomDatepicker
										control={control}
										name="end_date"
										hideAddon
										disabled={
											getValuesStartDate ? false : true
										}
										dateFormat="DD-MM-YYYY"
										showTimeSelect={false}
										timeFormat="h:mm a"
										timeCaption="time"
										inputClass="form-input"
										minDate={
											getValuesStartDate
												? new Date(getValuesStartDate)
												: undefined
										}
										label={"End Date"}
										tI={1}
										helperText="select start date before selecting end date"
									/>
								</Stack>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="deliverychallan"
									label="Delivery Challan"
									control={control}
									rules={{ required: true }}
									options={miniDeliveryChallan?.list.map(
										(e: {
											id: string | number;
											code: string;
										}) => ({
											id: e.id,
											name: e.code,
										})
									)}
									loading={miniDeliveryChallan?.loading}
									selectParams={{
										page: miniDeliveryChallan?.miniParams
											?.page,
										page_size:
											miniDeliveryChallan?.miniParams
												?.page_size,
										search: miniDeliveryChallan?.miniParams
											?.search,
										no_of_pages:
											miniDeliveryChallan?.miniParams
												?.no_of_pages,
									}}
									hasMore={
										miniDeliveryChallan?.miniParams?.page <
										miniDeliveryChallan?.miniParams
											?.no_of_pages
									}
									fetchapi={getMiniDeliveryChallan}
									clearData={clearMiniDeliveryChallan}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4, xl: 2 }}>
								<SelectComponent
									name="item"
									label="Item"
									control={control}
									options={miniItemsList.list.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniItemsList.loading}
									selectParams={{
										page: miniItemsList.miniParams.page,
										page_size:
											miniItemsList.miniParams.page_size,
										search: miniItemsList.miniParams.search,
										no_of_pages:
											miniItemsList.miniParams
												.no_of_pages,
									}}
									hasMore={
										miniItemsList.miniParams.page <
										miniItemsList.miniParams.no_of_pages
									}
									fetchapi={getMiniItems}
									clearData={clearMiniItems}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4, xl: 2 }}>
								<SelectComponent
									name="unit"
									label="Unit"
									control={control}
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
									selectParams={{
										page: miniUnits.miniParams.page,
										page_size:
											miniUnits.miniParams.page_size,
										search: miniUnits.miniParams.search,
										no_of_pages:
											miniUnits.miniParams.no_of_pages,
									}}
									hasMore={
										miniUnits.miniParams.page <
										miniUnits.miniParams.no_of_pages
									}
									fetchapi={getMiniUnits}
									clearData={clearMiniUnits}
								/>
							</Grid>
							<Grid size={{ xs: 12 }}>
								<Stack
									direction="row"
									spacing={2}
									justifyContent="end">
									<Button
										variant="outlined"
										onClick={handleClearData}>
										Clear
									</Button>
									<Button variant="contained" type="submit">
										Generate
									</Button>
								</Stack>
							</Grid>
						</Grid>
					</form>
				</CardContent>
			</Card>
			<Card>
				<CardContent
					sx={{
						borderTop: "1px solid lightgray",
					}}>
					{reportDataList && (
						<TableComponent
							count={reportsDataCount}
							columns={columnsList}
							rows={reportDataList ? reportDataList : []}
							loading={false}
							page={
								pageParams?.ParamsData?.page
									? pageParams?.ParamsData?.page
									: 1
							}
							pageSize={
								pageParams?.ParamsData?.page_size
									? pageParams?.ParamsData?.page_size
									: 10
							}
							handleChangePage={handleChangePage}
							handleChangeRowsPerPage={handleChangeRowsPerPage}
						/>
					)}
				</CardContent>
			</Card>
		</GoBack>
	);
};

export default DeliveryChallanItemReport;
