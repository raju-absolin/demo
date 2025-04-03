import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { PageBreadcrumb, PopConfirm } from "@src/components";
import TableComponent from "@src/components/TableComponenet";
import {
	ApproveTender,
	getTenders,
	RejectTender,
} from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	tendersSelectors,
	isModalOpen,
	setIsFilterOpen,
	selectTenders,
	isAssignToModalOpen,
	setTenderState,
} from "@src/store/sidemenu/tender_mangement/tenders/tenders.slice";
import { systemSelector } from "@src/store/system/system.slice";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Fade,
	Stack,
	Chip,
	Typography,
	IconButton,
	Tooltip,
	Zoom,
	Menu,
	MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
	LuBarChart,
	LuBarChart2,
	LuCheck,
	LuEye,
	LuMoreVertical,
	LuPencil,
	LuPenLine,
	LuUser,
	LuX,
} from "react-icons/lu";
import TopComponent from "@src/pages/settings/TopComponent";
import Filters from "./Filters";
import { LoadingButton } from "@mui/lab";
import { getFilterParams } from "@src/helpers";
import { useDropdownMenu } from "@src/hooks";
// import AssignUserModal from "./Components/AssignUserModal";
import StagesModal from "./Components/StagesModal";
import moment from "moment";
import { fetchNotificationList } from "@src/store/notifications/notification.actions";
import { setSelectedData } from "@src/store/sidemenu/project_management/work_order/work_order.slice";

type SortOption = "asc" | "desc";

