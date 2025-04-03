import React from "react";
import {
	Avatar,
	Box,
	CircularProgress,
	Grid2 as Grid,
	IconButton,
	List,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import TextArea from "@src/components/form/TextArea";
import { Control } from "react-hook-form";

interface Props {
	onSave: (value: any) => void;
	handleSubmit: any;
	register: unknown;
	errors: unknown;
	control: Control<any>;
	getValues: any;
	reset: any;
}
const TermsAndConditions = ({
	onSave,
	handleSubmit,
	register,
	control,
	errors,
	getValues,
	reset,
}: Props) => {
	return (
		<Box>
			<form action="">
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<TextArea
							required
							name="deliver_terms"
							label="Delivery Terms"
							type="text"
							placeholder="Write delivery terms here..."
							minRows={3}
							maxRows={5}
							containerSx={{
								display: "grid",
								gap: 1,
							}}
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<TextArea
							required
							name="financial_terms"
							label="Financial Terms"
							type="text"
							placeholder="Write financial terms here..."
							minRows={3}
							maxRows={5}
							containerSx={{
								display: "grid",
								gap: 1,
							}}
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6, lg: 3 }}>
						<TextArea
							required
							name="remarks"
							label="Remarks"
							type="text"
							placeholder="Write remarks here..."
							minRows={3}
							maxRows={5}
							containerSx={{
								display: "grid",
								gap: 1,
							}}
							control={control}
						/>
					</Grid>
				</Grid>
			</form>
		</Box>
	);
};

export default TermsAndConditions;
