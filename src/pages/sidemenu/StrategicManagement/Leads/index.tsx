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
	Stack,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import { PageBreadcrumb, PopConfirm } from "@src/components";
import TableComponent from "@src/components/TableComponenet";
import { getFilterParams } from "@src/helpers";
import { useDropdownMenu } from "@src/hooks";
import TopComponent from "@src/pages/settings/TopComponent";
import {
	ApproveLead,
	getLeads,
	RejectLead,
} from "@src/store/sidemenu/strategic_management/leads/leads.action";
import {
	isModalOpen,
	selectLeads,
	setIsFilterOpen,
	setSelectedData,
} from "@src/store/sidemenu/strategic_management/leads/leads.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
	LuCheck,
	LuEye,
	LuMoreVertical,
	LuPencil,
	LuPenLine,
	LuX,
} from "react-icons/lu";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Filters from "./Filters";
import moment from "moment";

const Leads = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();
	const {
		leads: {
			leadsList,
			leadsCount,
			pageParams,
			selectedData,
			isFilterOpen,
			loading,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectLeads(state));
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
			title: "Lead Name",
			width: 150,
		},
		{
			title: "Lead Entry Date",
			width: 150,
		},
		{
			title: "Phone",
			width: 100,
		},
		{
			title: "Email",
			width: 100,
		},
		{
			title: "Company",
			width: 100,
		},
		{
			title: "Customer",
			width: 100,
		},
		{
			title: "BD Name",
			width: 100,
		},
		{
			title: "Priority",
			width: 100,
		},
		{
			title: "Status",
			width: 100,
		},
		// {
		// 	title: "No of Assignees",
		// 	width: 150,
		// },
		{
			title: "Created By",
			width: 150,
		},
		{
			title: "Created Date",
			width: 200,
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
		name: string,
		date: string,
		mobile: string,
		email: string,
		company: string,
		customer: string,
		bdmName: string,
		priority: JSX.Element,
		status: JSX.Element,
		// assignees: JSX.Element,
		createdby: string | undefined,
		created_on: string,
		actions: React.JSX.Element
	) {
		return {
			index,
			code,
			name,
			date,
			mobile,
			email,
			company,
			customer,
			bdmName,
			priority,
			status,
			// assignees,
			createdby,
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

	const rows = leadsList?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		// string comName =
		const code = (
			<Tooltip
				TransitionComponent={Zoom}
				title="Click to see tender details">
				<Link to={`/leads/view/${row.id}/0/`}>
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

		const priority = (
			<>
				<span>
					{!row.priority ? (
						"None"
					) : (
						<Chip
							label={<Typography>{row.priority_name}</Typography>}
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
			<>
				<span>
					{!row.authorized_status ? (
						"None"
					) : (
						<Chip
							label={
								<Typography>
									{row.authorized_status_name}
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
								switch (row.authorized_status) {
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
										tagColor = "default";
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
				{row?.authorized_status_name !== "Approved" && (
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
				)}
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
						"LeadManagement.can_approve_lead"
					) !== -1 &&
						row.authorized_status != 2 &&
						row?.authorized_status_name !== "Approved" &&
						row?.authorized_status_name !== "Rejected" && (
							<PopConfirm
								onConfirm={() => {
									const data = {
										status: 2,
									};
									dispatch(
										ApproveLead({
											id: row.id ? row.id : "",
											data,
											params: pageParams,
										})
									);
									handleClose(row?.id ? row.id : "");
								}}
								onCancel={() => {
									handleClose(row?.id ? row.id : "");
								}}
								message="Are you sure you want to approve this lead?"
								confirmButtonText="Confirm"
								cancelButtonText="Cancel">
								<MenuItem>
									<Stack
										direction={"row"}
										gap={1.5}
										alignItems={"center"}>
										<LuCheck
											style={{
												cursor: "pointer",
												color: "#2ecc5d",
												fontSize: 16,
											}}
										/>
										<Typography>Approve</Typography>
									</Stack>
								</MenuItem>
							</PopConfirm>
						)}
					{userAccessList?.indexOf(
						"LeadManagement.can_approve_lead"
					) !== -1 &&
						row.authorized_status != 3 &&
						row?.authorized_status_name !== "Approved" &&
						row?.authorized_status_name !== "Rejected" && (
							<PopConfirm
								onConfirm={() => {
									const data = {
										status: 3,
									};
									dispatch(
										RejectLead({
											id: row.id ? row.id : "",
											data,
											params: pageParams,
										})
									);
									handleClose(row?.id ? row.id : "");
								}}
								onCancel={() => {
									handleClose(row?.id ? row.id : "");
								}}
								message="Are you sure you want to reject this lead?"
								confirmButtonText="Confirm"
								cancelButtonText="Cancel">
								<MenuItem>
									<Stack
										direction={"row"}
										gap={1.5}
										alignItems={"center"}>
										<LuX
											style={{
												cursor: "pointer",
												color: "#cc382e",
												fontSize: 16,
											}}
										/>
										<Typography>Reject</Typography>
									</Stack>
								</MenuItem>
							</PopConfirm>
						)}
					{userAccessList?.indexOf("LeadManagement.change_lead") !==
						-1 &&
						row.authorized_status_name != "Approved" && (
							<MenuItem
								onClick={() => {
									handleClose(row?.id ? row.id : "");
									navigate(`/leads/${row.id}`);
								}}>
								<Stack
									direction={"row"}
									gap={1.5}
									alignItems={"center"}>
									<LuPenLine
										style={{
											cursor: "pointer",
										}}
									/>
									Edit
								</Stack>
							</MenuItem>
						)}
				</Menu>
			</>
		);

		// const actions = (
		// 	<Box
		// 		sx={{
		// 			display: "flex",
		// 			gap: 2,
		// 		}}>
		// 		{userAccessList?.indexOf("LeadManagement.change_lead") !==
		// 			-1 && (
		// 			<LuPencil
		// 				style={{ cursor: "pointer", color: "#fc6f03" }}
		// 				onClick={() => {
		// 					navigate(`/leads/${row.id}`);
		// 				}}
		// 			/>
		// 		)}

		// 		{/* <Link to={`/leads/view/${row.id}/0/`}>
		// 			<LuEye style={{ cursor: "pointer", color: "#fc6f03" }} />
		// 		</Link> */}
		// 	</Box>
		// );

		// const assignees = <Typography>{row?.assignees?.length}</Typography>;

		return createData(
			index,
			code,
			row?.name || "",
			row.date ? moment(row.date, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
			row?.mobile || "",
			row?.email || "",
			row?.company?.name ? row?.company?.name : "",
			row.customer?.name ? row?.customer?.name : "",
			row?.bdm?.fullname ? row?.bdm?.fullname : "",
			priority,
			status,
			// assignees,
			row?.created_by?.fullname,
			row?.created_on ? row?.created_on : "",
			actions
		);
	});

	const destroyModal = () => {
		openModal(false);
		dispatch(setSelectedData({}));
	};

	const openModal = (value: boolean) => {
		dispatch(isModalOpen(value));
	};

	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getLeads({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getLeads({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};
	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getLeads({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getLeads({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	const handleSort = (field: any) => {
		dispatch(
			getLeads({
				...pageParams,
				ordering: field,
				page: 1,
			})
		);
	};

	useEffect(() => {
		dispatch(
			getLeads({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
	}, []);

	return (
		<Box>
			<Box
				sx={{
					display: "grid",
					gap: 1,
					mt: 2,
				}}>
				<Card
					sx={{
						px: 2,
						pt: 2,
					}}>
					<PageBreadcrumb
						title="Leads"
						subName="Strategic Management"
					/>
					{/* <CardContent> */}
					<TopComponent
						permissionPreFix="LeadManagement"
						permissionPostFix="lead"
						navigateLink={"/leads/0"}
						showAddButton={true}
						addButtonName="Add Lead"
						handleSearch={handleSearch}
						handleInputChange={handleInputChange}
						showFilterButton={true}
						openFilter={handleFilter}
						openModal={openModal}
						filteredData={getFilterParams(pageParams)}
					/>
					<TableComponent
						count={leadsCount}
						columns={columns}
						rows={rows}
						loading={loading}
						page={pageParams.page}
						pageSize={pageParams.page_size}
						handleSort={handleSort}
						handleChangePage={handleChangePage}
						handleChangeRowsPerPage={handleChangeRowsPerPage}
					/>
					{/* </CardContent> */}
				</Card>
				{/* <Card>
					<CardContent></CardContent>
				</Card> */}
			</Box>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
		</Box>
	);
};

export default Leads;
