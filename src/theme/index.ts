import { createTheme as muiCreateTheme } from "@mui/material";

import componentOverrides from "@src/theme/components";
import gridTheme from "@src/theme/grid";
import paletteTheme from "@src/theme/palette";
import shadowTheme from "@src/theme/shadow";
import typographyTheme from "@src/theme/typography";
import { ThemeOptions } from "@mui/material/styles/createTheme";
import { LayoutState } from "@src/types";

const createTheme = (theme: LayoutState["theme"]) => {
	const themeOption: Partial<ThemeOptions> = {
		palette: paletteTheme(theme),
		typography: typographyTheme(),
		breakpoints: gridTheme() as any,
		shape: {
			borderRadius: 4,
		},
		spacing: 8,
		shadows: shadowTheme(theme),
		zIndex: {
			appBar: 1100,
			drawer: 1200,
		},
	};

	return muiCreateTheme({
		...themeOption,
		components: componentOverrides(themeOption),
	});
};

export { createTheme };
