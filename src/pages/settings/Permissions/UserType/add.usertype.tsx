import react, { ChangeEvent, useEffect, useState } from "react";
import { Button, DialogContentText } from "@mui/material";
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
    UserTypeSelector,	
} from "@src/store/settings/Permissions/UserType/usertype.slice";
import { postUserTypeData,editUserTypeDataById } from "@src/store/settings/Permissions/UserType/usertype.action";
import { LuX } from "react-icons/lu";
import { LoadingButton } from "@mui/lab";
import { systemSelector } from "@src/store/system/system.slice";

type Props = {
	modal: boolean;
	setModalOpen: (value: boolean) => void;
};

const AddUserType = ({ modal, setModalOpen }: Props) => {
	const dispatch = useAppDispatch();

    const {
        usertype: { loading, usersCount,selectedData, userTypeList, pageParams, model },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            usertype: UserTypeSelector(state),
            system: systemSelector(state),
        };
    });
	const userTypeSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter your usertype name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"usertype name should not contain special characters"
			),
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
		resolver: yupResolver(userTypeSchema),
		values: {
			name: selectedData?.name ? selectedData?.name : "",
		},
	});
	const onSubmit = (data: any) => {
		if (!selectedData?.id) {
			const obj = {
				name: data.name,
			};
			const payload = {
				obj,
                pageParams,
			};
			dispatch(postUserTypeData(payload));
		} else {
			const obj = {
				id: selectedData?.id ? selectedData?.id : "",
				name: data.name,
			};

			const payload = {
				obj,
                pageParams
			};

			dispatch(editUserTypeDataById(payload));
		}
	};
	return (
		<>
			<Dialog
				open={modal}
				onClose={() => setModalOpen(false)}
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
					{!selectedData?.id ? "Add " : "Update "}
					User Type
					<IconButton onClick={() => setModalOpen(false)}>
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
							<FormInput
								name="name"
								label="Name"
								type="text"
								placeholder="Enter User Type here..."
								control={control}
							/>
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
export default AddUserType;
