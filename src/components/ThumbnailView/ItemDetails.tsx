import React from "react";
import {
	Card,
	CardContent,
	Typography,
	Link,
	Box,
	Grid2 as Grid,
} from "@mui/material";
import { Order } from "./types";

interface Props {
	order: Order | null;
	children?: React.JSX.Element;
}

const ItemDetails: React.FC<Props> = ({ order, children }) => {
	const data = {
		id: "sdfdfasdf",
		orderNo: "T1234567890",
		project: "Open Tender",
		company: "HSBC",
		department: "Development",
		productType: "Product",
		tenderDate: "21-09-2024 03:30 PM",
		tenderNumber: "Tender1234567",
		tenderNature: "Demo big nature",
		status: "Rejected",
		statusColor: "error" as "error",
	};
	return (
		<Card sx={{ p: 2, borderRadius: 2, mt: 2 }}>
			<Typography variant="h6" fontWeight="bold">
				{data?.orderNo}
			</Typography>
			<Card
				sx={{
					width: 400,
					mt: 2,
					p: 2,
					border: "1px solid #d1d1d1",
					borderRadius: 2,
				}}>
				<CardContent sx={{ p: 1 }}>
					<Grid container spacing={2}>
						{Object.entries(data)?.map(([key, value], index) => {
							return (
								<Grid size={{ xs: 12 }}>
									<Grid container>
										<Grid size={{ xs: 6 }}>
											<Typography variant="subtitle1">
												{key}:
											</Typography>
										</Grid>
										<Grid size={{ xs: 6 }}>
											<Typography
												variant="subtitle1"
												sx={(theme) => ({
													color:
														theme?.palette.mode !==
														"dark"
															? theme.palette
																	.primary
																	.main
															: "",
												})}>
												{value}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							);
						})}
					</Grid>
				</CardContent>
			</Card>
		</Card>
	);
};

export default ItemDetails;
