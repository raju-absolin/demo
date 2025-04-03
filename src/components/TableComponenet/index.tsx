import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
	Box,
	Pagination,
	Skeleton,
	TablePagination,
	useMediaQuery,
	TableSortLabel,
	Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BorderBottom } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme, width }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.background.paper,
		minWidth: width,
		fontSize: "14px",
		textAlign: "start",
	},
	[`&.${tableCellClasses.body}`]: {
		textAlign: "start",
		fontSize: "14px",
		BorderBottom: "0.8px solid #0000004D",
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.common.white,
	},
	"&:last-child td, &:last-child th": {
		// border: 0,
	},
}));

type Column = {
	title: string;
	width?: string | number;
	sortable?: boolean;
	field?: string;
};

type Props = {
	columns: Column[];
	rows: Record<string, any>[];
	loading: boolean;
	showPagination?: boolean;
	count: number;
	page: number;
	pageSize: number;
	containerHeight?: string | number;
	handleSort?: (field: string) => void;
	handleChangePage: (event: unknown, newPage: number) => void;
	handleChangeRowsPerPage: (
		event: React.ChangeEvent<HTMLInputElement>
	) => void;
};

export default function TableComponent<T>({
	columns = [],
	rows = [],
	loading,
	count,
	page,
	pageSize,
	showPagination = true,
	containerHeight = "100%",
	handleSort,
	handleChangePage,
	handleChangeRowsPerPage,
}: Props) {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const onSort = (field: string) => {
		if (handleSort) {
			handleSort(field);
		}
	};

	return (
		<Box sx={{ width: "100%", overflowX: "auto" }}>
			<Table
				sx={{
					minWidth: isSmallScreen ? 300 : 700,
				}}
				aria-label="responsive table">
				<TableHead>
					<StyledTableRow>
						{columns &&
							columns.map((column: any, index: number) => (
								<StyledTableCell
									key={index}
									width={column.width}>
									{column.sortable && column.field ? (
										<TableSortLabel
											onClick={() =>
												onSort(column.field!)
											}>
											{column.title}
										</TableSortLabel>
									) : (
										column.title
									)}
								</StyledTableCell>
							))}
					</StyledTableRow>
				</TableHead>
				<TableBody>
					{loading ? (
						Array.from(Array(3)).map((_, i) => (
							<TableRow key={i}>
								{Array.from(Array(columns.length)).map(
									(_, i) => (
										<StyledTableCell key={i}>
											<Skeleton height={80} />
										</StyledTableCell>
									)
								)}
							</TableRow>
						))
					) : rows.length ? (
						rows.map(
							(row: any, rowIndex: number) =>
								row && (
									<TableRow key={rowIndex}>
										{Object.keys(row).map(
											(rowkey, cellIndex) => (
												<StyledTableCell
													key={cellIndex}
													component="th"
													scope="row">
													{row[rowkey]}
												</StyledTableCell>
											)
										)}
									</TableRow>
								)
						)
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								align="center"
								sx={{ padding: 5 }}>
								Empty Data
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{showPagination && (
				<Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
					<TablePagination
						rowsPerPageOptions={[10, 20, 50, 100]}
						component="div"
						count={count}
						rowsPerPage={pageSize}
						page={page - 1}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Box>
			)}
		</Box>
	);
}
