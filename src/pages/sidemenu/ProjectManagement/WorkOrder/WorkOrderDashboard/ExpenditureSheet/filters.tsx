import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Box,
    Button,
    Divider,
    Drawer,
    FormLabel,
    Grid2 as Grid,
    Stack,
    Typography,
} from "@mui/material";
import { CustomDatepicker } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import { getExpenditureSheet } from "@src/store/sidemenu/project_management/ExpenditureSheet/expenditure_sheet.action";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniLocation, getMiniWarehouse, getPurchaseOrderMini, getMiniVendors, getMiniMaterialRequest } from "@src/store/mini/mini.Action";
import {
    clearMiniLocation,
    clearMiniWarehouse, clearMiniVendors, clearMiniPurchaseOrder,
    clearMiniMaterialRequest
} from "@src/store/mini/mini.Slice";
import { selectExpenditureSheet } from "@src/store/sidemenu/project_management/ExpenditureSheet/expenditure_sheet.slice";
import { useParams } from "react-router-dom";

type Props = {
    openFilter: boolean;
    handleFilter: (open: boolean) => void;
};

type FilterFormData = {
    end_date?: string;
    start_date?: string;
    mode_of_payment?: any;
    approved_status?: any;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const {
        expenditureSheet: { pageParams },
        system: { userAccessList },
    } = useAppSelector((state) => selectExpenditureSheet(state));

    //Form Submission
    const filterSchema = yup.object({
        end_date: yup.string().optional(),
        start_date: yup.string().optional(),
        mode_of_payment: yup.object().optional().nullable(),
        approved_status: yup.object().optional().nullable(),
    });

    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(filterSchema),
    });

    const clearFilters = () => {
        const formData = {
            end_date: "",
            start_date: "",
            mode_of_payment: null,
            approved_status: null
        };
        dispatch(
            getExpenditureSheet({
                ...pageParams,
                ...formData,
            })
        );
        reset(formData);
    };

    const approved_status = [
        {
            id: 1,
            name: "Pending",
        },
        {
            id: 2,
            name: "InProgress",
        },
        {
            id: 3,
            name: "Completed",
        },
        {
            id: 4,
            name: "Closed"
        }
    ];

    const MODEOFPAYMENT_CHOICES = [
        {
            id: 1,
            name: "Online",
        },
        {
            id: 2,
            name: "Cash",
        },
        {
            id: 3,
            name: "Other",
        },
    ]

    const handleFilterSubmit = handleSubmit((values) => {
        const formData: any = {
            end_date: values.end_date
                ? moment(values.end_date).add(1, "days").format("YYYY-MM-DD")
                : "",
            start_date: values.start_date
                ? moment(values.start_date).format("YYYY-MM-DD")
                : "",
            ...values,
        };

        dispatch(
            getExpenditureSheet({
                ...pageParams,
                page: 1,
                page_size: 10,
                ...formData,
            })
        );
        handleFilter(false);
    });

    useEffect(() => {
        reset({
            end_date: pageParams.end_date,
            start_date: pageParams.start_date,
            mode_of_payment: pageParams.mode_of_payment,
            approved_status: pageParams.approved_status
        });
    }, [pageParams]);

    const formData = getValues();

    return (
        <>
            <Drawer
                anchor={"right"}
                open={openFilter}
                onClose={() => handleFilter(false)}>
                <Box
                    sx={{
                        width: 450,
                        p: 2,
                    }}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            Expenditure Sheet Filters
                        </Typography>
                        <Divider
                            sx={{
                                mb: 1,
                            }}
                        />

                        <form onSubmit={handleFilterSubmit}>
                            <Box>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    justifyContent={"space-between"}
                                    useFlexGap={false}>
                                    <Stack width={"100%"}>
                                        <CustomDatepicker
                                            control={control}
                                            name="start_date"
                                            hideAddon
                                            dateFormat="DD-MM-YYYY"
                                            showTimeSelect={false}
                                            timeFormat="h:mm a"
                                            timeCaption="time"
                                            inputClass="form-input"
                                            label={"From Date"}
                                            tI={1}
                                        />
                                    </Stack>
                                    <Stack width={"100%"}>
                                        <CustomDatepicker
                                            control={control}
                                            name="end_date"
                                            hideAddon
                                            dateFormat="DD-MM-YYYY"
                                            showTimeSelect={false}
                                            timeFormat="h:mm a"
                                            timeCaption="time"
                                            inputClass="form-input"
                                            label={"To Date"}
                                            tI={1}
                                        />
                                    </Stack>
                                </Stack>
                                <Grid container spacing={1} mt={1}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <SelectComponent
                                            name="mode_of_payment"
                                            label="Mode Of Payment"
                                            control={control}
                                            rules={{ required: true }}
                                            options={MODEOFPAYMENT_CHOICES}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <SelectComponent
                                            name="approved_status"
                                            label="Status"
                                            control={control}
                                            rules={{ required: true }}
                                            options={approved_status}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box mt={2}>
                                <Divider />
                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    spacing={2}
                                    mt={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            handleFilter(false);
                                            clearFilters();
                                        }}
                                    // disabled={
                                    // 	Object.values(formData).find(
                                    // 		(e) => e
                                    // 	)
                                    // 		? false
                                    // 		: true
                                    // }
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                    // disabled={
                                    // 	Object.values(formData).find(
                                    // 		(e) => e
                                    // 	)
                                    // 		? false
                                    // 		: true
                                    // }
                                    >
                                        Apply
                                    </Button>
                                </Stack>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default Filters;
