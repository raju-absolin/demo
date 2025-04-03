import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Drawer,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
	Grid2 as Grid,
} from "@mui/material";
import { PageBreadcrumb } from "@src/components";
import LeftPanel from "./LeftPanel";
import { LuLayoutGrid, LuList, LuMenu, LuSearch } from "react-icons/lu";
import { useToggle, useViewPort } from "@src/hooks";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { getMenuItems } from "@src/store/system/system.action";
import {
	BrowserRouter,
	createBrowserRouter,
	Outlet,
	Route,
	RouterProvider,
	Routes,
	useLocation,
} from "react-router-dom";
import LogoBox from "@src/layouts/LeftSideBar/LogoBox";

const SettingsHomeComponent = () => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				flex: 1,
			}}>
			<LogoBox />
			<Typography variant="h4"> Welcome To Admin Settings</Typography>
			<Typography variant="subtitle2" align="center">
				Please Click On Menu
			</Typography>
		</Box>
	);
};
const Settings = () => {
	const { width } = useViewPort();
	const { isOpen, hide, toggleOpen } = useToggle();
	const dispatch = useAppDispatch();
	const location = useLocation();
	const [title, setTitle] = useState<string>("Settings");
	const [subtitle, setSubtitle] = useState<string>("Admin");

	const showMobileMenu = useAppSelector(
		(state) => state.customise.sidenav.showMobileMenu
	);

	useEffect(() => {
		dispatch(getMenuItems({ from: "profilemenu", code: "MENU0008" }));
	}, []);
	useEffect(() => {
		if (location.pathname === "/pages/settings") {
			setTitle("Settings");
			setSubtitle("Admin");
		}
	}, [location]);
	return (
		<Box
			sx={{
				my: 2,
				//  height: "calc(100vh - 70px)"
			}}>
			{/* <PageBreadcrumb title={title} subName={subtitle} /> */}

			<Grid container spacing={2}>
				<Grid
					size={{
						xs: 12,
						lg: 3.3,
						xl: showMobileMenu ? 2.3 : 2.7,
					}}
					sx={{
						display: {
							lg: "block",
							xs: "none",
						},
						// maxWidth: "288px",
					}}>
					<LeftPanel />
				</Grid>
				<Grid
					size={{
						xs: 12,
						lg: 8.7,
						xl: showMobileMenu ? 9.7 : 9.3,
					}}>
					<Card
						sx={{
							display: {
								lg: "none",
								xs: "block",
							},
						}}>
						<Box>
							<IconButton
								onClick={() => {
									toggleOpen();
								}}>
								<LuMenu size={20} />
							</IconButton>

							<Drawer
								open={isOpen}
								onClose={hide}
								sx={{
									width: 288,
									"& .MuiDrawer-paper": { width: 288 },
								}}>
								<LeftPanel />
							</Drawer>
						</Box>
					</Card>

					<Card
						sx={{
							// p: "8px",

							mt: {
								xs: 2,
								lg: 0,
							},
							height: "100%",
						}}>
						<CardContent>
							{location.pathname === "/pages/settings" && (
								<>
									<Box
										sx={{
											display: "grid",
											placeContent: "center",
											height: "100%",
										}}>
										<SettingsHomeComponent />
									</Box>
								</>
							)}
							<Box>
								<Outlet
									context={{
										title,
										setTitle,
										subtitle,
										setSubtitle,
									}}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Settings;