const Tenders = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [sortOption, setSortOption] = useState<SortOption>("asc");

	const {
		tenders: {
			tendersList,
			loading,
			pageParams,
			tenderCount,
			isFilterOpen,
			assign_to_modal,
			bid_stage_modal,
			selectedData,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectTenders(state));
	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Bid No",
			width: 100,
			sortable: true,
			field: "code",
		},
		{
			title: "Bid Name",
			width: 100,
		},
		{
			title: "Lead",
			width: 100,
		},
		{
			title: "Department Name",
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
			title: "Product Type",
			width: 100,
		},
		{
			title: "Bid Type",
			width: 100,
		},
		{
			title: "Status",
			width: 100,
		},
		// {
		// 	title: "Assigned To",
		// 	width: 100,
		// },
		{
			title: "Stages",
			width: 100,
		},
		{
			title: "Created On",
			width: 100,
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
		tender_no: React.JSX.Element,
		tender_name: string,
		lead: string,
		department_name: string,
		company: string,
		customer: string,
		product_type: string,
		tender_type: string,
		status: JSX.Element,
		// assign_to: React.JSX.Element,
		stages: React.JSX.Element,
		createdOn: string,
		actions: React.JSX.Element
	) {
		return {
			index,
			tender_no,
			tender_name,
			lead,
			department_name,
			company,
			customer,
			product_type,
			tender_type,
			status,
			// assign_to,
			stages,
			createdOn,
			actions,
		};
	}
	// const { anchorEl, open, handleClick, handleClose } = useDropdownMenu();

	const [anchorEls, setAnchorEls] = useState<{
		[key: string]: HTMLElement | null;
	}>({});

	const [rowData, setRowData] = useState<any>();

	const handleClick = (
		event: React.MouseEvent<HTMLElement>,
		rowId: string
	) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: event.currentTarget }));
	};

	const handleClose = (rowId: string) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: null }));
	};

	const hide = () => {
		dispatch(isAssignToModalOpen(false));
		dispatchTenderState("selectedData", {});
	};
	const dispatchTenderState = (key: string, value: unknown) => {
		dispatch(
			setTenderState({
				[key]: value,
			})
		);
	};
	const setAssignUserModal = (rowData: any) => {
		dispatchTenderState("selectedData", rowData);
		dispatch(isAssignToModalOpen(true));
	};

	const rows = tendersList.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const tender_no = (
			<Tooltip
				TransitionComponent={Zoom}
				title="Click to see tender details">
				<Link to={`/tenders/view/${row.id}/0`}>
					<Button
						color="success"
						variant="contained"
						sx={{
							minWidth: 200,
						}}>
						{row?.tender_no}
					</Button>
				</Link>
			</Tooltip>
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

		// const assign_to = row?.assign_to?.fullname ? (
		// 	<Typography>{row?.assign_to?.fullname}</Typography>
		// ) : (
		// 	<Typography color="error">Not Assigned</Typography>
		// );

		const stages = row?.tender_stage?.name ? (
			<Typography>{row?.tender_stage?.name}</Typography>
		) : (
			<Typography color="error">Not Staged</Typography>
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
						anchorEls[row?.id ? row.id : ""] ? "true" : undefined
					}>
					<LuMoreVertical size={16} />
				</IconButton>
				<Menu
					anchorEl={anchorEls[row?.id ? row.id : ""]}
					id="account-menu"
					open={Boolean(anchorEls[row?.id ? row.id : ""])}
					onClose={() => handleClose(row?.id ? row.id : "")}
					PaperProps={{
						elevation: 2,
						sx: {
							overflow: "visible",
							filter: "drop-shadow(0px 1px 2px rgba(185, 185, 185, 0.32))",
							mt: 1.5,
							"& .MuiAvatar-root": {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1,
								filter: "drop-shadow(0px 1px 2px rgba(185, 185, 185, 0.32))",
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
						"TenderManagement.change_tender"
					) !== -1 &&
						(row.authorized_status == 1 ||
							row.authorized_status == 3) && (
							<MenuItem
								onClick={() => {
									handleClose(row?.id ? row.id : "");
									navigate(`/tenders/${row.id}`);
								}}>
								<Stack
									direction={"row"}
									gap={1.5}
									alignItems={"center"}>
									<LuPenLine
										style={{
											cursor: "pointer",
											color: "#fc6f03",
										}}
									/>
									<Typography>Edit</Typography>
								</Stack>
							</MenuItem>
						)}

					{userAccessList?.indexOf(
						"TenderManagement.change_tender"
					) !== -1 && (
						<MenuItem
							onClick={() => {
								dispatchTenderState("selectedData", row);
								dispatchTenderState("bid_stage_modal", true);
								handleClose(row?.id ? row.id : "");
							}}>
							<Stack
								direction={"row"}
								gap={1.5}
								alignItems={"center"}>
								<LuBarChart2
									style={{
										cursor: "pointer",
										color: "#0377fc",
									}}
								/>
								<Typography>Update Bid Stage</Typography>
							</Stack>
						</MenuItem>
					)}
				</Menu>
			</>
		);

		return createData(
			index,
			tender_no,
			row?.name || "",
			row?.lead?.name || "",
			row?.department_name || "",
			row?.company?.name || "",
			row?.customer?.name || "",
			row?.product_type_name || "",
			row?.tender_type_name || "",
			status,
			// assign_to,
			stages,
			row?.created_on ? moment(row?.created_on).format("DD-MM-YYYY") : "",
			actions
		);
	});

	// const actions = (
	// 	<Box
	// 		sx={{
	// 			display: "flex",
	// 			gap: 1,
	// 		}}>
	// 		{row.status == 1 && (
	// 			<Stack direction="row" spacing={1}>
	// 				{userAccessList?.indexOf(
	// 					"TenderManagement.can_approve"
	// 				) !== -1 && (
	// 					<Tooltip
	// 						TransitionComponent={Zoom}
	// 						title="Approve Bid">
	// 						<LoadingButton
	// 							loading={approve_loading}
	// 							variant="outlined"
	// 							sx={{
	// 								gap: 1,
	// 							}}
	// 							onClick={() => {
	// 								const data = {
	// 									status: 2,
	// 								};
	// 								dispatch(
	// 									ApproveTender({
	// 										id: row.id ? row.id : "",
	// 										data,
	// 										params: pageParams,
	// 									})
	// 								);
	// 							}}>
	// 							<LuCheck
	// 								style={{
	// 									cursor: "pointer",
	// 									color: "#2ecc5d",
	// 									fontSize: 16,
	// 								}}
	// 							/>
	// 							{/* <Typography>Approve</Typography> */}
	// 						</LoadingButton>
	// 					</Tooltip>
	// 				)}
	// 				{userAccessList?.indexOf(
	// 					"TenderManagement.can_approve"
	// 				) !== -1 && (
	// 					<Tooltip
	// 						TransitionComponent={Zoom}
	// 						title="Reject Bid">
	// 						<LoadingButton
	// 							loading={reject_loading}
	// 							variant="outlined"
	// 							sx={{
	// 								gap: 1,
	// 							}}
	// 							onClick={() => {
	// 								const data = {
	// 									status: 3,
	// 								};
	// 								dispatch(
	// 									RejectTender({
	// 										id: row.id ? row.id : "",
	// 										data,
	// 										params: pageParams,
	// 									})
	// 								);
	// 							}}>
	// 							<LuX
	// 								style={{
	// 									cursor: "pointer",
	// 									color: "#cc382e",
	// 									fontSize: 16,
	// 								}}
	// 							/>
	// 							{/* <Typography>Reject</Typography> */}
	// 						</LoadingButton>
	// 					</Tooltip>
	// 				)}
	// 			</Stack>
	// 		)}

	// 		{userAccessList?.indexOf(
	// 			"TenderManagement.change_tenderitemmaster"
	// 		) !== -1 &&
	// 			row.status == 1 && (
	// 				<Tooltip TransitionComponent={Zoom} title="Edit Bid">
	// 					<Button
	// 						variant="outlined"
	// 						sx={{
	// 							gap: 1,
	// 						}}
	// 						startIcon={
	// 							<LuPencil
	// 								style={{
	// 									cursor: "pointer",
	// 									color: "#fc6f03",
	// 									fontSize: 16,
	// 								}}
	// 								onClick={() => {
	// 									navigate(`/tenders/${row.id}`);
	// 								}}
	// 							/>
	// 						}>
	// 						{/* <Typography>Edit</Typography> */}
	// 					</Button>
	// 				</Tooltip>
	// 			)}

	// 		{/* <Link to={`/tenders/view/${row.id}/0`}>
	// 			<LuEye style={{ cursor: "pointer", color: "#fc6f03" }} />
	// 		</Link> */}
	// 	</Box>
	// );

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getTenders({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getTenders({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getTenders({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	const handleSort = (field: any) => {
		if (sortOption === "asc") {
			setSortOption("desc");
			let sortfield = "-" + field;
			dispatch(
				getTenders({
					...pageParams,
					ordering: sortfield,
					page: 1,
				})
			);
		} else {
			setSortOption("asc");
			dispatch(
				getTenders({
					...pageParams,
					ordering: field,
					page: 1,
				})
			);
		}
	};

	const openModal = (value: boolean) => {
		dispatch(isModalOpen(value));
	};

	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	useEffect(() => {
		dispatch(
			getTenders({
				...pageParams,
			})
		);
		dispatch(
			fetchNotificationList({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
		dispatch(setSelectedData({}));
	}, []);

	const bidStagesModal = useMemo(() => {
		return (
			<StagesModal
				open={bid_stage_modal}
				hide={() => {
					dispatchTenderState("bid_stage_modal", false);
					dispatchTenderState("selectedData", {});
				}}
				selectedData={selectedData}
				params={pageParams}
			/>
		);
	}, [selectedData, bid_stage_modal]);

	return (
		<Box>
			{/* {assign_to_modal && (
				<AssignUserModal
					open={assign_to_modal}
					hide={hide}
					selectedData={selectedData}
					params={pageParams}
				/>
			)} */}
			{bidStagesModal}

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
					<PageBreadcrumb title="Bids" subName="Bid Management" />
					<TopComponent
						permissionPreFix="TenderManagement"
						permissionPostFix="tender"
						navigateLink={"/tenders/0"}
						showAddButton={true}
						addButtonName="Add Bid"
						handleSearch={handleSearch}
						showFilterButton={true}
						openFilter={handleFilter}
						openModal={openModal}
						filteredData={getFilterParams(pageParams)}
					/>
					<TableComponent
						count={tenderCount}
						columns={columns}
						rows={rows}
						loading={loading}
						page={pageParams.page}
						pageSize={pageParams.page_size}
						handleSort={handleSort}
						handleChangePage={handleChangePage}
						handleChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</Card>
				{/* <Card>
					<CardContent></CardContent>
				</Card> */}
			</Box>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
		</Box>
	);
};

export default Tenders;
