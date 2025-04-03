import { type IconType } from "react-icons";

export interface MenuItemTypes {
	name: any;
	key?: string;
	label?: string;
	isTitle?: boolean;
	icon?: string;
	url?: string;
	badge?: {
		variant: string;
		text: string;
	};
	parentKey?: string;
	target?: string;
	children?: MenuItemTypes[];
	sequence?: number;
	description?: string;
}

export type MenuItem = {
	id?: string;
	name?: string;
	icon?: IconType;
	link?: string;
	sequence?: number;
	click?: string;
};
export type SubMenuItem = {
	click?: string;
	code: string;
	icon: IconType;
	id: string;
	menuitems: MenuItem[];
	name: string;
	sequence: 0;
	submenus: SubMenuItem[];
};
