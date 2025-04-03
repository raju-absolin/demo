import {
	Button,
	Collapse,
	FormControlLabel,
	FormGroup,
	Stack,
	Switch,
	Typography,
} from "@mui/material";
import { LayoutSidenav } from "@src/types";
import { Box } from "@mui/system";
import { LuMoon, LuSun } from "react-icons/lu";
import ColorPicker from "./ColourPicker";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	postUserPreferences,
	selectLayoutTheme,
	updateTheme,
	updateThemeColour,
} from "@src/store/customise/customise";
import { getThemeColorKey } from "@src/theme/palette";

type SidenavThemeProps = {
	handleChangeSidenavTheme: (value: LayoutSidenav["theme"]) => void;
	sidenavTheme: LayoutSidenav["theme"];
};

const SidenavThemeToggler = ({
	handleChangeSidenavTheme,
	sidenavTheme,
}: SidenavThemeProps) => {
	const dispatch = useAppDispatch();
	const settings = useAppSelector((state) => selectLayoutTheme(state));
	const [checked, setChecked] = useState(false);
	const handleColourChange = (colour: string) => {
		if (colour == "dark" || colour == "light") {
			// dispatch(updateTheme("dark"));
			handleChangeSidenavTheme(colour);
			dispatch(updateThemeColour({ leftSidenav: "" }));
			dispatch(
				postUserPreferences({
					user_id: "",
					body: {
						preferences: {
							...settings?.preferences,
							sidebar: {
								theme: colour,
								colour: "",
							},
						},
					},
				})
			);
		} else {
			const key = getThemeColorKey(colour);
			// dispatch(updateTheme(key));
			handleChangeSidenavTheme(
				(key as LayoutSidenav["theme"]) || "light"
			);
			dispatch(
				postUserPreferences({
					user_id: "",
					body: {
						preferences: {
							...settings?.preferences,
							sidebar: {
								theme:
									(key as LayoutSidenav["theme"]) || "light",
								colour: colour || "",
							},
						},
					},
				})
			);
			dispatch(updateThemeColour({ leftSidenav: colour }));
		}
	};

	console.log(settings?.themeColour?.leftSidenav);
	return (
		<>
			<div>
				<Typography variant={"subtitle2"} fontWeight={500}>
					Sidenav Theme
				</Typography>

				<Stack direction={"row"} gap={2} mt={1}>
					<Box
						sx={{
							border: 1,
							display: "inline-flex",
							p: 1.5,
							borderColor: "divider",
							borderRadius: 1,
							cursor: "pointer",
							"&:hover":
								sidenavTheme == "light"
									? {}
									: {
											backgroundColor: "grey.200",
											borderColor: "grey.200",
										},
							...(sidenavTheme == "light"
								? {
										backgroundColor: "primary.lighter",
										borderColor: "primary.lighter",
										color: "primary.darker",
									}
								: {}),
						}}
						onClick={() => {
							handleChangeSidenavTheme("light");
							handleColourChange("light");
						}}>
						<LuSun size={24} />
					</Box>
					<Box
						sx={{
							border: 1,
							display: "inline-flex",
							p: 1.5,
							borderColor: "divider",
							borderRadius: 1,
							cursor: "pointer",
							"&:hover":
								sidenavTheme == "dark"
									? {}
									: {
											backgroundColor: "grey.200",
											borderColor: "grey.200",
										},
							...(sidenavTheme == "dark"
								? {
										backgroundColor: "primary.lighter",
										borderColor: "primary.lighter",
										color: "primary.darker",
									}
								: {}),
						}}
						onClick={() => {
							handleChangeSidenavTheme("dark");
							handleColourChange("dark");
						}}>
						<LuMoon size={24} />
					</Box>
					<Box
						sx={{
							border: 1,
							display: "inline-flex",
							p: 1.5,
							borderColor: "divider",
							borderRadius: 1,
							cursor: "pointer",
							"&:hover":
								sidenavTheme == "dark"
									? {}
									: {
											borderColor: "grey.200",
										},
							...(sidenavTheme == "dark"
								? {
										borderColor: "primary.lighter",
									}
								: {}),
						}}
						onClick={() => {
							// handleChangeLayoutTheme("dark");
							setChecked(!checked);
						}}>
						<Button variant="contained">Customise</Button>
					</Box>
				</Stack>
				<Box my={checked ? 2 : 0}>
					<Collapse in={checked}>
						<ColorPicker
							handleColourChange={handleColourChange}
							selectedColour={settings?.themeColour?.leftSidenav}
						/>
					</Collapse>
				</Box>
			</div>
		</>
	);
};

export default SidenavThemeToggler;
