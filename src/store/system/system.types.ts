import { IconType } from "react-icons";
import { BaseInitialState } from "../../common/common.types";
import { MenuItemTypes } from "@src/common/menu-items";

export interface SystemState extends BaseInitialState {
	allMenus: {
		list: Array<{}>;
		count: number;
	};
	userAccessList: string[];
	masterMenuItemsList: MenuItemTypes[];
	sideMenuItemsList: MenuItemTypes[];
	profileMenuItemsList: MenuItemTypes[];
	tenderMenuItemsList: MenuItemTypes[];
	venderMenuItemsList: MenuItemTypes[];
	reportsMenuItemsList: MenuItemTypes[];
	projectsMenuItemsList: MenuItemTypes[];
	serviceRequestMenuItemsList: MenuItemTypes[];
}

export type MenuItemsPayload = {
	code: string;
	from: string;
};
