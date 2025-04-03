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
	setMasterValue,
	setSelectedData,
	selectWarehouses,
	useWarehouseSelector,
} from "@src/store/masters/Warehouse/warehouse.slice";
import {
	addWarehouses,
	editWarehouses,
} from "@src/store/masters/Warehouse/warehouse.action";
import { LuX } from "react-icons/lu";
import { LoadingButton } from "@mui/lab";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	clearMiniLocation,
	clearMiniProjects,
	miniSelector,
} from "@src/store/mini/mini.Slice";
import { getMiniLocation, getMiniProjects } from "@src/store/mini/mini.Action";
import TextArea from "@src/components/form/TextArea";

type Props = {
	modal: boolean;
	setModalOpen?: (value: boolean) => void;
	closeModal: () => void;
};

const AddWarehousesMasters = ({ modal, setModalOpen, closeModal }: Props) => {
	const dispatch = useAppDispatch();
	const {
		warehouse: { selectedData, pageParams, loading },
		mini: {
			miniLocationList,
			miniLocationLoading,
			miniLocationParams,
			miniProject,
		},
	} = useWarehouseSelector();

	useEffect(() => {
		reset();
	}, [modal]);

	const warehousesSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter warehouse")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"warehouses name should not contain special characters"
			),
		location: yup
			.object()
			.shape({
				label: yup.string().required("Please select location"),
				value: yup.string().required("Please select location"),
			})
			.required("Please select location"),
		remarks: yup.string().required("Please enter description").trim(),
		projects: yup.array().of(
			yup
				.object()
				.shape({
					label: yup.string().required("Please select projects"),
					value: yup.string().required("Please select projects"),
				})
				.required("Please select projects")
		),
	});

	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(warehousesSchema),
		values: {
			name: selectedData?.name ? selectedData?.name : "",
			remarks: selectedData?.remarks ? selectedData?.remarks : "",
			location: selectedData?.location
				? {
						label: selectedData.location
							? selectedData.location?.name
							: "",
						value: selectedData.location
							? `${selectedData.location.id}`
							: "",
					}
				: null,
			projects:
				selectedData?.projects?.map((e) => ({
					label: e?.name || "",
					value: `${e.id}` || "",
				})) || [],
		},
	});
	const onSubmit = (data: {
		name: string;
		remarks: string;
		location: {
			label: string;
			value: string;
		};
		projects: {
			label: string;
			value: string;
		}[];
	}) => {
		if (!selectedData?.id) {
			const obj = {
				name: data.name,
				remarks: data.remarks,
				location_id: data.location?.value,
				projects_ids: data?.projects?.map((e) => e.value),
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
			dispatch(addWarehouses(payload));
		} else {
			const obj = {
				id: selectedData?.id ? selectedData?.id : "",
				name: data.name,
				remarks: data.remarks,
				location_id: data.location?.value,
				projects_ids: data?.projects?.map((e) => e.value),
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

			dispatch(editWarehouses(payload));
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
					Warehouse
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
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, sm: 6 }}>
									<SelectComponent
										name="location"
										label="Location"
										control={control}
										required
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
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<FormInput
										name="name"
										label="Name"
										required
										type="text"
										placeholder="Enter Warehouses here..."
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12 }}>
									<TextArea
										name="remarks"
										required
										label="Description"
										type="text"
										placeholder="Write Description here..."
										minRows={4}
										containerSx={{
											display: "grid",
											gap: 1,
										}}
										control={control}
									/>
								</Grid>
								<Grid size={{ xs: 12 }}>
									<SelectComponent
										name="projects"
										label="Select Projects"
										multiple
										control={control}
										options={miniProject?.list?.map(
											(e: {
												id: string | number;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										loading={miniProject?.loading}
										selectParams={{
											page: miniProject?.miniParams?.page,
											page_size:
												miniProject?.miniParams
													?.page_size,
											search: miniProject?.miniParams
												?.search,
											no_of_pages:
												miniProject?.miniParams
													?.no_of_pages,
										}}
										hasMore={
											miniProject?.miniParams?.page <
											miniProject?.miniParams?.no_of_pages
										}
										fetchapi={getMiniProjects}
										clearData={clearMiniProjects}
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
export default AddWarehousesMasters;
