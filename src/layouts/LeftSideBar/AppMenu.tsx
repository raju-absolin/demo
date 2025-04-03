import { Badge, Box, Collapse, Stack, Typography } from "@mui/material";
import { MenuItemTypes } from "@src/common/menu-items";
import {
	findAllParent,
	findMenuItem,
	getMenuItemFromURL,
} from "@src/helpers/menu";
import {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { LuChevronRight } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import {
	getLeftbarTheme,
	LeftbarThemeType,
} from "@src/layouts/LeftSideBar/helpers.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { selectLayoutTheme } from "@src/store/customise/customise";
import * as Icons from "@ant-design/icons";
import { IconBaseProps } from "@ant-design/icons/lib/components/Icon";
import { postRecentActivity } from "@src/store/system/system.action";

type SubMenus = {
	item: MenuItemTypes;
	activeMenuItems?: Array<string>;
	toggleMenu?: (item: any, status: boolean) => void;
	theme: LeftbarThemeType;
	level?: number;
};

const MenuItemWithChildren = ({
	item,
	activeMenuItems,
	toggleMenu,
	theme,
}: SubMenus) => {
	const [open, setOpen] = useState<boolean>(
		activeMenuItems!.includes(item.key ?? "")
	);
	const IconComponent = Icons[item.icon as keyof typeof Icons] as
		| React.ComponentType<IconBaseProps>
		| undefined;

	useEffect(() => {
		setOpen(activeMenuItems!.includes(item.key ?? ""));
	}, [activeMenuItems, item]);

	const toggleMenuItem = () => {
		const status = !open;
		setOpen(status);
		if (toggleMenu) toggleMenu(item, status);
		return false;
	};

	return (
		<li>
			<Box
				sx={{
					cursor: "pointer",
					display: "flex",
					padding: "12px 16px",
					gap: "12px",
					alignItems: "center",
					color: open ? theme.item.active : theme.item.color,
					"&:hover": {
						color: open ? theme.item.active : theme.item.hover,
					},
				}}
				onClick={toggleMenuItem}>
				{IconComponent ? (
					<IconComponent style={{ fontSize: 16 }} />
				) : (
					<Icons.QuestionOutlined style={{ fontSize: 16 }} /> // Fallback if icon is not found
				)}
				<Typography
					variant="subtitle1"
					sx={{
						lineHeight: 1,
					}}>
					{item.label}
				</Typography>
				<div style={{ marginInlineStart: "auto" }}>
					{!item.badge ? (
						<LuChevronRight
							size={16}
							style={{
								display: "flex",
								transform: open
									? "rotate(90deg)"
									: "rotate(0deg)",
								transition: "0.15s all",
							}}
						/>
					) : (
						<Box
							sx={{
								bgcolor: "success.main",
								width: "16px",
								height: "16px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 1,
							}}>
							<Typography
								variant={"body2"}
								fontWeight={500}
								lineHeight={1}>
								{item.badge.text}
							</Typography>
						</Box>
					)}
				</div>
			</Box>
			<Collapse in={open}>
				<ul style={{ listStyle: "none", paddingInlineStart: "28px" }}>
					{(item.children || []).map((child, idx) => {
						return (
							<Fragment key={idx}>
								{child.children?.length != 0 ? (
									<MenuItemWithChildren
										item={child}
										theme={theme}
										activeMenuItems={activeMenuItems}
										toggleMenu={toggleMenu}
									/>
								) : (
									<MenuItem
										item={child}
										theme={theme}
										level={1}
										activeMenuItems={activeMenuItems}
									/>
								)}
							</Fragment>
						);
					})}
				</ul>
			</Collapse>
		</li>
	);
};

const MenuItem = ({ item, theme, level, activeMenuItems }: SubMenus) => {
	const dispatch = useAppDispatch();
	const [open, setOpen] = useState<boolean>(
		activeMenuItems!.includes(item.key ?? "")
	);
	const location = useLocation();
	const isSelected = location.pathname === item.url;

	const IconComponent = Icons[item.icon as keyof typeof Icons] as
		| React.ComponentType<IconBaseProps>
		| undefined;

	useEffect(() => {
		setOpen(activeMenuItems!.includes(item.key ?? ""));
	}, [activeMenuItems, item]);

	return (
		<li style={{ padding: level == 1 ? "8px 16px" : "12px 16px" }}>
			<Box
				sx={{
					color: open ? theme.item.active : theme.item.color,
					"&:hover": {
						color: open ? theme.item.active : theme.item.hover,
					},
				}}
				onClick={() => {
					dispatch(
						postRecentActivity({
							menuitem_id: item?.key || "",
						})
					);
				}}>
				<Link
					to={item.url!}
					target={item.target}
					data-menu-key={item.key}
					style={{
						display: "flex",
						gap: "10px",
						alignItems: "center",
						textDecoration: "none",
						color: "inherit",
					}}>
					<Stack
						sx={(theme) => ({
							display: "flex",
							flexDirection: "row",
							gap: 2,
							ml: -1.1,
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
							transition: "all 0.3s",
							borderRadius: "5px",
							backgroundColor: isSelected ? "#E0EFFF" : "",

							color: isSelected ? theme.palette.common.black : "",
						})}>
						{IconComponent ? (
							<IconComponent style={{ fontSize: 16 }} />
						) : (
							<Icons.QuestionOutlined style={{ fontSize: 16 }} /> // Fallback if icon is not found
						)}

						<Typography
							variant="subtitle1"
							style={{ lineHeight: 1 }}>
							{item.label}
						</Typography>
						{item.badge && (
							<Box
								sx={{
									bgcolor: "success.main",
									width: "16px",
									height: "16px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: 1,
								}}>
								<Typography
									variant={"body2"}
									fontWeight={500}
									lineHeight={1}>
									{item.badge.text}
								</Typography>
							</Box>
						)}
					</Stack>
				</Link>
			</Box>
		</li>
	);
};

const AppMenu = ({ menuItems }: { menuItems: MenuItemTypes[] }) => {
	const location = useLocation();

	const settings = useAppSelector((state) => selectLayoutTheme(state));

	const menuRef = useRef(null);

	const [activeMenuItems, setActiveMenuItems] = useState<Array<string>>([]);

	const toggleMenu = (menuItem: MenuItemTypes, show: boolean) => {
		if (show) {
			setActiveMenuItems([
				menuItem["key"] ?? "",
				...findAllParent(menuItems, menuItem),
			]);
		}
	};

	const theme = useMemo(
		() => getLeftbarTheme(settings.sidenav.theme),
		[settings.sidenav.theme]
	);

	const activeMenu = useCallback(() => {
		const trimmedURL = location?.pathname?.replaceAll("", "");
		const matchingMenuItem = getMenuItemFromURL(menuItems, trimmedURL);

		if (matchingMenuItem) {
			const activeMt = findMenuItem(menuItems, matchingMenuItem.key);
			if (activeMt) {
				setActiveMenuItems([
					activeMt["key"] ?? "",
					...findAllParent(menuItems, activeMt),
				]);
			}

			setTimeout(function () {
				const activatedItem: any = document.querySelector(
					`#right-menu a[href="${trimmedURL}"]`
				);

				if (activatedItem != null) {
					const simplebarContent =
						document.querySelector("#right-menu");

					const offset = activatedItem!.offsetTop - 150;

					scrollTo(simplebarContent, 100, 600);
					if (simplebarContent && offset > 100) {
						scrollTo(simplebarContent, offset, 600);
					}
				}
			}, 200);

			// scrollTo (Left Side Bar Active Menu)
			const easeInOutQuad = (
				t: number,
				b: number,
				c: number,
				d: number
			) => {
				t /= d / 2;
				if (t < 1) return (c / 2) * t * t + b;
				t--;
				return (-c / 2) * (t * (t - 2) - 1) + b;
			};

			const scrollTo = (element: any, to: any, duration: any) => {
				const start = element.scrollTop,
					change = to - start,
					increment = 20;
				let currentTime = 0;
				const animateScroll = function () {
					currentTime += increment;
					const val = easeInOutQuad(
						currentTime,
						start,
						change,
						duration
					);
					element.scrollTop = val;
					if (currentTime < duration) {
						setTimeout(animateScroll, increment);
					}
				};
				animateScroll();
			};
		}
	}, [location.pathname, menuItems]);

	useEffect(() => {
		if (menuItems && menuItems.length > 0) activeMenu();
	}, [activeMenu, menuItems]);

	return (
		<>
			<ul
				ref={menuRef}
				id="main-side-menu"
				style={{
					marginTop: 0,
					marginBottom: 24,
					padding: "0 8px",
					listStyle: "none",
				}}>
				{(menuItems || []).map((item, idx) => {
					return (
						<Fragment key={idx}>
							{item.isTitle ? (
								<li style={{ padding: "12px 16px" }}>
									<Typography
										fontWeight={500}
										variant={"subtitle2"}
										color={theme.label.color}>
										{item.label}
									</Typography>
								</li>
							) : (
								<>
									{item.children ? (
										<MenuItemWithChildren
											item={item}
											theme={theme}
											toggleMenu={toggleMenu}
											activeMenuItems={activeMenuItems}
										/>
									) : (
										<MenuItem
											item={item}
											theme={theme}
											activeMenuItems={activeMenuItems}
										/>
									)}
								</>
							)}
						</Fragment>
					);
				})}
			</ul>
		</>
	);
};

export default AppMenu;
