import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CategoryIcon from "@mui/icons-material/Category";
import { OrderCardProps } from "./types";
import { MoreHoriz } from "@mui/icons-material";

const OrderCard = ({ order, onSelect }: OrderCardProps) => {
	const { orderNo, status, statusColor, category, company, type } = order;

	return (
		<Card
			sx={{
				borderRadius: 2,
				py: 2,
				px: 3,
				mb: 2,
				cursor: "pointer",
			}}
			onClick={onSelect}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Typography variant="body2" color="textSecondary">
					Order No
				</Typography>
				<Box>
					<IconButton size="small">
						<MoreHoriz />
					</IconButton>
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}>
				<Typography variant="h6" fontWeight="bold">
					{orderNo}
				</Typography>
				<Box
					sx={{
						width: 80,
					}}>
					<Typography
						variant="body2"
						color={statusColor}
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 0.5,
						}}>
						● {status}
					</Typography>
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					mt: 2,
				}}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<BusinessCenterIcon fontSize="small" />
					<Typography variant="body2">{category}</Typography>
				</Box>
				<Box
					sx={{
						width: 80,
					}}>
					<Typography variant="body2">{company}</Typography>
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					mt: 1,
				}}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<CategoryIcon fontSize="small" />
					<Typography variant="body2">Product</Typography>
				</Box>
				<Box
					sx={{
						width: 80,
					}}>
					<Typography variant="body2">{type}</Typography>
				</Box>
			</Box>
		</Card>
	);
};

export default OrderCard;
