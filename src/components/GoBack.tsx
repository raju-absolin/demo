import {
	Box,
	Button,
	Card,
	CardContent,
	createTheme,
	Divider,
	Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { LuArrowLeftCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

type Params = {
	is_goback: boolean;
	title: string;
	children?: React.ReactNode;
	loading?: boolean;
	go_back_url?: string;
	button_name?: string;
	otherButtons?: React.ReactNode;
	showSaveButton: boolean;
	onSave?: () => void;
};

const GoBack = ({
	title,
	is_goback,
	children,
	showSaveButton,
	onSave,
	loading,
	go_back_url,
	button_name = "Save",
	otherButtons,
}: Params) => {
	const navigate = useNavigate();

	const theme = useMemo(() => {
		return createTheme();
	}, []);
	return (
		<Box
			sx={{
				mt: 2,
			}}>
			<Card>
				<CardContent
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						p: 2,
						gap: 2,
					}}>
					<Typography
						variant="h4"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 2,
							cursor: "pointer",
						}}
						onClick={() => {
							navigate(`${go_back_url ? go_back_url : ".."}`, {
								relative: "path",
							});
						}}>
						{is_goback && (
							<LuArrowLeftCircle
								color={theme.palette.primary.main}
							/>
						)}
						{title}
						<Divider orientation={"horizontal"} />
					</Typography>

					{showSaveButton && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "flex-end",
								gap: 2,
								flex: 1,
							}}>
							{otherButtons && otherButtons}
							<LoadingButton
								variant="contained"
								size="large"
								// sx={{
								// 	color: theme.palette.primary.main,
								// }}
								loading={loading}
								onClick={onSave}>
								{button_name}
							</LoadingButton>
						</Box>
					)}
				</CardContent>

				{/* </CardContent> */}
				{children}
			</Card>
		</Box>
	);
};

export default GoBack;
