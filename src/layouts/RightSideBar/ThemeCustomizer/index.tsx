/*
 * Copyright (c) 2023.
 * File Name: index.tsx
 * Author: Coderthemes
 */

import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { LuX } from "react-icons/lu";
import SimpleBar from "simplebar-react";

import LayoutThemeToggler from "./LayoutThemeToggler";
import SidenavModeToggler from "./SidenavModeToggler";
import SidenavThemeToggler from "./SidenavThemeToggler";
import { LayoutSidenav, LayoutTheme } from "@src/types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	postUserPreferences,
	resetSettings,
	selectLayoutTheme,
	updateShowRightsideBar,
	updateSidenav,
	updateTheme,
	updateThemeColour,
	updateTopnav,
} from "@src/store/customise/customise";
import TopnavThemeToggler from "./TopnavThemeToggle";

const ThemeCustomizer = () => {
	const dispatch = useAppDispatch();
	const settings = useAppSelector((state) => selectLayoutTheme(state));

	const handleChangeLayoutTheme = (theme: LayoutTheme) => {
		dispatch(updateTheme(theme));
		dispatch(updateThemeColour({ leftSidenav: "", topnav: "" }));
		dispatch(
			postUserPreferences({
				user_id: "",
				body: {
					preferences: {
						...settings?.preferences,
						theme:
							settings?.themeMode == "light" ? "dark" : "light",
						sidebar: {
							theme:
								settings?.themeMode == "light"
									? "dark"
									: "light",
							colour: "",
						},
						topbar: {
							theme:
								settings?.themeMode == "light"
									? "dark"
									: "light",
							colour: "",
						},
					},
				},
			})
		);
	};

	const handleChangeSidenavMode = (mode: LayoutSidenav["mode"]) =>
		dispatch(updateSidenav({ mode: mode }));

	const handleChangeSidenavTheme = (theme: LayoutSidenav["theme"]) => {
		dispatch(updateSidenav({ theme: theme }));
	};

	const handleChangeTopnavTheme = (theme: LayoutSidenav["theme"]) =>
		dispatch(updateTopnav({ theme: theme }));

	return (
		<>
			<Box
				sx={{
					height: 70,
					minHeight: 70,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					backgroundColor: "#3e60d5",
					gap: "12px",
					px: "24px",
				}}>
				<Typography sx={{ color: "white" }} variant={"subtitle1"}>
					Theme Settings
				</Typography>
				<IconButton
					sx={{ color: "white" }}
					onClick={() => dispatch(updateShowRightsideBar(false))}>
					<LuX />
				</IconButton>
			</Box>

			<SimpleBar style={{ height: "calc(100% - 70px)" }}>
				<Stack padding={"20px"} gap={2}>
					<LayoutThemeToggler
						handleChangeLayoutTheme={handleChangeLayoutTheme}
						layoutTheme={settings.themeMode}
					/>

					<SidenavModeToggler
						handleChangeSidenavMode={handleChangeSidenavMode}
						sidenavMode={settings.sidenav.mode}
					/>

					<SidenavThemeToggler
						handleChangeSidenavTheme={handleChangeSidenavTheme}
						sidenavTheme={settings.sidenav.theme}
					/>
					<TopnavThemeToggler
						handleChangeTopnavTheme={handleChangeTopnavTheme}
						topnavTheme={settings.topnav.theme}
					/>
				</Stack>
			</SimpleBar>

			<Box
				sx={{
					height: 64,
					display: "flex",
					alignItems: "center",
					gap: 16,
					borderTopWidth: 1,
					borderColor: "#d1d5db",
				}}>
				<Button
					sx={{ mx: "20px" }}
					onClick={() => dispatch(resetSettings())}
					variant="contained"
					color="primary"
					fullWidth>
					Reset
				</Button>
			</Box>
		</>
	);
};

export default ThemeCustomizer;
