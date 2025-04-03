import react, { ChangeEvent, useEffect, useState } from "react";
import { Button, DialogContentText, Grid2 as Grid } from "@mui/material";
import {
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "@src/components";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
    setSelectedData,
    AssigneeSelector,
} from "@src/store/settings/Permissions/Assignees/assignee.slice";
import { postAssigneeData, editAssigneeDataById } from "@src/store/settings/Permissions/Assignees/assignee.action";
import { LuX } from "react-icons/lu";
import { LoadingButton } from "@mui/lab";
import { systemSelector } from "@src/store/system/system.slice";
import SelectComponent from "@src/components/form/SelectComponent";
import { clearMiniUserTypes, miniSelector, setMiniUserParams, clearMiniProjects, clearMiniTenders } from '@src/store/mini/mini.Slice';
import { getMiniUserTypes, getMiniUsers, getAssigneeProjectsMini, getMiniTenders } from '@src/store/mini/mini.Action';
import { Co2Sharp } from "@mui/icons-material";
import { getWorkOrderById } from "@src/store/sidemenu/project_management/work_order/work_order.action";
import { getTenderById } from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";

type Props = {
    modal: boolean;
    setModalOpen: (value: boolean) => void;
};

const AddAssignee = ({ modal, setModalOpen }: Props) => {
    const dispatch = useAppDispatch();

    const {
        assignee: { loading, assigneeCount, selectedData, assigneeList, pageParams, model },
        mini: {
            miniUserTypes, miniUserParams, miniUserList, miniUserLoading, miniProject, miniTenders
        },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            assignee: AssigneeSelector(state),
            system: systemSelector(state),
            mini: miniSelector(state)
        };
    });

    const SCREENTPYE_CHOICES = [
        { name: "Tender", id: 1 },
        { name: "Project", id: 2 }
    ]


    const assigneeSchema = yup.object().shape({
        screen_type: yup.object().shape({
            label: yup.string().required("Please select screen type"),
            value: yup.string().required("Please select screen type"),
        }),
        transaction_id: yup.object().shape({
            label: yup.string().required("Please select tansaction"),
            value: yup.string().required("Please select transaction"),
        }),
        user: yup.object().shape({
            label: yup.string().required("Please select user"),
            value: yup.string().required("Please select user"),
        }),
        user_type: yup.object().shape({
            label: yup.string().required("Please select user type"),
            value: yup.string().required("Please select user type"),
        }),
    });
    useEffect(() => {
        if (modal) {
            reset({
                screen_type: selectedData?.screen_type ? {
                    label: selectedData?.screen_type
                        ? `${selectedData?.screen_type.name}`
                        : "",
                    value: selectedData?.screen_type
                        ? `${selectedData?.screen_type.id}`
                        : "",
                } : null,
                transction_id: selectedData?.transaction_id ? {
                    // label: selectedData?.transaction_id
                    //     ? `${selectedData?.transaction_id}`
                    //     : "",
                    value: selectedData?.transaction_id
                        ? `${selectedData?.transaction_id}`
                        : "",
                } : null,
                user: selectedData?.user ? {
                    label: selectedData?.user
                        ? `${selectedData?.user?.username}`
                        : "",
                    value: selectedData?.user
                        ? `${selectedData?.user?.id}`
                        : "",
                } : null,
                user_type: selectedData?.user_type ? {
                    label: selectedData?.user_type
                        ? `${selectedData?.user_type?.name}`
                        : "",
                    value: selectedData?.user_type
                        ? `${selectedData?.user_type?.id}`
                        : "",
                } : null,
            });
        } else {
            reset();
        }
    }, [modal, selectedData]);

    useEffect(() => {
        if (selectedData?.id != undefined) {
            selectedData?.screen_type_name == "Project" ? (
                dispatch(getWorkOrderById({ id: selectedData?.transaction_id }))
                    .then((res: any) => {
                        setValue("transaction_id", { value: res.payload?.response?.id, label: res.payload?.response?.code });
                    })

            ) : (
                dispatch(getTenderById({ id: selectedData?.transaction_id }))
                    .then((res: any) => {
                        setValue("transaction_id", { value: res.payload?.response?.id, label: res.payload?.response?.code });
                    })
            )
        }
    }, [selectedData?.id, selectedData?.transaction_id]);

    const { control, handleSubmit, reset, getValues, setValue } = useForm<any>({
        resolver: yupResolver(assigneeSchema),
        values: {
            screen_type: selectedData?.screen_type ? {
                label: selectedData?.screen_type
                    ? `${selectedData?.screen_type_name}`
                    : "",
                value: selectedData?.screen_type
                    ? `${selectedData?.screen_type}`
                    : "",
            } : null,
            transction_id: selectedData?.transaction_id ? {
                // label: selectedData?.transaction_id
                //     ? `${selectedData?.transaction_id}`
                //     : "",
                value: selectedData?.transaction_id
                    ? `${selectedData?.transaction_id}`
                    : "",
            } : null,
            user: selectedData?.user ? {
                label: selectedData?.user
                    ? `${selectedData?.user?.username}`
                    : "",
                value: selectedData?.user
                    ? `${selectedData?.user?.id}`
                    : "",
            } : null,
            user_type: selectedData?.user_type ? {
                label: selectedData?.user_type
                    ? `${selectedData?.user_type?.name}`
                    : "",
                value: selectedData?.user_type
                    ? `${selectedData?.user_type?.id}`
                    : "",
            } : null,
        },
    });

    const screenType = getValues('screen_type');

    const onSubmit = (data: any) => {
        if (!selectedData?.id) {
            const obj = {
                "screen_type": data.screen_type?.value,
                "transaction_id": data.transaction_id?.value,
                "user_id": data?.user?.value,
                "user_type_id": data?.user_type?.value
            };
            const payload = {
                obj,
                pageParams,
            };
            dispatch(postAssigneeData(payload));
        } else {
            const obj = {
                id: selectedData?.id ? selectedData?.id : "",
                "screen_type": data.screen_type?.value,
                "transaction_id": data.transaction_id?.value,
                "user_id": data?.user?.value,
                "user_type_id": data?.user_type?.value
            };

            const payload = {
                obj,
                pageParams
            };

            dispatch(editAssigneeDataById(payload));
        }
    };
    return (
        <>
            <Dialog
                // open={modal}
                // onClose={() => setModalOpen(false)}
                // aria-labelledby="alert-dialog-title"
                // aria-describedby="alert-dialog-description"
                open={modal}
                onClose={() => setModalOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        width: "900px", // Set a custom width
                        maxWidth: "none", // Disable default maxWidth
                    },
                }}
            >
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
                    {!selectedData?.id ? "Add " : "Update "}
                    Assignee
                    <IconButton onClick={() => setModalOpen(false)}>
                        <LuX color="white" />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
                    <DialogContentText>
                        <form
                            style={{ width: "100%" }}
                            onSubmit={handleSubmit(onSubmit)}>
                            {/* <FormInput
								name="name"
								label="Name"
								type="text"
								placeholder="Enter Assignee here..."
								control={control}
							/> */}
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <SelectComponent
                                        name="screen_type"
                                        label="Screen Type"
                                        control={control}
                                        rules={{ required: true }}
                                        options={SCREENTPYE_CHOICES?.map((e: { id: number, name: string }) => ({
                                            id: e.id,
                                            name: e.name,
                                        }))}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    {screenType?.value == 1 ?
                                        <SelectComponent
                                            name="transaction_id"
                                            label="Transaction"
                                            control={control}
                                            rules={{ required: true }}
                                            options={miniTenders?.list?.map((e: { id: number, code: string }) => ({
                                                id: e.id,
                                                name: e.code,
                                            }))}
                                            loading={miniTenders?.loading}
                                            selectParams={{
                                                page: miniTenders?.miniParams.page,
                                                page_size: miniTenders?.miniParams.page_size,
                                                search: miniTenders?.miniParams.search,
                                                no_of_pages: miniTenders?.miniParams.no_of_pages,
                                            }}
                                            fetchapi={getMiniTenders}
                                        />
                                        :
                                        <SelectComponent
                                            name="transaction_id"
                                            label="Transaction"
                                            control={control}
                                            rules={{ required: true }}
                                            options={miniProject?.list?.map((e: { id: number, name: string }) => ({
                                                id: e.id,
                                                name: e.name,
                                            }))}
                                            loading={miniProject?.loading}
                                            selectParams={{
                                                page: miniProject?.miniParams.page,
                                                page_size: miniProject?.miniParams.page_size,
                                                search: miniProject?.miniParams.search,
                                                no_of_pages: miniProject?.miniParams.no_of_pages,
                                            }}
                                            fetchapi={getAssigneeProjectsMini}
                                        />
                                    }
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: 2 }}>
                                    <SelectComponent
                                        name="user"
                                        label="User"
                                        control={control}
                                        rules={{ required: true }}
                                        options={miniUserList?.map((e: { id: number, username: string }) => ({
                                            id: e.id,
                                            name: e.username,
                                        }))}
                                        loading={miniUserLoading}
                                        selectParams={{
                                            page: miniUserParams.page,
                                            page_size: miniUserParams.page_size,
                                            search: miniUserParams.search,
                                            no_of_pages: miniUserParams.no_of_pages,
                                        }}
                                        fetchapi={getMiniUsers}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} sx={{ mt: 2 }}>
                                    <SelectComponent
                                        name="user_type"
                                        label="User Type"
                                        control={control}
                                        rules={{ required: true }}
                                        options={miniUserTypes.list?.map((e: { id: number, name: string }) => ({
                                            id: e.id,
                                            name: e.name,
                                        }))}
                                        loading={miniUserTypes.loading}
                                        selectParams={{
                                            page: miniUserTypes.miniParams.page,
                                            page_size: miniUserTypes.miniParams.page_size,
                                            search: miniUserTypes.miniParams.search,
                                            no_of_pages: miniUserTypes.miniParams.no_of_pages,
                                        }}
                                        fetchapi={getMiniUserTypes}
                                    />
                                </Grid>
                            </Grid>
                            <DialogActions sx={{ p: 2 }}>
                                <Button
                                    onClick={() => setModalOpen(false)}
                                    variant="outlined"
                                    color="secondary">
                                    Cancel
                                </Button>
                                {!selectedData?.id ? (
                                    <LoadingButton
                                        variant="contained"
                                        type="submit"
                                        color="primary"
                                        loading={loading}
                                        autoFocus>
                                        Submit
                                    </LoadingButton>
                                ) : (
                                    <LoadingButton
                                        variant="contained"
                                        type="submit"
                                        color="primary"
                                        loading={loading}
                                        autoFocus>
                                        Update
                                    </LoadingButton>
                                )}
                            </DialogActions>
                        </form>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default AddAssignee;
