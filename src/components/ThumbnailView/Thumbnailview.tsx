import React from "react";
import {
	Card,
	CardContent,
	Typography,
	Chip,
	IconButton,
	Button,
	Box,
	Stack,
} from "@mui/material";
import { LocationOn, CalendarToday, MoreVert } from "@mui/icons-material";

const PaperMachineCard: React.FC = () => {
	return (
		<Card sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}>
			<CardContent>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}>
					<div style={{ display: "flex", alignItems: "center" }}>
						<img
							src="https://s3-alpha-sig.figma.com/img/1a3b/7a23/5f54ab126aec18b736341e82069c9d90?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jg-jnexHcljN2KV9OLY8O-i~luXB-dV6zZyjrWGKo~zhFvll~pwVF0r4Yd~OZM-ElwPvpp-mNajdoLwezRpjm-zitHNnOMoj1uDuIweOycGfLIu3U3zxKJ2HX5JQcqYt0MecpPiyv6F0qWQJXGsNuJXuewJaKA07xn3NvlvKhQW0a2N1YF7uB6C4B8Ij75ahYd0kkiBo776LuLbbG9~RdqYNasqzuG9IQdWGSUrd4bpRNuRRZst59Zsl1aNclsKmVm8bPV~ZhF1p81jsxE4xFl~xKZUMO1r7PIogQJh4fjYierTCEuUiI4bjm4qGA1R5gTJwZiQ9Yttlne7nWzYOIw__"
							alt="Machine"
							style={{
								borderRadius: "50%",
								width: 30,
								height: 30,
								marginRight: 8,
							}}
						/>
						<Typography variant="h6" fontWeight={600}>
							Automatic Paper Making Machine 101
						</Typography>
					</div>
					<IconButton>
						<MoreVert />
					</IconButton>
				</div>

				<Box
					sx={{
						// marginTop: 8,
						display: "flex",
						flexDirection: {
							xs: "column",
							xl: "row",
						},
						gap: 1,
						mt: 1,
						justifyContent: "space-between",
					}}>
					<Chip
						sx={{
							borderRadius: "10px",
							width: "100%",
						}}
						color="default"
						label="Electrical Department"
						variant="filled"
					/>
					<Chip
						sx={{
							borderRadius: "10px",
							width: "100%",
						}}
						color="default"
						label="Break Down"
						variant="filled"
					/>
				</Box>

				<Stack spacing={2} mt={2}>
					<Box
						style={{
							display: "flex",
							alignItems: "center",
						}}>
						<LocationOn
							fontSize="small"
							sx={{ marginRight: 0.5 }}
						/>
						<Typography variant="body2">Location</Typography>
					</Box>

					<Box
						style={{
							display: "flex",
							alignItems: "center",
						}}>
						<CalendarToday
							fontSize="small"
							sx={{ marginRight: 0.5 }}
						/>
						<Typography variant="body2">02-02-2025</Typography>
					</Box>
				</Stack>

				<div style={{ marginTop: 12 }}>
					<Button
						variant="outlined"
						color="secondary"
						startIcon={
							<Box
								sx={{
									width: "10px",
									height: "10px",
									bgcolor: "#FE9935",
									borderRadius: "50%",
								}}></Box>
						}>
						Medium
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default PaperMachineCard;
