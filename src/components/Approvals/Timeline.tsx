import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Grid2 as Grid,
	Typography,
} from "@mui/material";
import { PageBreadcrumb } from "@src/components";

// images
import img1 from "@src/assets/images/small/small-1.jpg";
import img2 from "@src/assets/images/small/small-2.jpg";
import img3 from "@src/assets/images/small/small-3.jpg";
import { Fragment } from "react";
import { LuCircleDot } from "react-icons/lu";
import moment from "moment";

type TimelineData = {
	[key: string]: {
		title?: string;
		date?: string;
		status?: string;
		user?: string;
		variant?: string;
		avatar?: {
			position: string;
			name: string;
			image: string;
		}[];
	}[];
};

const Timeline = ({ approvalData }: any) => {
	const timelineData: TimelineData = {};

	approvalData?.forEach((approval: any, index: number) => {
		const key = `Approval Info ${index + 1}`;
		timelineData[key] = [
			{
				date: moment(approval.authorized_on).format(
					"YYYY-MM-DD hh:mm:ss a"
				),
			},
			{
				title: `LEVEL ${approval.authorized_level}`,
				variant:
					approval.authorized_status_name === "Approved"
						? "#15d1e9"
						: "#ff6d3c",
				status: approval.authorized_status_name,
				user: approval.authorized_by?.fullname,
			},
		];
	});

	return (
		<>
			<Box
				sx={{
					"& > *:not(:first-child)": { mt: 2 },
					position: "relative",
				}}>
				<Box
					sx={{
						position: "absolute",
						border: "1px solid",
						borderColor: "divider",
						height: "100%",
						top: 1,
						left: "40px",
						insetInlineStart: { md: "50%" },
						translate: "-50%",
						zIndex: 0,
					}}
				/>
				{Object.keys(timelineData)?.map((data, idx) => {
					return (
						<Fragment key={idx}>
							<Box sx={{ textAlign: { md: "center" } }}>
								<Button
									variant="contained"
									disableRipple
									disableFocusRipple
									disableTouchRipple
									disableElevation
									color="secondary"
									sx={{
										"&:hover": {
											backgroundColor: "secondary.main",
										},
										// py: "6px",
										// px: "14px",
										display: "inline",
										borderRadius: "4px",
									}}
									component={"h5"}>
									{data}
								</Button>
							</Box>
							{timelineData[data]?.map(
								(item: any, idx: number) => {
									return idx % 2 === 0 ? (
										<Box
											key={idx}
											sx={{
												textAlign: {
													md: "end",
													xs: "left",
												},
											}}>
											<Box
												sx={{
													position: "absolute",
													left: {
														xs: "40px",
														md: "50%",
													},
													translate: "-50%",
												}}>
												<Box
													sx={{
														width: "24px",
														height: "24px",
														display: "flex",
														justifyContent:
															"center",
														alignItems: "center",
														borderRadius: "100%",
														bgcolor: item.variant,
													}}>
													<LuCircleDot
														color="white"
														size={20}
													/>
												</Box>
											</Box>
											<Box
												sx={{
													display: "grid",
													gridTemplateColumns:
														"repeat(2, minmax(0, 1fr))",
												}}>
												<Box
													sx={{
														gridColumn: {
															md: "span 1 / span 1",
															xs: "span 2 / span 2",
														},
													}}>
													<Box
														sx={{
															position:
																"relative",
															marginInlineEnd: {
																md: "40px",
															},
															ml: {
																md: "0px",
																xs: "0px",
															},
														}}>
														<Card>
															<CardContent
																sx={{
																	backgroundColor:
																		"grey.50",
																}}>
																<Typography
																	component={
																		"h4"
																	}
																	sx={{
																		fontSize:
																			"16px",
																	}}
																	color={
																		"grey.700"
																	}>
																	{item.title}
																</Typography>
																<Typography
																	color={
																		"grey.600"
																	}
																	fontSize={
																		"12px"
																	}>
																	{item.date}
																</Typography>
																<Typography
																	sx={{
																		color: "grey.600",
																	}}>
																	{
																		item.status
																	}
																</Typography>
															</CardContent>
														</Card>
														<Box
															sx={{
																bgcolor:
																	"grey.50",
																position:
																	"absolute",
																height: "16px",
																width: "16px",
																rotate: "45deg",
																borderRadius:
																	"2px",
																right: {
																	md: "-8px",
																},
																top: "28px",
																left: {
																	md: "auto",
																	xs: "-8px",
																},
															}}></Box>
													</Box>
												</Box>
											</Box>
										</Box>
									) : (
										<Box
											key={idx}
											sx={{ textAlign: "left" }}>
											<Box
												sx={{
													position: "absolute",
													left: {
														xs: "40px",
														md: "50%",
													},
													translate: "-50%",
												}}>
												<Box
													sx={{
														width: "24px",
														height: "24px",
														display: "flex",
														justifyContent:
															"center",
														alignItems: "center",
														borderRadius: "100%",
														bgcolor: item.variant,
													}}>
													<LuCircleDot
														color="white"
														size={20}
													/>
												</Box>
											</Box>
											<Box
												sx={{
													display: "grid",
													gridTemplateColumns:
														"repeat(2, minmax(0, 1fr))",
												}}>
												<Box
													sx={{
														gridColumn:
															"span 2 / span 2",
														gridColumnStart: {
															md: 2,
														},
													}}>
													<Box
														sx={{
															position:
																"relative",
															ml: "80px",
														}}>
														<Card>
															<CardContent
																sx={{
																	backgroundColor:
																		"grey.50",
																	padding: 2,
																}}>
																<Grid
																	container
																	spacing={2}
																	alignItems="center">
																	<Grid
																		size={{
																			xs: 2,
																			md: 1,
																		}}>
																		<Avatar
																			sx={{
																				width: 50,
																				height: 50,
																			}}
																			src=""
																			alt=""
																		/>
																	</Grid>
																	<Grid
																		size={{
																			xs: 10,
																			md: 11,
																		}}
																		sx={{
																			display:
																				"flex",
																			flexDirection:
																				"column",
																		}}>
																		<Typography
																			sx={{
																				fontSize:
																					"16px",
																				fontWeight:
																					"bold",
																				color: "grey.700",
																				whiteSpace:
																					"normal",
																			}}>
																			{
																				item.title
																			}
																		</Typography>
																		<Typography
																			sx={{
																				fontSize:
																					"12px",
																				color: "grey.600",
																			}}>
																			{
																				item.date
																			}
																		</Typography>
																		<Typography
																			sx={{
																				color: "grey.600",
																			}}>
																			<strong>
																				Status:
																			</strong>{" "}
																			{
																				item.status
																			}
																		</Typography>
																		<Typography
																			sx={{
																				color: "grey.600",
																			}}>
																			{item.status ==
																			"Approved" ? (
																				<>
																					<strong>
																						Approved
																						By:
																					</strong>{" "}
																					{
																						item.user
																					}
																				</>
																			) : (
																				<>
																					<strong>
																						Rejected
																						By:
																					</strong>{" "}
																					{
																						item.user
																					}
																				</>
																			)}
																		</Typography>
																	</Grid>
																</Grid>
															</CardContent>
														</Card>
													</Box>
												</Box>
											</Box>
										</Box>
									);
								}
							)}
						</Fragment>
					);
				})}
			</Box>
		</>
	);
};

export default Timeline;
