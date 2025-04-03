import React, { useState } from "react";
import { Modal, Box, Typography, Button, Grid2 as Grid } from "@mui/material";
import Timeline from "../timeline";

interface ApprovedBy {
	id: string;
	username: string;
	fullname: string;
	email: string;
	first_name: string;
	last_name: string;
	phone: string;
}

interface ApprovalData {
	approved_amount: string;
	approved_level: number;
	approved_by: ApprovedBy;
	approved_status: number;
	approved_status_name: string;
	description: string;
	approved_on: string;
	created_on: string;
	created_by: any;
}

interface ApprovalTreeModalProps {
	data: ApprovalData[];
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApprovalTreeModal: React.FC<ApprovalTreeModalProps> = ({
	data,
	open,
	setOpen,
}) => {
	console.log(data);
	const handleClose = () => setOpen(false);

	return (
		<>
			<Modal open={open} onClose={handleClose}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 600,
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
					}}>
					{/* <Typography variant="h6" gutterBottom>
						Approval Timeline
					</Typography>
					<Grid container spacing={2}>
						<Grid
							size={{
								xs: 4,
							}}>
							<Timeline>
								{data.map((approval, index) => (
									<TimelineItem key={index}>
										<TimelineSeparator>
											<TimelineDot color="primary" />
											{index !== data.length - 1 && (
												<TimelineConnector />
											)}
										</TimelineSeparator>
										<TimelineContent>
											<Typography variant="subtitle2">
												Level {approval.approved_level}
											</Typography>
										</TimelineContent>
									</TimelineItem>
								))}
							</Timeline>
						</Grid>
						<Grid
							size={{
								xs: 8,
							}}>
							{data.map((approval, index) => (
								<Box key={index} sx={{ mb: 2 }}>
									<Typography variant="subtitle1">
										{approval.approved_status_name}
									</Typography>
									<Typography variant="body2">
										Approved by:{" "}
										{approval.approved_by.fullname}
									</Typography>
									<Typography variant="body2">
										Email: {approval.approved_by.email}
									</Typography>
									<Typography variant="body2">
										Phone: {approval.approved_by.phone}
									</Typography>
									<Typography variant="body2">
										Approved on:{" "}
										{new Date(
											approval.approved_on
										).toLocaleString()}
									</Typography>
								</Box>
							))}
						</Grid>
					</Grid> */}
					<Timeline approvalData={data} />
					<Button
						variant="contained"
						color="secondary"
						onClick={handleClose}
						sx={{ mt: 2 }}>
						Close
					</Button>
				</Box>
			</Modal>
		</>
	);
};

export default ApprovalTreeModal;
