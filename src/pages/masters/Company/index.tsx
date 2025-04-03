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
	deleteCompany,
	editCompany,
	getCompany,
	getCompanyById,
} from "@src/store/masters/Company/company.action";
import {
	companySelector,
	setSearchValue,
	isModelVisible,
	setMasterEditId,
	setSelectedData,
} from "@src/store/masters/Company/company.slice";
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
import AddCompanyMasters from "./add.company";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

const Company = () => {
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
		company: {
			companyList,
			pageParams,
			loading,
			companyCount,
			searchValue,
			masterValue,
			selectedData,
			masterEditId,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			company: companySelector(state),
			system: systemSelector(state),
		};
	});

	const columns = [
		{
			title: "S.No",
			width: 10,
		},
		{
			title: "Code",
			width: 10,
		},
		{
			title: "Name",
			width: 10,
		},
		{
			title: "Description",
			width: 10,
		},
		// {
		// 	title: "Mobile",
		// 	width: 100,
		// },
		// {
		// 	title: "Email",
		// 	width: 100,
		// },
		// {
		// 	title: "Address",
		// 	width: 100,
		// },
		// {
		// 	title: "Pincode",
		// 	width: 100,
		// },
		// {
		// 	title: "Gst No",
		// 	width: 100,
		// },
		{
			title: "Actions",
			width: 10,
		},
	];

	function createData(
		index: number,
		code?: string,
		name?: string,
		reamrks?: string,
		// mobile?: string,
		// email?: string,
		// address?: string,
		// pincode?: string,
		// gstno?: string,
		actions?: React.JSX.Element
	) {
		return {
			index,
			code,
			name,
			reamrks,
			// mobile,
			// email,
			// address,
			// pincode,
			// gstno,
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
			deleteCompany({
				id: deleteId,
				clearDataFn: () => {},
				navigate: (path: string) => {},
			})
		);
		dispatch(
			getCompany({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		handleDeleteClose();
	};
	const rows = companyList.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const actions = (
			<Box
				justifyContent="center"
				alignItems="center"
				sx={{
					display: "flex",
					gap: 2,
				}}>
				{userAccessList?.indexOf("DynamicDjango.change_company") !==
					-1 && (
					<LuPencil
						style={{ cursor: "pointer", color: "#fc6f03" }}
						onClick={() => {
							dispatch(getCompanyById({ id: row?.id }));
							openModal(true);
							dispatch(setMasterEditId(row?.id));
						}}
					/>
				)}
				{userAccessList?.indexOf("DynamicDjango.delete_company") !==
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
			row.name,
			row.remarks,
			// row.mobile,
			// row.email,
			// row.address,
			// row.pincode,
			// row?.gstno,
			actions
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getCompany({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getCompany({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getCompany({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getCompany({
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext?.setTitle("Company");
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
			getCompany({
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
				postfix={"company"}
				pageTitle="Company"
				goBack={true}
				addModelTile={
					userAccessList?.indexOf("DynamicDjango.add_company") !== -1
						? "Add Company"
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
									<InputAdornment position="end">
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
					count={companyCount}
					columns={columns}
					rows={rows}
					loading={loading}
					page={pageParams.page}
					pageSize={pageParams.page_size}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</MasterPageTitle>
			<AddCompanyMasters
				modal={open}
				closeModal={handleClose}
				mastersName="Company"
				editId={masterEditId}
				mastersValue={masterValue}
				companyData={selectedData}
			/>
		</>
	);
};

export default Company;
