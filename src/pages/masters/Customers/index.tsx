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
	deleteCustomers,
	editCustomers,
	getCustomers,
	getCustomersById,
} from "@src/store/masters/Customers/customer.action";
import {
	customersSelector,
	setSearchValue,
	isModelVisible,
	setMasterEditId,
	setSelectedData,
	setIsFilterOpen,
} from "@src/store/masters/Customers/customer.slice";
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
import AddCustomerMasters from "./add.customers";
import Filters from "./filters";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import ReadMore from "@src/components/ReadMoreText";

const Customers = () => {
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
		customers: {
			customersList,
			pageParams,
			loading,
			customersCount,
			searchValue,
			masterValue,
			selectedData,
			masterEditId,
			isFilterOpen,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			customers: customersSelector(state),
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
			title: "Concerned Officer Name",
			width: 100,
		},
		{
			title: "Mobile",
			width: 100,
		},
		{
			title: "Email",
			width: 100,
		},
		{
			title: "Address",
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
			title: "Remarks",
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
		concerned_officer_name: string,
		mobile: string,
		email: string,
		address: string,
		country: string,
		state: string,
		city: string,
		remarks: React.JSX.Element,
		actions: React.JSX.Element
	) {
		return {
			index,
			code,
			name,
			concerned_officer_name,
			mobile,
			email,
			address,
			country,
			state,
			city,
			remarks,
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
			deleteCustomers({
				id: deleteId,
				params: pageParams,
				clearDataFn: () => { },
				navigate: (path: string) => { },
			})
		);
		dispatch(
			getCustomers({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		handleDeleteClose();
	};
	const rows = customersList.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const remarks = <ReadMore text={row?.remarks || ""} maxLength={35} />;

		const actions = (
			<Box
				justifyContent="center"
				alignItems="center"
				sx={{
					display: "flex",
					gap: 2,
				}}>
				{userAccessList?.indexOf("Masters.change_customer") !== -1 && (
					<LuPencil
						style={{ cursor: "pointer", color: "#fc6f03" }}
						onClick={() => {
							dispatch(getCustomersById({ id: row?.id }));
							openModal(true);
							dispatch(setMasterEditId(row?.id));
						}}
					/>
				)}
				{userAccessList?.indexOf("Masters.delete_customer") !== -1 && (
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
			row.code || "",
			row.name || "",
			row?.concerned_officer_name || "",
			row.mobile || "",
			row.email || "",
			row.address || "",
			row.country?.name || "",
			row.state?.name || "",
			row.city?.name || "",
			remarks,
			actions
		);
	});
	const handleFilter = (open: boolean) => {
		dispatch(setIsFilterOpen(open));
	};
	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getCustomers({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getCustomers({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getCustomers({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getCustomers({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext?.setTitle("Customers");
		outletContext?.setSubtitle("Masters");
		reset({ search: "" });
	}, []);

	const openModal = (value: boolean) => {
		dispatch(setMasterEditId(0));
		dispatch(setSelectedData({}));
		setOpen(value);
		dispatch(isModelVisible(value));
	};

	const handleClose = () => {
		setOpen(false);
		dispatch(setSelectedData({}));
	};
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getCustomers({
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
				postfix={"Customers"}
				pageTitle="Customers"
				goBack={true}
				addModelTile={
					userAccessList?.indexOf("Masters.add_customer") !== -1
						? "Add Customers"
						: undefined
				}
				modalVisible={true}
				setIsModalVisible={openModal}
				pageText={""}
				showFilterButton={true}
				openFilter={handleFilter}
				filteredData={pageParams}
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
					<Filters
						openFilter={isFilterOpen}
						handleFilter={handleFilter}
					/>

					<TableComponent
						count={customersCount}
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

			<AddCustomerMasters
				modal={open}
				closeModal={handleClose}
				mastersName="Customers"
				editId={masterEditId}
				mastersValue={masterValue}
				vendordata={selectedData}
			/>
		</>
	);
};

export default Customers;
