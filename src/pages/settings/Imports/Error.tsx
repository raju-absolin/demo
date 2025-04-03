import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface RowError {
	line: number;
	errors: {
		error: string;
		traceback: string[];
		row: string[];
	}[];
}

interface ErrorData {
	has_errors: boolean;
	row_errors: RowError[];
	diff_headers: string[];
	has_validation_errors: boolean;
	app_label: string;
	model_name: string;
	verbose_name: string;
	verbose_name_plural: string;
	base_errors: any[];
}

interface ErrorTableProps {
	errorData: ErrorData;
}

const ErrorTable: React.FC<ErrorTableProps> = ({ errorData }) => {
	if (!errorData || !errorData.has_errors || !errorData.row_errors.length) {
		return <Typography>No Errors Found</Typography>;
	}

	return (
		<TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
			<Typography variant="h6" gutterBottom>
				Import Errors
			</Typography>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Line Number</TableCell>
						<TableCell>Error Message</TableCell>
						{errorData.diff_headers.map((header, idx) => (
							<TableCell key={idx}>{header}</TableCell>
						))}
						<TableCell>Details</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{errorData.row_errors.map((rowError) =>
						rowError.errors.map((error, errIndex) => (
							<TableRow key={`${rowError.line}-${errIndex}`}>
								<TableCell>{rowError.line}</TableCell>
								<TableCell>{error.error}</TableCell>
								{errorData.diff_headers.map((header, idx) => (
									<TableCell key={idx}>
										{error.row[idx] || "N/A"}
									</TableCell>
								))}
								<TableCell>
									<Accordion>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}>
											<Typography variant="body2">
												View Traceback
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography
												variant="body2"
												component="pre"
												sx={{ whiteSpace: "pre-wrap" }}>
												{error.traceback.join("\n")}
											</Typography>
										</AccordionDetails>
									</Accordion>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ErrorTable;
