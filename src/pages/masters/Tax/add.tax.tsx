import react, { ChangeEvent, useEffect, useState } from 'react';
import { Button, DialogContentText, OutlinedInput } from '@mui/material';
import { Control, Controller } from "react-hook-form";
import {
    Card, TextField, InputAdornment, AppBar, Toolbar, IconButton, Typography, Grid2 as Grid, Paper,
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
import { addTax, editTax } from '@src/store/masters/Tax/tax.action';
import { taxSelector, setMasterValue } from "@src/store/masters/Tax/tax.slice";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector, setCountryValue, setStateValue } from '@src/store/mini/mini.Slice';
import SelectComponent from '@src/components/form/SelectComponent';
import { getMiniCountries, getMiniStates } from '@src/store/mini/mini.Action';
import { setSelectedData } from '@src/store/settings/manageUsers/manage_users.slice';
import { LuX } from 'react-icons/lu';

type Props = {
    modal: boolean;
    closeModal: () => void;
    mastersName: string;
    edit_Id?: any,
    mastersValue?: string;
    updateData?: {
        id?: string | number | undefined;
        name?: string;
        tax?: string;
    };
};

const AddTaxMasters = ({ modal, closeModal, mastersName, edit_Id, mastersValue, updateData }: Props) => {

    const dispatch = useAppDispatch();
    const {
        tax: {
            selectedData
        },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            system: systemSelector(state),
            tax: taxSelector(state)
        };
    });

    const taxSchema = yup.object().shape({
        name: yup.string().required("Please enter your tax name")
            .trim()
            .matches(/^[a-zA-Z0-9 ]*$/, "tax name should not contain special characters"),
        tax: yup.string().required("Please enter your tax number"),
    });

    useEffect(() => {
        if (modal) {
            reset({
                name: selectedData?.name || "",               
                tax: selectedData?.tax || "",               
            });
        } else {
            reset(); 
        }
    }, [modal, selectedData]);
    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(taxSchema),
        values: {
            name: selectedData?.name ? selectedData?.name : "",
            tax: selectedData?.tax ? selectedData?.tax : "",
        },
    });

    const onSubmit = (data: any) => {
        if (edit_Id == undefined || edit_Id == 0) {
            const obj = {
                "name": data.name,
                "tax": data.tax,
            };
            const payload = {
                obj,
                pageParams: {},
                clearDataFn: () => { },
                navigate: (path: string) => { },
            };
            dispatch(addTax(payload));
            closeModal();
            dispatch(setSelectedData({}));
            reset();
        } else {
            const obj = {
                "id": edit_Id,
                "name": data.name,
                "tax": data.tax,
            };
            const payload = {
                obj,
                pageParams: {},
                clearDataFn: () => { },
                navigate: (path: string) => { },
            };
            dispatch(editTax(payload));
            closeModal();
            dispatch(setSelectedData({}));
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
                                placeholder="Enter Name here..."
                                control={control}
                            />
                            <Grid size={{ xs: 12, md: 4 }} mt={2}>
                            <Controller
                                        name="tax"
                                        control={control}
                                        defaultValue=""
                                        render={({ field, fieldState }) => (
                                            <>
                                                <InputLabel
                                                    htmlFor="tax"
                                                    style={{ fontWeight: "medium" }}
                                                    required
                                                    error={fieldState.error != null}>
                                                    Tax Number
                                                </InputLabel>
                                                <OutlinedInput
                                                    id="tax"
                                                    // {...other}
                                                    {...field}
                                                    type="text"
                                                    placeholder="Enter Tax Number"
                                                    sx={{ width: "100%", mt: 1 }}
                                                    error={fieldState.error != null}
                                                    inputProps={{
                                                        style: { padding: "10px 12px" },
                                                        onKeyDown: (e) => {
                                                            // Prevent non-numeric input
                                                            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                                                                e.preventDefault();
                                                            }
                                                        },
                                                    }}
                                                />
                                                {fieldState.error?.message && (
													<FormHelperText
														error={
															fieldState.error !=
															null
														}>
														Please enter tax
														number
													</FormHelperText>
												)}
                                            </>
                                        )}
                                    />

                            </Grid>
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
export default AddTaxMasters;