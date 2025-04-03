import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { SnackbarProvider } from "notistack";
import App from "@src/App";

// styles
import "./assets/css/app.css";

//react-redux
import { Provider } from "react-redux";
import { store } from "./store/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	// <StrictMode>
	<HelmetProvider>
		<Provider store={store}>
			<SnackbarProvider>
				<App />
			</SnackbarProvider>
		</Provider>
	</HelmetProvider>
	// </StrictMode>
);
