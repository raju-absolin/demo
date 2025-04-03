import React, { useEffect } from "react";
import {
	Tabs,
	Tab,
	Box,
	Paper,
	Divider,
	Card,
	Button,
	Stack,
	Tooltip,
	Typography,
	Zoom,
	AvatarGroup,
	Avatar,
	IconButton,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { getMenuItems } from "@src/store/system/system.action";
import {
	LuArrowLeftCircle,
	LuCheck,
	LuChevronRight,
	LuKeySquare,
	LuPlus,
	LuX,
} from "react-icons/lu";
import * as Icons from "@ant-design/icons";
import { IconBaseProps } from "@ant-design/icons/lib/components/Icon";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import GoBack from "@src/components/GoBack";
import {
	selectLeads,
	setIsUsersModalOpen,
} from "@src/store/sidemenu/strategic_management/leads/leads.slice";
import {
	ApproveLead,
	getLeadById,
	RejectLead,
} from "@src/store/sidemenu/strategic_management/leads/leads.action";
import { LoadingButton } from "@mui/lab";
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
	const { id, tab } = useParams();
	const {
		leads: { selectedData, approve_loading, reject_loading },
		system: { venderMenuItemsList, userAccessList },
	} = useAppSelector((state) => selectLeads(state));

	useEffect(() => {
		dispatch(
			getMenuItems({
				code: "MENU0010",
				from: "vendersmenu",
			})
		);
	}, []);

	useEffect(() => {
		dispatch(
			getLeadById({
				id: id ? id : "",
			})
		);
	}, []);

	return (
		<Box sx={{ width: "100%" }}>
			{/* <GoBack
				is_goback={true}
				go_back_url="/leads"
				title={`Lead Overview`}
				showSaveButton={false}
				loading={false}
				> */}

			<Box
				sx={{
					mt: 2,
				}}>
				<Card
					sx={{
						p: 2,
						display: "flex",
						alignItems: "center",
						gap: 2,
					}}>
					<Typography
						variant="h4"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 2,
							cursor: "pointer",
						}}
						onClick={() => {
							navigate(`/leads`, {
								relative: "path",
							});
						}}>
						<LuArrowLeftCircle />
						Lead Overview
					</Typography>

					<AssignUserModal
						instance_id={id || ""}
						modal_path={"LeadManagement.lead"}
						callback={() => {}}
					/>

					<Stack direction="row" spacing={1}>
						{userAccessList?.indexOf("System.all_data") !== -1 &&
							selectedData.authorized_status != 5 && (
								<Button
									variant="contained"
									size="large"
									onClick={() =>
										dispatch(setIsUsersModalOpen(true))
									}>
									Assign User
								</Button>
							)}
					</Stack>
				</Card>

				<Box sx={{ borderBottom: 0.1, borderColor: "divider", mt: 1 }}>
					<Paper>
						<Tabs
							value={tab ? +tab : 0}
							// onChange={handleChange}
							aria-label="scrollable auto tabs example"
							variant="scrollable">
							{venderMenuItemsList &&
								[
									{
										key: "lead_details",
										label: "Details",
										icon: "DashboardOutlined",
										url: "/",
										urlParams: { id },
									},
									...venderMenuItemsList,
									// ?.filter((item) => {
									// 	if (
									// 		selectedData.authorized_status !== 2
									// 		// 	&&
									// 		// selectedData.authorized_status !== 5
									// 	) {
									// 		return false;
									// 	}
									// 	return true; // Keep item in the list
									// }),
									{
										key: "comments",
										label: "Comments",
										icon: "DashboardOutlined",
										url: "/comments",
										urlParams: { id },
									},
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
													`/leads/view/${id}/${index}${item.url}`
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
			</Box>
			{/* </GoBack> */}
		</Box>
	);
};

export default LeadDashboard;
