import React, { useEffect, useState } from "react";
import {
	Tabs,
	Tab,
	Box,
	Paper,
	Divider,
	Card,
	CardContent,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	IconButton,
	DialogContent,
	DialogContentText,
	DialogActions,
	FormLabel,
	Stack,
	Tooltip,
	Zoom,
	Chip,
	AvatarGroup,
	Avatar,
	Grid2 as Grid,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { PDFViewer } from "@react-pdf/renderer";
import {
	isAssignToModalOpen,
	selectTenders,
	setIsUsersModalOpen,
	setTabs,
	useTenderSelector,
} from "@src/store/sidemenu/tender_mangement/tenders/tenders.slice";
import { getMenuItems } from "@src/store/system/system.action";
import {
	LuArrowLeftCircle,
	LuCheck,
	LuChevronRight,
	LuKeySquare,
	LuPencil,
	LuPlus,
	LuX,
} from "react-icons/lu";
import * as Icons from "@ant-design/icons";
import { IconBaseProps } from "@ant-design/icons/lib/components/Icon";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import GoBack from "@src/components/GoBack";
import {
	ApproveTender,
	editAssignUser,
	getTenderById,
	RejectTender,
} from "@src/store/sidemenu/tender_mangement/tenders/tenders.action";
import { LoadingButton } from "@mui/lab";
import TextArea from "@src/components/form/TextArea";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniUsers } from "@src/store/mini/mini.Action";
import { clearMiniUsers } from "@src/store/mini/mini.Slice";
import { updateSidenav } from "@src/store/customise/customise";
import PDFDocument from "@src/pages/sidemenu/PrintPDF/pdf";
import { setSelectedData } from "@src/store/settings/manageUsers/manage_users.slice";
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

const TenderDashboard = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { id, tab } = useParams();
	const {
		tenders: { selectedData, assign_to_modal, userAssigneModal },
		system: { tenderMenuItemsList, userAccessList },
	} = useTenderSelector();
	const [showCaseSheet, setShowCaseSheet] = useState<boolean>(false);

	const [showPrint, setShowPrint] = useState(false);

	useEffect(() => {
		dispatch(
			updateSidenav({
				showMobileMenu: false,
			})
		);
		dispatch(
			getMenuItems({
				code: "MENU0009",
				from: "tendermenu",
			})
		);
	}, []);

	useEffect(() => {
		dispatch(
			getTenderById({
				id: id ? id : "",
			})
		);
	}, [id]);

	const hide = () => {
		dispatch(isAssignToModalOpen(false));
		dispatch(setIsUsersModalOpen(false));
	};

	const setAssignUserModal = () => {
		dispatch(setIsUsersModalOpen(false));
		dispatch(isAssignToModalOpen(true));
	};

	return (
		<>
			<Box sx={{ width: "100%" }}>
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
								navigate(`/tenders`, {
									relative: "path",
								});
							}}>
							<LuArrowLeftCircle />
							{`Bid Details: ( ${selectedData.tender_no} )`}
						</Typography>
						<AssignUserModal
							instance_id={id || ""}
							modal_path={"TenderManagement.tender"}
							callback={(assigness) => {
								console.log(assigness);
								setShowCaseSheet(assigness?.length > 0);
							}}
						/>

						<Stack direction="row" spacing={1}>
							{userAccessList?.indexOf(
								"ProjectManagement.change_project"
							) !== -1 &&
								selectedData.authorized_status != 1 &&
								selectedData.authorized_status != 5 && (
									<Button
										variant="contained"
										size="large"
										onClick={() => {
											navigate(
												`/work_order/${id}/${selectedData?.project?.id}`
											);
										}}>
										Convert To Project
									</Button>
								)}
						</Stack>
						{/* </CardContent> */}
					</Card>

					<Box
						sx={{
							borderBottom: 0.1,
							borderColor: "divider",
							mt: 1,
						}}>
						<Paper>
							<Tabs
								value={tab ? +tab : 0}
								// onChange={handleChange}
								aria-label="scrollable auto tabs example"
								variant="scrollable"
								scrollButtons="auto">
								{tenderMenuItemsList &&
									[
										{
											key: "overview",
											label: "Over View",
											icon: "DashboardOutlined",
											url: "/",
											urlParams: { id },
										},
										...tenderMenuItemsList.filter(
											(item) => {
												if (
													selectedData.authorized_status !==
														2 &&
													selectedData.authorized_status !==
														5 &&
													item.url !== "/tender_items"
												) {
													return false;
												}
												if (
													!selectedData
														?.is_reverse_auction
														?.id &&
													item.url ===
														"/reverse_auction"
												) {
													return false;
												}
												if (
													!showCaseSheet &&
													item.url === "/case_sheet"
												) {
													return false;
												}
												if (
													item.url === "/tender_value"
												) {
													return (
														userAccessList?.indexOf(
															"System.all_data"
														) !== -1
													);
												}
												return true; // Keep item in the list
											}
										),
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
														`/tenders/view/${id}/${index}${item.url}`
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
					<CustomTabPanel
						value={tab ? +tab : 0}
						index={tab ? +tab : 0}>
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
			</Box>
		</>
	);
};

export default TenderDashboard;
