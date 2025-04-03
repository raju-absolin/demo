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
	deleteState,
	editStates,
	getStates,
	getStatesById,
} from "@src/store/masters/State/state.action";
import {
	stateSelector,
	setSearchValue,
	isModelVisible,
	setMasterValue,
	setMasterEditId,
	setSelectedData,
	setIsFilterOpen,
} from "@src/store/masters/State/state.slice";
import TableComponent from "@src/components/TableComponenet";
import { masterSelector } from "@src/store/masters/master.slice";
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
	Popover,
	Typography,
	Grid,
} from "@mui/material";
import MasterPageTitle from "@src/components/MasterPageTitle";
import PageTitle from "@src/components/PageTitle";
import SearchIcon from "@mui/icons-material/Search";
import { selectLayoutTheme } from "@src/store/customise/customise";
import AddStateMasters from "./add.state";
import { systemSelector } from "@src/store/system/system.slice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import moment from "moment";
import Filters from "./Filter";
import { getFilterParams } from "@src/helpers";

const State = () => {
	const dispatch = useAppDispatch();
	const [open, setOpen] = useState(false);
	const [editId, setEditId] = useState("");
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
		state: {
			statesList,
			pageParams,
			loading,
			statesCount,
			searchValue,
			masterValue,
			selectedData,
			masterEditId,
			isFilterOpen,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			state: stateSelector(state),
			system: systemSelector(state),
		};
	});

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
			title: "Country",
			width: 100,
		},
		{
			title: "Name",
			width: 100,
		},
		{
			title: "Created By",
			width: 100,
		},
		{
			title: "Created On",
			width: 100,
		},
		{
			title: "Actions",
			width: 100,
		},
	];

	function createData(
		index: number,
		code: string,
		country: object,
		name: string,
		created_by: string,
		createdon: string,
		actions: React.JSX.Element
	) {
		return {
			index,
			code,
			country,
			name,
			created_by,
			createdon,
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
			deleteState({
				id: deleteId,
				clearDataFn: () => {},
				navigate: (path: string) => {},
				params: pageParams,
			})
		);
		dispatch(
			getStates({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		handleDeleteClose();
	};
	const rows = statesList.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const actions = (
			<Box
				justifyContent="start"
				alignItems="center"
				sx={{
					display: "flex",
					gap: 2,
				}}>
				{userAccessList?.indexOf("DynamicDjango.change_state") !==
					-1 && (
					<LuPencil
						style={{ cursor: "pointer", color: "#fc6f03" }}
						onClick={() => {
							dispatch(getStatesById({ id: row?.id }));
							openModal(true);
							dispatch(setMasterEditId(row?.id));
						}}
					/>
				)}
				{userAccessList?.indexOf("DynamicDjango.delete_state") !==
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
									onClick={() => {
										confirmDelete(currentId);
									}}
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
			row.country?.name,
			row.name,
			row?.createdby?.username,
			row?.createdon ? moment(row?.createdon).format("LLL") : "",
			actions
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getStates({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getStates({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getStates({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getStates({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext?.setTitle("State");
		outletContext?.setSubtitle("Masters");
		reset({ search: "" });
	}, []);

	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};

	const openModal = (value: boolean) => {
		dispatch(setMasterEditId(0));
		dispatch(setSelectedData({}));
		setOpen(value);
		dispatch(isModelVisible(value));
	};

	const handleClose = () => {
		setOpen(false);
	};
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getStates({
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
				prefix={"DynamicDjango"}
				postfix={"State"}
				pageTitle="State"
				goBack={true}
				addModelTile={
					userAccessList?.indexOf("DynamicDjango.add_state") !== -1
						? "Add State"
						: undefined
				}
				modalVisible={true}
				setIsModalVisible={openModal}
				showFilterButton={true}
				openFilter={handleFilter}
				filteredData={getFilterParams(pageParams)}
				pageText={""}>
				<form action="" onSubmit={handleSubmit(handleSearch)}>
					<Grid container my={2}>
						<TextField
							type="text"
							sx={{
								width: "500px",
							}}
							{...register("search")}
							id="input-with-icon-textfield"
							size="small"
							InputProps={{
								endAdornment: (
									<InputAdornment position="start">
										<LuSearch size={16} />
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
					count={statesCount}
					columns={columns}
					rows={rows}
					loading={loading}
					page={pageParams.page}
					pageSize={pageParams.page_size}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</MasterPageTitle>
			<AddStateMasters
				modal={open}
				closeModal={handleClose}
				mastersName="State"
				edit_Id={masterEditId}
				mastersValue={masterValue}
			/>
			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
		</>
	);
};

export default State;
