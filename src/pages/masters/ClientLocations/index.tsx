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
	deleteClientLocation,
	editClientLocation,
	getClientLocation,
	getClientLocationById,
} from "@src/store/masters/ClientLocations/cliantlocation.action";
import {
	clientLocationSelector,
	setSearchValue,
	isModelVisible,
	setMasterValue,
	setMasterEditId,
	setSelectedData,
	setIsFilterOpen,
} from "@src/store/masters/ClientLocations/cliantlocation.slice";
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
	Popover,
	Typography,
	Grid,
} from "@mui/material";
import MasterPageTitle from "@src/components/MasterPageTitle";
import PageTitle from "@src/components/PageTitle";
import SearchIcon from "@mui/icons-material/Search";
import { selectLayoutTheme } from "@src/store/customise/customise";
import AddClientLocationMasters from "./add.clientlocation";
import Filters from "./filters";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

const ClientLocations = () => {
	const dispatch = useAppDispatch();
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
		clientLocation: {
			clientLocationList,
			pageParams,
			loading,
			clientLocationCount,
			searchValue,
			masterValue,
			masterEditId,
			isFilterOpen,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			clientLocation: clientLocationSelector(state),
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
			title: "Name",
			width: 100,
		},
		{
			title: "Country",
			width: 100,
		},
		{
			title: "State",
			width: 100,
		},
		{
			title: "City",
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
		name?: string,
		country?: string,
		state?: string,
		city?: string,
		actions?: React.JSX.Element
	) {
		return {
			index,
			code,
			name,
			country,
			state,
			city,
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
			deleteClientLocation({
				id: deleteId,
				clearDataFn: () => {},
				navigate: (path: string) => {},
				pageParams,
			})
		);
		dispatch(
			getClientLocation({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		handleDeleteClose();
	};
	const rows = clientLocationList?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const actions = (
			<Box
				justifyContent="start"
				alignItems="center"
				sx={{
					display: "flex",
					gap: 2,
				}}>
				{userAccessList?.indexOf("Masters.change_clientlocation") !==
					-1 && (
					<LuPencil
						style={{ cursor: "pointer", color: "#fc6f03" }}
						onClick={() => {
							dispatch(setSelectedData(row));
							dispatch(isModelVisible(true));
						}}
					/>
				)}
				{userAccessList?.indexOf("Masters.delete_clientlocation") !==
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
			row.name,
			row.country?.name,
			row.state?.name,
			row.city?.name,
			actions
		);
	});
	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getClientLocation({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getClientLocation({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getClientLocation({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getClientLocation({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext?.setTitle("ClientLocation");
		outletContext?.setSubtitle("Masters");
		reset({ search: "" });
	}, []);

	const openModal = (value: boolean) => {
		dispatch(setSelectedData({}));
		dispatch(isModelVisible(value));
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getClientLocation({
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
				postfix={"clientlocation"}
				pageTitle="Client Location"
				goBack={true}
				addModelTile={
					userAccessList?.indexOf("Masters.add_clientlocation") !== -1
						? "Add Client Location"
						: undefined
				}
				modalVisible={true}
				setIsModalVisible={openModal}
				pageText={""}
				showFilterButton={true}
				openFilter={handleFilter}
				filteredData={pageParams}>
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
								startAdornment: (
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
					count={clientLocationCount}
					columns={columns}
					rows={rows}
					loading={loading}
					page={pageParams.page}
					pageSize={pageParams.page_size}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</MasterPageTitle>

			<Filters openFilter={isFilterOpen} handleFilter={handleFilter} />
			<AddClientLocationMasters />
		</>
	);
};

export default ClientLocations;
