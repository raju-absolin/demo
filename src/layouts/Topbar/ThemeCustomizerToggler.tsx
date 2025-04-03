/*
 * Copyright (c) 2023.
 * File Name: ThemeCustomizerToggler.tsx
 * Author: Coderthemes
 */

import { IconButton } from "@mui/material";
import {
	selectLayoutTheme,
	updateShowRightsideBar,
} from "@src/store/customise/customise";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { LuSettings } from "react-icons/lu";

const ThemeCustomizerToggler = () => {
	const dispatch = useAppDispatch();
	const settings = useAppSelector((state) => selectLayoutTheme(state));
	const { showRightsideBar } = settings;

	const handleRightsideBar = () => {
		dispatch(updateShowRightsideBar(!showRightsideBar));
	};

	return (
		<>
			<IconButton color={"inherit"} onClick={handleRightsideBar}>
				<LuSettings />
			</IconButton>
		</>
	);
};

export default ThemeCustomizerToggler;
