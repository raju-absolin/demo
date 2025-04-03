import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Grid2 as Grid, Popover, Typography } from "@mui/material";
import { getScheduleReports, startDeleteScheduleReportById } from "@src/store/settings/ScheduleReports/schedulereports.action";
import { schedlueReportsSelector } from "@src/store/settings/ScheduleReports/schedulereports.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import { LuArrowLeftCircle, LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import TableComponent from "@src/components/TableComponenet";
import moment from "moment";

const ScheduleReport = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const deleteOpen = Boolean(anchorEl);
    const [currentId, setCurrentId] = useState(null);

    const {
        scheduleReport: {
            scheduleReports, loading, listCount, pageParams
        }, system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            scheduleReport: schedlueReportsSelector(state),
            system: systemSelector(state),
        };
    });

    useEffect(() => {
        dispatch(
            getScheduleReports({
                ...pageParams,
                search: "",
                page: 1,
                page_size: 10,
            })
        );
    }, [])

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
            title: "Report Name",
            width: 100,
        },
        {
            title: "Email",
            width: 100,
        },
        {
            title: "Created By",
            width: 100,
        },
        {
            title: "Start Date",
            width: 100,
        },
        {
            title: "Time",
            width: 100,
        },
        {
            title: "Schedule Repeat",
            width: 100,
        },
        {
            title: "Customised Repeat Days",
            width: 100,
        },
        {
            title: "Created Date",
            width: 100,
        },
        {
            title: "File Format",
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
        dispatch(startDeleteScheduleReportById({
            id: deleteId
        }));
        dispatch(
            getScheduleReports({
                ...pageParams,
                search: "",
                page: 1,
                page_size: 10,
            })
        );
        handleDeleteClose();
    };
    function createData(
        index: number,
        code: string,
        reportname: string,
        email: string,
        createdby: string,
        startdate: string,
        time: string | null,
        schedulereport: string,
        customisedRepeatDays: string | null,
        createdDate: string,
        fileformat: string,
        actions: React.JSX.Element
    ) {
        return {
            index,
            code,
            reportname,
            email,
            createdby,
            startdate,
            time,
            schedulereport,
            customisedRepeatDays,
            createdDate,
            fileformat,
            actions,
        };
    }

    const rows = scheduleReports?.map((row, key) => {
        const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);
        const actions = (
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                }}>
                {userAccessList?.indexOf("Reports.delete_scheduledemail") !== -1 && (
                    <>
                        <LuTrash2
                            style={{ cursor: "pointer", color: "#fc6f03" }}
                            onClick={(e) => handleClick(e, row?.id)}
                        />
                        <Popover
                            id={currentId ? String(currentId) : undefined}
                            open={deleteOpen}
                            anchorEl={anchorEl}
                            onClose={handleDeleteClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <div style={{ padding: "15px" }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Are you sure to delete this Record?
                                </Typography>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                    onClick={() => {
                                        confirmDelete(currentId)
                                    }
                                    }
                                    autoFocus>
                                    Yes
                                </Button>
                                <Button variant="outlined" size="small" onClick={handleDeleteClose} style={{ marginLeft: "20px" }}>
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
            row?.code,
            row?.reportname,
            row?.email,
            row.created_by.username,
            row.startdate,
            row.time ? moment(row.time).format("hh:mm") : null,
            row.frequency_name,
            !row.repeatdays
                ? null
                : row.repeatdays > 1
                    ? `${row.repeatdays} days`
                    : `${row.repeatdays} day`,
            moment(row.createdon).format("YYYY-MM-DD"),
            row.fileformat_name,
            actions,
        );
    });

    const handleChangePage = (event: unknown, newPage: number) => {
        dispatch(
            getScheduleReports({
                ...pageParams,
                search: "",
                page: newPage + 1,
            })
        );
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(
            getScheduleReports({
                ...pageParams,
                search: "",
                page: 1,
                page_size: parseInt(event.target.value),
            })
        );
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            cursor: "pointer",
                            marginBottom: '20px'
                        }}
                        onClick={() => {
                            navigate("/pages/settings", {
                                relative: "path",
                            });
                        }}>
                        <LuArrowLeftCircle />
                        Schedule Reports
                    </Typography>
                    
                    <TableComponent
                        count={listCount}
                        columns={columns}
                        rows={rows}
                        loading={loading}
                        page={pageParams.page}
                        pageSize={pageParams.page_size}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Grid>

            </Grid>

        </>
    )
}

export default ScheduleReport;