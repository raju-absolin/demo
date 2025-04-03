import { Box, FilledInput, InputAdornment } from "@mui/material";
import { LuSearch } from "react-icons/lu";
import { styled } from "@mui/material";
import { WithSetting } from "@src/types";
import MenuToggler from "./MenuToggler";
import LayoutThemeToggler from "./LayoutThemeToggler";
import NotificationsDropdown from "./NotificationsDropdown";
import UserProfile from "./UserProfile";
import { useAppSelector } from "@src/store/store";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { NotificationSelector } from "@src/store/notifications/notification.slice";
import ThemeCustomizerToggler from "./ThemeCustomizerToggler";
import LogoBox from "../LeftSideBar/LogoBox";

const TopBarWrapper = styled("div")<WithSetting>(({ theme, settings }) => {
	return {
		backgroundColor: settings.themeColour.topnav
			? settings.themeColour.topnav
			: settings.topnav.theme == "light"
				? "#fff "
				: settings.topnav.theme == "dark"
					? "#212428"
					: "",
		color: settings.themeColour.topnav
			? theme.palette.common.white
			: settings.topnav.theme == "light"
				? theme.palette.common.black
				: theme.palette.common.white,
		// backgroundColor: theme.palette.background.paper,
		paddingInlineStart: "20px",
		paddingInlineEnd: "20px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		height: "70px",
		minHeight: "70px",
		borderRadius: 0,
		boxShadow: "0 1px 3px 0 rgb(0 0 0 / .1)",
		zIndex: 2,
		position: "sticky",
		top: 0,
	};
});

const Topbar = () => {
	const settings = useAppSelector((state) => selectLayoutTheme(state));
	const { notifications } = useAppSelector((state) =>
		NotificationSelector(state)
	);

	return (
		<TopBarWrapper
			settings={settings}
			className="topbar-header-do-not-remove">
			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
				<MenuToggler />

				<LogoBox backgroundColor />

				{/* <Box
					sx={{
						maxWidth: "203px",
						display: { xs: "none", md: "block" },
					}}>
					<FilledInput
						placeholder="Search"
						startAdornment={
							<InputAdornment position="end">
								<InputAdornment position="start">
									<LuSearch size={14} />
								</InputAdornment>
							</InputAdornment>
						}
						sx={{
							pl: 0,
							"&:hover": {
								borderBottom: 0,
							},
							"&:before": {
								borderBottom: 0,
							},
							"& > .MuiInputBase-input": {
								py: "8px",
							},
						}}
					/>
				</Box> */}
			</Box>

			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 1.5,
				}}
				alignItems={"center"}>
				<Box sx={{ display: { lg: "block", xs: "none" } }}>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1.5,
						}}>
						<NotificationsDropdown
							notifications={
								notifications &&
								notifications.map((e) => {
									return {
										id: e.id,
										text: e.subject,
										subText: e.body,
										createdAt: new Date(e.created_on),
									};
								})
							}
						/>
					</Box>
				</Box>
				{/* <ThemeCustomizerToggler /> */}
				<LayoutThemeToggler />
				<UserProfile />
			</Box>
		</TopBarWrapper>
	);
};

export default Topbar;
