import React, { useState } from "react";
import {
	AppBar,
	Toolbar,
	TextField,
	Tabs,
	Tab,
	Grid2 as Grid,
	Button,
	Card,
	CardContent,
	IconButton,
	Badge,
	Typography,
	Box,
	Collapse,
	Stack,
	ListItem,
	ListItemButton,
	Drawer,
	useMediaQuery,
	UseMediaQueryOptions,
	Theme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import OrderCard from "./ItemCard";
import OrderDetails from "./ItemDetails";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { CiDatabase } from "react-icons/ci";
import { LuDatabase } from "react-icons/lu";
import { RiCalendarCheckLine } from "react-icons/ri";
import ScrollableList from "../ScrollableList";
import { Order } from "./types";
import SearchTabs from "./SearchTabs";
import ItemDetails from "./ItemDetails";
import PaperMachineCard from "./Thumbnailview";
import { useAppSelector } from "@src/store/store";
import {
	CancelOutlined,
	CheckCircleOutlineOutlined,
} from "@mui/icons-material";

const orders: Order[] = [
	{
		id: "1",
		orderNo: "T1234567890",
		status: "Rejected",
		statusColor: "error",
		department: "IT",
		company: "HSBC",
		product: "Software Suite",
		tenderType: "Open Tender",
		category: "Development",
		type: "Public",

		project: "Open Tender",

		productType: "Product",
		tenderDate: "21-09-2024 03:30 PM",
		tenderNumber: "Tender1234567",
		tenderNature: "Demo big nature",
	},
	{
		id: "2",
		orderNo: "T9876543210",
		status: "Approved",
		statusColor: "success",
		department: "Marketing",
		company: "Google",
		product: "Ad Campaign",
		tenderType: "Private Deal",
		category: "Advertising",
		type: "Direct",
		project: "Open Tender",

		productType: "Product",
		tenderDate: "21-09-2024 03:30 PM",
		tenderNumber: "Tender1234567",
		tenderNature: "Demo big nature",
	},
	{
		id: "3",
		orderNo: "T5678901234",
		status: "Pending",
		statusColor: "warning",
		department: "Finance",
		company: "Amazon",
		product: "Cloud Services",
		tenderType: "Negotiation",
		category: "Infrastructure",
		type: "Bidding",
		project: "Open Tender",

		productType: "Product",
		tenderDate: "21-09-2024 03:30 PM",
		tenderNumber: "Tender1234567",
		tenderNature: "Demo big nature",
	},
];

const StatusCard = ({ children }: { children: React.JSX.Element }) => {
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	return (
		<>
			<Box sx={{ px: 1 }}>
				<Card sx={{ boxShadow: 3 }}>
					<Tabs
						value={value}
						onChange={handleChange}
						variant="fullWidth"
						allowScrollButtonsMobile={true}
						scrollButtons={true}
						visibleScrollbar={false}
						sx={{
							".MuiButtonBase-root": {
								minWidth: "10px !important",
								m: 0,
								p: 0,
							},
							".MuiTabs-flexContainer": {
								p: 0,
								m: 0,
								px: 2,
							},
						}}>
						<Tab
							disableRipple={true}
							label="All"
							icon={<LuDatabase size={"20px"} />}
							iconPosition="start"
						/>
						<Tab
							disableRipple={true}
							// label="Completed"
							icon={
								<Badge badgeContent={10} color="success">
									<CheckCircleOutlineOutlined />
								</Badge>
							}
							iconPosition="start"
						/>
						<Tab
							disableRipple={true}
							// label="Canceled"
							icon={
								<Badge badgeContent={5} color="error">
									<CancelOutlined />
								</Badge>
							}
							iconPosition="start"
						/>
						<Tab
							disableRipple={true}
							// label="Scheduled"
							icon={
								<Badge badgeContent={5} color="warning">
									<RiCalendarCheckLine
										style={{
											fontSize: "20px",
										}}
									/>
								</Badge>
							}
							iconPosition="start"
						/>
					</Tabs>
				</Card>
			</Box>
			<Box sx={{ mt: 2 }}>
				{/* <Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						p: 2,
					}}> */}
				{value === 0 && children}
				{value === 1 && (
					<Typography variant="body2">
						Showing 10 completed items
					</Typography>
				)}
				{value === 2 && (
					<Typography variant="body2">
						Showing 5 canceled items
					</Typography>
				)}
				{value === 3 && (
					<Typography variant="body2">
						Showing 10 scheduled items
					</Typography>
				)}
				{/* </Box> */}
			</Box>
		</>
	);
};

const ThumbnailView = () => {
	const showMobileMenu = useAppSelector(
		(state) => state.customise.sidenav.showMobileMenu
	);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [tabIndex, setTabIndex] = useState(0);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("md")
	);

	const gridContent = (
		<Grid size={{ xs: 12, md: 4, lg: 3.5, xl: showMobileMenu ? 3.5 : 3 }}>
			<StatusCard>
				<Collapse in={true} timeout="auto" unmountOnExit>
					<ScrollableList
						list={orders}
						styles={{
							maxHeight: "80vh",
						}}
						renderItem={(order, index) => (
							<Box mb={2}>
								<PaperMachineCard />
							</Box>
						)}
					/>
				</Collapse>
			</StatusCard>
		</Grid>
	);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "calc(100vh - 70px)",
				my: 2,
			}}>
			<Grid container spacing={1}>
				{!isSmallScreen && gridContent}
				<Grid
					size={{
						xs: 12,
						md: 8,
						lg: 8.5,
						xl: showMobileMenu ? 8.5 : 9,
					}}>
					<Stack>
						<SearchTabs
							drawerOpen={drawerOpen}
							onMenuClick={setDrawerOpen}
							gridContent={gridContent}
						/>
						<ItemDetails order={selectedOrder} />
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ThumbnailView;
