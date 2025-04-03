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
	item: miniTypes;
	make: miniTypes;
	unit: miniTypes;
	tax: miniTypes;
	purchaseorder: miniTypes;
	poitem: miniTypes;
	postatus: miniTypes;
}

const PurchaseOrderReport = () => {
	const dispatch = useAppDispatch();
	const {
		mini: {
			miniProject,
			miniMake,
			miniPurchaseOrder,
			miniItemsList,
			miniBatch,
			miniTax,
			miniUnits,
		},
		reports: { reportsDataCount, reportDataList, pageParams, columnsList },
	} = useAppSelector((state) => selectReports(state));

	const purchaseorderReportSchema = yup.object({
		file_format: yup.number().required("file format is required"),
		start_date: yup.string().required("Start Date is required"),
		end_date: yup.string().required("End Date is required"),
	});

	const { register, handleSubmit, control, getValues, reset, watch } =
		useForm<any>({
			resolver: yupResolver(purchaseorderReportSchema),
		});

	const handleClearData = () => {
		reset({
			file_format: 5,
			start_date: "",
			end_date: "",
			date_range: null,
			purchaseorder: null,
			item: null,
			make: null,
			tax: null,
			unit: null,
			postatus: null,
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
		purchaseorder,
		item,
		make,
		unit,
		tax,
		postatus,
	}: SavePayload) => {
		var objData = {
			file_format: file_format,
			model_name: "PurchaseOrderItem",
		};

		const ParamsData = {
			start_date: start_date
				? moment(start_date).format("YYYY-MM-DD")
				: "",
			end_date: end_date ? moment(end_date).format("YYYY-MM-DD") : "",
			date_range: date_range?.value,
			purchaseorder: purchaseorder?.value,
			item: item?.value,
			make: make?.value,
			unit: unit?.value,
			tax: tax?.value,
			postatus: postatus?.value,
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

	const postatus = [
		{
			id: 1,
			name: "Pending",
		},
		{
			id: 2,
			name: "Open",
		},
		{
			id: 3,
			name: "Approved",
		},
		{
			id: 4,
			name: "Closed",
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
			title={`Purchase Order Report`}
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
									name="purchaseorder"
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
									placeholder="Select PurchaseOrder"
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
									name="item"
									label="Item"
									control={control}
									rules={{ required: true }}
									options={miniItemsList?.list.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniItemsList?.loading}
									selectParams={{
										page: miniItemsList?.miniParams?.page,
										page_size:
											miniItemsList?.miniParams
												?.page_size,
										search: miniItemsList?.miniParams
											?.search,
										no_of_pages:
											miniItemsList?.miniParams
												?.no_of_pages,
									}}
									hasMore={
										miniItemsList?.miniParams?.page <
										miniItemsList?.miniParams?.no_of_pages
									}
									fetchapi={getMiniItems}
									clearData={clearMiniItems}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="make"
									label="Make"
									control={control}
									rules={{ required: true }}
									options={miniMake?.list.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniMake?.loading}
									selectParams={{
										page: miniMake?.miniParams?.page,
										page_size:
											miniMake?.miniParams?.page_size,
										search: miniMake?.miniParams?.search,
										no_of_pages:
											miniMake?.miniParams?.no_of_pages,
									}}
									hasMore={
										miniMake?.miniParams?.page <
										miniMake?.miniParams?.no_of_pages
									}
									fetchapi={getMiniMake}
									clearData={clearMiniMake}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="unit"
									label="Unit"
									control={control}
									disabled={getValuesItem ? false : true}
									rules={{ required: true }}
									options={miniUnits.list.map(
										(e: {
											name: string;
											id: string | number;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniUnits.loading}
									helperText={
										getValuesItem
											? ""
											: "Select an item to see unit"
									}
									selectParams={{
										page: miniUnits.miniParams.page,
										page_size:
											miniUnits.miniParams.page_size,
										search: miniUnits.miniParams.search,
										no_of_pages:
											miniUnits.miniParams.no_of_pages,
										item: getValuesItem?.value,
									}}
									hasMore={
										miniUnits.miniParams.page <
										miniUnits.miniParams.no_of_pages
									}
									fetchapi={getMiniUnits}
									clearData={clearMiniUnits}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="tax"
									label="Tax"
									control={control}
									rules={{ required: true }}
									options={miniTax?.list.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniTax?.loading}
									selectParams={{
										page: miniTax?.miniParams?.page,
										page_size:
											miniTax?.miniParams?.page_size,
										search: miniTax?.miniParams?.search,
										no_of_pages:
											miniTax?.miniParams?.no_of_pages,
									}}
									hasMore={
										miniTax?.miniParams?.page <
										miniTax?.miniParams?.no_of_pages
									}
									fetchapi={getMiniTax}
									clearData={clearMiniTax}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="postatus"
									label="Status"
									control={control}
									rules={{ required: true }}
									options={postatus}
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

export default PurchaseOrderReport;
