import axios from "axios";
import axiosInstance, { BaseURL, TOKEN_PREFIX } from "./AxiosHelper";
import moment from "moment";
import { serialize } from "object-to-formdata";
import fileDownload from "js-file-download";

const addParams = (payload: any) => {
	var data = payload;
	let params: any = {};
	for (const k in data) {
		if (Object.hasOwnProperty.call(data, k)) {
			if (k === "currentSort" || k === "sortOrder") {
				params.ordering = data.sortOrder + data.currentSort;
			} else {
				if (data[k] !== "" && k !== null && k != "no_of_pages") {
					if (k == "start_date" || k == "end_date") {
						params[k] = moment(data[k]).format("YYYY-MM-DD");
					} else if (Array.isArray(data[k])) {
						// Handle arrays
						if (
							data[k].every(
								(item: any) =>
									typeof item === "object" && "value" in item
							)
						) {
							// If array contains objects with 'value', extract 'value'
							params[k] = data[k].map((item: any) => item.value);
						} else {
							// Otherwise, keep the array as-is
							params[k] = data[k];
						}
					} else if (
						typeof data[k] === "object" &&
						data[k] !== null
					) {
						// Check if the object has a 'value' property
						if ("value" in data[k]) {
							params[k] = data[k].value;
						} else {
							params[k] = null;
						}
					} else {
						params[k] = data[k];
					}
				}
			}
		}
	}
	return params;
};

const postLogin = (url: string, data: {}) => {
	return axios
		.post(BaseURL + url, data)
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;

			axiosInstance.defaults.headers["Authorization"] =
				TOKEN_PREFIX + response.data.tokens.access;
			return response;
		})
		.catch((err) => {
			throw err.response;
		});
};
const postLogout = (url: string, data: {}) => {
	return axiosInstance
		.post(url, data)
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response;
			axiosInstance.defaults.headers["Authorization"] = "";
			return response;
		})
		.catch((err) => {
			var message;

			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = err.response.data;
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw err;
		});
};
const getList = (url: string) => {
	return axiosInstance
		.get(url)
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;
			return response;
		})
		.catch((err) => {
			throw err[1];
		});
};

const getParamsList = (url: string, params: any) => {
	return axiosInstance
		.get(url, {
			params: params,
		})
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;
			return response.data;
		})
		.catch((err) => {
			throw err[1];
		});
};
const postAdd = (url: string, data: any, params = {}) => {
	return axiosInstance
		.post(url, data, {
			params: params,
		})
		.then((response) => {
			if (response.status === 400 || response.status === 500) {
				throw response;
			}

			return response;
		})
		.catch((err) => {
			var message;

			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = err.response.data;
						break;
					default:
						message = err[1];
						break;
				}
			}
			console.error(message);
			throw err;
		});
};

const postFormData = (url: string, data: any) => {
	const formData = serialize(data);

	return axiosInstance
		.post(url, formData)
		.then((response) => {
			if (response.status === 400 || response.status === 500) {
				throw response;
			}

			return response;
		})
		.catch((err) => {
			var message;
			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = err.response.data;
						break;
					case 413:
						message = "File must be smaller than 20 MB";
						break;
					default:
						// message = err[1];
						message = "Unable to upload the file";
						break;
				}
			}
			console.error(message);
			return message;
		});
};
const putImg = (url: string, data: any) => {
	const formData = serialize(data);

	return axiosInstance
		.put(url, formData)
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;
			return response;
		})
		.catch((err) => {
			var message;
			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = err.response.data;
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw message;
		});
};
const patchImg = (url: string, data: any) => {
	// const user = localStorage.getItem("authUser");
	// let sjson = JSON.parse(user);
	// const formData = new FormData();
	// formData.append(data.name, data.file);
	const formData = serialize(data);

	return axiosInstance
		.patch(url, formData)
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;
			return response;
		})
		.catch((err) => {
			//throw err[1];

			var message;
			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = err.response.data;
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw message;
		});
};
const postEdit = (url: string, data: any) => {
	// const user = localStorage.getItem("authUser");
	// let sjson = JSON.parse(user);
	// const formData = serialize(data);

	return axiosInstance
		.put(url, data)
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;
			return response;
		})
		.catch((err) => {
			var message;
			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = err.response.data;
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw err;
		});
};
const getDownloadFile = (url: string, params = {}) => {
	return axiosInstance
		.get(url, {
			params: params,
			headers: {
				"Access-Control-Expose-Headers": "Content-Disposition",
			},
			responseType: "blob",
		})
		.then((response) => {
			if (response.status === 400 || response.status === 500) {
				throw response.data;
			}
			var filename = url?.split("/")[url?.split("/").length - 1];

			let headerLine = response.headers["content-disposition"];
			if (headerLine) {
				let startFileNameIndex = headerLine.indexOf('"') + 1;
				let endFileNameIndex = headerLine.lastIndexOf('"');
				filename = headerLine.substring(
					startFileNameIndex,
					endFileNameIndex
				);
			}
			fileDownload(response.data, filename);
		})
		.catch((err) => {
			var message;

			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = "Invalid credentials";
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw message;
		});
};
const getDownloadFileWithoutAxiosInstance = (
	url: string,
	body: any,
	params = {}
) => {
	return axios
		.get(url, {
			params: params,
			// headers: {
			// 	"Access-Control-Expose-Headers": "Content-Disposition",
			// },
			responseType: "blob",
		})
		.then((response) => {
			if (response.status === 400 || response.status === 500) {
				throw response.data;
			}
			// var filename = url?.split("/")[url?.split("/").length - 1];
			var filename = body?.file_name || "download";

			let headerLine = response.headers["content-disposition"];
			if (headerLine) {
				let startFileNameIndex = headerLine.indexOf('"') + 1;
				let endFileNameIndex = headerLine.lastIndexOf('"');
				filename = headerLine.substring(
					startFileNameIndex,
					endFileNameIndex
				);
			}
			fileDownload(response.data, filename);
		})
		.catch((err) => {
			var message;

			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = "Invalid credentials";
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw message;
		});
};
const postDownloadFile = (url: string, body: any, params = {}) => {
	return axiosInstance
		.post(url, body, {
			params: params,
			responseType: "blob",
		})
		.then((response) => {
			if (response.status === 400 || response.status === 500) {
				throw response.data;
			}
			var filename = "filename.csv";
			let headerLine = `${body.model_name}.csv`;
			if (headerLine) {
				// let startFileNameIndex = headerLine.indexOf('"') + 1;
				// let endFileNameIndex = headerLine.lastIndexOf('"');
				// filename = headerLine.substring(startFileNameIndex, endFileNameIndex);
				filename = headerLine;
			}
			fileDownload(response.data, filename);
		})
		.catch((err) => {
			var message;

			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = "Invalid credentials";
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw message;
		});
};

