import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { authSelector } from "@src/store/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { login } from "@src/store/auth/auth.action";
import { v4 as uuidv4 } from "uuid";
import { browserName } from "react-device-detect";
import { LoginData } from "@src/store/auth/auth.types";

export default function useLogin() {
	const { loading } = useAppSelector((state) => authSelector(state));
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const loginFormSchema = yup.object({
		username: yup.string().required("Please enter username"),
		password: yup.string().required("Please enter password"),
	});

	const { control, handleSubmit } = useForm({
		resolver: yupResolver(loginFormSchema),
		defaultValues: {},
	});

	type LoginFormFields = yup.InferType<typeof loginFormSchema>;

	const redirectUrl = useMemo(
		() => (location.state?.from.pathname, "/dashboard"),
		[location.state]
	);

	const handleLogin = handleSubmit(async (values: LoginFormFields) => {
		const uuid = uuidv4();
		const device_fcmtoken = !localStorage.getItem("currentToken")
			? ""
			: (localStorage.getItem("currentToken") as string);

		const loginData: LoginData = {
			username: values.username,
			password: values.password,
			user_type: "User",
			device_uuid: uuid,
			device_name: browserName,
			device_type: 3, // web
			device_fcmtoken,
		};
		dispatch(
			login({
				data: loginData,
				redirectUrl,
				navigate,
				enqueueSnackbar,
			})
		);
	});

	useEffect(() => {
		if (localStorage.getItem("currentToken")) {
			navigate(redirectUrl);
		}
	}, [localStorage.getItem("currentToken")]);

	return {
		loading,
		handleLogin,
		redirectUrl,
		control,
	};
}
