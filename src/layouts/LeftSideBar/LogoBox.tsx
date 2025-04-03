import { Link } from "react-router-dom";

import logo from "@src/assets/images/Logo.svg";
import logoWhite from "@src/assets/images/svg/Logo_white.svg";
import { styled } from "@mui/system";
import { WithSetting } from "@src/types";
import { useAppSelector } from "@src/store/store";
import { selectLayoutTheme } from "@src/store/customise/customise";

const LogoBox = ({
	defaultTheme,
	backgroundColor,
}: {
	defaultTheme?: "light" | "dark";
	backgroundColor?: boolean;
}) => {
	const settings = useAppSelector((state) => selectLayoutTheme(state));

	const {
		topnav: { theme },
	} = settings;

	const LogoBoxWrapper = styled("div")<WithSetting>(({ settings }) => {
		return {
			// backgroundColor: settings.themeColour.topnav
			// 	? settings.themeColour.topnav
			// 	: settings.sidenav.theme == "light"
			// 		? "#fff "
			// 		: "#212428",
			height: "70px",
			// position: "sticky",
			// top: 0,
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			// zIndex: 2,
		};
	});

	return (
		<LogoBoxWrapper settings={settings}>
			<Link
				to="/"
				style={{
					justifyContent: "center",
					display: "flex",
				}}>
				<img
					src={(defaultTheme ?? theme) == "light" ? logo : logoWhite}
					height={35}
					width={100}
				/>
			</Link>
		</LogoBoxWrapper>
	);
};

export default LogoBox;
