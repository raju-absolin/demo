import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, Grid2 as Grid, Stack, List, styled, Box, Typography, Avatar } from "@mui/material";
import { CustomDatepicker, FileType } from "@src/components";
import moment from "moment";
import { LuFile, LuX } from "react-icons/lu";
import { useEffect } from "react";
import { PerformanceBankGuaranteeState } from "@src/store/sidemenu/project_management/PerformanceBankGuarantee/PBG.types";
import { useAppSelector } from "@src/store/store";
import { selectPerformanceBankGuarantees } from "@src/store/sidemenu/project_management/PerformanceBankGuarantee/PBG.slice";

interface Props {
    open: boolean;
    hide: () => void;
    project_id: string;
    selectedData: any;
    params: PerformanceBankGuaranteeState["pageParams"];
}

const ScrollableList = styled(List)(({ theme }) => ({
    maxHeight: "200px",
    marginTop: "0px",
    overflowY: "auto",
    padding: "0 8px",
    "&::-webkit-scrollbar": {
        width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.primary.main,
        borderRadius: "8px",
    },
}));

const HorizontalFilePreview = ({ file }: { file: FileType }) => {

    let fileName = "";
    if (!file?.path) return "";

    const dotIndex = file?.path.lastIndexOf(".");
    const baseName =
        dotIndex > 0 ? file?.path?.substring(0, dotIndex) : file?.path;

    fileName =
        baseName.length > 15 ? baseName.substring(0, 15) + "..." : baseName;
    return (
        <Box
            id={file.name}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "6px",
                display: "flex",
            }}
            mt={1}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    p: "12px",
                    gap: "12px",
                    cursor: "pointer",
                    height: "100%",
                    width: "100%",
                }}
                onClick={(e) => {
                    window.open(file.preview);
                }}>
                {file.preview ? (
                    <Avatar
                        variant="rounded"
                        sx={{
                            height: "48px",
                            width: "48px",
                            bgcolor: "grey",
                            objectFit: "cover",
                        }}
                        alt={file.path}
                        src={file.preview}
                    />
                ) : (
                    <Typography
                        component={"span"}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "primary.main",
                            fontWeight: 600,
                            borderRadius: "6px",
                            height: "48px",
                            width: "48px",
                            bgcolor: "#3e60d51a",
                        }}>
                        <LuFile />
                    </Typography>
                )}
                <Box>
                    <Typography sx={{ fontWeight: 600, color: "grey.700" }}>
                        {fileName}
                    </Typography>
                    <Typography component={"p"} color={"grey.700"}>
                        {file.formattedSize}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

const ViewPBGModal = ({ open, hide, selectedData, project_id, params }: Props) => {
    const {
        performanceBankGuarantee: {
            attachments,
        },
        workOrder: { selectedData: projectData },
        system: { userAccessList },
    } = useAppSelector((state) => selectPerformanceBankGuarantees(state));

    return (
        <Dialog open={open} onClose={hide} fullWidth maxWidth="md" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                {"Performance Bank Guarantee Details"}
                <IconButton onClick={hide}>
                    <LuX color="white" />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: "24px", pt: "12px !important", pb: 3 }}>
                <DialogContentText id="alert-dialog-description">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack flex={1}><strong>Code</strong> {selectedData?.code}</Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack flex={1}><strong>Date of Issue</strong> {moment(selectedData?.issuedate).format("DD-MM-YYYY")}</Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack flex={1}><strong>Date of Expiry</strong> {moment(selectedData?.expirydate).format("DD-MM-YYYY")}</Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack flex={1}><strong>Date of Claim</strong> {moment(selectedData?.claimdate).format("DD-MM-YYYY")}</Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack flex={1}><strong>PBG Number</strong> {selectedData?.number}</Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack flex={1}><strong>PBG Value</strong> {selectedData?.value}</Stack>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Stack flex={1}><strong>Remarks:</strong> {selectedData?.remarks}</Stack>
                        </Grid>
                        {attachments && attachments?.length > 0 && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <strong>Documents:</strong>
                                <ScrollableList>
                                    {
                                        attachments?.map((document: any) => {
                                            if (!document?.dodelete)
                                                return (
                                                    document?.path && (
                                                        <HorizontalFilePreview
                                                            file={document}
                                                        />
                                                    )
                                                )
                                        })
                                    }
                                </ScrollableList>
                            </Grid>
                        )}
                    </Grid>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
};

export default ViewPBGModal;
