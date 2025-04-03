import React, {
	ChangeEvent,
	Dispatch,
	useState,
	useEffect,
	SyntheticEvent,
	useMemo,
} from "react";
("@mui/material/TablePagination/TablePaginationActions");
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	deleteDepartment,
	editDepartments,
	getDepartments,
	getDepartmentsById,
} from "@src/store/masters/Department/department.action";
import {
	departmentSelector,
	setSearchValue,
	isModelVisible,
	setMasterValue,
	useDeparmentSelector,
} from "@src/store/masters/Department/department.slice";
import TableComponent from "@src/components/TableComponenet";
import { masterSelector } from "@src/store/masters/master.slice";
import { Link, useOutletContext } from "react-router-dom";
import { LuEye, LuPencil, LuSearch, LuTrash2 } from "react-icons/lu";
import TopComponent from "@src/pages/settings/TopComponent";
import {
	Box,
	Button,
	FormControlLabel,
	Grid2 as Grid,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	InputLabel,
	Stack,
	Popover,
	Typography,
} from "@mui/material";
import MasterPageTitle from "@src/components/MasterPageTitle";
import PageTitle from "@src/components/PageTitle";
import SearchIcon from "@mui/icons-material/Search";
import { selectLayoutTheme } from "@src/store/customise/customise";
import AddDepartmentMasters from "./add.department";
import { systemSelector } from "@src/store/system/system.slice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniLocation } from "@src/store/mini/mini.Action";
import { clearMiniLocation } from "@src/store/mini/mini.Slice";

const Departments = () => {
	const dispatch = useAppDispatch();
	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();

	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const deleteOpen = Boolean(anchorEl);
	const [currentId, setCurrentId] = useState(null);

	const {
		departments: { departmentsList, pageParams, loading, departmentsCount },
		mini: { miniLocationList, miniLocationLoading, miniLocationParams },
		system: { userAccessList },
	} = useDeparmentSelector();

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
			deleteDepartment({
				id: deleteId,
				clearDataFn: () => {
					handleDeleteClose();
				},
				navigate: () => {},
				pageParams: {
					...pageParams,
					search: "",
					page: 1,
					page_size: 10,
				},
			})
		);
	};

	const rows = departmentsList.map((row, key) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const actions = (
			<Box
				justifyContent="center"
				alignItems="center"
				sx={{
					display: "flex",
					gap: 2,
				}}>
				{userAccessList?.indexOf("DynamicDjango.change_department") !==
					-1 && (
					<LuPencil
						style={{ cursor: "pointer", color: "#fc6f03" }}
						onClick={() => {
							dispatch(getDepartmentsById({ id: row?.id }));
							openModal(true);
						}}
					/>
				)}
				{userAccessList?.indexOf("DynamicDjango.delete_department") !==
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
				{/* <Link to={`/pages/masters/departments/` + row.id}>
					<LuEye style={{ cursor: "pointer", color: "#fc6f03" }} />
				</Link> */}
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
			getDepartments({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getDepartments({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getDepartments({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getDepartments({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext?.setTitle("Departments");
		outletContext?.setSubtitle("Masters");
	}, []);

	const openModal = (value: boolean) => {
		dispatch(isModelVisible(value));
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value;
		dispatch(
			getDepartments({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const addModal = useMemo(() => {
		return <AddDepartmentMasters />;
	}, [open]);

	return (
		<>
			{addModal}
			<MasterPageTitle
				prefix={"DynamicDjango"}
				postfix={"Department"}
				pageTitle="Department"
				goBack={true}
				addModelTile={
					userAccessList?.indexOf("DynamicDjango.add_department") !==
					-1
						? "Add Department"
						: undefined
				}
				modalVisible={true}
				setIsModalVisible={openModal}
				pageText={""}>
				<form action="" onSubmit={handleSubmit(handleSearch)}>
					<Grid container my={2} spacing={2}>
						<Grid>
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
						{/* <Grid size={{ xs: 12, md: 4 }}>
							<Stack
								direction="row"
								flex={1}
								gap={1}
								alignItems={"center"}>
								<InputLabel
									sx={{
										".MuiInputLabel-asterisk": {
											color: "red",
										},
									}}
									id={"location"}
									style={{
										fontWeight: "medium",
										marginBottom: "7px",
									}}>
									Location:
								</InputLabel>
								<Stack mt={-1} flex={1}>
									<SelectComponent
										name="location"
										label=""
										control={control}
										rules={{ required: true }}
										options={miniLocationList?.map(
											(e: {
												id: string | number;
												name: string;
											}) => ({
												id: e.id,
												name: e.name,
											})
										)}
										loading={miniLocationLoading}
										selectParams={{
											page: miniLocationParams.page,
											page_size:
												miniLocationParams.page_size,
											search: miniLocationParams.search,
											no_of_pages:
												miniLocationParams.no_of_pages,
										}}
										hasMore={
											miniLocationParams.page <
											miniLocationParams.no_of_pages
										}
										fetchapi={getMiniLocation}
										clearData={clearMiniLocation}
										onChange={(data) => {
											dispatch(
												getDepartments({
													...pageParams,
													page: 1,
													page_size: 10,
													location: data?.value,
												})
											);
										}}
									/>
								</Stack>
							</Stack>
						</Grid> */}
					</Grid>
				</form>
				<TableComponent
					count={departmentsCount}
					columns={columns}
					rows={rows}
					loading={loading}
					page={pageParams.page}
					pageSize={pageParams.page_size}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</MasterPageTitle>
		</>
	);
};

export default Departments;
