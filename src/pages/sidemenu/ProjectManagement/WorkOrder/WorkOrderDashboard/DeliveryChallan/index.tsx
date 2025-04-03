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
import { getDeliveryChallan } from "@src/store/sidemenu/project_management/DeliveryChallan/DC.action";
import {
	selectDeliveryChallan,
	setIsFilterOpen,
} from "@src/store/sidemenu/project_management/DeliveryChallan/DC.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { LuEye, LuPencil, LuPlus } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import Filters from "./filters";
import { getFilterParams } from "@src/helpers";
import moment from "moment";

const DeliveryChallan = () => {
	const { id, tab } = useParams();
	const dispatch = useAppDispatch();
	const {
		deliveryChallan: { list, pageParams, count, loading, isFilterOpen },
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectDeliveryChallan(state));

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
			title: "No of items",
			width: 100,
		},

		{
			title: "Vehicle Number",
			width: 100,
		},
		{
			title: "Mode Of Transport",
			width: 100,
		},
		{
			title: "Customer Name",
			width: 100,
		},
		{
			title: "Mobile Number",
			width: 100,
		},
		{
			title: "Email",
			width: 100,
		},
		{
			title: "Delivery Challan Type",
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
			title: "Status",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		code?: JSX.Element,
		no_of_items?: number,
		vehicle_no?: string,
		mode_of_transport?: string,
		customer?: string,
		mobile?: string,
		email?: string,
		dc_type_name?: string,
		createdBy?: string,
		createdOn?: string,
		status?: JSX.Element,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			no_of_items,
			vehicle_no,
			mode_of_transport,
			customer,
			mobile,
			email,
			dc_type_name,
			createdBy,
			createdOn,
			status,
			action,
		};
	}

	const rows = useMemo(() => {
		return list?.map((row, key) => {
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
						{!row.approved_status_name ? (
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
										| "warning" = "info";
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
			const code = (
				<Tooltip
					TransitionComponent={Zoom}
					title="Click to view record details">
					<Link
						to={`/work_order/view/${id}/${tab}/project/delivery_challan/view/${row.id}`}>
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
						"Delivery.change_deliverychallan"
					) !== -1 && row?.approved_status_name != "Approved" && row?.approved_status_name != "Rejected" && (
							<Tooltip TransitionComponent={Zoom} title="Edit Record">
								<Link
									to={`/work_order/view/${id}/${tab}/project/delivery_challan/${row.id}`}>
									<LuPencil
										style={{
											cursor: "pointer",
											color: "#fc6f03",
										}}
									/>
								</Link>
							</Tooltip>
						)}

					{/* <Link to={`/tenders/view/${id}/${tab}/delivery_challan/${row.id}/view`}>
						<LuEye
							style={{ cursor: "pointer", color: "#fc6f03" }}
						/>
					</Link> */}
				</Box>
			);

			return createData(
				index,
				code,
				row?.dchallan_items?.length,
				row?.vehicle_no,
				row?.mode_of_transport,
				row?.customer?.name,
				row?.mobile,
				row?.email,
				row?.dc_type_name,
				row?.created_by?.fullname,
				row?.created_on
					? moment(row?.created_on).format("DD-MM-YYYY")
					: "",
				status,
				actions
			);
		});
	}, [list, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getDeliveryChallan({
				...pageParams,
				project: projectData?.id,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getDeliveryChallan({
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
			getDeliveryChallan({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getDeliveryChallan({
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
				getDeliveryChallan({
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
				permissionPreFix="Delivery"
				permissionPostFix="deliverychallan"
				navigateLink={`/work_order/view/${id}/${tab}/project/delivery_challan/0`}
				showAddButton={true}
				showFilterButton={true}
				openFilter={handleFilter}
				addButtonName="Add Delivery Challan"
				handleSearch={handleSearch}
				filteredData={getFilterParams(pageParams, ["project"])}
			/>
			<Stack justifyContent="end" spacing={2}>
				<TableComponent
					count={count}
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

export default DeliveryChallan;
