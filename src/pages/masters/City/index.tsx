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
	deleteCity,
	editCity,
	getCities,
	getCityById,
} from "@src/store/masters/City/city.action";
import {
	citySelector,
	setSearchValue,
	isModelVisible,
	setMasterValue,
	setMasterEditId,
	setSelectedData,
} from "@src/store/masters/City/city.slice";
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
import AddCityMasters from "./add.city";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

const City = () => {
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
		city: {
			cityList,
			pageParams,
			loading,
			cityCount,
			searchValue,
			masterValue,
			masterEditId,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			city: citySelector(state),
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
			title: "State",
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
		name: string,
		state?: string,
		actions?: React.JSX.Element
	) {
		return {
			index,
			code,
			name,
			state,
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
			deleteCity({
				id: deleteId,
				clearDataFn: () => {},
				navigate: (path: string) => {},
			})
		);
		dispatch(
			getCities({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		handleDeleteClose();
	};
	const rows = cityList.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const actions = (
			<Box
				justifyContent="start"
				alignItems="center"
				sx={{
					display: "flex",
					gap: 2,
				}}>
				{userAccessList?.indexOf("DynamicDjango.change_city") !==
					-1 && (
					<LuPencil
						style={{ cursor: "pointer", color: "#fc6f03" }}
						onClick={() => {
							dispatch(getCityById({ id: row?.id }));
							openModal(true);
							dispatch(setMasterEditId(row?.id));
						}}
					/>
				)}
				{userAccessList?.indexOf("DynamicDjango.delete_city") !==
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

		return createData(index, row.code, row.name, row.state?.name, actions);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getCities({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getCities({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getCities({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getCities({
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext?.setTitle("City");
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
			getCities({
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
				postfix={"City"}
				pageTitle="City"
				goBack={true}
				addModelTile={
					userAccessList?.indexOf("DynamicDjango.add_city") !== -1
						? "Add City"
						: undefined
				}
				modalVisible={true}
				setIsModalVisible={openModal}
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
					count={cityCount}
					columns={columns}
					rows={rows}
					loading={loading}
					page={pageParams.page}
					pageSize={pageParams.page_size}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</MasterPageTitle>

			<AddCityMasters
				modal={open}
				closeModal={handleClose}
				mastersName="City"
				edit_Id={masterEditId}
				mastersValue={masterValue}
			/>
		</>
	);
};

export default City;
