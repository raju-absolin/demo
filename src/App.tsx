import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import Router from "@src/routes/Router";
import { createTheme } from "@src/theme";
import { useAppSelector } from "./store/store";
import { selectLayoutTheme } from "./store/customise/customise";
import { pickersDayClasses } from "@mui/lab";
const App = () => {
	const settings = useAppSelector((state) => selectLayoutTheme(state));

	return (
		<>
		  <StyledEngineProvider injectFirst>
	            <ThemeProvider theme={createTheme(settings.theme)}>
			<Router />
		    </ThemeProvider>
		 </StyledEngineProvider>
		</>
	);
};

export default App;
