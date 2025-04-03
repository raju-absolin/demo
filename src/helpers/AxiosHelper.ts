import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import { browserName } from "react-device-detect";
import { deleteCookie, hasCookie, setCookie } from "cookies-next";
import { config } from "../config";

// const BaseURL: string = window.BaseURL ?? ""; // Base URL
const BaseURL = config.baseUrl;
const TOKEN_PREFIX: string = "Bearer ";
const uuid: string = uuidv4();

interface FailedQueueItem {
	resolve: (token: string | null) => void;
	reject: (error: any) => void;
}

let isRefreshing: boolean = false;
let failedQueue: FailedQueueItem[] = [];

const axiosInstance = axios.create({
	baseURL: BaseURL,
	timeout: 80000,
	headers: {
		Authorization: localStorage.getItem("access_token")
			? TOKEN_PREFIX + localStorage.getItem("access_token")
			: null,
	},
});

const processQueue = (error: any, token: string | null = null): void => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

export function removeToken(): void {
	localStorage.clear();
	window.location.href = "/pages/auth/login/";
}

axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(err: AxiosError) => {
		// Ensure originalRequest is defined before using it
		const originalRequest:
			| (AxiosRequestConfig & { _retry?: boolean })
			| undefined = err.config;

		if (
			originalRequest &&
			err.response?.status === 401 &&
			!originalRequest._retry
		) {
			if (isRefreshing) {
				return new Promise<string | null>((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						if (token) {
							originalRequest.headers = {
								...originalRequest.headers,
								Authorization: "Bearer " + token,
							};
						}
						return axiosInstance(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const refreshToken = localStorage.getItem("refresh_token");

			if (refreshToken && refreshToken !== "undefined") {
				const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));
				const now = Math.ceil(Date.now() / 1000);

				if (tokenParts.exp > now) {
					return new Promise<AxiosResponse>((resolve, reject) => {
						axiosInstance
							.post(BaseURL + "/users/token/refresh/", {
								refresh: refreshToken,
								device_uuid: uuid,
								device_name: browserName,
								device_type: 3, // web
							})
							.then((response: AxiosResponse) => {
								localStorage.setItem(
									"access_token",
									response.data.access
								);
								axiosInstance.defaults.headers.Authorization =
									TOKEN_PREFIX + response.data.access;
								originalRequest.headers = {
									...originalRequest.headers,
									Authorization:
										TOKEN_PREFIX + response.data.access,
								};
								processQueue(null, response.data.access);
								resolve(axiosInstance(originalRequest));
							})
							.catch((err: AxiosError) => {
								processQueue(err, null);
								removeToken();
								reject(err);
							})
							.finally(() => {
								isRefreshing = false;
							});
					});
				} else {
					removeToken();
				}
			} else {
				removeToken();
			}
		} else if (err.response?.status === 403) {
			window.location.href = "/pages/error-page-403";
		} else if (err.response?.status === 500) {
			// ErrorModal.open({
			// 	title: "Submission Error",
			// 	message: "Unable to submit the form. Please try again.",
			// 	primaryActionLabel: "Retry",
			// 	onPrimaryAction: () => {
			// 		// Retry submission logic
			// 		console.log("Retrying submission...");
			// 	},
			// 	onClose: () => {
			// 		// Optional callback when modal closes
			// 		console.log("Modal closed");
			// 	},
			// });
			window.location.href = "/pages/error-page-500";
		} else if (err.response?.status === 502) {
			window.location.href = "/pages/error-page-502";
		} else if (err.response?.status === 503) {
			window.location.href = "/pages/error-page-503";
		}

		return Promise.reject(err);
	}
);

export default axiosInstance;
export { BaseURL, axiosInstance, TOKEN_PREFIX };
