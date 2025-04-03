import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardContent, Grid2 as Grid, Stack } from "@mui/material";
import { CustomDatepicker, RadioGroup } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import GoBack from "@src/components/GoBack";
import TableComponent from "@src/components/TableComponenet";
import {
	getMiniCompany,
	getMiniCustomers,
	getMiniLeads,
	getMiniProjects,
	getMiniTenderNature,
	getMiniUsers,
} from "@src/store/mini/mini.Action";
import {
	clearMiniCompany,
	clearMiniCustomers,
	clearMiniLeads,
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
	lead: miniTypes;
	user: miniTypes;
}

const BudgetaryQuotationReport = () => {
	const dispatch = useAppDispatch();
	const {
		mini: {
			miniUserList,
			miniUserLoading,
			miniUserParams,
			miniLeads,
			miniProject,
		},
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
			lead: null,
			user: null,
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
		lead,
		user,
	}: SavePayload) => {
		// var { file_format, ...params } = props.reportParamsData;
		var objData = {
			file_format: file_format,
			model_name: "BudgetaryQuotation",
		};

		const ParamsData = {
			start_date: start_date
				? moment(start_date).format("YYYY-MM-DD")
				: "",
			end_date: end_date ? moment(end_date).format("YYYY-MM-DD") : "",
			lead: lead?.value,
			user: user?.value,
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

	return (
		<GoBack
			is_goback={true}
			go_back_url={"/reports"}
			title={`Budgetary Quotation Report`}
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
									lg: 2,
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
									lg: 2,
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
									lg: 2,
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
									lg: 2,
								}}>
								<SelectComponent
									name="assign_to"
									label="Assign To"
									control={control}
									rules={{ required: true }}
									options={miniUserList.map(
										(e: {
											id: string | number;
											fullname: string;
										}) => ({
											id: e.id,
											name: e.fullname,
										})
									)}
									loading={miniUserLoading}
									selectParams={{
										page: miniUserParams.page,
										page_size: miniUserParams.page_size,
										search: miniUserParams.search,
										no_of_pages: miniUserParams.no_of_pages,
									}}
									hasMore={
										miniUserParams.page <
										miniUserParams.no_of_pages
									}
									fetchapi={getMiniUsers}
									clearData={clearMiniUsers}
								/>
							</Grid>

							<Grid size={{ xs: 12, md: 4, lg: 2 }}>
								<SelectComponent
									name="Lead"
									label="lead"
									control={control}
									rules={{ required: true }}
									options={miniLeads.list.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniLeads.loading}
									selectParams={{
										page: miniLeads.miniParams.page,
										page_size:
											miniLeads.miniParams.page_size,
										search: miniLeads.miniParams.search,
										no_of_pages:
											miniLeads.miniParams.no_of_pages,
									}}
									hasMore={
										miniLeads.miniParams.page <
										miniLeads.miniParams.no_of_pages
									}
									fetchapi={getMiniLeads}
									clearData={clearMiniLeads}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4, lg: 2 }}>
								<SelectComponent
									name="User"
									label="user"
									control={control}
									rules={{ required: true }}
									options={miniUserList.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniUserLoading}
									selectParams={{
										page: miniUserParams.page,
										page_size: miniUserParams.page_size,
										search: miniUserParams.search,
										no_of_pages: miniUserParams.no_of_pages,
									}}
									hasMore={
										miniUserParams.page <
										miniUserParams.no_of_pages
									}
									fetchapi={getMiniUsers}
									clearData={clearMiniUsers}
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

export default BudgetaryQuotationReport;
