import React, {
	ChangeEvent,
	Dispatch,
	Fragment,
	useEffect,
	useState,
} from "react";
("@mui/material/TablePagination/TablePaginationActions");
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	deleteDepartmentUser,
	getDepartmentUserById,
	getDepartmentUsers,
} from "@src/store/settings/Permissions/DepartmentUsers/department_users.action";
import * as yup from "yup";
import {
	setSelectedData,
	setIsModalOpen,
	useDepartmentUserSelector,
} from "@src/store/settings/Permissions/DepartmentUsers/department_users.slice";
import TableComponent from "@src/components/TableComponenet";
import { systemSelector } from "@src/store/system/system.slice";
import { Link, useOutletContext } from "react-router-dom";
import { LuEye, LuPencil, LuTrash, LuX } from "react-icons/lu";
import {
	Box,
	Button,
	IconButton,
	Popover,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import TopComponent from "../../TopComponent";
import AddDepartmentUser from "./Add.department_users";

const DepartmentUsers = () => {
	const dispatch = useAppDispatch();
	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();
	const [anchorEl, setAnchorEl] = useState(null);
	const deleteOpen = Boolean(anchorEl);
	const [currentId, setCurrentId] = useState(null);

	const {
		departmentUsers: {
			list,
			isModalOpen,
			pageParams,
			loading,
			count,
			selectedData,
		},
		system: { userAccessList },
	} = useDepartmentUserSelector();

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "UserName",
			width: 100,
		},
		{
			title: "Full Name",
			width: 100,
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
			title: "Hod",
			width: 30,
		},
		{
			title: "Actions",
			width: 100,
		},
	];

	function createData(
		index: number,
		username: string,
		fullname: string,
		department: string,
		location: string,
		is_hod: string,
		actions: React.JSX.Element
	) {
		return {
			index,
			username,
			fullname,
			department,
			location,
			is_hod,
			actions,
		};
	}

	const handleClick = (event: any, id: any) => {
		setCurrentId(id);
		setAnchorEl(event.currentTarget);
	};

	const handleDeleteClose = () => {
		setAnchorEl(null);
	};

	const confirmDelete = (deleteId: any) => {
		dispatch(
			deleteDepartmentUser({
				id: deleteId,
				clearDataFn: () => {
					handleDeleteClose();
				},
				params: pageParams,
			})
		);
	};

	const rows = list.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const actions = (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					gap: 2,
				}}>
				{userAccessList?.indexOf("Users.change_userdepartment") !==
					-1 && (
					<Tooltip TransitionComponent={Zoom} title="Edit Record">
						<IconButton
							size={"small"}
							onClick={() => {
								openModal(true, row);
							}}>
							<LuPencil
								style={{ cursor: "pointer", color: "#fc6f03" }}
							/>
						</IconButton>
					</Tooltip>
				)}
				{userAccessList?.indexOf("Users.delete_userdepartment") !==
					-1 && (
					<>
						<Tooltip
							TransitionComponent={Zoom}
							title="Delete Record">
							<IconButton
								size={"small"}
								onClick={(e) => handleClick(e, row?.id)}>
								<LuTrash
									style={{
										cursor: "pointer",
										color: "#fc6f03",
									}}
								/>
							</IconButton>
						</Tooltip>
						<Popover
							id={currentId ? String(currentId) : undefined}
							open={deleteOpen}
							anchorEl={anchorEl}
							onClose={handleDeleteClose}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							transformOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}>
							<div style={{ padding: "15px" }}>
								<Typography variant="subtitle1" gutterBottom>
									Are you sure to delete this Record?
								</Typography>
								<Button
									variant="contained"
									type="submit"
									color="primary"
									onClick={() => {
										confirmDelete(currentId);
									}}
									autoFocus>
									Yes
								</Button>
								<Button
									variant="outlined"
									size="small"
									onClick={handleDeleteClose}
									style={{ marginLeft: "20px" }}>
									No
								</Button>
							</div>
						</Popover>
					</>
				)}
			</Box>
		);

		return createData(
			index,
			row?.user?.username,
			row?.user?.fullname,
			row?.department?.name || "",
			row?.location?.name || "",
			row?.is_hod ? "Yes" : "No",
			actions
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getDepartmentUsers({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getDepartmentUsers({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getDepartmentUsers({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getDepartmentUsers({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext.setTitle("Department Users");
		outletContext.setSubtitle("Settings");
	}, []);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getDepartmentUsers({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const openModal = (isOpen: boolean, data: any = {}) => {
		dispatch(
			setIsModalOpen({
				isOpen,
				data,
			})
		);
	};

	return (
		<>
			<TopComponent
				permissionPreFix="Users"
				permissionPostFix="userdepartment"
				navigateLink={""}
				showAddButton={true}
				showFilterButton={false}
				addButtonName="Add User Department"
				openModal={openModal}
				handleSearch={handleSearch}
				handleInputChange={handleInputChange}
			/>
			<TableComponent
				count={count}
				columns={columns}
				rows={rows}
				loading={loading}
				page={pageParams.page}
				pageSize={pageParams.page_size}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>
			<AddDepartmentUser />
		</>
	);
};

export default DepartmentUsers;
