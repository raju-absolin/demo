import { Drawer, styled } from "@mui/material";
import LogoBox from "./LogoBox";
import SimpleBar from "simplebar-react";
import AppMenu from "./AppMenu";
import {
	changeHTMLAttribute,
	getMenuItems as getSideMenus,
} from "@src/helpers/menu";
import { WithSetting } from "@src/types";
import { useViewPort } from "@src/hooks";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	selectLayoutTheme,
	updateSidenav,
} from "@src/store/customise/customise";
import { getMenuItems } from "@src/store/system/system.action";
import { selectSystem, systemSelector } from "@src/store/system/system.slice";

/* Sidemenu content */
const SideBarContent = () => {
	const dispatch = useAppDispatch();
	const { sideMenuItemsList } = useAppSelector((state) =>
		systemSelector(state)
	);
	useEffect(() => {
		dispatch(getMenuItems({ from: "sidemenu", code: "MENU0004" }));
	}, []);

	let menuitems = [
		{
			key: "dynamic-forms",
			label: "Dynamic Forms",
			isTitle: false,
			icon: "",
			url: "/dynamic-forms",
		},
	];

	return <AppMenu menuItems={sideMenuItemsList} />;
};

const LeftSideBarWrapper = styled("div")<WithSetting>(({ theme, settings }) => {
	return {
		backgroundColor: settings.themeColour.leftSidenav
			? settings.themeColour.leftSidenav
			: settings.sidenav.theme == "light"
				? "#fff"
				: "#212428",
		color: settings.themeColour.leftSidenav
			? theme.palette.common.white
			: settings.sidenav.theme == "light"
				? theme.palette.common.black
				: theme.palette.common.white,
		width: 240,
		height: "calc(100vh - 70px)",
		display: "flex",
		flexDirection: "column",
		position: "sticky",
		top: "70px",
		marginInlineStart: !settings.sidenav.showMobileMenu ? -240 : 0,
		transition: "0.3s margin",
	};
});

const LeftSideBarMenu = () => {
	const settings = useAppSelector((state) => selectLayoutTheme(state));

	return (
		<LeftSideBarWrapper
			settings={settings}
			className="app-menu-do-not-remove">
			<SimpleBar>
				<SideBarContent />
			</SimpleBar>
		</LeftSideBarWrapper>
	);
};

const LeftSideBar = () => {
	const dispatch = useAppDispatch();
	const { width } = useViewPort();
	const settings = useAppSelector((state) => selectLayoutTheme(state));
	const showMobileMenu = settings.sidenav.showMobileMenu;

	useEffect(() => {
		changeHTMLAttribute("data-mode", settings.theme);
	}, [settings.theme]);

	useEffect(() => {
		changeHTMLAttribute("data-menu-color", settings.sidenav.theme);
	}, [settings.sidenav.theme]);

	useEffect(() => {
		changeHTMLAttribute("data-sidenav-view", settings.sidenav.mode);
	}, [settings.sidenav.mode]);

	useEffect(() => {
		if (width < 1140) {
			dispatch(updateSidenav({ mode: "mobile" }));
		} else if (width >= 1140 && settings.sidenav.mode == "mobile") {
			dispatch(updateSidenav({ mode: "default" }));
		}
	}, [width]);

	const hideSideNavMobile = () => {
		// const htmlElement = document.getElementsByTagName("html")[0];
		// htmlElement.classList.remove("sidenav-enable");
		dispatch(updateSidenav({ showMobileMenu: false }));
	};
	return settings.sidenav.mode == "default" ? (
		<LeftSideBarMenu />
	) : (
		<Drawer
			open={showMobileMenu}
			onClose={hideSideNavMobile}
			variant="temporary">
			<LogoBox />
			<LeftSideBarMenu />
		</Drawer>
	);
};

export default LeftSideBar;
