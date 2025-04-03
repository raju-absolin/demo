import React, { useState, useEffect, ChangeEvent } from "react";
import { styled } from "@mui/material/styles";
import {
	TextField,
	InputAdornment,
	Typography,
	Grid2 as Grid,
	Paper,
	Box,
} from "@mui/material";
import { getMenuItems } from "@src/store/system/system.action";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { useNavigate } from "react-router-dom";
import { LuArrowBigRightDash, LuArrowRight, LuSearch } from "react-icons/lu";
import { selectReports } from "@src/store/reports/reports.slice";

import * as Icons from "@ant-design/icons";
import { IconBaseProps } from "@ant-design/icons/lib/components/Icon";

type MenuItemTypes = {
	// Define the properties of MenuItemTypes here
	id: string;
	name: string;
	search: string;
	// other properties...
};

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: "#fff",
	...theme.typography.body2,
	padding: theme.spacing(4),
	textAlign: "left",
	borderRadius: "10px",
	cursor: "pointer",
	color: theme.palette.text.secondary,
	...theme.applyStyles("dark", {
		backgroundColor: "#1A2027",
	}),
}));

const Masters = () => {
	const [menuItems, setMenuItems] = useState<MenuItemTypes[]>([]);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const {
		system: { reportsMenuItemsList },
	} = useAppSelector((state) => selectReports(state));

	useEffect(() => {
		dispatch(
			getMenuItems({
				code: "MENU0005",
				from: "reportsmenu",
			})
		);
	}, []);

	useEffect(() => {
		setMenuItems(reportsMenuItemsList as MenuItemTypes[]);
	}, [reportsMenuItemsList]);

	const handleSearch = (searchWord: ChangeEvent<HTMLInputElement>) => {
		const newFilter = reportsMenuItemsList?.filter((menu: any) => {
			return menu.label
				.toLowerCase()
				.includes(searchWord.target.value.toLowerCase());
		});
		if (searchWord.target.value === "") {
			setMenuItems(reportsMenuItemsList as MenuItemTypes[]);
		} else {
			setMenuItems(newFilter as MenuItemTypes[]);
		}
	};

	const handleNavigation = (path: string) => {
		navigate(path); // Navigate to the specified path
	};
	return (
		<Box sx={{ width: "100%" }}>
			{/* <PageTitle title="Masters Dashboard" /> */}
			{/* <Card
				style={{
					width: "700px",
					marginLeft: "20px",
					marginBottom: "20px",
				}}>
				<CardContent style={{ padding: "0px", borderRadius: "10px" }}> */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					my: "24px",
				}}>
				<Typography variant="h5" color={"text.primary"}>
					Reports
				</Typography>

				<Box
					sx={{
						display: { xs: "hidden", md: "flex" },
						alignItems: "center",
						gap: "10px",
						fontWeight: 600,
					}}>
					<Box
						sx={{
							position: "static",
							overflowY: "hidden",
						}}>
						<TextField
							id="input-with-icon-textfield"
							size="small"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<LuSearch size={20} />
									</InputAdornment>
								),
							}}
							sx={{
								width: 300,
							}}
							onChange={handleSearch}
							variant="outlined"
							placeholder="Search Report..."
						/>
					</Box>
				</Box>
			</Box>
			{/* </CardContent>
			</Card> */}
			{menuItems?.length != 0 ? (
				<Grid
					container
					rowSpacing={2}
					columnSpacing={{ xs: 1, sm: 2, md: 3 }}
					style={{ marginLeft: "0px" }}>
					{menuItems?.map((option: any, index) => {
						const IconComponent = Icons[
							option.icon as keyof typeof Icons
						] as React.ComponentType<IconBaseProps> | undefined;
						return (
							<>
								<Grid
									size={{
										xs: 12,
										md: 6,
										lg: 6,
										xl: 3,
									}}>
									<Item
										onClick={() =>
											handleNavigation(option.url)
										}>
										<Box display="flex" alignItems="center">
											{IconComponent ? (
												<IconComponent
													style={{ fontSize: 16 }}
												/>
											) : (
												<Icons.QuestionOutlined
													style={{ fontSize: 16 }}
												/> // Fallback if icon is not found
											)}
											<Typography
												sx={{
													color: "text.secondary",
													fontSize: "16px",
													paddingX: 2,
													flexGrow: 1, // Allow Typography to take remaining space
													// textWrap: "nowrap",
												}}
												onClick={() => {
													// handleNavigation(option.url)
												}}
												variant="h6">
												{option?.label}
											</Typography>
											<LuArrowRight
												size="20"
												onClick={() => {
													handleNavigation(
														option.url
													);
												}}
											/>
										</Box>
									</Item>
								</Grid>
							</>
						);
					})}
				</Grid>
			) : (
				""
			)}
		</Box>
	);
};

export default Masters;
