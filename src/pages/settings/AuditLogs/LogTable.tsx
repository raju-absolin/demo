import { useState } from "react";
import {
	Card,
	CardContent,
	Typography,
	Box,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	styled,
	tableCellClasses,
	Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { User } from "@src/store/settings/manageUsers/manage_users.types";
import { PageParamsTypes } from "@src/common/common.types";

interface LogData {
	[key: string]: string | number | boolean | null;
}

interface LogEntry {
	id: string;
	type: number;
	type_name: string;
	tablename: string;
	record_code: string;
	user: User;
	created_on: string;
	log_data: LogData;
}

interface LogTableProps<P> {
	data: LogEntry[];
	pageParams: P;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.background.paper,
		fontSize: "14px",
		textAlign: "start",
	},
	[`&.${tableCellClasses.body}`]: {
		textAlign: "start",
		fontSize: "14px",
		BorderBottom: "0.8px solid #0000004D",
	},
}));
const LogTable = <P extends PageParamsTypes>({
	data,
	pageParams,
}: LogTableProps<P>) => {
	const [expandedRow, setExpandedRow] = useState<string | null>(null);

	const toggleRow = (id: string) => {
		setExpandedRow(expandedRow === id ? null : id);
	};

	const tableHeaders = [
		"S.No",
		"Code",
		"Type",
		"Table",
		"User Name",
		"Created On",
		"More",
	];

	return (
		<TableContainer
			component={Paper}
			sx={{ borderRadius: 0, overflow: "hidden", boxShadow: 0 }}>
			<Table>
				<TableHead>
					<TableRow sx={{ backgroundColor: "#f5f5f5" }}>
						{tableHeaders?.map((name) => {
							return <StyledTableCell>{name}</StyledTableCell>;
						})}
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((item, index) => {
						const idx =
							(pageParams.page - 1) * pageParams.page_size +
							(index + 1);
						return (
							<>
								<TableRow key={item.id}>
									<StyledTableCell>{idx}</StyledTableCell>
									<StyledTableCell>
										{item.record_code}
									</StyledTableCell>
									<StyledTableCell>
										{item.type_name}
									</StyledTableCell>
									<StyledTableCell>
										{item.tablename}
									</StyledTableCell>
									<StyledTableCell>
										{item?.user?.username}
									</StyledTableCell>
									<StyledTableCell>
										{new Date(
											item.created_on
										).toLocaleString()}
									</StyledTableCell>
									<StyledTableCell>
										<IconButton
											onClick={() => toggleRow(item.id)}>
											{expandedRow === item.id ? (
												<ExpandLess />
											) : (
												<ExpandMore />
											)}
										</IconButton>
									</StyledTableCell>
								</TableRow>
								<TableRow>
									<StyledTableCell
										colSpan={tableHeaders?.length}
										sx={{ padding: 0 }}>
										<Collapse
											in={expandedRow === item.id}
											timeout="auto"
											unmountOnExit>
											<Card
												variant="outlined"
												sx={{
													margin: 2,
													padding: 3,
													backgroundColor: "#f9fafb",
													borderLeft:
														"5px solid #1976d2",
													boxShadow: 2,
												}}>
												<CardContent>
													<Typography
														variant="h6"
														gutterBottom
														sx={{
															color: "#1976d2",
															fontWeight: "bold",
														}}>
														Log Data
													</Typography>
													<Box
														sx={{
															display: "grid",
															gridTemplateColumns:
																"repeat(auto-fit, minmax(200px, 1fr))",
															gap: 2,
														}}>
														{Object.entries(
															item.log_data
														).map(
															([key, value]) => (
																<Box
																	key={key}
																	sx={{
																		padding: 1,
																		backgroundColor:
																			"white",
																		borderRadius: 1,
																		boxShadow: 1,
																	}}>
																	<Typography
																		variant="body2"
																		sx={{
																			fontWeight:
																				"bold",
																			color: "#555",
																		}}>
																		{key}:
																	</Typography>
																	<Typography
																		variant="body2"
																		sx={{
																			color: "#333",
																			wordWrap:
																				"break-word",
																		}}>
																		{String(
																			value
																		)}
																	</Typography>
																</Box>
															)
														)}
													</Box>
												</CardContent>
											</Card>
										</Collapse>
									</StyledTableCell>
								</TableRow>
							</>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default LogTable;
