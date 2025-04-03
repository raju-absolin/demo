import { LoadingButton } from "@mui/lab";
import {
	Alert,
	AlertTitle,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	styled,
	Typography,
} from "@mui/material";
import { LuX } from "react-icons/lu";

export type CustomModalProps = {
	isOpen: true | false;
	title: string;
	children: React.JSX.Element;
	onClose?: () => void;
	onOK?: () => void;
	okText?: string;
	closeText?: string;
	status?: "success" | "warning" | "error" | "info";
	loading?: boolean;
};

export const CustomModal = ({
	isOpen,
	title,
	children,
	onClose,
	onOK,
	okText,
	closeText,
	status,
	loading,
}: CustomModalProps) => {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
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
				{title}
				<IconButton onClick={onClose}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{children}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="secondary" variant="outlined">
					{closeText}
				</Button>
				<LoadingButton
					loading={loading}
					onClick={onOK}
					variant="contained">
					{okText}
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};
