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
import { getPurchaseOrders } from "@src/store/sidemenu/project_management/PurchaseOrder/po.action";
import {
	selectPurchaseOrders,
	setSelectedData,
	setGeneratePOModalOpen,
	setIsFilterOpen,
} from "@src/store/sidemenu/project_management/PurchaseOrder/po.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { LuEye, LuPencil, LuPlus } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import Filters from "./filters";
import { getFilterParams } from "@src/helpers";
import moment from "moment";
import GeneratePO from "./GeneratePO";

const PurchaseOrder = () => {
	const { id, tab } = useParams();
	const dispatch = useAppDispatch();
	const {
		purchaseOrder: {
			purchaseOrderList,
			pageParams,
			purchaseOrderCount,
			isFilterOpen,
			loading,
		},
		workOrder: { selectedData: projectData },
		system: { userAccessList },
	} = useAppSelector((state) => selectPurchaseOrders(state));

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Purchase Order Code",
			width: 100,
			sortable: true,
			field: "code",
		},
		{
			title: "Compare Quotation No",
			width: 100,
		},
		{
			title: "Purchase Enquiry No",
			width: 100,
		},
		{
			title: "Purchase Enquiry Date",
			width: 100,
		},
		{
			title: "Vendor",
			width: 100,
		},
		{
			title: "Status",
			width: 100,
		},
		{
			title: "Description",
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
		// {
		// 	title: "Vendor Status",
		// 	width: 100,
		// },
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		code?: JSX.Element,
		cqno?: string,
		peno?: string,
		pedate?: string,
		vendor?: string,
		status?: JSX.Element,
		description?: JSX.Element,
		created_by?: string,
		createdDate?: string,
		// cl_status?: string,
		action?: JSX.Element
	) {
		return {
			index,
			code,
			cqno,
			peno,
			pedate,
			vendor,
			status,
			description,
			created_by,
			createdDate,
			// cl_status,
			action,
		};
	}

	const rows = useMemo(() => {
		return purchaseOrderList?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			const description = (
				<ReadMore
					text={row.description ? row.description : ""}
					maxLength={30}
				/>
			);
			const status = (
				<>
					<span>
						{!row.approved_status ? (
							"None"
						) : (
							<Chip
								label={
									<Typography>
										{row.approved_status_name == "Approved"
											? row?.approved_status_name
											: "Level " +
												row?.approved_level +
												" " +
												row?.approved_status_name}
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
											tagColor = "success"; // MUI does not have 'blue', using 'info' instead
											break;
										case 3:
											tagColor = "error";
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
					title="Click to view order details">
					<Link
						to={`/work_order/view/${id}/${tab}/project/purchase_order/view/${row.id}`}>
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
						justifyContent: "start",
					}}>
					{userAccessList?.indexOf(
						"PurchaseOrder.change_purchaseorder"
					) !== -1 &&
						row?.approved_status_name != "Approved" &&
						row?.approved_status_name != "Rejected" && (
							<Tooltip
								TransitionComponent={Zoom}
								title="Edit Order">
								{/* <Link
								to={`/work_order/view/${id}/${tab}/project/purchase_order/${row.id}`}> */}
								<LuPencil
									style={{
										cursor: "pointer",
										color: "#fc6f03",
									}}
									onClick={() => {
										dispatch(setGeneratePOModalOpen(true));
										dispatch(setSelectedData(row));
									}}
								/>
								{/* </Link> */}
							</Tooltip>
						)}

					{/* <Link to={`/tenders/view/${id}/${tab}/purchase_order/${row.id}/view`}>
						<LuEye
							style={{ cursor: "pointer", color: "#fc6f03" }}
						/>
					</Link> */}
				</Box>
			);

			return createData(
				index,
				code,
				row?.comparequotation?.code,
				row?.purchaseenquiry?.code,
				moment(row?.purchaseenquiry?.required_date).format(
					"DD-MM-YYYY"
				),
				row?.vendor?.name,
				status,
				description,
				row?.created_by?.fullname,
				moment(row?.created_on).format("DD-MM-YYYY"),
				// row?.client_status_name == "ClientConfirm"
				// 	? "Confirmed"
				// 	: row?.client_status_name == "ClientRejected"
				// 		? "Rejected"
				// 		: "",
				actions
			);
		});
	}, [purchaseOrderList, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getPurchaseOrders({
				...pageParams,
				project_id: projectData?.id,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getPurchaseOrders({
				...pageParams,
				project_id: projectData?.id,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getPurchaseOrders({
				...pageParams,
				project_id: projectData?.id,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};
	const handleSort = (field: any) => {
		dispatch(
			getPurchaseOrders({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};

	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	useEffect(() => {
		if (projectData?.id) {
			dispatch(
				getPurchaseOrders({
					...pageParams,
					project_id: projectData?.id,
					search: "",
					page: 1,
					page_size: 10,
				})
			);
		}
	}, [projectData]);
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getPurchaseOrders({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};
	return (
		<Box>
			<TopComponent
				permissionPreFix="PurchaseOrder"
				permissionPostFix="purchaseorder"
				navigateLink={`/work_order/view/${id}/${tab}/project/purchase_order/0`}
				showAddButton={false}
				showFilterButton={true}
				openFilter={handleFilter}
				addButtonName="Add Purchase Order"
				handleSearch={handleSearch}
				handleInputChange={handleInputChange}
				filteredData={getFilterParams(pageParams, ["project_id"])}
			/>
			<Stack justifyContent="end" spacing={2}>
				<TableComponent
					count={purchaseOrderCount}
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
			<GeneratePO />
		</Box>
	);
};

export default PurchaseOrder;
