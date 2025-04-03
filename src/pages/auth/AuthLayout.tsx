import { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
	Avatar,
	Box,
	Card,
	CardContent,
	Typography,
	Grid2 as Grid,
} from "@mui/material";
import { AuthBGLayout } from "@src/components";
import Layer_1 from "@src/assets/images/svg/Layer_1.svg";

// images
import logo from "@src/assets/images/Logo.svg";

type AccountLayoutProps = {
	pageImage?: string;
	authTitle?: string;
	helpText?: string;
	bottomLinks?: ReactNode;
	children?: ReactNode;
};

const AuthLayout = ({
	pageImage,
	authTitle,
	helpText,
	bottomLinks,
	children,
}: AccountLayoutProps) => {
	return (
		<>
			<AuthBGLayout>
				<Box
				// sx={{
				// 	position: "relative",
				// 	display: "flex",
				// 	flexDirection: "column",
				// 	alignItems: "center",
				// 	justifyContent: "center",
				// 	height: "100vh",
				// 	border: "1px solid",
				// }}
				>
					<Grid
						container
						sx={{
							position: "relative",
							height: "100vh",
							border: "1px solid",
						}}
						alignItems={"center"}>
						<Grid
							sx={{
								display: {
									xs: "none",
									lg: "grid",
								},
								justifyContent: {
									xs: "center",
									lg: "start",
									xl: "end",
								},
								// border: 1,
								// p: 10,
							}}
							size={{
								xs: 12,
								md: 8,
								lg: 6,
							}}>
							<Box
								sx={{
									// width: {
									// 	lg: "150%",
									// 	xl: "100%",
									// },
									height: "100%",
									// border: 1,
								}}>
								<img
									src={Layer_1}
									style={{
										width: "100%",
										height: "100%",
									}}
									alt="layer1"
								/>
							</Box>
						</Grid>
						<Grid
							size={{
								xs: 12,
								md: 12,
								lg: 6,
							}}
							sx={{
								display: "flex",
								justifyContent: "center",
							}}>
							<Box
								sx={{
									display: "flex",
									justifyContent: {
										xs: "center",
										md: "start",
									},
									height: "100%",
									maxWidth: "450px",
								}}>
								<Card
									sx={{
										borderRadius: 2,
										bgcolor: "#ffffff",
									}}>
									<CardContent
										sx={{
											px: 4,
											pb: 0,
										}}>
										{/* <Link
												to="/"
												style={{
													display: "flex",
													justifyContent: "center",
												}}> */}
										{/* <img
													src={logo}
													alt="logo"
													height={60}
												/> */}
										<Typography
											sx={{
												mt: 3,
												px: 2,
												fontWeight: 700,
												fontSize: "30px !important",
												lineHeight: " 100%",
												letterSpacing: "0%",
												verticalAlign: "middle",
												color: "#0E484C",
											}}>
											Welcome
										</Typography>
										{/* </Link> */}
									</CardContent>
									<CardContent sx={{ p: 3, pt: 0 }}>
										<Box
											sx={{
												textAlign: "center",
												mx: "auto",
												width: "75%",
											}}>
											{pageImage && (
												<Avatar
													variant="rounded"
													src={pageImage}
													alt="mail sent image"
													sx={{
														mx: "auto",
														width: 64,
														height: 64,
													}}
												/>
											)}
											<Typography
												variant="h4"
												sx={{
													textAlign: "center",
													mb: "16px",
													mt: 4.5,
												}}>
												{authTitle}
											</Typography>
											<Typography
												variant="body2"
												sx={{ mb: "36px" }}
												color={"text.secondary"}>
												{helpText}
											</Typography>
										</Box>

										{children}
									</CardContent>
								</Card>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</AuthBGLayout>
		</>
	);
};

export default AuthLayout;
