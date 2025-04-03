import { Drawer } from "@mui/material";
import ThemeCustomizer from "./ThemeCustomizer";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	selectLayoutTheme,
	updateShowRightsideBar,
} from "@src/store/customise/customise";

const RightSideBar = () => {
	const dispatch = useAppDispatch();
	const settings = useAppSelector((state) => selectLayoutTheme(state));
	const { showRightsideBar } = settings;

	return (
		<Drawer
			anchor={"right"}
			open={showRightsideBar}
			onClose={() => dispatch(updateShowRightsideBar(false))}
			PaperProps={{
				sx: {
					width: "288px",
				},
			}}>
			<ThemeCustomizer />
		</Drawer>
	);
};

export default RightSideBar;
