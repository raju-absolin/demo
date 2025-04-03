import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
	getItems,
	getItemsById,
	addItems,
	editItems,
	getGroups,
	addGroups,
	getItemsByIdBreadcrumb,
	getItemsWithChildrenList,
	deleteItem,
	getItemsList,
} from "./item.action";
import { RootState, useAppSelector } from "@src/store/store";
import { Items, ItemsInitialState } from "./item.types";
import { string } from "yup";
import { systemSelector } from "@src/store/system/system.slice";
import { miniSelector } from "@src/store/mini/mini.Slice";
import State from "@src/pages/masters/State";

const initialState: ItemsInitialState = {
	error: "",
	status: "",
	loading: false,
	itemsList: [],
	breadCrumbsList: [],
	itemsCount: 0,
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
	itemgroupList: [],
	itemgroupCount: 0,
	grouppageParams: {
		no_of_pages: 0,
		page_size: 0,
		page: 0,
		search: undefined,
	},
	image: {},
	units: [],

	openView: false,
	addVendorModel: false,
};

const itemsSlice = createSlice({
	name: "items",
	initialState,
	reducers: {
		setVendorModalOpen: (state, action) => {
			return {
				...state,
				addVendorModel: true,
			};
		},
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
		setItemsList: (state, action) => {
			return {
				...state,
				itemsList: action.payload,
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
			.addCase(getItems.pending, (state, action) => {
				state.status = "getItems loading";
				state.loading = true;
			})
			.addCase(getItems.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getItems succeeded";
				state.loading = false;
				state.itemsList = response.results;
				state.itemsCount = response.count;
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
			.addCase(getItems.rejected, (state, action) => {
				state.status = "getItems failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getItemsList.pending, (state, action) => {
				state.status = "getItemsList loading";
				state.loading = true;
			})
			.addCase(getItemsList.fulfilled, (state, action) => {
				const { response, params } = action.payload;
				state.status = "getItemsList succeeded";
				state.loading = false;
				state.itemsList = response.results;
				state.itemsCount = response.count;
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
			.addCase(getItemsList.rejected, (state, action) => {
				state.status = "getItemsList failed";
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
				state.itemgroupList = response.results;
				state.itemgroupCount = response.count;
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
			.addCase(getItemsById.pending, (state, action) => {
				state.status = "getItemsById loading";
				state.loading = true;
			})
			.addCase(getItemsById.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.masterEditId = response?.id;
				state.selectedData = response;
				state.selectedData.product_types = {
					label: response.product_type_name,
					value: response.product_type,
				};
				(state.selectedData.makes = state.selectedData?.makes?.map(
					(e) => {
						return {
							label: e.name,
							value: e.id,
						};
					}
				)),
					(state.selectedData.units = state.selectedData?.units?.map(
						(e) => {
							return {
								id: e?.id,
								dodelete: e?.dodelete,
								label: e.name,
								value: e.units,
								uom_id: e.uom_id,
							};
						}
					)),
					(state.selectedData.types = {
						label: response.type_name,
						value: response.type,
					});
				const split: string[] | undefined = response?.image?.split("/");
				state.selectedData.image = {
					path: split ? split[split.length - 1] : "",
					preview: response?.image,
					formattedSize: "",
				};
			})
			.addCase(getItemsById.rejected, (state, action) => {
				state.status = "getItemsById failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(addItems.pending, (state, action) => {
				state.status = "addItems loading";
				state.loading = true;
			})
			.addCase(addItems.fulfilled, (state, action) => {
				state.status = "addItems succeeded";
				state.loading = false;
			})
			.addCase(addItems.rejected, (state, action) => {
				state.status = "addItems failed";
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
			.addCase(editItems.pending, (state, action) => {
				state.status = "editItems loading";
				state.loading = true;
			})
			.addCase(editItems.fulfilled, (state, action) => {
				state.status = "editItems succeeded";
				state.masterEditId = 0;
				state.masterValue = "";
				state.loading = false;
			})
			.addCase(editItems.rejected, (state, action) => {
				state.status = "editItems failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getItemsByIdBreadcrumb.pending, (state, action) => {
				state.status = "getItemsByIdBreadcrumb loading";
				state.loading = true;
			})
			.addCase(getItemsByIdBreadcrumb.fulfilled, (state, action) => {
				const { response } = action.payload;
				state.status = "getItemsByIdBreadcrumb succeeded";
				state.loading = false;
				state.breadCrumbsList = response?.breadcrumb;

				// state.masterEditId = undefined;
				// state.masterValue = "";
			})
			.addCase(getItemsByIdBreadcrumb.rejected, (state, action) => {
				state.status = "getItemsByIdBreadcrumb failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(getItemsWithChildrenList.pending, (state, action) => {
				state.status = "getItemsWithChildrenList loading";
				state.loading = true;
			})
			.addCase(getItemsWithChildrenList.fulfilled, (state, action) => {
				const { response, params, parentIds } = action.payload;
				const parent = params.parent;
				state.status = "getItemsWithChildrenList succeeded";
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

				// state.itemsList = response.results;
				// state.itemsCount = response.count;
				// var noofpages = Math.ceil(response.count / params.page_size);
				// state.pageParams = {
				// 	...state.pageParams,
				// 	...params,
				// 	no_of_pages: noofpages,
				// };
				state.masterEditId = undefined;
				state.masterValue = "";
			})
			.addCase(getItemsWithChildrenList.rejected, (state, action) => {
				state.status = "getItemsWithChildrenList failed";
				state.loading = false;
				state.error =
					action.error?.message || "An unknown error occurred";
			})
			.addCase(deleteItem.pending, (state, action) => {
				state.status = "deleteItem loading";
				state.loading = true;
			})
			.addCase(deleteItem.fulfilled, (state, action) => {
				state.status = "deleteItem succeeded";
				state.loading = false;
			})
			.addCase(deleteItem.rejected, (state, action) => {
				state.status = "deleteItem failed";
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
	setItemsList,
	setUnitsList,
	setOpenView,
	setVendorModalOpen,
} = itemsSlice.actions;

export const itemsSelector = (state: RootState) => state.masters.items;
// Memoized selector
export const selectItems = createSelector(
	[itemsSelector, systemSelector, miniSelector],
	(items, system, mini) => ({
		items,
		system,
		mini,
	})
);

export const useItemSelector = () => {
	const selector = useAppSelector((state) => selectItems(state));
	return selector;
};

export default itemsSlice.reducer;
