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
	deleteBaseunit,
	editBaseunit,
	getBaseunit,
	getBaseunitById,
} from "@src/store/masters/BaseUnit/baseunit.action";
import {
	baseunitSelector,
	setSearchValue,
	isModelVisible,
	setMasterEditId,
	setSelectedData,
} from "@src/store/masters/BaseUnit/baseunit.slice";
import { systemSelector } from "@src/store/system/system.slice";
import TableComponent from "@src/components/TableComponenet";
import { Link, useOutletContext } from "react-router-dom";
import { LuDelete, LuEye, LuPencil, LuSearch, LuTrash2 } from "react-icons/lu";
import TopComponent from "@src/pages/settings/TopComponent";
import { Button, DialogContentText, Grid } from "@mui/material";
import {
	Box,
	FormControlLabel,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	Popover,
	Typography,
} from "@mui/material";
import MasterPageTitle from "@src/components/MasterPageTitle";
import PageTitle from "@src/components/PageTitle";
import SearchIcon from "@mui/icons-material/Search";
import AddBaseUnitMasters from "./add.baseunit";
import { RiErrorWarningLine } from "react-icons/ri";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

const BaseUnit = () => {
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
		baseunit: {
			baseunitList,
			pageParams,
			loading,
			baseunitCount,
			searchValue,
			masterValue,
			masterEditId,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			baseunit: baseunitSelector(state),
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
			title: "Actions",
			width: 100,
		},
	];

	function createData(
		index: number,
		code: string,
		name: string,
		actions: React.JSX.Element
	) {
		return {
			index,
			code,
			name,
			actions,
		};
	}

	const handleClick = (event: any, id: any) => {
		setCurrentId(id);
		setAnchorEl(event.currentTarget);
	};
	const handleDeleteClose = () => {
		setAnchorEl(null);
	};
	const confirmDelete = (deleteId: string) => {
		dispatch(
			deleteBaseunit({
				id: deleteId,
				clearDataFn: () => {},
				navigate: (path: string) => {},
			})
		);
		dispatch(
			getBaseunit({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		handleDeleteClose();
	};

	const rows = baseunitList?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const actions = (
			<Box
				justifyContent="start"
				alignItems="center"
				sx={{
					display: "flex",
					gap: 2,
				}}>
				{userAccessList?.indexOf("Masters.change_uom") !== -1 && (
					<LuPencil
						style={{ cursor: "pointer", color: "#fc6f03" }}
						onClick={() => {
							dispatch(getBaseunitById({ id: row?.id }));
							openModal(true);
							dispatch(setMasterEditId(row?.id));
						}}
					/>
				)}
				{userAccessList?.indexOf("Masters.delete_uom") !== -1 && (
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
									onClick={() =>
										confirmDelete(String(currentId))
									}
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

		return createData(index, row.code, row.name, actions);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getBaseunit({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getBaseunit({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getBaseunit({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getBaseunit({
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext?.setTitle("Baseunit");
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
	let searchSchema = object({
		search: string(),
	});
	const { control, handleSubmit, register, reset } = useForm({
		resolver: yupResolver(searchSchema),
		values: {
			search: pageParams.search,
		},
	});
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getBaseunit({
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
				postfix={"uom"}
				pageTitle="UOM"
				goBack={true}
				addModelTile={
					userAccessList?.indexOf("Masters.add_uom") !== -1
						? "Add UOM"
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
						count={baseunitCount}
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
			<AddBaseUnitMasters
				modal={open}
				closeModal={handleClose}
				mastersName="UOM"
				editId={masterEditId}
				mastersValue={masterValue}
			/>
		</>
	);
};

export default BaseUnit;
