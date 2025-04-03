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
	deleteVendorItem,
	editVendorItem,
	getVendorItem,
	getVendorItemById,
} from "@src/store/masters/VendorItems/vendorItems.action";
import {
	vendorItemSelector,
	setSearchValue,
	isModelVisible,
	setMasterValue,
	setMasterEditId,
	setSelectedData,
} from "@src/store/masters/VendorItems/vendorItems.slice";
import { systemSelector } from "@src/store/system/system.slice";
import TableComponent from "@src/components/TableComponenet";
import { Link, useOutletContext } from "react-router-dom";
import { LuEye, LuPencil, LuSearch, LuTrash2 } from "react-icons/lu";
import {
	Box,
	Button,
	TextField,
	InputAdornment,
	Popover,
	Typography,
	Grid,
} from "@mui/material";
import MasterPageTitle from "@src/components/MasterPageTitle";
import AddMasters from "./add.vendorItems";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import AddVendorItemMasters from "./add.vendorItems";
import { VendorItem as VendorItemType } from "@src/store/masters/VendorItems/vendorItems.types";

const VendorItem = () => {
	const dispatch = useAppDispatch();
	const [open, setOpen] = useState(false);
	const [editId, setEditId] = useState("");
	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();

	const {
		vendorItem: {
			vendorItemList,
			pageParams,
			loading,
			vendorItemCount,
			searchValue,
			masterValue,
			masterEditId,
		},
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			vendorItem: vendorItemSelector(state),
			system: systemSelector(state),
		};
	});

	const [anchorEl, setAnchorEl] = useState(null);
	const deleteOpen = Boolean(anchorEl);
	const [currentId, setCurrentId] = useState(null);

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
			title: "Item",
			width: 100,
		},
		{
			title: "Vendor",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	function createData(
		index: number,
		code: string,
		item: string,
		vendor: string,
		actions: React.JSX.Element
	) {
		return {
			index,
			code,
			item,
			vendor,
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
			deleteVendorItem({
				id: deleteId,
				clearDataFn: () => {},
				navigate: (path: string) => {},
			})
		);
		dispatch(
			getVendorItem({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		handleDeleteClose();
	};

	const rows = vendorItemList.map((row: VendorItemType, key: number) => {
		const index = (pageParams.page - 1) * pageParams.page_size + (key + 1);

		const actions = (
			<Box
				justifyContent="start"
				alignItems="center"
				sx={{
					display: "flex",
					gap: 2,
				}}>
				{userAccessList?.indexOf("Masters.change_vendoritem") !==
					-1 && (
					<LuPencil
						style={{ cursor: "pointer", color: "#fc6f03" }}
						onClick={() => {
							dispatch(getVendorItemById({ id: row?.id || "" }));
							openModal(true);
							dispatch(setMasterEditId(row?.id));
						}}
					/>
				)}
				{userAccessList?.indexOf("Masters.delete_vendoritem") !==
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
			row.code || "",
			row?.item?.name || "",
			row?.vendor?.name || "",
			actions
		);
	});

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getVendorItem({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getVendorItem({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getVendorItem({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	useEffect(() => {
		dispatch(
			getVendorItem({
				search: "",
				page: 1,
				page_size: 10,
			})
		);
		outletContext?.setTitle("VendorItem");
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
			getVendorItem({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};
	return (
		<>
			{/* <Card sx={{ marginBottom: "20px", marginTop: "15px" }}> */}
			<MasterPageTitle
				prefix={"Masters"}
				postfix={"vendoritem"}
				pageTitle="Vendor Item"
				goBack={true}
				addModelTile={
					userAccessList?.indexOf("Masters.add_vendoritem") !== -1
						? "Add Vendor Item"
						: undefined
				}
				modalVisible={true}
				setIsModalVisible={openModal}
				pageText={""}>
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
					count={vendorItemCount}
					columns={columns}
					rows={rows}
					loading={loading}
					page={pageParams.page}
					pageSize={pageParams.page_size}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</MasterPageTitle>
			{/* <CardContent
					style={{
						padding: "10px",
						borderRadius: "10px",
					}}></CardContent>
			</Card> */}
			<AddVendorItemMasters />
		</>
	);
};

export default VendorItem;
