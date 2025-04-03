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
	setMasterValue,
	setSelectedData,
	selectBatchs,
} from "@src/store/masters/Batch/batch.slice";
import { addBatchs, editBatchs } from "@src/store/masters/Batch/batch.action";
import { LuX } from "react-icons/lu";
import { LoadingButton } from "@mui/lab";

type Props = {
	modal: boolean;
	setModalOpen?: (value: boolean) => void;
    closeModal: () => void;
};

const AddBatchMasters = ({ modal, setModalOpen,closeModal }: Props) => {
	const dispatch = useAppDispatch();

	const {
		batch: { selectedData, pageParams, loading },
	} = useAppSelector((state) => selectBatchs(state));

	const batchsSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter your batch name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"batchs name should not contain special characters"
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
		resolver: yupResolver(batchsSchema),
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
				clearDataFn: () => {
					closeModal();
					dispatch(setSelectedData({}));
					reset();
				},
			};
			dispatch(addBatchs(payload));
		} else {
			const obj = {
				id: selectedData?.id ? selectedData?.id : "",
				name: data.name,
			};

			const payload = {
				obj,
				pageParams,
				clearDataFn: () => {
					closeModal();
					dispatch(setSelectedData({}));
					reset();
				},
			};

			dispatch(editBatchs(payload));
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
					{!selectedData?.id ? "Add " : "Update "}
					Batch
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
							<FormInput
								name="name"
								label="Name"
								required
								type="text"
								placeholder="Enter Batch here..."
								control={control}
							/>
							<DialogActions sx={{ p: 2 }}>
								<Button
									onClick={closeModal}
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
export default AddBatchMasters;
