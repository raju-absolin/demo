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
import { countrySelector, setMasterValue, setSelectedData } from "@src/store/masters/Country/country.slice"
import { addCountry, editCountry } from '@src/store/masters/Country/country.action';
import { systemSelector } from '@src/store/system/system.slice';
import { LuX } from 'react-icons/lu';

type Props = {
    modal: boolean;
    closeModal: () => void;
    mastersName: string;
    edit_Id?: any,
    mastersValue: string;
};

const AddCountryMasters = ({ modal, closeModal, mastersName, edit_Id, mastersValue }: Props) => {

    const dispatch = useAppDispatch();


    const {
        country: {
            selectedData
        },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            system: systemSelector(state),
            country: countrySelector(state)
        };
    });

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setMasterValue(event.target.value));
    };

    const countrySchema = yup.object().shape({
        name: yup.string().required("Please enter your country name")
            .trim()
            .matches(/^[a-zA-Z0-9 ]*$/, "country name should not contain special characters"),
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
        resolver: yupResolver(countrySchema),
        values: {
            name: selectedData?.name ? selectedData?.name : "",
        },
    });
    const onSubmit = (data: any) => {
        if (edit_Id == undefined || edit_Id == 0) {
            const obj = {
                "name": data.name,
            };
            const payload = {
                obj,
                pageParams: {},
                clearDataFn: () => { },
                navigate: (path: string) => { },
            };
            dispatch(addCountry(payload));
            closeModal();
            dispatch(setSelectedData({}));
            reset();
        } else {
            const obj = {
                id: edit_Id,
                name: data.name
            }
            const payload = {
                obj,
                pageParams: {},
                clearDataFn: () => { },
                navigate: (path: string) => { },
            };
            dispatch(editCountry(payload));
            closeModal();
            dispatch(setMasterValue(''));
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
                                type="text"
                                required
                                placeholder="Enter Country here..."
                                control={control}
                            />
                            <DialogActions sx={{ p: 2 }}>
                                <Button onClick={closeModal} variant="outlined" color="secondary">
                                    Cancel
                                </Button>
                                {edit_Id == undefined || edit_Id == 0 ?
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
export default AddCountryMasters;