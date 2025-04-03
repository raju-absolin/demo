import { styled } from "@mui/material/styles";
import {
	Accordion,
	AccordionDetails,
	AccordionProps,
	AccordionSummary,
	AccordionSummaryProps,
	Box,
	Card,
	FormControlLabel,
	Switch,
	Typography,
	Skeleton,
	CardContent,
	Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
	checkAppPermission,
	checkPermission,
	InputChangeValue,
	selectManageGroups,
	setExpanded,
} from "@src/store/settings/manageGroups/manage_groups.slice";
import {
	ContentTypeDetails,
	PermissionListType,
} from "@src/store/settings/manageGroups/manage_groups.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { SyntheticEvent, useState } from "react";
import { LuChevronRight } from "react-icons/lu";

const CustomAccordion = styled((props: AccordionProps) => (
	<Accordion disableGutters elevation={0} square {...props} />
))(({ theme }: any) => ({
	border: `1px solid ${theme.palette.divider}`,
	borderRadius: "5px",
	"&:not(:last-child)": {
		borderBottom: 0,
	},
	"&:before": {
		display: "none",
	},
}));

const CustomAccordionSummary = styled((props: AccordionSummaryProps) => {
	return <AccordionSummary {...props} />;
})(({ theme }) => ({
	backgroundColor:
		theme.palette.mode === "dark"
			? "rgba(255, 255, 255, .05)"
			: "rgba(0, 0, 0, .03)",
	flexDirection: "row-reverse",
	"& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
		transform: "rotate(90deg)",
	},
	"& .MuiAccordionSummary-content": {
		marginLeft: theme.spacing(1),
	},
}));

const CustomAccordionDetails = styled(AccordionDetails)(({ theme }: any) => ({
	padding: theme.spacing(2),
	borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

type Props = {
	// appPermissionsList: PermissionListType[];
	// checked: boolean;
};

export const CustomizedAccordion = ({}: Props) => {
	const dispatch = useAppDispatch();
	const {
		manageGroups: {
			appPermissionsList,
			expanded,
			permissionsLoading,
			loading,
		},
	} = useAppSelector((state) => {
		return {
			manageGroups: selectManageGroups(state),
		};
	});

	const handleChange = (panel: string) => {
		dispatch(setExpanded(expanded != panel ? panel : false));
	};
	function renderPermissons() {
		return appPermissionsList.map(
			(item: PermissionListType, index: number) => {
				return (
					<Accordion
						key={index}
						expanded={expanded === item.name}
						// onChange={handleChange(item.name)}
					>
						<CustomAccordionSummary
							aria-controls={`${item.name}-content`}
							id={`${item.name}-header`}
							expandIcon={
								<LuChevronRight
									style={{ fontSize: "0.9rem" }}
									onClick={() => handleChange(item.name)}
								/>
							}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 2,
								}}>
								<Typography
									onClick={() => handleChange(item.name)}>
									{item.name + " Permission"}
								</Typography>
								<FormControlLabel
									control={
										<Switch
											checked={item.appPermissionsChecked}
											onChange={(event) => {
												dispatch(
													checkAppPermission({
														appPermission_id:
															item.id,
														appPermission_checked:
															event.target
																.checked,
													})
												);
											}}
										/>
									}
									label={
										item.appPermissionsChecked
											? "On"
											: "Off"
									}
								/>
							</Box>
						</CustomAccordionSummary>
						<CustomAccordionDetails>
							{renderPermissonsCard(item)}
						</CustomAccordionDetails>
					</Accordion>
				);
			}
		);
	}

	function renderPermissonsCard(item: PermissionListType) {
		return (
			<>
				{item.contenttypedetails.map(
					(contenttype: ContentTypeDetails, index: number) => (
						<Card key={index}>
							<Grid container alignItems={"center"} sx={{ p: 1 }}>
								<Grid
									size={{ xs: 6, md: 6 }}
									alignItems="center">
									<Typography variant="h5">
										{contenttype.name}
									</Typography>
								</Grid>

								<Grid size={{ xs: 6, md: 6 }}>
									<Grid container>
										{contenttype.permissions.map(
											(
												permission: any,
												index: number
											) => {
												return (
													<Grid
														size={{ md: 4 }}
														key={index}>
														<Box
															sx={{
																display: "flex",
																alignItems:
																	"center",
																gap: 2,
															}}>
															<FormControlLabel
																control={
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
																							item.id,
																						contentType_id:
																							contenttype.id,
																						permission_id:
																							permission.id,
																						value: value
																							.target
																							.checked,
																					}
																				)
																			)
																		}
																	/>
																}
																label={
																	<Typography variant="h5">
																		{
																			permission
																				?.permissiondetails
																				?.name
																		}
																	</Typography>
																}
															/>
														</Box>
													</Grid>
												);
											}
										)}
									</Grid>
								</Grid>
							</Grid>
							<Divider />
						</Card>
					)
				)}
			</>
		);
	}

	return (
		<Box>
			{" "}
			{permissionsLoading || loading ? (
				<Card>
					<CardContent
						sx={{
							lineHeight: 0,
						}}>
						<Skeleton
							sx={{
								my: 0,
								lineHeight: 0,
								height: 100,
								mt: "-28px",
							}}
						/>
						<Skeleton
							sx={{
								my: 0,
								lineHeight: 0,
								height: 100,
								mt: "-28px",
							}}
						/>
						<Skeleton
							sx={{
								my: 0,
								lineHeight: 0,
								height: 100,
								mt: "-28px",
							}}
						/>
						<Skeleton
							sx={{
								my: 0,
								lineHeight: 0,
								height: 100,
								mt: "-28px",
							}}
						/>
					</CardContent>
				</Card>
			) : (
				renderPermissons()
			)}
			{}
		</Box>
	);
};
