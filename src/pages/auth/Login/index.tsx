import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
	TextField,
	Button,
	Card,
	CardContent,
	Typography,
	Box,
	Grid2 as Grid,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInput, PageMetaData, PasswordInput } from "@src/components";
import bgImg from "@src/assets/images/BG.png";
import AuthLayout from "../AuthLayout";
import { LoadingButton } from "@mui/lab";
import useLogin from "./useLogin";
import { Link } from "react-router-dom";

const BottomLink = () => {
	return (
		<Box sx={{ my: "16px", display: "flex", justifyContent: "center" }}>
			<Typography
				variant="body2"
				color={"text.secondary"}
				sx={{ display: "flex", flexWrap: "nowrap", gap: 0.5 }}>
				Don&apos;t have an account?&nbsp;
				<Link to="/auth/register">
					<Typography variant="subtitle2" component={"span"}>
						Register
					</Typography>
				</Link>
			</Typography>
		</Box>
	);
};

const LoginForm = () => {
	const { loading, handleLogin, control } = useLogin();

	return (
		<>
			<PageMetaData title={"Login"} />
			<AuthLayout authTitle="" helpText="" bottomLinks={<BottomLink />}>
				<Box
					sx={{
						px: 3,
						height: "280px",
					}}>
					<form onSubmit={handleLogin}>
						<Box sx={{ mt: 5 }}>
							<FormInput
								name="username"
								type="text"
								label="User Name"
								placeholder="Enter your user name"
								control={control}
							/>
						</Box>

						<Box sx={{ mt: 3 }}>
							<PasswordInput
								name="password"
								type="password"
								label={"Password"}
								placeholder="Enter your password"
								control={control}
							/>
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								mt: 5,
							}}>
							<LoadingButton
								loading={loading}
								variant="contained"
								sx={{
									bgcolor: "#0E484C",
								}}
								type="submit"
								disabled={loading}
								size={"small"}>
								Login
							</LoadingButton>
							<Button
								variant="text"
								sx={(theme) => ({
									color: theme.palette.text.primary,
								})}
								size={"large"}>
								Forget your Password ?
							</Button>
						</Box>
					</form>
				</Box>
			</AuthLayout>
		</>
	);
};

export default LoginForm;
