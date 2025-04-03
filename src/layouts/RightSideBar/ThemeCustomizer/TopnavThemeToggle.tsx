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

type TopnavThemeProps = {
	handleChangeTopnavTheme: (value: LayoutSidenav["theme"]) => void;
	topnavTheme: LayoutSidenav["theme"];
};

const TopnavThemeToggler = ({
	handleChangeTopnavTheme,
	topnavTheme,
}: TopnavThemeProps) => {
	const settings = useAppSelector((state) => selectLayoutTheme(state));
	const [checked, setChecked] = useState(false);
	const dispatch = useAppDispatch();

	const handleColourChange = (colour: string) => {
		if (colour == "dark" || colour == "light") {
			// dispatch(updateTheme("dark"));
			handleChangeTopnavTheme(colour);
			dispatch(updateThemeColour({ topnav: "" }));
			dispatch(
				postUserPreferences({
					user_id: "",
					body: {
						preferences: {
							...settings?.preferences,
							topbar: {
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

			handleChangeTopnavTheme((key as LayoutSidenav["theme"]) || "light");
			dispatch(
				postUserPreferences({
					user_id: "",
					body: {
						preferences: {
							...settings?.preferences,
							topbar: {
								theme:
									(key as LayoutSidenav["theme"]) || "light",
								colour: colour || "",
							},
						},
					},
				})
			);

			dispatch(updateThemeColour({ topnav: colour }));
		}
	};
	return (
		<>
			<div>
				<Typography variant={"subtitle2"} fontWeight={500}>
					Topnav Theme
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
								topnavTheme == "light"
									? {}
									: {
											backgroundColor: "grey.200",
											borderColor: "grey.200",
										},
							...(topnavTheme == "light"
								? {
										backgroundColor: "primary.lighter",
										borderColor: "primary.lighter",
										color: "primary.darker",
									}
								: {}),
						}}
						onClick={() => {
							handleChangeTopnavTheme("light");
							handleColourChange("");
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
								topnavTheme == "dark"
									? {}
									: {
											backgroundColor: "grey.200",
											borderColor: "grey.200",
										},
							...(topnavTheme == "dark"
								? {
										backgroundColor: "primary.lighter",
										borderColor: "primary.lighter",
										color: "primary.darker",
									}
								: {}),
						}}
						onClick={() => {
							handleChangeTopnavTheme("dark");
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
								topnavTheme == "dark"
									? {}
									: {
											borderColor: "grey.200",
										},
							...(topnavTheme == "dark"
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
							selectedColour={settings?.themeColour?.topnav}
						/>
					</Collapse>
				</Box>
			</div>
		</>
	);
};

export default TopnavThemeToggler;
