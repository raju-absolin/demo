import React, { useState } from "react";
import {
	Tabs,
	Tab,
	TextField,
	Box,
	Card,
	Grid2 as Grid,
	useMediaQuery,
	Theme,
	IconButton,
	Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import MenuIcon from "@mui/icons-material/Menu";

const tabData = [
	{ label: "Overview", icon: <DescriptionIcon /> },
	{ label: "Purchase Quotation", icon: <DescriptionIcon /> },
	{ label: "Tender Items", icon: <CategoryIcon /> },
	{ label: "Purchase Quotation", icon: <DescriptionIcon /> },
	{ label: "Tender Items", icon: <CategoryIcon /> },
];

type Props = {
	drawerOpen: boolean;
	onMenuClick: (value: boolean) => void;
	gridContent: React.JSX.Element;
};

const SearchTabs = ({ drawerOpen, onMenuClick, gridContent }: Props) => {
	const [value, setValue] = useState(0);
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("md")
	);
	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Card>
			<Grid
				container
				sx={{
					// display: "flex",
					// alignItems: "center",
					// gap: 1,
					pl: 2,
					borderRadius: 2,
				}}>
				<Grid
					size={{
						xs: 12,
						sm: 4,
						xl: 2,
					}}
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "start",
					}}>
					{isSmallScreen && (
						<>
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								aria-label="menu"
								sx={{ mr: 2 }}
								onClick={() => onMenuClick(true)}>
								<MenuIcon />
							</IconButton>
							<Drawer
								anchor="left"
								open={drawerOpen}
								onClose={() => onMenuClick(false)}
								PaperProps={{
									sx: { width: 320 },
								}}>
								{gridContent}
							</Drawer>
						</>
					)}
					<TextField
						variant="outlined"
						placeholder="Search"
						size="small"
						InputProps={{
							startAdornment: (
								<SearchIcon sx={{ color: "gray", mr: 1 }} />
							),
						}}
					/>
				</Grid>
				<Grid
					size={{
						xs: 12,
						sm: 8,
						xl: 10,
					}}>
					<Tabs
						value={value}
						onChange={handleChange}
						textColor={"primary" as any}
						variant={"scrollable"}
						sx={{
							".MuiTabs-root": {
								p: 0,
							},
							".MuiTabs-scrollButtons": {
								// display: "inline-block",
								p: 0,
								m: 0,
								// width: "20px",
							},
						}}
						// indicatorColor="primary"
					>
						{tabData.map((tab, index) => (
							<Tab
								key={index}
								label={tab.label}
								icon={tab.icon}
								iconPosition="start"
								sx={(theme) => ({
									"&.Mui-selected": {
										color: "primary.main",
									},
								})}
							/>
						))}
					</Tabs>
				</Grid>
			</Grid>
		</Card>
	);
};

export default SearchTabs;
