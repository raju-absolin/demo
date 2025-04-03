import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Grid2 as Grid,
    Card,
    CircularProgress,
    Button,
    TextField,
    Switch,
    Typography,
    Tabs,
    Tab,
    ToggleButtonGroup,
    ToggleButton
} from "@mui/material";
import {
    setSyncParams,
    setSyncValue,
    InputChangeValue,
    synchronizationSelector,
} from "@src/store/settings/Synchronization/synchronization.slice";
import {
    startSync,
    getSyncList,
    syncSettingsAdd,
    getSyncSettings
} from "@src/store/settings/Synchronization/synchronization.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import FocusSynchronization from "./focusSynchronization";
import { LuArrowLeftCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Synchronization = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        synchronization: {
            loading, syncLoading, synCount, syncParams, syncList, syncValue, syncSettingsData
        },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            synchronization: synchronizationSelector(state),
            system: systemSelector(state),
        };
    });


    const syncData = [
        {
            id: 1,
            label: "Focus",
            name: "focus",
            requestUrl: "/thirdparty/focus_data_sync/",
            statusUrl: "/thirdparty/focus_data_sync/status/",
        },
        // {
        //     id: 2,
        //     label: "AMCU",
        //     name: "amcu",
        //     requestUrl: "/thirdparty/amcu_data_collection/",
        //     statusUrl: "/thirdparty/amcu_data_collection/status/",
        // },
    ];

    const handleFinish = () => {
        const data = syncData.find((item) => item.id === syncValue);
        if (data) {
            dispatch(startSync(data));
        }
    };

    useEffect(() => {
        dispatch(setSyncValue(syncData[0].id));
        dispatch(
            getSyncList({
                page: 1,
                page_size: 10,
                search: "",
                sync_from: syncData[0].id
            })
        );
        dispatch(getSyncSettings());
    }, [dispatch]);

    const handleSyncValueChange = (value: number) => {
        dispatch(setSyncValue(value));
        dispatch(
            getSyncList({
                page: 1,
                page_size: 10,
                search: "",
                sync_from: value
            })
        );
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    {/* <Typography variant="h4">Synchronization</Typography>
                     */}
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
                        Synchronization
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    {/* <Card sx={{ p: 2 }}>
                        {loading ? (
                            <CircularProgress size="large" />
                        ) : (
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <ToggleButtonGroup
                                        value={syncValue}
                                        exclusive
                                        onChange={(_, value) => handleSyncValueChange(value)}
                                    >
                                        {syncData.map((data) => (
                                            <ToggleButton key={data.id} value={data.id}>
                                                {data.label}
                                            </ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                </Grid>
                            </Grid>
                        )}
                    </Card> */}
                </Grid>
            </Grid>
            <Box mt={2}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <FocusSynchronization />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Synchronization;
