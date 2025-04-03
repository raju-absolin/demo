import { IconButton } from "@mui/material";
import {
	postUserPreferences,
	selectLayoutTheme,
	updateTheme,
	updateThemeColour,
} from "@src/store/customise/customise";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { getThemeColorKey } from "@src/theme/palette";
import { LuMoon, LuSunMedium } from "react-icons/lu";

const LayoutThemeToggler = () => {
	const dispatch = useAppDispatch();
	const settings = useAppSelector((state) => selectLayoutTheme(state));

	return (
		<IconButton
			color={"inherit"}
			onClick={() => {
				dispatch(
					updateTheme(
						settings?.themeMode == "light" ? "dark" : "light"
					)
				);
				dispatch(updateThemeColour({ leftSidenav: "", topnav: "" }));
				dispatch(
					postUserPreferences({
						user_id: "",
						body: {
							preferences: {
								...settings?.preferences,
								theme:
									settings?.themeMode == "light"
										? "dark"
										: "light",
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
			}}>
			{settings?.themeMode == "light" ? <LuMoon /> : <LuSunMedium />}
		</IconButton>
	);
};

export default LayoutThemeToggler;
