import React, { ChangeEvent, useEffect, useState } from "react";
import {
    Grid2 as Grid,
    Divider,
    Card,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    Button,
    IconButton,
    styled, tableCellClasses, TableCell,
    Pagination,
    Tooltip,
    Popover,
    Paper,
    Box,
    TablePagination,
    CardContent,
} from "@mui/material";
import { RiErrorWarningLine } from "react-icons/ri";
import { DownloadOutlined } from "@mui/icons-material";
import moment from "moment";
import {
    setBackUpDataBaseParams,
    isPasswordModel,
    backupDatabaseSelector,
} from "@src/store/settings/BackupDatabase/backupDatabase.slice";
import {
    getBackUpDataBaseList,
    getDataBaseBackUP,
} from "@src/store/settings/BackupDatabase/backupDatabase.action";
import BackupPassword from "./backupPassword";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import GoBack from "@src/components/GoBack";
import TableComponent from "@src/components/TableComponenet";
import { LuArrowLeftCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.primary,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const BackUpDataBase = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const {
        backupDatabase: {
            backUpDataBaselist, backUpDataBaseParams, loading, listCount,
        }, system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            backupDatabase: backupDatabaseSelector(state),
            system: systemSelector(state),
        };
    });


    useEffect(() => {
        dispatch(
            getBackUpDataBaseList({
                page: 1,
                search: "",
                page_size: 10,
            })
        );
    }, []);

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
            title: "Created On",
            width: 100,
        },
        {
            title: "Database File",
            width: 100,
        },

    ];
    function createData(
        index: number,
        code: string,
        name: string,
        createdon: string,
        databasefile: React.JSX.Element
    ) {
        return {
            index,
            code,
            name,
            createdon,
            databasefile,
        };
    }

    const rows = backUpDataBaselist?.map((row, key) => {
        const index = (backUpDataBaseParams.page - 1) * backUpDataBaseParams.page_size + (key + 1);
        const actions = (
            <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<DownloadOutlined />}
                onClick={() => dispatch(isPasswordModel({ model: true, Id: row?.id }))}
                disabled={!userAccessList?.includes("System.export_backup")}
            >
                Download
            </Button>
        );

        return createData(
            index,
            row?.code,
            row?.name,
            moment(row?.createdon).format("DD-MM-YYYY, h:mm:ss a"),
            actions,
        );
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleDeleteClose = () => {
        setAnchorEl(null);
    };
    const handleChangePage = (event: unknown, newPage: number) => {
        dispatch(
            getBackUpDataBaseList({
                ...backUpDataBaseParams,
                search: "",
                page: newPage + 1,
            })
        );
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(
            getBackUpDataBaseList({
                ...backUpDataBaseParams,
                search: "",
                page: 1,
                page_size: parseInt(event.target.value),
            })
        );
    };
    return (
        <>

            <Box>
                <Card>
                    <CardContent
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            // mb: 2
                        }}>
                        <Typography
                            variant="h4"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                navigate("/pages/settings", {
                                    relative: "path",
                                });
                            }}>
                            <LuArrowLeftCircle />
                            Database Backup
                        </Typography>
                        {userAccessList?.indexOf("System.add_backup") !== -1 && (
                            <>
                                <Button
                                    aria-describedby={id}
                                    variant="contained"
                                    onClick={handleClick}
                                    color="primary"
                                    style={{ marginBottom: '15px' }}
                                    size="large">
                                    Create Database Backup
                                </Button>
                                <Popover
                                    id={id}
                                    open={open}
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
                                            Are you sure to Create Database Backup?
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            color="primary"
                                            onClick={() => {
                                                dispatch(getDataBaseBackUP())
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
                    </CardContent>
                    <Divider />
                </Card>
                <Grid size={{ xs: 12 }} sx={{mt:3}}>
                    <TableComponent
                        count={listCount}
                        columns={columns}
                        rows={rows}
                        loading={loading}
                        page={backUpDataBaseParams.page}
                        pageSize={backUpDataBaseParams.page_size}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Grid>
                <BackupPassword open={false} />
            </Box>          
        </>
    );
};

export default BackUpDataBase;
