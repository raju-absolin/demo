// import { useState } from "react";
// import { Box, TextField, Typography, Card, Button } from "@mui/material";
type Props = {
	handleColourChange: (colour: string) => void;
	selectedColour: string;
};

// const ColorPicker = ({ handleColourChange, selectedColour }: Props) => {
// 	console.log(selectedColour);
// 	const [color, setColor] = useState<string>(selectedColour || "#1976d2");

// 	return (
// 		<Box
// 			sx={{
// 				display: "flex",
// 				flexDirection: "column",
// 				alignItems: "center",
// 				gap: 3,
// 				padding: 4,
// 				borderRadius: 3,
// 				backgroundColor: "#f4f4f4",
// 				boxShadow: 3,
// 				maxWidth: 400,
// 				margin: "auto",
// 			}}>
// 			<Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
// 				Pick a Color
// 			</Typography>
// 			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
// 				<TextField
// 					type="color"
// 					value={color}
// 					onChange={(e) => setColor(e.target.value)}
// 					sx={{
// 						width: 60,
// 						height: 40,
// 						padding: 0,
// 						border: "none",
// 						cursor: "pointer",
// 						backgroundColor: "transparent",
// 					}}
// 				/>
// 				<Typography
// 					variant="body1"
// 					sx={{ fontWeight: "bold", color: "#555" }}>
// 					{color.toUpperCase()}
// 				</Typography>
// 			</Box>
// 			<Card
// 				sx={{
// 					width: "100%",
// 					height: 120,
// 					backgroundColor: color,
// 					borderRadius: 2,
// 					boxShadow: 3,
// 					display: "flex",
// 					alignItems: "center",
// 					justifyContent: "center",
// 				}}>
// 				<Typography
// 					variant="h6"
// 					sx={{ color: "#fff", fontWeight: "bold" }}>
// 					Selected Color
// 				</Typography>
// 			</Card>
// 			<Button
// 				variant="contained"
// 				sx={{
// 					backgroundColor: color,
// 					color: "#fff",
// 					fontWeight: "bold",
// 					width: "100%",
// 				}}
// 				onClick={() => {
// 					handleColourChange(color);
// 				}}>
// 				Apply Color
// 			</Button>
// 		</Box>
// 	);
// };

// export default ColorPicker;

import { useState } from "react";
import { Box, Typography, Card, Button, Grid } from "@mui/material";

const themeColours = {
	// white: "#fff",
	// black: "#212428",
	red: "#9E1421",
	green: "#0E484C",
	blue: "#453DBF",
	yellow: "#A3793C",
};

const ColorPicker = ({ handleColourChange, selectedColour }: Props) => {
	const [selectedColor, setSelectedColor] = useState<string>();

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 3,
				padding: 4,
				borderRadius: 3,
				backgroundColor: "#f4f4f4",
				boxShadow: 3,
				maxWidth: 400,
				margin: "auto",
			}}>
			<Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
				Pick a Color
			</Typography>
			<Grid container spacing={2} justifyContent="center">
				{Object.entries(themeColours).map(([name, color]) => (
					<Grid item key={name}>
						<Button
							variant={
								selectedColor === color
									? "contained"
									: "outlined"
							}
							onClick={() => {
								setSelectedColor(color);
								handleColourChange(color);
							}}
							sx={{
								backgroundColor: color,
								color:
									selectedColor === color ? "#fff" : "#000",
								width: 50,
								height: 50,
								borderRadius: "50%",
							}}
						/>
					</Grid>
				))}
			</Grid>
			<Card
				sx={{
					width: "100%",
					height: 120,
					backgroundColor: selectedColor,
					borderRadius: 2,
					boxShadow: 3,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<Typography
					variant="h6"
					sx={{
						color: selectedColor === "#fff" ? "#000" : "#fff",
						fontWeight: "bold",
					}}>
					{selectedColor
						? "Selected Color"
						: "No Custom Color Selected"}
				</Typography>
			</Card>
		</Box>
	);
};

export default ColorPicker;
