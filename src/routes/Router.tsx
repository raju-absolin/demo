import {
	BrowserRouter,
	Outlet,
	Route,
	Routes,
	type RouteProps,
} from "react-router-dom";

import ScrollToTop from "@src/components/ScrollToTop";
import DefaultLayout from "@src/layouts/DefaultLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import { defaultLayoutRoutes, verticalLayoutRoutes } from "./routes";
import { useState } from "react";

// Define the type for your routes
interface ChildRoute {
	path: string;
	element: JSX.Element;
}

const Router = (props: RouteProps) => {
	const [title, setTitle] = useState<string>("");
	const [subtitle, setSubtitle] = useState<string>("");
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Routes>
				{verticalLayoutRoutes.map((route: any, idx) => (
					<Route
						key={idx + (route.path ?? "")}
						path={route.path}
						{...props}
						element={
							<VerticalLayout>{route.element}</VerticalLayout>
						}>
						{route?.children?.map(
							(childroute: ChildRoute, i: number) => {
								return (
									<Route
										key={i + (childroute.path ?? "")}
										path={childroute.path}
										element={childroute.element}
									/>
								);
							}
						)}
					</Route>
				))}
				{defaultLayoutRoutes.map((route: any, idx) => (
					<Route
						key={idx + (route.path ?? "")}
						path={route.path}
						{...props}
						element={
							<DefaultLayout>{route.element}</DefaultLayout>
						}>
						{route?.children?.map(
							(childroute: ChildRoute, i: number) => {
								return (
									<Route
										key={i + (childroute.path ?? "")}
										path={childroute.path}
										element={childroute.element}
									/>
								);
							}
						)}
					</Route>
				))}
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
