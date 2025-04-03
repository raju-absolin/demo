import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Fade,
	FormControlLabel,
	Grow,
	IconButton,
	Slide,
	Stack,
	Zoom,
} from "@mui/material";
import { RadioGroup } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import TextArea from "@src/components/form/TextArea";
import { selectBatchs } from "@src/store/masters/Batch/batch.slice";
import {
	ChangeServiceRequestStatus,
	getServiceRequestById,
} from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.action";
import {
	setOpenStatusModal,
	useServiceRequestSelector,
} from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.slice";
import { ServiceRequestState } from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.types";
import { useAppDispatch } from "@src/store/store";
import React, { useEffect } from "react";
import { Control, useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { ValueContainer } from "react-select/dist/declarations/src/components/containers";
import * as yup from "yup";

interface Props {
	pageParams?: ServiceRequestState["pageParams"];
}

const StatusModal = ({ pageParams }: Props) => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		serviceRequest: { selectedData, status_modal_open: modal },
		system: { userAccessList },
	} = useServiceRequestSelector();

	const closeModal = () => {
		dispatch(setOpenStatusModal(false));
	};

	const StatusSchema = yup.object().shape({
		status: yup
			.object({
				// lable: yup.string().required("Status is Required"),
				// value: yup.string().required("Status is Required"),
			})
			.required("Status is Required"),
		remarks: yup.string().optional(),
	});

	const {
		control,
		handleSubmit,
		reset,
		//formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(StatusSchema),
	});

	useEffect(() => {
		reset({
			status: selectedData?.status
				? {
						label: selectedData?.status_name,
						value: selectedData?.status,
					}
				: null,
			remarks: selectedData?.remarks,
		});
	}, [selectedData]);

	const submit = handleSubmit((payload) => {
		const data = {
			status: payload.status.value,
			remarks: payload.remarks,
		};
		dispatch(
			ChangeServiceRequestStatus({
				id: selectedData?.id ? selectedData?.id : "",
				data,
				params: pageParams,
				closeModal,
			})
		);
	});

	const status_options = [
		{
			id: 1,
			name: "Pending",
		},
		{
			id: 2,
			name: "Approved",
		},
		{
			id: 3,
			name: "Completed",
		},
		{
			id: 4,
			name: "Reopen",
		},
		{
			id: 5,
			name: "Open",
		},
		{
			id: 6,
			name: "Closed",
		},
		{
			id: 7,
			name: "Rejected",
		},
	];

	return (
		<>
			<Dialog
				open={modal}
				onClose={() => closeModal()}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				TransitionComponent={Slide}
				PaperProps={{
					style: {
						position: "absolute",
						top: "20px",
						right: "center",
						margin: 0,
					},
				}}>
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
					Edit Status
					<IconButton onClick={() => closeModal()}>
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
						<form style={{ width: "100%" }}>
							<Stack spacing={2}>
								<Box>
									<SelectComponent
										required
										name="status"
										label="Status"
										control={control}
										rules={{ required: true }}
										options={status_options}
									/>
								</Box>
								<TextArea
									control={control}
									label={"Remarks"}
									name={"remarks"}
									maxRows={5}
									placeholder={"Enter remarks here..."}
									containerSx={{
										display: "grid",
										gap: 1,
									}}
								/>
							</Stack>
						</form>
					</DialogContentText>
				</DialogContent>
				<DialogActions sx={{ p: 2 }}>
					<Button
						onClick={() => closeModal()}
						variant="outlined"
						color="secondary">
						Cancel
					</Button>

					<Button
						variant="contained"
						onClick={() => submit()}
						type="submit"
						color="primary"
						autoFocus>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default StatusModal;
