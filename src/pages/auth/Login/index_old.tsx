import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { CheckboxInput, PageMetaData, PasswordInput } from "@src/components";
import { FormInput } from "@src/components";
import useLogin from "./useLogin";
import AuthLayout from "../AuthLayout";
import { LoadingButton } from "@mui/lab";

/**
 * Bottom Links goes here
 */
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

const Login = () => {
	const { loading, handleLogin, control } = useLogin();

	return (
		<>
			<PageMetaData title={"Login"} />

			<AuthLayout
				authTitle="Login In"
				helpText="Enter your user name and password to access admin panel."
				bottomLinks={<BottomLink />}>
				<form onSubmit={handleLogin}>
					<FormInput
						name="username"
						type="text"
						label="User Name"
						placeholder="Enter your user name"
						control={control}
					/>

					<Box sx={{ mt: 2 }}>
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
							justifyContent: "center",
							mt: 2,
						}}>
						<LoadingButton
							loading={loading}
							variant="contained"
							color="primary"
							type="submit"
							disabled={loading}
							size={"large"}>
							Login
						</LoadingButton>
					</Box>
				</form>
			</AuthLayout>
		</>
	);
};

export default Login;
