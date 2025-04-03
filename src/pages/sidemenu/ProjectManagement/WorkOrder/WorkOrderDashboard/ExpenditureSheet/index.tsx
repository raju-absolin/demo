import { TurnLeftRounded } from "@mui/icons-material";
import {
	Box,
	Button,
	Chip,
	Stack,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import TopComponent from "@src/pages/settings/TopComponent";
import { getExpenditureSheet } from "@src/store/sidemenu/project_management/ExpenditureSheet/expenditure_sheet.action";
import {
	selectExpenditureSheet,
	setIsFilterOpen,
} from "@src/store/sidemenu/project_management/ExpenditureSheet/expenditure_sheet.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { LuEye, LuPencil, LuPlus } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import Filters from "./filters";
import { getFilterParams } from "@src/helpers";
import moment from "moment";

const ExpenditureSheet = () => {
	const { id, tab } = useParams();
	const dispatch = useAppDispatch();
	const {
		expenditureSheet: {
			expenditureSheetList,
			pageParams,
			expenditureSheetCount,
			loading,
			isFilterOpen,
		},
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectExpenditureSheet(state));

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Code",
			width: 100,
			sortable: true,
			field: "code",
		},
		{
			title: "Project",
			width: 100,
		},
		{
			title: "Mode Of Payment",
			width: 100,
		},
		{
			title: "Received Amount",
			width: 100,
		},
		{
			title: "Employee Name",
			width: 100,
		},
		{
			title: "Status",
			width: 100,
		},
		{
			title: "Created By",
			width: 100,
		},
		{
			title: "Created Date",
			width: 100,
			sortable: true,
			field: "created_on",
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		code?: JSX.Element,
		project?: string,
		paymentmode?: string,
		amount?: string,
		empname?: string,
		status?: JSX.Element,
		created_by?: string,
		created_on?: string,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			project,
			paymentmode,
			amount,
			empname,
			status,
			created_by,
			created_on,
			action,
		};
	}

	const rows = useMemo(() => {
		return expenditureSheetList?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			// const description = (
			// 	<ReadMore
			// 		text={row.description ? row.description : ""}
			// 		maxLength={30}
			// 	/>
			// );
			const status = (
				<>
					<span>
						{!row?.approved_status ? (
							"None"
						) : (
							<Chip
								label={
									<Typography>
										{row?.approved_status_name}
									</Typography>
								}
								color={(() => {
									let tagColor:
										| "default"
										| "primary"
										| "secondary"
										| "success"
										| "error"
										| "info"
										| "warning" = "default";
									switch (row.approved_status) {
										case 1:
											tagColor = "warning";
											break;
										case 2:
											tagColor = "info"; // MUI does not have 'blue', using 'info' instead
											break;
										case 3:
											tagColor = "success";
											break;
										case 4:
											tagColor = "error";
											break;
										default:
											tagColor = "default"; // Fallback color
									}
									return tagColor;
								})()}
							/>
						)}
					</span>
				</>
			);
			const code = (
				<Tooltip
					TransitionComponent={Zoom}
					title="Click to view expenditure sheet details">
					<Link
						to={`/work_order/view/${id}/${tab}/project/expenditure_sheet/view/${row.id}`}>
						<Button
							color="primary"
							variant="contained"
							sx={{
								width: 150,
							}}>
							{row?.code}
						</Button>
					</Link>
				</Tooltip>
			);

			const actions = (
				<Box
					sx={{
						display: "flex",
						gap: 2,
						justifyContent: "center",
					}}>
					{userAccessList?.indexOf(
						"Payments.change_expendituresheet"
					) !== -1 && (
						<Tooltip
							TransitionComponent={Zoom}
							title="Edit Expenditure Sheet">
							<Link
								to={`/work_order/view/${id}/${tab}/project/expenditure_sheet/${row.id}`}>
								<LuPencil
									style={{
										cursor: "pointer",
										color: "#fc6f03",
									}}
								/>
							</Link>
						</Tooltip>
					)}

					{/* <Link to={`/tenders/view/${id}/${tab}/material_received_notes/${row.id}/view`}>
						<LuEye
							style={{ cursor: "pointer", color: "#fc6f03" }}
						/>
					</Link> */}
				</Box>
			);

			return createData(
				index,
				code,
				row?.project?.name,
				row?.mode_of_payment_name,
				row?.received_amount,
				row?.employee_name,
				status,
				row?.created_by?.fullname,
				row?.created_on
					? moment(row?.created_on).format("DD-MM-YYYY")
					: "",
				actions
			);
		});
	}, [expenditureSheetList, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getExpenditureSheet({
				...pageParams,
				project_id: projectData?.id,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getExpenditureSheet({
				...pageParams,
				project_id: projectData?.id,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleSort = (field: any) => {
		dispatch(
			getExpenditureSheet({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getExpenditureSheet({
				...pageParams,
				project_id: projectData?.id,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	useEffect(() => {
		if (projectData?.id) {
			dispatch(
				getExpenditureSheet({
					...pageParams,
					project_id: projectData?.id,
					search: "",
					page: 1,
					page_size: 10,
				})
			);
		}
	}, [projectData]);
	return (
		<Box>
			<TopComponent
				permissionPreFix="Payments"
				permissionPostFix="expendituresheet"
				navigateLink={`/work_order/view/${id}/${tab}/project/expenditure_sheet/0`}
				showAddButton={true}
				showFilterButton={true}
				openFilter={handleFilter}
				addButtonName="Add Expenditure Sheet"
				handleSearch={handleSearch}
				filteredData={getFilterParams(pageParams, ["project_id"])}
			/>
			<Stack justifyContent="end" spacing={2}>
				<TableComponent
					count={expenditureSheetCount}
					columns={columns}
					rows={rows ? rows : []}
					loading={loading}
					page={pageParams?.page ? pageParams?.page : 1}
					pageSize={
						pageParams?.page_size ? pageParams?.page_size : 10
					}
					handleSort={handleSort}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Stack>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
		</Box>
	);
};

export default ExpenditureSheet;
