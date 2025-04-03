import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Divider,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	FormControlLabel,
	Switch,
	Stack,
	Card,
	Grid2 as Grid,
	CardContent,
	styled,
	Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	checkAppPermission,
	checkPermission,
	selectManageGroups,
} from "@src/store/settings/manageGroups/manage_groups.slice";
import {
	ContentTypeDetails,
	PermissionListType,
} from "@src/store/settings/manageGroups/manage_groups.types";
import { FormInput, ScrollableList } from "@src/components";
import { Control, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LogoBox from "@src/layouts/LeftSideBar/LogoBox";
import { TiArrowSortedDown } from "react-icons/ti";

const CustomAccordion = styled(Box)(({ theme }) => ({
	// border: "1px solid #ddd",
	borderRadius: "8px",
	marginBottom: "10px",
	overflow: "hidden",
}));

const AccordionHeader = styled(Box)({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: "10px 15px",
	// background: "#f5f5f5",
	cursor: "pointer",
	transition: "all 1s",
});

const AccordionContent = styled(Box)({
	padding: "15px",
	display: "flex",
	flexWrap: "wrap",
	gap: "20px",
	transition: "all 1s",
});

function RenderPermissonsCard({ item }: { item: PermissionListType | null }) {
	const dispatch = useAppDispatch();
	const [expanded, setExpanded] = useState<number | null>(null);

	useEffect(() => {
		setExpanded(null);
	}, [item]);

	return (
		<>
			<ScrollableList
				styles={{
					height: "80vh",
				}}
				list={item?.contenttypedetails || []}
				renderItem={(
					contenttype: ContentTypeDetails,
					index: number
				) => (
					<>
						<CustomAccordion key={index}>
							<AccordionHeader
								// expandIcon={<ExpandMoreIcon />}
								onClick={() =>
									setExpanded(
										expanded === index ? null : index
									)
								}
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
									}}>
									<Typography variant="subtitle1">
										{contenttype.name}
									</Typography>
									<TiArrowSortedDown
										style={{
											transform:
												expanded === index
													? "rotate(180deg)"
													: "rotate(0deg)",
											transition: "transform 0.3s ease",
										}}
									/>
								</Box>
							</AccordionHeader>
							<Collapse
								in={!(expanded === index)}
								timeout="auto"
								unmountOnExit>
								<AccordionContent>
									<Grid container columnGap={2} rowGap={2}>
										{contenttype.permissions.map(
											(
												permission: any,
												index: number
											) => {
												return (
													<Grid
														size={{
															md: 3,
														}}
														// sx={{
														// 	mr: 3,
														// }}
														key={index}>
														<Box
															sx={{
																display: "flex",
																alignItems:
																	"center",
															}}>
															<Stack
																direction={
																	"row"
																}
																sx={{
																	width: "220px",
																}}
																justifyContent={
																	"space-between"
																}
																alignItems="center">
																<Typography variant="subtitle1">
																	{
																		permission
																			?.permissiondetails
																			?.name
																	}
																</Typography>

																<Switch
																	checked={
																		permission?.permissionChecked
																	}
																	onChange={(
																		value
																	) =>
																		dispatch(
																			checkPermission(
																				{
																					appPermission_id:
																						item?.id ??
																						"",
																					contentType_id:
																						contenttype?.id,
																					permission_id:
																						permission?.id,
																					value: value
																						.target
																						.checked,
																				}
																			)
																		)
																	}
																/>
															</Stack>
														</Box>
													</Grid>
												);
											}
										)}
									</Grid>
								</AccordionContent>
							</Collapse>
							<Divider />
						</CustomAccordion>
					</>
				)}
			/>
		</>
	);
}

const GroupPermissions = ({ control }: { control: any }) => {
	const dispatch = useAppDispatch();
	const {
		manageGroups: {
			appPermissionsList,
			expanded,
			permissionsLoading,
			loading,
			profileData,
		},
	} = useAppSelector((state) => {
		return {
			manageGroups: selectManageGroups(state),
		};
	});

	const [selectedGroup, setSelectedGroup] =
		useState<PermissionListType | null>(null);

	const [renderItem, setRenderitem] = useState<React.JSX.Element | null>(
		null
	);

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			{/* Sidebar */}
			<Box
				sx={{
					width: 300,
					paddingX: 3,
					borderRight: "1px solid #ddd",
					overflow: "none",
				}}>
				{/* <Typography variant="h4">Add Group</Typography> */}
				{/* <TextField fullWidth label="Enter Group Name" margin="normal" /> */}
				<Box
					sx={{
						my: 2,
					}}>
					<Box>
						<form>
							<FormInput
								name="name"
								label="Group Name"
								containerSx={{ mb: "12px" }}
								type="text"
								placeholder="Enter group name"
								control={control}
							/>
						</form>
					</Box>
				</Box>
				<Typography variant="subtitle1" sx={{ mt: 2 }}>
					Permissions
				</Typography>
				<ScrollableList
					styles={{
						height: "80vh",
					}}
					loading={permissionsLoading}
					list={appPermissionsList}
					renderItem={(item) => (
						<ListItem key={item?.id} disablePadding>
							<ListItemButton
								sx={{
									display: "flex",
									justifyContent: "space-between",
								}}
								selected={selectedGroup?.id === item?.id}
								onClick={() => setSelectedGroup(item)}>
								<Box
									sx={{
										boreder: "1px solid",
										display: "flex",
										flex: 1,
										justifyContent: "space-between",
										alignItems: "center",
										gap: 0,
									}}>
									<Typography
										variant="subtitle1"
										sx={{
											wordBreak: "break-word",
										}}>
										{item.name}
									</Typography>
									<Switch
										checked={item.appPermissionsChecked}
										onChange={(event) => {
											dispatch(
												checkAppPermission({
													appPermission_id: item.id,
													appPermission_checked:
														event.target.checked,
												})
											);
											setSelectedGroup(item);
										}}
									/>
								</Box>
							</ListItemButton>
						</ListItem>
					)}
				/>
			</Box>

			{/* Main Content */}
			<Box sx={{ flex: 1, padding: 3 }}>
				<Typography
					variant="h4"
					sx={{
						mb: 2,
						px: 2.5,
					}}>
					{selectedGroup?.name} Permissions
				</Typography>

				{selectedGroup && appPermissionsList?.length > 0 ? (
					<RenderPermissonsCard
						item={
							appPermissionsList?.find(
								(e) => e.id == selectedGroup?.id
							) || null
						}
					/>
				) : (
					<>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								height: "100%",
							}}>
							<LogoBox />
							<Typography variant="h4">
								{" "}
								Welcome To Group Permissions
							</Typography>
							<Typography variant="subtitle1" align="center">
								Please Click On Menu
							</Typography>
						</Box>
					</>
				)}
			</Box>
		</Box>
	);
};

export default GroupPermissions;
