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
import { LuBook, LuDelete, LuPlus } from "react-icons/lu";
import { CustomDatepicker, FormInput } from "@src/components";
import { Control, useForm } from "react-hook-form";
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
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TableComponent from "@src/components/TableComponenet";
interface Props {}

const PerformanceBankGuarantee = ({}: Props) => {
	const dispatch = useAppDispatch();
	const {
		workOrder: {
			selectedData,
			projectTeams,
			team_modal,
			pageParams,
			peformance_bank_guarantee_list,
		},
		mini: {},
	} = useAppSelector((state) => selectWorkOrders(state));

	const BankPerformanceSchema = yup.object().shape({});

	const {
		control,
		handleSubmit,
		register,
		reset,
		getValues,
		setValue,
		formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(BankPerformanceSchema),
	});

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "PBG number",
			width: 100,
		},
		{
			title: "PBG Value",
			width: 100,
		},
		{
			title: "Date Of Issue",
			width: 100,
		},
		{
			title: "Date Of Expiry",
			width: 100,
		},
		{
			title: "Date Of Claim",
			width: 100,
		},
		{
			title: "Remarks",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		number: string,
		value: string,
		issuedate: string,
		expirydate: string,
		claimdate: string,
		remarks: string,
		actions: React.JSX.Element
	) {
		return {
			index,
			number,
			value,
			issuedate,
			expirydate,
			claimdate,
			remarks,
			actions,
		};
	}

	const rows = useMemo(() => {
		return peformance_bank_guarantee_list
			?.filter((e) => !e?.dodelete)
			?.map((row, key) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const actions = (
					<Box
						sx={{
							display: "flex",
							gap: 2,
							justifyContent: "center",
						}}>
						<LuDelete
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={() => {
								// dispatch(
								// 	setSelectedData({
								// 		...selectedData,
								// 		project_items: fiteredItems,
								// 	})
								// );
							}}
						/>
					</Box>
				);
				return createData(
					index,
					row?.number,
					row?.value,
					row?.issuedate,
					row?.expirydate,
					row?.claimdate,
					row?.remarks,
					actions
				);
			});
	}, [selectedData, createData]);

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
								Is Bank Guarantied
							</Typography>
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<Stack flex={1}>
							<CustomDatepicker
								required
								control={control}
								name="issuedate"
								hideAddon
								dateFormat="DD-MM-YYYY"
								showTimeSelect={false}
								timeFormat="h:mm a"
								timeCaption="time"
								inputClass="form-input"
								// minDate={new Date()}
								label={"Issue Date"}
								tI={1}
							/>
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<Stack flex={1}>
							<CustomDatepicker
								control={control}
								required
								name="expirydate"
								hideAddon
								dateFormat="DD-MM-YYYY"
								showTimeSelect={false}
								timeFormat="h:mm a"
								timeCaption="time"
								inputClass="form-input"
								// minDate={new Date()}
								label={"Expiry Date"}
								tI={1}
							/>
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<Stack flex={1}>
							<CustomDatepicker
								control={control}
								required
								name="claimdate"
								hideAddon
								dateFormat="DD-MM-YYYY"
								showTimeSelect={false}
								timeFormat="h:mm a"
								timeCaption="time"
								inputClass="form-input"
								// minDate={new Date()}
								label={"Claim Date"}
								tI={1}
							/>
						</Stack>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							name="number"
							required
							label="PBG Number"
							type="number"
							placeholder="Enter PBG number here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<FormInput
							required
							name="value"
							label="Project Value"
							type="number"
							placeholder="Enter Project Value here..."
							control={control}
						/>
					</Grid>
				</Grid>
			</form>

			<Box my={2}>
				<TableComponent
					count={selectedData?.project_items?.length ?? 0}
					columns={columns}
					rows={rows ? rows : []}
					loading={false}
					page={1}
					pageSize={10}
					handleChangePage={() => {}}
					handleChangeRowsPerPage={() => {}}
					showPagination={false}
				/>
			</Box>
		</Box>
	);
};

export default PerformanceBankGuarantee;
