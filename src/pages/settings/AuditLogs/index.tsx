import {
	Box,
	Collapse,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from "@mui/material";
import {
	getUserActivityList,
	getUserAuditList,
} from "@src/store/settings/manageUsers/manage_users.action";
import { selectManageUsers } from "@src/store/settings/manageUsers/manage_users.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import moment from "moment";
import React, { ChangeEvent, useEffect } from "react";
import TopComponent from "../TopComponent";
import { useOutletContext } from "react-router-dom";
import LogTable from "./LogTable";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.grey[100],
		color: theme.palette.primary,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

function AuditLogs() {
	const dispatch = useAppDispatch();
	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();
	const {
		manageUser: {
			userAuditCount,
			userAuditList,
			userAuditParams,
			auditLoading,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			manageUser: selectManageUsers(state),
			system: systemSelector(state),
		};
	});

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getUserAuditList({
				...userAuditParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getUserAuditList({
				...userAuditParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getUserAuditList({
				...userAuditParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getUserAuditList({
				...userAuditParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getUserAuditList({
				...userAuditParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext.setTitle("Audit");
		outletContext.setSubtitle("Settings");
	}, []);
	return (
		<Box>
			<TopComponent
				permissionPreFix="System"
				permissionPostFix="user"
				navigateLink={"/pages/settings/manage-users/0"}
				showAddButton={false}
				showFilterButton={false}
				addButtonName="Add User"
				handleSearch={handleSearch}
				handleInputChange={handleInputChange}
			/>

			<LogTable data={userAuditList} pageParams={userAuditParams} />
			<TablePagination
				rowsPerPageOptions={[
					10,
					20,
					50,
					100,
					{ label: "All", value: -1 },
				]}
				component="div"
				count={userAuditCount}
				rowsPerPage={userAuditParams.page_size}
				page={userAuditParams.page - 1}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Box>
	);
}

export default AuditLogs;
