import React, { useEffect } from "react";
import {
	Tabs,
	Tab,
	Box,
	Paper,
	Divider,
	Card,
	Typography,
	Button,
	Stack,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { getMenuItems } from "@src/store/system/system.action";
import { LuArrowLeftCircle, LuKeySquare } from "react-icons/lu";
import * as Icons from "@ant-design/icons";
import { IconBaseProps } from "@ant-design/icons/lib/components/Icon";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import GoBack from "@src/components/GoBack";

// mutable imports
import { selectWorkOrders } from "@src/store/sidemenu/project_management/work_order/work_order.slice";
import { getWorkOrderById } from "@src/store/sidemenu/project_management/work_order/work_order.action";
import { updateSidenav } from "@src/store/customise/customise";
import AssignUserModal from "@src/components/AssignUser";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number | string;
	value: number | string;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box mt={0}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number | string) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const LeadDashboard = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, tab, tenderId } = useParams();
	const {
		workOrder: { selectedData },
		system: { projectsMenuItemsList, userAccessList },
	} = useAppSelector((state) => selectWorkOrders(state));

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		dispatch(
			getMenuItems({
				code: "MENU0011",
				from: "projectsmenu",
			})
		);
	}, []);

	useEffect(() => {
		dispatch(
			getWorkOrderById({
				id: id ? id : "",
			})
		);
	}, []);

	return (
		<Box sx={{ width: "100%", mt: 2 }}>
			{/* <GoBack
				is_goback={true}
				go_back_url="/work_order"
				title={`Work Order Overview`}
				showSaveButton={false}
				loading={false}> */}

			<Card
				sx={{
					p: 2,
					display: "flex",
					alignItems: "center",
					gap: 2,
				}}>
				{/* <CardContent
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}> */}
				<Typography
					variant="h4"
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 2,
						cursor: "pointer",
					}}
					onClick={() => {
						navigate(`/work_order`, {
							relative: "path",
						});
					}}>
					<LuArrowLeftCircle />
					Work Order Overview
				</Typography>
				<AssignUserModal
					instance_id={id || ""}
					modal_path={"ProjectManagement.project"}
					callback={(assigness) => {
						// console.log(assigness);
						// setShowCaseSheet(assigness?.length > 0);
					}}
				/>

				{/* </CardContent> */}
			</Card>
			<Box sx={{ borderBottom: 0.1, borderColor: "divider", mt: -1 }}>
				<Paper>
					<Tabs
						value={tab ? +tab : 0}
						// onChange={handleChange}
						aria-label="scrollable auto tabs example"
						variant="scrollable">
						{projectsMenuItemsList &&
							[
								{
									key: "project_details",
									label: "Details",
									icon: "DashboardOutlined",
									url: "/",
									urlParams: { id },
								},
								...projectsMenuItemsList.filter((item) => {
									if (
										!selectedData?.is_performace_bank_guarantee &&
										item.url ===
											"/project/performance_bank_guarantee"
									) {
										return false;
									}
									return true;
								}),
								// {
								// 	key: "comments",
								// 	label: "Comments",
								// 	icon: "CommentOutlined",
								// 	url: "/comments",
								// 	urlParams: { id },
								// },
							].map((item, index) => {
								const IconComponent = Icons[
									item.icon as keyof typeof Icons
								] as
									| React.ComponentType<IconBaseProps>
									| undefined;

								return (
									<Tab
										icon={
											IconComponent ? (
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
											)
										}
										onClick={() =>
											navigate(
												`/work_order/view/${id}/${index}${item.url}`
											)
										}
										iconPosition="start"
										key={item.key}
										label={item.label}
										{...a11yProps(index)}
									/>
								);
							})}
					</Tabs>
				</Paper>
			</Box>
			<CustomTabPanel value={tab ? +tab : 0} index={tab ? +tab : 0}>
				{/* <Divider /> */}
				<Paper
					variant="elevation"
					sx={{
						p: 2,
					}}>
					{<Outlet />}
				</Paper>
			</CustomTabPanel>
			{/* </GoBack> */}
		</Box>
	);
};

export default LeadDashboard;
