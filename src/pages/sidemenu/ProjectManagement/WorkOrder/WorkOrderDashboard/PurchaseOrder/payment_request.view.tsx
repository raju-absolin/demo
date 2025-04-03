import { Description, ThumbDown, ThumbUp } from "@mui/icons-material";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Drawer as Drawer2,
    Grid2 as Grid,
    IconButton,
    Typography,
} from "@mui/material";
import GoBack from "@src/components/GoBack";
import ReadMore from "@src/components/ReadMoreText";
import TableComponent from "@src/components/TableComponenet";
import { selectPaymentRequests, setIsModalOpen, getPurchaseCheckApprove, setIsRejectModalOpen, purchasesCheckApproveSuccessful } from "@src/store/sidemenu/project_management/PaymentRequest/payment_request.slice";
import { getPaymentRequestById, PaymentRequestCheckApproval, PaymentRequestApproval } from "@src/store/sidemenu/project_management/PaymentRequest/payment_request.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import moment from "moment";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Timeline from "../timeline";
import InfoIcon from '@mui/icons-material/Info';
import { LuX } from "react-icons/lu";
import TextArea from "@src/components/form/TextArea";
import { LoadingButton } from "@mui/lab";
import { getApprovals } from "@src/store/settings/Permissions/Approvals/approval.action";
import { ApprovalSelector } from "@src/store/settings/Permissions/Approvals/approval.slice";


type Props = {
    openPRView: boolean;
    handlePRView: (open: boolean) => void;
    id: string | undefined;
};

