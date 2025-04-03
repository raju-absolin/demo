import {
	Box,
	Button,
	Card,
	Chip,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Stack,
	Tooltip,
	Typography,
	useTheme,
	Zoom,
} from "@mui/material";
import { PageBreadcrumb } from "@src/components";
import TableComponent from "@src/components/TableComponenet";
import { getFilterParams } from "@src/helpers";
import TopComponent from "@src/pages/settings/TopComponent";
import {
	getServiceRequestById,
	getServiceRequestsAssigned,
} from "@src/store/sidemenu/service_management/ServiceRequestAssigned/serviceRequestAssigned.action";
import {
	isModalOpen,
	setIsFilterOpen,
	setOpenStatusModal,
	setOpenViewModal,
	setSelectedData,
	useServiceRequestSelector,
} from "@src/store/sidemenu/service_management/ServiceRequestAssigned/serviceRequestAssigned.slice";
import { useAppDispatch } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { LuMoreVertical, LuPen, LuPenLine } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import Filters from "./Filter";
import AddServiceRequest from "./add.serviceRequest";
import StatusModal from "./StatusModal";
import ViewServiceRequest from "./new_view.serviceRequest";
import moment from "moment";

const ServiceRequest = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const {
		serviceRequest: { list, count, pageParams, loading, isFilterOpen },
		system: { userAccessList },
	} = useServiceRequestSelector();
	const columns = [
		{
			title: "S.No",
			width: 30,
		},
		{
			title: "Code",
			width: 30,
			sortable: true,
			field: "code",
		},
		{
			title: "Due Date",
			width: 30,
		},
		{
			title: "Location",
			width: 30,
		},
		{
			title: "Department",
			width: 30,
		},
		{
			title: "Over Due Days",
			width: 100,
		},
		{
			title: "Status",
			width: 100,
		},
		{
			title: "Priority",
			width: 30,
		},
		{
			title: "Created Date",
			width: 30,
			sortable: true,
			field: "created_on",
		},
		{
			title: "Actions",
			width: 100,
		},
	];

	function createData(
		index: number,
		code: React.JSX.Element,
		due_date: React.JSX.Element,
		location: string,
		department: string,
		overdue_days: React.JSX.Element,
		// description: string,
		priority: JSX.Element,
		status: React.JSX.Element,
		created_on: string,
		actions: React.JSX.Element
	) {
		return {
			index,
			code,
			due_date,
			department,
			location,
			overdue_days,
			// description,
			priority,
			status,
			created_on,
			actions,
		};
	}

	// const { anchorEl, open, handleClick, handleClose } = useDropdownMenu();

	const [anchorEls, setAnchorEls] = useState<{
		[key: string]: HTMLElement | null;
	}>({});

	const handleClick = (
		event: React.MouseEvent<HTMLElement>,
		rowId: string
	) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: event.currentTarget }));
	};

	const handleClose = (rowId: string) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: null }));
	};

	const theme = useTheme();

	const rows =
		list?.length != 0 &&
		list?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			const code = (
				<Tooltip
					TransitionComponent={Zoom}
					title="Click to see work order details">
					{/* <Link to={`/service_request/view/${row.id}/0/`}> */}
					<Button
						color="success"
						variant="contained"
						onClick={() => {
							dispatch(setOpenViewModal(true));
							dispatch(setSelectedData(row));
						}}
						sx={{
							width: 150,
						}}>
						{row?.code}
					</Button>
					{/* </Link> */}
				</Tooltip>
			);

			const priority = (
				<>
					<span>
						{!row.priority ? (
							"None"
						) : (
							<Chip
								label={
									<Typography>{row.priority_name}</Typography>
								}
								style={{
									backgroundColor: (() => {
										switch (row.priority) {
											case 1:
												return "#ADD8E6"; // Light Blue
											case 2:
												return "#4682B4"; // Steel Blue
											case 3:
												return "#00008B"; // Dark Blue
											default:
												return "#ADD8E6"; // Fallback color
										}
									})(),
									color: "#fff", // Text color for contrast
									height: "40px", // Fixed height
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									borderRadius: "20px", // Optional for rounded corners
								}}
							/>
						)}
					</span>
				</>
			);

			const status = (
				<Stack direction={"row"} justifyContent={"center"} spacing={1}>
					<span>
						{!row.status ? (
							"None"
						) : (
							<Chip
								label={
									<Typography>{row.status_name}</Typography>
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
									switch (row.status) {
										case 1:
											tagColor = "warning";
											break;
										case 2:
											tagColor = "success";
											break;
										case 3:
											tagColor = "success";
											break;
										case 6:
											tagColor = "error";
											break;
										case 7:
											tagColor = "error";
											break;
										default:
											tagColor = "default";
									}
									return tagColor;
								})()}
							/>
						)}
					</span>
					<Stack direction="row" spacing={1}>
						{userAccessList?.indexOf(
							"FacilityManagement.can_approve_servicerequest"
						) !== -1 && (
							<Tooltip
								TransitionComponent={Zoom}
								title="Change Status">
								<IconButton
									onClick={() => {
										dispatch(setOpenStatusModal(true));
										dispatch(
											getServiceRequestById({
												id: row?.id ? row?.id : "",
											})
										);
									}}>
									<LuPen
										style={{
											cursor: "pointer",
											color: "#cc6d2e",
											fontSize: 16,
										}}
									/>
								</IconButton>
							</Tooltip>
						)}
					</Stack>
				</Stack>
			);

			const actions = (
				<>
					<IconButton
						sx={{ px: "6px" }}
						tabIndex={key}
						onClick={(e) => handleClick(e, row.id ? row.id : "")}
						aria-controls={
							anchorEls[row?.id ? row.id : ""]
								? "account-menu"
								: undefined
						}
						aria-haspopup="true"
						aria-expanded={
							anchorEls[row?.id ? row.id : ""]
								? "true"
								: undefined
						}>
						<LuMoreVertical size={16} />
					</IconButton>
					<Menu
						anchorEl={anchorEls[row?.id ? row.id : ""]}
						id="account-menu"
						open={Boolean(anchorEls[row?.id ? row.id : ""])}
						onClose={() => handleClose(row?.id ? row.id : "")}
						PaperProps={{
							elevation: 0,
							sx: {
								overflow: "visible",
								filter: "drop-shadow(0px 1px 2px rgba(185, 185, 185, 0.32))",
								mt: 1.5,
								"& .MuiAvatar-root": {
									width: 32,
									height: 32,
									ml: -0.5,
									mr: 1,
								},
								"&:before": {
									content: '""',
									display: "block",
									position: "absolute",
									top: 0,
									right: 14,
									width: 10,
									height: 10,
									bgcolor: "background.paper",
									transform: "translateY(-50%) rotate(45deg)",
									zIndex: 0,
								},
							},
						}}
						transformOrigin={{
							horizontal: "right",
							vertical: "top",
						}}
						anchorOrigin={{
							horizontal: "right",
							vertical: "bottom",
						}}>
						{userAccessList?.indexOf(
							"FacilityManagement.change_servicerequest"
						) !== -1 && (
							<MenuItem
								onClick={() => {
									openModal(true, row);
								}}>
								<ListItemIcon>
									<LuPenLine
										style={{
											cursor: "pointer",
										}}
									/>
								</ListItemIcon>
								Edit
							</MenuItem>
						)}
					</Menu>
				</>
			);
			const dueDate = (
				<Typography minWidth={100} textAlign={"center"}>
					{moment(row?.due_date).format("DD-MM-YYYY")}
				</Typography>
			);
			const overDueDays = (
				<Typography minWidth={100} color="red" textAlign={"center"}>
					{row?.overdue_days}
				</Typography>
			);

			return createData(
				index,
				code,
				dueDate,
				row?.location?.name,
				row?.department?.name,
				overDueDays,
				// row?.description,
				priority,
				status,
				row?.created_on
					? moment(row?.created_on).format("DD-MM-YYYY")
					: "",
				actions
			);
		});

	const openModal = (value: boolean, rowdata?: any) => {
		dispatch(setSelectedData(rowdata || {}));
		dispatch(isModalOpen(value));
	};

	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getServiceRequestsAssigned({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getServiceRequestsAssigned({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getServiceRequestsAssigned({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleSort = (field: any) => {
		dispatch(
			getServiceRequestsAssigned({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};

	useEffect(() => {
		dispatch(
			getServiceRequestsAssigned({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
	}, []);

	const hide = () => {
		dispatch(isModalOpen(false));
		dispatch(setSelectedData({}));
	};

	return (
		<Box>
			<PageBreadcrumb
				title="Assigned Service Request"
				subName="Project Management"
			/>
			<Box
				sx={{
					display: "grid",
					gap: 1,
				}}>
				<Card
					sx={{
						px: 2,
						pt: 2,
					}}>
					<TopComponent
						permissionPreFix="FacilityManagement"
						permissionPostFix="servicerequest"
						navigateLink={""}
						showAddButton={false}
						addButtonName="Add Service Request"
						handleSearch={handleSearch}
						showFilterButton={true}
						openFilter={handleFilter}
						openModal={() => {
							openModal(true);
						}}
						filteredData={getFilterParams(pageParams)}
					/>
					<TableComponent
						count={count}
						columns={columns}
						rows={rows ? rows : []}
						loading={loading}
						page={pageParams.page}
						pageSize={pageParams.page_size}
						handleSort={handleSort}
						handleChangePage={handleChangePage}
						handleChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</Card>
			</Box>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
			<AddServiceRequest />
			<StatusModal pageParams={pageParams} />
			<ViewServiceRequest />
		</Box>
	);
};

export default ServiceRequest;
