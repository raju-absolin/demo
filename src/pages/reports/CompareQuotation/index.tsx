import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardContent, Grid2 as Grid, Stack } from "@mui/material";
import { CustomDatepicker, RadioGroup } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import GoBack from "@src/components/GoBack";
import TableComponent from "@src/components/TableComponenet";
import {
	getMiniCompany,
	getMiniCustomers,
	getMiniEnquiry,
	getMiniProjects,
	getMiniTenderNature,
	getMiniUsers,
} from "@src/store/mini/mini.Action";
import {
	clearMiniCompany,
	clearMiniCustomers,
	clearMiniEnquiry,
	clearMiniProjects,
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

	project: miniTypes;
	purchase_enquiry: miniTypes;
	cqstatus: miniTypes;
}

const CompareQuotationReport = () => {
	const dispatch = useAppDispatch();
	const {
		mini: { miniProject, miniEnquiry },
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

			project: null,
			purchase_enquiry: null,
			cqstatus: null,
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
		project,
		purchase_enquiry,
		cqstatus,
	}: SavePayload) => {
		// var { file_format, ...params } = props.reportParamsData;
		var objData = {
			file_format: file_format,
			model_name: "CompareQuotation",
		};

		const ParamsData = {
			start_date: start_date
				? moment(start_date).format("YYYY-MM-DD")
				: "",
			end_date: end_date ? moment(end_date).format("YYYY-MM-DD") : "",
			project: project?.value,
			purchase_enquiry: purchase_enquiry?.value,
			cqstatus: cqstatus?.value,
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

	const cqstatus = [
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
			name: "Close",
		},
	];

	return (
		<GoBack
			is_goback={true}
			go_back_url={"/reports"}
			title={`Compare Quotation Report`}
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
										maxDate={new Date()}
										timeCaption="time"
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
									name="purchase_enquiry"
									label="Purchase Enquiry"
									control={control}
									rules={{ required: true }}
									options={miniEnquiry.list.map(
										(e: {
											id: string | number;
											code: string;
										}) => ({
											id: e.id,
											name: e.code,
										})
									)}
									placeholder="Select enquiry"
									loading={miniEnquiry.loading}
									selectParams={{
										page: miniEnquiry.miniParams.page,
										page_size:
											miniEnquiry.miniParams.page_size,
										search: miniEnquiry.miniParams.search,
										no_of_pages:
											miniEnquiry.miniParams.no_of_pages,
									}}
									hasMore={
										miniEnquiry.miniParams.page <
										miniEnquiry.miniParams.no_of_pages
									}
									fetchapi={getMiniEnquiry}
									clearData={clearMiniEnquiry}
								/>
							</Grid>
							<Grid
								size={{
									xs: 12,
									md: 4,
									xl: 2,
								}}>
								<SelectComponent
									name="cqstatus"
									label="Status"
									control={control}
									rules={{ required: true }}
									options={cqstatus}
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

export default CompareQuotationReport;