const PaymentRequestView = ({ openPRView, handlePRView, id }: Props) => {
    const { projectId, tab, purchaseOrderId } = useParams();
    const [showDescription, setShowDescription] = useState(false);
    const [showRemarks, setShowRemarks] = useState(false);
    const dispatch = useAppDispatch();
    const {
        paymentRequest: { selectedData, pageParams, approve_loading, checkApprove, approved_level, approved_status, approved_status_name, approved_data, model, loading,
            rejectModel },
        system: { userAccessList },
    } = useAppSelector((state) => selectPaymentRequests(state));

    const {
        approval: { approvalList }
    } = useAppSelector((state) => {
        return {
            approval: ApprovalSelector(state),
        };
    });
    useEffect(() => {
        dispatch(
            getPaymentRequestById({
                id: id ? id : "",
            })
        );
        dispatch(PaymentRequestCheckApproval({ payment_request_id: id ? id : "" }))
    }, [id]);

    const renderData = [
        {
            label: "Code",
            value: selectedData?.code,
        },
        {
            label: "Vendor",
            value: selectedData?.vendor?.name,
        },
        {
            label: "Purchase Order Code",
            value: selectedData?.purchase_order?.code,
        },
        {
            label: "Price",
            value: selectedData?.base_price,
        },
        {
            label: "Percentage",
            value: selectedData?.percentage,
        },
        {
            label: "Percentage Amount",
            value: selectedData?.percentage_amount,
        },
        {
            label: "Created By",
            value: selectedData?.created_by?.fullname
        },
        {
            label: "Status",
            value: (
                <span>
                    {!selectedData?.approved_status ? (
                        "None"
                    ) : (
                        <Chip
                            sx={{
                                width: 100,
                            }}
                            label={
                                <Typography>
                                    {selectedData?.approved_status_name}
                                </Typography>
                            }
                            color={(() => {
                                let tagColor:
                                    | "default"
                                    | "primary"
                                    | "secondary"
                                    | "success"
                                    | "error"
                                    | "info"
                                    | "warning" = "default";
                                switch (selectedData?.approved_status) {
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
                                        tagColor = "error";
                                        break;
                                    default:
                                        tagColor = "default"; // Fallback color
                                }
                                return tagColor;
                            })()}
                        />
                    )}
                </span>
            ),
        },
        {
            label: "Description",
            value: (
                <>
                    <Button onClick={() => setShowDescription(true)}>
                        Click to see description
                    </Button>
                    {showDescription && (
                        <Dialog
                            open={showDescription}
                            onClose={() => setShowDescription(false)}
                            maxWidth="md"
                            fullWidth>
                            <DialogTitle>{"Description"}</DialogTitle>
                            <DialogContent>
                                <Typography>
                                    {selectedData?.description}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => setShowDescription(false)}>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </>
            ),
        },
        {
            label: "Remarks",
            value: (
                <>
                    <Button onClick={() => setShowRemarks(true)}>
                        Click to see remarks
                    </Button>
                    {showRemarks && (
                        <Dialog
                            open={showRemarks}
                            onClose={() => setShowRemarks(false)}
                            maxWidth="md"
                            fullWidth>
                            <DialogTitle>{"remarks"}</DialogTitle>
                            <DialogContent>
                                <Typography>
                                    {selectedData?.remarks}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => setShowRemarks(false)}>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </>
            ),
        },
    ];

    const handleClose = () => {
        dispatch(setIsModalOpen(false));
    };
    const showApproveModal = () => {
        dispatch(setIsModalOpen(true));
    }
    const closeModal = () => {
        dispatch(setIsRejectModalOpen(false));
    }
    function PaymentApprove() {
        var data = {
            payment_request_id: id,
            approved_level: approved_level + 1,
            approved_status: 3,
            description: selectedData?.description
        };
        dispatch(PaymentRequestApproval({ data }));
        dispatch(setIsModalOpen(false));
    }
    const rejectSchema = yup.object().shape({
        reject_description: yup
            .string()
            .required("Please enter your description")
            .trim(),
    });
    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(rejectSchema),
        values: {
            reject_description: selectedData?.reject_description ? selectedData?.reject_description : "",
        },
    });
    const onSubmit = (payload: any) => {
        const data = {
            payment_request_id: id,
            approved_level: approved_level + 1,
            approved_status: 3,
            description: payload?.reject_description
        }
        dispatch(PaymentRequestApproval({ data }));
        dispatch(setIsRejectModalOpen(false));
    };

    return (
        <>
            {/* <Drawer2
                anchor={"right"}
                open={openPRView}
                onClose={() => handlePRView(false)}>
                <Box
                    sx={{
                        width: 1000,
                        p: 2,
                    }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <Box
                                sx={{
                                    my: 2,
                                }}>
                                <Card>
                                    <CardContent>
                                        <Box
                                                p={4}
                                                sx={{
                                                    borderRadius: 2,
                                                }}>
                                        <Grid spacing={1}>
                                            {renderData.map((item) => {
                                                return (
                                                    <Grid size={{ xs: 12, md: 4 }} mt={2}>
                                                        <Typography variant="h6">
                                                            {item.label}:{" "}
                                                            {item?.value as any}
                                                        </Typography>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Card sx={{ mt: 2, p: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid mt={2} ml={4}>
                                        <Avatar
                                            sx={{ width: 50, height: 50, mt: 1 }}
                                            src=""
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 6 }} mt={2}>
                                        <Box>
                                            <Typography variant="body1">
                                                <strong>Name: </strong>
                                                {approved_data?.username || "None"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Email: </strong>
                                                {approved_data?.email || "None"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Mobile: </strong>
                                                {approved_data?.phone || "None"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                {checkApprove && (
                                    <Grid container spacing={2} sx={{ mt: 2, p: 1 }}>
                                        <Grid size={{ xs: 6 }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                fullWidth
                                                disabled={approved_status_name == "Completed"}
                                                startIcon={<ThumbUp />}
                                                onClick={showApproveModal}
                                            >
                                                Approve
                                            </Button>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                fullWidth
                                                startIcon={<ThumbDown />}
                                                onClick={() => dispatch(setIsRejectModalOpen(true))}
                                            >
                                                Reject
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}

                                <Box sx={{ mt: 2 }}>
                                    <Alert
                                        severity={
                                            approved_status_name === "Pending"
                                                ? "info"
                                                : approved_status_name === "Inprogress"
                                                    ? "info"
                                                    : approved_status_name === "Completed"
                                                        ? "success"
                                                        : approved_status_name === "Closed"
                                                            ? "success"
                                                            : "error"
                                        }
                                    >
                                        {approved_status_name}
                                    </Alert>
                                </Box>
                                {approved_level != 0 &&
                                    <Timeline approvalData={approved_data?.paymentrequestapprovals} />
                                }
                            </Card>
                        </Grid>
                        {model && <Dialog
                            open={model}
                            onClose={handleClose}
                            maxWidth="sm"
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogContent sx={{ px: "24px", pt: "12px !important", pb: 0, p: 3, paddingTop: 2 }}>
                                <DialogContentText
                                    id="alert-dialog-description"
                                    sx={{
                                        width: 500,
                                    }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            cursor: "pointer",
                                        }}>
                                        <IconButton aria-label="info">
                                            <InfoIcon color="primary" />
                                        </IconButton>
                                        Are you sure want to Approve?</Typography>
                                    <DialogActions sx={{ p: 2 }}>
                                        <Button onClick={handleClose} variant="outlined" color="secondary" style={{ cursor: "pointer" }}>
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            color="primary"
                                            onClick={PaymentApprove}
                                            autoFocus>
                                            Ok
                                        </Button>
                                    </DialogActions>
                                </DialogContentText>
                            </DialogContent>
                        </Dialog>}

                        {rejectModel &&
                            <Dialog
                                open={rejectModel}
                                onClose={closeModal}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description">
                                <DialogTitle
                                    sx={{
                                        bgcolor: "primary.main",
                                        color: "white",
                                        p: 1,
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                    variant="h4"
                                    id="alert-dialog-title">
                                    Payment Request Reject
                                    <IconButton onClick={closeModal}>
                                        <LuX color="white" />
                                    </IconButton>
                                </DialogTitle>
                                <DialogContent
                                    sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
                                    <DialogContentText
                                        id="alert-dialog-description"
                                        sx={{
                                            width: 500,
                                        }}>
                                        <form
                                            style={{ width: "100%" }}
                                            onSubmit={handleSubmit(onSubmit)}>
                                            <TextArea
                                                name="reject_description"
                                                label="Description"
                                                type="text"
                                                placeholder="Write Description here..."
                                                minRows={3}
                                                maxRows={5}
                                                containerSx={{
                                                    display: "grid",
                                                    gap: 1,
                                                }}
                                                control={control}
                                            />
                                            <DialogActions sx={{ p: 2 }}>
                                                <Button
                                                    onClick={closeModal}
                                                    variant="outlined"
                                                    color="secondary">
                                                    Cancel
                                                </Button>
                                                <LoadingButton
                                                    variant="contained"
                                                    type="submit"
                                                    color="primary"
                                                    loading={loading}
                                                    autoFocus>
                                                    Submit
                                                </LoadingButton>
                                            </DialogActions>
                                        </form>
                                    </DialogContentText>
                                </DialogContent>
                            </Dialog>
                        }
                    </Grid>
                </Box>
            </Drawer2> */}
            <Drawer2
                anchor="right"
                open={openPRView}
                onClose={() => handlePRView(false)}
            >
                <Box
                    sx={{
                        width: { xs: '100%', md: 1000 }, // Full width for small screens
                        p: 2,
                        position: 'relative', // Enables absolute positioning for the close button
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={() => handlePRView(false)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 10,
                            color: 'grey.700',
                        }}
                    >
                        <LuX size={24} />
                    </IconButton>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 6, md: 5 }} mt={4}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: 3,
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        sx={{ mb: 4, fontWeight: 'bold' }}
                                    >
                                        Payment Request View
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {renderData.map((item, index) => (
                                            <Grid size={{ xs: 12, md: 12, sm: 6 }} key={index}>
                                                <Typography variant="body1">
                                                    <strong>{item.label}:</strong> {item?.value}
                                                </Typography>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 7 }} mt={4}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    p: 2,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{ mb: 4, fontWeight: 'bold' }}
                                >
                                    Payment Request Approval
                                </Typography>
                                <Grid container spacing={2} alignItems="center" mt={2}>
                                    <Grid>
                                        <Avatar
                                            sx={{ width: 60, height: 60 }}
                                            src=""
                                        />
                                    </Grid>
                                    <Grid>
                                        <Typography variant="body1">
                                            <strong>Name: </strong>
                                            {selectedData?.created_by?.fullname ||
                                                "None"}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Email: </strong>
                                            {selectedData?.created_by?.email ||
                                                "None"}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Mobile: </strong>
                                            {selectedData?.created_by?.phone ||
                                                "None"}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {/* Action Buttons */}
                                {checkApprove && userAccessList?.indexOf("Payments.change_paymentrequestapproval") !== -1 && (
                                    <Grid container spacing={2} sx={{ mt: 3 }}>
                                        {approved_status_name !=
                                            "Approved" && (
                                                <>
                                                    <Grid size={{ xs: 6 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            fullWidth
                                                            disabled={
                                                                approved_status_name ==
                                                                "Approved" ||
                                                                approved_status_name ==
                                                                "Rejected"
                                                            }
                                                            startIcon={<ThumbUp />}
                                                            onClick={showApproveModal}
                                                        >
                                                            Approve
                                                        </Button>
                                                    </Grid>
                                                    <Grid size={{ xs: 6 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            fullWidth
                                                            disabled={
                                                                approved_status_name ==
                                                                "Rejected"
                                                            }
                                                            startIcon={<ThumbDown />}
                                                            onClick={() => dispatch(setIsRejectModalOpen(true))}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Grid>
                                                </>)}
                                    </Grid>
                                )}

                                {/* Status Alert */}
                                <Box sx={{ mt: 3 }}>
                                    <Alert
                                        severity={
                                            approved_status_name === 'Pending'
                                                ? 'info'
                                                : approved_status_name === 'Inprogress'
                                                    ? 'info'
                                                    : approved_status_name === 'Approved'
                                                        ? 'success'
                                                        : approved_status_name === 'Closed'
                                                            ? 'success'
                                                            : 'error'
                                        }
                                    >
                                        {approved_status_name == "Approved" ? approved_status_name : "Level " + approved_level + " " + approved_status_name}
                                    </Alert>
                                </Box>

                                {/* Timeline */}
                                {approved_level !== 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Timeline approvalData={approved_data?.paymentrequestapprovals} />
                                    </Box>
                                )}
                            </Card>
                        </Grid>

                        {/* Approve Dialog */}
                        {model && (
                            <Dialog
                                open={model}
                                onClose={handleClose}
                                maxWidth="sm"
                            >
                                <DialogContent sx={{ p: 3 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <InfoIcon color="primary" />
                                        Are you sure you want to Approve?
                                    </Typography>
                                    <DialogActions sx={{ mt: 2 }}>
                                        <Button
                                            onClick={handleClose}
                                            variant="outlined"
                                            color="secondary"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={PaymentApprove}
                                        >
                                            Ok
                                        </Button>
                                    </DialogActions>
                                </DialogContent>
                            </Dialog>
                        )}

                        {/* Reject Dialog */}
                        {rejectModel && (
                            <Dialog
                                open={rejectModel}
                                onClose={closeModal}
                            >
                                <DialogTitle
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    Payment Request Reject
                                    <IconButton onClick={closeModal}>
                                        <LuX color="white" />
                                    </IconButton>
                                </DialogTitle>
                                <DialogContent sx={{ p: 3 }}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <TextArea
                                            name="reject_description"
                                            label="Description"
                                            placeholder="Write Description here..."
                                            minRows={3}
                                            maxRows={5}
                                            containerSx={{ display: 'grid', gap: 2 }}
                                            control={control}
                                        />
                                        <DialogActions sx={{ mt: 2 }}>
                                            <Button
                                                onClick={closeModal}
                                                variant="outlined"
                                                color="secondary"
                                            >
                                                Cancel
                                            </Button>
                                            <LoadingButton
                                                variant="contained"
                                                color="primary"
                                                loading={loading}
                                            >
                                                Submit
                                            </LoadingButton>
                                        </DialogActions>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </Grid>
                </Box>
            </Drawer2>

        </>
    );
};

export default PaymentRequestView;
