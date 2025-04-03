import { Box, Container, LinearProgress, styled } from "@mui/material";
import { useAppDispatch } from "@src/store/store";
import { getUserPermissions } from "@src/store/system/system.action";
import { Suspense, lazy, useEffect, type ReactNode } from "react";
import RightSideBar from "./RightSideBar";
import { getUserPreferences } from "@src/store/customise/customise";

const LeftSideBar = lazy(() => import("@src/layouts/LeftSideBar"));
// const RightSideBar = lazy(() => import("@src/layouts/RightSideBar"));
const Topbar = lazy(() => import("@src/layouts/Topbar"));
// const Footer = lazy(() => import("@src/layouts/Footer"));

const ContentWrapper = styled("div")(({ theme }) => {
	return {
		backgroundColor: theme.palette.background.default,
		padding: "20px",
		paddingTop: 0,
		height: "100%",
	};
});

const VerticalLayout = ({ children }: { children: ReactNode }) => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getUserPermissions());
		dispatch(getUserPreferences());
	}, []);
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}>
			<Suspense fallback={<div />}>
				<Topbar />
			</Suspense>

			<div
				style={{
					display: "flex",
					flex: 1,
					height: "calc(100vh - 70px)",
				}}>
				<Suspense fallback={<div />}>
					<LeftSideBar />
				</Suspense>
				<div
					style={{
						flexDirection: "column",
						display: "flex",
						width: "100%",
					}}>
					<ContentWrapper>
						<Suspense
							fallback={
								<LinearProgress
									color="primary"
									sx={{ width: "110%", marginLeft: -3 }}
								/>
							}>
							{children}
						</Suspense>
					</ContentWrapper>

					<Suspense fallback={<div />}>
						<RightSideBar />
					</Suspense>
				</div>
			</div>
		</div>
	);
};

export default VerticalLayout;
