import React, { useMemo } from "react";
import {
	Box,
	Button,
	ButtonGroup,
	Grid2 as Grid,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import { LuBook, LuPlus } from "react-icons/lu";
import { CustomDatepicker, FormInput } from "@src/components";
import { Control } from "react-hook-form";
import TextArea from "@src/components/form/TextArea";
import SelectComponent from "@src/components/form/SelectComponent";
import { getProjectTeam } from "@src/store/sidemenu/project_management/work_order/work_order.action";
import {
	clearProjectTeams,
	isTeamModalOpen,
	selectWorkOrders,
	setSelectedData,
} from "@src/store/sidemenu/project_management/work_order/work_order.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	getMiniCustomers,
	getMiniInspectionAgencies,
	getMiniPerformanceBankGuarantee,
	getMiniTax,
	getMiniUsers,
} from "@src/store/mini/mini.Action";
import {
	clearMiniCustomers,
	clearMiniInspectionAgencies,
	clearMiniPerformanceBankGuarantee,
	clearMiniTax,
	clearMiniUsers,
} from "@src/store/mini/mini.Slice";
import AddTeamMembers from "./AddTeamModal";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
interface Props {
	onSave: (value: any) => void;
	handleSubmit: any;
	register: unknown;
	errors: unknown;
	control: Control<any>;
	getValues: any;
	reset: any;
	setValue: any;
}

