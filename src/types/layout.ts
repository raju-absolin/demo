import { themeColours } from "@src/theme/palette";

type LayoutTheme = "light" | "dark" | keyof typeof themeColours;

type LayoutSidenav = {
	theme: LayoutTheme;
	mode: "default" | "mobile";
	showMobileMenu: boolean;
};
type LayoutTopnav = {
	theme: LayoutTheme;
};

export type ThemeComponents = {
	topnav: string;
	leftSidenav: string;
};

type LayoutState = {
	theme: LayoutTheme;
	sidenav: LayoutSidenav;
	topnav: LayoutTopnav;
	showRightsideBar: boolean;
	themeColours: Record<string, string>;
	themeColour: ThemeComponents;
};

type LayoutType = {
	settings: LayoutState;
	themeMode: LayoutTheme;
	updateTheme: (newTheme: LayoutTheme) => void;
	updateSidenav: (newSidenav: Partial<LayoutSidenav>) => void;
	updateTopnav: (newSidenav: Partial<LayoutTopnav>) => void;
	updateShowRightsideBar: (show: LayoutState["showRightsideBar"]) => void;
	resetSettings: () => void;
};

export type { LayoutTheme, LayoutSidenav, LayoutState, LayoutType };
