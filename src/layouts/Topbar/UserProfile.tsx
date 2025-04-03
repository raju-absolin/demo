import {
	Avatar,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	FormControl,
	FormControlLabel,
	Grid2 as Grid,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	MenuList,
	MenuProps,
	Modal,
	Radio,
	RadioGroup,
	Stack,
	SvgIconProps,
	Typography,
} from "@mui/material";
import {
	LuHeartHandshake,
	LuLock,
	LuLogOut,
	LuSettings,
	LuUserCircle2,
} from "react-icons/lu";
import { useDropdownMenu } from "@src/hooks";
import { Link, useNavigate } from "react-router-dom";
import { IconType } from "react-icons";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	LayoutThemeMode,
	selectLayoutTheme,
	updateShowRightsideBar,
} from "@src/store/customise/customise";
import { styled, alpha } from "@mui/material/styles";

import avatar2 from "@src/assets/images/avatars/avatar2.png";
import UserProfileIcon from "@src/assets/images/svg/person.svg";
import ImportData from "@src/assets/images/svg/import.svg";
import Trash from "@src/assets/images/svg/trash.svg";
import Teams from "@src/assets/images/svg/teams.svg";
import Developers from "@src/assets/images/svg/developers.svg";
import Automation from "@src/assets/images/svg/automitions.svg";
import Logout from "@src/assets/images/svg/logout.svg";
import backArrow from "@src/assets/images/svg/arrow-back.svg";
import ArchiveIcon from "@src/assets/images/svg/archive.svg";
import AppIcon from "@src/assets/images/svg/app.svg";
import ChangeTheme from "@src/assets/images/svg/changeTheme.svg";
import HelpIcon from "@src/assets/images/svg/help.svg";
import Invite from "@src/assets/images/svg/invite.svg";
import ShortCut from "@src/assets/images/svg/shortcut.svg";
import MobileIcon from "@src/assets/images/svg/mobile.svg";
//Accounts White Icons
import userWhite from "@src/assets/images/svg/whiteIcons/personLight.svg";
import importWhite from "@src/assets/images/svg/whiteIcons/importWhite.svg";
import trashWhite from "@src/assets/images/svg/whiteIcons/trashWhite.svg";
import teamsWhite from "@src/assets/images/svg/whiteIcons/TeamsWhite.png";
import automationWhite from "@src/assets/images/svg/whiteIcons/automationWhite.svg";
import developersWhite from "@src/assets/images/svg/whiteIcons/developersWhite.svg";
import settingsWhite from "@src/assets/images/svg/whiteIcons/settingsWhite.svg";
import logoutWhite from "@src/assets/images/svg/whiteIcons/LogoutWhite.svg";
import archiveWhite from "@src/assets/images/svg/whiteIcons/archiveWhite.png";
//Explore White Icons
import appWhite from "@src/assets/images/svg/whiteIcons/appMarketWhite.svg";
import mobileWhite from "@src/assets/images/svg/whiteIcons/mobileWhite.svg";
import shortcutWhite from "@src/assets/images/svg/whiteIcons/shortcutWhite.svg";
import invitrWhite from "@src/assets/images/svg/whiteIcons/inviteWhite.svg";
import helpWhite from "@src/assets/images/svg/whiteIcons/helpWhite.svg";
import changeThemeWhite from "@src/assets/images/svg/whiteIcons/changeThemeWhite.svg";
import InfoIcon from "@mui/icons-material/Info";

import {
	AccountCircleOutlined,
	SettingsOutlined,
	GroupOutlined,
	SvgIconComponent,
} from "@mui/icons-material";
import { removeToken } from "@src/helpers/AxiosHelper";
import { logout } from "@src/store/auth/auth.action";
import { useState } from "react";

type ProfileDropdownOption = {
	image: string;
	icon?: SvgIconComponent;
	label: string;
	link?: string;
	handleClick?: () => void;
};

