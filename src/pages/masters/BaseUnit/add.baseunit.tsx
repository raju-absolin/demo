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
import { baseunitSelector, setMasterEditId, setMasterValue } from "@src/store/masters/BaseUnit/baseunit.slice"
import { addBaseunit, editBaseunit } from '@src/store/masters/BaseUnit/baseunit.action';
import { LuX } from 'react-icons/lu';
import { systemSelector } from '@src/store/system/system.slice';

type Props = {
    modal: boolean;
    closeModal: () => void;
    mastersName: string;
    editId?: any,
    mastersValue: string;
};

const AddBaseUnitMasters = ({ modal, closeModal, mastersName, editId, mastersValue }: Props) => {

    const dispatch = useAppDispatch();
    const {
        baseunit: { selectedData },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            system: systemSelector(state),
            baseunit: baseunitSelector(state)
        };
    });

    const masterSchema = yup.object({
        name: yup.string()
            .required("Please enter uom")
            .trim(),
    });

    const { control, handleSubmit,reset } = useForm({
        resolver: yupResolver(masterSchema),
        values: {
            name: selectedData?.name ? selectedData?.name : "",
        },
    });
    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setMasterValue(event.target.value));
    };

    useEffect(() => {
        if (modal) {
            reset({
                name: selectedData?.name || "",               
            });
        } else {
            reset(); 
        }
    }, [modal, selectedData]);

    const createMasters = (data: any) => {
        const obj = {
            name: data.name
        }
        const payload = {
            obj,
            pageParams: {},
            clearDataFn: () => { },
            navigate: (path: string) => { },
        };
        dispatch(addBaseunit(payload));
        closeModal();
        dispatch(setMasterValue(''));

    }

    const updateMasters = (data: any) => {
        const obj = {
            id: editId,
            name: data.name
        }
        const payload = {
            obj,
            pageParams: {},
            clearDataFn: () => { },
            navigate: (path: string) => { },
        };
        dispatch(editBaseunit(payload));
        closeModal();
    }
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
                        <form style={{ width: "100%" }}>
                            <FormInput
                                name="name"
                                label="Name"
                                required
                                type="text"
                                placeholder="Enter UOM here..."
                                control={control}
                            />
                        </form>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={closeModal} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                    {editId == undefined || editId == 0 ?
                        <Button
                            variant="contained"
                            onClick={handleSubmit(createMasters)}
                            type="submit"
                            color="primary"
                            autoFocus>
                            Submit
                        </Button>
                        :
                        <Button
                            variant="contained"
                            onClick={handleSubmit(updateMasters)}
                            type="submit"
                            color="primary"
                            autoFocus>
                            Update
                        </Button>
                    }
                </DialogActions>
            </Dialog>

        </>
    )
}
export default AddBaseUnitMasters;