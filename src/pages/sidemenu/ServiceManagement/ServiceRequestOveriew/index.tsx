import {
	Box,
	Divider,
	FormLabel,
	Grid2 as Grid,
	Paper,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import { useAppDispatch } from "@src/store/store";
import { useParams } from "react-router-dom";
import { useServiceRequestSelector } from "@src/store/sidemenu/service_management/ServiceRequest/serviceRequest.slice";
import moment from "moment";
import SelectComponent from "@src/components/form/SelectComponent";
import StatusModal from "../ServiceRequest/StatusModal";

const ServiceRequestOverview = () => {
	const { id } = useParams();
	const dispatch = useAppDispatch();

	const {
		serviceRequest: { selectedData },
	} = useServiceRequestSelector();
	const renderData = [
		{
			label: "Code",
			value: selectedData?.code,
		},
		{
			label: "Requested Date",
			value: moment(selectedData?.requested_date).format("DD-MM-YYYY"),
		},
		{
			label: "Due Date",
			value: moment(selectedData?.due_date).format("DD-MM-YYYY"),
		},
		{
			label: "Over Due Days",
			value: selectedData?.overdue_days,
		},
		{
			label: "Priority",
			value: selectedData?.priority_name,
		},
		{
			label: "No of Assignees",
			value: selectedData?.assignees?.length,
		},
		{
			label: "No of Attachments",
			value: selectedData?.documents?.length,
		},
		{
			label: "Approved By",
			value: selectedData?.approved_by?.fullname,
		},
		{
			label: "Location",
			value: selectedData?.location?.name,
		},
		{
			label: "Department",
			value: selectedData?.department?.name,
		},
		{
			label: "Created On",
			value: moment(selectedData?.created_on).format("LLL"),
		},
	];

	const theme = useTheme();
	return (
		<Box>
			<Grid container spacing={2}>
				<Grid
					size={{
						xs: 12,
					}}>
					<Paper
						elevation={1}
						sx={{
							p: 2,
							backgroundColor: theme.palette.background.paper,
							border: "1px solid lightgrey",
						}}>
						<Box>
							<Grid container spacing={2}>
								<Stack
									flex={1}
									sx={{
										p: 2,
										border: "1px solid #e0e0e0",
										borderRadius: 2,
										boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
										bgcolor: "#fff",
									}}>
									<Stack spacing={2}>
										<Typography
											variant="h5"
											sx={{ fontWeight: 600 }}>
											Service Request Info
										</Typography>
										<Typography
											variant="body2"
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
											}}>
											<strong>Created By:</strong>{" "}
											{selectedData?.created_by?.fullname}{" "}
											(
											{selectedData?.created_by?.fullname}
											)
										</Typography>
									</Stack>
								</Stack>
								<Divider sx={{ my: 2 }} />

								{renderData &&
									renderData.map((item) => {
										return (
											<Grid
												size={{
													xs: 12,
												}}>
												<Box>
													<Stack
														direction="row"
														spacing={2}
														alignItems="center"
														justifyContent="start">
														<FormLabel>
															<Typography
																variant="body2"
																sx={{
																	fontWeight: 600,
																}}>
																{item.label} :
															</Typography>
														</FormLabel>
														<Typography
															variant="subtitle1"
															color={
																theme.palette
																	.mode ==
																"light"
																	? "primary.main"
																	: theme
																			.palette
																			.text
																			.primary
															}>
															{item.value}
														</Typography>
													</Stack>
												</Box>
											</Grid>
										);
									})}
							</Grid>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ServiceRequestOverview;