type Fields = {
	Accounts: ProfileDropdownOption[];
	Explore: ProfileDropdownOption[];
	ExploreTwo: ProfileDropdownOption[];
}[];

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
		padding: "0.5rem",
		borderRadius: 6,
		width: "380px",
		marginTop: theme.spacing(1),
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

const UserProfile = () => {
	const dispatch = useAppDispatch();
	const settings = useAppSelector((state) => selectLayoutTheme(state));
	const { showRightsideBar } = settings;
	const navigate = useNavigate();

	const { theme }: LayoutThemeMode = settings;
	const [modalVisible, setModalVisible] = useState(false);

	const { anchorEl, open, handleClick, handleClose } = useDropdownMenu();

	const Accounts: ProfileDropdownOption[] = [
		{
			icon: AccountCircleOutlined,
			label: "My Account",
			image: "",
			link: "/pages/settings/view-profile",
		},
		{
			icon: SettingsOutlined,
			label: "Settings",
			image: "",
			link: "/pages/settings",
		},
		{
			icon: GroupOutlined,
			label: "Masters",
			image: "",
			link: "/pages/masters",
		},
		{
			image: theme === "light" ? ImportData : importWhite,
			link: "/pages/settings/import-csv",
			label: "Import Data",
		},
		// {
		// 	image: theme === "light" ? Automation : automationWhite,
		// 	label: "Automation",
		// },
		// {
		// 	image: theme === "light" ? Developers : developersWhite,
		// 	label: "Developers",
		// },
		// {
		// 	image: theme === "light" ? Trash : trashWhite,
		// 	label: "Trash",
		// },
		// {
		// 	image: theme === "light" ? ArchiveIcon : archiveWhite,
		// 	label: "Archive",
		// },
		// {
		// 	icon: SettingsOutlined,
		// 	label: "Administration",
		// 	image: "",
		// },
		// {
		// 	image: theme === "light" ? Teams : teamsWhite,
		// 	label: "Teams",
		// },
		{
			image: theme === "light" ? Logout : logoutWhite,
			label: "Log out",
			handleClick: () => {
				setModalVisible(true);
			},
		},
	];

	const Explore: ProfileDropdownOption[] = [
		{
			image: theme === "light" ? AppIcon : appWhite,
			label: "App Marketplace",
		},
		{
			image: theme === "light" ? MobileIcon : mobileWhite,
			label: "Mobile app",
		},
		{
			image: theme === "light" ? ShortCut : shortcutWhite,
			label: "shortcuts",
		},
	];

	const ExploreTwo: ProfileDropdownOption[] = [
		// {
		// 	image: theme === "light" ? Invite : invitrWhite,
		// 	label: "Invite members",
		// },
		// {
		// 	image: theme === "light" ? HelpIcon : helpWhite,
		// 	label: "Get Help",
		// },
		{
			image: theme === "light" ? ChangeTheme : changeThemeWhite,
			label: "Change theme",
			handleClick: () => {
				dispatch(updateShowRightsideBar(!showRightsideBar));
			},
		},
	];

	const profileDropdownOptions: Fields = [
		{
			Accounts: Accounts,
			Explore: Explore,
			ExploreTwo: ExploreTwo,
		},
	];
	return (
		<>
			<Box
				sx={{
					cursor: "pointer",
					gap: 1,
					alignItems: "center",
					display: "flex",
					height: "100%",
					width: "auto",
				}}>
				<Box
					onClick={handleClick}
					sx={{
						paddingX: "8px",
						display: "flex",
						alignItems: "center",
						// width: "180px",
						// borderLeft: 1,
						// borderRight: 1,
						// borderColor: theme == "dark" ? "#374151" : "divider",
						height: "70px",
						// color:
						// 	settings?.topnav?.theme == "dark" ||
						// 	settings?.topnav?.theme == "light"
						// 		? ""
						// 		: "black",
						// backgroundColor:
						// 	settings?.topnav?.theme == "dark" ||
						// 	settings?.topnav?.theme == "light"
						// 		? "#0000000d"
						// 		: "#FFFFFF",

						justifyContent: "center",
						gap: 2,
					}}>
					<Avatar alt="avatar" sx={{ height: 32, width: 32 }} />
					<div>
						<Typography variant="subtitle2">
							{localStorage.getItem("username")}
						</Typography>
						<Typography variant="caption">
							{localStorage.getItem("User_full_name")}
						</Typography>
					</div>
				</Box>
				<StyledMenu
					id="demo-customized-menu"
					MenuListProps={{
						"aria-labelledby": "demo-customized-button",
					}}
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					slotProps={{
						paper: {
							elevation: 0,
							sx: {
								overflow: "visible",
								filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
								mt: 1.5,
								"& .MuiAvatar-root": {
									width: 32,
									height: 32,
									ml: -0.5,
									mr: 1,
								},
								"&:before": {
									content: '""',
									display: "block",
									position: "absolute",
									top: 0,
									right: 14,
									width: 10,
									height: 10,
									bgcolor: "background.paper",
									transform: "translateY(-50%) rotate(45deg)",
									zIndex: 0,
								},
							},
						},
					}}>
					{/* {profileDropdownOptions.map((option, idx) => {
						const Icon = option.icon;
						return (
							<MenuItem onClick={handleClose} key={idx}>
								<ListItemIcon>
									<Icon size={18} />
								</ListItemIcon>
								{option.link ? (
									<Link to={option.link}>
										<ListItemText
											sx={{ color: "text.secondary" }}>
											{option.label}
										</ListItemText>
									</Link>
								) : (
									<ListItemText
										sx={{ color: "text.secondary" }}>
										{option.label}
									</ListItemText>
								)}
							</MenuItem>
						);
					})} */}

					<Grid container sx={{ pt: 2 }} spacing={2}>
						<Grid
							size={{
								xs: 6,
								// md: 7,
							}}>
							<Typography
								sx={{
									color: "text.secondary",
									fontSize: "14px",
									fontWeight: "bold",
									paddingX: 2,
									mb: 2,
								}}
								variant="h6">
								Account
							</Typography>
							<Grid container spacing={1}>
								{Accounts &&
									Accounts.map((option, idx) => {
										const Icon = option.icon;
										return (
											<Grid
												key={idx}
												size={{
													xs: 12,
												}}>
												<MenuItem
													key={idx}
													onClick={(event) => {
														if (option.link) {
															navigate(
																option.link
															);
														} else {
															if (
																option.handleClick
															) {
																event.preventDefault();
																option.handleClick();
															}
														}
														handleClose();
													}}>
													<Stack
														direction={"row"}
														spacing={0}>
														<ListItemIcon>
															{Icon ? (
																<Icon />
															) : (
																<img
																	src={
																		option.image
																	}
																/>
															)}
														</ListItemIcon>
														<ListItemText
															sx={{
																color: "text.secondary",
															}}>
															{option.label}
														</ListItemText>
													</Stack>
												</MenuItem>
											</Grid>
										);
									})}
							</Grid>
						</Grid>
						<Grid
							size={{
								xs: 6,
								// md: 5,
							}}>
							<Box>
								<Typography
									sx={{
										color: "text.secondary",
										fontSize: "14px",
										fontWeight: "bold",
										paddingX: 2,
										mb: 2,
									}}
									variant="h6">
									Explore
								</Typography>
								{/* <Grid container spacing={1}>
									{Explore &&
										Explore.map((option, idx) => {
											return (
												<Grid
													key={idx}
													size={{
														xs: 12,
													}}>
													<MenuItem
														onClick={(event) => {
															if (option.link) {
																navigate(
																	option.link
																);
															} else {
																if (
																	option.handleClick
																) {
																	event.preventDefault();
																	option.handleClick();
																}
															}
															handleClose();
														}}
														key={idx}>
														<ListItemIcon>
															<img
																src={
																	option.image
																}
															/>
														</ListItemIcon>

														<ListItemText
															sx={{
																color: "text.secondary",
																wordBreak:
																	"break-all",
															}}>
															{option.label}
														</ListItemText>
													</MenuItem>
												</Grid>
											);
										})}
								</Grid> */}
							</Box>

							{/* <Box sx={{ paddingLeft: 2 }}>
								<Divider
									sx={{
										my: 2,
									}}
								/>
							</Box> */}
							<Grid container spacing={1}>
								{ExploreTwo &&
									ExploreTwo.map((option, idx) => {
										return (
											<Grid
												key={idx}
												size={{
													xs: 12,
												}}>
												<MenuItem
													onClick={(event) => {
														if (option.link) {
															navigate(
																option.link
															);
														} else {
															if (
																option.handleClick
															) {
																event.preventDefault();
																option.handleClick();
															}
														}
														handleClose();
													}}
													key={idx}>
													<ListItemIcon>
														<img
															src={option.image}
														/>
													</ListItemIcon>

													<ListItemText
														sx={{
															color: "text.secondary",
														}}>
														{option.label}
													</ListItemText>
												</MenuItem>
											</Grid>
										);
									})}
							</Grid>
						</Grid>
					</Grid>

					{/* <Divider
						sx={{
							my: 2,
						}}
					/> */}
					{/* <Box sx={{ px: 2 }}>
						<Typography variant="h6">Working Status</Typography>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<Box
								sx={{
									display: "flex",
									gap: 2,
									marginTop: 1.5,
									alignItems: "center",
									paddingLeft: 0,
								}}>
								<img
									src={
										theme === "light"
											? UserProfileIcon
											: userWhite
									}
								/>

								<Typography> Do not disturb</Typography>
							</Box>
							<Box sx={{ marginTop: 1.5 }}>
								<FormControl>
									<RadioGroup
										row
										aria-labelledby="demo-row-radio-buttons-group-label"
										name="row-radio-buttons-group">
										<FormControlLabel
											value="female"
											control={<Radio />}
											label="On"
										/>
										<FormControlLabel
											value="male"
											control={<Radio />}
											label="Off"
										/>
									</RadioGroup>
								</FormControl>
							</Box>
							<Box
								sx={{
									display: "flex",
									gap: 1,
									marginTop: 1.5,
									alignItems: "center",
								}}>
								<ListItemText>More</ListItemText>

								<img src={backArrow} />
							</Box>
						</Box>
					</Box> */}
				</StyledMenu>
			</Box>
			<Dialog
				open={modalVisible}
				onClose={handleClose}
				maxWidth="sm"
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogContent
					sx={{
						px: "24px",
						pt: "12px !important",
						pb: 0,
						p: 3,
						paddingTop: 2,
					}}>
					<DialogContentText
						id="alert-dialog-description"
						sx={{
							width: 500,
						}}>
						<Typography
							variant="h5"
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								cursor: "pointer",
							}}>
							<IconButton aria-label="info">
								<InfoIcon color="primary" />
							</IconButton>
							Are you sure want logout?
						</Typography>
						<DialogActions sx={{ p: 2 }}>
							<Button
								onClick={() => {
									handleClose();
									setModalVisible(false);
								}}
								variant="outlined"
								color="secondary"
								style={{ cursor: "pointer" }}>
								Cancel
							</Button>
							<Button
								variant="contained"
								type="submit"
								color="primary"
								onClick={() => {
									navigate("/pages/auth/logout");
									const refresh = localStorage.getItem(
										"currentToken"
									)
										? localStorage.getItem("currentToken")
										: "";
									if (refresh) {
										dispatch(
											logout({
												refresh,
											})
										);
									}
								}}
								autoFocus>
								Ok
							</Button>
						</DialogActions>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default UserProfile;
