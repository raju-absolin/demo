import React, {
	ChangeEvent,
	Dispatch,
	Fragment,
	useEffect,
	useState,
} from "react";
("@mui/material/TablePagination/TablePaginationActions");
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { getProfileList } from "@src/store/settings/manageGroups/manage_groups.action";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import TableComponent from "@src/components/TableComponenet";
import { systemSelector } from "@src/store/system/system.slice";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { LuMoreHorizontal, LuPencil } from "react-icons/lu";
import TopComponent from "../TopComponent";
import {
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

const ManageGroups = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();
	const {
		manageGroups: { profileList, profileParams, loading, listCount },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			manageGroups: selectManageGroups(state),
			system: systemSelector(state),
		};
	});

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Name",
			width: 100,
		},
		{
			title: "Actions",
			width: 100,
		},
	];

	function createData(
		index: number,
		title: string,
		actions: React.JSX.Element
	) {
		return { index, title, actions };
	}

	const [anchorEls, setAnchorEls] = useState<{
		[key: string]: HTMLElement | null;
	}>({});

	const handleClick = (
		event: React.MouseEvent<HTMLElement>,
		rowId: string | number
	) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: event.currentTarget }));
	};

	const handleClose = (rowId: string | number) => {
		setAnchorEls((prev) => ({ ...prev, [rowId]: null }));
	};

	const rows = profileList.map((row, key) => {
		const index =
			(profileParams.page - 1) * profileParams.page_size + (key + 1);

		const actions = (
			<>
				<IconButton
					sx={{ px: "6px" }}
					tabIndex={key}
					onClick={(e) => handleClick(e, row.id ? `${row.id}` : "")}
					aria-controls={
						anchorEls[row?.id ? row.id : ""]
							? "account-menu"
							: undefined
					}
					aria-haspopup="true"
					aria-expanded={
						anchorEls[row?.id ? row.id : ""] ? "true" : undefined
					}>
					<LuMoreHorizontal size={16} />
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
					{userAccessList?.indexOf("auth.change_group") !== -1 && (
						<MenuItem
							onClick={() => {
								handleClose(row?.id ? row.id : "");
								navigate(
									`/pages/settings/manage-profile/` + row.id
								);
							}}>
							<Stack
								direction={"row"}
								alignItems={"center"}
								spacing={2}>
								<LuPencil
									style={{
										cursor: "pointer",
										color: "#fc6f03",
										fontSize: "10px",
									}}
								/>
								<Typography>Edit</Typography>
							</Stack>
						</MenuItem>
					)}
					<MenuItem
						onClick={() => {
							handleClose(row?.id ? row.id : "");
							navigate(
								`/pages/settings/datapermissions/` + row.id
							);
						}}>
						<Stack
							direction={"row"}
							alignItems={"center"}
							spacing={2}>
							<LuPencil
								style={{
									cursor: "pointer",
									color: "#fc6f03",
									fontSize: "10px",
								}}
							/>
							<Typography>Data Permissions</Typography>
						</Stack>
					</MenuItem>
				</Menu>
			</>
		);

		return createData(index, row.name, actions);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getProfileList({
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getProfileList({
				...profileParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getProfileList({
				...profileParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};
	useEffect(() => {
		dispatch(
			getProfileList({
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext.setTitle("Manage Groups");
		outletContext.setSubtitle("Settings");
	}, []);

	return (
		<>
			<TopComponent
				permissionPreFix="auth"
				permissionPostFix="group"
				navigateLink={"/pages/settings/manage-profile/0"}
				showAddButton={true}
				addButtonName="Add Group"
				handleSearch={handleSearch}
				showFilterButton={false}
				filteredData={profileParams}
			/>
			<TableComponent
				count={listCount}
				columns={columns}
				rows={rows}
				loading={loading}
				page={profileParams.page}
				pageSize={profileParams.page_size}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</>
	);
};

export default ManageGroups;
