import React, {
	ChangeEvent,
	Dispatch,
	useState,
	useEffect,
	SyntheticEvent,
} from "react";
("@mui/material/TablePagination/TablePaginationActions");
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	deleteInspectionAgencies,
	editInspectionAgencies,
	getInspectionAgencies,
	getInspectionAgenciesById,
} from "@src/store/masters/InspectionAgencies/inspection_agencies.action";
import {
	inspectionAgenciesSelector,
	setSearchValue,
	isModelVisible,
	setMasterEditId,
	setSelectedData,
	useInspectionAgencySelector,
} from "@src/store/masters/InspectionAgencies/inspection_agencies.slice";
import { systemSelector } from "@src/store/system/system.slice";
import TableComponent from "@src/components/TableComponenet";
import { Link, useOutletContext } from "react-router-dom";
import { LuEye, LuPencil, LuSearch, LuTrash2 } from "react-icons/lu";
import TopComponent from "@src/pages/settings/TopComponent";
import {
	Box,
	Button,
	FormControlLabel,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	Typography,
	Popover,
	Grid,
} from "@mui/material";
import MasterPageTitle from "@src/components/MasterPageTitle";
import PageTitle from "@src/components/PageTitle";
import SearchIcon from "@mui/icons-material/Search";
import { selectLayoutTheme } from "@src/store/customise/customise";
import AddInspectionAgenciesMasters from "./add.inspectionAgencies";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

const InspectionAgencies = () => {
	const dispatch = useAppDispatch();
	const [open, setOpen] = useState(false);
	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();

	const [anchorEl, setAnchorEl] = useState(null);
	const deleteOpen = Boolean(anchorEl);
	const [currentId, setCurrentId] = useState(null);
	const {
		inspectionAgencies: {
			inspectionAgenciesList,
			pageParams,
			loading,
			inspectionAgenciesCount,
			searchValue,
			masterValue,
			selectedData,
			masterEditId,
		},
		system: { userAccessList },
	} = useInspectionAgencySelector();

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Code",
			width: 100,
		},
		{
			title: "Concerned Officer Name",
			width: 100,
		},
		{
			title: "Concerned Officer Mobile",
			width: 100,
		},
		{
			title: "Concerned Officer Email",
			width: 100,
		},
		{
			title: "Location",
			width: 100,
		},
		{
			title: "Actions",
			width: 100,
		},
	];

	function createData(
		index: number,
		code?: string,
		concerned_officer?: string,
		concerned_officer_mobile?: string,
		concerned_officer_email?: string,
		location?: string,
		actions?: React.JSX.Element
	) {
		return {
			index,
			code,
			concerned_officer,
			concerned_officer_mobile,
			concerned_officer_email,
			location,
			actions,
		};
	}
	let searchSchema = object({
		search: string(),
	});

	const { control, handleSubmit, register, reset } = useForm({
		resolver: yupResolver(searchSchema),
		values: {
			search: pageParams.search,
		},
	});

	const handleClick = (event: any, id: any) => {
		setCurrentId(id);
		setAnchorEl(event.currentTarget);
	};
	const handleDeleteClose = () => {
		setAnchorEl(null);
	};
	const confirmDelete = (deleteId: any) => {
		dispatch(
			deleteInspectionAgencies({
				id: deleteId,
				clearDataFn: () => {},
				navigate: (path: string) => {},
			})
		);
		dispatch(
			getInspectionAgencies({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		handleDeleteClose();
	};
	const rows = inspectionAgenciesList.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const actions = (
			<Box
				justifyContent="center"
				alignItems="center"
				sx={{
					display: "flex",
					gap: 2,
				}}>
				{userAccessList?.indexOf("Masters.change_inspectionagency") !==
					-1 && (
					<LuPencil
						style={{ cursor: "pointer", color: "#fc6f03" }}
						onClick={() => {
							dispatch(
								getInspectionAgenciesById({ id: row?.id })
							);
							openModal(true);
							dispatch(setMasterEditId(row?.id));
						}}
					/>
				)}
				{userAccessList?.indexOf("Masters.delete_inspectionagency") !==
					-1 && (
					<>
						<LuTrash2
							style={{ cursor: "pointer", color: "#fc6f03" }}
							onClick={(e) => handleClick(e, row?.id)}
						/>
						<Popover
							id={currentId ? String(currentId) : undefined}
							open={deleteOpen}
							anchorEl={anchorEl}
							onClose={handleDeleteClose}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							transformOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}>
							<div style={{ padding: "15px" }}>
								<Typography variant="subtitle1" gutterBottom>
									Are you sure to delete this Record?
								</Typography>
								<Button
									variant="contained"
									type="submit"
									color="primary"
									onClick={() => confirmDelete(currentId)}
									autoFocus>
									Yes
								</Button>
								<Button
									variant="outlined"
									size="small"
									onClick={handleDeleteClose}
									style={{ marginLeft: "20px" }}>
									No
								</Button>
							</div>
						</Popover>
					</>
				)}
			</Box>
		);

		return createData(
			index,
			row.code,
			row.concerned_officer,
			row.concerned_officer_mobile,
			row.concerned_officer_email,
			row.location?.name,
			actions
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getInspectionAgencies({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getInspectionAgencies({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getInspectionAgencies({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getInspectionAgencies({
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext?.setTitle("InspectionAgencies");
		outletContext?.setSubtitle("Masters");
		reset({ search: "" });
	}, []);

	const openModal = (value: boolean) => {
		dispatch(setSelectedData({}));
		dispatch(setMasterEditId(0));
		setOpen(value);
		dispatch(isModelVisible(value));
	};

	const handleClose = () => {
		setOpen(false);
	};
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getInspectionAgencies({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};
	return (
		<>
			<MasterPageTitle
				prefix={"Masters"}
				postfix={"inspectionagency"}
				pageTitle="Inspection Agencies"
				goBack={true}
				addModelTile={
					userAccessList?.indexOf("Masters.add_inspectionagency") !==
					-1
						? "Add Inspection Agency"
						: undefined
				}
				modalVisible={true}
				setIsModalVisible={openModal}
				pageText={""}
			/>
			<Card sx={{ marginBottom: "20px", marginTop: "15px" }}>
				<CardContent style={{ padding: "10px", borderRadius: "10px" }}>
					<form action="" onSubmit={handleSubmit(handleSearch)}>
						<Grid container mb={2}>
							<TextField
								type="text"
								sx={{
									width: "500px",
								}}
								{...register("search")}
								id="input-with-icon-textfield"
								size="small"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LuSearch size={20} />
										</InputAdornment>
									),
								}}
								fullWidth
								variant="outlined"
								placeholder="Search"
								onChange={handleInputChange}
							/>
						</Grid>
					</form>
					<TableComponent
						count={inspectionAgenciesCount}
						columns={columns}
						rows={rows}
						loading={loading}
						page={pageParams.page}
						pageSize={pageParams.page_size}
						handleChangePage={handleChangePage}
						handleChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</CardContent>
			</Card>
			<AddInspectionAgenciesMasters
				modal={open}
				closeModal={handleClose}
				mastersName="Inspection Agency"
				editId={masterEditId}
				mastersValue={masterValue}
				vendordata={selectedData}
			/>
		</>
	);
};

export default InspectionAgencies;