const postDelete = (url: string) => {
	// const user = localStorage.getItem("authUser");
	// let sjson = JSON.parse(user);
	return axiosInstance
		.delete(url)
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;
			return response;
		})
		.catch((err) => {
			//throw err;

			var message;
			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = "Invalid credentials";
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw message;
		});
};
//--------------------------
const patchEdit = (url: string, data: any) => {
	// const user = localStorage.getItem("authUser");
	// let sjson = JSON.parse(user);
	return axiosInstance
		.patch(url, data)
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;
			return response;
		})
		.catch((err) => {
			var message;
			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = err.response.data;
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw message;
		});
};

// postForgetPwd
const postAddmultipart = (url: string, data: any) => {
	const user: any = localStorage.getItem("authUser");
	let sjson = JSON.parse(user);
	return axios
		.post(url, data, {
			headers: {
				Authorization: "Bearer  " + sjson.tokens.access,
				"content-type": "multipart/form-data",
			},
		})
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;
			return response;
		})
		.catch((err) => {
			//throw err[1];

			var message;
			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = "Invalid credentials";
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw message;
		});
};

const postEditmultipart = (url: string, data: any) => {
	const user: any = localStorage.getItem("authUser");
	let sjson = JSON.parse(user);
	return axios
		.put(url, data, {
			headers: {
				Authorization: "Token " + sjson.data.token,
				"content-type": "multipart/form-data",
			},
		})
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;
			return response;
		})
		.catch((err) => {
			//throw err[1];

			var message;
			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = "Invalid credentials";
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw message;
		});
};

const getRowData = (url: string) => {
	// const user = localStorage.getItem("authUser");
	// let sjson = JSON.parse(user);
	return axiosInstance
		.get(url)
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;
			return response;
		})
		.catch((err) => {
			//throw err;

			var message;
			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = "Invalid credentials";
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw message;
		});
};

const postUpload = (url: string, csvfile: any) => {
	const user: any = localStorage.getItem("authUser");
	let sjson = JSON.parse(user);
	// var formData = new FormData();
	// formData.append("file", csvfile.files[0]);
	return axios
		.post(url, csvfile, {
			headers: {
				Authorization: "Token " + sjson.data.token,
				"content-type": "multipart/form-data",
			},
		})
		.then((response) => {
			if (response.status === 400 || response.status === 500)
				throw response.data;
			return response;
		})
		.catch((err) => {
			//throw err;

			var message;
			if (err.response && err.response.status) {
				switch (err.response.status) {
					case 404:
						message =
							"Sorry! the page you are looking for could not be found";
						break;
					case 500:
						message =
							"Sorry! something went wrong, please contact our support team";
						break;
					case 400:
						message = "Invalid credentials";
						break;
					default:
						message = err[1];
						break;
				}
			}
			throw message;
		});
};

export {
	addParams,
	postLogin,
	postLogout,
	getList,
	getParamsList,
	postAdd,
	postFormData,
	putImg,
	patchImg,
	postEdit,
	getDownloadFile,
	postDownloadFile,
	//-----------
	patchEdit,
	postDelete,
	getRowData,
	postUpload,
	postAddmultipart,
	postEditmultipart,

	//-------------
	getDownloadFileWithoutAxiosInstance,
};
