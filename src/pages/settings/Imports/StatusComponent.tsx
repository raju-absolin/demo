import React from "react";
import { TableContainer, Paper, Typography, Alert } from "@mui/material";

interface SuccessData {
	has_errors: boolean;
	success_message?: string;
}

interface SuccessFailureProps {
	data: SuccessData;
}

const SuccessFailureComponent: React.FC<SuccessFailureProps> = ({ data }) => {
	return (
		<TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
			{!data.has_errors ? (
				<Alert severity="success">
					<Typography variant="h6">Success</Typography>
					<Typography variant="body1">
						{data.success_message ||
							"Operation completed successfully."}
					</Typography>
				</Alert>
			) : (
				<Alert severity="error">
					<Typography variant="h6">Failure</Typography>
					<Typography variant="body1">
						An error occurred during the operation.
					</Typography>
				</Alert>
			)}
		</TableContainer>
	);
};

export default SuccessFailureComponent;
