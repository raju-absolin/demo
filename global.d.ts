import { SimplePaletteColorOptions } from "@mui/material";

declare module "path";

declare module "@mui/system/createTheme" {
	interface BreakpointOverrides {
		xxl: true;
	}
}

declare module "@mui/material/styles" {
	interface PaletteOptions {
		light?: SimplePaletteColorOptions;
		dark?: SimplePaletteColorOptions;
	}
}
declare module "@mui/material/MenuItem/MenuItem.d.ts" {
	interface AdditionalProps {
		name: string;
	}
}

declare global {
	interface Window {
		BaseURL?: string;
	}
}
