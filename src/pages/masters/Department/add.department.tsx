import react, { ChangeEvent, useEffect, useState } from "react";
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
import {
	CheckboxInput,
	ComponentContainerCard,
	FormInput,
	PasswordInput,
} from "@src/components";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@src/store/store";
// import { addDepartmentss, getDepartmentss, editDepartmentss, getDepartmentssById } from "@src/store/masters/Departments/department.action";
import {
	departmentSelector,
	isModelVisible,
	setMasterValue,
	setSelectedData,
	useDeparmentSelector,
} from "@src/store/masters/Department/department.slice";
import {
	addDepartments,
	editDepartments,
} from "@src/store/masters/Department/department.action";
import { systemSelector } from "@src/store/system/system.slice";
import { LuX } from "react-icons/lu";
import { PageParamsTypes } from "@src/common/common.types";
import Loader from "@src/components/Loader";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniLocation } from "@src/store/mini/mini.Action";
import { clearMiniLocation } from "@src/store/mini/mini.Slice";
import TextArea from "@src/components/form/TextArea";

const AddDepartmentsMasters = () => {
	const dispatch = useAppDispatch();

	const {
		departments: {
			selectedData,
			loading,
			isModelVisible: modal,
			pageParams,
		},
		mini: { miniLocationList, miniLocationLoading, miniLocationParams },
		system: { userAccessList },
	} = useDeparmentSelector();

	const closeModal = () => {
		dispatch(setSelectedData({}));
		reset();
		dispatch(isModelVisible(false));
	};

	const edit_Id = selectedData?.id;

	const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setMasterValue(event.target.value));
	};

	const departmentsSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter your department name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"department name should not contain special characters"
			),
		remarks: yup
			.string()
			.required("Please enter your  remarks")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"remarks should not contain special characters"
			),
		// location: yup
		// 	.object()
		// 	.shape({
		// 		label: yup.string().required("Please select location"),
		// 		value: yup.string().required("Please select location"),
		// 	})
		// 	.required("Please select location"),
	});

	useEffect(() => {
		closeModal();
	}, []);

	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(departmentsSchema),
		values: {
			name: selectedData?.name ? selectedData?.name : "",
			remarks: selectedData?.remarks ? selectedData?.remarks : "",
			// location: selectedData?.location
			// 	? {
			// 			label: selectedData?.location
			// 				? `${selectedData?.location.name}`
			// 				: "",
			// 			value: selectedData?.location
			// 				? `${selectedData?.location.id}`
			// 				: "",
			// 		}
			// 	: null,
		},
	});
	const onSubmit = (data: any) => {
		if (!edit_Id) {
			const obj = {
				name: data.name,
				remarks: data.remarks,
				// location_id: data.location.value,
			};
			const payload = {
				obj,
				pageParams: pageParams,
				clearDataFn: () => {
					closeModal();
				},
			};
			dispatch(addDepartments(payload));
		} else {
			const obj = {
				id: edit_Id,
				name: data.name,
				remarks: data.remarks,
				// location_id: data.location.value,
			};
			const payload = {
				obj,
				pageParams: pageParams,
				clearDataFn: () => {
					closeModal();
				},
			};
			dispatch(editDepartments(payload));
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
					{"Department"}
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
											placeholder="Enter Departments here..."
											control={control}
										/>
									</Grid>
									{/* <Grid size={{ xs: 24 }}>
										<SelectComponent
											required
											name="location"
											label="Location"
											control={control}
											rules={{ required: true }}
											options={miniLocationList?.map(
												(e: {
													id: string | number;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniLocationLoading}
											selectParams={{
												page: miniLocationParams.page,
												page_size:
													miniLocationParams.page_size,
												search: miniLocationParams.search,
												no_of_pages:
													miniLocationParams.no_of_pages,
											}}
											hasMore={
												miniLocationParams.page <
												miniLocationParams.no_of_pages
											}
											fetchapi={getMiniLocation}
											clearData={clearMiniLocation}
										/>
									</Grid> */}
									<Grid size={{ xs: 12 }}>
										<TextArea
											required
											name="remarks"
											label="Remarks"
											type="text"
											placeholder="Write remarks here..."
											minRows={3}
											maxRows={5}
											containerSx={{
												display: "grid",
												gap: 1,
											}}
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
export default AddDepartmentsMasters;
