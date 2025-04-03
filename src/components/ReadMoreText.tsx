import React, { useState } from "react";
import {
	Typography,
	Link,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from "@mui/material";

interface ReadMoreProps {
	text: string;
	maxLength: number;
	readMoreText?: string;
	dialogTitle?: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({
	text,
	maxLength,
	readMoreText = "Read more",
	dialogTitle = "Full Text",
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleOpenDialog = () => {
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
	};

	if (text.length <= maxLength) {
		return <Typography>{text}</Typography>;
	}

	const displayText = text.slice(0, maxLength);

	return (
		<>
			<Typography>
				{displayText}
				{text.length > maxLength && "... "}
				<Link
					component="button"
					variant="body2"
					onClick={handleOpenDialog}
					sx={{ cursor: "pointer" }}>
					{readMoreText}
				</Link>
			</Typography>

			<Dialog
				open={isDialogOpen}
				onClose={handleCloseDialog}
				maxWidth="md"
				fullWidth>
				<DialogTitle>{dialogTitle}</DialogTitle>
				<DialogContent>
					<Typography>{text}</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Close</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ReadMore;
