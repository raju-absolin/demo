import react, { ChangeEvent, useEffect, useState } from 'react';
import { Button, DialogContentText } from '@mui/material';
import { Control } from "react-hook-form";
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { addBidNature, editBidNature } from '@src/store/masters/BidNature/bidnature.action';
import { bidnatureSelector, setMasterValue, setSelectedData } from "@src/store/masters/BidNature/bidnature.slice";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector, setCountryValue, setStateValue } from '@src/store/mini/mini.Slice';
import SelectComponent from '@src/components/form/SelectComponent';
import { getMiniCountries, getMiniStates } from '@src/store/mini/mini.Action';
import { LuX } from 'react-icons/lu';

type Props = {
    modal: boolean;
    closeModal: () => void;
    mastersName: string;
    edit_Id?: any,
    mastersValue?: string;
};

const AddBidNatureMasters = ({ modal, closeModal, mastersName, edit_Id, mastersValue }: Props) => {

    const dispatch = useAppDispatch();
    const {
        bidnature: {
            selectedData
        },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            system: systemSelector(state),
            bidnature: bidnatureSelector(state)
        };
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

    const bidnatureSchema = yup.object().shape({
        name: yup.string()
            .required("Please enter source portal name")
            .trim()
            .matches(/^[a-zA-Z0-9 ]*$/, "source portal name should not contain special characters"),
    });


    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(bidnatureSchema),
        values: {
            name: selectedData?.name ? selectedData?.name : "",
        },
    });
    const onSubmit = (data: any) => {
        if (edit_Id == undefined || edit_Id == "") {
            const obj = {
                "name": data.name,
            };
            const payload = {
                obj,
                pageParams: {},
                clearDataFn: () => { },
                navigate: (path: string) => { },
            };
            dispatch(addBidNature(payload));
            closeModal();
            dispatch(setSelectedData({}));
            reset();
        } else {
            const obj = {
                "id": edit_Id,
                "name": data.name,
            };
            const payload = {
                obj,
                pageParams: {},
                clearDataFn: () => { },
                navigate: (path: string) => { },
            };
            dispatch(editBidNature(payload));
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
                    {(edit_Id == undefined || edit_Id == 0) ? "Add " : "Update "}
                    Source Portal
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
                                placeholder="Enter Source Portal here..."
                                control={control}
                            />
                            <DialogActions sx={{ p: 2 }}>
                                <Button onClick={closeModal} variant="outlined" color="secondary">
                                    Cancel
                                </Button>
                                {edit_Id == undefined || edit_Id == "" ?
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
            {/* <Dialog open={modal} onClose={closeModal} maxWidth="md"// Increase maxWidth
                fullWidth>
                <DialogTitle>
                    {(edit_Id == undefined || edit_Id == "") ? "Add " : "Update "}
                    {mastersName}

                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <FormInput
                            name="name"
                            label="BidNature"
                            type="text"
                            placeholder="Enter BidNature here..."
                            control={control}
                        />
                        <DialogActions>
                            <Button onClick={closeModal} color="primary">
                                Cancel
                            </Button>
                            {edit_Id == undefined || edit_Id == "" ?
                                <Button color="primary" type='submit' >
                                    Submit
                                </Button>
                                :
                                <Button color="primary" type='submit'
                                >
                                    Update
                                </Button>
                            }
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog> */}
        </>
    )
}
export default AddBidNatureMasters;