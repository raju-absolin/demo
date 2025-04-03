import React, { useState } from "react";
import {
	Container,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Typography,
	Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import {
	AssigneUserInitialState,
	ScreenAssigneUser,
} from "@src/store/settings/AssignUsers/assignUsers.types";
import { useAppDispatch } from "@src/store/store";
import {
	deleteScreenAssigneUser,
	getScreenAssigneUsers,
} from "@src/store/settings/AssignUsers/assignUsers.action";
import ScrollableList from "../ScrollableList";
import { useAssigneUserSelector } from "@src/store/settings/AssignUsers/assignUsers.slice";

export const UsersList = () => {
	const dispatch = useAppDispatch();
	const {
		assigneUser: {
			formRowsParams,
			formRowsLoading,
			formRows,
			formRowsCount,
		},
	} = useAssigneUserSelector();

	// Handle user deletion
	const handleDelete = (id: string | number) => {
		dispatch(
			deleteScreenAssigneUser({
				id: id || "",
				pageParams: formRowsParams,
			})
		);
	};

	return (
		<Container maxWidth="sm">
			<Box my={4}>
				<Typography variant="h4" gutterBottom>
					Users List
				</Typography>

				{formRows.length === 0 ? (
					<Typography>No users available.</Typography>
				) : (
					<ScrollableList
						styles={{
							maxHeight: "550px",
							padding: 0,
							m: 0,
						}}
						list={formRows}
						loading={formRowsLoading}
						params={{
							...formRowsParams,
						}}
						fetchapi={getScreenAssigneUsers}
						keyExtractor={(item) => item?.id || ""} // Uses `id` as key
						renderItem={(row, index, selectedRow, handleSelect) => {
							console.log(selectedRow);
							return (
								<ListItem
									sx={{
										borderBottom: "1px solid #000",
										px: 0,
									}}
									key={row.id}
									secondaryAction={
										<IconButton
											edge="end"
											aria-label="delete"
											onClick={() =>
												handleDelete(row?.id || "")
											}>
											<DeleteIcon />
										</IconButton>
									}>
									<ListItemText
										primary={row?.user?.fullname || ""}
									/>
									<ListItemText
										primary={row?.description || ""}
									/>
								</ListItem>
							);
						}}
					/>
				)}
			</Box>
		</Container>
	);
};
