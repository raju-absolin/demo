import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	getAccounts,
	getAccountsById,
	addAccounts,
	editAccounts,
	getGroups,
	addGroups,
	getAccountsByIdBreadcrumb,
	getAccountsWithChildrenList,
	deleteAccount,
	getAccountsList,
} from "./accounts.action";
import { RootState, useAppSelector } from "@src/store/store";
import { Accounts, AccountsInitialState } from "./accounts.types";
import { string } from "yup";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";

const initialState: AccountsInitialState = {
	error: "",
	status: "",
	loading: false,
	accountsList: [],
	breadCrumbsList: [],
	accountsCount: 0,
	searchValue: "",
	drawer: false,
	masterValue: "",
	masterEditId: 0,
	isModelVisible: false,
	selectedData: {},
	filterStatus: false,
	passwordModel: false,
	parentValue: [],
	pageParams: {
		no_of_pages: 0,
		page_size: 10,
		page: 1,
		search: "",
	},
	accountgroupList: [],
	accountgroupCount: 0,
	grouppageParams: {
		no_of_pages: 0,
		page_size: 0,
		page: 0,
		search: undefined,
	},
	image: {},
	units: [],

	openView: false,
};

const accountsSlice = createSlice({
	name: "accounts",
	initialState,
	reducers: {
		clearUserData: (state, action) => {
			return initialState;
		},
		setSelectedData: (state, action) => {
			return {
				...state,
				selectedData: action.payload,
			};
		},
		setSearchValue: (state, action) => {
			return {
				...state,
				searchValue: action.payload,
			};
		},
		setParentValue: (state, action) => {
			return {
				...state,
				parentValue: [...state.parentValue, action.payload],
			};
		},
		isModelVisible: (state, action) => {
			if (!action.payload) {
				return {
					...state,
					model: action.payload,
				};
			} else {
				return {
					...state,
					model: action.payload,
				};
			}
		},
		setMasterValue: (state, action) => {
			return {
				...state,
				masterValue: action.payload,
			};
		},
		setMasterEditId: (state, action) => {
			return {
				...state,
				masterEditId: action.payload,
			};
		},
		setUploadImages: (state, action) => {
			return {
				...state,
				image: action.payload,
			};
		},
		setBreadCrumbs: (state, action) => {
			return {
				...state,
				breadCrumbsList: action.payload,
			};
		},
		setAccountsList: (state, action) => {
			return {
				...state,
				accountsList: action.payload,
			};
		},
		setUnitsList: (state, action) => {
			return {
				...state,
				units: action.payload,
			};
		},
		setOpenView: (state, action) => {
			return {
				...state,
				openView: action.payload,
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAccounts.pending, (state, action) => {
				state.status = "getAccounts loading";
				state.loading = true;
			})
			.addCase(getAccounts.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getAccounts succeeded";
				state.loading = false;
				state.accountsList = response.results?.map((e) => {
					return {
						...e,
						account_type: {
							id: e.account_type as string,
							name: e.account_type_name,
							value: e.account_type as string,
							label: e.account_type_name,
						},
					};
				});
				state.accountsCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				// state.breadCrumbsList = [];
				state.masterEditId = undefined;
				state.masterValue = "";
			})
			.addCase(getAccounts.rejected, (state, action) => {
				state.status = "getAccounts failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getAccountsList.pending, (state, action) => {
				state.status = "getAccountsList loading";
				state.loading = true;
			})
			.addCase(getAccountsList.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getAccountsList succeeded";
				state.loading = false;
				state.accountsList = response.results?.map((e) => ({
					...e,
					account_type: {
						id: `${e?.account_type}` || "",
						name: e?.account_type_name || "",
					},
				}));
				state.accountsCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.pageParams = {
					...state.pageParams,
					...params,
					no_of_pages: noofpages,
				};
				// state.breadCrumbsList = [];
				state.masterEditId = undefined;
				state.masterValue = "";
			})
			.addCase(getAccountsList.rejected, (state, action) => {
				state.status = "getAccountsList failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})

			.addCase(getGroups.pending, (state, action) => {
				state.status = "getGroups loading";
				state.loading = true;
			})
			.addCase(getGroups.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getGroups succeeded";
				state.loading = false;
				state.accountgroupList = response.results;
				state.accountgroupCount = response.count;
				var noofpages = Math.ceil(response.count / params.page_size);
				state.grouppageParams = {
					...state.grouppageParams,
					...params,
					no_of_pages: noofpages,
				};
				state.masterEditId = undefined;
				state.masterValue = "";
			})
			.addCase(getGroups.rejected, (state, action) => {
				state.status = "getGroups failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			// getbyid
			.addCase(getAccountsById.pending, (state, action) => {
				state.status = "getAccountsById loading";
				state.loading = true;
			})
			.addCase(getAccountsById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterEditId = response?.id;
				state.selectedData = {
					...response,
					account_type: {
						id: `${response?.account_type}` || "",
						name: response?.account_type_name || "",
					},
				};
			})
			.addCase(getAccountsById.rejected, (state, action) => {
				state.status = "getAccountsById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addAccounts.pending, (state, action) => {
				state.status = "addAccounts loading";
				state.loading = true;
			})
			.addCase(addAccounts.fulfilled, (state, action) => {
				state.status = "addAccounts succeeded";
				state.loading = false;
			})
			.addCase(addAccounts.rejected, (state, action) => {
				state.status = "addAccounts failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addGroups.pending, (state, action) => {
				state.status = "addGroups loading";
				state.loading = true;
			})
			.addCase(addGroups.fulfilled, (state, action) => {
				state.status = "addGroups succeeded";
				state.loading = false;
			})
			.addCase(addGroups.rejected, (state, action) => {
				state.status = "addGroups failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(editAccounts.pending, (state, action) => {
				state.status = "editAccounts loading";
				state.loading = true;
			})
			.addCase(editAccounts.fulfilled, (state, action) => {
				state.status = "editAccounts succeeded";
				state.masterEditId = 0;
				state.masterValue = "";
				state.loading = false;
			})
			.addCase(editAccounts.rejected, (state, action) => {
				state.status = "editAccounts failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getAccountsByIdBreadcrumb.pending, (state, action) => {
				state.status = "getAccountsByIdBreadcrumb loading";
				state.loading = true;
			})
			.addCase(getAccountsByIdBreadcrumb.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getAccountsByIdBreadcrumb succeeded";
				state.loading = false;
				state.breadCrumbsList = response?.breadcrumb;

				// state.masterEditId = undefined;
				// state.masterValue = "";
			})
			.addCase(getAccountsByIdBreadcrumb.rejected, (state, action) => {
				state.status = "getAccountsByIdBreadcrumb failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getAccountsWithChildrenList.pending, (state, action) => {
				state.status = "getAccountsWithChildrenList loading";
				state.loading = true;
			})
			.addCase(getAccountsWithChildrenList.fulfilled, (state, action) => {
				const { response, params, parentIds } = action.payload;
				const parent = params.parent;
				state.status = "getAccountsWithChildrenList succeeded";
				function setChildren(
					groups?: any,
					children?: Array<any>,
					parent_Ids?: Array<any>
				) {
					var parent = parent_Ids?.shift();
					return groups?.map((group: any) => {
						if (group.id == parent) {
							if (parent_Ids?.length == 0) {
								return {
									...group,
									children: children,
								};
							} else {
								return {
									...group,
									children: setChildren(
										group.children,
										children,
										parent_Ids
									),
								};
							}
						} else {
							return group;
						}
					});
				}

				state.loading = false;
				if (parent == null) {
					state.GroupsTree = response.results;
				} else {
					state.GroupsTree = setChildren(
						state.GroupsTree,
						response.results,
						parentIds
					);
				}

				// state.accountsList = response.results;
				// state.accountsCount = response.count;
				// var noofpages = Math.ceil(response.count / params.page_size);
				// state.pageParams = {
				// 	...state.pageParams,
				// 	...params,
				// 	no_of_pages: noofpages,
				// };
				state.masterEditId = undefined;
				state.masterValue = "";
			})
			.addCase(getAccountsWithChildrenList.rejected, (state, action) => {
				state.status = "getAccountsWithChildrenList failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteAccount.pending, (state, action) => {
				state.status = "deleteAccount loading";
				state.loading = true;
			})
			.addCase(deleteAccount.fulfilled, (state, action) => {
				state.status = "deleteAccount succeeded";
				state.loading = false;
			})
			.addCase(deleteAccount.rejected, (state, action) => {
				state.status = "deleteAccount failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			});
	},
});

// Action creators are generated for each case reducer function
export const {
	clearUserData,
	setSelectedData,
	setSearchValue,
	isModelVisible,
	setMasterValue,
	setMasterEditId,
	setUploadImages,
	setParentValue,
	setBreadCrumbs,
	setAccountsList,
	setUnitsList,
	setOpenView,
} = accountsSlice.actions;

export const accountsSelector = (state: RootState) => state.masters.accounts;
// Memoized selector
export const selectAccounts = createSelector(
	[accountsSelector, systemSelector, miniSelector],
	(accounts, system, mini) => ({
		accounts,
		system,
		mini,
	})
);

export const useAccountSelector = () => {
	const selector = useAppSelector((state) => selectAccounts(state));
	return selector;
};

export default accountsSlice.reducer;
