import {
	AppBar,
	Box,
	Button,
	Container,
	Toolbar,
	Typography,
} from "@mui/material";
import PageTitle from "@src/components/PageTitle";

const Dashboard = () => {
	return (
		<>
			<PageTitle title="Dashboard" />
			<Container
				maxWidth="sm"
				sx={{
					mt: "16rem",
					textAlign: "center",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Box
					sx={{
						height: "100%",
					}}>
					<Typography variant="h3" component="h1" gutterBottom>
						Welcome to Spruce Engineering!
					</Typography>
					<Typography variant="h5" component="p" gutterBottom>
						We're thrilled to have you here.
					</Typography>
				</Box>
			</Container>
		</>
	);
};

export default Dashboard;
