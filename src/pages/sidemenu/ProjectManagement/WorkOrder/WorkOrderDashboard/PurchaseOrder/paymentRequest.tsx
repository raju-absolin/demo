import { TurnLeftRounded } from "@mui/icons-material";
import { Box, Button, Chip, Stack, Tooltip, Typography, Zoom } from "@mui/material";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import TopComponent from "@src/pages/settings/TopComponent";
import { getPaymentRequests } from "@src/store/sidemenu/project_management/PaymentRequest/payment_request.action";
import {
    selectPaymentRequests,
    setIsFilterOpen, setIsPRViewOpen
} from "@src/store/sidemenu/project_management/PaymentRequest/payment_request.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { LuEye, LuPencil, LuPlus } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import PRFilters from "./pr_filters";
import { getFilterParams } from "@src/helpers";
import PaymentRequestView from "./payment_request.view";
import { pdf } from "@react-pdf/renderer";
import moment from "moment";
import { PaymentRequestPrintContent } from "@src/pages/sidemenu/PrintPDF/poPaymentRequest";
import { companySelector } from "@src/store/masters/Company/company.slice";
import { getCompanyById } from "@src/store/masters/Company/company.action";

const PaymentRequest = ({ purchaseOrderId, purchaseData }: any) => {
    const { id, tab, projectId } = useParams();
    const dispatch = useAppDispatch();
    const [paymentRequestId, setPaymentRequestId] = useState<string | undefined>(undefined);
    const {
        paymentRequest: {
            paymentRequestList,
            pageParams,
            paymentRequestCount,
            isFilterOpen, loading, isPRViewOpen
        },
        workOrder: { selectedData },
        system: { userAccessList },
    } = useAppSelector((state) => selectPaymentRequests(state));

    const {
        company: { companyData }
    } = useAppSelector((state) => {
        return {
            company: companySelector(state),
        };
    });

    const columns = [
        {
            title: "S.No",
            width: 100,
        },
        {
            title: "Code",
            width: 100,
            sortable: true, field: "code"
        },
        {
            title: "Requested Date",
            width: 100,
        },
        {
            title: "Vendor",
            width: 100,
        },
        {
            title: "Purchase Order",
            width: 100,
        },
        {
            title: "Percentage",
            width: 100,
        },
        {
            title: "Percentage Amount",
            width: 100,
        },
        {
            title: "Due Date",
            width: 100,
        },
        {
            title: "Status",
            width: 100,
        },
        {
			title: "Created By",
			width: 100,
		},
        {
            title: "Action",
            width: 100,
        },
    ];
//sortable: true, field: "code"
    function createData(
        index: number,
        code?: JSX.Element,
        reqdate?: string,
        vendor?: string,
        purchase_order?: string,
        percentage?: string,
        percentageAmt?: string,
        dueDate?: string,
        status?: JSX.Element,
        created_by?:string,
        action?: JSX.Element
    ) {
        return {
            index,
            code,
            reqdate,
            vendor,
            purchase_order,
            percentage,
            percentageAmt,
            dueDate,
            status,
            created_by,
            action,
        };
    }

    const rows = useMemo(() => {
        return paymentRequestList?.map((row, key) => {
            const index =
                (pageParams.page - 1) * pageParams.page_size + (key + 1);

            const status = (
                <>
                    <span>
                        {!row.approved_status ? (
                            "None"
                        ) : (
                            <Chip
                                label={<Typography>{row?.approved_status_name}</Typography>}
                                color={(() => {
                                    let tagColor:
                                        | "default"
                                        | "primary"
                                        | "secondary"
                                        | "success"
                                        | "error"
                                        | "info"
                                        | "warning" = "default";
                                    switch (row.approved_status) {
                                        case 1:
                                            tagColor = "warning";
                                            break;
                                        case 2:
                                            tagColor = "info"; // MUI does not have 'blue', using 'info' instead
                                            break;
                                        case 3:
                                            tagColor = "success";
                                            break;
                                        case 4:
                                            tagColor = "success";
                                            break;
                                        default:
                                            tagColor = "default"; // Fallback color
                                    }
                                    return tagColor;
                                })()}
                            />
                        )}
                    </span>
                </>
            );
            const code = (
                <Tooltip
                    TransitionComponent={Zoom}
                    title="Click to view payment request details">
                    <Link
                        to="">
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => {
                                setPaymentRequestId(row?.id);
                                handlePRView(true)
                            }}
                            sx={{
                                width: 150,
                            }}>
                            {row?.code}
                        </Button>
                    </Link>
                </Tooltip>
            );

            const actions = (
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                    }}>
                    {userAccessList?.indexOf(
                        "Payments.change_paymentrequest"
                    ) !== -1 && (
                            <Tooltip
                                TransitionComponent={Zoom}
                                title="Edit Payment Request">
                                <Link
                                    to={`/work_order/view/${projectId}/${tab}/project/purchase_order/view/${purchaseOrderId}/payment_request/${row.id}`}>
                                    <LuPencil
                                        style={{
                                            cursor: "pointer",
                                            color: "#fc6f03",
                                        }}
                                    />
                                </Link>
                            </Tooltip>
                        )}
                </Box>
            );

            return createData(
                index,
                code,
                moment(row?.requested_date).format("DD-MM-YYYY"),
                row?.vendor?.name,
                row?.purchase_order?.code,
                row?.percentage,
                row?.percentage_amount,
                moment(row?.due_date).format("DD-MM-YYYY"),
                status,
                row?.created_by?.fullname,
                actions
            );
        });
    }, [paymentRequestList, createData]);

    const handleChangePage = (event: unknown, newPage: number) => {
        dispatch(
            getPaymentRequests({
                ...pageParams,
                project_id: projectId,
                po_id: purchaseOrderId,
                search: "",
                page: newPage + 1,
            })
        );
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(
            getPaymentRequests({
                ...pageParams,
                project_id: projectId,
                po_id: purchaseOrderId,
                search: "",
                page: 1,
                page_size: parseInt(event.target.value),
            })
        );
    };
    const handleSort = (field: any) => {
            dispatch(
                getPaymentRequests({
                    ...pageParams,
                    ordering: field,
                    page: 1,
                })
            );
        }
    const handleSearch = ({ search }: { search?: string | undefined }) => {
        dispatch(
            getPaymentRequests({
                ...pageParams,
                project_id: projectId,
                po_id: purchaseOrderId,
                search: search ? search : "",
                page: 1,
                page_size: 10,
            })
        );
    };

    const handleFilter = (open: boolean) => {
        dispatch(setIsFilterOpen(open));
    };
    const handlePRView = (open: boolean) => {
        dispatch(setIsPRViewOpen(open));
    };
    useEffect(() => {
        if (projectId) {
            dispatch(
                getPaymentRequests({
                    ...pageParams,
                    project_id: projectId,
                    po_id: purchaseOrderId,
                    search: "",
                    page: 1,
                    page_size: 10,
                })
            );
            setPaymentRequestId("")
        }
    }, [projectId]);
    const onHandlePrintPreview = async (companyData: any) => {
        const blob = await pdf(<PaymentRequestPrintContent paymentRequestData={paymentRequestList} companyData={companyData} />).toBlob();
        var blobURL = URL.createObjectURL(blob);

        var iframe = document.createElement('iframe'); //load content in an iframe to print later
        document.body.appendChild(iframe);

        iframe.style.display = 'none';
        iframe.src = blobURL;
        iframe.onload = function () {
            setTimeout(function () {
                iframe.focus();
                iframe.contentWindow?.print();
            }, 1);
        };
    }
    const onHandleDownload = async (companyData: any) => {
        const blob = await pdf(<PaymentRequestPrintContent paymentRequestData={paymentRequestList} companyData={companyData} />).toBlob();
        if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'PaymentRequest.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            console.error('Failed to generate PDF');
        }
    }
    return (
        <Box>
            <TopComponent
                permissionPreFix="Payments"
                permissionPostFix="paymentrequest"
                navigateLink={`/work_order/view/${projectId}/${tab}/project/purchase_order/view/${purchaseOrderId}/payment_request/0`}
                showAddButton={true}
                showFilterButton={true}
                openFilter={handleFilter}
                addButtonName="Add Payment Request"
                handleSearch={handleSearch}
                filteredData={getFilterParams(pageParams, ["project_id"])}
                children={userAccessList?.indexOf("System.all_data") !==
                    -1 && (
                        <><Box display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    if (!companyData || Object.keys(companyData).length === 0) {
                                        dispatch(getCompanyById({ id: paymentRequestList[0]?.project?.company })).then(async (res: any) => {
                                            onHandlePrintPreview(res.payload?.response);
                                        })
                                    } else {
                                        onHandlePrintPreview(companyData);
                                    }
                                }
                                }>
                                Print
                            </Button>
                        </Box>
                            <Box display="flex" justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => {
                                        if (!companyData || Object.keys(companyData).length === 0) {
                                            dispatch(getCompanyById({ id: paymentRequestList[0]?.project?.company })).then(async (res: any) => {
                                                onHandleDownload(res.payload?.response);
                                            })
                                        } else {
                                            onHandleDownload(companyData);
                                        }
                                    }
                                    }>
                                    Download PDF
                                </Button>
                            </Box>
                        </>
                    )}
            />
            <Stack justifyContent="end" spacing={2}>
                <TableComponent
                    count={paymentRequestCount}
                    columns={columns}
                    rows={rows ? rows : []}
                    loading={loading}
                    page={pageParams?.page ? pageParams?.page : 1}
                    pageSize={
                        pageParams?.page_size ? pageParams?.page_size : 10
                    }
                    handleSort={handleSort}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Stack>
            <PRFilters openFilter={isFilterOpen} handleFilter={handleFilter} />
            <PaymentRequestView openPRView={isPRViewOpen} handlePRView={handlePRView} id={paymentRequestId} />
        </Box>
    );
};

export default PaymentRequest;
