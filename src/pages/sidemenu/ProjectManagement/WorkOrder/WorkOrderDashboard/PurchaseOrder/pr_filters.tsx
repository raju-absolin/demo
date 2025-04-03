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
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniLocation, getMiniVendor, getPurchaseOrderMini, getMiniVendors, getMiniMaterialRequest } from "@src/store/mini/mini.Action";
import {
    clearMiniLocation,
    clearMiniVendors, clearMiniPurchaseOrder,
    clearMiniMaterialRequest
} from "@src/store/mini/mini.Slice";
import { selectStockIn } from "@src/store/sidemenu/project_management/StockTransferIn/stock_in.slice";
import { useParams } from "react-router-dom";
import { selectPaymentRequests } from "@src/store/sidemenu/project_management/PaymentRequest/payment_request.slice";
import { getPaymentRequests } from "@src/store/sidemenu/project_management/PaymentRequest/payment_request.action";

type Props = {
    openFilter: boolean;
    handleFilter: (open: boolean) => void;
};

type FilterFormData = {
    end_date?: string;
    start_date?: string;
    purchase_order?: string;
    vendor?: any;
    approved_status?: any;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const {
        paymentRequest: { pageParams },
        mini: {
            miniLocationList, miniMaterialRequest,
            miniLocationLoading,
            miniLocationParams,
            miniPurchaseOrder, miniVendors
        },
        system: { userAccessList },
    } = useAppSelector((state) => selectPaymentRequests(state));

    //Form Submission
    const filterSchema = yup.object({
        end_date: yup.string().optional(),
        start_date: yup.string().optional(),
        purchase_order: yup.object().optional().nullable(),
        vendor: yup.object().optional().nullable(),
        approved_status: yup.object().optional().nullable(),
    });

    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(filterSchema),
    });
    const approved_status = [
        {
            id: 1,
            name: "Pending",
        },
        {
            id: 2,
            name: "Inprogress",
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
    const clearFilters = () => {
        const formData = {
            end_date: "",
            start_date: "",
            purchase_order: null,
            vendor: null,
            approved_status: null,
        };
        dispatch(
            getPaymentRequests({
                ...pageParams,
                ...formData,
            })
        );
        reset(formData);
    };

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
            getPaymentRequests({
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
            purchase_order: pageParams.purchase_order,
            vendor: pageParams.vendor,
            approved_status: pageParams.approved_status,
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
                            Payment Request Filters
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
                                    {/* <Grid size={{ xs: 12, md: 6 }}>
                                        <SelectComponent
                                            name="purchase_order"
                                            label="Purchase Order"
                                            control={control}
                                            rules={{ required: true }}
                                            options={miniPurchaseOrder?.list?.map(
                                                (e: {
                                                    id: string;
                                                    code: string;
                                                }) => ({
                                                    id: e.id,
                                                    name: e.code,
                                                })
                                            )}
                                            loading={miniPurchaseOrder?.loading}
                                            selectParams={{
                                                page: miniPurchaseOrder?.miniParams
                                                    ?.page,
                                                page_size:
                                                    miniPurchaseOrder?.miniParams
                                                        ?.page_size,
                                                search: miniPurchaseOrder
                                                    ?.miniParams?.search,
                                                no_of_pages:
                                                    miniPurchaseOrder?.miniParams
                                                        ?.no_of_pages,
                                            }}
                                            hasMore={
                                                miniPurchaseOrder?.miniParams
                                                    ?.page <
                                                miniPurchaseOrder?.miniParams
                                                    ?.no_of_pages
                                            }
                                            fetchapi={getPurchaseOrderMini}
                                            clearData={clearMiniPurchaseOrder}
                                        />
                                    </Grid> */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <SelectComponent
                                            name="vendor"
                                            label="Vendor"
                                            control={control}
                                            rules={{ required: true }}
                                            options={miniVendors?.list?.map(
                                                (e: {
                                                    id: string;
                                                    name: string;
                                                }) => ({
                                                    id: e.id,
                                                    name: e.name,
                                                })
                                            )}
                                            loading={miniVendors?.loading}
                                            selectParams={{
                                                page: miniVendors?.miniParams
                                                    ?.page,
                                                page_size:
                                                    miniVendors?.miniParams
                                                        ?.page_size,
                                                search: miniVendors
                                                    ?.miniParams?.search,
                                                no_of_pages:
                                                    miniVendors?.miniParams
                                                        ?.no_of_pages,
                                            }}
                                            hasMore={
                                                miniVendors?.miniParams
                                                    ?.page <
                                                miniVendors?.miniParams
                                                    ?.no_of_pages
                                            }
                                            fetchapi={getMiniVendor}
                                            clearData={clearMiniVendors}
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
                                        }}>
                                        Clear
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type="submit">
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
