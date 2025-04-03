import React from "react";
import { Box, Typography, Button } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

interface EmptyDataProps {
	message?: string; // Custom message to display
	actionLabel?: string; // Optional label for an action button
	onActionClick?: () => void; // Optional click handler for the action button
}

const EmptyData = ({
	message = "No data available.",
	actionLabel,
	onActionClick,
}: EmptyDataProps) => {
	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			textAlign="center"
			height="100%"
			p={3}>
			<InboxIcon style={{ fontSize: 64, color: "#9e9e9e" }} />
			<Typography variant="h6" color="textSecondary" gutterBottom>
				{message}
			</Typography>
			{actionLabel && onActionClick && (
				<Button
					variant="contained"
					color="primary"
					onClick={onActionClick}
					style={{ marginTop: 16 }}>
					{actionLabel}
				</Button>
			)}
		</Box>
	);
};

export default EmptyData;
