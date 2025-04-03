import React, { ChangeEvent, useEffect } from "react";
("@mui/material/TablePagination/TablePaginationActions");
import { useAppDispatch } from "@src/store/store";
import * as yup from "yup";
import TableComponent from "@src/components/TableComponenet";
import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoggedUserSelector } from "@src/store/settings/currentLoggedUsers/current_logged_users.slice";
import { getLoggedInUsers } from "@src/store/settings/currentLoggedUsers/current_logged_users.action";
import TopComponent from "../TopComponent";
import { Box, Typography } from "@mui/material";

const ManageGroups = () => {
	const dispatch = useAppDispatch();
	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();

	const {
		loggedUsers: { list, pageParams, loading, count, selectedData },
		system: { userAccessList },
	} = useLoggedUserSelector();

	const columns = [
		{
			title: "S.No",
			// width: 100,
		},
		{
			title: "UserName",
			// width: 100,
		},
		{
			title: "Full Name",
			// width: 100,
		},
		{
			title: "Email",
			// width: 100,
		},
		{
			title: "Phone",
			// width: 100,
		},
		{
			title: "Group",
			width: 100,
		},
		// {
		// 	title: "Actions",
		// 	width: 100,
		// },
	];

	function createData(
		index: number,
		username: string,
		fullname: string,
		email: string,
		phone: string,
		group: string
		// actions: React.JSX.Element
	) {
		return {
			index,
			username,
			fullname,
			email,
			phone,
			group,
			// actions,
		};
	}

	const rows = list.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const group = row?.groups
			?.map((group: { name: string; id: string }) => {
				return group;
			})
			.join(", ");

		console.log(group);

		// const actions = (
		// 	<Box
		// 		sx={{
		// 			display: "flex",
		// 			gap: 2,
		// 		}}>
		// 		{userAccessList?.indexOf("auth.change_group") !== -1 && (
		// 			<Link to={`/pages/settings/manage-users/` + row.id}>
		// 				<LuPencil
		// 					style={{ cursor: "pointer", color: "#fc6f03" }}
		// 				/>
		// 			</Link>
		// 		)}

		// 		<Link to={`/pages/settings/manage-users/` + row.id + `/view`}>
		// 			<LuEye
		// 				style={{ cursor: "pointer", color: "#fc6f03" }}
		// 				onClick={() => {
		// 					dispatch(setSelectedData({}));
		// 					dispatch(getUserById({ id: row.id ? row.id : "" }));
		// 				}}
		// 			/>
		// 		</Link>
		// 	</Box>
		// );

		return createData(
			index,
			row.username || "",
			row.full_name || "",
			row.email || "",
			row.phone || "",
			group || ""
			// actions
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getLoggedInUsers({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getLoggedInUsers({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getLoggedInUsers({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getLoggedInUsers({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext.setTitle("Logged Users");
		outletContext.setSubtitle("Settings");
	}, []);

	const userSchema = yup.object().shape({
		newPassword: yup
			.string()
			.min(8, "Password must be at least 8 characters long")
			.required("New Password is required"),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref("newPassword"), ""], "Passwords must match")
			.required("Confirm Password is required"),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(userSchema), // Use yup resolver for validation
	});

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getLoggedInUsers({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	return (
		<>
			<TopComponent
				permissionPreFix="Users"
				permissionPostFix="current_logged_users"
				navigateLink={"/pages/settings/manage-users/0"}
				showAddButton={false}
				showFilterButton={false}
				addButtonName="Add User"
				handleSearch={handleSearch}
				handleInputChange={handleInputChange}>
				<Box
					sx={{
						display: "flex",
						gap: 2,
					}}>
					<Typography variant="h4"> Count</Typography>
					<Typography variant="subtitle1" color="primary">
						{count}
					</Typography>
				</Box>
			</TopComponent>
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
		</>
	);
};

export default ManageGroups;
