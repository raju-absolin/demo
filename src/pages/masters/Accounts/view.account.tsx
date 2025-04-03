import {
	Box,
	Drawer,
	Typography,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Stack,
	Divider,
	styled,
	Avatar,
	useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "@src/store/store";
import {
	setOpenView,
	useAccountSelector,
} from "@src/store/masters/Account/accounts.slice";
import Loader from "@src/components/Loader";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
	"& .MuiDrawer-paper": {
		borderRadius: "12px 0 0 12px",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
		backgroundColor: theme.palette.background.default,
		color: theme.palette.text.primary,
	},
}));

const ViewAccount = () => {
	const dispatch = useAppDispatch();
	const theme = useTheme();

	const {
		accounts: { openView, selectedData },
	} = useAccountSelector();

	const closeModal = () => {
		dispatch(setOpenView(false));
	};

	return (
		<>
			<StyledDrawer anchor="right" open={openView} onClose={closeModal}>
				<Box
					sx={{
						width: 400,
						p: 3,
						bgcolor: theme.palette.background.paper,
					}}>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						mb={2}>
						<Typography variant="h6" fontWeight={600}>
							Account Details
						</Typography>
						<IconButton onClick={closeModal}>
							<CloseIcon />
						</IconButton>
					</Stack>
					{/* {selectedData?.image && (
						<Box display="flex" justifyContent="center" mb={2}>
							<Avatar
								src={selectedData.image}
								sx={{
									width: 100,
									height: 100,
									borderRadius: 2,
								}}
							/>
						</Box>
					)} */}
					<List>
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Code
									</Typography>
								}
								secondary={selectedData?.code}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Name
									</Typography>
								}
								secondary={selectedData?.name}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Mobile
									</Typography>
								}
								secondary={selectedData?.mobile}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Email
									</Typography>
								}
								secondary={selectedData?.email}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Address
									</Typography>
								}
								secondary={selectedData?.address}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Pincode
									</Typography>
								}
								secondary={selectedData?.pincode}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Pan Number
									</Typography>
								}
								secondary={selectedData?.pan_no}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										GST Number
									</Typography>
								}
								secondary={selectedData?.gst_no}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Description
									</Typography>
								}
								secondary={selectedData?.remarks}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Type
									</Typography>
								}
								secondary={selectedData?.type_name}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Account Type
									</Typography>
								}
								secondary={selectedData?.account_type?.name}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Country
									</Typography>
								}
								secondary={selectedData?.country?.name}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										State
									</Typography>
								}
								secondary={selectedData?.state?.name}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										City
									</Typography>
								}
								secondary={selectedData?.city?.name}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Location
									</Typography>
								}
								secondary={selectedData?.client_locations
									?.map((e) => e.name)
									?.join(", ")}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Created On
									</Typography>
								}
								secondary={new Date(
									selectedData?.created_on || ""
								).toLocaleString()}
							/>
						</ListItem>
					</List>
				</Box>
			</StyledDrawer>
		</>
	);
};

export default ViewAccount;
