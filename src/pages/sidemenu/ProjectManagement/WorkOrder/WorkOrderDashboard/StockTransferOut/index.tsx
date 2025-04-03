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
import { getStockOut } from "@src/store/sidemenu/project_management/StockTransferOut/stock_out.action";
import {
	selectStockOut,
	setIsFilterOpen,
} from "@src/store/sidemenu/project_management/StockTransferOut/stock_out.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { LuEye, LuPencil, LuPlus } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import Filters from "./filters";
import { getFilterParams } from "@src/helpers";
import moment from "moment";

const StockOut = () => {
	const { id, tab } = useParams();
	const dispatch = useAppDispatch();
	const {
		stockOut: {
			stockoutList,
			pageParams,
			stockoutCount,
			loading,
			isFilterOpen,
		},
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectStockOut(state));

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
			title: "From Warehouse",
			width: 100,
		},
		{
			title: "To Warehouse",
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
		fromwarehouse?: string,
		towarehouse?: string,
		status?: JSX.Element,
		created_by?: string,
		created_on?: string,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			fromwarehouse,
			towarehouse,
			status,
			created_by,
			created_on,
			action,
		};
	}

	const rows = useMemo(() => {
		return stockoutList?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			// const description = (
			// 	<ReadMore
			// 		text={row.description ? row.description : ""}
			// 		maxLength={30}
			// 	/>
			// );
			const code = (
				<Tooltip
					TransitionComponent={Zoom}
					title="Click to view Stock Transfer Out details">
					<Link
						to={`/work_order/view/${id}/${tab}/project/stock_transfer_out/view/${row.id}`}>
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
			const status = (
				<>
					<span>
						{!row.sostatus ? (
							"None"
						) : (
							<Chip
								label={
									<Typography>
										{row.approved_status_name == "Approved" ? row?.approved_status_name : "Level " + row?.approved_level + " " + row?.approved_status_name}
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
									switch (row.approved_status_name) {
										case "Approved":
											tagColor = "success";
											break;
										case "Pending":
											tagColor = "warning";
											break;
										case "Rejected":
											tagColor = "error";
											break;
										case "Closed":
											tagColor = "primary";
											break;
										default:
											tagColor = "warning";
									}
									return tagColor;
								})()}
							/>
						)}
					</span>
				</>
			);
			const actions = (
				<Box
					sx={{
						display: "flex",
						gap: 2,
						justifyContent: "center",
					}}>
					{userAccessList?.indexOf(
						"StockTransfer.change_stocktransferout"
					) !== -1 && row?.approved_status_name != "Approved" && row?.approved_status_name != "Rejected" && (
							<Tooltip
								TransitionComponent={Zoom}
								title="Edit Stock Transfer Out">
								<Link
									to={`/work_order/view/${id}/${tab}/project/stock_transfer_out/${row.id}`}>
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
				row?.warehouse?.name,
				row?.to_warehouse?.name,
				status,
				row?.created_by?.fullname,
				row?.created_on
					? moment(row?.created_on).format("DD-MM-YYYY")
					: "",
				actions
			);
		});
	}, [stockoutList, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getStockOut({
				...pageParams,
				project: projectData?.id,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getStockOut({
				...pageParams,
				project: projectData?.id,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleSort = (field: any) => {
		dispatch(
			getStockOut({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getStockOut({
				...pageParams,
				project: projectData?.id,
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
				getStockOut({
					...pageParams,
					project: projectData?.id,
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
				permissionPreFix="StockTransfer"
				permissionPostFix="stocktransferout"
				navigateLink={`/work_order/view/${id}/${tab}/project/stock_transfer_out/0`}
				showAddButton={true}
				showFilterButton={true}
				openFilter={handleFilter}
				addButtonName="Add Stock Transfer Out"
				handleSearch={handleSearch}
				filteredData={getFilterParams(pageParams, ["project"])}
			/>
			<Stack justifyContent="end" spacing={2}>
				<TableComponent
					count={stockoutCount}
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

export default StockOut;
