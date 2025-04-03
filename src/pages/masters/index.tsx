import PageTitle from "@src/components/PageTitle";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import {
	Card,
	CardContent,
	TextField,
	InputAdornment,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Grid2 as Grid,
	Paper,
	Box,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	ListItemText,
	Modal,
	useTheme,
} from "@mui/material";
import {
	getMenuItems,
	postRecentActivity,
} from "@src/store/system/system.action";
import { useDispatch } from "react-redux";
import { selectLayoutTheme } from "@src/store/customise/customise";
// import { menuItemSearch } from "@src/store/masters/master.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import AddIcon from "@mui/icons-material/Add";
import { systemSelector } from "@src/store/system/system.slice";
import { useNavigate } from "react-router-dom";
import AddMakeMasters from "./Make/add.make";
import AddBaseUnitMasters from "./BaseUnit/add.baseunit";
import AddMocMasters from "./Moc/add.moc";
import AddCustomerMasters from "./Customers/add.customers";
import AddVendorMasters from "./Vendors/add.vendors";
import AddLocationMasters from "./Locations/add.location";
import { masterSelector } from "@src/store/masters/master.slice";
import { makeSelector } from "@src/store/masters/Make/make.slice";
import AddItem from "./Item/add.item";
import AddCityMasters from "./City/add.city";
import AddTaxMasters from "./Tax/add.tax";
import AddDocumentMasters from "./Document/add.document";
import AddCategoryMasters from "./Category/add.category";
import AddCompanyMasters from "./Company/add.company";
import AddCountryMasters from "./Country/add.country";
import AddStateMasters from "./State/add.state";
import AddBidNatureMasters from "./BidNature/add.bidnature";
import AddBatchsMasters from "./Batch/add.batch";
import AddBatchMasters from "./Batch/add.batch";
import AddStagesMasters from "./Stages/add.stage";
import AddWarehousesMasters from "./Warehouse/add.warehouse";
import AddExpenditureTypeMasters from "./ExpenditureType/add.expenditureType";
import AddDepartmentsMasters from "./Department/add.department";
import { isModelVisible as openDeparmentModal } from "@src/store/masters/Department/department.slice";
import { isModelVisible as openExpensesModal } from "@src/store/masters/Expenses/expenses.slice";
import AddExpensesMasters from "./Expenses/add.expenses";
import AddInspectionAgenciesMasters from "./InspectionAgencies/add.inspectionAgencies";

import * as Icons from "@ant-design/icons";
import { IconBaseProps } from "@ant-design/icons/lib/components/Icon";
import { MenuItemTypes } from "@src/common/menu-items";
import { isModelVisible as openVendorItemsAddModal } from "@src/store/masters/VendorItems/vendorItems.slice";
import { isModelVisible as openClientLocationAddModal } from "@src/store/masters/ClientLocations/cliantlocation.slice";
import AddVendorItemMasters from "./VendorItems/add.vendorItems";
import AddClientLocationMasters from "./ClientLocations/add.clientlocation";

