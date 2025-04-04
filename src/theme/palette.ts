import { darken, lighten, Palette } from "@mui/material";
import { PaletteOptions } from "@mui/material/styles/createPalette";

export const themeColours = {
	// white: "#fff",
	// black: "#212428",
	red: "#9E1421",
	green: "#0E484C",
	blue: "#453DBF",
	yellow: "#A3793C",
};

export const getThemeColorKey = (value: string): string | undefined => {
	return Object.keys(themeColours).find(
		(key) => themeColours[key as keyof typeof themeColours] === value
	);
};

export const getColorVariants = (color: string, contrastText: string) => {
	return {
		lighter: lighten(color, 0.6),
		light: lighten(color, 0.35),
		main: color,
		dark: darken(color, 0.35),
		darker: darken(color, 0.6),
		contrastText: contrastText,
	};
};

const paletteTheme = (
	themeMode: "light" | "dark" | keyof typeof themeColours
): PaletteOptions => {
	//Light Palette
	let palette: PaletteOptions = {
		mode: "light",
		tonalOffset: 0.2,
		contrastThreshold: 3,
		common: {
			white: "#fff",
			black: "#000",
		},
		grey: {
			50: "#f8f8f8",
			100: "#f4f6fa",
			200: "#eaecf0",
			300: "#dee2e6",
			400: "#ced4da",
			500: "#aab8c5",
			600: "#818e9e",
			700: "#444d57",
			800: "#3f4650",
			900: "#3a444b",
			A100: "#f1f1f1",
			A200: "#e3eaef",
			A400: "#ced4da",
			A700: "#444d57",
		},
		primary: getColorVariants("#0056D2", "#fff"),
		secondary: getColorVariants("#6c757d", "#fff"),
		success: getColorVariants("#26c362", "#fff"),
		info: getColorVariants("#3FC6FC", "#fff"),
		warning: getColorVariants("#fdb906", "#fff"),
		error: getColorVariants("#ff0a0a", "#fff"),
		light: getColorVariants("#eef2f7", "#6c757d"),
		dark: getColorVariants("#313a46", "#fff"),
		background: {
			paper: "#fff",
			default: "#f2f4f7",
		},
		action: {},
		text: {
			primary: "#001930",
			secondary: "#50555c",
			disabled: "#82878c",
		},
		divider: "#dee2e6",
	};

	// dark
	if (themeMode == "dark") {
		palette = {
			...palette,
			mode: "dark",
			grey: {
				50: "#23282d",
				100: "#2d3741",
				200: "#3f4650",
				300: "#444d57",
				400: "#818e9e",
				500: "#aab8c5",
				600: "#ced4da",
				700: "#dee2e6",
				800: "#e3eaef",
				900: "#f1f1f1",
				A100: "#3a444b",
				A200: "#3f4650",
				A400: "#818e9e",
				A700: "#dee2e6",
			},
			primary: getColorVariants("#0056D2", "#fff"),
			secondary: getColorVariants("#6c757d", "#fff"),
			success: getColorVariants("#26c362", "#fff"),
			info: getColorVariants("#3FC6FC", "#fff"),
			warning: getColorVariants("#fdb906", "#fff"),
			error: getColorVariants("#ff0a0a", "#fff"),
			light: getColorVariants("#464f5b", "#f1f1f1"),
			dark: getColorVariants("#f1f1f1", "#000"),
			background: {
				paper: "#1e2328",
				default: "#171c21",
			},
			text: {
				primary: "#ebedf0",
				secondary: "#c8c8c8",
				disabled: "#8c9196",
			},
			divider: "#3d454f",
		};
	}

	// dark
	if (themeColours[themeMode as keyof typeof themeColours]) {
		palette = {
			...palette,
			mode: "light",
			tonalOffset: 0.2,
			contrastThreshold: 3,
			common: {
				white: "#fff",
				black: "#000",
			},
			grey: {
				50: "#f8f8f8",
				100: "#f4f6fa",
				200: "#eaecf0",
				300: "#dee2e6",
				400: "#ced4da",
				500: "#aab8c5",
				600: "#818e9e",
				700: "#444d57",
				800: "#3f4650",
				900: "#3a444b",
				A100: "#f1f1f1",
				A200: "#e3eaef",
				A400: "#ced4da",
				A700: "#444d57",
			},
			primary: getColorVariants("#0056D2", "#fff"),
			secondary: getColorVariants("#6c757d", "#fff"),
			success: getColorVariants("#26c362", "#fff"),
			info: getColorVariants("#3FC6FC", "#fff"),
			warning: getColorVariants("#fdb906", "#fff"),
			error: getColorVariants("#ff0a0a", "#fff"),
			light: getColorVariants("#eef2f7", "#6c757d"),
			dark: getColorVariants("#313a46", "#fff"),
			background: {
				paper: "#fff",
				default: "#f2f4f7",
			},
			action: {},
			text: {
				primary: "#001930",
				secondary: "#50555c",
				disabled: "#82878c",
			},
			divider: "#dee2e6",
		};
	}

	return palette;
};

export default paletteTheme;