const WorkOrderDetails = ({
	onSave,
	handleSubmit,
	register,
	control,
	errors,
	getValues,
	reset,
	setValue,
}: Props) => {
	const dispatch = useAppDispatch();
	const {
		workOrder: { selectedData, projectTeams, team_modal, pageParams },
		mini: {
			miniUserList,
			miniUserParams,
			miniUserLoading,
			miniTax,
			miniCustomers,
			performanceBankGuarantee,
			inspectionAgencies,
		},
	} = useAppSelector((state) => selectWorkOrders(state));

	// const hide = () => {
	// 	dispatch(isTeamModalOpen(false));
	// 	dispatch(setSelectedData({}));
	// };

	// const teamModel = useMemo(() => {
	// 	return (
	// 		<AddTeamMembers
	// 			open={team_modal}
	// 			project_id={selectedData?.id ? selectedData?.id : ""}
	// 			hide={hide}
	// 			selectedData={selectedData}
	// 			params={pageParams}
	// 		/>
	// 	);
	// }, [selectedData, team_modal]);

	const getValues_is_performace_bank_guarantee =
		selectedData?.is_performace_bank_guarantee;
	const getValues_is_pre_dispatch_inspection =
		selectedData?.is_inspection_agency;
	const getValues_tax_type = parseInt(`${selectedData?.taxtype}`);
	const getValues_tax = selectedData?.tax;
	const gross = selectedData?.amount
		? parseFloat(`${selectedData?.amount}`)
		: 0;
	const gst_value = selectedData?.gst_percentage
		? parseFloat(`${selectedData?.gst_percentage}`)
		: 0;
	useMemo(() => {
		const gst_amaount = gross * (gst_value / 100);

		const price_after_gst = gross + gst_amaount;

		const tax_value = parseFloat(`${getValues_tax?.tax}`);

		let total = 0;

		const tax_amount = (() => {
			const taxRate = tax_value || 0; // Get the tax rate (default to 0 if undefined)

			if (getValues_tax_type == 2) {
				// Exclusive Tax
				if (tax_value) {
					const taxAmt = price_after_gst * (taxRate / 100);
					total = price_after_gst + taxAmt; // Add tax to the gross for exclusive tax
					return taxAmt;
				}
				return 0; // No tax if tax ID is not provided
			} else if (getValues_tax_type == 1) {
				// Inclusive Tax
				if (taxRate > 0) {
					const basicValue = price_after_gst / (1 + taxRate / 100); // Calculate the net price excluding tax
					const taxAmt = basicValue * (taxRate / 100); // Tax amount for inclusive tax
					total = price_after_gst; // Total is the gross (inclusive of tax)
					return taxAmt;
				}
				return 0; // No tax if tax rate is 0
			}
			return 0; // Default to 0 if no valid tax type is provided
		})();
		// setValue("taxamount", tax_amount.toFixed(2));
		// setValue("total_value", total.toFixed(2));
	}, [gross, gst_value, getValues_tax_type, getValues_tax]);

	// const totalValue = getValues('total_value');
	// console.log(totalValue);


	return (
		<Box mb={2}>
			{/* {teamModel} */}
			<form>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12 }}>
						<Typography
							bgcolor={"grey.200"}
							component={"h5"}
							sx={{
								p: "8px",
								display: "flex",
								alignItems: "center",
								mt: 1,
								textTransform: "uppercase",
							}}>
							<LuBook size={20} style={{ marginRight: "6px" }} />

							<Typography
								component={"span"}
								fontSize={"16px"}
								variant="body1">
								Project Details
							</Typography>
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<Stack flex={1}>
							<CustomDatepicker
								required
								control={control}
								name="start_date"
								hideAddon
								dateFormat="DD-MM-YYYY"
								showTimeSelect={false}
								timeFormat="h:mm a"
								timeCaption="time"
								inputClass="form-input"
								// minDate={new Date()}
								label={"Start Date"}
								tI={1}
							/>
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<Stack flex={1}>
							<CustomDatepicker
								control={control}
								required
								name="due_date"
								hideAddon
								dateFormat="DD-MM-YYYY"
								showTimeSelect={false}
								timeFormat="h:mm a"
								timeCaption="time"
								inputClass="form-input"
								// minDate={moment().add(1, "day").toDate()}
								label={"Due Date"}
								tI={1}
							/>
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="name"
							required
							label="Project Name"
							type="text"
							placeholder="Enter Project Name here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="project_no"
							label="Work Order Number"
							type="text"
							placeholder="Enter Work Order Number here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="amount"
							label="Basic Project Value"
							type="number"
							disabled
							placeholder="Enter Project Value here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="taxamount"
							label="Tax Amount"
							type="number"
							disabled
							placeholder="Enter tax amount here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="taxable_amount"
							label="Other Taxable Amount"
							type="number"
							placeholder="Enter Other Tax Amount here..."
							control={control}
							onChange={(event) => {
								const taxableValue = event.target.value;
								dispatch(setSelectedData({
									...selectedData,
									taxable_amount: taxableValue
								}))
							}}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="total_value"
							label="Total Value"
							type="number"
							disabled
							placeholder="Enter Total Value here..."
							control={control}
						/>
					</Grid>
					{/* <Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="gst_percentage"
							label="GST Percentage"
							type="number"
							onChange={(e) => {
								dispatch(
									setSelectedData({
										...selectedData,
										gst_percentage: e.target.value,
									})
								);
							}}
							placeholder="Write gst value here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
							name={`taxtype`}
							label="Tax Type"
							placeholder="Select a tax type..."
							control={control}
							disabled={false}
							rules={{ required: true }}
							options={[
								{
									id: 1,
									name: "Inclusive",
								},
								{
									id: 2,
									name: "Exclusive",
								},
							]}
							onChange={(e) => {
								dispatch(
									setSelectedData({
										...selectedData,
										taxtype: e.value,
									})
								);
							}}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
							name={`tax`}
							label="Tax"
							control={control}
							disabled={!getValues_tax_type}
							rules={{ required: true }}
							options={miniTax.list.map(
								(e: { id: any; name: string }) => ({
									id: e,
									name: e.name,
								})
							)}
							loading={miniTax.loading}
							selectParams={{
								page: miniTax.miniParams.page,
								page_size: miniTax.miniParams.page_size,
								search: miniTax.miniParams.search,
								no_of_pages: miniTax.miniParams.no_of_pages,
							}}
							hasMore={
								miniTax.miniParams.page <
								miniTax.miniParams.no_of_pages
							}
							onChange={(e) => {
								dispatch(
									setSelectedData({
										...selectedData,
										tax: e.value,
									})
								);
							}}
							fetchapi={getMiniTax}
							clearData={clearMiniTax}
						/>
					</Grid> */}

					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="delivery_in_lots"
							label="Delivery In Lots"
							type="number"
							placeholder="Enter Delivery In Lots here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="warrenty_period"
							required
							label="Warranty Period (Months)"
							type="number"
							placeholder="Enter Warranty Period here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
							name="manager"
							label="Manager"
							control={control}
							rules={{ required: true }}
							options={miniUserList.map(
								(e: { id: string; fullname: string }) => ({
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
								miniUserParams.page < miniUserParams.no_of_pages
							}
							fetchapi={getMiniUsers}
							clearData={clearMiniUsers}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<SelectComponent
							required
							name="customer"
							label="Customer"
							control={control}
							rules={{ required: true }}
							options={miniCustomers.list.map(
								(e: { id: string; name: string }) => ({
									id: e.id,
									name: e.name,
								})
							)}
							loading={miniCustomers.loading}
							selectParams={{
								page: miniCustomers.miniParams.page,
								page_size: miniCustomers.miniParams.page_size,
								search: miniCustomers.miniParams.search,
								no_of_pages:
									miniCustomers.miniParams.no_of_pages,
							}}
							hasMore={
								miniCustomers.miniParams.page <
								miniCustomers.miniParams.no_of_pages
							}
							fetchapi={getMiniCustomers}
							clearData={clearMiniCustomers}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={3}>
						<FormInput
							name="is_performace_bank_guarantee"
							label="Is performance Bank Guarantee"
							type="checkbox"
							control={control}
							onChange={(e: any) => {
								dispatch(
									setSelectedData({
										...selectedData,
										is_performace_bank_guarantee:
											e.target.checked,
									})
								);
							}}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={3}>
						<FormInput
							name="is_pre_dispatch_inspection"
							label="Is Pre Dispatch Inspection"
							type="checkbox"
							onChange={(e: any) => {
								dispatch(
									setSelectedData({
										...selectedData,
										is_pre_dispatch_inspection:
											e.target.checked,
									})
								);
							}}
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={3}>
						<FormInput
							name="is_inspection_agency"
							label="Is Inspection Agency"
							type="checkbox"
							onChange={(e: any) => {
								dispatch(
									setSelectedData({
										...selectedData,
										is_inspection_agency: e.target.checked,
									})
								);
							}}
							control={control}
						/>
					</Grid>
					{getValues_is_pre_dispatch_inspection && (
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								required
								name="inspection_agency"
								label="Inspection Agency"
								control={control}
								rules={{ required: true }}
								options={inspectionAgencies.list.map(
									(e: {
										id: string;
										concerned_officer: string;
									}) => ({
										id: e.id,
										name: e.concerned_officer,
									})
								)}
								loading={inspectionAgencies.loading}
								selectParams={{
									page: inspectionAgencies.miniParams.page,
									page_size:
										inspectionAgencies.miniParams.page_size,
									search: inspectionAgencies.miniParams
										.search,
									no_of_pages:
										inspectionAgencies.miniParams
											.no_of_pages,
								}}
								hasMore={
									inspectionAgencies.miniParams.page <
									inspectionAgencies.miniParams.no_of_pages
								}
								fetchapi={getMiniInspectionAgencies}
								clearData={clearMiniInspectionAgencies}
							/>
						</Grid>
					)}
					<Grid size={{ xs: 12, md: 6, lg: 3 }} mt={3}>
						<FormInput
							name="is_stagewise_inspection"
							label="Stagewise Inspection ?"
							type="checkbox"
							onChange={(e: any) => {
								dispatch(
									setSelectedData({
										...selectedData,
										is_stagewise_inspection:
											e.target.checked,
									})
								);
							}}
							control={control}
						/>
					</Grid>

					<Stack
						width={"100%"}
						spacing={1}
						direction={"row"}
						alignItems={"center"}>
						{/* <Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<SelectComponent
								name="team"
								label="Team"
								control={control}
								rules={{ required: true }}
								options={projectTeams.list.map(
									(e: { id: string; name: string }) => ({
										id: e.id,
										name: e.name,
									})
								)}
								loading={projectTeams.loading}
								selectParams={{
									page: projectTeams.miniParams.page,
									page_size:
										projectTeams.miniParams.page_size,
									search: projectTeams.miniParams.search,
									no_of_pages:
										projectTeams.miniParams.no_of_pages,
								}}
								hasMore={
									projectTeams.miniParams.page <
									projectTeams.miniParams.no_of_pages
								}
								fetchapi={getProjectTeam}
								clearData={clearProjectTeams}
							/>
						</Grid> */}
					</Stack>
				</Grid>
			</form>
		</Box>
	);
};

export default WorkOrderDetails;
