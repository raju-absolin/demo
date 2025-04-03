import react, { ChangeEvent, useEffect } from "react";
import { Button, DialogContentText } from "@mui/material";
import {
	IconButton,
	Typography,
	Grid2 as Grid,
	Box,
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
	expensesSelector,
	isModelVisible,
	selectExpenses,
	setMasterValue,
	setSelectedData,
} from "@src/store/masters/Expenses/expenses.slice";
import {
	addExpenses,
	editExpenses,
} from "@src/store/masters/Expenses/expenses.action";
import { LuX } from "react-icons/lu";
import Loader from "@src/components/Loader";

const AddExpensesMasters = () => {
	const dispatch = useAppDispatch();

	const {
		expenses: { selectedData, pageParams, loading, isModelVisible: modal },
	} = useAppSelector((state) => selectExpenses(state));

	const closeModal = () => {
		dispatch(setSelectedData({}));
		reset();
		dispatch(isModelVisible(false));
	};

	const edit_Id = selectedData?.id;

	const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setMasterValue(event.target.value));
	};

	const expensesSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter your expenses name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"Expenses name should not contain special characters"
			),
	});

	useEffect(() => {
		closeModal();
	}, []);

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(expensesSchema),
		values: {
			name: selectedData?.name ? selectedData?.name : "",
		},
	});
	const onSubmit = (data: any) => {
		if (!edit_Id) {
			const obj = {
				name: data.name,
			};
			const payload = {
				obj,
				pageParams: pageParams,
				clearDataFn: () => {
					closeModal();
				},
			};
			dispatch(addExpenses(payload));
		} else {
			const obj = {
				id: edit_Id,
				name: data.name,
			};
			const payload = {
				obj,
				pageParams: pageParams,
				clearDataFn: () => {
					closeModal();
				},
			};
			dispatch(editExpenses(payload));
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
					{!edit_Id ? "Add " : "Update "}
					{"Expenses"}
					<IconButton onClick={closeModal}>
						<LuX color="white" />
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
					{loading ? (
						<Box>
							<Loader />
							<Typography textAlign={"center"}>
								Loading...
							</Typography>
						</Box>
					) : (
						<DialogContentText
							id="alert-dialog-description"
							sx={{
								width: 500,
							}}>
							<form
								style={{ width: "100%" }}
								onSubmit={handleSubmit(onSubmit)}>
								<Grid container spacing={2}>
									<Grid size={{ xs: 24 }}>
										<FormInput
											required
											name="name"
											label="Name"
											type="text"
											placeholder="Enter Expenses here..."
											control={control}
										/>
									</Grid>
								</Grid>

								<DialogActions sx={{ p: 2 }}>
									<Button
										onClick={closeModal}
										variant="outlined"
										color="secondary">
										Cancel
									</Button>
									{!edit_Id ? (
										<Button
											variant="contained"
											type="submit"
											color="primary"
											autoFocus>
											Submit
										</Button>
									) : (
										<Button
											variant="contained"
											type="submit"
											color="primary"
											autoFocus>
											Update
										</Button>
									)}
								</DialogActions>
							</form>
						</DialogContentText>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};
export default AddExpensesMasters;
