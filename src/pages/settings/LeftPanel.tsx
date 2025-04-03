import { Box, Card, Stack, Typography } from "@mui/material";
import { useDropdownMenu } from "@src/hooks";
import { getLeftbarTheme } from "@src/layouts/LeftSideBar/helpers";
import LogoBox from "@src/layouts/LeftSideBar/LogoBox";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { postRecentActivity } from "@src/store/system/system.action";
import { systemSelector } from "@src/store/system/system.slice";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import * as Icons from "@ant-design/icons";
import { IconBaseProps } from "react-icons";

const LeftPanel = () => {
	const dispatch = useAppDispatch();
	const { profileMenuItemsList } = useAppSelector((state) =>
		systemSelector(state)
	);
	const settings = useAppSelector((state) => selectLayoutTheme(state));

	const theme = useMemo(
		() => getLeftbarTheme(settings.sidenav.theme),
		[settings.sidenav.theme]
	);
	return (
		<>
			<Card sx={{ height: "100%", flex: 1 }}>
				<SimpleBar
					style={{ height: "100%", padding: 24, paddingTop: 6 }}>
					{/* <LogoBox /> */}
					<Box sx={{ mt: 2 }}>
						{profileMenuItemsList &&
							profileMenuItemsList.map((profilemenu, index) => {
								return (
									<Box key={index}>
										<Typography variant="h5">
											{profilemenu.label}
										</Typography>
										<Box
											sx={{
												my: 1,
											}}>
											{profilemenu &&
												profilemenu.children?.map(
													(item, i) => {
														const isSelected =
															location.pathname ===
															item.url;

														const IconComponent =
															Icons[
																item.icon as keyof typeof Icons
															] as
																| React.ComponentType<IconBaseProps>
																| undefined;
														return (
															<Link
																key={i}
																to={item.url!}
																target={
																	item.target
																}
																data-menu-key={
																	item.key
																}
																style={{
																	display:
																		"flex",
																	gap: "10px",
																	alignItems:
																		"center",
																	textDecoration:
																		"none",
																	color: "inherit",
																}}
																onClick={() => {
																	dispatch(
																		postRecentActivity(
																			{
																				menuitem_id:
																					item?.key ||
																					"",
																			}
																		)
																	);
																}}>
																<Stack
																	sx={(
																		theme
																	) => ({
																		display:
																			"flex",
																		flexDirection:
																			"row",
																		gap: 2,
																		ml: 0,
																		width: "100%",
																		lineHeight: 2,
																		p: 1,
																		// paddingLeft:
																		// 	isSelected
																		// 		? "20px"
																		// 		: "12px",
																		// paddingRight:
																		// 	isSelected
																		// 		? "20px"
																		// 		: "12px",
																		transition:
																			"all 0.3s",
																		borderRadius:
																			"5px",
																		backgroundColor:
																			isSelected
																				? "#E0EFFF"
																				: "",

																		color: isSelected
																			? theme
																					.palette
																					.common
																					.black
																			: "",
																	})}>
																	{IconComponent ? (
																		<IconComponent
																			style={{
																				fontSize: 16,
																			}}
																		/>
																	) : (
																		<Icons.QuestionOutlined
																			style={{
																				fontSize: 16,
																			}}
																		/> // Fallback if icon is not found
																	)}
																	<Typography variant="subtitle1">
																		{
																			item.label
																		}
																	</Typography>
																</Stack>
															</Link>
														);
													}
												)}
										</Box>
									</Box>
								);
							})}
					</Box>
				</SimpleBar>
			</Card>
		</>
	);
};

export default LeftPanel;
