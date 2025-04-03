import React, { ChangeEvent, Fragment, useEffect } from "react";
import {
	setSyncParams,
	setOpenModel,
	setSyncTypeName,
	setSyncValue,
	InputChangeValue,
	synchronizationSelector,
} from "@src/store/settings/Synchronization/synchronization.slice";
import {
	startSync,
	getSyncList,
	getSyncLogList,
	syncSettingsAdd,
	getSyncSettings,
} from "@src/store/settings/Synchronization/synchronization.action";
import {
	Grid2 as Grid,
	TextField,
	Typography,
	Switch,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Pagination,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	Paper,
	styled,
	tableCellClasses,
	IconButton,
} from "@mui/material";
import * as yup from "yup";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import { FormInput } from "@src/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TableComponent from "@src/components/TableComponenet";
import { LuX } from "react-icons/lu";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.grey[200],
		color: theme.palette.primary,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const FocusSynchronization = () => {
	const dispatch = useAppDispatch();

	const {
		synchronization: {
			loading,
			syncLoading,
			synCount,
			syncParams,
			syncList,
			syncValue,
			syncSettingsData,
			syncLogList,
			openModal,
			syncTypeName,
			syncLogParams,
			selectedData,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			synchronization: synchronizationSelector(state),
			system: systemSelector(state),
		};
	});

	const syncData = [
		{
			id: 1,
			label: "Focus",
			name: "focus",
			requestUrl: "/thirdparty/focus_data_sync/",
			statusUrl: "/thirdparty/focus_data_sync/status/",
		},
		{
			id: 2,
			label: "AMCU",
			name: "amcu",
			requestUrl: "/thirdparty/amcu_data_collection/",
			statusUrl: "/thirdparty/amcu_data_collection/status/",
		},
	];

	useEffect(() => {
		dispatch(getSyncSettings());
	}, [dispatch]);

	const data = syncList?.map((row: any, key: number) => ({
		...row,
		index: (syncParams.page - 1) * syncParams.page_size + (key + 1),
	}));

	const logData = syncLogList.map((row: any, key: number) => ({
		...row,
		index: (syncLogParams.page - 1) * syncLogParams.page_size + (key + 1),
	}));

	const taxSchema = yup.object().shape({
		focus_username: yup
			.string()
			.required("Please enter your focus user name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"user name should not contain special characters"
			),
		focus_password: yup
			.string()
			.required("Please enter your focus password")
			.trim(),
		focus_base_url: yup
			.string()
			.required("Please enter your focus base url")
			.trim(),
		focus_companycode: yup
			.string()
			.required("Please enter your focus company code")
			.trim(),
	});

	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(taxSchema),
		values: {
			focus_username: syncSettingsData.focus_username
				? syncSettingsData.focus_username
				: "",
			focus_password: syncSettingsData.focus_password
				? syncSettingsData.focus_password
				: "",
			focus_base_url: syncSettingsData.focus_base_url
				? syncSettingsData.focus_base_url
				: "",
			focus_companycode: syncSettingsData.focus_companycode
				? syncSettingsData.focus_companycode
				: "",
		},
	});

	const onFinish = () => {
		const data = syncData?.find((item) => item.id === syncValue);
		if (data) {
			dispatch(startSync(data));
		} else {
			console.error("Sync data not found.");
		}
	};

	function onPageChange(event: React.ChangeEvent<unknown>, page: number) {
		dispatch(
			getSyncList({
				...syncParams,
				page,
				page_size: syncParams.page_size,
				sync_from: 1,
			})
		);
		dispatch(
			setSyncParams({
				...syncParams,
				page,
				page_size: syncParams.page_size,
			})
		);
	}

	const handleUpdate = (data: any) => {
		console.log("data", data);
		const obj = {
			...syncSettingsData,
			focus_sync_on: syncSettingsData.focus_sync_on ? "T" : "F",
			amcu_sync_on: syncSettingsData.amcu_sync_on ? "T" : "F",
		};
		console.log("obj", obj);
		dispatch(syncSettingsAdd(obj));
	};

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Date",
			width: 100,
		},
		{
			title: "Sync",
			width: 100,
		},
		{
			title: "Actions",
			width: 100,
		},
	];

	function createData(
		index: number,
		date?: string,
		sync?: string,
		actions?: React.JSX.Element
	) {
		return {
			index,
			date,
			sync,
			actions,
		};
	}
	const rows = syncList?.map((row: any, key: number) => {
		const index = (syncParams.page - 1) * syncParams.page_size + (key + 1);

		const actions = (
			<Box
				sx={{
					display: "flex",
					gap: 2,
				}}>
				{/* {userAccessList?.indexOf("") !== -1 && ( */}
				<Button
					onClick={() => {
						dispatch(setSyncTypeName(row.sync_type_name));
						dispatch(
							getSyncLogList({
								sync_trigger: row.id,
								...syncLogParams,
							})
						);
						dispatch(setOpenModel(true));
					}}>
					View
				</Button>
				{/* )} */}
			</Box>
		);

		return createData(
			index,
			moment(row.created_on).format("LLL"),
			row.sync_type_name,
			actions
		);
	});

	const handleChangePage = (event: any, newPage: number) => {
		dispatch(
			getSyncList({
				...syncParams,
				page: newPage + 1,
				page_size: syncParams.page_size,
				sync_from: 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getSyncList({
				...syncParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
				sync_from: 1,
			})
		);
	};

	return (
		<>
			<form action="" onSubmit={handleSubmit(handleUpdate)}>
				<Grid container spacing={3} sx={{ mb: 4 }}>
					<Grid size={{ xs: 12, sm: 6, md: 4 }}>
						<FormInput
							label="User Name"
							name="focus_username"
							type="text"
							placeholder="Enter user name here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6, md: 4 }}>
						<FormInput
							label="Password"
							name="focus_password"
							type="password"
							placeholder="Enter focus password here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6, md: 4 }}>
						<FormInput
							label="Base URL"
							name="focus_base_url"
							type="text"
							placeholder="Enter focus base url here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6, md: 4 }}>
						<FormInput
							label="Company Code"
							name="focus_companycode"
							type="text"
							placeholder="Enter focus company code here..."
							control={control}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 2 }}>
						<Typography>Synchronous</Typography>
						<Switch
							checked={syncSettingsData.focus_sync_on}
							onChange={(e) =>
								dispatch(
									InputChangeValue({
										key: "focus_sync_on",
										value: e.target.checked,
									})
								)
							}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 2 }}>
						<Typography>Auto Synchronous</Typography>
						<Switch
							checked={syncSettingsData.enable_auto_sync}
							onChange={(e) =>
								dispatch(
									InputChangeValue({
										key: "enable_auto_sync",
										value: e.target.checked,
									})
								)
							}
							disabled={!syncSettingsData.focus_sync_on}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 2 }} sx={{ mt: 4 }}>
						<Button
							variant="contained"
							type="submit"
							color="primary"
							autoFocus>
							Submit
						</Button>
					</Grid>
					<Grid size={{ xs: 12, md: 2 }} sx={{ mt: 4 }}>
						<Button
							variant="contained"
							type="submit"
							color="success"
							onClick={onFinish}
							autoFocus>
							Process
						</Button>
					</Grid>
				</Grid>
			</form>

			<TableComponent
				count={synCount}
				columns={columns}
				rows={rows}
				loading={loading}
				page={syncParams.page}
				pageSize={syncParams.page_size}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>

			<Dialog
				open={openModal}
				onClose={() => dispatch(setOpenModel(false))}
				fullWidth
				maxWidth="lg"
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle
					sx={{
						bgcolor: "primary.main",
						color: "white",
						p: 1,
						px: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
					variant="h4"
					id="alert-dialog-title">
					{`${syncTypeName} Log List`}
					<IconButton onClick={() => dispatch(setOpenModel(false))}>
						<LuX color="white" />
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{ px: "26px", pt: "12px !important", pb: 0 }}>
					<TableContainer
						component={Paper}
						sx={{ maxHeight: "100%", mt: 2 }}>
						<Table
							sx={{ minWidth: 700 }}
							aria-label="customized table">
							<TableHead>
								<TableRow>
									<StyledTableCell>S.No</StyledTableCell>
									<StyledTableCell>Log</StyledTableCell>
									<StyledTableCell>Date</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{logData.map((row) => (
									<TableRow key={row.index}>
										<TableCell>{row.index}</TableCell>
										<TableCell>{row.log}</TableCell>
										<TableCell>
											{moment(row.created_on).format(
												"LLL"
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => dispatch(setOpenModel(false))}
						color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default FocusSynchronization;
