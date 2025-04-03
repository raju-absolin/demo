import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardContent, Grid2 as Grid, Stack } from "@mui/material";
import { CustomDatepicker, RadioGroup } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import GoBack from "@src/components/GoBack";
import TableComponent from "@src/components/TableComponenet";
import {
	getMiniBatch,
	getMiniCompany,
	getMiniCustomers,
	getMiniEnquiry,
	getMiniItems,
	getPurchaseOrderMini,
	getMiniProjects,
	getMiniTax,
	getMiniTenderNature,
	getMiniUnits,
	getMiniUsers,
	getMiniMake,
	getMiniVendors,
	getMiniUserTypes,
	getMiniExpenditureSheet,
	getMiniExpenditureType,
} from "@src/store/mini/mini.Action";
import {
	clearMiniBatch,
	clearMiniCompany,
	clearMiniCustomers,
	clearMiniEnquiry,
	clearMiniExpenditureSheet,
	clearMiniExpenditureType,
	clearMiniItems,
	clearMiniMake,
	clearMiniProjects,
	clearMiniPurchaseOrder,
	clearMiniTax,
	clearMiniUnits,
	clearMiniUsers,
	clearMiniUserTypes,
	clearMiniVendors,
	clearTenderNature,
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
	date_range: miniTypes;
	expendituresheet: miniTypes;
	expendituretype: miniTypes;
	approved_status: miniTypes;
	approved_by: miniTypes;
}

const ExpenditureSheetReport = () => {
	const dispatch = useAppDispatch();
	const {
		mini: {
			miniProject,
			miniPurchaseOrder,
			miniUserTypes,
			miniExpenditureType,
			miniExpenditureSheet,
			miniUnits,
			miniVendors,
		},
		reports: { reportsDataCount, reportDataList, pageParams, columnsList },
	} = useAppSelector((state) => selectReports(state));

	const expenditureSheetReportSchema = yup.object({
		file_format: yup.number().required("file format is required"),
		start_date: yup.string().required("Start Date is required"),
		end_date: yup.string().required("End Date is required"),
	});

	const { register, handleSubmit, control, getValues, reset, watch } =
		useForm<any>({
			resolver: yupResolver(expenditureSheetReportSchema),
		});

	const handleClearData = () => {
		reset({
			file_format: 5,
			start_date: "",
			end_date: "",
			date_range: null,
			expendituresheet: null,
			expendituretype: null,
			approved_status: null,
			approved_by: null,
		});
		dispatch(clearData());
	};
	useEffect(() => {
		handleClearData();
	}, []);

	const getValuesStartDate = watch("start_date");
	const getValuesItem = getValues("item");

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
		date_range,
		expendituresheet,
		expendituretype,
		approved_status,
		approved_by,
	}: SavePayload) => {
		var objData = {
			file_format: file_format,
			model_name: "ExpenditureSheetItem",
		};

		const ParamsData = {
			start_date: start_date
				? moment(start_date).format("YYYY-MM-DD")
				: "",
			end_date: end_date ? moment(end_date).format("YYYY-MM-DD") : "",
			date_range: date_range?.value,
			expendituresheet: expendituresheet?.value,
			expendituretype: expendituretype?.value,
			approved_status: approved_status?.value,
			approved_by: approved_by?.value,
		};

		if (file_format != 5) {
			dispatch(
				downloadExportData({
					objData,
					ParamsData: ParamsData,
				})
			);
		} else {
			dispatch(
				getReportList({
					objData,
					ParamsData: {
						...ParamsData,
						page: pageParams?.ParamsData?.page,
						page_size: pageParams?.ParamsData?.page_size,
						// ...pageParams,
					},
				})
			);
		}
	};

	const approved_status = [
		{
			id: 1,
			name: "Pending",
		},
		{
			id: 2,
			name: "InProgress",
		},
		{
			id: 3,
			name: "Approved",
		},
		{
			id: 4,
			name: "Rejected",
		},
	];

	const dateRange = [
		{
			id: "today",
			name: "today",
		},
		{
			id: "yesterday",
			name: "yesterday",
		},
		{
			id: "week",
			name: "week",
		},
		{
			id: "month",
			name: "month",
		},
		{
			id: "year",
			name: "year",
		},
	];

	return (
		<GoBack
			is_goback={true}
			go_back_url={"/reports"}
			title={`Expenditure Sheet Report`}
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
									name="date_range"
									label="Date Range"
									control={control}
									rules={{ required: true }}
									options={dateRange}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="expendituresheet"
									label="Expenditure Sheet"
									control={control}
									rules={{ required: true }}
									options={miniExpenditureSheet?.list.map(
										(e: {
											id: string | number;
											code: string;
										}) => ({
											id: e.id,
											name: e.code,
										})
									)}
									placeholder="Select Expenditure Sheet"
									loading={miniExpenditureSheet.loading}
									selectParams={{
										page: miniExpenditureSheet.miniParams
											.page,
										page_size:
											miniExpenditureSheet.miniParams
												.page_size,
										search: miniExpenditureSheet.miniParams
											.search,
										no_of_pages:
											miniExpenditureSheet.miniParams
												.no_of_pages,
									}}
									hasMore={
										miniExpenditureSheet.miniParams.page <
										miniExpenditureSheet.miniParams
											.no_of_pages
									}
									fetchapi={getMiniExpenditureSheet}
									clearData={clearMiniExpenditureSheet}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="expendituretype"
									label="Expenditure Type"
									control={control}
									rules={{ required: true }}
									options={miniExpenditureType?.list.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniExpenditureType?.loading}
									selectParams={{
										page: miniExpenditureType?.miniParams
											?.page,
										page_size:
											miniExpenditureType?.miniParams
												?.page_size,
										search: miniExpenditureType?.miniParams
											?.search,
										no_of_pages:
											miniExpenditureType?.miniParams
												?.no_of_pages,
									}}
									hasMore={
										miniExpenditureType?.miniParams?.page <
										miniExpenditureType?.miniParams
											?.no_of_pages
									}
									fetchapi={getMiniExpenditureType}
									clearData={clearMiniExpenditureType}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="approved_by"
									label="Approved By"
									control={control}
									rules={{ required: true }}
									options={miniUserTypes.list?.map(
										(e: { id: number; name: string }) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniUserTypes.loading}
									selectParams={{
										page: miniUserTypes.miniParams.page,
										page_size:
											miniUserTypes.miniParams.page_size,
										search: miniUserTypes.miniParams.search,
										no_of_pages:
											miniUserTypes.miniParams
												.no_of_pages,
									}}
									hasMore={
										miniUserTypes?.miniParams?.page <
										miniUserTypes?.miniParams?.no_of_pages
									}
									fetchapi={getMiniUserTypes}
									clearData={clearMiniUserTypes}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="approved_status"
									label="Status"
									control={control}
									rules={{ required: true }}
									options={approved_status}
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
				</CardContent>
			</Card>
		</GoBack>
	);
};

export default ExpenditureSheetReport;
