import { createSelector, createSlice } from "@reduxjs/toolkit";
import { allMenus, getMenuItems, getUserPermissions } from "./system.action";
import { SystemState } from "./system.types";
import { RootState } from "../store";
import { MenuItemTypes, SubMenuItem } from "@src/common/menu-items";

const initialState: SystemState = {
	loading: false,
	status: "",
	error: "",
	allMenus: {
		list: [],
		count: 0,
	},
	userAccessList: [],
	masterMenuItemsList: [],
	sideMenuItemsList: [],
	profileMenuItemsList: [],
	tenderMenuItemsList: [],
	venderMenuItemsList: [],
	reportsMenuItemsList: [],
	projectsMenuItemsList: [],
	serviceRequestMenuItemsList: [],
};

const systemSlice = createSlice({
	name: "system",
	initialState,
	reducers: {
		getImportMenuItems: (state) => {
			return {
				...state,
				loading: true,
				quickMenuItemsList: [],
			};
		},
	},
	extraReducers(builder) {
		builder
			//all menus
			.addCase(allMenus.pending, (state, action) => {
				state.status = "loading";
				state.loading = true;
			})
			.addCase(allMenus.fulfilled, (state, action) => {
				const { count, results } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				state.allMenus.list = results;
				state.allMenus.count = count;
			})
			.addCase(allMenus.rejected, (state, action) => {
				state.status = "failed";
				state.loading = false;
				if (action.payload) {
					state.error =
						action.payload.rejectValue ||
						"An unknown error occurred";
				} else {
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			})
			//get menus
			.addCase(getMenuItems.pending, (state, action) => {
				state.status = "loading";
				state.loading = true;
			})
			.addCase(getMenuItems.fulfilled, (state, action) => {
				const { from, response } = action.payload;
				state.status = "succeeded";
				state.loading = false;
				const menuItems = response.menuitems?.map((menuitem) => {
					return {
						...menuitem,
						key: menuitem.id,
						label: menuitem.name,
						icon: menuitem.icon,
						url: menuitem.link,
						isTitle: false,
						sequence: menuitem.sequence,
					};
				});

				const setSubmenus: Function = (submenus: SubMenuItem[]) => {
					return submenus
						?.map((submenu) => {
							if (
								submenu.menuitems.length ||
								submenu.submenus.length
							) {
								return {
									...submenu,
									key: submenu.id,
									label: submenu.name,
									icon: submenu.icon,
									isTitle: false,
									children: submenu.menuitems.map(
										(menuitem) => {
											return {
												...menuitem,
												key: menuitem.id,
												label: menuitem.name,
												icon: menuitem.icon,
												url: menuitem.link,
												parentKey: submenu.id,
												children: submenu.submenus
													.length
													? setSubmenus(
															submenu.submenus
														)
													: [],
											};
										}
									),
									sequence: submenu.sequence,
								};
							}
							return null;
						})
						.filter((e) => e);
				};
				const submenus = setSubmenus(response.submenus);

				const sortedMenus = [
					...(menuItems ?? []),
					...(submenus ?? []),
				].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

				switch (from) {
					case "masters":
						state.masterMenuItemsList = sortedMenus;
						break;
					case "sidemenu":
						state.sideMenuItemsList = sortedMenus;
						break;
					case "profilemenu":
						state.profileMenuItemsList = sortedMenus;
						break;
					case "tendermenu":
						state.tenderMenuItemsList = sortedMenus;
						break;
					case "vendersmenu":
						state.venderMenuItemsList = sortedMenus;
						break;
					case "reportsmenu":
						state.reportsMenuItemsList = sortedMenus;
						break;
					case "projectsmenu":
						state.projectsMenuItemsList = sortedMenus;
						break;
					case "servicerequestmenu":
						state.serviceRequestMenuItemsList = sortedMenus;
						break;
				}
			})
			.addCase(getMenuItems.rejected, (state, action) => {
				state.status = "failed";
				state.loading = false;
				if (action.payload) {
					state.error =
						action.payload.rejectValue ||
						"An unknown error occurred";
				} else {
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			})

			.addCase(getUserPermissions.pending, (state, action) => {
				state.status = "loading";
			})
			.addCase(getUserPermissions.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Add any fetched posts to the array
				state.userAccessList = action.payload;
			})
			.addCase(getUserPermissions.rejected, (state, action) => {
				state.status = "failed";
				if (action.payload) {
					state.error =
						action.payload.rejectValue ||
						"An unknown error occurred";
				} else {
					state.error =
						action.error?.message || "An unknown error occurred";
				}
			});
	},
});

// Action creators are generated for each case reducer function
export const { getImportMenuItems } = systemSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const systemSelector = (state: RootState) => state.system;

// Memoized selector
export const selectSystem = createSelector([systemSelector], (system) => {
	return {
		system,
	};
});
export default systemSlice.reducer;
