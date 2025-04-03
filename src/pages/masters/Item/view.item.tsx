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
	useItemSelector,
} from "@src/store/masters/Item/item.slice";
import Loader from "@src/components/Loader";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
	"& .MuiDrawer-paper": {
		borderRadius: "12px 0 0 12px",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
		backgroundColor: theme.palette.background.default,
		color: theme.palette.text.primary,
	},
}));

const ViewItem = () => {
	const dispatch = useAppDispatch();
	const theme = useTheme();

	const {
		items: { openView, selectedData },
	} = useItemSelector();

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
							Item Details
						</Typography>
						<IconButton onClick={closeModal}>
							<CloseIcon />
						</IconButton>
					</Stack>
					{selectedData?.image && (
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
					)}
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
										Description
									</Typography>
								}
								secondary={selectedData?.description}
							/>
						</ListItem>
						{/* <Divider /> */}
						{/* <ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Model Number
									</Typography>
								}
								secondary={selectedData?.modelnumber}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Category
									</Typography>
								}
								secondary={selectedData?.category?.name}
							/>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										MOC
									</Typography>
								}
								secondary={selectedData?.moc?.name}
							/>
						</ListItem> */}
						<Divider />
						<ListItem>
							<ListItemText
								primary={
									<Typography fontWeight={700}>
										Product Type
									</Typography>
								}
								secondary={selectedData?.product_type_name}
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
										Base Unit
									</Typography>
								}
								secondary={selectedData?.baseunit?.name}
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

export default ViewItem;
