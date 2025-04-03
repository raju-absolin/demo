import react, { ChangeEvent, useEffect, useState } from 'react';
import { Button, DialogContentText } from '@mui/material';
import {
    Card, TextField, InputAdornment, AppBar, Toolbar, IconButton, Typography, Grid, Paper,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ListItemText, Modal
} from '@mui/material';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    CheckboxInput,
    ComponentContainerCard,
    FormInput,
    PasswordInput,
} from "@src/components";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@src/store/store";
// import { addDepartments, getDepartments, editDepartments, getDepartmentsById } from "@src/store/masters/Department/department.action";
import { makeSelector, setMasterEditId, setMasterValue, setSelectedData } from "@src/store/masters/Make/make.slice"
import { addMake, editMake } from '@src/store/masters/Make/make.action';
import { LuX } from 'react-icons/lu';
import { systemSelector } from '@src/store/system/system.slice';

type Props = {
    modal: boolean;
    closeModal: () => void;
    mastersName: string;
    editId?:  number,
    mastersValue: string;
};

const AddMakeMasters = ({ modal, closeModal, mastersName, editId, mastersValue }: Props) => {
    const dispatch = useAppDispatch();
    const {
        make: {
            selectedData
        },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            system: systemSelector(state),
            make: makeSelector(state)
        };
    });

    const makeSchema = yup.object().shape({
        name: yup.string().required("Please enter your make name")
        .trim()
        .matches(/^[a-zA-Z0-9 ]*$/, "make name should not contain special characters"),
    });

    useEffect(() => {
        if (modal) {
            reset({
                name: selectedData?.name || "",               
            });
        } else {
            reset(); 
        }
    }, [modal, selectedData]);
    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(makeSchema),
        values: {
            name: selectedData?.name ? selectedData?.name : "",           
        },
    });

    const onSubmit = (data: any) => {
        if (editId == undefined || editId == 0) {
            const obj = {
                "name": data.name,
            };
            const payload = {
                obj,
                pageParams: {},
                clearDataFn: () => { },
                navigate: (path: string) => { },
            };
            dispatch(addMake(payload));
            closeModal();
            dispatch(setSelectedData({}));
            reset();
        } else {
            const obj = {
                "id": editId,
                "name": data.name,
            };
            const payload = {
                obj,
                pageParams: {}, 
                clearDataFn: () => { },
                navigate: (path: string) => {  },
            };
            dispatch(editMake(payload));
            dispatch(setSelectedData({}));
            closeModal();
            reset();
        }
    };

    return (
        <>
           <Dialog
                open={modal}
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
                    {(editId == undefined || editId == 0) ? "Add " : "Update "}
                    {mastersName}
                    <IconButton onClick={closeModal}>
                        <LuX color="white" />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{
                            width: 500,
                        }}>
                        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
                            <FormInput
                                name="name"
                                label="Name"
                                required
                                type="text"
                                placeholder="Enter Make Name here..."
                                control={control}
                            />
                            <DialogActions sx={{ p: 2 }}>
                                <Button onClick={closeModal} variant="outlined" color="secondary">
                                    Cancel
                                </Button>
                                {editId == undefined || editId == 0 ?
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        color="primary"
                                        autoFocus>
                                        Submit
                                    </Button>
                                    :
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        color="primary"
                                        autoFocus>
                                        Update
                                    </Button>
                                }
                            </DialogActions>
                        </form>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    )
}
export default AddMakeMasters;