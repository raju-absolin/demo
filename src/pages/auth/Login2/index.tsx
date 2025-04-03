import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import AuthLayout2 from "../AuthLayout2";
import useLogin from "../Login/useLogin";
import {
	CheckboxInput,
	FormInput,
	PageMetaData,
	PasswordInput,
} from "@src/components";

const BottomLink = () => {
	return (
		<Typography
			variant="body2"
			color={"text.secondary"}
			sx={{ display: "flex", flexWrap: "nowrap", gap: 0.5 }}>
			Don&apos;t have an account?&nbsp;
			<Link to="/auth/register2">
				<Typography variant="subtitle2" component={"span"}>
					Register
				</Typography>
			</Link>
		</Typography>
	);
};

const Login2 = () => {
	const { loading, login, control }: any = useLogin();

	return (
		<>
			<PageMetaData title={"Login"} />

			<AuthLayout2
				authTitle="Log In"
				helpText="Enter your email address and password to access account."
				hasThirdPartyLogin
				bottomLinks={<BottomLink />}>
				<form onSubmit={login} style={{ textAlign: "left" }}>
					<FormInput
						name="email"
						type="email"
						label="Email Address"
						control={control}
					/>

					<Box sx={{ mt: 2 }}>
						<PasswordInput
							name="password"
							type="password"
							label={"Password"}
							control={control}
						/>
					</Box>

					<Box sx={{ mt: 1 }}>
						<CheckboxInput
							name="rememberMe"
							label="Remember me"
							control={control}
						/>
					</Box>

					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							mt: 2,
						}}>
						<Button
							variant="contained"
							color="primary"
							type="submit"
							disabled={loading}
							size={"large"}
							fullWidth>
							Login
						</Button>
					</Box>
				</form>
			</AuthLayout2>
		</>
	);
};

export default Login2;
