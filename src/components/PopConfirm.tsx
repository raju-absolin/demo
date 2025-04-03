import React, { useState } from "react";
import { Popover, Button, Typography, Stack, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface PopConfirmProps {
	onConfirm: () => void;
	onCancel?: () => void;
	message: string;
	confirmButtonText?: string;
	cancelButtonText?: string;
	children: React.ReactNode;
}

const PopConfirm: React.FC<PopConfirmProps> = ({
	onConfirm,
	onCancel,
	message,
	confirmButtonText = "Yes",
	cancelButtonText = "No",
	children,
}) => {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleConfirm = () => {
		onConfirm();
		handleClose();
	};

	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		}
		handleClose();
	};

	const open = Boolean(anchorEl);
	const id = open ? "pop-confirm-popover" : undefined;

	return (
		<>
			<div onClick={handleClick}>{children}</div>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				PaperProps={{
					sx: {
						borderRadius: 1,
						boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
						padding: 2,
						overflow: "visible",
						filter: "drop-shadow(0px 1px 2px rgba(185, 185, 185, 0.32))",
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: "50%",
							width: 10,
							height: 10,
							bgcolor: "background.paper",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
					},
				}}>
				<Stack spacing={2}>
					<Typography variant="subtitle1" color="text.secondary">
						{message}
					</Typography>
					<Stack
						direction="row"
						justifyContent="flex-end"
						spacing={1}>
						<Button
							variant="outlined"
							color="secondary"
							onClick={handleCancel}
							sx={{ transition: "0.3s" }}>
							{cancelButtonText}
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={handleConfirm}
							sx={{
								backgroundColor: "primary.main",
								"&:hover": { backgroundColor: "primary.dark" },
								transition: "0.3s",
							}}>
							{confirmButtonText}
						</Button>
					</Stack>
				</Stack>
			</Popover>
		</>
	);
};

export default PopConfirm;
