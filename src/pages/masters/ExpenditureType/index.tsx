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
	deleteExpenditureType,
	editExpenditureType,
	getExpenditureType,
	getExpenditureTypeById,
} from "@src/store/masters/ExpenditureType/expenditure.action";
import {
	selectExpenditureType,
	isModelVisible,
	setMasterValue,
	setMasterEditId,
	setSelectedData,
} from "@src/store/masters/ExpenditureType/expenditure.slice";
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
	Tooltip,
	Zoom,
	IconButton,
} from "@mui/material";
import MasterPageTitle from "@src/components/MasterPageTitle";
import PageTitle from "@src/components/PageTitle";
import SearchIcon from "@mui/icons-material/Search";
import { selectLayoutTheme } from "@src/store/customise/customise";
import AddExpenditureTypeMasters from "./add.expenditureType";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import moment from "moment";

const ExpenditureType = () => {
	const dispatch = useAppDispatch();
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
		expenditureType: {
			expenditureTypeList,
			pageParams,
			loading,
			expenditureTypeCount,
			model,
		},
		system: { userAccessList },
	} = useAppSelector((state) => selectExpenditureType(state));

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
			deleteExpenditureType({
				id: deleteId,
				clearDataFn: () => {
					handleDeleteClose();
				},
				pageParams,
			})
		);
	};
	const rows = expenditureTypeList?.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const actions = (
			<Box
				sx={{
					display: "flex",
					gap: 2,
					justifyContent: "center",
				}}>
				{userAccessList?.indexOf("Masters.change_stage") !== -1 && (
					<Tooltip TransitionComponent={Zoom} title="Edit Stage">
						<IconButton
							onClick={() => {
								dispatch(setSelectedData(row));
								dispatch(isModelVisible(true));
							}}>
							<LuPencil
								style={{
									cursor: "pointer",
									color: "#fc6f03",
									fontSize: 16,
								}}
							/>
						</IconButton>
					</Tooltip>
				)}
				{userAccessList?.indexOf("Masters.delete_stage") !== -1 && (
					<>
						<Tooltip
							TransitionComponent={Zoom}
							title="Delete Stage">
							<IconButton
								onClick={(e) => handleClick(e, row?.id)}>
								<LuTrash2
									style={{
										cursor: "pointer",
										color: "#fc6f03",
										fontSize: 16,
									}}
								/>
							</IconButton>
						</Tooltip>
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

		return createData(index, row?.code, row?.name, actions);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getExpenditureType({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getExpenditureType({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getExpenditureType({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getExpenditureType({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext?.setTitle("ExpenditureType");
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
			getExpenditureType({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleClose = () => {
		dispatch(isModelVisible(false));
	};
	return (
		<>
			<MasterPageTitle
				prefix={"Masters"}
				postfix={"stage"}
				pageTitle="ExpenditureType"
				goBack={true}
				addModelTile={
					userAccessList?.indexOf("Masters.add_stage") !== -1
						? "Add ExpenditureType"
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
						count={expenditureTypeCount}
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
			<AddExpenditureTypeMasters modal={model} closeModal={handleClose} />
		</>
	);
};

export default ExpenditureType;
