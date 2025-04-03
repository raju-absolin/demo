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
import TextArea from "@src/components/form/TextArea";
import React from "react";
import { Control } from "react-hook-form";
import { LuX } from "react-icons/lu";

interface Props {
	modal: boolean;
	closeModal: (props: boolean) => void;
	dailouge_name: string;
	control: Control;
	handleSubmit: () => void;
}

const ApproveRejectModal = ({
	modal,
	closeModal,
	dailouge_name,
	control,
	handleSubmit,
}: Props) => {
	return (
		<>
			<Dialog
				open={modal}
				onClose={() => closeModal(false)}
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
					{dailouge_name}
					<IconButton onClick={() => closeModal(false)}>
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
						<form style={{ width: "100%" }} onSubmit={handleSubmit}>
							<Stack spacing={2}>
								<Box>
									<RadioGroup
										control={control}
										name="status"
										label="Status"
										row // Use the row prop to place radios horizontally
										options={[
											{ label: "Approve", value: 2 },
											{
												label: "Reject",
												value: 3,
											},
										]}
									/>
								</Box>
								<TextArea
									control={control}
									label={"Costing Remarks"}
									name={"costing_remarks"}
									maxRows={5}
									placeholder={
										"Enter costing remarks here..."
									}
									containerSx={{
										display: "grid",
										gap: 1,
									}}
								/>
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
						onClick={() => closeModal(false)}
						variant="outlined"
						color="secondary">
						Cancel
					</Button>

					<Button
						variant="contained"
						onClick={() => handleSubmit()}
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

export default ApproveRejectModal;
