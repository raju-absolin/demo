import React, { ChangeEvent, Dispatch, Fragment, useEffect, useState } from "react";
("@mui/material/TablePagination/TablePaginationActions");
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { deleteAssignee, getAssignees } from "@src/store/settings/Permissions/Assignees/assignee.action";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import TableComponent from "@src/components/TableComponenet";
import { systemSelector } from "@src/store/system/system.slice";
import { Link, useOutletContext } from "react-router-dom";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import TopComponent from "../../TopComponent";
import { isModelVisible, setSelectedData, AssigneeSelector } from "@src/store/settings/Permissions/Assignees/assignee.slice";
import AddAssignee from "./add.assignee";
import { Box, Button, IconButton, Popover, Tooltip, Typography, Zoom } from "@mui/material";

const AssigneePermissions = () => {
    const dispatch = useAppDispatch();
    const outletContext = useOutletContext<{
        title: string;
        subtitle: string;
        setTitle: Function;
        setSubtitle: Function;
    }>();

    const {
        assignee: { loading, assigneeCount, assigneeList, pageParams, model },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            assignee: AssigneeSelector(state),
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
            title: "Username",
            width: 100,
        },
        {
            title: "User Type",
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
            deleteAssignee({
                id: deleteId,
                pageParams,
            })
        );
        handleDeleteClose();
    };
    function createData(
        index: number,
        code: string,
        screen_type_name: string,
        user: any,
        user_type: any,
        actions: React.JSX.Element
    ) {
        return { index, code, screen_type_name, user, user_type, actions };
    }

    const rows = assigneeList.map((row, key) => {
        const index =
            (pageParams.page - 1) * pageParams.page_size + (key + 1);

        const actions =
            (
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                    }}>
                    {userAccessList?.indexOf("Permissions.change_assignees") !== -1 && (
                        <Tooltip TransitionComponent={Zoom} title="Edit Assignee">
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
                    {userAccessList?.indexOf("Permissions.delete_assignees") !== -1 && (
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

        return createData(index, row?.code, row?.screen_type_name, row?.user?.username, row.user_type?.name, actions);
    });

    const handleSearch = ({ search }: { search?: string | undefined }) => {
        dispatch(
            getAssignees({
                search: search ? search : "",
                page: 1,
                page_size: 10,
            })
        );
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        dispatch(
            getAssignees({
                ...pageParams,
                search: "",
                page: newPage + 1,
            })
        );
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(
            getAssignees({
                ...pageParams,
                search: "",
                page: 1,
                page_size: parseInt(event.target.value),
            })
        );
    };
    useEffect(() => {
        dispatch(
            getAssignees({
                search: "",
                page: 1,
                page_size: 10,
            })
        );
        // outletContext.setTitle("Assignee");
        // outletContext.setSubtitle("Settings");
    }, []);

    const openModal = (value: boolean) => {
        dispatch(setSelectedData({}));
        dispatch(isModelVisible(value));
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const search = event.target.value;
        dispatch(
            getAssignees({
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
                permissionPostFix="assignee"
                navigateLink={""}
                showAddButton={true}
                addButtonName="Add Assignee"
                openModal={openModal}
                handleSearch={handleSearch}
                showFilterButton={false}
                filteredData={pageParams}
                handleInputChange={handleInputChange}
            />
            <TableComponent
                count={assigneeCount}
                columns={columns}
                rows={rows}
                loading={loading}
                page={pageParams.page}
                pageSize={pageParams.page_size}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />

            <AddAssignee modal={model} setModalOpen={openModal} />
        </>
    );
};

export default AssigneePermissions;
