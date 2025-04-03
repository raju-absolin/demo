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
} from "@src/store/mini/mini.Action";
import {
	clearMiniBatch,
	clearMiniCompany,
	clearMiniCustomers,
	clearMiniEnquiry,
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
	project: miniTypes;
	date_range: miniTypes;
	purchase_order: miniTypes;
	vendor: miniTypes;
	approved_status: miniTypes;
	approved_by: miniTypes;
}

const PaymentRequestReport = () => {
	const dispatch = useAppDispatch();
	const {
		mini: {
			miniProject,
			miniMake,
			miniPurchaseOrder,
			miniUserTypes,
			miniBatch,
			miniTax,
			miniUnits,
			miniVendors,
		},
		reports: { reportsDataCount, reportDataList, pageParams, columnsList },
	} = useAppSelector((state) => selectReports(state));

	const paymentRequestReportSchema = yup.object({
		file_format: yup.number().required("file format is required"),
		start_date: yup.string().required("Start Date is required"),
		end_date: yup.string().required("End Date is required"),
	});

	const { register, handleSubmit, control, getValues, reset, watch } =
		useForm<any>({
			resolver: yupResolver(paymentRequestReportSchema),
		});

	const handleClearData = () => {
		reset({
			file_format: 5,
			start_date: "",
			end_date: "",
			date_range: null,
			project: null,
			purchase_order: null,
			vendor: null,
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
		project,
		purchase_order,
		vendor,
		approved_status,
		approved_by,
	}: SavePayload) => {
		var objData = {
			file_format: file_format,
			model_name: "PaymentRequest",
		};

		const ParamsData = {
			start_date: start_date
				? moment(start_date).format("YYYY-MM-DD")
				: "",
			end_date: end_date ? moment(end_date).format("YYYY-MM-DD") : "",
			date_range: date_range?.value,
			project: project?.value,
			purchaseorder: purchase_order?.value,
			vendor: vendor?.value,
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
			title={`Payment Request Report`}
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
										maxDate={new Date()}
										inputClass="form-input"
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
									name="project"
									label="Project"
									control={control}
									rules={{ required: true }}
									options={miniProject?.list.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniProject?.loading}
									selectParams={{
										page: miniProject?.miniParams?.page,
										page_size:
											miniProject?.miniParams?.page_size,
										search: miniProject?.miniParams?.search,
										no_of_pages:
											miniProject?.miniParams
												?.no_of_pages,
									}}
									hasMore={
										miniProject?.miniParams?.page <
										miniProject?.miniParams?.no_of_pages
									}
									fetchapi={getMiniProjects}
									clearData={clearMiniProjects}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="purchase_order"
									label="Purchase Order"
									control={control}
									rules={{ required: true }}
									options={miniPurchaseOrder?.list.map(
										(e: {
											id: string | number;
											code: string;
										}) => ({
											id: e.id,
											name: e.code,
										})
									)}
									placeholder="Select PaymentRequest"
									loading={miniPurchaseOrder.loading}
									selectParams={{
										page: miniPurchaseOrder.miniParams.page,
										page_size:
											miniPurchaseOrder.miniParams
												.page_size,
										search: miniPurchaseOrder.miniParams
											.search,
										no_of_pages:
											miniPurchaseOrder.miniParams
												.no_of_pages,
									}}
									hasMore={
										miniPurchaseOrder.miniParams.page <
										miniPurchaseOrder.miniParams.no_of_pages
									}
									fetchapi={getPurchaseOrderMini}
									clearData={clearMiniPurchaseOrder}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="vendor"
									label="Vendor"
									control={control}
									rules={{ required: true }}
									options={miniVendors?.list.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniVendors?.loading}
									selectParams={{
										page: miniVendors?.miniParams?.page,
										page_size:
											miniVendors?.miniParams?.page_size,
										search: miniVendors?.miniParams?.search,
										no_of_pages:
											miniVendors?.miniParams
												?.no_of_pages,
									}}
									hasMore={
										miniVendors?.miniParams?.page <
										miniVendors?.miniParams?.no_of_pages
									}
									fetchapi={getMiniVendors}
									clearData={clearMiniVendors}
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

export default PaymentRequestReport;