const Masters = () => {
	const [open, setOpen] = useState(false);
	const [masterName, setMasterName] = useState("");
	const [menuItems, setMenuItems] = useState<MenuItemTypes[]>([]);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const theme = useTheme();
	// const { masterMenuItemsList } = useAppSelector((state) =>
	//     systemSelector(state)
	// );

	console.log(menuItems);
	const {
		make: { masterValue },
		system: { masterMenuItemsList },
	} = useAppSelector((state) => {
		return {
			masters: masterSelector(state),
			system: systemSelector(state),
			make: makeSelector(state),
		};
	});

	useEffect(() => {
		dispatch(
			getMenuItems({
				code: "MENU0003",
				from: "masters",
			})
		);
	}, []);

	useEffect(() => {
		setMenuItems(masterMenuItemsList as MenuItemTypes[]);
	}, [masterMenuItemsList]);

	const handleSearch = (searchWord: any) => {
		const newFilter = masterMenuItemsList?.filter((menu: any) => {
			return menu.label
				.toLowerCase()
				.includes(searchWord.target.value.toLowerCase());
		});
		if (searchWord === "") {
			setMenuItems(masterMenuItemsList as MenuItemTypes[]);
		} else {
			setMenuItems(newFilter as MenuItemTypes[]);
		}
	};

	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: "#fff",
		...theme.typography.body2,
		padding: theme.spacing(2),
		// width: "210px",
		height: "82px",
		textAlign: "left",
		verticalAlign: "start",
		borderRadius: "10px",
		cursor: "pointer",
		color: theme.palette.text.secondary,
		...theme.applyStyles("dark", {
			backgroundColor: "#1A2027",
		}),
	}));
	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		boxShadow: 24,
		p: 4,
	};
	const handleNavigation = (path: any) => {
		navigate(path); // Navigate to the specified path
	};

	const handleModal = (value: any) => {
		setMasterName(value);
		if (value == "Item") {
			navigate("/pages/masters/item/add");
		} else {
			setOpen(true);
		}
	};
	const handleClose = () => {
		setOpen(false);
	};
	return (
		<Box
			sx={{
				display: "grid",
				gap: 1,
			}}>
			<PageTitle title="Masters" />
			{/* <Card style={{ width: "700px", marginBottom: "20px" }}>
				<CardContent style={{ padding: "0px", borderRadius: "10px" }}> */}
			<TextField
				variant="outlined"
				onChange={handleSearch}
				placeholder="Search..."
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon style={{ color: "#ddd" }} />
						</InputAdornment>
					),
					sx: {
						mt: -2,
						mb: 2,
						borderRadius: "10px",
						backgroundColor: theme?.palette?.background?.paper,
						"& fieldset": {
							borderColor: "#f0f0f0",
						},
						"&:hover fieldset": {
							borderColor: "#ddd",
						},
						"&.Mui-focused fieldset": {
							borderColor: "#ccc",
						},
					},
				}}
				fullWidth
			/>
			{/* </CardContent>
			</Card> */}
			{menuItems?.length != 0 ? (
				<Grid container spacing={2} style={{ marginLeft: "0px" }}>
					{menuItems?.map((option: MenuItemTypes, index) => {
						const IconComponent = Icons[
							option.icon as keyof typeof Icons
						] as React.ComponentType<IconBaseProps> | undefined;
						return (
							<>
								<Grid
									size={{ xs: 12, md: 4, lg: 3, xl: 2 }}
									sx={{
										position: "relative",
									}}>
									<Item
										onClick={(e) => {
											e.preventDefault();
											dispatch(
												postRecentActivity({
													menuitem_id:
														option?.key || "",
												})
											);

											handleNavigation(option.url);
										}}>
										<Box
											display="flex"
											gap={1.6}
											marginTop={{
												xs: 0,
												md: -0.6,
												lg: -0.4,
												xl: -0.2,
											}}
											alignItems={"start"}>
											{IconComponent ? (
												<IconComponent
													style={{ fontSize: 16 }}
												/>
											) : (
												<Icons.QuestionOutlined
													style={{ fontSize: 16 }}
												/> // Fallback if icon is not found
											)}
											<Box
												display={"flex"}
												flexDirection={"column"}
												gap={1}>
												<Typography
													sx={{
														color: "text.secondary",
														fontSize: "14px",
														fontWeight: "bold",
														flexGrow: 1,
													}}
													variant="h6">
													{option?.label}
												</Typography>
												<Box>
													<Typography variant="body2">
														{(
															option?.description ||
															""
														)?.length > 50
															? `${(option.description || "").slice(0, 35)}...`
															: option?.description}
													</Typography>
												</Box>
											</Box>

											{/* <MenuIcon
												onClick={() => {
													handleNavigation(
														option.url
													);
												}}
											/> */}
										</Box>
									</Item>
									<AddIcon
										onClick={(e) => {
											e.preventDefault();
											switch (option.url) {
												case "/pages/masters/departments":
													dispatch(
														openDeparmentModal(true)
													);
													break;
												case "/pages/masters/expenses":
													dispatch(
														openExpensesModal(true)
													);
													break;
												case "/pages/masters/accounts":
													navigate(
														"/pages/masters/account/add/0"
													);
													break;
												case "/pages/masters/vendor_items":
													dispatch(
														openVendorItemsAddModal(
															true
														)
													);
													break;
												case "/pages/masters/client_location":
													dispatch(
														openClientLocationAddModal(
															true
														)
													);
													break;

												default:
													break;
											}

											handleModal(option?.label);
										}}
										style={{
											marginRight: "10px",
											position: "absolute",
											top: "12px",
											right: "20px",
										}}
									/>
								</Grid>
							</>
						);
					})}
				</Grid>
			) : (
				""
			)}
			{masterName == "Make" && (
				<AddMakeMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "MOC" && (
				<AddMocMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "UOM" && (
				<AddBaseUnitMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "Customers" && (
				<AddCustomerMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "Vendors" && (
				<AddVendorMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "Location" && (
				<AddLocationMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "City" && (
				<AddCityMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "Tax" && (
				<AddTaxMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "Document" && (
				<AddDocumentMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "Category" && (
				<AddCategoryMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "Company" && (
				<AddCompanyMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "Country" && (
				<AddCountryMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "State" && (
				<AddStateMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "Source Portal" && (
				<AddBidNatureMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "Inspection Agencies" && (
				<AddInspectionAgenciesMasters
					modal={open}
					closeModal={handleClose}
					mastersName={masterName}
					mastersValue={masterValue}
				/>
			)}
			{masterName == "Stages" && (
				<AddStagesMasters modal={open} closeModal={handleClose} />
			)}
			{masterName == "Warehouse" && (
				<AddWarehousesMasters modal={open} closeModal={handleClose} />
			)}
			{/* {masterName == "Batchs" && (
				<AddBatchMasters modal={open} closeModal={handleClose} />
			)} */}
			{masterName == "Item" && <AddItem />}
			{masterName == "Expenditure Type" && (
				<AddExpenditureTypeMasters
					modal={open}
					closeModal={handleClose}
				/>
			)}

			<AddDepartmentsMasters />
			<AddExpensesMasters />
			<AddVendorItemMasters />
			<AddClientLocationMasters />
		</Box>
	);
};

export default Masters;
