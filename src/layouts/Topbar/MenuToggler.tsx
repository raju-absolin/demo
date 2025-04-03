import { Box, Button } from "@mui/material";
import {
	selectLayoutTheme,
	updateSidenav,
} from "@src/store/customise/customise";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { FaArrowRight } from "react-icons/fa6";
import { LuMenu } from "react-icons/lu";

const MenuToggler = () => {
	const dispatch = useAppDispatch();
	const settings = useAppSelector((state) => selectLayoutTheme(state));

	const showSideNavMobile = () => {
		dispatch(
			updateSidenav({ showMobileMenu: !settings.sidenav.showMobileMenu })
		);
	};

	return (
		<Box>
			<Box
				sx={{
					width: "35px",
					height: "35px",
					borderRadius: "5px",
					// border: "1px solid grey",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					"&:hover": {
						bgcolor: "#0000000d",
						transition: "transform 1s ease",
					},
				}}
				onClick={showSideNavMobile}>
				<LuMenu
					size={"20px"}
					style={{
						transform: settings?.sidenav?.showMobileMenu
							? "rotate(180deg)"
							: "rotate(0deg)",
						transition: "transform 0.5s ease",
					}}
				/>
			</Box>
		</Box>
	);
};

export default MenuToggler;
