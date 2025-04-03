/*
 * Copyright (c) 2023.
 * File Name: NotificationsDropdown.tsx
 * Author: Coderthemes
 */

import {
	Avatar,
	Badge,
	Box,
	Button,
	Divider,
	IconButton,
	List,
	Menu,
	MenuItem,
	MenuList,
	MenuProps,
	Typography,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { useDropdownMenu } from "@src/hooks";
import {
	LuBell,
	LuBellOff,
	LuCheckCircle,
	LuLoader,
	LuTrash2,
} from "react-icons/lu";

import { NotificationItem } from "./data";
import {
	Fragment,
	SyntheticEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import SimpleBar from "simplebar-react";
import { IconType } from "react-icons";
import {
	clearNotification,
	NotificationSelector,
	setOpenNotification,
} from "@src/store/notifications/notification.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	clearAllNotifications,
	fetchNotificationList,
	markNotificationRead,
} from "@src/store/notifications/notification.actions";
import moment from "moment";

type NotificationDropDownProps = {
	notifications: Array<NotificationItem>;
};

const ScrollableList = styled(List)(({ theme }) => ({
	maxHeight: "300px",
	marginTop: "15px",
	width: 450,
	overflowY: "auto",
	overflowX: "hidden",
	padding: "0 8px",
	"&::-webkit-scrollbar": {
		width: "8px",
	},
	"&::-webkit-scrollbar-thumb": {
		backgroundColor: theme.palette.primary.main,
		borderRadius: "8px",
	},
}));
const NotificationsDropdown = ({
	notifications,
}: NotificationDropDownProps) => {
	const { count, pageParams, openNotification, loading } = useAppSelector(
		(state) => NotificationSelector(state)
	);
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(
			fetchNotificationList({
				...pageParams,
				page: 1,
				page_size: 10,
			})
		);
	}, []);

	const anchorEl = useRef<null | HTMLElement>();

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
			anchorEl.current = event.currentTarget;
			dispatch(setOpenNotification(!openNotification));
		},
		[openNotification]
	);

	const handleClose = useCallback(() => {
		anchorEl.current = null;
		dispatch(setOpenNotification(false));
	}, [openNotification]);

	const unreadCount = count;
	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "right",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			{...props}
		/>
	))(({ theme }) => ({
		"& .MuiPaper-root": {
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 180,
			color:
				theme.palette.mode === "light"
					? "rgb(55, 65, 81)"
					: theme.palette.grey[300],
			boxShadow:
				"rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
			"& .MuiMenu-list": {
				padding: "4px 0",
			},
			"& .MuiMenuItem-root": {
				"& .MuiSvgIcon-root": {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				"&:active": {
					backgroundColor: alpha(
						theme.palette.primary.main,
						theme.palette.action.selectedOpacity
					),
				},
			},
		},
	}));

	const theme = useTheme();

	return (
		<>
			<IconButton
				onClick={handleClick}
				color={"inherit"}
				ref={anchorEl as any}>
				<Badge color="success" badgeContent={unreadCount}>
					<LuBell size={24} />
				</Badge>
			</IconButton>
			<StyledMenu
				id="demo-customized-menu"
				MenuListProps={{
					"aria-labelledby": "demo-customized-button",
				}}
				anchorEl={anchorEl.current}
				open={openNotification}
				onClose={handleClose}>
				<MenuList sx={{ py: 0 }}>
					<Box sx={{ p: "12px" }}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}>
							<Typography
								component={"h6"}
								sx={{ color: "grey.700" }}>
								Notification
							</Typography>
							{notifications.length != 0 && (
								<Typography
									sx={{
										fontSize: "12px",
										color: "grey.700",
										py: 0.5,
										px: 1,
										cursor: "pointer",
										"&:hover": {
											outline: `1px solid ${theme.palette.success.main}`,
											borderRadius: 5,
											background:
												theme.palette.success.main,
											color: "#ffffff",
										},
									}}
									onClick={() => {
										dispatch(clearAllNotifications());
									}}>
									Clear All
								</Typography>
							)}
						</Box>
					</Box>
					<Divider />
					<ScrollableList
						onScroll={(e: React.UIEvent<HTMLElement>) => {
							const { target } = e as any;
							if (
								Math.ceil(
									target?.scrollTop + target?.offsetHeight
								) == target?.scrollHeight
							) {
								if (pageParams.page < pageParams.no_of_pages) {
									dispatch(
										fetchNotificationList({
											...pageParams,
											page: pageParams?.page + 1,
											page_size: 10,
										})
									);
								}
							}
						}}>
						{notifications.length != 0 ? (
							notifications.map((notification, idx) => {
								const Icon: IconType | undefined =
									notification.icon;
								return (
									<MenuItem
										sx={{
											gap: 1,
											position: "relative",
											"&:hover": {
												"& .mail-options-menu": {
													insetInlineEnd: 0,
												},
											},
										}}
										key={idx}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
											}}>
											<Box sx={{ flexShrink: 0 }}>
												{notification.avatar ? (
													<Avatar
														variant="circular"
														sx={{
															height: "36px",
															width: "36px",
														}}
														src={
															notification.avatar
														}
													/>
												) : (
													<Box
														sx={{
															display: "flex",
															alignItems:
																"center",
															justifyContent:
																"center",
															height: "36px",
															width: "36px",
															bgcolor:
																"primary.main",
															borderRadius:
																"100%",
														}}>
														{Icon ? (
															<Icon color="white" />
														) : (
															<LuBell
																size={16}
																color="white"
															/>
														)}
													</Box>
												)}
											</Box>
											<Box
												sx={{
													flexGrow: 1,
													overflow: "hidden",
													whiteSpace: "normal",
													ml: "8px",
												}}>
												<Typography
													component={"h5"}
													sx={{
														mb: "4px",
														fontWeight: 500,
														color: "text.secondary",
													}}>
													{notification.text}
													<Typography
														component={"small"}
														sx={{
															ml: "4px",
															fontSize: "10px",
														}}>
														{moment(
															notification.createdAt
														).fromNow()}
													</Typography>
												</Typography>
												<Typography
													component={"small"}
													sx={{
														fontSize: "10px",
														color: "text.primary",
														whiteSpace: "pre-wrap",
													}}>
													{notification.subText}
												</Typography>
											</Box>
										</Box>
										<Box
											sx={{
												position: "absolute",
												top: 0,
												bottom: 0,
												insetInlineEnd: "-14rem",
												transitionProperty: "all",
												px: "8px",
												transitionTimingFunction:
													"cubic-bezier(0.4, 0, 0.2, 1)",
												transitionDuration: "150ms",
												backdropFilter: "blur(3px)",
												backgroundColor:
													"rgba(200,200,200,0.1)",
											}}
											className="mail-options-menu">
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													gap: "2px",
													height: "100%",
												}}>
												<IconButton
													onClick={() => {
														dispatch(
															markNotificationRead(
																{
																	notificationId:
																		notification?.id,
																	params: pageParams,
																}
															)
														);
													}}>
													<LuTrash2 />
												</IconButton>
											</Box>
										</Box>
									</MenuItem>
								);
							})
						) : loading ? (
							<Box textAlign={"center"} mt={"12px"}>
								<Button
									size="small"
									color="error"
									sx={{
										"& > svg": {
											"@keyframes spin": {
												from: {
													transform: "rotate(0deg)",
												},
												to: {
													transform: "rotate(360deg)",
												},
											},
										},
									}}
									startIcon={
										<LuLoader
											size={16}
											style={{
												marginRight: "6px",
												animation:
													"spin 1.5s linear infinite",
											}}
										/>
									}>
									Loading...
								</Button>
							</Box>
						) : (
							<Box
								display="flex"
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
								height="100%"
								textAlign="center"
								p={3}>
								<LuBellOff
									style={{
										fontSize: 80,
										color: "#9e9e9e",
										marginBottom: 16,
									}}
								/>
								<Typography
									variant="h6"
									color="textSecondary"
									gutterBottom>
									No Notifications
								</Typography>
								<Typography
									variant="body2"
									color="textSecondary"
									sx={{ mb: 3 }}>
									You're all caught up! Check back later for
									new notifications.
								</Typography>
							</Box>
						)}
						{loading && notifications.length != 0 && (
							<Box textAlign={"center"} mt={"12px"}>
								<Button
									size="small"
									color="error"
									sx={{
										"& > svg": {
											"@keyframes spin": {
												from: {
													transform: "rotate(0deg)",
												},
												to: {
													transform: "rotate(360deg)",
												},
											},
										},
									}}
									startIcon={
										<LuLoader
											size={16}
											style={{
												marginRight: "6px",
												animation:
													"spin 1.5s linear infinite",
											}}
										/>
									}>
									Loading...
								</Button>
							</Box>
						)}
						{notifications.length != 0 &&
							notifications.length == count && (
								<Box
									display="flex"
									flexDirection="column"
									alignItems="center"
									justifyContent="center"
									textAlign="center"
									p={3}
									color="text.secondary">
									<Divider sx={{ width: "100%", mb: 2 }} />
									<LuCheckCircle
										style={{
											fontSize: 50,
											color: "#9e9e9e",
											marginBottom: 8,
										}}
									/>
									<Typography variant="body1" sx={{ mb: 1 }}>
										You've reached the end
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary">
										There are no more records to display.
									</Typography>
								</Box>
							)}
					</ScrollableList>
				</MenuList>
			</StyledMenu>
		</>
	);
};

export default NotificationsDropdown;
