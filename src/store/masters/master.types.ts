import { IconType } from "react-icons";
import { BaseInitialState } from "../../common/common.types";
import { MenuItemTypes } from "@src/common/menu-items";

export interface MasterState extends BaseInitialState {
	allMenus: {
		list: Array<{}>;
		count: number;
	};
	userAccessList: string[];
	masterMenuItemsList: MenuItemTypes[];
	sideMenuItemsList: MenuItemTypes[];
	profileMenuItemsList: MenuItemTypes[];
}

export type MenuItemsPayload = {
	code: string;
	from: string;
};
