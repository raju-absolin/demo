import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
	useTheme,
	Zoom,
} from "@mui/material";
import { PageBreadcrumb } from "@src/components";
import TableComponent from "@src/components/TableComponenet";
import { getFilterParams } from "@src/helpers";
import { useDropdownMenu } from "@src/hooks";
import TopComponent from "@src/pages/settings/TopComponent";
import { getWorkOrders } from "@src/store/sidemenu/project_management/work_order/work_order.action";
import {
	isModalOpen,
	isTeamModalOpen,
	selectWorkOrders,
	setBidSelectionModal,
	setIsFilterOpen,
	setSelectedData,
} from "@src/store/sidemenu/project_management/work_order/work_order.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
	LuDownload,
	LuEye,
	LuLink,
	LuMoreVertical,
	LuPencil,
	LuPenLine,
	LuPlusCircle,
	LuShare2,
	LuTrash2,
} from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import Filters from "./Filter";
import AddTeamMembers from "./components/AddTeamModal";
import BidSelectionModal from "./components/BidSelectionModal";

const WorkOrder = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const {
		workOrder: {
			workOrdersList,
			workOrderCount,
			pageParams,
			selectedData,
			loading,
			isFilterOpen,
			team_modal,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectWorkOrders(state));
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
			title: "Start Date",
			width: 100,
		},
		{
			title: "Due Date",
			width: 100,
		},
		{
			title: "Project No",
			width: 100,
		},
		{
			title: "Project Name",
			width: 150,
		},
		{
			title: "Project Amount",
			width: 150,
		},
		{
			title: "Company",
			width: 100,
		},
		{
			title: "Manager",
			width: 100,
		},
		// {
		// 	title: "Bid Date",
		// 	width: 150,
		// },
		{
			title: "No Of Team Members",
			width: 100,
		},
		{
			title: "Created By",
			width: 100,
		},
		{
			title: "Created Date",
			width: 150,
			sortable: true,
			field: "created_on",
		},
		{
			title: "Status",
			width: 100,
		},
		{
			title: "Actions",
			width: 100,
		},
	];

	function createData(
		index: number,
		code: React.JSX.Element,
		start_date: string,
		due_date: string,
		project_no: string | number,
		name: string,
		amount: string | number,
		company: string,
		manager: string,
		// tender_datetime?: Date | string,
		no_of_team_members: string | number,
		createdby: string | undefined,
		created_on: Date | string,
		status: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			code,
			start_date,
			due_date,
			project_no,
			name,
			amount,
			company,
			manager,
			// tender_datetime,
			no_of_team_members,
			createdby,
			created_on,
			status,
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
		workOrdersList?.length != 0 &&
		workOrdersList?.map((row, key) => {
			const index =
				(pageParams.page - 1) * pageParams.page_size + (key + 1);

			const code = (
				<Tooltip
					TransitionComponent={Zoom}
					title="Click to see work order details">
					<Link to={`/work_order/view/${row.id}/0/`}>
						<Button
							color="success"
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
							"ProjectManagement.change_project"
						) !== -1 && (
							<MenuItem
								onClick={() => {
									navigate(
										`/work_order/${row?.tender?.id}/${row?.id}`
									);
									handleClose(row?.id ? row.id : "");
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
						{/* {(userAccessList?.indexOf(
							"ProjectManagement.add_projectteam"
						) !== -1 ||
							userAccessList?.indexOf(
								"ProjectManagement.update_projectteam"
							) !== -1) && (
							<MenuItem
								onClick={() => {
									dispatch(setSelectedData(row));
									dispatch(isTeamModalOpen(true));
									handleClose(row?.id ? row.id : "");
								}}>
								<ListItemIcon>
									<LuPlusCircle
										style={{
											cursor: "pointer",
										}}
									/>
								</ListItemIcon>
								<Typography
									sx={{
										color: theme.palette.text.primary,
									}}>
									Add team
								</Typography>
							</MenuItem>
						)} */}
					</Menu>
				</>
			);

			// {
			// 	index,
			// project_no,
			// name,
			// amount,
			// company,
			// manager,
			// tender_datetime,
			// no_of_team_members,
			// status,
			// actions,
			// }

			return createData(
				index,
				code,
				row?.start_date || "",
				row?.due_date || "",
				row?.project_no || "",
				row?.name || "",
				row?.amount || "",
				row?.company?.name || "",
				row?.manager?.fullname || "",
				// row?.tender_datetime,
				row?.team?.length || "",
				row?.created_by?.fullname,
				row?.created_on || "",
				status,
				actions
			);
		});

	const destroyModal = () => {
		openModal(false);
		dispatch(setSelectedData({}));
	};

	const openModal = (value: boolean) => {
		dispatch(setBidSelectionModal(value));
	};

	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getWorkOrders({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getWorkOrders({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getWorkOrders({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleSort = (field: any) => {
		dispatch(
			getWorkOrders({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};
	useEffect(() => {
		dispatch(
			getWorkOrders({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
	}, []);

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
	return (
		<Box>
			{/* {teamModel} */}

			<Box
				sx={{
					display: "grid",
					gap: 1,
				}}>
				<Card
					sx={{
						p: 2,
						my: 2,
					}}>
					<PageBreadcrumb
						title="Work Order"
						subName="Project Management"
					/>
					{/* <CardContent> */}
					<TopComponent
						permissionPreFix="ProjectManagement"
						permissionPostFix="project"
						// navigateLink={"/work_order/0/0"}
						navigateLink={""}
						showAddButton={true}
						addButtonName="Add Work Order"
						handleSearch={handleSearch}
						showFilterButton={true}
						openFilter={handleFilter}
						openModal={openModal}
						filteredData={getFilterParams(pageParams)}
					/>
					{/* </CardContent> */}
					<TableComponent
						count={workOrderCount}
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
				{/* <Card>
					<CardContent>
						<TableComponent
							count={workOrderCount}
							columns={columns}
							rows={rows}
							loading={loading}
							page={pageParams.page}
							pageSize={pageParams.page_size}
							handleChangePage={handleChangePage}
							handleChangeRowsPerPage={handleChangeRowsPerPage}
						/>
					</CardContent>
				</Card> */}
			</Box>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
			{/* <AddBidItem isOpen={modal} hide={destroyModal} /> */}
			<BidSelectionModal />
		</Box>
	);
};

export default WorkOrder;
