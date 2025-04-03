import React, { ChangeEvent, Dispatch, Fragment, useEffect, useState } from "react";
("@mui/material/TablePagination/TablePaginationActions");
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { deleteUserType, getUserTypes } from "@src/store/settings/Permissions/UserType/usertype.action";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import TableComponent from "@src/components/TableComponenet";
import { systemSelector } from "@src/store/system/system.slice";
import { Link, useOutletContext } from "react-router-dom";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import TopComponent from "../../TopComponent";
import { isModelVisible, setSelectedData, UserTypeSelector } from "@src/store/settings/Permissions/UserType/usertype.slice";
import AddUserType from "./add.usertype";
import { Box, Button, IconButton, Popover, Tooltip, Typography, Zoom } from "@mui/material";

const UserTypePermissions = () => {
    const dispatch = useAppDispatch();
    const outletContext = useOutletContext<{
        title: string;
        subtitle: string;
        setTitle: Function;
        setSubtitle: Function;
    }>();

    const {
        usertype: { loading, usersCount, userTypeList, pageParams, model },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            usertype: UserTypeSelector(state),
            system: systemSelector(state),
        };
    });

    const [anchorEl, setAnchorEl] = useState(null);
	const deleteOpen = Boolean(anchorEl);
	const [currentId, setCurrentId] = useState(null);

    const columns = [
        {
            title: "S.No",
            width: 100,
        },
        {
            title: "Code",
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
	const handleClick = (event: any, id: any) => {
		setCurrentId(id);
		setAnchorEl(event.currentTarget);
	};
	const handleDeleteClose = () => {
		setAnchorEl(null);
	};
	const confirmDelete = (deleteId: any) => {
		dispatch(
			deleteUserType({
				id: deleteId,
				pageParams,
			})
		);
        handleDeleteClose();
	};
    function createData(
        index: number,
        code: string,
        title: string,
        actions: React.JSX.Element
    ) {
        return { index, code, title, actions };
    }

    const rows = userTypeList.map((row, key) => {
        const index =
            (pageParams.page - 1) * pageParams.page_size + (key + 1);

        const actions =
            // userAccessList?.indexOf("Permissions.change_usertype") !== -1 ? (
            //     <LuPencil style={{ cursor: "pointer", color: "#fc6f03" }} />
            // ) : (
            //     <Fragment></Fragment>
            // );
            (
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                    }}>
                    {userAccessList?.indexOf("Permissions.change_usertype") !== -1 && (
                        <Tooltip TransitionComponent={Zoom} title="Edit User Type">
                            <IconButton
                                onClick={() => {
                                    dispatch(setSelectedData(row));
                                    dispatch(isModelVisible(true));
                                }}>
                                <LuPencil
                                    style={{
                                        cursor: "pointer",
                                        color: "#fc6f03",
                                        fontSize: 16,
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    )}
                    {userAccessList?.indexOf("Permissions.delete_usertype") !== -1 && (
                        <>
                            <Tooltip
                                TransitionComponent={Zoom}
                                title="Delete Stage">
                                <IconButton
                                    onClick={(e) => handleClick(e, row?.id)}>
                                    <LuTrash2
                                        style={{
                                            cursor: "pointer",
                                            color: "#fc6f03",
                                            fontSize: 16,
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

        return createData(index, row?.code, row?.name, actions);
    });

    const handleSearch = ({ search }: { search?: string | undefined }) => {
        dispatch(
            getUserTypes({
                search: search ? search : "",
                page: 1,
                page_size: 10,
            })
        );
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        dispatch(
            getUserTypes({
                ...pageParams,
                search: "",
                page: newPage + 1,
            })
        );
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(
            getUserTypes({
                ...pageParams,
                search: "",
                page: 1,
                page_size: parseInt(event.target.value),
            })
        );
    };
    useEffect(() => {
        dispatch(
            getUserTypes({
                search: "",
                page: 1,
                page_size: 10,
            })
        );
        // outletContext.setTitle("User Type");
        // outletContext.setSubtitle("Settings");
    }, []);

    const openModal = (value: boolean) => {
        dispatch(setSelectedData({}));
        dispatch(isModelVisible(value));
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getUserTypes({
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
                permissionPreFix="permissions"
                permissionPostFix="usertype"
                navigateLink={""}
                showAddButton={true}
                addButtonName="Add User Type"
                openModal={openModal}
                handleSearch={handleSearch}
                showFilterButton={false}
                filteredData={pageParams}
                handleInputChange={handleInputChange}
            />
            <TableComponent
                count={usersCount}
                columns={columns}
                rows={rows}
                loading={loading}
                page={pageParams.page}
                pageSize={pageParams.page_size}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />

            <AddUserType modal={model} setModalOpen={openModal} />
        </>
    );
};

export default UserTypePermissions;
